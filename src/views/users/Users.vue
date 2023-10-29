<template>
  <div class="content-wrapper">
    <div class="content-header row">
      <div class="content-header-left col-md-9 col-12 mb-2">
        <BreadCrumb :showHeader="true" />
      </div>
    </div>

    <div class="content-body">
      <div class="card">
        <div class="card-header border-bottom row">
          <h5 class="card-title mb-2">Users</h5>

          <div class="d-flex align-items-center row pb-2 gap-3 gap-md-0">
            <div class="col-md-4">
              <label class="form-label">Filter Berdasarkan Tipe Role :</label>

              <select
                id="role_type_list"
                name="role_type_list"
                class="form-select w-100 text-capitalize"
                v-model="role_type"
                :disabled="list_role_type.loading"
              >
                <option value="">
                  {{
                    list_role_type.loading ? "Loading..." : "Semua Tipe Role"
                  }}
                </option>
                <option
                  v-for="tipe in list_role_type.data"
                  :value="`${tipe?.id}_${tipe?.role_type}`"
                  :key="`${tipe?.id}-${tipe?.role_type}`"
                >
                  {{ tipe.role }} - {{ tipe?.role_types?.role_type }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="card-body">
          <div
            class="row my-2 d-flex justify-content-center align-items-center"
          >
            <div class="col-md-3">
              <div
                class="d-flex justify-content-md-start justify-content-sm-center align-items-md-start align-items-sm-center"
              >
                <DropdownLimit v-model="params.limit" />
              </div>
            </div>
            <div class="col-md-9">
              <div
                class="d-flex flex-sm-column flex-md-row align-items-center justify-content-md-end my-sm-1 my-md-0"
              >
                <div class="mb-md-0">
                  <InputSearch
                    type="search"
                    class="form-control"
                    placeholder="Cari Users"
                    v-model="params.search"
                  />
                </div>

                <div class="dt-buttons ms-sm-2">
                  <BaseButton
                    @click="handleAddUsers"
                    title="Tambah Users"
                    :access="['manusersuseradd']"
                  >
                    <template name="icon-left">
                      <tabler-icon icon="PlusIcon"></tabler-icon>
                    </template>
                  </BaseButton>
                </div>

                <!-- 

                Each BaseButton for Each Action

                <div class="dt-buttons ms-sm-2">
                  <BaseButton
                    @click="handleInviteUsers"
                    title="Undang Users"
                    :access="['manusersuseradd']"
                  >
                  </BaseButton>
                </div>

                <div class="dt-buttons ms-sm-2">
                  <BaseButton
                    @click="handleAddUsers"
                    :access="['manusersuseradd']"
                    title="Tambah Users"
                  >
                    <template name="icon-left">
                      <tabler-icon icon="PlusIcon"></tabler-icon>
                    </template>
                  </BaseButton>
                </div>
                 -->
              </div>
            </div>
          </div>

          <div class="table-responsive mb-2">
            <v-table
              class="table table-hover"
              :data="listUsers"
              :pageSize="params.limit"
            >
              <thead class="table-light" slot="head">
                <tr>
                  <th>No</th>
                  <v-th sortKey="username">Username</v-th>
                  <v-th sortKey="name">Nama</v-th>
                  <v-th sortKey="email">Email</v-th>
                  <v-th sortKey="status" class="text-center">Status</v-th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody slot="body" slot-scope="{ displayData }">
                <tr v-if="isLoading">
                  <td colspan="6" class="text-center">Loading...</td>
                </tr>

                <tr
                  v-else-if="!isLoading && displayData.length"
                  v-for="(item, index) in displayData"
                  :key="item.id"
                >
                  <td>{{ offset + (index + 1) }}</td>
                  <td >{{ item?.username || "-" }}</td>
                  <td>{{ item?.name || "-" }}</td>
                  <td>{{ item?.email || "-" }}</td>
                  <td class="text-center">
                    <span
                      class="badge rounded-pill"
                      :class="
                        statusBadge({
                          invitation: item?.invitation,
                          status: item?.status,
                          verified: item?.verified,
                        })
                      "
                    >
                      {{
                        statusUsers({
                          invitation: item?.invitation,
                          status: item?.status,
                          verified: item?.verified,
                        })
                      }}
                    </span>
                  </td>
                  <td>
                    <div class="d-flex align-items-center col-actions">
                      <BaseButton
                        v-if="item?.invitation == 'invited'"
                        @click="
                          handleResendVerify({
                            id: item?.id,
                            email: item?.email,
                          })
                        "
                        :access="['manusersuseredit']"
                        className="btn btn-icon me-1"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        data-bs-original-title="Kirim Ulang Undangan"
                      >
                        <tabler-icon class="me-25" icon="SendIcon" size="24" />
                      </BaseButton>

                      <BaseButton
                        v-if="
                          statusUsers({
                            invitation: item?.invitation,
                            status: item?.status,
                          }) == 'Aktif'
                        "
                        :access="['manusersuseredit']"
                        @click="handleEditUsers({ id: item?.id })"
                        className="btn btn-icon me-1"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        data-bs-original-title="Edit"
                      >
                        <tabler-icon class="me-25" icon="EditIcon" size="24" />
                      </BaseButton>

                      <!-- Delete Users -->
                      <BaseButton
                        @click="
                          handleDeleteUsers({
                            id: item?.id,
                            title: item?.username,
                          })
                        "
                        :access="['manusersuserdelete']"
                        className="btn btn-icon me-1"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        data-bs-original-title="Delete"
                      >
                        <tabler-icon class="me-25" icon="TrashIcon" size="24" />
                      </BaseButton>
                    </div>
                  </td>
                </tr>

                <tr v-else>
                  <td colspan="6" class="text-center">
                    Tidak ada Users ditemukan
                  </td>
                </tr>
              </tbody>
            </v-table>
          </div>

          <CustomPagination
            v-if="!isLoading"
            :currentDataLength="listUsers?.length"
            :totalData="meta.total"
          >
            <template #page>
              <smart-pagination
                v-if="listUsers.length"
                :currentPage.sync="params.page"
                :totalPages="Math.ceil(meta.total / params.limit)"
                :hideSinglePage="false"
                :boundary-links="true"
              >
              </smart-pagination>
            </template>
          </CustomPagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UsersNetwork from "@/network/lib/users";
import RolesNetwork from "@/network/lib/roles";

import BreadCrumb from "@/components/BreadCrumb/BreadCrumb.vue";
import BaseButton from "@/components/Button/BaseButton.vue";
import BaseDropdownButton from "@/components/Button/BaseDropdownButton.vue";
import DropdownLimit from "@/components/DropdownLimit/DropdownLimit.vue";
import CustomPagination from "@/components/Pagination/CustomPagination.vue";
import InputSearch from "@/components/InputSearch/InputSearch.vue";

export default {
  name: "Users",
  components: {
    BreadCrumb,
    BaseButton,
    BaseDropdownButton,
    DropdownLimit,
    CustomPagination,
    InputSearch,
  },
  data() {
    return {
      isShowList: true,
      isLoading: false,
      listUsers: [],
      params: {
        limit: 10,
        page: 1,
        search: "",
      },
      meta: {
        total: 0,
        per_page: 0,
        current_page: 0,
      },
      role_type: "",
      list_role_type: {
        loading: false,
        data: [],
      },
    };
  },
  computed: {
    offset() {
      let offset = 0;
      if (this.params.search !== "") {
        offset = 0;
      } else {
        offset = (this.params.page - 1) * this.params.limit;
      }
      return offset;
    },
    changeListUsers() {
      return [this.params.limit, this.offset, this.params.search];
    },
    statusUsers() {
      return ({ invitation, status, verified }) => {
        if (invitation == "invited" && verified == 0) {
          return "Menunggu Konfirmasi";
        } else if (invitation == "invited" && verified == 1) {
          return "Terkonfirmasi";
        } else if (invitation == "joined" && status == 1) {
          return "Aktif";
        } else if (invitation == "joined" && status == 0) {
          return "Tidak Aktif";
        } else {
          return "Tidak Diketahui";
        }
      };
    },
    statusBadge() {
      return ({ invitation, status }) => {
        if (invitation == "invited") {
          return "badge-light-warning";
        } else if (invitation == "joined" && status == 1) {
          return "badge-light-success";
        } else if (invitation == "joined" && status == 0) {
          return "badge-light-danger";
        } else {
          return "badge-light-dark";
        }
      };
    },
  },
  watch: {
    changeListUsers: {
      handler: function () {
        this.getListUsers({
          limit: this.params.limit,
          offset: this.offset,
          search: this.params.search,
          role_id:
            typeof this.role_type === "string"
              ? this.role_type.split("_")[0]
              : "",
        });
      },
      deep: true,
    },

    role_type: {
      handler: function () {
        this.getListUsers({
          limit: this.params.limit,
          offset: this.offset,
          search: this.params.search,
          role_id:
            typeof this.role_type === "string"
              ? this.role_type.split("_")[0]
              : "",
        });
      },
      deep: true,
    },
  },
  methods: {
    async getListRoleType() {
      this.list_role_type.loading = true;
      try {
        const response = await RolesNetwork.getListAllRoles();

        if (response) {
          this.list_role_type.loading = false;
          this.list_role_type.data = response?.data?.rows;
        }
      } catch (error) {
        this.list_role_type.loading = false;
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },

    async getListUsers({ limit, offset, search, role_id }) {
      this.isLoading = true;
      try {
        const response = await UsersNetwork.getListUsers({
          limit,
          offset,
          search,
          role_id,
        });

        if (response) {
          this.isLoading = false;
          this.listUsers = response?.data?.rows;
          this.meta = {
            current_page: response?.data?.meta?.current_page,
            per_page: response?.data?.meta?.per_page,
            total: response?.data?.meta?.total,
          };
        }
      } catch (error) {
        this.isShowList = false;
        this.isLoading = false;
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },

    async deleteUsers({ id }) {
      try {
        const response = await UsersNetwork.deleteUsers({ id: id });

        if (response) {
          this.$store.dispatch("toast/showToastSuccess", {
            title: "Hapus Data Users",
            text: "Berhasil Menghapus Data Users",
          });

          this.getListUsers({
            limit: this.params.limit,
            offset: this.offset,
            search: this.params.search,
          });
        }
      } catch (error) {
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },

    handleInviteUsers() {
      this.$router.push("/users/invite");
    },

    handleAddUsers() {
      this.$router.push("/users/add");
    },

    handleEditUsers({ id }) {
      this.$router.push(`/users/${id}/edit`);
    },

    handleDeleteUsers({ id, title }) {
      this.$swal({
        title: `Apakah Yakin Untuk Menghapus Users ${title}?`,
        icon: "info",
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonText: "Ya!",
        cancelButtonText: "Batalkan",
        customClass: {
          confirmButton: "btn btn-primary",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteUsers({ id: id });
        }
      });
    },

    async resendVerify({ id }) {
      let loader = this.$loading.show();

      try {
        const response = await UsersNetwork.resendVerifyUsers({
          id: id,
        });

        if (response) {
          loader.hide();
          this.$store.dispatch("toast/showToastSuccess", {
            title: "Kirim Ulang Email Verifikasi",
            text: "Berhasil Mengirim Ulang Email Verifikasi",
          });
        }
      } catch (error) {
        loader.hide();
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },

    handleResendVerify({ id, email }) {
      this.$swal({
        title: `Apakah Yakin Untuk Mengirim Ulang Email Verifikasi ke ${email}?`,
        icon: "info",
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonText: "Ya!",
        cancelButtonText: "Batalkan",
        customClass: {
          confirmButton: "btn btn-primary",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          this.resendVerify({ id });
        }
      });
    },
  },

  mounted() {
    Promise.all([
      this.getListRoleType(),
      this.getListUsers({
        limit: this.params.limit,
        offset: this.offset,
        search: this.params.search,
      }),
    ]);
  },
};
</script>

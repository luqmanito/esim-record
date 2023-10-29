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
          <h5 class="card-title mb-2">List Roles</h5>

          <div class="d-flex align-items-center row pb-2 gap-3 gap-md-0">
            <div class="col-md-4">
              <label class="form-label">Filter Berdasarkan Tipe Role :</label>

              <select
                id="role_type_list"
                name="role_type_list"
                class="form-select w-100 text-capitalize"
                v-model="params.role_type"
                :disabled="list_role_type.loading"
              >
                <option value="">
                  {{
                    list_role_type.loading ? "Loading..." : "Semua Tipe Role"
                  }}
                </option>
                <option
                  v-for="tipe in list_role_type.data"
                  :value="`${tipe?.id}`"
                  :key="`${tipe?.id}-${tipe?.role_type}`"
                >
                  {{ tipe.id }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="card-body">
          <div
            class="row my-2 d-flex justify-content-center align-items-center"
          >
            <div class="col-md-4">
              <div
                class="d-flex justify-content-md-start justify-content-sm-center align-items-md-start align-items-sm-center"
              >
                <DropdownLimit v-model="params.limit" />
              </div>
            </div>
            <div class="col-md-8">
              <div
                class="d-flex flex-sm-column flex-md-row align-items-center justify-content-md-end my-sm-1 my-md-0"
              >
                <div class="mb-md-0">
                  <InputSearch
                    type="search"
                    class="form-control"
                    placeholder="Cari Roles"
                    v-model="params.search"
                  />
                </div>
                <div class="dt-buttons ms-sm-2">
                  <BaseButton @click="handleAddRoles" title="Tambah Roles">
                    <template name="icon-left">
                      <tabler-icon icon="PlusIcon"></tabler-icon>
                    </template>
                  </BaseButton>
                </div>
              </div>
            </div>
          </div>

          <div class="table-responsive mb-2">
            <v-table
              class="table table-hover"
              :data="listRoles"
              :pageSize="params.limit"
            >
              <thead class="table-light" slot="head">
                <tr>
                  <th>No</th>
                  <v-th sortKey="role">Role</v-th>
                  <v-th sortKey="role_type" class="text-center">Role Tipe</v-th>
                  <v-th sortKey="status" class="text-center">Status</v-th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody slot="body" slot-scope="{ displayData }">
                <tr v-if="isLoading">
                  <td colspan="5" class="text-center">Loading...</td>
                </tr>

                <tr
                  v-else-if="!isLoading && displayData.length"
                  v-for="(item, index) in displayData"
                  :key="item.id"
                >
                  <td>{{ offset + (index + 1) }}</td>
                  <td>{{ item?.role }}</td>
                  <td class="text-capitalize text-center">
                    <span class="d-inline-block">
                      <tabler-icon
                        class="me-25"
                        :class="iconColorRole(item?.role_type)"
                        :icon="iconRole(item?.role_type)"
                      />
                      {{ item?.role_type || "-" }}
                    </span>
                  </td>
                  <td class="text-center">
                    <span
                      class="badge rounded-pill"
                      :class="statusActiveBadge(item?.status)"
                    >
                      {{ statusActive(item?.status) }}
                    </span>
                  </td>
                  <td>
                    <div class="d-flex align-items-center col-actions">
                      <BaseButton
                        :access="['manusersroleedit']"
                        @click="handleEditRoles({ id: item?.id })"
                        className="btn btn-icon me-1"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        data-bs-original-title="Edit"
                      >
                        <tabler-icon class="me-25" icon="EditIcon" size="24" />
                      </BaseButton>

                      <BaseButton
                        @click="
                          handleDeleteRoles({
                            id: item?.id,
                            title: item?.role,
                          })
                        "
                        :access="['manusersroledelete']"
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
                  <td colspan="5" class="text-center">
                    Tidak ada Roles ditemukan
                  </td>
                </tr>
              </tbody>
            </v-table>
          </div>

          <CustomPagination
            v-if="!isLoading"
            :currentDataLength="listRoles?.length"
            :totalData="meta.total"
          >
            <template #page>
              <smart-pagination
                v-if="listRoles.length"
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
import RolesNetwork from "@/network/lib/roles";

import tipeRoleInternal from "@/data/tipeRoleInternal.json";

import BreadCrumb from "@/components/BreadCrumb/BreadCrumb.vue";
import BaseButton from "@/components/Button/BaseButton.vue";
import DropdownLimit from "@/components/DropdownLimit/DropdownLimit.vue";
import CustomPagination from "@/components/Pagination/CustomPagination.vue";
import InputSearch from "@/components/InputSearch/InputSearch.vue";

export default {
  name: "Roles",
  components: {
    BreadCrumb,
    BaseButton,
    DropdownLimit,
    CustomPagination,
    InputSearch,
  },
  data() {
    return {
      isLoading: false,
      listRoles: [],
      list_role_internal: tipeRoleInternal,
      list_role_type: {
        loading: false,
        data: [],
      },
      params: {
        limit: 10,
        page: 1,
        search: "",
        role_type: "",
      },
      meta: {
        total: 0,
        per_page: 0,
        current_page: 0,
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
    changeListLayanan() {
      return [
        this.params.limit,
        this.offset,
        this.params.search,
        this.params.role_type,
      ];
    },
    statusActive() {
      return (value) => {
        if (value == 1) {
          return "Aktif";
        } else if (value == 0) {
          return "Tidak Aktif";
        } else {
          return "Tidak Diketahui";
        }
      };
    },
    statusActiveBadge() {
      return (value) => {
        if (value == 1) {
          return "badge-light-success";
        } else if (value == 0) {
          return "badge-light-danger";
        } else {
          return "badge-light-dark";
        }
      };
    },
    iconRole() {
      return (value) => {
        const role = this.list_role_internal.find(
          (role) => role.value == value
        );

        if (role) {
          return role?.icon;
        } else {
          return "";
        }
      };
    },
    iconColorRole() {
      return (value) => {
        const role = this.list_role_internal.find(
          (role) => role.value == value
        );

        if (role) {
          return `text-${role["icon-color"]}`;
        } else {
          return "";
        }
      };
    },
  },
  watch: {
    changeListLayanan: {
      handler: function () {
        this.getListRoles();
      },
      deep: true,
    },
  },
  methods: {
    async getListRoleType() {
      this.list_role_type.loading = true;
      try {
        const response = await RolesNetwork.getListRoleType({});

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

    async getListRoles() {
      this.isLoading = true;
      try {
        const response = await RolesNetwork.getListRoles({
          limit: this.params.limit,
          offset: this.offset,
          search: this.params.search,
          roletype: this.params.role_type,
        });

        if (response) {
          this.isLoading = false;
          this.listRoles = response?.data?.rows;
          this.meta = {
            current_page: response?.data?.meta?.current_page,
            per_page: response?.data?.meta?.per_page,
            total: response?.data?.meta?.total,
          };
        }
      } catch (error) {
        this.isLoading = false;
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },

    async deleteRoles({ id }) {
      try {
        const response = await RolesNetwork.deleteRoles({ id: id });

        if (response) {
          this.$store.dispatch("toast/showToastSuccess", {
            title: "Hapus Data Roles",
            text: "Berhasil Menghapus Data Roles",
          });

          this.getListRoles();
        }
      } catch (error) {
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },

    handleAddRoles() {
      this.$router.push("/roles/add");
    },

    handleEditRoles({ id }) {
      this.$router.push(`/roles/${id}/edit`);
    },

    handleDeleteRoles({ id, title }) {
      this.$swal({
        title: `Apakah Yakin Untuk Menghapus Role ${title}?`,
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
          this.deleteRoles({ id: id });
        }
      });
    },
  },

  mounted() {
    this.getListRoleType();
    this.getListRoles();
  },
};
</script>

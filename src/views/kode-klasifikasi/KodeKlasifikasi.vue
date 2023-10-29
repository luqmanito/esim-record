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
          <h5 class="card-title mb-2">List Kode Klasifikasi</h5>
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
                    placeholder="Cari Kode Klasifikasi"
                    v-model="params.search"
                  />
                </div>
                <div class="dt-buttons ms-sm-2">
                  <BaseButton
                    @click="handleAddKodeKlasifikasi"
                    title="Tambah Kode Klasifikasi"
                    :access="['masterkodeklasifikasiadd']"
                  >
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
              :data="listKodeKlasifikasi"
              :pageSize="params.limit"
            >
              <thead class="table-light" slot="head">
                <tr>
                  <th>No</th>
                  <th sortKey="klasifikasi">Kode Klasifikasi</th>
                  <v-th sortKey="status" class="text-center">Status</v-th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody slot="body" slot-scope="{ displayData }">
                <tr v-if="isLoading">
                  <td colspan="4" class="text-center">Loading...</td>
                </tr>
                <tr
                  v-else-if="!isLoading && displayData.length"
                  v-for="(item, index) in displayData"
                  :key="item.id"
                >
                  <td>{{ offset + (index + 1) }}</td>
                  <td>{{ item?.klasifikasi || "-" }}</td>
                  <td class="text-center">
                    <span
                      class="badge rounded-pill"
                      :class="
                        statusBadgeKodeKlasifikasi({ value: item?.status })
                      "
                    >
                      {{ statusKodeKlasifikasi({ value: item?.status }) }}
                    </span>
                  </td>
                  <td>
                    <div class="d-flex align-items-center col-actions">
                      <BaseButton
                        className="btn btn-icon me-1"
                        @click="
                          toggleModalHistory({
                            value: true,
                            item: item,
                          })
                        "
                        data-bs-toggle="modal"
                        data-bs-target="#modal_history_kode_klasifikasi"
                      >
                        <tabler-icon
                          class="me-25"
                          icon="HistoryIcon"
                          size="24"
                        />
                      </BaseButton>

                      <BaseButton
                        :access="['masterkodeklasifikasiedit']"
                        @click="handleEditKodeKlasifikasi({ id: item?.id })"
                        className="btn btn-icon me-1"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        data-bs-original-title="Edit"
                      >
                        <tabler-icon class="me-25" icon="EditIcon" size="24" />
                      </BaseButton>

                      <BaseButton
                        @click="
                          handleDeleteKodeKlasifikasi({
                            id: item?.id,
                            title: item?.klasifikasi,
                          })
                        "
                        :access="['masterkodeklasifikasidelete']"
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
                  <td colspan="4" class="text-center">
                    Tidak ada Kode Klasifikasi ditemukan
                  </td>
                </tr>
              </tbody>
            </v-table>
          </div>

          <CustomPagination
            v-if="!isLoading"
            :currentDataLength="listKodeKlasifikasi?.length"
            :totalData="meta.total"
          >
            <template #page>
              <smart-pagination
                v-if="listKodeKlasifikasi.length"
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

    <ModalHistoryKodeKlasifikasi
      :listKodeKlasifikasi="listKodeKlasifikasi"
      :selectedKodeKlasifikasi="selectedKodeKlasifikasi"
      :isShowModal="isShowModal"
    />
  </div>
</template>

<script>
import KodeKlasifikasiNetwork from "@/network/lib/kode-klasifikasi";

import BreadCrumb from "@/components/BreadCrumb/BreadCrumb.vue";
import BaseButton from "@/components/Button/BaseButton.vue";
import DropdownLimit from "@/components/DropdownLimit/DropdownLimit.vue";
import CustomPagination from "@/components/Pagination/CustomPagination.vue";
import InputSearch from "@/components/InputSearch/InputSearch.vue";

import ModalHistoryKodeKlasifikasi from "@/views/kode-klasifikasi/components/ModalHistoryKodeKlasifikasi.vue";

export default {
  name: "KodeKlasifikasi",
  components: {
    BreadCrumb,
    BaseButton,
    DropdownLimit,
    CustomPagination,
    InputSearch,
    ModalHistoryKodeKlasifikasi,
  },

  data() {
    return {
      isShowModal: false,
      isLoading: false,
      listKodeKlasifikasi: [],
      selectedKodeKlasifikasi: {},
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
    changeListKodeKlasifikasi() {
      return [this.params.limit, this.offset, this.params.search];
    },
    statusBadgeKodeKlasifikasi() {
      return ({ value }) => {
        if (value == 1) {
          return "badge-light-success";
        } else if (value == 0) {
          return "badge-light-danger";
        } else {
          return "badge-light-dark";
        }
      };
    },
    statusKodeKlasifikasi() {
      return ({ value }) => {
        if (value == 1) {
          return "Aktif";
        } else if (value == 0) {
          return "Tidak Aktif";
        } else {
          return "Tidak Diketahui";
        }
      };
    },
  },

  watch: {
    changeListKodeKlasifikasi: {
      handler: function () {
        this.getListKodeKlasifikasi();
      },
      deep: true,
    },
  },

  methods: {
    async getListKodeKlasifikasi() {
      this.isLoading = true;
      try {
        const response = await KodeKlasifikasiNetwork.getListKodeKlasifikasi({
          limit: this.params.limit,
          offset: this.offset,
          search: this.params.search,
        });

        if (response) {
          this.isLoading = false;
          this.listKodeKlasifikasi = response?.data?.rows;
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

    async deleteKodeKlasifikasi({ id }) {
      try {
        const response = await KodeKlasifikasiNetwork.deleteKodeKlasifikasi({
          id: id,
        });

        if (response) {
          this.$store.dispatch("toast/showToastSuccess", {
            title: "Hapus Data Kode Klasifikasi",
            text: "Berhasil Menghapus Data Kode Klasifikasi",
          });

          this.getListKodeKlasifikasi();
        }
      } catch (error) {
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },

    handleAddKodeKlasifikasi() {
      this.$router.push("/kode-klasifikasi/add");
    },

    handleEditKodeKlasifikasi({ id }) {
      this.$router.push(`/kode-klasifikasi/${id}/edit`);
    },

    handleDeleteKodeKlasifikasi({ id, title }) {
      this.$swal({
        title: `Apakah Yakin Untuk Menghapus Kode Klasifikasi ${title}?`,
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
          this.deleteKodeKlasifikasi({ id: id });
        }
      });
    },

    toggleModalHistory({ value, item }) {
      this.isShowModal = value;
      this.selectedKodeKlasifikasi = item;
    },
  },

  mounted() {
    this.getListKodeKlasifikasi();
  },
};
</script>

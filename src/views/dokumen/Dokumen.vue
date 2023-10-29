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
          <h5 class="card-title mb-2">List Dokumen</h5>

          <div class="d-flex align-items-center row pb-2 gap-3 gap-md-0">
            <div class="col-md-4">
              <label class="form-label"
                >Filter Berdasarkan Tipe Layanan :</label
              >

              <select
                id="tipe-layanan"
                name="tipe-layanan"
                class="form-select text-capitalize"
                v-model="type_layanan"
              >
                <option value="">Semua Tipe Layanan</option>
                <option
                  v-for="type in list_type_layanan"
                  :value="type?.value"
                  :key="type?.key"
                >
                  {{ type?.label }}
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
                    placeholder="Cari Dokumen"
                    v-model="params.search"
                  />
                </div>
                <div class="dt-buttons ms-sm-2">
                  <BaseButton
                    @click="handleAddDokumen"
                    title="Tambah Dokumen"
                    :access="['masterdokumenadd']"
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
              :data="listDokumen"
              :pageSize="params.limit"
            >
              <thead class="table-light" slot="head">
                <tr>
                  <th>No</th>
                  <th>Dokumen</th>
                  <th>Tipe Layanan</th>
                  <th>Tipe Dokumen</th>
                  <th class="text-center" style="width: 20%">Role</th>
                  <th>Urutan</th>
                  <v-th :customSort="dateSort">Tanggal Dibuat</v-th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody slot="body" slot-scope="{ displayData }">
                <tr v-if="isLoading">
                  <td colspan="8" class="text-center">Loading...</td>
                </tr>

                <tr
                  v-else-if="!isLoading && displayData.length"
                  v-for="(item, index) in displayData"
                  :key="item.id"
                >
                  <td>{{ offset + (index + 1) }}</td>
                  <td>
                    <span>
                      {{ item?.document || "-" }}
                    </span>
                  </td>
                  <td class="text-capitalize">{{ item?.layanan || "-" }}</td>
                  <td>{{ tipeDokumen(item?.type) || "-" }}</td>
                  <td class="text-capitalize text-center">
                    <span class="d-inline-block">
                      <tabler-icon
                        class="me-25"
                        :class="iconColorRole(item?.role)"
                        :icon="iconRole(item?.role)"
                      />
                      {{ item?.role || "-" }}
                    </span>
                  </td>
                  <td>{{ item?.orders || "-" }}</td>
                  <td>{{ formatDate(item?.created_at) || "-" }}</td>
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
                        data-bs-target="#modal_history_dokumen"
                      >
                        <tabler-icon
                          class="me-25"
                          icon="HistoryIcon"
                          size="24"
                        />
                      </BaseButton>

                      <BaseButton
                        :access="['masterdokumenedit']"
                        @click="handleEditDokumen({ id: item?.id })"
                        className="btn btn-icon me-1"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        data-bs-original-title="Edit"
                      >
                        <tabler-icon class="me-25" icon="EditIcon" size="24" />
                      </BaseButton>

                      <BaseButton
                        @click="
                          handleDeleteDokumen({
                            id: item?.id,
                            title: item?.document,
                          })
                        "
                        :access="['masterdokumendelete']"
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
                  <td colspan="8" class="text-center">
                    Tidak ada Dokumen ditemukan
                  </td>
                </tr>
              </tbody>
            </v-table>
          </div>

          <CustomPagination
            v-if="!isLoading"
            :currentDataLength="listDokumen?.length"
            :totalData="meta.total"
          >
            <template #page>
              <smart-pagination
                v-if="listDokumen.length"
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

    <ModalHistoryDokumen
      :listDokumen="listDokumen"
      :selectedDokumen="selectedDokumen"
      :isShowModal="isShowModal"
    />
  </div>
</template>

<script>
import DokumenNetwork from "@/network/lib/dokumen";

import tipeRoleInternal from "@/data/tipeRoleInternal.json";
import tipeLayananDokumen from "@/data/tipeLayananDokumen.json";

import BreadCrumb from "@/components/BreadCrumb/BreadCrumb.vue";
import BaseButton from "@/components/Button/BaseButton.vue";
import DropdownLimit from "@/components/DropdownLimit/DropdownLimit.vue";
import CustomPagination from "@/components/Pagination/CustomPagination.vue";
import InputSearch from "@/components/InputSearch/InputSearch.vue";

import ModalHistoryDokumen from "@/views/dokumen/components/ModalHistoryDokumen.vue";

import { formatDateMoments } from "@/utils/momentDateFormat";

export default {
  name: "Dokumen",
  components: {
    BreadCrumb,
    BaseButton,
    DropdownLimit,
    CustomPagination,
    InputSearch,
    ModalHistoryDokumen,
  },
  data() {
    return {
      isShowModal: false,
      isLoading: false,
      listDokumen: [],
      type_layanan: "pemusnahan",
      list_type_layanan: tipeLayananDokumen,
      list_role_internal: tipeRoleInternal,
      selectedDokumen: {},
      params: {
        limit: 10,
        page: 1,
        search: "",
        order: "DESC",
        order_key: "created_at",
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
    tipeDokumen() {
      return (value) => {
        if (value == "optional") {
          return "Opsional";
        } else if (value == "mandatory") {
          return "Perintah";
        } else {
          return "Tidak Diketahui";
        }
      };
    },
    iconRole() {
      return (value) => {
        const role = this.list_role_internal.find(
          (role) => role.value == value
        );

        return role?.icon || "";
      };
    },
    iconColorRole() {
      return (value) => {
        const role = this.list_role_internal.find(
          (role) => role.value == value
        );

        return role["icon-color"] ? `text-${role["icon-color"]}` : "";
      };
    },
    formatDate() {
      return (value) => {
        return formatDateMoments(value);
      };
    },
    changeListDokumen() {
      return [
        this.params.limit,
        this.offset,
        this.params.search,
        this.type_layanan,
        this.params.order,
        this.params.order_key,
      ];
    },
  },
  watch: {
    changeListDokumen: {
      handler: function () {
        this.getListDokumen();
      },
      deep: true,
    },
  },
  methods: {
    dateSort(a, b) {
      let date1 = new Date(a.created_at).getTime();
      let date2 = new Date(b.created_at).getTime();

      this.params.order_key = "created_at";

      if (date1 - date2) {
        this.params.order = "ASC";
      } else {
        this.params.order = "DESC";
      }

      return date1 - date2;
    },

    async getListDokumen() {
      this.isLoading = true;
      try {
        const response = await DokumenNetwork.getListDokumen({
          limit: this.params.limit,
          offset: this.offset,
          search: this.params.search,
          layanan: this.type_layanan,
          role: "admin",
          order: this.params.order,
          order_key: this.params.order_key,
        });

        if (response) {
          this.isLoading = false;
          this.listDokumen = response?.data?.rows;
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

    async deleteDokumen({ id }) {
      try {
        const response = await DokumenNetwork.deleteDokumen({ id: id });

        if (response) {
          this.$store.dispatch("toast/showToastSuccess", {
            title: "Hapus Data Dokumen",
            text: "Berhasil Menghapus Data Dokumen",
          });

          this.getListDokumen();
        }
      } catch (error) {
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },

    handleAddDokumen() {
      this.$router.push("/dokumen/add");
    },

    handleEditDokumen({ id }) {
      this.$router.push(`/dokumen/${id}/edit`);
    },

    handleDeleteDokumen({ id, title }) {
      this.$swal({
        title: `Apakah Yakin Untuk Menghapus Dokumen ${title}?`,
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
          this.deleteDokumen({ id: id });
        }
      });
    },

    toggleModalHistory({ value, item }) {
      this.isShowModal = value;
      this.selectedDokumen = item;
    },
  },
  mounted() {
    this.getListDokumen();
  },
};
</script>

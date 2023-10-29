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
          <h5 class="card-title mb-2">List Layanan</h5>
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
                    placeholder="Cari Layanan"
                    v-model="params.search"
                  />
                </div>
                <div class="dt-buttons ms-sm-2">
                  <BaseButton @click="handleAddLayanan" title="Tambah Layanan">
                    <template name="icon-left">
                      <tabler-icon icon="PlusIcon"></tabler-icon>
                    </template>
                  </BaseButton>
                </div>
              </div>
            </div>
          </div>

          <div class="table-responsive mb-2">
            <!-- pageSize itu Limit -->
            <!-- :currentPage.sync="page" itu untuk menampilkan page berapa yang aktif + harus di sync dengan pagination -->
            <!-- totalPagesChanged untuk mentrigger perubahan pages -->
            <!-- :totalPages ini untuk offset -->

            <v-table
              class="table table-hover"
              :data="listLayanan"
              :pageSize="params.limit"
            >
              <thead class="table-light" slot="head">
                <tr>
                  <th>No</th>
                  <th>Layanan</th>
                  <th>Tipe</th>
                  <th class="text-center">Sync</th>
                  <th>Oracle Item</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody slot="body" slot-scope="{ displayData }">
                <tr v-if="isLoading">
                  <td colspan="7" class="text-center">Loading...</td>
                </tr>
                <tr
                  v-else-if="!isLoading && displayData.length"
                  v-for="(item, index) in displayData"
                  :key="item.id"
                >
                  <td>{{ offset + (index + 1) }}</td>
                  <td>{{ item?.layanan }}</td>
                  <td>{{ item?.tipe }}</td>
                  <td class="text-center">
                    <span
                      class="badge rounded-pill"
                      :class="
                        item?.oracleItemId == null
                          ? 'badge-light-danger'
                          : 'badge-light-success'
                      "
                    >
                      {{
                        item?.oracleItemId != null
                          ? "Terkoneksi"
                          : "Belum Terkoneksi"
                      }}
                    </span>
                  </td>
                  <td>
                    <a
                      v-if="item?.oracleItem"
                      @click="
                        toggleModalSyncDetail({
                          selectedItemData: item?.oracleItemJson,
                          syncedOracleItem: {
                            ItemId: item?.oracleItemId,
                            OrganizationId: item?.oracleOrganizationId,
                          },
                        })
                      "
                      href="#"
                      data-bs-toggle="modal"
                      data-bs-target="#modal_detail_oracle"
                    >
                      {{ item?.oracleItem }}
                    </a>

                    <span v-else>
                      {{ item?.oracleItem || "-" }}
                    </span>
                  </td>
                  <td class="text-center">
                    <span
                      class="badge rounded-pill"
                      :class="
                        item?.status == 1
                          ? 'badge-light-success'
                          : 'badge-light-danger'
                      "
                    >
                      {{ item?.status == 1 ? "Aktif" : "Tidak Aktif" }}
                    </span>
                  </td>
                  <td>
                    <div class="d-flex align-items-center col-actions">
                      <BaseButton
                        @click="toggleModalHistory(true, item)"
                        className="btn btn-icon me-1"
                        data-bs-toggle="modal"
                        data-bs-target="#modal_history_layanan"
                      >
                        <tabler-icon
                          class="me-25"
                          icon="HistoryIcon"
                          size="24"
                        />
                      </BaseButton>

                      <BaseButton
                        @click="toggleModalSyncOracleLayanan(true, item)"
                        :access="['masterruangan']"
                        className="btn btn-icon me-1"
                        data-bs-toggle="modal"
                        data-bs-target="#modal_connect_oracle"
                      >
                        <tabler-icon class="me-25" icon="LinkIcon" size="24" />
                      </BaseButton>

                      <BaseButton
                        :access="['masterruanganedit']"
                        @click="handleEditLayanan({ id: item?.id })"
                        className="btn btn-icon me-1"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        data-bs-original-title="Edit"
                      >
                        <tabler-icon class="me-25" icon="EditIcon" size="24" />
                      </BaseButton>

                      <BaseButton
                        @click="
                          handleDeleteLayanan({
                            id: item?.id,
                            title: item?.layanan,
                          })
                        "
                        :access="['masterruangandelete']"
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
                  <td colspan="7" class="text-center">
                    Tidak ada Layanan ditemukan
                  </td>
                </tr>
              </tbody>
            </v-table>
          </div>

          <CustomPagination
            v-if="!isLoading"
            :currentDataLength="listLayanan?.length"
            :totalData="meta.total"
          >
            <template #page>
              <smart-pagination
                v-if="listLayanan.length"
                :currentPage.sync="params.page"
                :totalPages="Math.ceil(meta.total / params.limit)"
                :hideSinglePage="false"
                :boundary-links="true"
              >
              </smart-pagination>
            </template>
          </CustomPagination>

          <ModalConnectOracle
            :idLayanan="syncOracleLayanan.id"
            :isShowModal="isShowModal"
            :itemSelected="syncOracleLayanan.itemSelected"
            @close="handleCloseModalSyncOracleLayanan"
            @refresh="handleRefreshList"
          />

          <ModalDetailItemOracle
            :isShowModal="isShowModalDetail"
            :selectedItemData="selectedItemData"
            :syncOracleItem="syncOracleItem"
          />

          <ModalHistoryLayanan
            :listLayanan="listLayanan"
            :selectedLayanan="selectedItemHistory"
            :isShowModal="isShowModal"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LayananNetwork from "@/network/lib/layanan";
import BreadCrumb from "@/components/BreadCrumb/BreadCrumb.vue";
import BaseButton from "@/components/Button/BaseButton.vue";
import DropdownLimit from "@/components/DropdownLimit/DropdownLimit.vue";
import CustomPagination from "@/components/Pagination/CustomPagination.vue";
import InputSearch from "@/components/InputSearch/InputSearch.vue";
import Spinner from "@/components/Loading/Spinner.vue";

import ModalConnectOracle from "@/views/layanan/components/ModalConnectOracle.vue";
import ModalDetailItemOracle from "@/views/layanan/components/ModalDetailItemOracle.vue";
import ModalHistoryLayanan from "@/views/layanan/components/ModalHistoryLayanan.vue";

export default {
  name: "Layanan",
  components: {
    BreadCrumb,
    BaseButton,
    DropdownLimit,
    CustomPagination,
    InputSearch,
    Spinner,
    ModalConnectOracle,
    ModalDetailItemOracle,
    ModalHistoryLayanan,
  },
  data() {
    return {
      isLoading: false,
      listLayanan: [],
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
      isShowModal: false,
      isShowModalDetail: false,
      isShowModalHistory: false,
      syncOracleLayanan: {
        itemSelected: null,
      },
      syncOracleItem: {},
      selectedItemData: {},
      selectedItemHistory: {},
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
      return [this.params.limit, this.offset, this.params.search];
    },
  },
  watch: {
    changeListLayanan: {
      handler: function () {
        this.getListLayanan();
      },
      deep: true,
    },
  },
  methods: {
    handleRefreshList() {
      this.getListLayanan();
    },

    handleCloseModalSyncOracleLayanan() {
      this.toggleModalSyncOracleLayanan(false, null);
    },

    toggleModalSyncOracleLayanan(value, item) {
      this.syncOracleLayanan.title = item.layanan;
      this.syncOracleLayanan.itemSelected = {
        id: item.id,
        oracleItemId: item?.oracleItemId,
        oracleCatalogId: item?.oracleCatalogId,
        oracleOrganizationId: item?.oracleOrganizationId,
        selectedLayanan: item?.layanan,
      };
      this.isShowModal = value;
    },

    toggleModalSyncDetail(value) {
      const jsonData = value?.selectedItemData;
      let data = {};

      if (typeof jsonData === "string") {
        const parsed = JSON.parse(jsonData);
        if (parsed) {
          if (Array.isArray(parsed) && parsed.length) {
            data = parsed[0];
          }
        }
      }

      this.syncOracleLayanan.id = value?.id;
      this.syncOracleItem = value?.syncedOracleItem;
      this.selectedItemData = data;
    },

    toggleModalHistory(value, item) {
      this.isShowModalHistory = value;
      this.selectedItemHistory = item;
    },

    async getListLayanan() {
      this.isLoading = true;
      try {
        const response = await LayananNetwork.getListLayanan({
          limit: this.params.limit,
          offset: this.offset,
          search: this.params.search,
        });

        if (response) {
          this.isLoading = false;
          this.listLayanan = response?.data?.rows;
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

    async deleteLayanan({ id }) {
      try {
        const response = await LayananNetwork.deleteLayanan({ id: id });

        if (response) {
          this.$store.dispatch("toast/showToastSuccess", {
            title: "Hapus Data Layanan",
            text: "Berhasil Menghapus Data Layanan",
          });

          this.getListLayanan();
        }
      } catch (error) {
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },

    handleAddLayanan() {
      this.$router.push("/layanan/add");
    },

    handleEditLayanan({ id }) {
      this.$router.push(`/layanan/${id}/edit`);
    },

    handleDeleteLayanan({ id, title }) {
      this.$swal({
        title: `Apakah Yakin Untuk Menghapus Layanan ${title}?`,
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
          this.deleteLayanan({ id: id });
        }
      });
    },
  },
  mounted() {
    this.getListLayanan();
  },
};
</script>

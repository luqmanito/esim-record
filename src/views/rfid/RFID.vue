<template>
  <div class="content-wrapper">
    <div class="content-header row">
      <div class="content-header-left col-md-9 col-12 mb-2">
        <BreadCrumb :showHeader="true" />
      </div>
    </div>

    <div class="content-body">
      <div class="row">
        <RFIDCardSummary
          label="Total RFID"
          :value="summaryRFID.total"
          variant="info"
        >
          <tabler-icon icon="NfcIcon" />
        </RFIDCardSummary>

        <RFIDCardSummary
          label="RFID Terpakai"
          :value="summaryRFID.used"
          variant="primary"
        >
          <tabler-icon icon="NfcIcon" />
        </RFIDCardSummary>

        <RFIDCardSummary
          label="RFID Tersedia"
          :value="summaryRFID.available"
          variant="success"
        >
          <tabler-icon icon="NfcIcon" />
        </RFIDCardSummary>

        <RFIDCardSummary
          label="RFID Belum Digunakan"
          :value="summaryRFID.not_used"
          variant="warning"
        >
          <tabler-icon icon="NfcIcon" />
        </RFIDCardSummary>

        <RFIDCardSummary
          label="RFID Rusak"
          :value="summaryRFID.damaged"
          variant="dark"
        >
          <tabler-icon icon="NfcIcon" />
        </RFIDCardSummary>
      </div>

      <div class="card">
        <div class="card-header border-bottom row">
          <h5 class="card-title mb-2">List RFID</h5>
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
                    placeholder="Cari RFID"
                    v-model="params.search"
                  />
                </div>
                <div class="dt-buttons ms-sm-2">
                  <BaseButton
                    @click="handleAddRFID"
                    title="Tambah RFID"
                    :access="['masterrfidadd']"
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
              :data="listRFID"
              :pageSize="params.limit"
            >
              <thead class="table-light" slot="head">
                <tr>
                  <th>No</th>
                  <v-th sortKey="rfid">RFID</v-th>
                  <v-th sortKey="gudang.gudang">Lokasi Gudang</v-th>
                  <th>Jumlah Pemakaian</th>
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
                  <td>{{ item?.rfid || "-" }}</td>
                  <td>{{ item?.gudang?.gudang || "-" }}</td>
                  <td>-</td>
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
                        className="btn btn-icon me-1"
                        @click="
                          toggleModalHistory({
                            value: true,
                            item: item,
                          })
                        "
                        data-bs-toggle="modal"
                        data-bs-target="#modal_history_rfid"
                      >
                        <tabler-icon
                          class="me-25"
                          icon="HistoryIcon"
                          size="24"
                        />
                      </BaseButton>

                      <BaseButton
                        @click="handleEditRFID({ id: item?.id })"
                        :access="['masterrfidedit']"
                        className="btn btn-icon me-1"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        data-bs-original-title="Edit"
                      >
                        <tabler-icon class="me-25" icon="EditIcon" size="24" />
                      </BaseButton>

                      <BaseButton
                        @click="
                          handleDeleteRFID({
                            id: item?.id,
                            title: item?.rfid,
                          })
                        "
                        :access="['masterrfiddelete']"
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
                    Tidak ada RFID ditemukan
                  </td>
                </tr>
              </tbody>
            </v-table>
          </div>

          <CustomPagination
            v-if="!isLoading"
            :currentDataLength="listRFID?.length"
            :totalData="meta.total"
          >
            <template #page>
              <smart-pagination
                v-if="listRFID.length"
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

    <ModalHistoryRFID
      :listRFID="listRFID"
      :selectedRFID="selectedRFID"
      :isShowModal="isShowModal"
    />
  </div>
</template>

<script>
import RFIDNetwork from "@/network/lib/rfid";

import BreadCrumb from "@/components/BreadCrumb/BreadCrumb.vue";
import BaseButton from "@/components/Button/BaseButton.vue";
import DropdownLimit from "@/components/DropdownLimit/DropdownLimit.vue";
import CustomPagination from "@/components/Pagination/CustomPagination.vue";
import InputSearch from "@/components/InputSearch/InputSearch.vue";

import RFIDCardSummary from "@/views/rfid/components/RFIDCardSummary.vue";
import ModalHistoryRFID from "@/views/rfid/components/ModalHistoryRFID.vue";

export default {
  name: "RFID",
  components: {
    BreadCrumb,
    BaseButton,
    DropdownLimit,
    CustomPagination,
    InputSearch,
    RFIDCardSummary,
    ModalHistoryRFID,
  },
  data() {
    return {
      isShowModal: false,
      isLoading: false,
      listRFID: [],
      selectedRFID: {},
      summaryRFID: {
        total: 0,
        used: 0,
        available: 0,
        not_used: 0,
        damaged: 0,
      },
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
    changeListRFID() {
      return [this.params.limit, this.offset, this.params.search];
    },
  },
  watch: {
    changeListRFID: {
      handler: function () {
        this.getListRFID();
      },
      deep: true,
    },
  },
  methods: {
    handleAddRFID() {
      this.$router.push("/rfid/add");
    },

    async getListRFID() {
      this.isLoading = true;
      try {
        const response = await RFIDNetwork.getListRFID({
          limit: this.params.limit,
          offset: this.offset,
          search: this.params.search,
        });

        if (response) {
          this.isLoading = false;
          this.listRFID = response?.data?.rows;
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

    async getSummaryRFID() {
      try {
        const response = await RFIDNetwork.getSummaryRFID({});

        if (response) {
          const data = response?.data;

          this.summaryRFID.total = data?.total;
          this.summaryRFID.used = data?.terpakai;
          this.summaryRFID.available = data?.tersedia;
          this.summaryRFID.not_used = data?.blm_digunakan;
          this.summaryRFID.damaged = data?.rusak;
        }
      } catch (error) {
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },

    async deleteRFID({ id }) {
      try {
        const response = await RFIDNetwork.deleteRFID({ id: id });

        if (response) {
          this.$store.dispatch("toast/showToastSuccess", {
            title: "Hapus Data RFID",
            text: "Berhasil Menghapus Data RFID",
          });

          this.getListRFID();
        }
      } catch (error) {
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },

    handleEditRFID({ id }) {
      this.$router.push(`/rfid/${id}/edit`);
    },

    handleDeleteRFID({ id, title }) {
      this.$swal({
        title: `Apakah Yakin Untuk Menghapus RFID ${title}?`,
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
          this.deleteRFID({ id: id });
        }
      });
    },

    toggleModalHistory({ value, item }) {
      this.isShowModal = value;
      this.selectedRFID = item;
    },
  },
  mounted() {
    this.getSummaryRFID();
    this.getListRFID();
  },
};
</script>

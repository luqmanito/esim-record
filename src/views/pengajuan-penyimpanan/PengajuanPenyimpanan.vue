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
          <h5 class="card-title mb-2">List Pengajuan Penyimpanan</h5>
        </div>

        <div class="card-body">
          <div class="row my-2 d-flex justify-content-center align-items-center">
            <div class="col-md-3">
              <div class="
                    d-flex
                    justify-content-md-start justify-content-sm-center
                    align-items-md-start align-items-sm-center
                  ">
                <DropdownLimit v-model="params.limit" />
              </div>
            </div>

            <div class="col-md-9">
              <div class="
                    d-flex
                    flex-sm-column flex-md-row
                    align-items-center
                    justify-content-md-end
                    my-sm-1 my-md-0
                  ">
                <div class="mt-1 mt-md-0">
                  <InputSearch type="search" class="form-control" placeholder="Cari Pengajuan" v-model="params.search" />
                </div>

                <!-- Tambah Pengajuan -->
                <!-- <div class="dt-buttons ms-sm-2">
                  <BaseButton
                    title="Tambah Pengajuan"
                    @click="handleAddPengajuanArsip"
                  >
                    <template name="icon-left">
                      <tabler-icon icon="PlusIcon"></tabler-icon>
                    </template>
                  </BaseButton>
                </div> -->
              </div>
            </div>
          </div>

          <div class="table-responsive mb-2">
            <v-table class="table table-hover" :data="listPengajuan" :pageSize="params.limit">
              <thead class="table-light" slot="head">
                <tr>
                  <th>No</th>
                  <th>Kode Transaksi</th>
                  <th>Tanggal Pengajuan</th>
                  <th class="width-nama-perusahaan">Nama Perusahaan</th>
                  <th>Tanggal Proses</th>
                  <th class="text-center">Proses / Tahapan</th>
                  <th class="text-center">Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody slot="body" slot-scope="{ displayData }">
                <tr v-if="isLoading">
                  <td colspan="8" class="text-center">Loading...</td>
                </tr>

                <tr v-else-if="!isLoading && displayData.length" v-for="(item, index) in displayData" :key="item.id">
                  <td>{{ offset + (index + 1) }}</td>
                  <td>{{ item?.transaction_number || "-" }}</td>
                  <td>{{ formatDate(item?.transaction_date) }}</td>
                  <td>{{ item?.pelanggan?.nama || "-" }}</td>
                  <td>
                    <span v-if="item?.progressflowpenyimpanan">
                      {{
                        formatDate(item?.progressflowpenyimpanan?.created_at)
                      }}
                    </span>
                    <span v-else class="badge rounded-pill badge-light-dark">
                      Belum Ada Proses
                    </span>
                  </td>
                  <td class="text-center">
                    <span class="badge rounded-pill text-capitalize" :class="
                      flowProsesClass(item?.progressflowpenyimpanan?.flow?.urutan)
                    ">
                      <span v-if="item?.progressflowpenyimpanan?.flow?.urutan">
                        {{ item?.progressflowpenyimpanan?.flow?.urutan }} /
                        {{ item?.total_step_flow }}
                      </span>
                      {{
                        item?.progressflowpenyimpanan?.flow?.proses ||
                        "Belum Ada Proses"
                      }}
                    </span>
                  </td>
                  <td class="text-center">
                    <span class="badge rounded-pill text-capitalize" :class="statusClass(item?.status)">
                      {{ item?.status || "Tidak Diketahui" }}
                    </span>
                  </td>
                  <td>
                    <div class="d-flex align-items-center col-actions">
                      <BaseButton @click="handleDetailPengajuanArsip({ id: item?.id })" className="btn btn-icon me-1">
                        <tabler-icon class="me-25" icon="EyeIcon" size="24" />
                      </BaseButton>
                    </div>
                  </td>
                </tr>

                <tr v-else>
                  <td colspan="8" class="text-center">
                    Tidak ada Pengajuan ditemukan
                  </td>
                </tr>
              </tbody>
            </v-table>
          </div>

          <CustomPagination v-if="!isLoading" :currentDataLength="listPengajuan?.length" :totalData="meta.total">
            <template #page>
              <smart-pagination v-if="listPengajuan.length" :currentPage.sync="params.page"
                :totalPages="Math.ceil(meta.total / params.limit)" :hideSinglePage="false" :boundary-links="true">
              </smart-pagination>
            </template>
          </CustomPagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PengajuanPenyimpananNetwork from "@/network/lib/pengajuan-penyimpanan";

import BreadCrumb from "@/components/BreadCrumb/BreadCrumb.vue";
import BaseButton from "@/components/Button/BaseButton.vue";
import DropdownLimit from "@/components/DropdownLimit/DropdownLimit.vue";
import CustomPagination from "@/components/Pagination/CustomPagination.vue";
import InputSearch from "@/components/InputSearch/InputSearch.vue";

import { formatDateMoments } from "@/utils/momentDateFormat";

export default {
  name: "PengajuanPenyimpanan",
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
      listPengajuan: [],
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

    changeListPengajuan() {
      return [this.params.limit, this.offset, this.params.search];
    },

    statusClass() {
      return (value) => {
        if (value == "draft") {
          return "badge-light-info";
        } else if (value == "pending") {
          return "badge-light-warning";
        } else if (value == "approved") {
          return "badge-light-success";
        } else if (value == "rejected") {
          return "badge-light-danger";
        } else {
          return "badge-light-dark";
        }
      };
    },

    flowProsesClass() {
      return (value) => {
        if (value) {
          if (value % 2 == 0) {
            return "badge-light-info";
          } else if (value % 2 == 1) {
            return "badge-light-warning";
          }
        } else {
          return "badge-light-dark";
        }
      };
    },

    formatDate() {
      return (value) => {
        if (value) {
          return formatDateMoments(value);
        } else {
          return "-";
        }
      };
    },
  },

  methods: {
    handleAddPengajuanPenyimpanan() {
      this.$router.push("/pengajuan-penyimpanan/add");
    },

    handleDetailPengajuanArsip({ id }) {
      this.$router.push(`/pengajuan-penyimpanan/${id}/detail`);
    },

    async getListPengajuanPenyimpanan({ limit, offset, search }) {
      this.isLoading = true;
      try {
        const response =
          await PengajuanPenyimpananNetwork.getListPengajuanPenyimpanan({
            limit,
            offset,
            search,
          });

        if (response) {
          this.isLoading = false;
          this.listPengajuan = response?.data?.rows;
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
  },

  watch: {
    changeListPengajuan: {
      handler: function () {
        this.getListPengajuanPenyimpanan({
          limit: this.params.limit,
          offset: this.offset,
          search: this.params.search,
        });
      },
      deep: true,
    },
  },

  mounted() {
    this.getListPengajuanPenyimpanan({});
  },
};
</script>

<style scoped>
.width-nama-perusahaan {
  width: 30% !important;
}
</style>
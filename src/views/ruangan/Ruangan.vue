<template>
  <div class="content-wrapper">
    <div class="content-header row">
      <div class="content-header-left col-md-9 col-12 mb-2">
        <BreadCrumb :showHeader="true" />
      </div>
    </div>

    <div class="content-body">
      <div class="row mb-2">
        <div class="col-md-6">
          <div
            class="
              d-flex
              justify-content-md-start justify-content-sm-center
              align-items-md-start align-items-sm-center
            "
          >
            <DropdownLimit v-model="params.limit" />

            <div class="mb-0 w-100 ms-2 ms-md-2">
              <select
                id="gudang_list"
                name="gudang_list"
                v-model="params.gudang"
                class="form-select w-100"
              >
                <option value="">Filter By Gudang</option>
                <option
                  v-for="gudang in listGudang"
                  :value="gudang.id"
                  :key="gudang.id"
                >
                  {{ gudang.gudang }}
                </option>
              </select>
            </div>

            <div class="mb-0 w-100 ms-2 ms-md-2">
              <select
                id="layanan_list"
                name="layanan_list"
                v-model="params.layanan"
                class="form-select w-100"
              >
                <option value="">Filter By Layanan</option>
                <option
                  v-for="layanan in listLayanan"
                  :value="layanan.id"
                  :key="layanan.id"
                >
                  {{ layanan.layanan }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="col-md-6 d-flex justify-content-md-end">
          <div
            class="
              d-flex
              flex-sm-column flex-md-row
              align-items-center
              justify-content-center
              justify-content-md-end
              mb-md-0
            "
          >
            <div class="mb-md-0">
              <InputSearch
                type="search"
                class="form-control"
                placeholder="Cari Ruangan"
                v-model="params.search"
              />
            </div>
            <div class="dt-buttons ms-sm-2">
              <BaseButton @click="handleAddRuangan" title="Tambah Ruangan">
                <template name="icon-left">
                  <tabler-icon icon="PlusIcon"></tabler-icon>
                </template>
              </BaseButton>
            </div>
          </div>
        </div>
      </div>

      <Spinner v-if="isLoading" className="mt-5" />
      <div
        v-if="Array.isArray(listRuangan) && listRuangan.length && !isLoading"
        class="row match-height"
      >
        <RuanganCardItem
          v-for="(item, index) in listRuangan"
          :key="`ruangan-${index}`"
          :id="item?.id"
          :ruangan="item?.ruangan"
          :row_capacity="item?.row_capacity"
          :column_capacity="item?.column_capacity"
          :gudang="item?.gudang"
          :status="item?.status"
          :total_box_capacity="item?.total_box_capacity"
          :total_box_used="item?.total_box_used"
          @handle-detail="
            handleDetailRuangan({
              ruangan_id: item?.id,
              gudang_id: item?.gudang_id,
            })
          "
          @handle-delete="
            handleDeleteRuangan({ id: item?.id, title: item?.ruangan })
          "
          @handle-edit="handleEditRuangan({ id: item?.id })"
          @handle-setting-prefix="
            handleSettingPrefixRuangan({
              gudang_id: item?.gudang?.id,
              ruangan_id: item?.id,
            })
          "
          @toggle-modal-history="
            () => toggleModalHistory({ value: true, item: item })
          "
        />
      </div>

      <div v-if="!listRuangan.length && !isLoading">
        <div class="vh-100">
          <h6 class="text-center mt-5">Tidak ada Ruangan ditemukan</h6>
        </div>
      </div>

      <CustomPagination
        v-if="!isLoading"
        :currentDataLength="listRuangan?.length"
        :totalData="meta.total"
      >
        <template #page>
          <smart-pagination
            v-if="listRuangan.length"
            :currentPage.sync="params.page"
            :total-pages="Math.ceil(meta.total / params.limit)"
            :hideSinglePage="false"
            :boundary-links="true"
          >
          </smart-pagination>
        </template>
      </CustomPagination>
    </div>

    <ModalHistoryRuangan
      :listRuangan="listRuangan"
      :selectedRuangan="selectedRuangan"
      :isShowModal="isShowModal"
    />
  </div>
</template>

<script>
import GudangNetwork from "@/network/lib/gudang";
import LayananNetwork from "@/network/lib/layanan";
import RuanganNetwork from "@/network/lib/ruangan";
import BreadCrumb from "@/components/BreadCrumb/BreadCrumb.vue";
import BaseButton from "@/components/Button/BaseButton.vue";
import DropdownLimit from "@/components/DropdownLimit/DropdownLimit.vue";
import CustomPagination from "@/components/Pagination/CustomPagination.vue";
import InputSearch from "@/components/InputSearch/InputSearch.vue";
import Spinner from "@/components/Loading/Spinner.vue";

import RuanganCardItem from "@/views/ruangan/components/RuanganCardItem.vue";
import ModalHistoryRuangan from "@/views/ruangan/components/ModalHistoryRuangan.vue";

export default {
  name: "Ruangan",
  components: {
    BreadCrumb,
    BaseButton,
    DropdownLimit,
    InputSearch,
    CustomPagination,
    Spinner,
    RuanganCardItem,
    ModalHistoryRuangan,
  },
  data() {
    return {
      isShowModal: false,
      isLoading: false,
      selectedRuangan: {},
      listRuangan: [],
      listGudang: [],
      listLayanan: [],
      params: {
        gudang: "",
        layanan: "",
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
    changeListRuangan() {
      return [
        this.params.limit,
        this.offset,
        this.params.search,
        this.params.gudang,
        this.params.layanan,
      ];
    },
  },
  watch: {
    changeListRuangan: {
      handler: function () {
        this.getListRuangan();
      },
      deep: true,
    },
  },
  methods: {
    async getListGudang() {
      try {
        const response = await GudangNetwork.getListGudang({});

        if (response) {
          this.listGudang = response?.data?.rows;
        }
      } catch (error) {
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },

    async getListRuangan() {
      this.isLoading = true;
      try {
        const response = await RuanganNetwork.getListRuangan({
          limit: this.params.limit,
          offset: this.offset,
          search: this.params.search,
          gudang_id: this.params.gudang,
          layanan_id: this.params.layanan,
        });

        if (response) {
          this.isLoading = false;
          this.listRuangan = response?.data?.rows;
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

    async getListLayanan() {
      try {
        const response = await LayananNetwork.getListLayanan({});

        if (response) {
          this.listLayanan = response?.data?.rows;
        }
      } catch (error) {
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },

    async deleteRuangan({ id }) {
      try {
        const response = await RuanganNetwork.deleteRuangan({ id: id });

        if (response) {
          this.$store.dispatch("toast/showToastSuccess", {
            title: "Hapus Data Ruangan",
            text: "Berhasil Menghapus Data Ruangan",
          });

          this.getListRuangan();
        }
      } catch (error) {
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },

    handleAddRuangan() {
      this.$router.push("/ruangan/add");
    },

    handleDetailRuangan({ ruangan_id, gudang_id }) {
      this.$router.push(
        `/ruangan/detail?gudang_id=${gudang_id}&ruangan_id=${ruangan_id}`
      );
    },

    handleEditRuangan({ id }) {
      this.$router.push(`/ruangan/${id}/edit`);
    },

    handleDeleteRuangan({ id, title }) {
      this.$swal({
        title: `Apakah Yakin Untuk Menghapus Ruangan ${title}?`,
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
          this.deleteRuangan({ id: id });
        }
      });
    },

    handleSettingPrefixRuangan({ gudang_id, ruangan_id }) {
      this.$router.push(
        `/ruangan/setting-prefix?gudang_id=${gudang_id}&ruangan_id=${ruangan_id}`
      );
    },

    toggleModalHistory({ value, item }) {
      this.isShowModal = value;
      this.selectedRuangan = item;
    },
  },
  mounted() {
    this.getListRuangan();
    this.getListGudang();
    this.getListLayanan();
  },
};
</script>

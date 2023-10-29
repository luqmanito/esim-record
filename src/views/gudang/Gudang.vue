<template>
  <div class="content-wrapper">
    <div class="content-header row">
      <div class="content-header-left col-md-9 col-12 mb-2">
        <BreadCrumb :showHeader="true" />
      </div>
    </div>

    <div class="content-body">
      <div class="row mb-2">
        <div class="col-12 col-md-2">
          <div
            class="
              d-flex
              justify-content-md-start justify-content-sm-center
              align-items-md-start align-items-sm-center
            "
          >
            <DropdownLimit v-model="params.limit" />
          </div>
        </div>
        <div class="col-12 col-md-10 d-flex justify-content-md-end">
          <div
            class="
              d-flex
              justify-content-md-start justify-content-sm-center
              align-items-md-start align-items-sm-center
            "
          >
            <div class="mb-md-0">
              <InputSearch
                type="search"
                class="form-control"
                placeholder="Cari Gudang"
                v-model="params.search"
              />
            </div>
            <div class="dt-buttons ms-0 ms-md-2">
              <BaseButton @click="handleAddGudang" title="Tambah Gudang">
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
        v-if="Array.isArray(listGudang) && listGudang.length && !isLoading"
        class="row match-height"
      >
        <GudangCardItem
          v-for="(item, index) in listGudang"
          :key="`gudang-${index}`"
          :id="item?.id"
          :name="item?.gudang"
          :address="item?.alamat"
          :phone="item?.no_tlp"
          :code="item?.kode"
          :status="item?.status"
          @handle-delete="
            () => handleDeleteGudang({ id: item?.id, title: item?.gudang })
          "
          @handle-edit="() => handleEditGudang({ id: item?.id })"
          @toggle-modal-history="
            () => toggleModalHistory({ value: true, item: item })
          "
        />
      </div>

      <div v-if="!listGudang.length && !isLoading">
        <div class="vh-100">
          <h6 class="text-center mt-5">Tidak ada Gudang ditemukan</h6>
        </div>
      </div>

      <CustomPagination
        v-if="!isLoading"
        :currentDataLength="listGudang?.length"
        :totalData="meta.total"
      >
        <template #page>
          <smart-pagination
            v-if="listGudang.length"
            :currentPage.sync="params.page"
            :total-pages="Math.ceil(meta.total / params.limit)"
            :hideSinglePage="false"
            :boundary-links="true"
          >
          </smart-pagination>
        </template>
      </CustomPagination>
    </div>

    <ModalHistoryGudang
      :listGudang="listGudang"
      :selectedGudang="selectedGudang"
      :isShowModal="isShowModal"
    />
  </div>
</template>

<script>
import GudangNetwork from "@/network/lib/gudang";

import BreadCrumb from "@/components/BreadCrumb/BreadCrumb.vue";
import BaseButton from "@/components/Button/BaseButton.vue";
import DropdownLimit from "@/components/DropdownLimit/DropdownLimit.vue";
import CustomPagination from "@/components/Pagination/CustomPagination.vue";
import InputSearch from "@/components/InputSearch/InputSearch.vue";
import Spinner from "@/components/Loading/Spinner.vue";
import GudangCardItem from "@/views/gudang/components/GudangCardItem.vue";
import ModalHistoryGudang from "@/views/gudang/components/ModalHistoryGudang.vue";

export default {
  name: "Gudang",
  components: {
    BreadCrumb,
    GudangCardItem,
    BaseButton,
    DropdownLimit,
    CustomPagination,
    Spinner,
    InputSearch,
    ModalHistoryGudang,
  },

  data() {
    return {
      isShowModal: false,
      isLoading: false,
      listGudang: [],
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
      selectedGudang: {},
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
    changeListGudang() {
      /* Alternative Step by Destructuring Object
      const { limit, offset, page, search } = this;
      return {
        limit,
        offset,
        page,
        search,
      };
      */
      return [this.params.limit, this.params.search, this.offset];
    },
  },
  watch: {
    changeListGudang: {
      handler: function () {
        this.getListGudang();
      },
      deep: true,
    },
  },
  methods: {
    async getListGudang() {
      this.isLoading = true;
      try {
        const response = await GudangNetwork.getListGudang({
          limit: this.params.limit,
          offset: this.offset,
          search: this.params.search,
        });

        if (response) {
          this.isLoading = false;
          this.listGudang = response?.data?.rows;
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

    async deleteGudang({ id }) {
      try {
        const response = await GudangNetwork.deleteGudang({ id: id });

        if (response) {
          this.$store.dispatch("toast/showToastSuccess", {
            title: "Hapus Data Gudang",
            text: "Berhasil Menghapus Data Gudang",
          });

          this.getListGudang();
        }
      } catch (error) {
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },

    handleAddGudang() {
      this.$router.push("/gudang/add");
    },

    handleEditGudang({ id }) {
      this.$router.push(`/gudang/${id}/edit`);
    },

    handleDeleteGudang({ id, title }) {
      this.$swal({
        title: `Apakah Yakin Untuk Menghapus Gudang ${title}?`,
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
          this.deleteGudang({ id: id });
        }
      });
    },

    handleChangePage(event) {
      this.params.page = event;
    },

    toggleModalHistory({ value, item }) {
      this.isShowModal = value;
      this.selectedGudang = item;
    },
  },
  mounted() {
    this.getListGudang();
  },
};
</script>

<template>
  <div class="content-wrapper">
    <div class="content-header row">
      <div class="content-header-left col-md-9 col-12 mb-2">
        <BreadCrumb :showHeader="true" />
      </div>
    </div>

    <div class="content-body">
      <div class="row">
        <RuanganCardSummary
          label="Kapasitas Baris"
          :value="detail?.row_capacity"
          variant="warning"
        >
          <tabler-icon icon="LayoutDistributeHorizontalIcon" />
        </RuanganCardSummary>

        <RuanganCardSummary
          label="Kapasitas Kolom"
          :value="detail?.column_capacity"
          variant="info"
        >
          <tabler-icon icon="LayoutDistributeVerticalIcon" />
        </RuanganCardSummary>

        <RuanganCardSummary
          label="Status"
          :value="isActive ? 'Aktif' : 'Tidak Aktif'"
          :variant="isActive ? 'success' : 'danger'"
        >
          <tabler-icon :icon="isActive ? 'CircleCheckIcon' : 'CircleXIcon'" />
        </RuanganCardSummary>
      </div>

      <div class="row">
        <div class="col-md-12">
          <div class="card">
            <div class="card-header border-bottom row">
              <div class="d-flex align-items-center row pb-2 gap-3 gap-md-0">
                <div class="col-md-6">
                  <label class="form-label">Nama Gudang :</label>
                  <v-select
                    @search="onSearchGudang"
                    label="id"
                    placeholder="Cari dan Pilih Gudang"
                    :options="list_gudang"
                    :clearable="true"
                    :filterable="false"
                    :disabled="selectedSpace.length > 0"
                    :value="gudang_id"
                    @input="setSelectedGudangId"
                    :tabindex="1"
                  >
                    <template slot="no-options">
                      Gudang tidak tersedia
                    </template>

                    <template slot="option" slot-scope="option">
                      <div class="d-center">
                        {{ option?.gudang }}
                      </div>
                    </template>
                    <template slot="selected-option" slot-scope="option">
                      <div class="selected d-center">
                        {{ option?.gudang }}
                      </div>
                    </template>

                    <template #search="{ attributes, events }">
                      <input
                        class="vs__search"
                        v-bind="attributes"
                        v-on="events"
                      />
                    </template>
                  </v-select>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Nama Ruangan :</label>
                  <v-select
                    @search="onSearchRuangan"
                    label="id"
                    placeholder="Cari dan Pilih Ruangan"
                    :options="list_ruangan"
                    :clearable="true"
                    :filterable="false"
                    :disabled="selectedSpace.length > 0"
                    :value="ruangan_id"
                    @input="setSelectedRuanganId"
                    :tabindex="2"
                  >
                    <template slot="no-options">
                      Ruangan tidak tersedia
                    </template>

                    <template slot="option" slot-scope="option">
                      <div class="d-center">
                        {{ option?.ruangan }}
                      </div>
                    </template>
                    <template slot="selected-option" slot-scope="option">
                      <div class="selected d-center">
                        {{ option?.ruangan }}
                      </div>
                    </template>

                    <template #search="{ attributes, events }">
                      <input
                        class="vs__search"
                        v-bind="attributes"
                        v-on="events"
                      />
                    </template>
                  </v-select>
                </div>
              </div>
            </div>

            <div class="card-body">
              <div
                class="row my-2 mx-1 d-flex justify-content-between align-items-center"
              >
                <div
                  class="col-md-6 d-flex justify-content-start align-items-center"
                >
                  <div>
                    <h5 class="card-title mb-1">Pilih Area</h5>
                    <div><span class="me-1"> R : </span> Baris (Row)</div>
                    <div><span class="me-1"> C : </span> Kolom (Column)</div>
                  </div>
                </div>

                <div
                  class="col-md-6 d-flex justify-content-end align-items-center"
                >
                  <BaseButton
                    @click="toggleModal(true)"
                    className="btn btn-primary me-1"
                    :isDisabled="!selectedSpace.length"
                    title="Tambahkan atau Edit Rak"
                    data-bs-toggle="modal"
                    data-bs-target="#modal_add_rak"
                    :access="['masterrakadd', 'masterruanganadd']"
                  >
                    <template name="icon-left">
                      <tabler-icon icon="PlusIcon"></tabler-icon>
                    </template>
                  </BaseButton>

                  <BaseButton
                    @click="handleResetSelectedSpace"
                    :isDisabled="!selectedSpace.length"
                    className="btn btn-outline-danger "
                    title="Reset"
                  >
                    <template name="icon-left">
                      <tabler-icon icon="RotateClockwiseIcon"></tabler-icon>
                    </template>
                  </BaseButton>
                </div>
              </div>

              <VueCustomScrollbar>
                <!-- Change Direction Here (flex-column / flex-row) -->
                <div class="d-flex flex-column py-1 mx-1">
                  <Spinner v-if="isLoading" />

                  <template v-if="list_detail_ruangan.length && !isLoading">
                    <template v-for="(rows, indexRows) in list_detail_ruangan">
                      <div :key="`rows-${indexRows}`" class="d-flex flex-row">
                        <template v-for="(column, indexCol) in rows.columns">
                          <RuanganSpaceItem
                            :class="[
                              parseInt(column?.rak_count) > 0 ? 'mb-3' : '',
                            ]"
                            :key="`${indexRows}-${indexCol}`"
                            :id="column.id"
                            :row="rows.row"
                            :column="column.column"
                            :status="column.status"
                            :rak_count="column.rak_count"
                            :gudang_id="gudang_id || gudangIdQuery"
                            :ruangan_id="ruangan_id || ruanganIdQuery"
                            :selectedSpace="selectedSpace"
                            @handle-selected="
                              () => handleSelectedSpace(column.id)
                            "
                          >
                          </RuanganSpaceItem>
                        </template>
                      </div>
                    </template>
                  </template>

                  <div v-else>
                    <div class="vh-100">
                      <h6 class="text-center mt-5">
                        Tidak ada Space ditemukan
                      </h6>
                    </div>
                  </div>
                </div>
              </VueCustomScrollbar>

              <div
                v-if="list_detail_ruangan.length && !isLoading"
                class="row my-2"
              >
                <h6 class="section-label text-center">Keterangan</h6>
                <div>
                  <div class="d-flex justify-content-center align-items-center">
                    <div class="me-2">
                      <span class="bullet bullet-sm bg-primary me-1"></span
                      >Terisi
                    </div>
                    <div class="me-2">
                      <span class="bullet bullet-sm bg-success me-1"></span
                      >Terpilih
                    </div>
                    <div class="me-2">
                      <span class="bullet bullet-sm bg-light border me-1"></span
                      >Kosong
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ModalAddRak
      :isShowModal="isShowModal"
      @close="handleCloseModal"
      @success="handleSuccessModal"
    />
  </div>
</template>

<script>
import RuanganNetwork from "@/network/lib/ruangan";
import GudangNetwork from "@/network/lib/gudang";
import debounce from "lodash.debounce";

import BaseButton from "@/components/Button/BaseButton.vue";
import BreadCrumb from "@/components/BreadCrumb/BreadCrumb.vue";
import Spinner from "@/components/Loading/Spinner.vue";

import RuanganSpaceItem from "@/views/ruangan/components/RuanganSpaceItem.vue";
import RuanganCardSummary from "@/views/ruangan/components/RuanganCardSummary.vue";
import ModalAddRak from "@/views/ruangan/components/ModalAddRak.vue";

import VueCustomScrollbar from "vue-custom-scrollbar/src/vue-scrollbar.vue";

export default {
  name: "RuanganDetail",
  components: {
    BreadCrumb,
    BaseButton,
    RuanganSpaceItem,
    RuanganCardSummary,
    Spinner,
    ModalAddRak,
    VueCustomScrollbar,
  },

  data() {
    return {
      detail: {},
      ruangan_id: "",
      gudang_id: "",
      list_gudang: [],
      list_ruangan: [],
      list_detail_ruangan: [],
      isLoading: false,
      list: "",
      isShowModal: false,
    };
  },

  computed: {
    ruanganIdQuery() {
      return this.$route.query?.ruangan_id;
    },
    gudangIdQuery() {
      return this.$route.query?.gudang_id;
    },
    isActive() {
      return this.detail?.status == 1 ? true : false;
    },
    selectedSpace() {
      return this.$store.getters["ruangan/getSelectedSpace"];
    },
  },

  methods: {
    handleCloseModal() {
      this.toggleModal(false);
    },

    toggleModal(value) {
      this.isShowModal = value;
    },

    handleSuccessModal() {
      this.$store.commit("ruangan/SET_SELECTED_SPACE", []);
      this.getRuanganDetailList({ id: this.ruanganIdQuery || this.detail?.id });
    },

    async getListGudang({ search }) {
      try {
        const response = await GudangNetwork.getListGudang({
          search,
        });

        if (response) {
          this.list_gudang = response?.data?.rows;
        }
      } catch (error) {
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },

    async getListRuangan({ search }) {
      try {
        const response = await RuanganNetwork.getListRuangan({
          search,
        });

        if (response) {
          this.list_ruangan = response?.data?.rows;
        }
      } catch (error) {
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },

    async getRuanganById({ id, isAlreadyMounted = false }) {
      this.isLoading = true;

      try {
        const response = await RuanganNetwork.getRuanganById({
          id: id,
        });

        if (response) {
          this.isLoading = false;
          const data = response?.data;

          this.detail = data;

          if (!isAlreadyMounted) {
            this.ruangan_id = data;
            this.gudang_id = data?.gudang;
          }

          return response;
        }
      } catch (error) {
        this.isLoading = false;
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },

    async getRuanganDetailList({ id }) {
      try {
        const response = await RuanganNetwork.getRuanganDetailList({
          id: id,
        });

        if (response) {
          const data = response?.data;

          this.list_detail_ruangan = data;

          return response;
        }
      } catch (error) {
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },

    dropdownGudangOpen(vueSelect) {
      if (Array.isArray(this.list_gudang) && this.list_gudang.length) {
        return vueSelect.open;
      }

      return vueSelect.search.length !== 0 && vueSelect.open;
    },

    dropdownRuanganOpen(vueSelect) {
      if (Array.isArray(this.list_ruangan) && this.list_ruangan.length) {
        return vueSelect.open;
      }

      return vueSelect.search.length !== 0 && vueSelect.open;
    },

    onSearchGudang(search, loading) {
      if (search.length) {
        loading(true);
        this.handleSearchGudang(loading, search, this);
      }
    },

    onSearchRuangan(search, loading) {
      if (search.length) {
        loading(true);
        this.handleSearchRuangan(loading, search, this);
      }
    },

    handleSearchGudang: debounce((loading, search, vm) => {
      GudangNetwork.getListGudang({
        search: search,
      })
        .then((response) => {
          vm.list_gudang = response?.data?.rows;
          loading(false);
        })
        .catch((error) => {
          loading(false);
          vm.$store.dispatch("toast/showToastError", {
            error: error,
          });
        });
    }, 500),

    handleSearchRuangan: debounce((loading, search, vm) => {
      RuanganNetwork.getListRuangan({
        search: search,
      })
        .then((response) => {
          vm.list_ruangan = response?.data?.rows;
          loading(false);
        })
        .catch((error) => {
          loading(false);
          vm.$store.dispatch("toast/showToastError", {
            error: error,
          });
        });
    }, 500),

    handleSelectedSpace(value) {
      const isIncluded =
        this.selectedSpace.findIndex((spaceId) => spaceId == value) != -1
          ? true
          : false;

      if (isIncluded) {
        const list = this.selectedSpace.filter((spaceId) => spaceId != value);
        this.$store.commit("ruangan/SET_SELECTED_SPACE", list);
      } else {
        const list = [...this.selectedSpace, value];
        this.$store.commit("ruangan/SET_SELECTED_SPACE", list);
      }
    },

    handleResetSelectedSpace() {
      this.$store.commit("ruangan/SET_SELECTED_SPACE", []);
    },

    setSelectedGudangId(value) {
      this.gudang_id = value;

      if (value) {
        this.$router.replace({
          path: this.$route.fullPath,
          query: { gudang_id: value?.id },
        });
      }
    },

    setSelectedRuanganId(value) {
      this.ruangan_id = value;
      if (value) {
        this.$router.replace({
          path: this.$route.fullPath,
          query: { ruangan_id: value?.id },
        });
      }
    },
  },

  watch: {
    ruangan_id: function (value) {
      if (value) {
        this.getRuanganDetailList({ id: value?.id });
        this.getRuanganById({
          id: this.ruanganIdQuery || this.detail?.id,
          isAlreadyMounted: true,
        });
      }
    },
  },

  mounted() {
    this.isLoading = true;

    let loader = this.$loading.show();

    this.getListGudang({});
    this.getListRuangan({});

    this.getRuanganById({ id: this.ruanganIdQuery || this.detail?.id })
      .then(() => {
        this.isLoading = false;
        loader.hide();
      })
      .catch((error) => {
        this.isLoading = false;
        loader.hide();
      });
  },

  beforeDestroy() {
    this.$store.commit("ruangan/SET_SELECTED_SPACE", []);
  },
};
</script>

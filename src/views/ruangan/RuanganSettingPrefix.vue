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
          <div class="d-flex align-items-center row pb-2 gap-3 gap-md-0">
            <div class="col-md-6">
              <label class="form-label">Nama Gudang :</label>
              <v-select
                @search="onSearchGudang"
                label="id"
                placeholder="Cari dan Pilih Gudang"
                :options="list_gudang.data"
                :clearable="true"
                :filterable="false"
                :value="gudang"
                @input="setSelectedGudang"
                :tabindex="1"
              >
                <template slot="no-options"> Gudang tidak tersedia </template>

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
                  <input class="vs__search" v-bind="attributes" v-on="events" />
                </template>
              </v-select>
            </div>
            <div class="col-md-6">
              <label class="form-label">Nama Ruangan :</label>
              <v-select
                @search="onSearchRuangan"
                label="id"
                placeholder="Cari dan Pilih Ruangan"
                :options="list_ruangan.data"
                :clearable="true"
                :filterable="false"
                :value="ruangan"
                @input="setSelectedRuangan"
                :tabindex="2"
              >
                <template slot="no-options"> Ruangan tidak tersedia </template>

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
                  <input class="vs__search" v-bind="attributes" v-on="events" />
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
              class="col-md-12 d-flex justify-content-end align-items-center"
            >
              <BaseButton
                className="btn btn-primary me-1"
                :access="['masterrakadd', 'masterruanganadd']"
                :title="`Kirim Data Penambahan Prefix ${
                  totalSaved > 0 ? `(${totalSaved})` : ''
                }`"
                :isDisabled="isLoading || !totalSaved"
                :isLoading="isLoading"
                data-bs-toggle="modal"
                data-bs-target="#modal_preview_send_prefix"
              >
                <template name="icon-left">
                  <tabler-icon icon="SendIcon"></tabler-icon>
                </template>
              </BaseButton>

              <BaseButton
                :isDisabled="isLoading || !totalSaved"
                :isLoading="isLoading"
                @click="handleResetSelectedData"
                className="btn btn-outline-danger "
                title="Reset"
              >
                <template name="icon-left">
                  <tabler-icon icon="RotateClockwiseIcon"></tabler-icon>
                </template>
              </BaseButton>
            </div>
          </div>

          <Spinner v-if="list_space.loading" />

          <div class="overflow-auto d-flex flex-row p-1 mx-1">
            <!-- Looping Row -->
            <template v-if="list_space.data.length && !list_space.loading">
              <template v-for="space in list_space.data">
                <!-- Border Row -->
                <div
                  :key="`space-${space?.row}`"
                  class="px-2 py-2 m-1 border rounded"
                >
                  <h6 class="section-label text-center mb-2 text-primary">
                    Row {{ space?.row }}
                  </h6>

                  <!-- Looping Space / Details -->
                  <div class="d-flex flex-row">
                    <template v-if="space.details.length > 1">
                      <template
                        v-for="detail in space.details"
                        class="d-flex flex-row bg-danger"
                      >
                        <div
                          :key="`space-${space?.row}-detail-${detail?.lebar}`"
                          class="card shadow-none cursor-pointer border rounded me-1 mb-0"
                          :class="{
                            'bg-success': isSelected(
                              `R${space?.row}.C${detail?.lebar}`
                            ),
                            'bg-primary':
                              detail?.data &&
                              !isSelected(`R${space?.row}.C${detail?.lebar}`),
                            'bg-light':
                              !isSelected(`R${space?.row}.C${detail?.lebar}`) &&
                              !detail?.data,
                          }"
                        >
                          <div
                            @click="
                              handleSelectedData({
                                key: `R${space?.row}.C${detail?.lebar}`,
                                prefix: detail?.data?.prefix,
                                ruang_row: space?.row,
                                lebar: detail?.lebar,
                                detail: detail,
                                space: space,
                              })
                            "
                            class="card-body d-flex flex-column justify-content-center align-items-center text-center rounded"
                            data-bs-toggle="modal"
                            data-bs-target="#modal_add_prefix"
                          >
                            <span
                              class="section-label d-flex justify-content-center align-items-center text-center prefix-item"
                              :class="[
                                detail?.data ||
                                isSelected(`R${space?.row}.C${detail?.lebar}`)
                                  ? 'text-white'
                                  : 'text-body',
                              ]"
                            >
                              {{
                                detail?.data &&
                                !isSelected(`R${space?.row}.C${detail?.lebar}`)
                                  ? detail?.data?.prefix
                                  : isSelected(
                                      `R${space?.row}.C${detail?.lebar}`
                                    )
                                  ? `${labelKeySelected(
                                      `R${space?.row}.C${detail?.lebar}`
                                    )}`
                                  : "Belum Ada Prefix"
                              }}
                            </span>
                          </div>
                        </div>
                      </template>
                    </template>

                    <!-- Belum Tersedia -->
                    <div v-if="space.details.length < 1" class="h-100">
                      <div class="card shadow-none">
                        <div
                          class="card-body d-flex flex-column justify-content-center align-items-center text-center rounded"
                        >
                          <tabler-icon
                            icon="CircleXIcon"
                            class="text-danger"
                            size="20"
                          />
                          <span
                            class="section-label text-center text-body mt-1"
                          >
                            Rak tidak tersedia
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </template>
          </div>

          <div class="mt-3 mb-2">
            <h6 class="section-label text-center">Keterangan</h6>
            <div>
              <div class="d-flex justify-content-center align-items-center">
                <div class="me-2">
                  <span class="bullet bullet-sm bg-primary me-1"></span>Prefix
                  Sudah Ditambahkan
                </div>
                <div class="me-2">
                  <span class="bullet bullet-sm bg-success me-1"></span>Prefix
                  <b>Baru</b> Diubah atau Ditambahkan
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ModalAddPrefix
      :isShowModal="isShowModal"
      @close="handleCloseModal"
      @success="handleSuccessModal"
    />

    <ModalPreviewSendPrefix
      :isShowModalPreview="isShowModalPreview"
      :ruanganId="ruanganIdQuery"
      @close="handleCloseModalPreview"
      @success="handleSuccessPreviewModal"
    />
  </div>
</template>

<script>
import RuanganNetwork from "@/network/lib/ruangan";
import GudangNetwork from "@/network/lib/gudang";

import debounce from "lodash.debounce";

import BreadCrumb from "@/components/BreadCrumb/BreadCrumb.vue";
import BaseButton from "@/components/Button/BaseButton.vue";
import Spinner from "@/components/Loading/Spinner.vue";
import RuanganPrefixSpaceItem from "@/views/ruangan/components/RuanganPrefixSpaceItem.vue";
import ModalAddPrefix from "@/views/ruangan/components/ModalAddPrefix.vue";
import ModalPreviewSendPrefix from "@/views/ruangan/components/ModalPreviewSendPrefix.vue";

import VueCustomScrollbar from "vue-custom-scrollbar/src/vue-scrollbar.vue";

export default {
  name: "RuanganSettingPrefix",
  components: {
    BreadCrumb,
    BaseButton,
    RuanganPrefixSpaceItem,
    Spinner,
    VueCustomScrollbar,
    ModalAddPrefix,
    ModalPreviewSendPrefix,
  },

  data() {
    return {
      isShowModal: false,
      isShowModalPreview: false,
      isLoading: false,
      ruangan: null,
      ruangan_detail: {
        loading: false,
        data: {},
      },
      gudang: null,
      gudang_detail: {
        loading: false,
        data: {},
      },
      list_gudang: {
        loading: false,
        data: [],
      },
      list_ruangan: {
        loading: false,
        data: [],
      },
      list_space: {
        loading: false,
        data: [],
      },
    };
  },

  computed: {
    ruanganIdQuery() {
      return this.$route.query.ruangan_id;
    },
    gudangIdQuery() {
      return this.$route.query.gudang_id;
    },
    currentSavedDataModalPrefix() {
      return this.$store.getters["ruangan/getSavedDataModalPrefix"];
    },
    totalSaved() {
      let total = 0;
      if (
        Array.isArray(this.currentSavedDataModalPrefix) &&
        this.currentSavedDataModalPrefix.length
      ) {
        total = this.currentSavedDataModalPrefix.length;
      }

      return total;
    },
    isSelected() {
      return (key) => {
        const index = this.currentSavedDataModalPrefix.findIndex(
          (data) => data?.key == key
        );
        
        if (index != -1) {
          return true;
        } else {
          return false;
        }
      };
    },

    labelKeySelected() {
      return (key) => {
        const index = this.currentSavedDataModalPrefix.findIndex(
          (data) => data?.key == key
        );

        if (index != -1) {
          return this.currentSavedDataModalPrefix[index].prefix;
        }
      };
    },
  },

  methods: {
    handleCloseModalPreview() {
      this.toggleModalPreview(false);
    },

    handleCloseModal() {
      this.toggleModal(false);
    },

    toggleModalPreview(value) {
      this.isShowModalPreview = value;
    },

    toggleModal(value) {
      this.isShowModal = value;
    },

    toggleModalPreview(value) {
      this.isShowModalPreview = value;
    },

    handleSuccessModal({ data }) {
      this.$store.commit("ruangan/SET_SELECTED_SPACE_PREFIX", []);
      this.getRuanganPrefixById({
        id: this.ruanganIdQuery,
      });
    },

    handleSuccessPreviewModal() {
      this.handleResetSelectedData();
      this.getRuanganPrefixById({
        id: this.ruanganIdQuery,
      });
    },

    async getGudangById({ id }) {
      try {
        this.gudang_detail.loading = true;
        const response = await GudangNetwork.getGudangById({
          id,
        });

        if (response) {
          this.gudang_detail.loading = false;
          this.gudang_detail.data = response?.data;
          this.gudang = response?.data;
        }
      } catch (error) {
        this.gudang_detail.loading = false;
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },

    async getRuanganById({ id }) {
      try {
        this.ruangan_detail.loading = true;
        const response = await RuanganNetwork.getRuanganById({
          id,
        });

        if (response) {
          this.ruangan_detail.loading = false;
          this.ruangan_detail.data = response?.data;
          this.ruangan = response?.data;
        }
      } catch (error) {
        this.ruangan_detail.loading = false;
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },

    async getListGudang({ search }) {
      try {
        this.list_gudang.loading = true;
        const response = await GudangNetwork.getListGudang({
          search,
        });

        if (response) {
          this.list_gudang.loading = false;
          this.list_gudang.data = response?.data?.rows;
        }
      } catch (error) {
        this.list_gudang.loading = false;
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },

    async getListRuangan({ search }) {
      try {
        this.list_ruangan.loading = true;
        const response = await RuanganNetwork.getListRuangan({
          search,
        });

        if (response) {
          this.list_ruangan.loading = false;
          this.list_ruangan.data = response?.data?.rows;
        }
      } catch (error) {
        this.list_ruangan.loading = false;
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },

    async getRuanganPrefixById({ id }) {
      this.list_space.loading = true;

      try {
        const response = await RuanganNetwork.getRuanganPrefixById({
          id,
        });

        if (response) {
          const data = response?.data;

          this.list_space.data = data;
          this.list_space.loading = false;
        }
      } catch (error) {
        this.list_space.loading = false;
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
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
          vm.list_gudang.data = response?.data?.rows;
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
          vm.list_ruangan.data = response?.data?.rows;
          loading(false);
        })
        .catch((error) => {
          loading(false);
          vm.$store.dispatch("toast/showToastError", {
            error: error,
          });
        });
    }, 500),

    setSelectedGudang(value) {
      this.gudang = value;

      if (value) {
        this.$router.replace({
          path: this.$route.path,
          query: { ...this.$route.query, gudang_id: value?.id },
        });
      }
    },

    setSelectedRuangan(value) {
      this.ruangan = value;

      if (value) {
        this.$router.replace({
          path: this.$route.path,
          query: { ...this.$route.query, ruangan_id: value?.id },
        });
      }
    },

    handleSelectedData(value) {
      this.$store.commit("ruangan/SET_CURRENT_DATA_MODAL_PREFIX", value);
    },

    handleResetSelectedData() {
      this.$store.commit("ruangan/SET_SELECTED_SPACE_PREFIX", []);
      this.$store.commit("ruangan/SET_CURRENT_DATA_MODAL_PREFIX", {});
      this.$store.commit("ruangan/SET_SAVED_DATA_MODAL_PREFIX", []);
    },
  },

  watch: {
    ruangan: function (value) {
      if (value) {
        this.getRuanganPrefixById({
          id: this.ruanganIdQuery || value?.id,
        });
      }
    },
  },

  mounted() {
    // Get Default Option
    this.getListGudang({});
    this.getListRuangan({});

    // Get Params and get Detail
    if (this.gudangIdQuery) {
      this.getGudangById({ id: this.gudangIdQuery });
    }

    // Get Params and get Detail
    if (this.ruanganIdQuery) {
      this.getRuanganById({ id: this.ruanganIdQuery });
    }
  },

  beforeDestroy() {
    this.handleResetSelectedData();
  },
};
</script>

<style scoped>
.prefix-item {
  width: 50px;
  height: 50px;
}
</style>

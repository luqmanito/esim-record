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
            <div class="col-md-4">
              <label class="form-label">Nama Gudang :</label>
              <v-select
                class="vue-select-custom"
                @search="onSearchGudang"
                label="id"
                :placeholder="
                  list_gudang.loading ? 'Loading...' : 'Cari dan Pilih Gudang'
                "
                :options="list_gudang.data"
                :clearable="false"
                :filterable="false"
                :value="gudang"
                @input="setSelectedGudang"
                :tabindex="1"
              >
                <template slot="no-options">
                  {{
                    list_gudang.loading
                      ? "Mencari Gudang"
                      : "Gudang tidak tersedia"
                  }}
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
              </v-select>
            </div>
            <div class="col-md-4">
              <label class="form-label">Nama Ruangan :</label>
              <v-select
                class="vue-select-custom"
                @search="onSearchRuangan"
                label="id"
                :placeholder="
                  list_ruangan.loading ? 'Loading...' : 'Cari dan Pilih Ruangan'
                "
                :options="list_ruangan.data"
                :clearable="false"
                :filterable="false"
                :value="ruangan"
                @input="setSelectedRuangan"
                :tabindex="2"
              >
                <template slot="no-options">
                  {{
                    list_ruangan.loading
                      ? "Mencari Ruangan"
                      : "Ruangan tidak tersedia"
                  }}
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
              </v-select>
            </div>
            <div class="col-md-4">
              <label class="form-label">Area :</label>
              <v-select
                class="vue-select-custom"
                :searchable="false"
                label="row"
                :disabled="!ruangan"
                :placeholder="
                  list_space.loading ? 'Loading..' : 'Cari dan Pilih Area'
                "
                :options="list_space.data"
                :clearable="false"
                :filterable="false"
                :value="space"
                @input="setSelectedSpace"
                :tabindex="3"
              >
                <template slot="no-options">
                  {{
                    list_space.loading ? "Loading.." : "Area tidak tersedia "
                  }}
                </template>

                <template slot="option" slot-scope="option">
                  <div class="d-center">
                    {{ ruangan?.ruangan ? `${ruangan?.ruangan} - ` : "" }} R{{
                      option?.row
                    }}.C{{ option?.column }}
                  </div>
                </template>
                <template slot="selected-option" slot-scope="option">
                  <div class="selected d-center">
                    {{ ruangan?.ruangan ? `${ruangan?.ruangan} - ` : "" }} R{{
                      option?.row
                    }}.C{{ option?.column }}
                  </div>
                </template>
              </v-select>
            </div>
          </div>
        </div>

        <div class="card-body">
          <h3 v-if="space && ruangan" class="my-3 text-center">
            {{ ruangan?.ruangan }} - R{{ space?.row }}.C{{ space?.column }}

            <!-- Rak {{ rak_detail.data?.rak }} -->
          </h3>
          <div v-if="space" class="row my-3 mx-2">
            <Spinner v-if="rak_detail.loading" />

            <div
              v-if="isHaveDataRakDetail && !selectedRak"
              class="text-center mb-2"
            >
              <h6 class="section-label text-center mb-2 text-primary">
                Lebar Rak (Top View)
              </h6>
              <small v-if="!selectedRak" class="text-body"
                >(Pilih Salah Satu Untuk Melihat Detail Panjang Rak)</small
              >
            </div>

            <div
              v-if="isHaveDataRakDetail"
              class="overflow-auto border rounded p-1"
              :class="[!selectedRak ? 'col-md-12' : 'col-md-3']"
            >
              <div
                v-if="isHaveDataRakDetail && selectedRak"
                class="text-center mb-2"
              >
                <h6 class="section-label text-center text-primary mb-2">
                  Lebar Rak (Top View)
                </h6>
                <small v-if="!selectedRak" class="text-body"
                  >(Pilih Salah Satu Untuk Melihat Detail Panjang Rak)</small
                >
              </div>

              <div class="d-flex flex-row p-1 m-1">
                <template v-if="!rak_detail.loading">
                  <RakItem
                    v-for="(rak, index) in rak_detail.data?.lebar"
                    :key="`rak-${index}-${rak?.id}`"
                    :label="`L${index + 1}`"
                    :rak="rak"
                    :selectedRak="selectedRak"
                    @handle-selected="() => handleSelectedRak(rak)"
                  />
                </template>
              </div>
            </div>

            <div
              v-if="selectedRak"
              class="col-md-9 overflow-auto max-height-view-panjang-rak"
            >
              <h6 class="section-label text-center mb-2 text-primary bg-active">
                Panjang Rak {{ `L${selectedRak}` }} (Front View)
              </h6>

              <Spinner v-if="list_view_side_rak.loading" class="my-5" />

              <template
                v-if="
                  list_view_side_rak.data.length && !list_view_side_rak.loading
                "
              >
                <template v-for="(item, index) in list_view_side_rak.data">
                  <div
                    :key="`item-${index}`"
                    class="d-flex flex-row p-1 m-1 top-50 rounded border border-bottom-5"
                  >
                    <RakSideItem
                      v-for="panjang in item?.panjang"
                      :label="panjang?.code_prefix || panjang?.code"
                      :key="panjang?.code"
                      :status="panjang?.used"
                    />
                  </div>
                </template>
              </template>

              <div
                v-if="
                  !list_view_side_rak.data.length && !list_view_side_rak.loading
                "
              >
                <div class="h-100">
                  <h6 class="text-center my-5">Panjang Rak belum ditentukan</h6>
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="
              !isHaveDataRakDetail &&
              !rak_detail.loading &&
              !list_view_side_rak.loading &&
              space
            "
          >
            <div class="h-100">
              <h6 class="text-center my-5">Tidak ada rak ditemukan</h6>
            </div>
          </div>

          <div v-if="!ruanganIdQuery || !spaceIdQuery">
            <div class="h-100">
              <h6 class="text-center my-5">
                Silahkan Pilih Gudang, Ruangan, dan Area Terlebih Dahulu
              </h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RakNetwork from "@/network/lib/rak";
import RuanganNetwork from "@/network/lib/ruangan";
import GudangNetwork from "@/network/lib/gudang";
import debounce from "lodash.debounce";

import BreadCrumb from "@/components/BreadCrumb/BreadCrumb.vue";
import Spinner from "@/components/Loading/Spinner.vue";

import RakItem from "@/views/rak/components/RakItem.vue";
import RakSideItem from "@/views/rak/components/RakSideItem.vue";

import VueCustomScrollbar from "vue-custom-scrollbar/src/vue-scrollbar.vue";

export default {
  name: "Rak",
  components: {
    BreadCrumb,
    RakItem,
    RakSideItem,
    Spinner,
    VueCustomScrollbar,
  },
  data() {
    return {
      gudang: null,
      gudang_detail: {
        loading: false,
        data: {},
      },
      ruangan: null,
      ruangan_detail: {
        loading: false,
        data: {},
      },
      space: null,
      space_detail: {
        loading: false,
        data: {},
      },
      selected_space_id: {},
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
      isLoading: false,
      selectedRak: "",
      rak_detail: {
        loading: false,
        data: {},
      },
      list_view_side_rak: {
        loading: false,
        data: [],
      },
    };
  },

  computed: {
    isHaveDataRakDetail() {
      return Object.keys(this.rak_detail.data || {}).length > 0;
    },
    ruanganIdQuery() {
      return this.$route.query?.ruangan_id;
    },
    gudangIdQuery() {
      return this.$route.query?.gudang_id;
    },
    spaceIdQuery() {
      return this.$route.query?.space_id;
    },
  },
  methods: {
    // Get Detail for Fill Inital Value Name v-select
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

    async getSpaceRuanganDetailById({ id }) {
      try {
        this.space_detail.loading = true;
        const response = await RuanganNetwork.getRuanganDetailById({
          id,
        });

        if (response) {
          this.space_detail.loading = false;
          this.space_detail.data = response?.data;
          this.space = response?.data;
        }
      } catch (error) {
        this.space_detail.loading = false;
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

    async getSpaceByRuanganId({ ruangan_id }) {
      try {
        this.list_space.loading = true;
        const response = await RuanganNetwork.getSpaceByRuanganId({
          ruangan_id: ruangan_id,
        });

        if (response) {
          this.list_space.loading = false;
          this.list_space.data = response?.data;
        }
      } catch (error) {
        this.list_space.loading = false;
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },

    async getRakBySpaceId({ ruangan_id, space_id }) {
      try {
        this.rak_detail.loading = true;
        const response = await RakNetwork.getRakBySpaceId({
          ruangan_id,
          space_id,
        });

        if (response) {
          this.rak_detail.loading = false;
          this.rak_detail.data = response?.data;
        }
      } catch (error) {
        this.rak_detail.loading = false;
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },

    async getViewSideRakBySpaceId({ ruangan_id, space_id, lebar }) {
      try {
        this.list_view_side_rak.loading = true;
        const response = await RakNetwork.getViewSideRakBySpaceId({
          ruangan_id,
          space_id,
          lebar,
        });

        if (response) {
          this.list_view_side_rak.loading = false;
          this.list_view_side_rak.data = response?.data;
        }
      } catch (error) {
        this.list_view_side_rak.loading = false;
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },

    onSearchGudang(search, loading) {
      loading(true);
      this.handleSearchGudang(loading, search, this);
    },

    onSearchRuangan(search, loading) {
      loading(true);
      this.handleSearchRuangan(loading, search, this);
    },

    onSearchSpace(search, loading) {
      loading(true);
      this.handleSearchSpace(loading, search, this);
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

    handleSearchSpace: debounce((loading, search, vm) => {
      RuanganNetwork.getRuanganDetailList({
        id: this.ruangan?.id,
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
      if (value) {
        // const id = value?.id;
        this.gudang = value;
        this.$router.replace({
          path: this.$route.path,
          query: { gudang_id: value?.id },
        });
      }
    },

    setSelectedRuangan(value) {
      if (value) {
        // const id = value?.id;
        this.ruangan = value;
        this.$router.replace({
          path: this.$route.path,
          query: { ...this.$route.query, ruangan_id: value?.id },
        });
      }
    },

    setSelectedSpace(value) {
      if (value) {
        this.space = value;

        this.selectedRak = "";

        this.$router.replace({
          path: this.$route.path,
          query: { ...this.$route.query, space_id: value?.id },
        });
      }
    },

    handleSelectedRak(value) {
      this.selectedRak = value;
    },
  },

  watch: {
    ruangan: function (value) {
      if (value) {
        this.getSpaceByRuanganId({
          ruangan_id: value?.id,
        });
      }
    },
    space: function (value) {
      if (value) {
        this.getRakBySpaceId({
          ruangan_id: this.ruangan?.id,
          space_id: this.space?.id,
        });
      }
    },
    selectedRak: function (value) {
      if (value) {
        this.getViewSideRakBySpaceId({
          ruangan_id: this.ruangan?.id,
          space_id: this.space?.id,
          lebar: this.selectedRak,
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

    // Get Params and get Detail
    if (this.spaceIdQuery) {
      this.getSpaceRuanganDetailById({ id: this.spaceIdQuery });
    }
  },
};
</script>

<style scoped>
.max-height-view-panjang-rak {
  max-height: 655px;
}
</style>

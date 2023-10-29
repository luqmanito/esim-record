<template>
  <div class="my-2">
    <form ref="formAddBox" @submit.prevent="handleAddBox">
      <div class="d-flex row pb-2 gap-3 gap-md-0">
        <div class="col-12 col-md-4">
          <label class="form-label">Layanan</label>
          <v-select @search="onSearchLayanan" class="vue-select-custom" label="id" :placeholder="
            list_layanan.loading ? 'Loading...' : 'Cari dan Pilih Layanan'
          " :options="list_layanan.data" :clearable="true" :filterable="false" v-model="layanan" :tabindex="1"
            :class="{ 'invalid-v-select': isErrorLayanan }">
            <template slot="no-options">
              {{
                list_layanan.loading
                ? "Mencari Layanan"
                : "Layanan tidak tersedia"
              }}
            </template>

            <template slot="option" slot-scope="option">
              <div class="d-center">
                {{ option?.layanan }}
              </div>
            </template>

            <template slot="selected-option" slot-scope="option">
              <div class="selected d-center">
                {{ option?.layanan }}
              </div>
            </template>
          </v-select>

          <ErrorMessage :errors="v$.layanan.$errors" />
        </div>

        <div class="col-12 col-md-4">
          <label class="form-label">Dimensi Box</label>
          <v-select @search="onSearchDimensiBox" class="vue-select-custom" label="id" :placeholder="
            list_dimensi_box.loading
              ? 'Loading...'
              : 'Cari dan Pilih Dimensi Box'
          " :options="list_dimensi_box.data" :clearable="true" :filterable="false" v-model="dimensi_box" :tabindex="2"
            :class="{ 'invalid-v-select': isErrorDimensiBox }">
            <template slot="no-options">
              {{
                list_dimensi_box.loading
                ? "Mencari Dimensi Box"
                : "Dimensi Box tidak tersedia"
              }}
            </template>

            <template slot="option" slot-scope="option">
              <div class="d-center">
                {{ option?.box }}
              </div>
            </template>

            <template slot="selected-option" slot-scope="option">
              <div class="selected d-center">
                {{ option?.box }}
              </div>
            </template>
          </v-select>

          <ErrorMessage :errors="v$.dimensi_box.$errors" />
        </div>

        <div class="col-12 col-md-2">
          <label class="form-label">Jumlah Box</label>

          <input type="number" class="form-control" id="jumlah_box" name="jumlah_box" placeholder="Masukkan Jumlah Box"
            v-model="v$.jumlah_box.$model" tabindex="3" :class="{ 'is-invalid': isErrorJumlahBox }" />
          <ErrorMessage :errors="v$.jumlah_box.$errors" />
        </div>

        <div class="col-12 col-md-2 d-flex align-items-center d-block">
          <div class="mt-0" :class="[
            isErrorLayanan || isErrorJumlahBox || isErrorDimensiBox
              ? 'mt-0 mb-2'
              : 'mt-md-2',
          ]">
            <BaseButton type="submit" title="Tambah" :access="['arsippengajuan']">
              <template name="icon-left">
                <tabler-icon icon="PlusIcon"></tabler-icon>
              </template>
            </BaseButton>
          </div>
        </div>
      </div>
    </form>

    <div class="table-responsive mt-2 mb-2">
      <table class="table table-hover">
        <thead class="table-light">
          <tr>
            <th>No</th>
            <th>Layanan</th>
            <th>Dimensi Box</th>
            <th class="text-center">Jumlah Box</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          <template v-if="savedBox.length">
            <tr v-for="(box, index) in savedBox" :key="`saved-box-${index}-${box.id}`">
              <td>{{ index + 1 }}</td>
              <td>{{ box.layanan?.layanan }}</td>
              <td>{{ box.dimensi_box?.box }}</td>
              <td class="text-center">{{ box.jumlah_box }}</td>
              <td>
                <BaseButton @click="handleDeleteBox(box.id)" className="btn btn-sm btn-primary" data-bs-toggle="tooltip"
                  data-bs-placement="top" data-bs-original-title="Cancel" title="Cancel">
                  <tabler-icon class="me-25" icon="CircleXIcon" size="24" />
                </BaseButton>
              </td>
            </tr>
          </template>

          <template v-else>
            <tr>
              <td colspan="5" class="text-center">
                Belum Ada Data Box Ditambahkan
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div class="row py-3">
      <div class="col-lg-6 text-sm-center text-lg-start mb-sm-2 mb-lg-0">
        <BaseButton type="button" @click="handleClickAction({ type: 'back', urutan: currentStep?.urutan - 1 })"
          className="btn btn-outline-primary" title="Sebelumnya">
          <template #icon-left>
            <tabler-icon icon="ChevronLeftIcon" />
          </template>
        </BaseButton>
      </div>

      <div class="col-lg-6 text-sm-center text-lg-end mb-sm-2 mb-lg-0">
        <BaseButton v-if="currentStep?.penyimpananflow?.status == 'progress'" :isDisabled="!savedBox.length"
          @click="handleClickAction({ type: 'save', urutan: currentStep?.urutan })" type="button"
          className="btn btn-primary" title="Simpan">
          <template #icon-right>
            <tabler-icon icon="DeviceFloppyIcon" />
          </template>
        </BaseButton>

        <BaseButton v-else :isDisabled="!savedBox.length"
          @click="handleClickAction({ type: 'next', urutan: currentStep?.urutan + 1 })" type="button"
          className="btn btn-primary" title="Selanjutnya">
          <template #icon-right>
            <tabler-icon icon="ChevronRightIcon" />
          </template>
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script>
import debounce from "lodash.debounce";

import { useVuelidate } from "@vuelidate/core";
import { required, helpers, minValue } from "@vuelidate/validators";

import LayananNetwork from "@/network/lib/layanan";
import BoxNetwork from "@/network/lib/box";

import BaseButton from "@/components/Button/BaseButton.vue";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage.vue";

export default {
  name: "ViewTabInputDataBox",
  components: {
    BaseButton,
    ErrorMessage,
  },
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      layanan: null,
      list_layanan: {
        loading: false,
        data: [],
      },
      dimensi_box: null,
      list_dimensi_box: {
        loading: false,
        data: [],
      },
      jumlah_box: "",
    };
  },

  computed: {
    currentStep() {
      return this.$store.state.pengajuanPenyimpanan.currentStep;
    },
    isErrorLayanan() {
      return (
        Array.isArray(this.v$.layanan.$errors) && this.v$.layanan.$errors.length
      );
    },
    isErrorDimensiBox() {
      return (
        Array.isArray(this.v$.dimensi_box.$errors) &&
        this.v$.dimensi_box.$errors.length
      );
    },
    isErrorJumlahBox() {
      return (
        Array.isArray(this.v$.jumlah_box.$errors) &&
        this.v$.jumlah_box.$errors.length
      );
    },
    savedBox() {
      return this.$store.state.pengajuanPenyimpanan.fjb?.savedBox;
    },
    dataPenyimpananBox() {
      return this.$store.state.pengajuanPenyimpanan.detail?.penyimpananbox;
    },
  },

  validations() {
    return {
      layanan: {
        required: helpers.withMessage("Silahkan pilih layanan", required),
      },
      dimensi_box: {
        required: helpers.withMessage("Silahkan pilih dimensi box", required),
      },
      jumlah_box: {
        required: helpers.withMessage("Silahkan isi jumlah box", required),
        minValue: helpers.withMessage(
          "Nilai Jumlah Box minimal 1",
          minValue(1)
        ),
      },
    };
  },

  methods: {
    onSearchLayanan(search, loading) {
      loading(true);
      this.handleSearchLayanan(loading, search, this);
    },

    onSearchDimensiBox(search, loading) {
      loading(true);
      this.handleSearchDimensiBox(loading, search, this);
    },

    async getListLayanan() {
      this.list_layanan.loading = true;
      try {
        const response = await LayananNetwork.getListLayanan({});

        if (response) {
          this.list_layanan.loading = false;
          this.list_layanan.data = response?.data?.rows;
        }
      } catch (error) {
        this.list_layanan.loading = false;
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },

    async getListDimensionBox() {
      this.list_dimensi_box.loading = true;

      try {
        const response = await BoxNetwork.getListDimensionBox({});

        if (response) {
          this.list_dimensi_box.loading = false;
          this.list_dimensi_box.data = response?.data?.rows;
        }
      } catch (error) {
        this.list_dimensi_box.loading = false;
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },

    async handleAddBox() {
      const result = await this.v$.$validate();

      if (result) {
        /* Random Unique ID
        const id = Math.floor(
          Math.random() * Math.floor(Math.random() * Date.now())
        );
        */

        const id = `${this.layanan.id}-${this.dimensi_box.id}`;

        let listSavedBox = this.savedBox;

        const indexSaved = listSavedBox.findIndex((saved) => saved?.id == id);

        if (indexSaved != -1) {
          const dataSaved = listSavedBox[indexSaved];
          listSavedBox.splice(indexSaved, 1, {
            ...dataSaved,
            jumlah_box:
              parseInt(listSavedBox[indexSaved].jumlah_box) +
              parseInt(this.jumlah_box),
          });
        } else {
          listSavedBox.push({
            id: id,
            layanan: this.layanan,
            dimensi_box: this.dimensi_box,
            jumlah_box: this.jumlah_box,
          });
        }

        this.$store.commit(
          "pengajuanPenyimpanan/SET_FJB_SAVED_BOX",
          listSavedBox
        );

        this.resetForm();
      }
    },

    handleDeleteBox(id) {
      const filtered = this.savedBox.filter((item) => item?.id != id);

      this.$store.commit("pengajuanPenyimpanan/SET_FJB_SAVED_BOX", filtered);
    },

    handleClickAction({ type, urutan }) {
      this.$emit("handle-click-action", { type, urutan });
    },

    resetState() {
      this.layanan = null;
      this.dimensi_box = null;
      this.jumlah_box = "";
    },

    resetForm() {
      this.resetState();
      this.$refs.formAddBox.reset();
      this.v$.$reset();
    },

    handleSearchLayanan: debounce((loading, search, vm) => {
      LayananNetwork.getListLayanan({
        search: search,
      })
        .then((response) => {
          vm.list_layanan.data = response?.data?.rows;
          loading(false);
        })
        .catch((error) => {
          loading(false);
          vm.$store.dispatch("toast/showToastError", {
            error: error,
          });
        });
    }, 500),

    handleSearchDimensiBox: debounce((loading, search, vm) => {
      BoxNetwork.getListDimensionBox({
        search: search,
      })
        .then((response) => {
          vm.list_dimensi_box.data = response?.data?.rows;
          loading(false);
        })
        .catch((error) => {
          loading(false);
          vm.$store.dispatch("toast/showToastError", {
            error: error,
          });
        });
    }, 500),
  },

  mounted() {
    Promise.all([this.getListLayanan(), this.getListDimensionBox()]).then(() => {
      if (this.list_dimensi_box.data.length) {
        this.dimensi_box = this.list_dimensi_box.data[0]
      }
    });

    if (this.dataPenyimpananBox) {
      const list = [];

      if (Array.isArray(this.dataPenyimpananBox)) {
        this.dataPenyimpananBox.map((item) => {
          list.push({
            id: `${item?.layanan?.id}-${item?.dimensibox?.id}`,
            layanan: item?.layanan,
            dimensi_box: item?.dimensibox,
            jumlah_box: item?.qty_box,
          });
        });

        this.$store.commit("pengajuanPenyimpanan/SET_FJB_SAVED_BOX", list);
      }
    }
  },
};
</script>
<template>
  <div class="content-wrapper">
    <div class="content-header row">
      <div class="content-header-left col-md-9 col-12 mb-2">
        <BreadCrumb :showHeader="true" />
      </div>
    </div>

    <div class="content-body">
      <div class="row">
        <div class="col-md-6">
          <div class="card mb-4">
            <div class="card-body">
              <form ref="formRuanganAdd" @submit.prevent="onSubmit">
                <div class="mb-2">
                  <label class="form-label" for="ruangan">Ruangan</label>
                  <input
                    type="text"
                    class="form-control"
                    id="ruangan"
                    name="ruangan"
                    placeholder="Silahkan Isi Ruangan"
                    v-model="v$.ruangan.$model"
                    tabindex="1"
                    :class="{ 'is-invalid': isErrorRuangan }"
                    :disabled="isLoading"
                  />
                  <ErrorMessage :errors="v$.ruangan.$errors" />
                </div>

                <div class="mb-2">
                  <label class="form-label" for="gudang_id">Gudang</label>

                  <!-- label as key each item -->
                  <!-- reduce on take id on selected item -->
                  <v-select
                    @search="onSearch"
                    label="id"
                    placeholder="Cari dan Pilih Gudang"
                    :options="list_gudang"
                    :clearable="true"
                    :filterable="false"
                    :disabled="isLoading"
                    v-model="gudang_id"
                    :dropdown-should-open="dropdownGudangOpen"
                    :class="[isErrorGudangId ? 'invalid-v-select' : '']"
                    :tabindex="2"
                  >
                    <template slot="no-options">
                      Gudang tidak tersedia
                    </template>

                    <template slot="option" slot-scope="option">
                      <div class="d-center">
                        {{ option.gudang }}
                      </div>
                    </template>
                    <template slot="selected-option" slot-scope="option">
                      <div class="selected d-center">
                        {{ option.gudang }}
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

                  <ErrorMessage :errors="v$.gudang_id.$errors" />
                </div>

                <div class="mb-2">
                  <label class="form-label" for="layanan_id">Layanan</label>

                  <v-select
                    @search="onSearchLayanan"
                    label="id"
                    placeholder="Cari dan Pilih Layanan"
                    :options="list_layanan"
                    :clearable="true"
                    :reduce="(option) => option.id"
                    :filterable="false"
                    :disabled="isLoading"
                    v-model="layanan_id"
                    :class="[isErrorLayananId ? 'invalid-v-select' : '']"
                    :tabindex="3"
                  >
                    <template slot="no-options">
                      Layanan tidak tersedia
                    </template>

                    <template slot="option" slot-scope="option">
                      <div class="d-center">
                        {{ option.layanan }}
                      </div>
                    </template>
                    <template slot="selected-option" slot-scope="option">
                      <div class="selected d-center">
                        {{ option.layanan }}
                      </div>
                    </template>
                  </v-select>

                  <ErrorMessage :errors="v$.layanan_id.$errors" />
                </div>

                <div :class="[change_row_and_capacity ? 'mb-1' : 'mb-2']">
                  <div class="form-check form-check-inline">
                    <input
                      id="change_row_and_capacity"
                      class="form-check-input"
                      type="checkbox"
                      v-model="change_row_and_capacity"
                    />
                    <label
                      class="form-check-label"
                      for="change_row_and_capacity"
                      >Ubah Kapasitas Baris dan Kolom</label
                    >
                  </div>
                </div>

                <div v-if="change_row_and_capacity" class="row mb-2">
                  <div class="col-md-6">
                    <label class="form-label" for="row_capacity"
                      >Kapasitas Baris</label
                    >
                    <input
                      type="number"
                      class="form-control"
                      id="row_capacity"
                      name="row_capacity"
                      placeholder="Masukkan Kapasitas Baris"
                      v-model="v$.row_capacity.$model"
                      tabindex="4"
                      :class="{ 'is-invalid': isErrorRowCapacity }"
                    />
                    <ErrorMessage :errors="v$.row_capacity.$errors" />
                  </div>

                  <div class="col-md-6">
                    <label class="form-label" for="column_capacity"
                      >Kapasitas Kolom</label
                    >
                    <input
                      type="number"
                      class="form-control"
                      id="column_capacity"
                      name="column_capacity"
                      placeholder="Masukkan Kapasitas Kolom"
                      v-model="v$.column_capacity.$model"
                      tabindex="5"
                      :class="{ 'is-invalid': isErrorColumnCapacity }"
                    />
                    <ErrorMessage :errors="v$.column_capacity.$errors" />
                  </div>
                </div>

                <div class="mb-2">
                  <label class="form-label" for="tipe">Status</label>

                  <select
                    id="status"
                    name="status"
                    v-model="v$.status.$model"
                    :disabled="isLoading"
                    tabindex="6"
                    :class="[
                      isErrorStatus ? 'is-invalid form-control' : 'form-select',
                    ]"
                  >
                    <option value="">Pilih Status</option>
                    <option
                      v-for="status in status_list"
                      :key="status.value"
                      :value="status.value"
                    >
                      {{ status.label }}
                    </option>
                  </select>
                  <ErrorMessage :errors="v$.status.$errors" />
                </div>

                <div class="mt-3">
                  <BaseButton
                    :disabled="isLoading"
                    @click="handleBack"
                    title="Batalkan"
                    className="btn btn-light me-sm-2 me-1"
                  >
                  </BaseButton>

                  <BaseButton
                    type="submit"
                    :disabled="isLoading"
                    :isLoading="isLoading"
                    title="Simpan"
                    :access="['masterruanganedit']"
                  >
                  </BaseButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import data_status_list from "@/data/status.json";

import { useVuelidate } from "@vuelidate/core";
import { required, helpers, maxLength, maxValue } from "@vuelidate/validators";
import debounce from "lodash.debounce";

import BreadCrumb from "@/components/BreadCrumb/BreadCrumb.vue";
import BaseButton from "@/components/Button/BaseButton.vue";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage.vue";

import RuanganNetwork from "@/network/lib/ruangan";
import GudangNetwork from "@/network/lib/gudang";
import LayananNetwork from "@/network/lib/layanan";

export default {
  name: "RuanganAdd",
  components: {
    BreadCrumb,
    BaseButton,
    ErrorMessage,
  },
  setup() {
    return { v$: useVuelidate() };
  },
  validationConfig: {
    $dirty: true,
  },
  data() {
    return {
      ruangan: "",
      gudang_id: "",
      layanan_id: "",
      row_capacity: "",
      column_capacity: "",
      change_row_and_capacity: false,
      status: "",
      status_list: data_status_list,
      list_gudang: [],
      list_layanan: [],
      isLoading: false,
      isSaveAndClear: false,
    };
  },
  computed: {
    isErrorRuangan() {
      return (
        Array.isArray(this.v$.ruangan.$errors) && this.v$.ruangan.$errors.length
      );
    },
    isErrorGudangId() {
      return (
        Array.isArray(this.v$.gudang_id.$errors) &&
        this.v$.gudang_id.$errors.length
      );
    },
    isErrorLayananId() {
      return (
        Array.isArray(this.v$.layanan_id.$errors) &&
        this.v$.layanan_id.$errors.length
      );
    },
    isErrorRowCapacity() {
      return (
        Array.isArray(this.v$.row_capacity.$errors) &&
        this.v$.row_capacity.$errors.length
      );
    },
    isErrorColumnCapacity() {
      return (
        Array.isArray(this.v$.column_capacity.$errors) &&
        this.v$.column_capacity.$errors.length
      );
    },
    isErrorStatus() {
      return (
        Array.isArray(this.v$.status.$errors) && this.v$.status.$errors.length
      );
    },
    idParams() {
      return this.$route.params?.id;
    },
  },
  validations() {
    return {
      ruangan: {
        required: helpers.withMessage("Silahkan isi ruangan", required),
        maxLength: helpers.withMessage(
          "Nama ruangan maksimal 50 kata",
          maxLength(50)
        ),
      },
      gudang_id: {
        required: helpers.withMessage("Silahkan pilih gudang", required),
      },
      layanan_id: {
        required: helpers.withMessage("Silahkan pilih layanan", required),
      },
      row_capacity: {
        required: helpers.withMessage("Silahkan isi kapasitas baris", required),
        maxValue: helpers.withMessage(
          "Nilai kapasitas baris tidak boleh lebih dari 100",
          maxValue(100)
        ),
      },
      column_capacity: {
        required: helpers.withMessage("Silahkan isi kapasitas kolom", required),
        maxValue: helpers.withMessage(
          "Nilai kapasitas kolom tidak boleh lebih dari 100",
          maxValue(100)
        ),
      },
      status: {
        required: helpers.withMessage("Silahkan pilih status", required),
      },
    };
  },
  methods: {
    dropdownGudangOpen(vueSelect) {
      if (Array.isArray(this.list_gudang) && this.list_gudang.length) {
        return vueSelect.open;
      }

      return vueSelect.search.length !== 0 && vueSelect.open;
    },

    toggleIsSaveAndClear(value) {
      this.isSaveAndClear = value;
    },

    async getListGudang() {
      try {
        const response = await GudangNetwork.getListGudang({});

        if (response) {
          this.list_gudang = response?.data?.rows;
        }
      } catch (error) {
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },

    async getRuanganById() {
      this.isLoading = true;

      let loader = this.$loading.show();

      try {
        const response = await RuanganNetwork.getRuanganById({
          id: this.idParams,
        });

        if (response) {
          const data = response?.data;

          this.ruangan = data?.ruangan;
          this.gudang_id = data?.gudang;
          this.layanan_id = data?.layanan;
          this.row_capacity = data?.row_capacity;
          this.column_capacity = data?.column_capacity;
          this.status = data?.status;
          this.isLoading = false;
          loader.hide();
        }
      } catch (error) {
        loader.hide();
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
          this.list_layanan = response?.data?.rows;
        }
      } catch (error) {
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },

    async onSubmit() {
      const result = await this.v$.$validate();

      if (result) {
        this.isLoading = true;

        try {
          const response = await RuanganNetwork.editRuangan({
            id: this.idParams,
            ruangan: this.ruangan,
            gudang_id: this.gudang_id?.id,
            layanan_id: this.layanan_id,
            change_row_and_capacity: this.change_row_and_capacity,
            row_capacity: this.row_capacity,
            column_capacity: this.column_capacity,
            status: this.status,
          });

          if (response) {
            this.isLoading = false;
            this.$store.dispatch("toast/showToastSuccess", {
              title: "Edit Data Ruangan",
              text: "Berhasil Merubah Data Ruangan",
            });

            if (this.isSaveAndClear) {
              this.resetForm();
            } else {
              this.handleBack();
            }
          }
        } catch (error) {
          this.isLoading = false;
          this.$store.dispatch("toast/showToastError", {
            error: error,
          });
        }
      }
    },

    handleBack() {
      this.$router.back();
    },

    resetState() {
      this.ruangan = "";
      this.gudang_id = "";
      this.layanan_id = "";
      this.row_capacity = "";
      this.column_capacity = "";
      this.status = "";
    },

    resetForm() {
      this.resetState();
      this.$refs.formRuanganAdd.reset();
      this.v$.$reset();
    },

    onSearch(search, loading) {
      loading(true);
      this.handleSearch(loading, search, this);
    },

    onSearchLayanan(search, loading) {
      loading(true);
      this.handleSearchLayanan(loading, search, this);
    },

    handleSearch: debounce((loading, search, vm) => {
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

    handleSearchLayanan: debounce((loading, search, vm) => {
      LayananNetwork.getListLayanan({
        search: search,
      })
        .then((response) => {
          vm.list_layanan = response?.data?.rows;
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
    this.getRuanganById();
    this.getListGudang();
    this.getListLayanan();
  },
};
</script>

<style scoped>
/* .vs__search {
  padding: 7px 12px;
  color: #6f6b7b;
  border-radius: 0.357rem;
} */

.invalid-v-select {
  border-color: #ea5455;
}
</style>

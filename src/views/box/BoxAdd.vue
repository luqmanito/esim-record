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
              <form ref="formBoxAdd" @submit.prevent="onSubmit">
                <div class="mb-2">
                  <label class="form-label" for="dimensi_box"
                    >Pilih Dimensi Box</label
                  >

                  <v-select
                    @search="onSearch"
                    label="id"
                    placeholder="Cari dan Pilih Dimensi Box"
                    :options="list_dimensi_box.data"
                    :clearable="true"
                    :reduce="(option) => option.id"
                    :filterable="false"
                    :disabled="isLoading"
                    :loading="list_dimensi_box.loading"
                    v-model="dimensi_box"
                    :class="[isErrorDimensiBox ? 'invalid-v-select' : '']"
                    :tabindex="1"
                  >
                    <template slot="no-options">
                      Dimensi Box tidak tersedia
                    </template>

                    <template slot="option" slot-scope="option">
                      <div class="d-center">
                        {{ option.box }}
                      </div>
                    </template>
                    <template slot="selected-option" slot-scope="option">
                      <div class="selected d-center">
                        {{ option.box }}
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

                  <ErrorMessage :errors="v$.dimensi_box.$errors" />
                </div>

                <div class="mb-2">
                  <label class="form-label" for="jumlah-box">Jumlah</label>

                  <input
                    type="number"
                    id="jumlah-box"
                    class="form-control"
                    placeholder="Masukkan Jumlah"
                    v-model="v$.quantity.$model"
                    tabindex="2"
                    :class="{ 'is-invalid': isErrorQuantity }"
                    :disabled="isLoading"
                  />
                  <ErrorMessage :errors="v$.quantity.$errors" />
                </div>

                <div class="mt-3">
                  <BaseButton
                    :disabled="isLoading"
                    @click="handleBack"
                    title="Batalkan"
                    className="btn btn-light me-sm-2 me-1"
                  >
                  </BaseButton>

                  <BaseDropdownButton
                    @click="isSaveAndClear = false"
                    type="submit"
                    :disabled="isLoading"
                    :isLoading="isLoading"
                    title="Simpan"
                    :access="['masterboxadd']"
                  >
                    <template #dropdown>
                      <BaseButton
                        @click="isSaveAndClear = true"
                        type="submit"
                        className="dropdown-item w-100"
                        title="Simpan & Reset"
                        :access="['masterboxadd']"
                      >
                      </BaseButton>

                      <BaseButton
                        @click="resetForm"
                        type="button"
                        className="dropdown-item w-100"
                        title="Reset"
                        :access="['masterboxadd']"
                      >
                      </BaseButton>
                    </template>
                  </BaseDropdownButton>
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
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";

import BoxNetwork from "@/network/lib/box";

import debounce from "lodash.debounce";

import BaseButton from "@/components/Button/BaseButton.vue";
import BaseDropdownButton from "@/components/Button/BaseDropdownButton.vue";
import BreadCrumb from "@/components/BreadCrumb/BreadCrumb.vue";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage.vue";

export default {
  name: "BoxAdd",
  components: {
    BaseButton,
    BaseDropdownButton,
    BreadCrumb,
    ErrorMessage,
  },
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      dimensi_box: "",
      quantity: "",
      list_dimensi_box: {
        loading: false,
        data: [],
      },
      isLoading: false,
      isSaveAndClear: false,
    };
  },
  computed: {
    isErrorDimensiBox() {
      return (
        Array.isArray(this.v$.dimensi_box.$errors) &&
        this.v$.dimensi_box.$errors.length
      );
    },
    isErrorQuantity() {
      return (
        Array.isArray(this.v$.quantity.$errors) &&
        this.v$.quantity.$errors.length
      );
    },
  },
  validations() {
    return {
      dimensi_box: {
        required: helpers.withMessage("Silahkan pilih dimensi box", required),
      },
      quantity: {
        required: helpers.withMessage("Silahkan isi jumlah", required),
      },
    };
  },
  methods: {
    async getListDimensionBox() {
      try {
        this.list_dimensi_box.loading = true;
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

    async onSubmit() {
      const result = await this.v$.$validate();

      if (result) {
        this.isLoading = true;

        try {
          const response = await BoxNetwork.createBox({
            dimensi_box_id: this.dimensi_box,
            qty: this.quantity,
          });

          if (response) {
            this.isLoading = false;
            this.$store.dispatch("toast/showToastSuccess", {
              title: "Tambah Data Box",
              text: "Berhasil Menambahkan Data Box",
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

    onSearch(search, loading) {
      loading(true);
      this.handleSearch(loading, search, this);
    },

    handleSearch: debounce((loading, search, vm) => {
      BoxNetwork.getListDimensionBox({
        search: search,
      })
        .then((response) => {
          vm.list_dimensi_box.data = response?.data?.rows;
          loading(false);
        })
        .catch((error) => {
          loading(false);
          this.$store.dispatch("toast/showToastError", {
            error: error,
          });
        });
    }, 500),

    handleBack() {
      this.$router.back();
    },

    resetState() {
      this.dimensi_box = "";
      this.quantity = "";
    },

    resetForm() {
      this.resetState();
      this.$refs.formBoxAdd.reset();
      this.v$.$reset();
    },
  },
  mounted() {
    this.getListDimensionBox();
  },
};
</script>

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
                  <label class="form-label" for="dimensi">Dimensi</label>
                  <input
                    type="text"
                    class="form-control"
                    id="dimensi"
                    name="dimensi"
                    placeholder="Masukkan Dimensi"
                    v-model="v$.dimensi.$model"
                    tabindex="1"
                    :class="{ 'is-invalid': isErrorDimensi }"
                    :disabled="isLoading"
                  />
                  <ErrorMessage :errors="v$.dimensi.$errors" />
                </div>

                <div class="mb-2">
                  <label class="form-label" for="dimensi">Deskripsi</label>

                  <textarea
                    rows="3"
                    class="form-control"
                    placeholder="Masukkan Deskripsi"
                    v-model="v$.deskripsi.$model"
                    tabindex="2"
                    :class="{ 'is-invalid': isErrorDeskripsi }"
                    :disabled="isLoading"
                  />

                  <ErrorMessage :errors="v$.deskripsi.$errors" />
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
                    :access="['masterboxdimensionadd']"
                  >
                    <template #dropdown>
                      <BaseButton
                        @click="isSaveAndClear = true"
                        type="submit"
                        className="dropdown-item w-100"
                        title="Simpan & Reset"
                        :access="['masterboxdimensionadd']"
                      >
                      </BaseButton>

                      <BaseButton
                        @click="resetForm"
                        type="button"
                        className="dropdown-item w-100"
                        title="Reset"
                        :access="['masterboxdimensionadd']"
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

import BaseButton from "@/components/Button/BaseButton.vue";
import BaseDropdownButton from "@/components/Button/BaseDropdownButton.vue";
import BreadCrumb from "@/components/BreadCrumb/BreadCrumb.vue";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage.vue";

export default {
  name: "BoxDimensionAdd",
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
      dimensi: "",
      deskripsi: "",
      isLoading: false,
      isSaveAndClear: false,
    };
  },
  computed: {
    isErrorDimensi() {
      return (
        Array.isArray(this.v$.dimensi.$errors) && this.v$.dimensi.$errors.length
      );
    },
    isErrorDeskripsi() {
      return (
        Array.isArray(this.v$.deskripsi.$errors) &&
        this.v$.deskripsi.$errors.length
      );
    },
  },
  validations() {
    return {
      dimensi: {
        required: helpers.withMessage("Silahkan isi dimensi", required),
      },
      deskripsi: {
        required: helpers.withMessage("Silahkan isi deskripsi", required),
      },
    };
  },
  methods: {
    async onSubmit() {
      const result = await this.v$.$validate();

      if (result) {
        this.isLoading = true;

        try {
          const response = await BoxNetwork.createDimensionBox({
            box: this.dimensi,
            deskripsi: this.deskripsi,
          });

          if (response) {
            this.isLoading = false;
            this.$store.dispatch("toast/showToastSuccess", {
              title: "Tambah Data Dimensi Box",
              text: "Berhasil Menambahkan Data Dimensi Box",
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
      this.dimensi = "";
      this.deskripsi = "";
    },

    resetForm() {
      this.resetState();
      this.$refs.formBoxAdd.reset();
      this.v$.$reset();
    },
  },
};
</script>

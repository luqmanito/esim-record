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
                  <label class="form-label" for="box">Box</label>
                  <input
                    type="text"
                    class="form-control"
                    id="box"
                    name="box"
                    placeholder="Masukkan Box"
                    v-model="v$.box.$model"
                    tabindex="1"
                    :class="{ 'is-invalid': isErrorBox }"
                    :disabled="isLoading"
                  />
                  <ErrorMessage :errors="v$.box.$errors" />
                </div>

                <div class="mb-2">
                  <label class="form-label" for="deskripsi">Deskripsi</label>

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

                  <BaseButton
                    type="submit"
                    :access="['masterboxdimensionedit']"
                    :disabled="isLoading"
                    :isLoading="isLoading"
                    title="Simpan"
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
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";

import BoxNetwork from "@/network/lib/box";

import BaseButton from "@/components/Button/BaseButton.vue";
import BreadCrumb from "@/components/BreadCrumb/BreadCrumb.vue";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage.vue";

export default {
  name: "BoxDimensionEdit",
  components: {
    BaseButton,
    BreadCrumb,
    ErrorMessage,
  },
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      box: "",
      deskripsi: "",
      isLoading: false,
      isSaveAndClear: false,
    };
  },
  computed: {
    isErrorBox() {
      return Array.isArray(this.v$.box.$errors) && this.v$.box.$errors.length;
    },
    isErrorDeskripsi() {
      return (
        Array.isArray(this.v$.deskripsi.$errors) &&
        this.v$.deskripsi.$errors.length
      );
    },
    idParams() {
      return this.$route.params?.id;
    },
  },
  validations() {
    return {
      box: {
        required: helpers.withMessage("Silahkan isi box", required),
      },
      deskripsi: {
        required: helpers.withMessage("Silahkan isi deskripsi", required),
      },
    };
  },
  methods: {
    async getDimensionBoxById({ id }) {
      this.isLoading = true;

      let loader = this.$loading.show();

      try {
        const response = await BoxNetwork.getDimensionBoxById({
          id,
        });

        if (response) {
          const data = response?.data;

          this.box = data?.box;
          this.deskripsi = data?.deskripsi;

          this.isLoading = false;
          loader.hide();
        }
      } catch (error) {
        this.isLoading = false;
        loader.hide();
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
          const response = await BoxNetwork.editDimensionBox({
            id: this.idParams,
            box: this.box,
            deskripsi: this.deskripsi,
          });

          if (response) {
            this.isLoading = false;
            this.$store.dispatch("toast/showToastSuccess", {
              title: "Edit Data Dimensi Box",
              text: "Berhasil Mengubah Data Dimensi Box",
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

  mounted() {
    this.getDimensionBoxById({ id: this.idParams });
  },
};
</script>

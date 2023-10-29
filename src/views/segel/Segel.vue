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
              <form ref="formSegel" @submit.prevent="onSubmit">
                <!-- Deskripsi Segel -->
                <!-- <div class="mb-2">
                  <label class="form-label" for="description"
                    >Nama / Deskripsi Segel</label
                  >
                  <input
                    type="text"
                    class="form-control"
                    id="description"
                    name="description"
                    placeholder="Silahkan Isi Deskripsi Segel"
                    v-model="v$.description.$model"
                    tabindex="1"
                    :class="{ 'is-invalid': isErrorDescription }"
                    :disabled="isLoading"
                  />
                  <ErrorMessage :errors="v$.description.$errors" />
                </div> -->

                <div class="mb-2">
                  <label class="form-label" for="description"
                    >Jumlah Segel</label
                  >

                  <input
                    type="number"
                    class="form-control"
                    id="value-segel"
                    name="value-segel"
                    placeholder="Masukkan Jumlah Segel"
                    v-model="v$.value.$model"
                    tabindex="1"
                    :class="{ 'is-invalid': isErrorValue }"
                    :disabled="isLoading"
                  />
                  <ErrorMessage :errors="v$.value.$errors" />
                </div>

                <div class="mt-3">
                  <BaseButton
                    type="submit"
                    :disabled="isLoading"
                    :isLoading="isLoading"
                    title="Simpan"
                    :access="['mastersegel', 'masterseal']"
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
import SegelNetwork from "@/network/lib/segel";

import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";

import BreadCrumb from "@/components/BreadCrumb/BreadCrumb.vue";
import BaseButton from "@/components/Button/BaseButton.vue";
import BaseDropdownButton from "@/components/Button/BaseDropdownButton.vue";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage.vue";

export default {
  name: "Segel",
  components: {
    BreadCrumb,
    BaseButton,
    BaseDropdownButton,
    ErrorMessage,
  },
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      description: "",
      value: "",
      isLoading: false,
    };
  },
  computed: {
    isErrorDescription() {
      return (
        Array.isArray(this.v$.description.$errors) &&
        this.v$.description.$errors.length
      );
    },
    isErrorValue() {
      return (
        Array.isArray(this.v$.value.$errors) && this.v$.value.$errors.length
      );
    },
  },
  validations() {
    return {
      value: {
        required: helpers.withMessage("Silahkan isi jumlah segel", required),
      },
    };
  },
  methods: {
    async onSubmit() {
      const result = await this.v$.$validate();

      if (result) {
        this.isLoading = true;

        try {
          const response = await SegelNetwork.pengaturanSegel({
            id: "d851936d-18a3-419d-bfa2-1f8d5d35e022",
            description: "Segel",
            value: this.value,
          });

          if (response) {
            this.isLoading = false;
            this.$store.dispatch("toast/showToastSuccess", {
              title: "Tambah Data Segel",
              text: "Berhasil Menambahkan Data Segel",
            });

            this.resetForm();
          }
        } catch (error) {
          this.isLoading = false;
          this.$store.dispatch("toast/showToastError", {
            error: error,
          });
        }
      }
    },

    resetState() {
      this.description = "";
      this.value = "";
    },

    resetForm() {
      this.resetState();
      this.$refs.formSegel.reset();
      this.v$.$reset();
    },
  },
};
</script>

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
              <form ref="formLayananAdd" @submit.prevent="onSubmit">
                <div class="mb-2">
                  <label class="form-label" for="layanan">Layanan</label>
                  <input
                    type="text"
                    class="form-control"
                    id="layanan"
                    name="layanan"
                    placeholder="Masukkan Nama Layanan"
                    v-model="v$.layanan.$model"
                    tabindex="1"
                    :class="{ 'is-invalid': isErrorLayanan }"
                    :disabled="isLoading"
                  />
                  <ErrorMessage :errors="v$.layanan.$errors" />
                </div>

                <div class="mb-2">
                  <label class="form-label" for="tipe">Tipe</label>

                  <select
                    id="tipe"
                    name="tipe"
                    v-model="v$.tipe.$model"
                    :disabled="isLoading"
                    tabindex="2"
                    :class="[
                      isErrorTipe ? 'is-invalid form-control' : 'form-select',
                    ]"
                  >
                    <option value="">Pilih Tipe</option>
                    <option
                      v-for="tipe in listTipe"
                      :key="`${tipe.key}-${tipe.value}`"
                      :value="tipe.value"
                    >
                      {{ tipe.label }}
                    </option>
                  </select>
                  <ErrorMessage :errors="v$.tipe.$errors" />
                </div>

                <div class="mb-2">
                  <label class="form-label" for="status">Status</label>

                  <select
                    id="status"
                    name="status"
                    v-model="v$.status.$model"
                    :disabled="isLoading"
                    tabindex="3"
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

                  <BaseDropdownButton
                    @click="isSaveAndClear = false"
                    type="submit"
                    :disabled="isLoading"
                    :isLoading="isLoading"
                    title="Simpan"
                    :access="['masterlayananadd']"
                  >
                    <template #dropdown>
                      <BaseButton
                        @click="isSaveAndClear = true"
                        type="submit"
                        className="dropdown-item w-100"
                        title="Simpan & Reset"
                        :access="['masterlayananadd']"
                      >
                      </BaseButton>

                      <BaseButton
                        @click="resetForm"
                        type="button"
                        className="dropdown-item w-100"
                        title="Reset"
                        :access="['masterlayananadd']"
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
import data_status_list from "@/data/status.json";

import LayananNetwork from "@/network/lib/layanan";
import dataTipe from "@/data/tipe.json";

import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";

import BaseButton from "@/components/Button/BaseButton.vue";
import BaseDropdownButton from "@/components/Button/BaseDropdownButton.vue";
import BreadCrumb from "@/components/BreadCrumb/BreadCrumb.vue";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage.vue";

export default {
  name: "LayananAdd",
  components: {
    BreadCrumb,
    ErrorMessage,
    BaseButton,
    BaseDropdownButton,
  },
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      layanan: "",
      tipe: "",
      status: "",
      status_list: data_status_list,
      listTipe: dataTipe,
      isLoading: false,
      isSaveAndClear: false,
    };
  },
  computed: {
    isErrorLayanan() {
      return (
        Array.isArray(this.v$.layanan.$errors) && this.v$.layanan.$errors.length
      );
    },
    isErrorTipe() {
      return Array.isArray(this.v$.tipe.$errors) && this.v$.tipe.$errors.length;
    },
    isErrorStatus() {
      return (
        Array.isArray(this.v$.status.$errors) && this.v$.status.$errors.length
      );
    },
  },
  validations() {
    return {
      layanan: {
        required: helpers.withMessage("Silahkan isi nama layanan", required),
      },
      tipe: {
        required: helpers.withMessage("Silahkan isi nama tipe", required),
      },
      status: {
        required: helpers.withMessage("Silahkan pilih status", required),
      },
    };
  },
  methods: {
    toggleIsSaveAndClear(value) {
      this.isSaveAndClear = value;
    },

    async onSubmit() {
      const result = await this.v$.$validate();

      if (result) {
        this.isLoading = true;

        try {
          const response = await LayananNetwork.createLayanan({
            layanan: this.layanan,
            tipe: this.tipe,
            status: this.status,
          });

          if (response) {
            this.isLoading = false;
            this.$store.dispatch("toast/showToastSuccess", {
              title: "Tambah Data Layanan",
              text: "Berhasil Menambahkan Data Layanan",
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
      this.layanan = "";
      this.tipe = "";
      this.status = "";
    },

    resetForm() {
      this.resetState();
      this.$refs.formLayananAdd.reset();
      this.v$.$reset();
    },
  },
};
</script>

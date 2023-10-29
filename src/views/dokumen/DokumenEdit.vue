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
              <form ref="formDokumenEdit" @submit.prevent="onSubmit">
                <div class="mb-2">
                  <label class="form-label" for="document">Dokumen</label>
                  <input
                    type="text"
                    class="form-control"
                    id="document"
                    name="document"
                    placeholder="Silahkan Isi Dokumen"
                    v-model="v$.document.$model"
                    tabindex="1"
                    :class="{ 'is-invalid': isErrorDocument }"
                    :disabled="isLoading"
                  />
                  <ErrorMessage :errors="v$.document.$errors" />
                </div>

                <div class="mb-2">
                  <label class="form-label" for="tipe-dokumen"
                    >Tipe Dokumen</label
                  >

                  <select
                    id="tipe-dokumen"
                    name="tipe-dokumen"
                    v-model="v$.type.$model"
                    :disabled="isLoading"
                    tabindex="2"
                    :class="[
                      isErrorType ? 'is-invalid form-control' : 'form-select',
                    ]"
                  >
                    <option value="">Silahkan Pilih Tipe Dokumen</option>
                    <option
                      v-for="type in list_type"
                      :key="type?.value"
                      :value="type?.value"
                    >
                      {{ type?.label }}
                    </option>
                  </select>
                  <ErrorMessage :errors="v$.type.$errors" />
                </div>

                <div class="mb-2">
                  <label class="form-label" for="jenis-layanan"
                    >Jenis Layanan</label
                  >

                  <select
                    id="jenis-layanan"
                    name="jenis-layanan"
                    v-model="v$.layanan.$model"
                    :disabled="isLoading"
                    tabindex="3"
                    :class="[
                      isErrorType ? 'is-invalid form-control' : 'form-select',
                    ]"
                  >
                    <option value="">Silahkan Pilih Jenis Layanan</option>
                    <option
                      v-for="layanan in list_layanan"
                      :key="layanan?.value"
                      :value="layanan?.value"
                    >
                      {{ layanan?.label }}
                    </option>
                  </select>
                  <ErrorMessage :errors="v$.layanan.$errors" />
                </div>

                <div class="mb-2">
                  <label class="form-label" for="urutan">Urutan</label>
                  <input
                    min="1"
                    type="number"
                    class="form-control"
                    id="urutan"
                    name="urutan"
                    placeholder="Silahkan Isi Urutan"
                    v-model="v$.orders.$model"
                    tabindex="4"
                    :class="{ 'is-invalid': isErrorOrders }"
                    :disabled="isLoading"
                  />
                  <ErrorMessage :errors="v$.orders.$errors" />
                </div>

                <div class="mb-2">
                  <label class="form-label" for="tipe">Status</label>

                  <select
                    id="status"
                    name="status"
                    v-model="v$.status.$model"
                    :disabled="isLoading"
                    tabindex="5"
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
                    :access="['masterdokumenedit']"
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

import DokumenNetwork from "@/network/lib/dokumen";

import tipeDokumen from "@/data/tipeDokumen.json";
import tipeLayananDokumen from "@/data/tipeLayananDokumen.json";

import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";

import BaseButton from "@/components/Button/BaseButton.vue";
import BaseDropdownButton from "@/components/Button/BaseDropdownButton.vue";
import BreadCrumb from "@/components/BreadCrumb/BreadCrumb.vue";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage.vue";

export default {
  name: "DokumentasiEdit",
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
      document: "",
      type: "",
      orders: "",
      layanan: "",
      status: "",
      status_list: data_status_list,
      list_type: tipeDokumen,
      list_layanan: tipeLayananDokumen,
      isLoading: false,
      isSaveAndClear: false,
    };
  },
  computed: {
    isErrorDocument() {
      return (
        Array.isArray(this.v$.document.$errors) &&
        this.v$.document.$errors.length
      );
    },
    isErrorType() {
      return Array.isArray(this.v$.type.$errors) && this.v$.type.$errors.length;
    },
    isErrorOrders() {
      return (
        Array.isArray(this.v$.orders.$errors) && this.v$.orders.$errors.length
      );
    },
    isErrorLayanan() {
      return (
        Array.isArray(this.v$.layanan.$errors) && this.v$.layanan.$errors.length
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
      document: {
        required: helpers.withMessage("Silahkan isi dokumen", required),
      },
      type: {
        required: helpers.withMessage("Silahkan pilih tipe dokumen", required),
      },
      orders: {
        required: helpers.withMessage("Silahkan isi urutan", required),
      },
      layanan: {
        required: helpers.withMessage("Silahkan pilih jenis layanan", required),
      },
      status: {
        required: helpers.withMessage("Silahkan pilih status", required),
      },
    };
  },
  methods: {
    async getDokumenById() {
      this.isLoading = true;

      let loader = this.$loading.show();

      try {
        const response = await DokumenNetwork.getDokumenById({
          id: this.idParams,
        });

        if (response) {
          const data = response?.data;

          this.document = data?.document;
          this.type = data?.type;
          this.orders = data?.orders;
          this.layanan = data?.layanan;
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

    async onSubmit() {
      const result = await this.v$.$validate();

      if (result) {
        this.isLoading = true;

        try {
          const response = await DokumenNetwork.editDokumen({
            id: this.idParams,
            document: this.document,
            type: this.type,
            orders: this.orders,
            layanan: this.layanan,
            status: this.status == 1 ? true : false,
          });

          if (response) {
            this.isLoading = false;
            this.$store.dispatch("toast/showToastSuccess", {
              title: "Tambah Data Dokumen",
              text: "Berhasil Menambahkan Data Dokumen",
            });

            this.handleBack();
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
  },

  mounted() {
    this.getDokumenById();
  },
};
</script>

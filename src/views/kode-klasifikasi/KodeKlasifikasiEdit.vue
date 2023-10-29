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
              <form ref="formKodeKlasifikasiAdd" @submit.prevent="onSubmit">
                <div class="mb-2">
                  <label class="form-label" for="kode-klasifikasi"
                    >Kode Klasifikasi</label
                  >
                  <input
                    type="text"
                    class="form-control"
                    id="kode-klasifikasi"
                    name="kode-klasifikasi"
                    placeholder="Masukkan Nama Kode Klasifikasi"
                    v-model="v$.kode_klasifikasi.$model"
                    tabindex="1"
                    :class="{ 'is-invalid': isErrorKodeKlasifikasi }"
                    :disabled="isLoading"
                  />
                  <ErrorMessage :errors="v$.kode_klasifikasi.$errors" />
                </div>

                <div class="mb-2">
                  <label class="form-label" for="status">Status</label>

                  <select
                    id="status"
                    name="status"
                    v-model="v$.status.$model"
                    :disabled="isLoading"
                    tabindex="2"
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
                    :access="['masterkodeklasifikasiedit']"
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

import KodeKlasifikasiNetwork from "@/network/lib/kode-klasifikasi";

import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";

import BaseButton from "@/components/Button/BaseButton.vue";
import BaseDropdownButton from "@/components/Button/BaseDropdownButton.vue";
import BreadCrumb from "@/components/BreadCrumb/BreadCrumb.vue";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage.vue";

export default {
  name: "KodeKlasifikasiEdit",
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
      kode_klasifikasi: "",
      status: "",
      status_list: data_status_list,
      isLoading: false,
      isSaveAndClear: false,
    };
  },
  computed: {
    isErrorKodeKlasifikasi() {
      return (
        Array.isArray(this.v$.kode_klasifikasi.$errors) &&
        this.v$.kode_klasifikasi.$errors.length
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
      kode_klasifikasi: {
        required: helpers.withMessage(
          "Silahkan isi kode klasifikasi",
          required
        ),
      },
      status: {
        required: helpers.withMessage("Silahkan pilih status", required),
      },
    };
  },
  methods: {
    async getKodeKlasifikasiById() {
      this.isLoading = true;

      let loader = this.$loading.show();

      try {
        const response = await KodeKlasifikasiNetwork.getKodeKlasifikasiById({
          id: this.idParams,
        });

        if (response) {
          const data = response?.data;

          this.kode_klasifikasi = data?.klasifikasi;
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
          const response = await KodeKlasifikasiNetwork.editKodeKlasifikasi({
            id: this.idParams,
            klasifikasi: this.kode_klasifikasi,
            status: this.status,
          });

          if (response) {
            this.isLoading = false;
            this.$store.dispatch("toast/showToastSuccess", {
              title: "Edit Data Kode Klasifikasi",
              text: "Berhasil Merubah Data Kode Klasifikasi",
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
    this.getKodeKlasifikasiById();
  },
};
</script>

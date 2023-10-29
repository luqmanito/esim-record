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
              <form @submit.prevent="onSubmit">
                <div class="mb-2">
                  <label class="form-label" for="kode">Kode</label>
                  <input
                    type="text"
                    class="form-control"
                    id="kode"
                    maxlength="3"
                    placeholder="Contoh : GD1"
                    v-model="v$.kode.$model"
                    tabindex="1"
                    :class="{ 'is-invalid': isErrorKode }"
                    :disabled="isLoading"
                  />
                  <ErrorMessage :errors="v$.kode.$errors" />
                </div>

                <div class="mb-2">
                  <label class="form-label" for="nama-gudang"
                    >Nama Gudang</label
                  >
                  <input
                    type="text"
                    class="form-control"
                    id="nama-gudang"
                    placeholder="Masukkan Nama Gudang"
                    v-model="v$.gudang.$model"
                    tabindex="2"
                    :class="{ 'is-invalid': isErrorGudang }"
                    :disabled="isLoading"
                  />
                  <ErrorMessage :errors="v$.gudang.$errors" />
                </div>

                <div class="mb-2">
                  <label class="form-label" for="nama-gudang"
                    >Alamat Gudang</label
                  >
                  <textarea
                    rows="3"
                    class="form-control"
                    placeholder="Masukkan Alamat Gudang"
                    v-model="v$.alamat.$model"
                    tabindex="3"
                    :class="{ 'is-invalid': isErrorAlamat }"
                    :disabled="isLoading"
                  />
                  <ErrorMessage :errors="v$.alamat.$errors" />
                </div>
                <div class="mb-2">
                  <label class="form-label" for="no-telepon">No Telepon</label>
                  <input
                    v-maska="no_tlp"
                    data-maska="+(##)-##########"
                    type="tel"
                    id="no-telepon"
                    class="form-control phone-mask"
                    placeholder="Contoh : +(62)-22750752323"
                    v-model="no_tlp_masked"
                    tabindex="4"
                    :class="{ 'is-invalid': isErrorTlp }"
                    :disabled="isLoading"
                  />
                  <ErrorMessage :errors="v$.no_tlp.unmasked.$errors" />
                </div>
                <div class="mb-2">
                  <label class="form-label" for="status">Status</label>
                  <select
                    type="text"
                    id="status"
                    placeholder="Pilih Status"
                    v-model="v$.status.$model"
                    tabindex="5"
                    :class="[
                      isErrorStatus ? 'is-invalid form-control' : 'form-select',
                    ]"
                    :disabled="isLoading"
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
                    title="Simpan"
                    className="btn btn-primary "
                    :disabled="isLoading"
                    :isLoading="isLoading"
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

import { vMaska } from "maska";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers, maxLength, minLength } from "@vuelidate/validators";

import GudangNetwork from "@/network/lib/gudang";
import BreadCrumb from "@/components/BreadCrumb/BreadCrumb.vue";
import BaseButton from "@/components/Button/BaseButton.vue";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage.vue";

export default {
  name: "GudangEdit",
  directives: { maska: vMaska },
  components: {
    BreadCrumb,
    ErrorMessage,
    BaseButton,
  },
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      kode: "",
      gudang: "",
      alamat: "",
      no_tlp_masked: "",
      no_tlp: {
        masked: "",
        unmasked: "",
        completed: false,
      },
      status: "",
      status_list: data_status_list,
      isLoading: false,
    };
  },
  mounted() {
    this.getGudangById();
  },
  computed: {
    isErrorKode() {
      return Array.isArray(this.v$.kode.$errors) && this.v$.kode.$errors.length;
    },
    isErrorGudang() {
      return (
        Array.isArray(this.v$.gudang.$errors) && this.v$.gudang.$errors.length
      );
    },
    isErrorAlamat() {
      return (
        Array.isArray(this.v$.alamat.$errors) && this.v$.alamat.$errors.length
      );
    },
    isErrorTlp() {
      return (
        Array.isArray(this.v$.no_tlp.unmasked.$errors) &&
        this.v$.no_tlp.unmasked.$errors.length
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
      kode: {
        required: helpers.withMessage("Silahkan isi kode", required),
        maxLength: helpers.withMessage("Maksimal Kode 3 Huruf", maxLength(3)),
      },
      gudang: {
        required: helpers.withMessage("Silahkan isi gudang", required),
      },
      alamat: {
        required: helpers.withMessage("Silahkan isi alamat", required),
      },
      no_tlp: {
        unmasked: {
          required: helpers.withMessage("Silahkan isi no telepon", required),
          maxLength: helpers.withMessage(
            "No telepon maksimal 15 angka",
            maxLength(15)
          ),
          minLength: helpers.withMessage(
            "No telepon minimal 6 angka",
            minLength(6)
          ),
        },
      },
      status: {
        required: helpers.withMessage("Silahkan pilih status", required),
      },
    };
  },
  methods: {
    async getGudangById() {
      this.isLoading = true;

      let loader = this.$loading.show();

      try {
        const response = await GudangNetwork.getGudangById({
          id: this.idParams,
        });

        if (response) {
          const data = response?.data;

          this.kode = data?.kode;
          this.gudang = data?.gudang;
          this.alamat = data?.alamat;
          this.no_tlp_masked = data?.no_tlp;
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
          const response = await GudangNetwork.editGudang({
            id: this.idParams,
            kode: this.kode,
            gudang: this.gudang,
            alamat: this.alamat,
            no_tlp: this.no_tlp.unmasked,
            status: this.status,
          });

          if (response) {
            this.isLoading = false;
            this.$store.dispatch("toast/showToastSuccess", {
              title: "Edit Data Gudang",
              text: "Berhasil Merubah Data Gudang",
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
};
</script>

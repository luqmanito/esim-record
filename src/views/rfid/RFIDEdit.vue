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
              <form ref="formRFIDEdit" @submit.prevent="onSubmit">
                <div class="mb-2">
                  <label class="form-label" for="gudang_id">Gudang</label>

                  <v-select
                    @search="onSearchGudang"
                    label="id"
                    placeholder="Cari dan Pilih Gudang"
                    :options="list_gudang.data"
                    :clearable="true"
                    :filterable="false"
                    :disabled="isLoading"
                    :loading="list_gudang.loading"
                    v-model="gudang"
                    :class="[isErrorGudang ? 'invalid-v-select' : '']"
                    :tabindex="1"
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

                  <ErrorMessage :errors="v$.gudang.$errors" />
                </div>

                <div class="mb-2">
                  <label class="form-label" for="rfid">RFID</label>
                  <input
                    type="text"
                    class="form-control"
                    id="rfid"
                    name="rfid"
                    placeholder="Silahkan Isi RFID"
                    v-model="v$.rfid.$model"
                    tabindex="2"
                    :class="{ 'is-invalid': isErrorRFID }"
                    :disabled="isLoading"
                    v-on:keyup.enter="onSubmit"
                  />
                  <ErrorMessage :errors="v$.rfid.$errors" />
                </div>

                <!-- Status -->
                <!-- If Need Toggle Status use This form -->
                <!-- <div class="mb-2">
                  <label class="form-label" for="tipe">Status</label>

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
                    <option value="">Silahkan Status</option>
                    <option value="1">Aktif</option>
                    <option value="0">Tidak Aktif</option>
                  </select>
                  <ErrorMessage :errors="v$.status.$errors" />
                </div> -->

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
                    :access="['masterrfidedit']"
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
import RFIDNetwork from "@/network/lib/rfid";
import GudangNetwork from "@/network/lib/gudang";

import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import debounce from "lodash.debounce";

import BaseButton from "@/components/Button/BaseButton.vue";
import BaseDropdownButton from "@/components/Button/BaseDropdownButton.vue";
import BreadCrumb from "@/components/BreadCrumb/BreadCrumb.vue";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage.vue";

export default {
  name: "RFIDEdit",
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
      rfid: "",
      gudang: "",
      status: 1,
      list_gudang: {
        loading: false,
        data: [],
      },
      isLoading: false,
    };
  },
  computed: {
    isErrorRFID() {
      return Array.isArray(this.v$.rfid.$errors) && this.v$.rfid.$errors.length;
    },
    isErrorGudang() {
      return (
        Array.isArray(this.v$.gudang.$errors) && this.v$.gudang.$errors.length
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
      rfid: {
        required: helpers.withMessage("Silahkan isi RFID", required),
      },
      gudang: {
        required: helpers.withMessage("Silahkan pilih gudang", required),
      },
      status: {
        required: helpers.withMessage("Silahkan pilih status", required),
      },
    };
  },

  methods: {
    async getListGudang() {
      this.list_gudang.loading = true;
      try {
        const response = await GudangNetwork.getListGudang({});

        if (response) {
          this.list_gudang.loading = false;
          this.list_gudang.data = response?.data?.rows;
        }
      } catch (error) {
        this.isLoading = false;
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },

    async getRFIDById() {
      this.isLoading = true;

      let loader = this.$loading.show();

      try {
        const response = await RFIDNetwork.getRFIDById({
          id: this.idParams,
        });

        if (response) {
          const data = response?.data;

          this.rfid = data?.rfid;
          this.gudang = data?.gudang;
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
          const response = await RFIDNetwork.editRFID({
            id: this.idParams,
            rfid: this.rfid,
            gudang_id: this.gudang?.id,
            status: this.status,
          });

          if (response) {
            this.isLoading = false;
            this.$store.dispatch("toast/showToastSuccess", {
              title: "Edit Data RFID",
              text: "Berhasil Merubah Data RFID",
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

    onSearchGudang(search, loading) {
      loading(true);
      this.handleSearchGudang(loading, search, this);
    },

    handleSearchGudang: debounce((loading, search, vm) => {
      GudangNetwork.getListGudang({
        search: search,
      })
        .then((response) => {
          vm.list_gudang.data = response?.data?.rows;
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
    Promise.all([this.getListGudang(), this.getRFIDById()]);
  },
};
</script>

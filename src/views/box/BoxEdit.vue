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
                  <label class="form-label" for="kode-seri">Kode Seri</label>

                  <input
                    type="text"
                    id="kode-seri"
                    class="form-control"
                    placeholder="Masukkan Kode Seri"
                    v-model="v$.serial_number.$model"
                    tabindex="2"
                    :class="{ 'is-invalid': isErrorSerialNumber }"
                    :disabled="isLoading"
                  />
                  <ErrorMessage :errors="v$.serial_number.$errors" />
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
                      v-for="item in list_status_box"
                      :key="item?.key"
                      :value="item?.value"
                    >
                      {{ item?.label }}
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
                    :access="['masterboxedit']"
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
import { required, helpers, maxLength } from "@vuelidate/validators";

import statusBox from "@/data/statusBox.json";
import BoxNetwork from "@/network/lib/box";

import debounce from "lodash.debounce";

import BaseButton from "@/components/Button/BaseButton.vue";
import BreadCrumb from "@/components/BreadCrumb/BreadCrumb.vue";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage.vue";

export default {
  name: "BoxAdd",
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
      dimensi_box: "",
      serial_number: "",
      status: "",
      list_status_box: statusBox,
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
    isErrorSerialNumber() {
      return (
        Array.isArray(this.v$.serial_number.$errors) &&
        this.v$.serial_number.$errors.length
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
      dimensi_box: {
        required: helpers.withMessage("Silahkan pilih dimensi box", required),
      },
      serial_number: {
        required: helpers.withMessage("Silahkan isi kode seri", required),
        maxLength: helpers.withMessage("", maxLength(50)),
      },
      status: {
        required: helpers.withMessage("Silahkan pilih status box", required),
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

    async getBoxById({ id }) {
      this.isLoading = true;

      let loader = this.$loading.show();

      try {
        const response = await BoxNetwork.getBoxById({
          id,
        });

        if (response) {
          const data = response?.data;

          this.dimensi_box = data?.dimensi?.id;
          this.serial_number = data?.serial_number;
          this.status = data?.status;

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
          const response = await BoxNetwork.editBox({
            id: this.idParams,
            serial_number: this.serial_number,
            dimensi_box_id: this.dimensi_box,
            status: this.status,
          });

          if (response) {
            this.isLoading = false;
            this.$store.dispatch("toast/showToastSuccess", {
              title: "Edit Data Box",
              text: "Berhasil Mengubah Data Box",
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
  },
  mounted() {
    Promise.all([
      this.getListDimensionBox(),
      this.getBoxById({ id: this.idParams }),
    ]);
  },
};
</script>

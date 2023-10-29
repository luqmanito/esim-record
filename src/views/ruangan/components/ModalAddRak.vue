<template>
  <BaseModal :open="isShowModal" id="modal_add_rak" :showFooter="false">
    <h1 class="text-center mb-1">Tambah atau Edit Rak</h1>
    <p class="text-center">
      Tambahkan Data Rak Baru atau Edit Data Rak yang tersimpan di database
    </p>

    <div class="d-flex justify-content-center align-items-center">
      <img
        src="/app-assets/images/rak-description.png"
        class="w-100"
        alt="rak"
      />
    </div>

    <form ref="formAddRak" class="mt-2" @submit.prevent="onSubmit">
      <div class="mb-2">
        <label class="form-label" for="box_id">Box</label>

        <!-- V-SELECT -->
        <!-- <v-select
          @search="onSearchBox"
          label="id"
          placeholder="Cari dan Pilih Box"
          :options="list_box"
          :clearable="true"
          :filterable="false"
          :disabled="isLoading"
          v-model="box_id"
          :class="[isErrorBoxId ? 'invalid-v-select' : '']"
          :tabindex="1"
        >
          <template slot="no-options"> Box tidak tersedia </template>

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
            <input class="vs__search" v-bind="attributes" v-on="events" />
          </template>
        </v-select> -->

        <select
          id="box"
          name="box"
          v-model="v$.box_id.$model"
          :disabled="isLoading"
          tabindex="1"
          :class="[isErrorBoxId ? 'is-invalid form-control' : 'form-select']"
        >
          <option value="">Pilih Box</option>
          <option
            v-for="box in list_box"
            :key="`${box.id}-${box.box}`"
            :value="box.id"
          >
            {{ box.box }}
          </option>
        </select>

        <ErrorMessage :errors="v$.box_id.$errors" />
      </div>

      <div class="mb-2">
        <label class="form-label" for="tinggi_rak">Tinggi</label>
        <input
          min="1"
          type="number"
          class="form-control"
          id="tinggi_rak"
          name="tinggi"
          placeholder="Silahkan Isi Tinggi Rak"
          v-model="v$.tinggi.$model"
          tabindex="2"
          :class="{ 'is-invalid': isErrorTinggi }"
          :disabled="isLoading"
        />
        <ErrorMessage :errors="v$.tinggi.$errors" />
      </div>
      <div class="mb-2">
        <label class="form-label" for="panjang_rak">Panjang</label>
        <input
          min="1"
          type="number"
          class="form-control"
          id="panjang_rak"
          name="panjang"
          placeholder="Silahkan Isi Panjang Rak"
          v-model="v$.panjang.$model"
          tabindex="3"
          :class="{ 'is-invalid': isErrorPanjang }"
          :disabled="isLoading"
        />
        <ErrorMessage :errors="v$.panjang.$errors" />
      </div>
      <div class="mb-2">
        <label class="form-label" for="lebar_rak">Lebar</label>
        <input
          min="1"
          type="number"
          class="form-control"
          id="lebar_rak"
          name="lebar"
          placeholder="Silahkan Isi Panjang Rak"
          v-model="v$.lebar.$model"
          tabindex="4"
          :class="{ 'is-invalid': isErrorLebar }"
          :disabled="isLoading"
        />
        <ErrorMessage :errors="v$.lebar.$errors" />
      </div>

      <div class="col-12 text-center mt-3">
        <BaseButton
          @click="$emit('close')"
          type="button"
          className="btn btn-light waves-effect"
          data-bs-dismiss="modal"
          aria-label="Close"
        >
          Batalkan
        </BaseButton>

        <BaseButton
          type="submit"
          className="btn btn-primary ms-1 waves-effect waves-float waves-light"
          :disabled="isLoading"
          :isLoading="isLoading"
          :access="['masterrakadd', 'masterruanganadd']"
          title="Simpan"
        >
        </BaseButton>
      </div>
    </form>
  </BaseModal>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { required, helpers, maxValue } from "@vuelidate/validators";
import debounce from "lodash.debounce";

import RakNetwork from "@/network/lib/rak";
import BoxNetwork from "@/network/lib/box";
import BaseModal from "@/components/Modal/BaseModal.vue";
import BaseButton from "@/components/Button/BaseButton.vue";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage.vue";

export default {
  name: "ModalAddRak",
  components: {
    BaseModal,
    ErrorMessage,
    BaseButton,
  },
  props: {
    isShowModal: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      box_id: "",
      panjang: "",
      tinggi: "",
      lebar: "",
      list_box: [],
      isLoading: false,
    };
  },
  setup() {
    return { v$: useVuelidate() };
  },
  validationConfig: {
    $dirty: true,
  },
  computed: {
    isErrorRak() {
      return Array.isArray(this.v$.rak.$errors) && this.v$.rak.$errors.length;
    },
    isErrorBoxId() {
      return (
        Array.isArray(this.v$.box_id.$errors) && this.v$.box_id.$errors.length
      );
    },
    isErrorPanjang() {
      return (
        Array.isArray(this.v$.panjang.$errors) && this.v$.panjang.$errors.length
      );
    },
    isErrorTinggi() {
      return (
        Array.isArray(this.v$.tinggi.$errors) && this.v$.tinggi.$errors.length
      );
    },
    isErrorLebar() {
      return (
        Array.isArray(this.v$.lebar.$errors) && this.v$.lebar.$errors.length
      );
    },
    ruang_detail_id() {
      return this.$store.getters["ruangan/getSelectedSpace"];
    },
  },
  validations() {
    return {
      box_id: {
        required: helpers.withMessage("Silahkan pilih box", required),
      },
      panjang: {
        required: helpers.withMessage("Silahkan isi panjang", required),
        maxValue: helpers.withMessage(
          "Nilai panjang tidak boleh lebih dari 150",
          maxValue(150)
        ),
      },
      tinggi: {
        required: helpers.withMessage("Silahkan isi tinggi", required),
        maxValue: helpers.withMessage(
          "Nilai tinggi tidak boleh lebih dari 150",
          maxValue(150)
        ),
      },
      lebar: {
        required: helpers.withMessage("Silahkan isi lebar", required),
        maxValue: helpers.withMessage(
          "Nilai lebar tidak boleh lebih dari 150",
          maxValue(150)
        ),
      },
    };
  },
  methods: {
    async onSubmit() {
      const result = await this.v$.$validate();

      if (result) {
        this.isLoading = true;

        try {
          const response = await RakNetwork.createRak({
            ruang_detail_id: this.ruang_detail_id,
            box_id: this.box_id,
            panjang: this.panjang,
            tinggi: this.tinggi,
            lebar: this.lebar,
          });

          if (response) {
            this.isLoading = false;
            this.$store.dispatch("toast/showToastSuccess", {
              title: "Tambah Data Ruangan",
              text: "Berhasil Membuat Data Rak",
            });

            this.$emit("success");
            document.getElementById("close_button_modal_modal_add_rak").click();
          }
        } catch (error) {
          this.isLoading = false;
          this.$store.dispatch("toast/showToastError", {
            error: error,
          });
        }
      }
    },

    async getListDimensionBox() {
      try {
        const response = await BoxNetwork.getListDimensionBox({});

        if (response) {
          this.list_box = response?.data?.rows;
        }
      } catch (error) {
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },

    dropdownBoxOpen(vueSelect) {
      if (Array.isArray(this.box_id) && this.box_id.length) {
        return vueSelect.open;
      }

      return vueSelect.search.length !== 0 && vueSelect.open;
    },

    onSearchBox(search, loading) {
      if (search.length) {
        loading(true);
        this.handleSearchBox(loading, search, this);
      }
    },

    handleSearchBox: debounce((loading, search, vm) => {
      BoxNetwork.getListDimensionBox({
        search: search,
      })
        .then((response) => {
          vm.list_box = response?.data?.rows;
          loading(false);
        })
        .catch((error) => {
          loading(false);
          this.$store.dispatch("toast/showToastError", {
            error: error,
          });
        });
    }, 500),

    resetState() {
      this.box_id = "";
      this.panjang = "";
      this.tinggi = "";
      this.lebar = "";
    },
    resetForm() {
      this.resetState();
      this.$refs.formAddRak.reset();
      this.v$.$reset();
    },
  },

  mounted() {
    this.getListDimensionBox();
  },
};
</script>

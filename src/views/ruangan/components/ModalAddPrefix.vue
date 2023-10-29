<template>
  <BaseModal
    :open="isShowModal"
    id="modal_add_prefix"
    :showFooter="false"
    :order="1"
  >
    <h1 class="text-center mb-1">Tambah atau Ubah Prefix</h1>
    <p class="text-center">Tambahkan atau Ubah Kode Prefix Rak</p>

    <form ref="formAddPrefix" class="mt-2" @submit.prevent="onSubmit">
      <div class="mb-2">
        <label class="form-label" for="prefix">Prefix</label>

        <input
          type="text"
          class="form-control"
          placeholder="Silahkan Isi Prefix"
          v-model="v$.prefix.$model"
          tabindex="1"
          :class="{ 'is-invalid': isErrorPrefix }"
          :disabled="isLoading"
        />

        <ErrorMessage :errors="v$.prefix.$errors" />
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

import BaseModal from "@/components/Modal/BaseModal.vue";
import BaseButton from "@/components/Button/BaseButton.vue";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage.vue";

export default {
  name: "ModalAddPrefix",
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
      key: "",
      prefix: "",
      ruang_row: "",
      lebar: "",
      listSelectedData: [],
      isLoading: false,
      detail: {},
      space: {},
    };
  },
  setup() {
    return { v$: useVuelidate() };
  },
  validationConfig: {
    $dirty: true,
  },
  computed: {
    isErrorPrefix() {
      return (
        Array.isArray(this.v$.prefix.$errors) && this.v$.prefix.$errors.length
      );
    },

    selectedData() {
      return this.$store.getters["ruangan/getSelectedSpacePrefix"];
    },

    currentDataModalPrefix() {
      return this.$store.getters["ruangan/getCurrentDataModalPrefix"];
    },

    currentSavedDataModalPrefix() {
      return this.$store.getters["ruangan/getSavedDataModalPrefix"];
    },
  },
  validations() {
    return {
      prefix: {
        required: helpers.withMessage("Silahkan isi prefix", required),
      },
    };
  },

  watch: {
    currentDataModalPrefix(value) {
      if (value) {
        this.ruang_row = value?.ruang_row;
        this.lebar = value?.lebar;
        this.prefix = value?.prefix;
        this.key = value?.key;
        this.detail = value?.detail;
        this.space = value?.space;
      }
    },
  },

  methods: {
    async onSubmit() {
      const result = await this.v$.$validate();

      if (result) {
        const form = {
          key: this.key,
          lebar: this.lebar,
          prefix: this.prefix,
          ruang_row: this.ruang_row,
        };

        /* If Need to Manipulate Detail and Space
        
        const detail = {
          ...this.detail,
          data: { ...this.detail?.data, ...form },
        };

        this.space.details[detail?.lebar - 1] = detail;
        */

        const payload = {
          ...form,
        };

        const isIncluded =
          this.currentSavedDataModalPrefix.findIndex(
            (saved) => saved?.key == this.key
          ) != -1
            ? true
            : false;

        if (isIncluded) {
          const list = this.currentSavedDataModalPrefix.filter(
            (saved) => saved?.key != this.key
          );

          this.$store.commit("ruangan/SET_SAVED_DATA_MODAL_PREFIX", [
            ...list,
            payload,
          ]);

          this.$store.commit("ruangan/SET_CURRENT_DATA_MODAL_PREFIX", {});

          this.resetForm();

          document
            .getElementById("close_button_modal_modal_add_prefix")
            .click();
        } else {
          const list = [...this.currentSavedDataModalPrefix, payload];
          this.$store.commit("ruangan/SET_SAVED_DATA_MODAL_PREFIX", list);

          this.$store.commit("ruangan/SET_CURRENT_DATA_MODAL_PREFIX", {});

          this.resetForm();

          document
            .getElementById("close_button_modal_modal_add_prefix")
            .click();
        }
      }
    },

    resetState() {
      this.prefix = "";
      this.ruang_row = "";
      this.lebar = "";
    },
    resetForm() {
      this.resetState();
      this.$refs.formAddPrefix.reset();
      this.v$.$reset();
    },
  },
};
</script>

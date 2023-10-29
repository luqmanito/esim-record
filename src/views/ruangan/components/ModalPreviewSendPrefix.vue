<template>
  <BaseModal
    :open="isShowModal"
    id="modal_preview_send_prefix"
    classNameModal="modal-lg"
    :showFooter="false"
    :order="2"
  >
    <h1 class="text-center mb-1">Kirimkan Data Penambahan Prefix</h1>
    <p class="text-center">Penambahan Kode Prefix pada Rak</p>

    <form ref="previewPrefix" class="mt-2" @submit.prevent="onSubmitPrefix">
      <div class="mt-3">
        <div v-if="!isLoading" class="col-md-12">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Prefix</th>
                  <th>Row</th>
                  <th>Lebar</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="currentSavedDataModalPrefix.length">
                  <tr
                    v-for="item in currentSavedDataModalPrefix"
                    :key="item?.key"
                  >
                    <td class="fw-bolder">
                      {{ item?.prefix || "-" }}
                    </td>
                    <td>
                      {{ item?.ruang_row || "-" }}
                    </td>
                    <td>
                      {{ item?.lebar || "-" }}
                    </td>
                    <td>
                      <BaseButton
                        @click="
                          handleDeleteSavedPrefix({
                            key: item?.key,
                          })
                        "
                        :access="['masterrakadd', 'masterruanganadd']"
                        className="btn btn-icon me-1"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        data-bs-original-title="Delete"
                      >
                        <tabler-icon class="me-25" icon="TrashIcon" size="24" />
                      </BaseButton>
                    </td>
                  </tr>
                </template>

                <template v-else>
                  <tr>
                    <td colspan="4" class="text-center">
                      Belum Ada Prefix Ditambahkan
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="col-12 text-center mt-3">
        <BaseButton
          @click="$emit('close')"
          type="button"
          className="btn btn-light waves-effect"
          data-bs-dismiss="modal"
          aria-label="Close"
        >
          Batal
        </BaseButton>

        <BaseButton
          type="submit"
          className="btn btn-primary ms-1 waves-effect waves-float waves-light"
          :disabled="isLoading || !currentSavedDataModalPrefix.length"
          :isLoading="isLoading"
          :access="['masterrakadd', 'masterruanganadd']"
          title="Kirim"
        >
          <template name="icon-left">
            <tabler-icon icon="SendIcon"></tabler-icon>
          </template>
        </BaseButton>
      </div>
    </form>
  </BaseModal>
</template>

<script>
import BaseModal from "@/components/Modal/BaseModal.vue";
import BaseButton from "@/components/Button/BaseButton.vue";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage.vue";

import RuanganNetwork from "@/network/lib/ruangan";

export default {
  name: "ModalPreviewSendPrefix",
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
    ruanganId: {
      type: String,
    },
  },
  data() {
    return {
      isLoading: false,
    };
  },
  computed: {
    currentSavedDataModalPrefix() {
      return this.$store.getters["ruangan/getSavedDataModalPrefix"];
    },
  },

  methods: {
    handleDeleteSavedPrefix({ key }) {
      const list = this.currentSavedDataModalPrefix.filter(
        (saved) => saved?.key != key
      );

      this.$store.commit("ruangan/SET_SAVED_DATA_MODAL_PREFIX", list);
    },

    async onSubmitPrefix() {
      try {
        this.isLoading = true;

        const response = await RuanganNetwork.createRuanganPrefixById({
          id: this.ruanganId,
          data: { data: this.currentSavedDataModalPrefix },
        });

        if (response) {
          this.isLoading = false;
          this.$store.dispatch("toast/showToastSuccess", {
            title: "Berhasil Menambah atau Mengubah Prefix",
            text: "Berhasil Menambah atau Mengubah Prefix",
          });

          document
            .getElementById("close_button_modal_modal_preview_send_prefix")
            .click();

          this.$emit("success");
        }
      } catch (error) {
        this.isLoading = false;
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },
  },
};
</script>

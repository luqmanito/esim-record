<template>
  <portal to="modal" :order="order">
    <div
      ref="baseModal"
      :id="id"
      class="modal fade"
      tabindex="-1"
      aria-modal="true"
      role="dialog"
    >
      <div class="modal-dialog modal-dialog-centered" :class="classNameModal">
        <div class="modal-content">
          <div class="modal-header bg-transparent">
            <slot name="header" />

            <BaseButton
              :id="`close_button_modal_${id}`"
              @click="$emit('close')"
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
            </BaseButton>
          </div>
          <div
            ref="modal-body"
            class="modal-body px-sm-5 mx-50 pb-4"
            :class="classNameModalBody"
          >
            <slot />
          </div>

          <div v-if="showFooter" class="modal-footer">
            <slot name="footer" />
            <BaseButton
              @click="$emit('close')"
              class="btn btn-primary"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              Tutup
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </portal>
</template>

<script>
import BaseButton from "@/components/Button/BaseButton.vue";

export default {
  name: "BaseModal",
  components: {
    BaseButton,
  },
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    order: {
      type: [String, Number],
      default: 1,
    },
    id: {
      type: String,
      required: true,
    },
    showFooter: {
      type: Boolean,
      default: true,
    },
    classNameModal: {
      type: String,
    },
    classNameModalBody: {
      type: String,
    },
  },
};
</script>

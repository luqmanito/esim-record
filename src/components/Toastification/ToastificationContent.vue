<template>
  <div class="toastification">
    <div class="d-flex align-items-center">
      <BAvatar :variant="variant" size="1.8rem" class="mr-75 flex-shrink-0 me-1">
        <tabler-icon v-if="icon" :icon="icon" size="21" />
      </BAvatar>

      <div class="d-flex flex-grow-1">
        <div>
          <h5
            v-if="title"
            class="mb-0 font-weight-bolder toastification-title text-white"
            :class="`text-${variant}`"
            v-text="title"
          />
          <small v-if="text" class="d-inline-block text-white" v-text="text" />
        </div>

        <span
          class="cursor-pointer toastification-close-icon ms-auto"
          @click="$emit('close-toast')"
        >
          <tabler-icon v-if="!hideClose" icon="XIcon" class="text-white" />
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { BAvatar } from "bootstrap-vue";

export default {
  name: "ToastificationContent",
  components: {
    BAvatar,
  },
  props: {
    variant: {
      type: String,
      default: "primary",
    },
    icon: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      default: null,
    },
    text: {
      type: String,
      default: null,
    },
    hideClose: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.toastification-close-icon,
.toastification-title {
  line-height: 26px;
}

.toastification-title {
  color: inherit;
}
</style>

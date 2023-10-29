<template>
  <div class="step" :class="[statusClass]" role="tab" :id="`${code}_trigger`">
    <button :disabled="isDisabled" type="button" class="step-trigger" @click="handleClickStep">
      <span class="bs-stepper-box">
        <div v-if="hasIconSlot">
          <slot name="icon" />
        </div>

        <slot></slot>
      </span>
      <span class="bs-stepper-label">
        <span class="bs-stepper-title text-capitalize">{{ title }}</span>
        <span class="bs-stepper-subtitle">{{ statusTitle }}</span>
      </span>
    </button>
  </div>
</template>

<script>
export default {
  name: "StepperHeaderItemPengajuan",
  props: {
    code: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    orders: {
      type: [String, Number],
    },
  },
  computed: {
    statusClass() {
      if (this.isDisabled) {
        return "";
      } else if (this.isActive) {
        return "active";
      } else if (this.isCompleted) {
        return "completed";
      } else {
        return "";
      }
    },
    statusTitle() {
      if (this.isActive) {
        return "Aktif";
      } else if (!this.isDisabled && !this.isCompleted) {
        return "Progress"
      } else if (this.isCompleted) {
        return "Selesai";
      } else {
        return "Belum Selesai";
      }
    },
    statusClassColorNavigation() {
      if (this.isActive) {
        return "text-primary";
      } else if (this.isCompleted) {
        return "text-success";
      } else {
        return "";
      }
    },
    hasIconSlot() {
      return !!this.$slots.icon;
    },
  },
  methods: {
    handleClickStep() {
      this.$emit("handle-click-step", this.key);
    },
  },
};
</script>

<style scoped>
.horizontal {
  cursor: grab;
  user-select: none;
}

.horizontal>>>.v-hl-btn-next {
  top: 0;
  bottom: 0;
  transform: translateX(0);
}

.horizontal>>>.v-hl-container {
  scroll-padding-left: 16px;
  scroll-padding-right: 16px;
}
</style>
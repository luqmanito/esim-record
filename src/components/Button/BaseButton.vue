<template>
  <button
    ref="base-button"
    :type="type"
    :disabled="isLoading || (access && !isHasAccess) || isDisabled"
    v-bind="$attrs"
    v-on="$listeners"
    :class="className"
  >
    <div
      v-if="isLoading"
      class="spinner-border spinner-border-sm"
      role="status"
    >
      <span class="visually-hidden">Loading...</span>
    </div>

    <div v-else>
      <slot name="icon-left" />
      <slot />
      {{ title }}
      <slot name="icon-right" />
    </div>
  </button>
</template>

<script>
export default {
  name: "BaseButton",
  props: {
    title: {
      type: String,
    },
    type: {
      type: String,
      default: "button",
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    className: {
      type: String,
      default: "btn btn-primary",
    },
    access: {
      type: Array,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isHasAccess() {
      const listAccess = this.$store.getters["auth/access"];

      if (this.access && Array.isArray(this.access)) {
        for (let i in this.access) {
          let isIncluded = listAccess.includes(this.access[i]);

          if (isIncluded) {
            return true;
          } else {
            return false;
          }
        }
      }
    },
  },
};
</script>

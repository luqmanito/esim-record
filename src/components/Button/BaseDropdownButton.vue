<template>
  <div class="btn-group" :class="classNameGroup">
    <button
      ref="base-dropdown-button"
      :type="type"
      :class="className"
      :disabled="isLoading || (access && !isHasAccess)"
      v-bind="$attrs"
      v-on="$listeners"
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
    <button
      :disabled="isLoading || (access && !isHasAccess)"
      type="button"
      :class="dropdownToggleClassName"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      <span class="visually-hidden">Toggle Dropdown</span>
    </button>
    <div class="dropdown-menu dropdown-menu-end">
      <slot name="dropdown"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "BaseDropdownButton",
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
    classNameGroup: {
      type: String,
    },
    className: {
      type: String,
      default: "btn btn-primary waves-effect",
    },
    dropdownToggleClassName: {
      type: String,
      default:
        "btn btn-primary dropdown-toggle dropdown-toggle-split waves-effect",
    },
    access: {
      type: Array,
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

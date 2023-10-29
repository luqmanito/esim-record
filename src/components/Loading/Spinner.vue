<template>
  <div
    class="text-center text-primary"
    :class="[
      isAbsolute ? 'position-absolute top-50 start-50 translate-middle' : '',
      className ? `${className}` : '',
    ]"
  >
    <div
      class="spinner-border"
      :class="[size === 'small' ? 'spinner-border-sm' : '']"
      role="status"
    >
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Spinner",
  props: {
    isAbsolute: {
      type: Boolean,
      default: false,
    },
    className: {
      type: String,
    },
    size: {
      type: String,
    },
  },
};
</script>

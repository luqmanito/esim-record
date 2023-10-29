<template>
  <div class="col-md-4 col-sm-12" :class="classContainer">
    <div class="card">
      <div class="card-body d-flex align-items-center justify-content-between">
        <div>
          <h3 class="fw-bolder mb-75">{{ value }}</h3>
          <span>{{ label }}</span>
        </div>
        <div :class="`avatar bg-light-${variant} p-50 cursor-default`">
          <span class="avatar-content cursor-default">
            <slot />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RFIDCardSummary",
  props: {
    value: {
      type: [String, Number],
    },
    label: {
      type: String,
    },
    variant: {
      type: String,
      default: "primary",
    },
    classContainer: {
      type: String,
    },
  },
};
</script>

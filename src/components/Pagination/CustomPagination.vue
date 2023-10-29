<template>
  <div
  class="d-flex align-items-center mx-2 row mt-2 mb-1"
  :class="[showMessage ? 'justify-content-between' : 'justify-content-end']"
  >
    <div v-if="showMessage" class="col-sm-12 col-md-6">
      <div class="dataTables_info" role="status">
        Menampilkan {{ currentDataLength }} dari {{ totalData }} Data
      </div>
    </div>
    <div :class="[showMessage ? 'col-sm-12 col-md-6' : 'col-md-12']">
      <div class="d-flex justify-content-end">
        <slot name="page"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CustomPagination",
  props: {
    currentDataLength: {
      type: [Number, String],
      default: 0,
    },
    totalData: {
      type: [Number, String],
      default: 0,
    },
    showMessage: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

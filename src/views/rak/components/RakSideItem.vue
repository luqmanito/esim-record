<template>
  <div class="rak-side-item">
    <div
      @click="handleSelected"
      class="card shadow-none border rounded"
    >
      <div
        class="card-body d-flex flex-column justify-content-center align-items-center text-center rounded"
        :class="[isUsed ? 'bg-primary text-white' : 'bg-light']"
      >
        {{ label }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RakSideItem",
  props: {
    id: {
      type: String,
    },
    label: {
      type: [String, Number],
    },
    status: {
      type: [String, Number],
    },
  },
  computed: {
    isUsed() {
      return parseInt(this.status) > 0;
    },
  },
  methods: {
    handleSelected() {
      this.$emit("handle-selected");
    },
  },
};
</script>

<style scoped>
.rak-side-item {
  height: 70px;
  width: 70px;
  margin: 5px;
}
</style>

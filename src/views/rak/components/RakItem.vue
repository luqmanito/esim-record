<template>
  <div class="rak-item">
    <div
      @click="handleSelected"
      class="card shadow-none border cursor-pointer rounded h-100"
    >
      <div
        class="card-body d-flex flex-column justify-content-center align-items-center text-center rounded"
        :class="classBackground"
      >
       {{ label }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RakItem",
  props: {
    id: {
      type: String,
    },
    label: {
      type: [String, Number],
    },
    rak: {
      type: [String, Number],
    },
    status: {
      type: [String, Number, Boolean],
    },
    selectedRak: {
      type: [String, Number],
    },
  },
  computed: {
    isActive() {
      return this.status == 1 ? true : false;
    },
    isSelected() {
      return this.selectedRak == this.rak;
    },
    classBackground() {
      if (this.isSelected) {
        return "bg-success text-white";
      } else {
        return "bg-light";
      }
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
.rak-item {
  height: 540px;
  width: 70px;
  margin: 5px;
}
</style>

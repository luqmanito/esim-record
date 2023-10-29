<template>
  <!-- if Need Btm Text -->
  <!-- :class="[isAlreadyBooked ? 'mb-2' : '']" -->

  <div class="space-item mb-2">
    <div
      @click="handleSelected"
      class="card shadow-none border cursor-pointer rounded"
    >
      <div
        class="card-body d-flex flex-column justify-content-center align-items-center text-center rounded"
        :class="classBackground"
        data-bs-toggle="tooltip"
        data-bs-html="true"
        data-bs-trigger="hover"
        :data-bs-original-title="`R${row}.C${column}`"
        :title="`R${row}.C${column}`"
      >
        <span>R{{ row }}.C{{ column }}</span>
      </div>

      <!-- if Need Btm Text -->
      <div v-if="isAlreadyBooked" class="text-center">
        <small class="text-body">
          <router-link
            :to="`/rak?gudang_id=${this.gudang_id?.id}&ruangan_id=${this.ruangan_id?.id}&space_id=${this.id}`"
            class="d-flex justify-content-center align-items-center py-50"
            :class="classText"
          >
            <tabler-icon icon="EyeIcon" size="14" />
            <span class="fw-bolder ms-25"> Detail </span>
          </router-link>
        </small>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RuanganSpaceItem",
  props: {
    id: {
      type: String,
    },
    row: {
      type: [String, Number],
    },
    column: {
      type: [String, Number],
    },
    status: {
      type: [String, Number, Boolean],
    },
    rak_count: {
      type: [String, Number],
    },
    gudang_id: {
      type: [String, Number, Object],
    },
    ruangan_id: {
      type: [String, Number, Object],
    },
    selectedSpace: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    isActive() {
      return this.status == 1 ? true : false;
    },
    isSelected() {
      return this.selectedSpace.findIndex((spaceId) => spaceId == this.id) != -1
        ? true
        : false;
    },
    isAlreadyBooked() {
      return parseInt(this.rak_count) > 0;
    },
    classBackground() {
      if (this.isAlreadyBooked && this.isSelected) {
        return "bg-success text-white";
      } else if (this.isAlreadyBooked) {
        return "bg-primary text-white";
      } else if (this.isSelected) {
        return "bg-success text-white";
      } else {
        return "bg-light";
      }
    },
    classText() {
      if (this.isAlreadyBooked && this.isSelected) {
        return "text-success";
      } else if (this.isAlreadyBooked) {
        return "text-primary";
      } else if (this.isSelected) {
        return "text-success";
      } else {
        return "text-body";
      }
    },
  },
  methods: {
    // Old Logic
    handleSelectSpace() {
      if (this.isAlreadyBooked && this.selectedSpace.length > 1) {
        return;
      }

      if (this.isAlreadyBooked && this.selectedSpace.length < 1) {
        this.$router.push(
          `/rak?gudang_id=${this.gudang_id?.id}&ruangan_id=${this.ruangan_id?.id}&space_id=${this.id}`
        );
        return;
      }

      this.handleSelected();
    },

    handleSelected() {
      this.$emit("handle-selected");
    },
  },
};
</script>

<style scoped>
.space-item {
  height: 70px;
  width: 70px;
  margin: 5px;
}

.not-allowed {
  cursor: not-allowed !important;
}
</style>

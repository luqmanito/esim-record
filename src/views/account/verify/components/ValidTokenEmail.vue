<template>
  <div>
    <h2 class="card-title fw-bold mb-1 text-center">
      Verifikasi Email <tabler-icon size="21" icon="MailIcon" />
    </h2>

    <p class="card-text text-center mb-0">
      Anda telah diundang menjadi User di Internal JIEP SIM Record Center
      <br />
    </p>

    <p v-if="invited_role.length" class="card-text text-center mb-0">
      sebagai

      <span
        v-for="(role, index) in invited_role"
        class="fw-bolder text-capitalize"
        :key="role?.id"
      >
        {{ role?.roles?.role }}{{ isLastElement(index) ? "" : "," }}
      </span>
    </p>

    <div class="mt-2">
      <BaseButton
        @click="handleConfirm"
        :disabled="isLoading || !isValidToken"
        :isLoading="isLoading"
        class="btn btn-primary w-100"
        title="Konfirmasi"
      />
    </div>
  </div>
</template>

<script>
import BaseButton from "@/components/Button/BaseButton.vue";

export default {
  name: "ValidTokenEmail",
  components: { BaseButton },
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
    },
    invited_role: {
      type: Array,
      default: () => [],
    },
    isValidToken: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    isLastElement() {
      return (index) => {
        return index + 1 == this.invited_role.length;
      };
    },
  },

  methods: {
    handleConfirm() {
      this.$emit("handle-confirm");
    },

    handleBack() {
      this.$emit("handle-back");
    },
  },
};
</script>

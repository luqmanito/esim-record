<template>
  <div>
    <h2 class="card-title fw-bold mb-1 text-center">
      {{ typeof error_token === "string" ? error_token : "Token Kadaluarsa" }}
      <tabler-icon size="21" icon="AlertTriangleIcon" />
    </h2>

    <p class="card-text text-center mb-0">
      Sepertinya masa aktif token untuk konfirmasi emailnya sudah kadaluarsa
      atau tidak aktif.
      <br />
      Silahkan hubungi <span class="fw-bolder">Administrator</span> untuk info
      lebih lanjut.
    </p>

    <div class="mt-2">
      <BaseButton
        @click="handleBack"
        class="btn btn-primary w-100"
        title="Kembali"
      />
    </div>
  </div>
</template>

<script>
import BaseButton from "@/components/Button/BaseButton.vue";

export default {
  name: "ExpiredTokenEmail",
  components: {
    BaseButton,
  },
  props: {
    error_token: {
      type: [String, Object],
      default: null,
    },
  },
  methods: {
    handleBack() {
      this.$emit("handle-back");
    },
  },
};
</script>

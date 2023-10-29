<template>
  <div>
    <h2 class="card-title fw-bold mb-1">Verifikasi Kode &nbsp;🔐</h2>

    <p class="card-text mb-2">
      Masukkan kode verifikasi untuk mengatur ulang password yang kami kirimkan
      ke email anda.
    </p>

    <div class="row">
      <div class="col-lg-12">
        <OTPInput
          :digit-count="6"
          :isDisabled="isLoadingSubmit"
          @update:otp="(value) => handleUpdateOtp(value)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import OTPInput from "@/components/OTPInput/OTPInput.vue";

export default {
  name: "ForgotPasswordValidToken",
  components: {
    OTPInput,
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    isValidToken: {
      type: Boolean,
      default: false,
    },
    isLoadingSubmit: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleUpdateOtp(value) {
      if (value) {
        this.handleVerifyKode(value);
      }
    },
    handleVerifyKode(value) {
      this.$emit("handle-verify-kode", value);
    },
  },
};
</script>

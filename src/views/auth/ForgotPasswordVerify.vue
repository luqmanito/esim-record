<template>
  <div class="col-12 col-sm-8 col-md-6 col-lg-12 px-xl-2 mx-auto">
    <div class="mb-2 d-flex justify-content-center align-items-center">
      <img :src="appLogoImage" alt="logo" height="100" />
    </div>

    <Spinner v-if="isLoading" />

    <template v-else>
      <component
        :is="showContentVerify"
        :isLoading="isLoading"
        :isLoadingSubmit="isLoadingSubmit"
        :isValidToken="isValidToken"
        @handle-verify-kode="handleVerifyKode"
        @handle-back="handleBack"
        :error_token="error_token"
      ></component>
    </template>

    <div class="mt-1" v-if="isLoadingSubmit">
      <h6 class="fw-normal">Loading...</h6>
    </div>
  </div>
</template>

<script>
import AuthNetwork from "@/network/lib/auth";

import Spinner from "@/components/Loading/Spinner.vue";

export default {
  name: "ForgotPasswordVerify",
  components: {
    Spinner,
    ForgotPasswordValidToken: () =>
      import("@/views/auth/components/ForgotPasswordValidToken.vue"),
    ForgotPasswordExpiredToken: () =>
      import("@/views/auth/components/ForgotPasswordExpiredToken.vue"),
  },
  data() {
    return {
      isLoading: false,
      isLoadingSubmit: false,
      isExpiredToken: false,
      token: "",
      error_token: {},
      OTPValue: "",
    };
  },
  computed: {
    appLogoImage() {
      return this.$store.state.appConfig.app.appLogoImage;
    },
    tokenQuery() {
      return this.$route.query?.token;
    },
    isValidToken() {
      const validToken =
        typeof this.tokenQuery === "string" && this.tokenQuery.length == 50;

      return validToken;
    },

    showContentVerify() {
      if (this.isExpiredToken) {
        return "ForgotPasswordExpiredToken";
      } else {
        return "ForgotPasswordValidToken";
      }
    },
  },
  methods: {
    async verifyForgotPassword() {
      if (this.isValidToken) {
        try {
          this.isLoading = true;

          const response = await AuthNetwork.validateForgotPassword({
            token: this.tokenQuery,
          });

          if (response) {
            this.isLoading = false;
            this.token = this.tokenQuery;
          }
        } catch (error) {
          this.isExpiredToken = true;
          this.isLoading = false;
          this.error_token = error?.response?.data?.message;
          this.$store.dispatch("toast/showToastError", {
            error: error,
          });
        }
      }
    },

    async validateKodeForgotPassword() {
      if (this.isValidToken) {
        try {
          this.isLoadingSubmit = true;

          const response = await AuthNetwork.validateKodeForgotPassword({
            token: this.token,
            kode: this.OTPValue,
          });

          if (response) {
            this.$router.replace({
              path: "/auth/forgot-password/reset",
              query: {
                kode: this.OTPValue,
                token: this.token,
              },
            });
          }
        } catch (error) {
          this.isLoadingSubmit = false;
          this.$store.dispatch("toast/showToastError", {
            error: error,
          });
        }
      }
    },

    handleVerifyKode(value) {
      this.OTPValue = value;

      this.validateKodeForgotPassword();
    },

    handleBack() {
      this.$router.back();
    },
  },

  mounted() {
    if (this.tokenQuery) {
      this.token = this.tokenQuery;
    }

    this.verifyForgotPassword();
  },
};
</script>

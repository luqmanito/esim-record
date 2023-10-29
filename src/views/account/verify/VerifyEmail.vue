<template>
  <div class="col-12 col-sm-8 col-md-6 col-lg-12 px-xl-2 mx-auto">
    <div class="mb-2 d-flex justify-content-center align-items-center">
      <img :src="appLogoImage" alt="logo" height="100" />
    </div>

    <Spinner v-if="isLoading" />

    <template v-else>
      <component
        :is="showContentVerify"
        :id="id"
        :invited_role="invited_role"
        :isLoading="isLoading"
        :isValidToken="isValidToken"
        @handle-confirm="handleConfirm"
        @handle-back="handleBack"
        :error_token="error_token"
      ></component>
    </template>
  </div>
</template>

<script>
import UsersNetwork from "@/network/lib/users";

import Spinner from "@/components/Loading/Spinner.vue";

export default {
  name: "VerifyEmail",
  components: {
    Spinner,
    ValidTokenEmail: () =>
      import("@/views/account/verify/components/ValidTokenEmail.vue"),
    ExpiredTokenEmail: () =>
      import("@/views/account/verify/components/ExpiredTokenEmail.vue"),
  },

  data() {
    return {
      isLoading: false,
      isExpiredToken: false,
      error_token: {},
      id: "",
      email: "",
      username: "",
      name: "",
      invited_role: [],
    };
  },

  computed: {
    appLogoImage() {
      return this.$store.state.appConfig.app.appLogoImage;
    },
    token() {
      return this.$route.query?.token;
    },
    isValidToken() {
      return typeof this.token === "string" && this.token.length == 50;
    },

    showContentVerify() {
      if (this.isExpiredToken) {
        return "ExpiredTokenEmail";
      } else {
        return "ValidTokenEmail";
      }
    },
  },

  methods: {
    async verifyEmailAccount() {
      if (this.isValidToken) {
        try {
          this.isLoading = true;

          const response = await UsersNetwork.verifyEmailAccount({
            token: this.token,
          });

          if (response) {
            this.isLoading = false;

            if (response?.data?.id) {
              this.id = response?.data?.id;
              this.email = response?.data?.email;
              this.username = response?.data?.username;
              this.name = response?.data?.name;
              this.invited_role = response?.data?.roles || [];

              this.confirmVerifyEmailAccount();
            }
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

    async confirmVerifyEmailAccount() {
      if (this.isValidToken) {
        try {
          this.isLoading = true;

          const response = await UsersNetwork.confirmVerifyEmailAccount({
            token: this.token,
          });

          if (response) {
            this.$router.replace({
              path: "/auth/register",
              query: {
                id: this.id,
                email: this.email,
              },
            });
          }
        } catch (error) {
          this.isExpiredToken = true;
          this.isLoading = false;
          this.$store.dispatch("toast/showToastError", {
            error: error,
          });
        }
      }
    },

    handleConfirm() {
      this.confirmVerifyEmailAccount();
    },

    handleBack() {
      this.$router.back();
    },
  },

  created() {
    if (this.token && this.isValidToken) {
      this.verifyEmailAccount();
    }
  },
};
</script>

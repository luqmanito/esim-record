<template>
  <div class="content-wrapper">
    <div class="content-body">
      <div
        class="d-flex justify-content-center align-items-center vh-100 w-100"
      >
        <div class="col-lg-4">
          <div class="auth-wrapper auth-basic">
            <div class="auth-inner my-2">
              <div class="card mb-0 mx-md-0 mx-3">
                <div
                  class="card-header d-flex justify-content-center align-items-center"
                >
                  <img :src="appLogoImage" alt="logo" height="100" />
                </div>
                <div class="card-body mb-2">
                  <h2 class="card-title fw-bolder mb-1 text-center">
                    Verifikasi & Konfirmasi Email
                    <tabler-icon icon="MailIcon" />
                  </h2>
                  <p class="card-text text-center mb-2">
                    Anda telah diundang menjadi User di Internal Record Center
                    <br />
                    sebagai
                    <span class="fw-bolder"> Admin, Finance dan Legal</span>
                  </p>

                  <BaseButton
                    :disabled="isLoading || !isValidToken"
                    :isLoading="isLoading"
                    class="btn btn-primary w-100"
                    title="Konfirmasi"
                  />

                  <!-- <p class="text-center mt-2">
                    <span>Tidak Menerima Email? </span
                    ><a href="Javascript:void(0)"><span>&nbsp;Kirim Ulang Email</span></a>
                  </p> -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UsersNetwork from "@/network/lib/users";

import BaseButton from "@/components/Button/BaseButton.vue";

export default {
  name: "VerifyEmailCenterLayout",
  components: { BaseButton },

  data() {
    return {
      isLoading: false,
      id: "",
      invited_role: [
        {
          id: "93025c9b-8012-4b36-a18f-df78d19f46b6",
          role: "Administrator",
          role_type: "admin",
          master: 1,
          profile_id: "21e20dac-373f-4601-a80c-7dd154e76b31",
          status: 1,
          created_at: "2022-12-16T11:26:39.000000Z",
          updated_at: "2022-12-16T11:26:39.000000Z",
          deleted_at: null,
          role_types: {
            id: "admin",
            role_type: "Administrator",
            created_at: "2022-12-16T11:26:39.000000Z",
            updated_at: "2022-12-16T11:26:39.000000Z",
            deleted_at: null,
          },
        },
        {
          id: "e27c000d-6491-491a-8594-ac8af861d439",
          role: "Super Admin",
          role_type: "super",
          master: 1,
          profile_id: "21e20dac-373f-4601-a80c-7dd154e76b31",
          status: 1,
          created_at: "2022-12-16T11:26:39.000000Z",
          updated_at: "2022-12-16T11:26:39.000000Z",
          deleted_at: null,
          role_types: {
            id: "super",
            role_type: "Super Administrator",
            created_at: "2022-12-16T11:26:39.000000Z",
            updated_at: "2022-12-16T11:26:39.000000Z",
            deleted_at: null,
          },
        },
      ],
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
    isLastElement() {
      return (index) => {
        return index + 1 == this.invited_role.length;
      };
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
            this.id = response?.data?.id;
            this.email = response?.data?.email;
            this.invited_role = response?.data?.roles || [];
          }
        } catch (error) {
          this.isLoading = false;
          this.$store.dispatch("toast/showToastError", {
            error: error,
          });
        }
      }
    },

    handleConfirm() {
      this.$router.push({
        path: "/auth/register",
        query: { id: this.id, email: this.email },
      });
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

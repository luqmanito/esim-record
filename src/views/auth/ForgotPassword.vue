<template>
  <div class="col-12 col-sm-8 col-md-6 col-lg-12 px-xl-2 mx-auto">
    <div class="mb-2 d-flex justify-content-center align-items-center">
      <img :src="appLogoImage" alt="logo" height="100" />
    </div>

    <h2 class="card-title fw-bold mb-1">Lupa Password ? 🔐</h2>
    <p class="card-text mb-2">
      Masukkan email Anda dan kami akan mengirimkan instruksi untuk mengatur
      ulang password anda.
    </p>

    <form class="auth-login-form mt-2" @submit.prevent="onSubmit">
      <div class="mb-1">
        <label class="form-label" for="email-address">Email</label>
        <input
          class="form-control"
          id="email-address"
          type="text"
          name="email"
          placeholder="Contoh : agushandoko10@gmail.com"
          v-model="v$.email.$model"
          tabindex="1"
          :class="{
            'is-invalid': isErrorEmail,
          }"
        />
        <ErrorMessage :errors="v$.email.$errors" />
      </div>

      <BaseButton
        type="submit"
        :disabled="isLoading"
        :isLoading="isLoading"
        class="btn btn-primary w-100"
        title="Kirim Instruksi Atur Ulang Password"
      />
    </form>

    <p class="text-center mt-2">
      <router-link to="/auth/login">
        <tabler-icon icon="ChevronLeftIcon" />
        <a><span>&nbsp;Kembali ke Login</span></a>
      </router-link>
    </p>
  </div>
</template>

<script>
import AuthNetwork from "@/network/lib/auth";

import Spinner from "@/components/Loading/Spinner.vue";
import BaseButton from "@/components/Button/BaseButton.vue";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage.vue";

import { useVuelidate } from "@vuelidate/core";
import { required, helpers, email } from "@vuelidate/validators";

export default {
  name: "ForgotPassword",
  components: {
    Spinner,
    BaseButton,
    ErrorMessage,
  },
  setup() {
    return { v$: useVuelidate() };
  },
  validationConfig: {
    $dirty: true,
  },
  data() {
    return {
      isLoading: false,
      email: "",
    };
  },
  computed: {
    appLogoImage() {
      return this.$store.state.appConfig.app.appLogoImage;
    },
    isErrorEmail() {
      return (
        Array.isArray(this.v$.email.$errors) && this.v$.email.$errors.length
      );
    },
  },
  validations() {
    return {
      email: {
        required: helpers.withMessage("Silahkan isi email", required),
        valid: helpers.withMessage("Alamat email tidak valid", email),
      },
    };
  },
  methods: {
    async onSubmit() {
      const result = await this.v$.$validate();

      if (result) {
        this.isLoading = true;

        try {
          const response = await AuthNetwork.forgotPassword({
            email: this.email,
          });

          if (response) {
            this.isLoading = false;
            this.$store.dispatch("toast/showToastSuccess", {
              title: "Email Pengaturan Ulang Password",
              text: "Berhasil Mengirimkan Email Instruksi Atur Ulang Password",
            });

            this.$router.push({ path: "/auth/login" });
          }
        } catch (error) {
          this.isLoading = false;
          this.$store.dispatch("toast/showToastError", {
            error: error,
          });
        }
      }
    },
  },
};
</script>

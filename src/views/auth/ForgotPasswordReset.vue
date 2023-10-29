<template>
  <div class="col-12 col-sm-8 col-md-6 col-lg-12 px-xl-2 mx-auto">
    <div class="mb-2 d-flex justify-content-center align-items-center">
      <img :src="appLogoImage" alt="logo" height="100" />
    </div>

    <h2 class="card-title fw-bold mb-1">Reset Password &nbsp;🔑</h2>

    <p class="card-text mb-2">
      Masukkan kata sandi baru yang ingin anda gunakan.
    </p>

    <form ref="formForgotReset" @submit.prevent="onSubmit">
      <div class="mb-2">
        <div class="d-flex justify-content-between">
          <label class="form-label" for="password">Password Baru</label>
        </div>

        <div class="input-group input-group-merge form-password-toggle">
          <input
            class="form-control form-control-merge"
            id="password"
            :type="isShowPassword.password ? 'text' : 'password'"
            name="password"
            placeholder="Masukkan kata sandi"
            v-model="v$.password.$model"
            tabindex="1"
            :class="{
              'is-invalid': isErrorPassword,
            }"
          /><span
            v-if="!isErrorPassword"
            @click="togglePassword('password')"
            class="input-group-text cursor-pointer"
          >
            <tabler-icon
              :icon="isShowPassword.password ? 'EyeOffIcon' : 'EyeIcon'"
          /></span>
        </div>
        <ErrorMessage :errors="v$.password.$errors" />
      </div>

      <div class="mb-2">
        <div class="d-flex justify-content-between">
          <label class="form-label" for="confirm-password"
            >Konfirmasi Password</label
          >
        </div>

        <div class="input-group input-group-merge form-password-toggle">
          <input
            class="form-control form-control-merge"
            id="confirm-password"
            :type="isShowPassword.confirmPassword ? 'text' : 'password'"
            name="confirm-password"
            placeholder="Masukkan konfirmasi kata sandi"
            v-model="v$.confirmPassword.$model"
            tabindex="2"
            :class="{
              'is-invalid': isErrorConfirmPassword,
            }"
          /><span
            v-if="!isErrorConfirmPassword"
            @click="togglePassword('confirmPassword')"
            class="input-group-text cursor-pointer"
          >
            <tabler-icon
              :icon="isShowPassword.confirmPassword ? 'EyeOffIcon' : 'EyeIcon'"
          /></span>
        </div>
        <ErrorMessage :errors="v$.confirmPassword.$errors" />
      </div>

      <div class="mt-2">
        <BaseButton
          type="submit"
          :disabled="isLoading || !isValidKode || !isValidToken"
          :isLoading="isLoading"
          class="btn btn-primary w-100"
          title="Atur Ulang Password"
          tabindex="3"
        />
      </div>
    </form>
  </div>
</template>

<script>
import AuthNetwork from "@/network/lib/auth";

import { useVuelidate } from "@vuelidate/core";
import { required, helpers, sameAs, minLength } from "@vuelidate/validators";

import BaseButton from "@/components/Button/BaseButton.vue";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage.vue";

const containNumber = helpers.regex(/(.*\d.*)/);
const oneLowerCase = helpers.regex(/(.*[a-z].*)/);
const oneUpperCase = helpers.regex(/(.*[A-Z].*)/);

export default {
  name: "ForgotPasswordReset",
  components: {
    BaseButton,
    ErrorMessage,
  },
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      kode: "",
      token: "",
      password: "",
      confirmPassword: "",
      isShowPassword: {
        password: false,
        confirmPassword: false,
      },
      isLoading: false,
    };
  },
  computed: {
    appLogoImage() {
      return this.$store.state.appConfig.app.appLogoImage;
    },
    isErrorPassword() {
      return (
        Array.isArray(this.v$.password.$errors) &&
        this.v$.password.$errors.length
      );
    },
    isErrorConfirmPassword() {
      return (
        Array.isArray(this.v$.confirmPassword.$errors) &&
        this.v$.confirmPassword.$errors.length
      );
    },
    tokenQuery() {
      return this.$route.query?.token;
    },
    kodeQuery() {
      return this.$route.query?.kode;
    },
    isValidToken() {
      const validToken =
        typeof this.tokenQuery === "string" && this.tokenQuery.length == 50;

      return validToken;
    },
    isValidKode() {
      const validKode =
        typeof this.kodeQuery === "string" && this.kodeQuery.length == 6;

      return validKode;
    },
  },
  validations() {
    return {
      password: {
        required: helpers.withMessage("Silahkan isi password", required),
        minLength: helpers.withMessage(
          "Password minimal berisi 8 karakter",
          minLength(8)
        ),
        containNumber: helpers.withMessage(
          "Password harus memiliki 1 karakter angka",
          containNumber
        ),
        oneLowerCase: helpers.withMessage(
          "Password harus memiliki 1 karakter huruf kecil",
          oneLowerCase
        ),
        oneUpperCase: helpers.withMessage(
          "Password harus memiliki 1 karakter huruf kapital",
          oneUpperCase
        ),
      },
      confirmPassword: {
        required: helpers.withMessage(
          "Silahkan isi konfirmasi password",
          required
        ),
        samesAsPassword: helpers.withMessage(
          "Konfirmasi password tidak sama",
          sameAs(this.password)
        ),
      },
    };
  },
  methods: {
    togglePassword(type) {
      this.isShowPassword[type] = !this.isShowPassword[type];
    },

    async onSubmit() {
      const result = await this.v$.$validate();

      if (result) {
        try {
          this.isLoading = true;

          const response = await AuthNetwork.resetForgotPassword({
            kode: this.kode,
            token: this.token,
            password: this.password,
            password_confirmation: this.confirmPassword,
          });

          if (response) {
            this.isLoading = false;

            this.$store.dispatch("toast/showToastSuccess", {
              title: "Reset Password Berhasil",
              text: `Silahkan Login Menggunakan Password Baru`,
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
  mounted() {
    if (this.tokenQuery) {
      this.token = this.tokenQuery;
    }

    if (this.kodeQuery) {
      this.kode = this.kodeQuery;
    }
  },
};
</script>

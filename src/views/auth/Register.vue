<template>
  <div class="col-12 col-sm-8 col-md-6 col-lg-12 px-xl-2 mx-auto">
    <div class="mb-3 d-flex justify-content-center align-items-center">
      <img :src="appLogoImage" alt="logo" height="100" />
    </div>

    <h2 class="card-title fw-bold mb-1">
      Daftar ke <br />
      JIEP SIM Record
    </h2>
    <p class="card-text mb-2">
      Silakan masukkan data Anda untuk melengkapi kelengkapan akun
    </p>
    <form class="auth-login-form mt-2" @submit.prevent="onSubmit">
      <!-- Username -->
      <!-- <div class="mb-1">
        <label class="form-label" for="register-username">Username</label>
        <input
          :disabled="username"
          class="form-control"
          id="register-username"
          type="text"
          name="username"
          placeholder="Contoh : agushandoko10"
          v-model="v$.username.$model"
          tabindex="1"
          :class="{
            'is-invalid': isErrorUsername,
          }"
        />
        <ErrorMessage :errors="v$.username.$errors" />
      </div> -->

      <div class="mb-2">
        <label class="form-label" for="register-email">Email</label>
        <input
          :disabled="email"
          class="form-control"
          id="register-email"
          type="text"
          name="email"
          placeholder="Contoh : agushandoko10@gmail.com"
          v-model="v$.email.$model"
          tabindex="2"
          :class="{
            'is-invalid': isErrorEmail,
          }"
        />
        <ErrorMessage :errors="v$.email.$errors" />
      </div>

      <div class="mb-2">
        <label class="form-label" for="register-name">Nama</label>
        <input
          class="form-control"
          id="register-name"
          type="text"
          name="name"
          placeholder="Contoh : Agus Handoko"
          v-model="v$.name.$model"
          tabindex="3"
          :class="{
            'is-invalid': isErrorName,
          }"
        />
        <ErrorMessage :errors="v$.name.$errors" />
      </div>

      <div class="mb-2">
        <div class="d-flex justify-content-between">
          <label class="form-label" for="register-password">Password</label>
        </div>

        <div class="input-group input-group-merge form-password-toggle">
          <input
            class="form-control form-control-merge"
            id="register-password"
            :type="isShowPassword.password ? 'text' : 'password'"
            name="password"
            placeholder="Masukkan kata sandi"
            v-model="v$.password.$model"
            tabindex="4"
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
          <label class="form-label" for="register-confirm-password"
            >Konfirmasi Password</label
          >
        </div>

        <div class="input-group input-group-merge form-password-toggle">
          <input
            class="form-control form-control-merge"
            id="register-confirm-password"
            :type="isShowPassword.confirmPassword ? 'text' : 'password'"
            name="confirm-password"
            placeholder="Masukkan konfirmasi kata sandi"
            v-model="v$.confirmPassword.$model"
            tabindex="5"
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

      <!-- T&C -->
      <!-- <div class="mb-1">
        <div class="form-check">
          <input
            class="form-check-input"
            id="register-privacy-policy"
            type="checkbox"
            v-model="isChecked"
            tabindex="5"
          />
          <label class="form-check-label" for="register-privacy-policy"
            >Saya Menyetujui<a href="#">&nbsp;syarat dan ketentuan</a></label
          >
        </div>
      </div> -->

      <div class="mt-2">
        <BaseButton
          type="submit"
          :disabled="isLoading"
          :isLoading="isLoading"
          class="btn btn-primary w-100"
          title="Daftar"
          tabindex="6"
        />
      </div>
    </form>

    <!-- Login -->
    <!-- <p class="text-center mt-2">
      <span>Sudah Punya Akun?</span>
      <router-link to="/auth/login">
        <a><span>&nbsp;Masuk</span></a>
      </router-link>
    </p> -->
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
  components: {
    BaseButton,
    ErrorMessage,
  },
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      username: "",
      name: "",
      email: "",
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
    /* Username
    isErrorUsername() {
      return (
        Array.isArray(this.v$.username.$errors) &&
        this.v$.username.$errors.length
      );
    },
    */
    isErrorName() {
      return Array.isArray(this.v$.name.$errors) && this.v$.name.$errors.length;
    },
    isErrorEmail() {
      return (
        Array.isArray(this.v$.email.$errors) && this.v$.email.$errors.length
      );
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
    idQuery() {
      return this.$route.query?.id;
    },
    usernameQuery() {
      return this.$route.query?.username;
    },
    emailQuery() {
      return this.$route.query?.email;
    },
    nameQuery() {
      return this.$route.query?.name;
    },
  },
  validations() {
    return {
      /* Username
      username: {
        required: helpers.withMessage("Silahkan isi username", required),
      },
      */
      name: {
        required: helpers.withMessage("Silahkan isi nama", required),
      },
      email: {
        required: helpers.withMessage("Silahkan isi alamat email", required),
        email: helpers.withMessage(
          "Silahkan isi alamat email yang valid",
          required
        ),
      },
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

          const response = await AuthNetwork.register({
            id: this.idQuery,
            name: this.name,
            email: this.email,
            password: this.password,
            password_confirmation: this.confirmPassword,
          });

          if (response) {
            this.isLoading = false;

            this.$store.dispatch("toast/showToastSuccess", {
              title: "Verifikasi dan Pembuatan Akun Berhasil",
              icon: "CircleCheckIcon",
              text: `Silahkan Login menggunakan ${this.email}`,
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
    if (this.emailQuery) {
      this.email = this.emailQuery;
    }

    /* Name
    if (this.nameQuery) {
      this.name = this.nameQuery;
    }
    */

    /* Username
    if (this.usernameQuery) {
      this.username = this.usernameQuery;
    }
    */
  },
};
</script>

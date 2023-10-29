<template>
  <div class="col-12 col-sm-8 col-md-6 col-lg-12 px-xl-2 mx-auto">
    <div class="mb-3 d-flex justify-content-center align-items-center">
      <img :src="appLogoImage" alt="logo" height="100" />
    </div>

    <h2 class="card-title fw-bold mb-1">
      Selamat Datang di<br />
      JIEP SIM Record 👋
    </h2>

    <p class="card-text mb-2">Silakan masuk ke akun Anda</p>
    <form class="auth-login-form mt-2" @submit.prevent="onSubmit">
      <div class="mb-1">
        <label class="form-label" for="login-username"
          >Username atau Email</label
        >
        <input
          id="login-username"
          class="form-control"
          :class="{
            'is-invalid': isErrorUsername,
          }"
          type="text"
          name="username"
          v-model="v$.username.$model"
          placeholder="Contoh : agushandoko10@gmail.com"
          tabindex="1"
          :disabled="isLoading"
        />
        <ErrorMessage :errors="v$.username.$errors" />
      </div>
      <div class="mb-1">
        <div class="d-flex justify-content-between">
          <label class="form-label" for="login-password">Password</label>
          <!-- Forgot Password -->
          <router-link to="/auth/forgot-password">
            <a> <small>Lupa Password?</small></a>
          </router-link>
        </div>

        <div class="input-group input-group-merge form-password-toggle">
          <input
            id="login-password"
            class="form-control"
            :class="{
              'is-invalid': isErrorPassword,
            }"
            :type="isShowPassword ? 'text' : 'password'"
            name="password"
            v-model="v$.password.$model"
            placeholder="Masukkan kata sandi"
            tabindex="2"
            :disabled="isLoading"
          /><span
            v-if="!isErrorPassword"
            @click="togglePassword"
            class="input-group-text cursor-pointer"
            :class="{
              'is-invalid': isErrorPassword,
            }"
          >
            <tabler-icon :icon="isShowPassword ? 'EyeOffIcon' : 'EyeIcon'" />
          </span>
        </div>

        <ErrorMessage :errors="v$.password.$errors" />
      </div>

      <!-- Remember me -->
      <!-- <div class="mb-1">
        <div class="form-check">
          <input
            class="form-check-input"
            id="remember-me"
            type="checkbox"
            tabindex="3"
          />
          <label class="form-check-label" for="remember-me"> Remember Me</label>
        </div>
      </div> -->

      <BaseButton
        type="submit"
        :disabled="isLoading"
        :isLoading="isLoading"
        class="btn btn-primary w-100"
        title="Masuk"
      />
    </form>

    <!-- Register -->
    <!-- <p class="text-center mt-2">
      <span>Belum Punya Akun?</span>
      <router-link to="/auth/register">
        <a><span>&nbsp;Daftar</span></a>
      </router-link>
    </p> -->
  </div>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";

import BaseButton from "@/components/Button/BaseButton.vue";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage.vue";
import ToastificationContent from "@/components/Toastification/ToastificationContent.vue";

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
      password: "",
      isShowPassword: false,
      isLoading: false,
    };
  },
  computed: {
    appLogoImage() {
      return this.$store.state.appConfig.app.appLogoImage;
    },
    name() {
      return this.$store.state.auth.account?.name;
    },
    isErrorUsername() {
      return (
        Array.isArray(this.v$.username.$errors) &&
        this.v$.username.$errors.length
      );
    },
    isErrorPassword() {
      return (
        Array.isArray(this.v$.password.$errors) &&
        this.v$.password.$errors.length
      );
    },
  },
  validations() {
    return {
      username: {
        required: helpers.withMessage(
          "Silahkan isi username atau email",
          required
        ),
      },
      password: {
        required: helpers.withMessage("Silahkan isi password", required),
      },
    };
  },
  methods: {
    togglePassword() {
      this.isShowPassword = !this.isShowPassword;
    },
    async onSubmit() {
      const result = await this.v$.$validate();

      if (result) {
        this.isLoading = true;

        this.$store
          .dispatch("auth/login", {
            username: this.username,
            password: this.password,
          })
          .then(() => {
            this.$toast.success({
              component: ToastificationContent,
              props: {
                title: "Login Berhasil",
                icon: "CircleCheckIcon",
                text: `Selamat Datang ${this.name}`,
                variant: "success",
              },
            });

            this.isLoading = false;
            this.$router.push({ path: "/" });
          })
          .catch(() => {
            this.isLoading = false;
          });
      }
    },
  },
};
</script>

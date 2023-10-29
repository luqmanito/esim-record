<template>
  <div class="content-wrapper">
    <div class="content-header row">
      <div class="content-header-left col-md-9 col-12 mb-2">
        <BreadCrumb :showHeader="true" />
      </div>
    </div>

    <div class="content-body">
      <div class="card">
        <div class="card-header border-bottom row">
          <h5 class="card-title mb-2">Pengaturan Password</h5>
        </div>

        <div class="card-body py-2 my-25">
          <form ref="formSetting" @submit.prevent="onSubmit">
            <div class="row mb-2">
              <div class="col-12 col-sm-6">
                <div class="mb-2">
                  <label class="form-label" for="old_password"
                    >Password Lama</label
                  >

                  <div
                    class="input-group input-group-merge form-password-toggle"
                  >
                    <input
                      :type="isShowPassword.old_password ? 'text' : 'password'"
                      class="form-control"
                      id="old_password"
                      name="old_password"
                      placeholder="Masukkan Password Lama"
                      v-model="v$.old_password.$model"
                      tabindex="1"
                      :class="{ 'is-invalid': isErrorOldPassword }"
                      :disabled="isLoading"
                    />
                    <span
                      v-if="!isErrorOldPassword"
                      @click="togglePassword('old_password')"
                      class="input-group-text cursor-pointer"
                    >
                      <tabler-icon
                        :icon="
                          isShowPassword.old_password ? 'EyeOffIcon' : 'EyeIcon'
                        "
                    /></span>
                  </div>
                  <ErrorMessage :errors="v$.old_password.$errors" />
                </div>

                <div class="mb-2">
                  <label class="form-label" for="password">Password Baru</label>

                  <div
                    class="input-group input-group-merge form-password-toggle"
                  >
                    <input
                      :type="isShowPassword.password ? 'text' : 'password'"
                      class="form-control"
                      id="password"
                      name="password"
                      placeholder="Masukkan Password Baru"
                      v-model="v$.password.$model"
                      tabindex="2"
                      :class="{ 'is-invalid': isErrorPassword }"
                      :disabled="isLoading"
                    />
                    <span
                      v-if="!isErrorPassword"
                      @click="togglePassword('password')"
                      class="input-group-text cursor-pointer"
                    >
                      <tabler-icon
                        :icon="
                          isShowPassword.password ? 'EyeOffIcon' : 'EyeIcon'
                        "
                    /></span>
                  </div>
                  <ErrorMessage :errors="v$.password.$errors" />
                </div>

                <div class="mb-2">
                  <label class="form-label" for="password_confirmation"
                    >Konfirmasi Password Baru</label
                  >

                  <div
                    class="input-group input-group-merge form-password-toggle"
                  >
                    <input
                      :type="
                        isShowPassword.password_confirmation
                          ? 'text'
                          : 'password'
                      "
                      class="form-control"
                      id="password_confirmation"
                      name="password_confirmation"
                      placeholder="Masukkan Password Baru"
                      v-model="v$.password_confirmation.$model"
                      tabindex="3"
                      :class="{ 'is-invalid': isErrorPasswordConfirmation }"
                      :disabled="isLoading"
                    />
                    <span
                      v-if="!isErrorPasswordConfirmation"
                      @click="togglePassword('password_confirmation')"
                      class="input-group-text cursor-pointer"
                    >
                      <tabler-icon
                        :icon="
                          isShowPassword.password_confirmation
                            ? 'EyeOffIcon'
                            : 'EyeIcon'
                        "
                    /></span>
                  </div>
                  <ErrorMessage :errors="v$.password_confirmation.$errors" />
                </div>
              </div>

              <div class="col-12 col-sm-6">
                <div>
                  <p class="fw-bolder">Password Requirements :</p>
                  <ul class="ps-1 ms-25">
                    <li class="mb-50">Minimal berisi 8 karakter</li>
                    <li class="mb-50">Harus memiliki 1 karakter angka</li>
                    <li class="mb-50">Harus memiliki 1 karakter huruf kecil</li>
                    <li>Harus memiliki 1 karakter huruf kapital</li>
                  </ul>
                </div>
              </div>
            </div>

            <div >
              <BaseButton
                :disabled="isLoading"
                :isLoading="isLoading"
                type="submit"
                title="Ubah Password"
              >
              </BaseButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AccountNetwork from "@/network/lib/account";

import { useVuelidate } from "@vuelidate/core";
import { required, helpers, minLength, sameAs } from "@vuelidate/validators";

import BreadCrumb from "@/components/BreadCrumb/BreadCrumb.vue";
import BaseButton from "@/components/Button/BaseButton.vue";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage.vue";

const containNumber = helpers.regex(/(.*\d.*)/);
const oneLowerCase = helpers.regex(/(.*[a-z].*)/);
const oneUpperCase = helpers.regex(/(.*[A-Z].*)/);

export default {
  name: "Settings",
  components: {
    BreadCrumb,
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
      old_password: "",
      password: "",
      password_confirmation: "",
      isShowPassword: {
        old_password: false,
        password: false,
        password_confirmation: false,
      },
      isLoading: false,
    };
  },
  computed: {
    isErrorOldPassword() {
      return (
        Array.isArray(this.v$.old_password.$errors) &&
        this.v$.old_password.$errors.length
      );
    },
    isErrorPassword() {
      return (
        Array.isArray(this.v$.password.$errors) &&
        this.v$.password.$errors.length
      );
    },
    isErrorPasswordConfirmation() {
      return (
        Array.isArray(this.v$.password_confirmation.$errors) &&
        this.v$.password_confirmation.$errors.length
      );
    },
  },
  validations() {
    return {
      old_password: {
        required: helpers.withMessage("Silahkan isi password lama", required),
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
      password_confirmation: {
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

          const response = await AccountNetwork.changePassword({
            old_password: this.old_password,
            password: this.password,
            password_confirmation: this.password_confirmation,
          });

          if (response) {
            this.isLoading = false;

            this.$store.dispatch("toast/showToastSuccess", {
              title: "Ubah Data Password",
              icon: "CircleCheckIcon",
              text: `Berhasil Merubah Data Password`,
            });
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

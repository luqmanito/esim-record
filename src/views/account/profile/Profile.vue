<template>
  <div class="content-wrapper">
    <div class="content-header row">
      <div class="content-header-left col-md-9 col-12 mb-2">
        <BreadCrumb :showHeader="true" />
      </div>
    </div>

    <div class="content-body">
      <div class="row">
        <!-- User Sidebar -->
        <div class="col-xl-4 col-lg-5 col-md-5">
          <!-- User Card -->
          <div class="card">
            <div class="card-body">
              <div class="user-avatar-section">
                <div class="d-flex align-items-center flex-column">
                  <img
                    class="img-fluid rounded mt-3 mb-2 bg-primary"
                    :src="
                      account?.photo ||
                      '/app-assets/images/avatars/avatar-default.png'
                    "
                    height="110"
                    width="110"
                    alt="User avatar"
                  />
                  <div class="user-info text-center">
                    <h4>{{ detail_profile?.name || "-" }}</h4>
                    <span
                      class="badge"
                      :class="
                        statusVerified(detail_profile?.verified) ==
                        'Terverifikasi'
                          ? 'bg-light-info'
                          : 'bg-light-danger'
                      "
                    >
                      {{ statusVerified(detail_profile?.verified) }}
                      <tabler-icon
                        :icon="
                          statusVerified(detail_profile?.verified) ==
                          'Terverifikasi'
                            ? 'DiscountCheckIcon'
                            : 'CircleXIcon'
                        "
                      />
                    </span>
                  </div>
                </div>
              </div>
              <div class="d-flex justify-content-around my-2 pt-75"></div>
              <h4 class="fw-bolder border-bottom pb-50 mb-1">Data Profile</h4>
              <div class="info-container">
                <ul class="list-unstyled">
                  <li class="mb-75">
                    <span class="fw-bolder me-25">Username:</span>
                    <span>{{ detail_profile?.username || "-" }}</span>
                  </li>
                  <li class="mb-75">
                    <span class="fw-bolder me-25">Email:</span>
                    <span>{{ detail_profile?.email || "-" }}</span>
                  </li>
                  <li class="mb-75">
                    <span class="fw-bolder me-25">Status:</span>
                    <span class="badge bg-light-success">{{
                      statusUser(detail_profile?.status)
                    }}</span>
                  </li>
                  <li class="mb-75">
                    <span class="fw-bolder me-25">No Telepon:</span>
                    <span>{{ spanPhoneMasked(detail_profile?.no_tlp) }}</span>
                  </li>
                  <li class="mb-75">
                    <span class="fw-bolder me-25">Role:</span>
                    <ul v-if="Array.isArray(detail_profile?.roles)">
                      <li v-for="role in detail_profile?.roles" :key="role?.id">
                        {{ role.roles.role }}
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <!-- /User Card -->
        </div>
        <!--/ User Sidebar -->

        <div class="col-xl-8 col-lg-7 col-md-7">
          <div class="card">
            <div class="card-header border-bottom row">
              <h5 class="card-title mb-2">Edit Profile</h5>
            </div>

            <div class="card-body">
              <form class="mt-2 pt-50" @submit.prevent="onSubmit">
                <div class="row">
                  <div class="col-12 col-sm-12 mb-2">
                    <label class="form-label" for="username">Username</label>
                    <input
                      type="text"
                      class="form-control"
                      id="username"
                      name="username"
                      placeholder="Masukkan Nama"
                      v-model="username"
                      tabindex="1"
                      :disabled="isLoading || username"
                    />
                  </div>

                  <div class="col-12 col-sm-12 mb-2">
                    <label class="form-label" for="email">Email</label>
                    <input
                      type="text"
                      class="form-control"
                      id="email"
                      name="email"
                      placeholder="Masukkan Alamat Email"
                      v-model="email"
                      tabindex="2"
                      :disabled="isLoading || email"
                    />
                  </div>
                </div>

                <div class="row">
                  <div class="col-12 col-sm-12 mb-2">
                    <label class="form-label" for="name">Nama</label>
                    <input
                      type="text"
                      class="form-control"
                      id="name"
                      name="name"
                      placeholder="Masukkan Nama"
                      v-model="v$.name.$model"
                      tabindex="3"
                      :class="{ 'is-invalid': isErrorName }"
                      :disabled="isLoading"
                    />
                    <ErrorMessage :errors="v$.name.$errors" />
                  </div>

                  <div class="col-12 col-sm-12 mb-2">
                    <label class="form-label" for="phone">No Telepon</label>

                    <input
                      v-maska="phone"
                      data-maska="+(##)-##########"
                      type="tel"
                      class="form-control"
                      id="phone"
                      name="phone"
                      placeholder="Masukkan No Telepon"
                      v-model="phoneMasked"
                      tabindex="4"
                      :class="{ 'is-invalid': isErrorPhone }"
                      :disabled="isLoading"
                    />
                    <ErrorMessage :errors="v$.phone.unmasked.$errors" />
                  </div>
                </div>

                <div class="col-12 col-sm-12 mb-5">
                  <label class="form-label" for="phone">Foto</label>

                  <vue-dropzone
                    ref="dropzoneProfile"
                    id="dropzoneProfile"
                    :options="vueDropzoneOptions"
                    :useCustomSlot="true"
                    :duplicateCheck="true"
                    @vdropzone-file-added="onFileAddedDropzone"
                    @vdropzone-removed-file="onRemovedFileDropzone"
                  >
                    <div>
                      <h3 class="dropzone-custom-title">
                        Upload atau Drag File
                      </h3>
                      <div class="subtitle">
                        atau klik untuk memilih file dari komputer Anda
                      </div>
                    </div>
                  </vue-dropzone>
                </div>

                <div class="mt-2">
                  <BaseButton
                    :disabled="isLoading"
                    :isLoading="isLoading"
                    type="submit"
                    title="Simpan Perubahan"
                  >
                  </BaseButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vue2Dropzone from "vue2-dropzone";
import { options as dropzoneOptions } from "@/utils/vueDropzoneConfig";

import { vMaska } from "maska";

import data_status_list from "@/data/status.json";

import AccountNetwork from "@/network/lib/account";

import { useVuelidate } from "@vuelidate/core";
import { required, helpers, minLength, maxLength } from "@vuelidate/validators";

import BreadCrumb from "@/components/BreadCrumb/BreadCrumb.vue";
import BaseButton from "@/components/Button/BaseButton.vue";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage.vue";

export default {
  name: "Profile",
  directives: { maska: vMaska },
  components: {
    BreadCrumb,
    BaseButton,
    ErrorMessage,
    vueDropzone: vue2Dropzone,
  },
  setup() {
    return { v$: useVuelidate() };
  },
  validationConfig: {
    $dirty: true,
  },

  data() {
    return {
      name: "",
      username: "",
      email: "",
      status: "",
      verified: "",
      phoneMasked: "",
      photo: {},
      phone: {
        masked: "",
        unmasked: "",
        completed: false,
      },
      status_list: data_status_list,
      roles: [],
      detail_profile: {},
      isLoading: false,
      vueDropzoneOptions: {
        ...dropzoneOptions,
        acceptedFiles: "image/*",
        maxFiles: 1,
      },
    };
  },

  computed: {
    isErrorName() {
      return Array.isArray(this.v$.name.$errors) && this.v$.name.$errors.length;
    },
    isErrorPhone() {
      return (
        Array.isArray(this.v$.phone.unmasked.$errors) &&
        this.v$.phone.unmasked.$errors.length
      );
    },
    statusUser() {
      return (value) => {
        if (value == 1) {
          return "Aktif";
        } else if (value == 0) {
          return "Tidak Aktif";
        }
      };
    },
    statusVerified() {
      return (value) => {
        if (value == 1) {
          return "Terverifikasi";
        } else if (value == 0) {
          return "Belum Terverifikasi";
        }
      };
    },
    spanPhoneMasked() {
      return (value) => {
        if (!value) {
          return "-";
        }

        if (typeof value === "string") {
          const codePhoneArea = value.slice(0, 2);

          const restOfPhone = value.slice(2, value.length);

          return `+(${codePhoneArea})-${restOfPhone}`;
        }

        return null;
      };
    },

    account() {
      return this.$store.state.auth.account;
    },
  },

  validations() {
    return {
      name: {
        required: helpers.withMessage("Silahkan isi nama", required),
      },
      phone: {
        unmasked: {
          required: helpers.withMessage("Silahkan isi no telepon", required),
          minLength: helpers.withMessage(
            "No Telepon Minimal 10 Angka",
            minLength(10)
          ),
        },
      },
    };
  },

  methods: {
    onFileAddedDropzone(file) {
      const totalFiles = this.$refs.dropzoneProfile.getQueuedFiles().length;
      if (totalFiles < 1) {
        this.photo = file;
      }
    },

    onRemovedFileDropzone(file) {
      const idFile = file?.upload?.uuid;
      if (idFile == this.photo?.upload?.uuid) {
        this.photo = {};
      }
    },

    async getAccountById({ alreadyMounted = false }) {
      this.isLoading = true;

      try {
        const response = await AccountNetwork.getMyAccount();

        if (response) {
          const data = response?.data;

          this.detail_profile = data;

          this.name = data?.name;
          this.username = data?.username;
          this.email = data?.email;
          this.phoneMasked = data?.no_tlp;
          this.photo = data?.photo;

          if (!alreadyMounted) {
            const url = data?.photo;

            const file = {
              size: data?.photo_mime?.size,
              name: data?.photo_mime?.filename,
              type: data?.photo_mime?.type,
            };

            this.$refs.dropzoneProfile.manuallyAddFile(file, url);
          }

          this.isLoading = false;
        }
      } catch (error) {
        this.isLoading = false;
        loader.hide();
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },

    async onSubmit() {
      const result = await this.v$.$validate();

      if (result) {
        this.isLoading = true;
        const formData = new FormData();

        formData.append("name", this.name);
        formData.append("no_tlp", this.phone.unmasked);
        formData.append("photo", this.photo);

        try {
          const response = await AccountNetwork.editAccount({ data: formData });

          if (response) {
            this.isLoading = false;
            this.$store.dispatch("auth/setMyAccount", {
              ...this.account,
              name: this.name,
              photo: this.photo?.dataURL,
            });
            this.$store.dispatch("toast/showToastSuccess", {
              title: "Perubahan Data Profile",
              text: "Berhasil Merubah Data Profile",
            });
            this.getAccountById({ alreadyMounted: true });
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
    let loader = this.$loading.show();
    this.getAccountById({ alreadyMounted: false })
      .then(() => loader.hide())
      .catch(() => loader.hide());
  },
};
</script>

<style scoped>
.dropzone {
  min-height: 200px;
}
</style>
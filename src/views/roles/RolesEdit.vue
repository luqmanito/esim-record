<template>
  <div class="content-wrapper">
    <div class="content-header row">
      <div class="content-header-left col-md-9 col-12 mb-2">
        <BreadCrumb :showHeader="true" />
      </div>
    </div>

    <div class="content-bdy">
      <div class="row">
        <div class="col-md-6">
          <div class="card mb-4">
            <div class="card-body">
              <form ref="formRolesAdd" @submit.prevent="onSubmit">
                <div class="mb-2">
                  <label class="form-label" for="role">Nama Role</label>
                  <input
                    type="text"
                    class="form-control"
                    id="role"
                    name="role"
                    placeholder="Masukkan Nama Role"
                    v-model="v$.role.$model"
                    tabindex="1"
                    :class="{ 'is-invalid': isErrorRole }"
                    :disabled="isLoading"
                  />
                  <ErrorMessage :errors="v$.role.$errors" />
                </div>

                <div class="mb-2">
                  <label class="form-label" for="role_type">Tipe Role</label>

                  <select
                    id="role_type"
                    name="role_type"
                    v-model="v$.role_type.$model"
                    :disabled="isLoading"
                    tabindex="2"
                    :class="[
                      isErrorRoleType
                        ? 'is-invalid form-control'
                        : 'form-select',
                    ]"
                  >
                    <option value="">
                      {{
                        list_role_type.loading ? "Loading" : "Pilih Tipe Role"
                      }}
                    </option>
                    <option
                      v-for="tipe in list_role_type.data"
                      :value="tipe?.id"
                      :key="`${tipe?.id}-${tipe?.role_type}`"
                    >
                      {{ tipe.role_type }}
                    </option>
                  </select>
                  <ErrorMessage :errors="v$.role_type.$errors" />
                </div>

                <div class="mb-2">
                  <label class="form-label" for="status">Status</label>

                  <select
                    id="status"
                    name="status"
                    v-model="v$.status.$model"
                    :disabled="isLoading"
                    tabindex="3"
                    :class="[
                      isErrorStatus ? 'is-invalid form-control' : 'form-select',
                    ]"
                  >
                    <option value="">Pilih Status</option>
                    <option
                      v-for="status in status_list"
                      :key="status.value"
                      :value="status.value"
                    >
                      {{ status.label }}
                    </option>
                  </select>
                  <ErrorMessage :errors="v$.status.$errors" />
                </div>

                <div class="mt-3">
                  <BaseButton
                    :disabled="isLoading"
                    @click="handleBack"
                    title="Batalkan"
                    className="btn btn-light me-sm-2 me-1"
                  >
                  </BaseButton>

                  <BaseButton
                    :disabled="isLoading"
                    :isLoading="isLoading"
                    :access="['manusersroleedit']"
                    type="submit"
                    title="Simpan"
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
import data_status_list from "@/data/status.json";

import RolesNetwork from "@/network/lib/roles";

import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";

import BaseButton from "@/components/Button/BaseButton.vue";
import BaseDropdownButton from "@/components/Button/BaseDropdownButton.vue";
import BreadCrumb from "@/components/BreadCrumb/BreadCrumb.vue";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage.vue";

export default {
  name: "RolesEdit",
  components: {
    BreadCrumb,
    ErrorMessage,
    BaseButton,
    BaseDropdownButton,
  },
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      role: "",
      role_type: "",
      status: "",
      status_list: data_status_list,
      list_role_type: {
        loading: false,
        data: [],
      },
      isLoading: false,
      isSaveAndClear: false,
    };
  },
  computed: {
    isErrorRole() {
      return Array.isArray(this.v$.role.$errors) && this.v$.role.$errors.length;
    },
    isErrorRoleType() {
      return (
        Array.isArray(this.v$.role_type.$errors) &&
        this.v$.role_type.$errors.length
      );
    },
    isErrorStatus() {
      return (
        Array.isArray(this.v$.status.$errors) && this.v$.status.$errors.length
      );
    },
    idParams() {
      return this.$route.params?.id;
    },
  },
  validations() {
    return {
      role: {
        required: helpers.withMessage("Silahkan isi nama role", required),
      },
      role_type: {
        required: helpers.withMessage("Silahkan pilih tipe role", required),
      },
      status: {
        required: helpers.withMessage("Silahkan pilih status", required),
      },
    };
  },
  methods: {
    async getListRoleType() {
      this.list_role_type.loading = true;
      try {
        const response = await RolesNetwork.getListRoleType({});

        if (response) {
          this.list_role_type.loading = false;
          this.list_role_type.data = response?.data?.rows;
        }
      } catch (error) {
        this.list_role_type.loading = false;
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },

    async getRolesById() {
      this.isLoading = true;

      let loader = this.$loading.show();

      try {
        const response = await RolesNetwork.getRolesById({
          id: this.idParams,
        });

        if (response) {
          const data = response?.data;

          this.role = data?.role;
          this.role_type = data?.role_type;
          this.status = data?.status;

          this.isLoading = false;
          loader.hide();
        }
      } catch (error) {
        loader.hide();
        this.isLoading = false;
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },

    async onSubmit() {
      const result = await this.v$.$validate();

      if (result) {
        this.isLoading = true;

        try {
          const response = await RolesNetwork.editRoles({
            id: this.idParams,
            role: this.role,
            role_type: this.role_type,
            status: this.status,
          });

          if (response) {
            this.isLoading = false;
            this.$store.dispatch("toast/showToastSuccess", {
              title: "Edit Data Roles",
              text: "Berhasil Merubah Data Roles",
            });

            this.handleBack();
          }
        } catch (error) {
          this.isLoading = false;
          this.$store.dispatch("toast/showToastError", {
            error: error,
          });
        }
      }
    },

    handleBack() {
      this.$router.back();
    },
  },
  mounted() {
    Promise.all([this.getListRoleType(), this.getRolesById()]);
  },
};
</script>

<template>
  <div class="content-wrapper">
    <div class="content-header row">
      <div class="content-header-left col-md-9 col-12 mb-2">
        <BreadCrumb :showHeader="true" />
      </div>
    </div>

    <div class="content-body">
      <div class="row">
        <div class="col-md-6">
          <div class="card mb-4">
            <div class="card-body">
              <form ref="formUsersEdit" @submit.prevent="onSubmit">
                <div class="mb-2">
                  <label class="form-label" for="username">Username</label>

                  <input
                    id="username"
                    name="username"
                    type="username"
                    class="form-control"
                    v-model="username"
                    placeholder="Masukkan Username User"
                    :class="{ 'is-invalid': isErrorUsername }"
                    :disabled="true"
                    tabindex="1"
                  />

                  <ErrorMessage :errors="v$.username.$errors" />
                </div>

                <div class="mb-2">
                  <label class="form-label" for="name">Nama</label>

                  <input
                    id="name"
                    name="name"
                    type="name"
                    class="form-control"
                    v-model="name"
                    placeholder="Masukkan Nama User"
                    :class="{ 'is-invalid': isErrorName }"
                    :disabled="true"
                    tabindex="2"
                  />

                  <ErrorMessage :errors="v$.name.$errors" />
                </div>

                <div class="mb-2">
                  <label class="form-label" for="email">Email</label>

                  <!-- Single Email -->
                  <input
                    id="email"
                    name="email"
                    type="email"
                    class="form-control"
                    v-model="email"
                    placeholder="Masukkan Alamat Email"
                    :disabled="true"
                    tabindex="3"
                  />
                </div>

                <div class="mb-2">
                  <label class="form-label" for="tipe">Status</label>

                  <select
                    id="status"
                    name="status"
                    v-model="v$.status.$model"
                    :disabled="isLoading || status"
                    tabindex="4"
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

                <div class="mb-2">
                  <label class="form-label" for="tipe">Invitasi</label>

                  <select
                    id="invitation"
                    name="invitation"
                    v-model="v$.invitation.$model"
                    :disabled="isLoading || invitation"
                    tabindex="5"
                    :class="[
                      isErrorInvitation
                        ? 'is-invalid form-control'
                        : 'form-select',
                    ]"
                  >
                    <option value="">Pilih Invitasi</option>
                    <option
                      v-for="invitation in invitation_list"
                      :key="invitation.value"
                      :value="invitation.value"
                    >
                      {{ invitation.label }}
                    </option>
                  </select>
                  <ErrorMessage :errors="v$.invitation.$errors" />
                </div>

                <div class="mb-2">
                  <label class="form-label" for="role">Role</label>

                  <div class="row mt-25">
                    <template v-if="!list_role_type.loading">
                      <div
                        v-for="(role, index) in list_role_type.data"
                        :key="role?.id"
                        class="mb-25"
                      >
                        <input
                          @click="
                            (event) =>
                              handleClickItem({
                                event: event,
                                id: role?.id,
                              })
                          "
                          :id="`role-${index}`"
                          class="form-check-input"
                          type="checkbox"
                          :checked="isChecked(role?.id)"
                        />
                        <label
                          class="form-check-label ms-75"
                          :for="`role-${index}`"
                        >
                          {{ role.role }} -
                          {{ role?.role_types?.role_type }}</label
                        >
                      </div>

                      <ErrorMessage :errors="v$.selected_role.$errors" />
                    </template>

                    <template v-else>
                      <div class="text-center">
                        <Spinner />
                      </div>
                    </template>
                  </div>
                </div>

                <div class="mt-3">
                  <BaseButton
                    @click="handleBack"
                    :disabled="isLoading"
                    title="Batalkan"
                    className="btn btn-light me-sm-2 me-1"
                  >
                  </BaseButton>

                  <BaseButton
                    :disabled="isLoading"
                    :isLoading="isLoading"
                    type="submit"
                    title="Simpan"
                    :access="['manusersuseredit']"
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
import data_invitation_list from "@/data/statusUserInvitation.json";

import { useVuelidate } from "@vuelidate/core";
import { required, helpers, email } from "@vuelidate/validators";

import UsersNetwork from "@/network/lib/users";
import RolesNetwork from "@/network/lib/roles";

import BreadCrumb from "@/components/BreadCrumb/BreadCrumb.vue";
import BaseButton from "@/components/Button/BaseButton.vue";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage.vue";
import Spinner from "@/components/Loading/Spinner.vue";

export default {
  name: "UsersInvite",
  components: {
    BreadCrumb,
    BaseButton,
    ErrorMessage,
    Spinner,
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
      invitation: "",
      status_list: data_status_list,
      invitation_list: data_invitation_list,
      selected_role: [],
      list_role_type: {
        loading: false,
        data: [],
      },
      isLoading: false,
    };
  },

  computed: {
    isChecked() {
      return (value) => this.selected_role.includes(value);
    },
    isErrorName() {
      return Array.isArray(this.v$.name.$errors) && this.v$.name.$errors.length;
    },
    isErrorUsername() {
      return (
        Array.isArray(this.v$.username.$errors) &&
        this.v$.username.$errors.length
      );
    },
    isErrorSelectedRole() {
      return (
        Array.isArray(this.v$.selected_role.$errors) &&
        this.v$.selected_role.$errors.length
      );
    },
    isErrorStatus() {
      return (
        Array.isArray(this.v$.status.$errors) && this.v$.status.$errors.length
      );
    },
    isErrorInvitation() {
      return (
        Array.isArray(this.v$.invitation.$errors) &&
        this.v$.invitation.$errors.length
      );
    },
    idParams() {
      return this.$route.params?.id;
    },
  },

  validations() {
    return {
      username: {
        required: helpers.withMessage("Silahkan isi username", required),
      },
      name: {
        required: helpers.withMessage("Silahkan isi nama", required),
      },
      selected_role: {
        required: helpers.withMessage("Silahkan pilih role", required),
      },
      status: {
        required: helpers.withMessage("Silahkan pilih status", required),
      },
      invitation: {
        required: helpers.withMessage(
          "Silahkan pilih status invitasi",
          required
        ),
      },
    };
  },

  methods: {
    handleClickItem({ event, id }) {
      const isChecked = event.target.checked;

      if (isChecked) {
        const list = [...this.selected_role, id];

        this.selected_role = list;
      } else {
        const list = this.selected_role.filter(
          (selectedId) => selectedId !== id
        );
        this.selected_role = list;
      }
    },

    async getListRoleType() {
      this.list_role_type.loading = true;
      try {
        const response = await RolesNetwork.getListAllRoles();

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

    async getUsersById() {
      this.isLoading = true;

      let loader = this.$loading.show();

      try {
        const response = await UsersNetwork.getUsersById({
          id: this.idParams,
        });

        if (response) {
          const data = response?.data;

          this.isLoading = false;
          this.username = data?.username;
          this.name = data?.name;
          this.email = data?.email;
          this.status = data?.status;
          this.invitation = data?.invitation;

          const list_roles = [];

          if (data?.roles && Array.isArray(data?.roles)) {
            data?.roles.map((item) => {
              list_roles.push(item?.roles?.id);
            });

            this.selected_role = list_roles;
          }

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
          const response = await UsersNetwork.editUsers({
            id: this.idParams,
            username: this.username,
            name: this.name,
            email: this.email,
            status: this.status,
            invitation: this.invitation,
            roles: this.selected_role,
          });

          if (response) {
            this.isLoading = false;
            this.$store.dispatch("toast/showToastSuccess", {
              title: "Edit Data Users",
              text: "Berhasil Merubah Data Users",
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
    Promise.all([this.getListRoleType(), this.getUsersById()]);
  },
};
</script>

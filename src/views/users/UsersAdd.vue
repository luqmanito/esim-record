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
              <form ref="formUsersAdd" @submit.prevent="onSubmit">
                <div class="mb-2">
                  <label class="form-label" for="email"
                    >Undang dengan Email</label
                  >

                  <!-- Single Email -->
                  <!-- <input
                    id="email"
                    name="email"
                    type="email"
                    class="form-control"
                    v-model="email"
                    placeholder="Masukkan Alamat Email"
                    :class="{ 'is-invalid': isErrorEmail }"
                    :disabled="isLoading"
                    tabindex="1"
                    
                   <ErrorMessage :errors="v$.email.$errors" />
                  /> -->

                  <!-- Multiple Email -->
                  <v-select
                    id="email"
                    label="value"
                    placeholder="Masukkan email yang ingin diundang"
                    :taggable="true"
                    :multiple="true"
                    :disabled="isLoading"
                    :no-drop="true"
                    v-model="emails"
                    :dropdown-should-open="dropdownEmailShouldOpen"
                    :select-on-key-codes="[]"
                    :tabindex="1"
                  >
                    <template v-slot:option="option">
                      Tambahkan alamat email {{ option?.value }}
                    </template>
                  </v-select>

                  <ErrorMessage :errors="v$.emails.$errors" />
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
                    :disabled="isLoading"
                    @click="handleBack"
                    title="Batalkan"
                    className="btn btn-light me-sm-2 me-1"
                  >
                  </BaseButton>

                  <BaseDropdownButton
                    @click="isSaveAndClear = false"
                    type="submit"
                    :disabled="isLoading"
                    :isLoading="isLoading"
                    title="Simpan"
                    :access="['manusersuseradd']"
                  >
                    <template #dropdown>
                      <BaseButton
                        @click="isSaveAndClear = true"
                        type="submit"
                        className="dropdown-item w-100"
                        title="Simpan & Reset"
                        :access="['manusersuseradd']"
                      >
                      </BaseButton>

                      <BaseButton
                        @click="resetForm"
                        type="button"
                        className="dropdown-item w-100"
                        title="Reset"
                        :access="['manusersuseradd']"
                      >
                      </BaseButton>
                    </template>
                  </BaseDropdownButton>
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
import { useVuelidate } from "@vuelidate/core";
import { required, helpers, email } from "@vuelidate/validators";

import UsersNetwork from "@/network/lib/users";
import RolesNetwork from "@/network/lib/roles";

import BreadCrumb from "@/components/BreadCrumb/BreadCrumb.vue";
import BaseButton from "@/components/Button/BaseButton.vue";
import BaseDropdownButton from "@/components/Button/BaseDropdownButton.vue";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage.vue";
import Spinner from "@/components/Loading/Spinner.vue";

export default {
  name: "UsersInvite",
  components: {
    BreadCrumb,
    BaseButton,
    BaseDropdownButton,
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
      emails: [],
      selected_role: [],
      list_role_type: {
        loading: false,
        data: [],
      },
      isLoading: false,
      isSaveAndClear: false,
    };
  },

  computed: {
    isChecked() {
      return (value) => this.selected_role.includes(value);
    },
    isErrorEmails() {
      return (
        Array.isArray(this.v$.emails.$errors) && this.v$.emails.$errors.length
      );
    },
    isErrorSelectedRole() {
      return (
        Array.isArray(this.v$.selected_role.$errors) &&
        this.v$.selected_role.$errors.length
      );
    },
  },

  validations() {
    return {
      emails: {
        required: helpers.withMessage("Silahkan isi email", required),
      },
      selected_role: {
        required: helpers.withMessage("Silahkan pilih role", required),
      },
    };
  },

  methods: {
    dropdownEmailShouldOpen(VueSelect) {
      if (VueSelect.search.length && email.$validator(VueSelect.search)) {
        return VueSelect.open;
      } else {
        return false;
      }
    },

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

    async onSubmit() {
      const result = await this.v$.$validate();

      if (result) {
        this.isLoading = true;

        try {
          const response = await UsersNetwork.inviteUsers({
            email: this.emails,
            roles: this.selected_role,
          });

          if (response) {
            this.isLoading = false;
            this.$store.dispatch("toast/showToastSuccess", {
              title: "Kirim Undangan Users",
              text: "Berhasil Mengirim Undangan ke Email Users",
            });

            if (this.isSaveAndClear) {
              this.resetForm();
            } else {
              this.handleBack();
            }
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

    resetState() {
      this.emails = [];
      this.selected_role = [];
    },

    resetForm() {
      this.resetState();
      this.$refs.formUsersAdd.reset();
      this.v$.$reset();
    },
  },

  mounted() {
    this.getListRoleType();
  },
};
</script>

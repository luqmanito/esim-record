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
          <h5 class="card-title mb-2">Menu</h5>
        </div>

        <div class="card-body">
          <!-- Heading -->
          <!-- <div
            class="row my-2 d-flex justify-content-center align-items-center"
          >
            <div class="col-md-12">
              <div
                class="d-flex flex-sm-column flex-md-row align-items-center justify-content-md-end my-sm-1 my-md-0"
              >
                <div class="dt-buttons ms-sm-2">
                  <BaseButton :access="['manusersmenuadd']" title="Tambah Menu">
                    <template name="icon-left">
                      <tabler-icon icon="PlusIcon"></tabler-icon>
                    </template>
                  </BaseButton>
                </div>
              </div>
            </div>
          </div> -->

          <div class="table-responsive mb-2">
            <table class="table table-hover">
              <thead class="table-light">
                <tr>
                  <th colspan="3">No</th>
                  <th>Nama</th>
                  <th>Key</th>
                  <th>URL</th>
                  <th class="text-center">Icon</th>
                  <th>Tipe Role</th>
                  <th>Urutan</th>
                </tr>
              </thead>

              <tbody>
                <tr v-if="isLoading">
                  <td colspan="9" class="text-center">Loading...</td>
                </tr>

                <!-- Menu -->
                <template v-else-if="!isLoading && list_menu.length">
                  <template v-for="(menu, index) in list_menu">
                    <tr :key="menu?.id">
                      <td colspan="3">
                        <span>
                          {{ index + 1 }}
                        </span>
                      </td>

                      <td>
                        <span class="fw-bolder ms-25">
                          {{ menu?.title }}
                        </span>
                      </td>

                      <td>
                        {{ menu?.menu_key }}
                      </td>

                      <td>
                        {{ menu?.url }}
                      </td>

                      <td class="text-center">
                        <tabler-icon v-if="menu?.icon" :icon="menu?.icon" />
                      </td>

                      <td class="row text-capitalize">
                        <span
                          class="mb-25"
                          v-for="roleMenu in type_role(menu?.role_type)"
                          :key="roleMenu"
                        >
                          {{ roleMenu }}
                        </span>
                      </td>

                      <td>
                        {{ menu?.urutan }}
                      </td>
                    </tr>

                    <!-- Sub Menu -->
                    <template
                      v-if="menu?.children && Array.isArray(menu?.children)"
                    >
                      <template v-for="(subMenu, indexMenu) in menu?.children">
                        <tr :key="subMenu?.id">
                          <td></td>
                          <td colspan="2">
                            <span> {{ index + 1 }}.{{ indexMenu + 1 }} </span>
                          </td>
                          <td>
                            <span class="fw-bolder ms-25">
                              {{ subMenu?.title }}
                            </span>
                          </td>

                          <td>
                            {{ subMenu?.menu_key }}
                          </td>

                          <td>
                            {{ subMenu?.url }}
                          </td>

                          <td class="text-center">
                            <tabler-icon
                              v-if="subMenu?.icon"
                              :icon="subMenu?.icon"
                            />
                          </td>

                          <td class="row text-capitalize">
                            <span
                              class="mb-25"
                              v-for="roleSubMenu in type_role(
                                subMenu?.role_type
                              )"
                              :key="roleSubMenu"
                            >
                              {{ roleSubMenu }}
                            </span>
                          </td>

                          <td>
                            {{ subMenu?.urutan }}
                          </td>
                        </tr>

                        <!-- Function Menu -->
                        <template
                          v-if="
                            subMenu?.children &&
                            Array.isArray(subMenu?.children)
                          "
                        >
                          <template
                            v-for="(
                              functionMenu, indexFunctionMenu
                            ) in subMenu?.children"
                          >
                            <tr :key="functionMenu?.id">
                              <td></td>
                              <td></td>
                              <td>
                                <span>
                                  {{ index + 1 }}.{{ indexMenu + 1 }}.{{
                                    indexFunctionMenu + 1
                                  }}
                                </span>
                              </td>

                              <td>
                                <span class="ms-25">
                                  {{ functionMenu?.title }}
                                </span>
                              </td>

                              <td>
                                {{ functionMenu?.menu_key }}
                              </td>

                              <td>
                                {{ functionMenu?.url }}
                              </td>

                              <td class="text-center">
                                <tabler-icon
                                  v-if="functionMenu?.icon"
                                  :icon="functionMenu?.icon"
                                />
                              </td>

                              <td class="row text-capitalize">
                                <span
                                  class="mb-25"
                                  v-for="roleFunction in type_role(
                                    functionMenu?.role_type
                                  )"
                                  :key="roleFunction"
                                >
                                  {{ roleFunction }}
                                </span>
                              </td>

                              <td>
                                {{ functionMenu?.urutan }}
                              </td>
                            </tr>
                          </template>
                        </template>
                      </template>
                    </template>
                  </template>
                </template>

                <tr v-else>
                  <td colspan="9" class="text-center">
                    Tidak Ada Data Ditemukan
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MenuNetwork from "@/network/lib/menu";

import BreadCrumb from "@/components/BreadCrumb/BreadCrumb.vue";
import BaseButton from "@/components/Button/BaseButton.vue";
import BaseDropdownButton from "@/components/Button/BaseDropdownButton.vue";

export default {
  name: "Menu",
  components: {
    BreadCrumb,
    BaseButton,
    BaseDropdownButton,
  },
  data() {
    return {
      isLoading: false,
      list_menu: [],
    };
  },

  computed: {
    type_role() {
      return (value) => {
        if (typeof value === "string") {
          const parsed = JSON.parse(value);

          return parsed;
        } else {
          return {};
        }
      };
    },
  },
  methods: {
    async getListMenu() {
      this.isLoading = true;
      try {
        const response = await MenuNetwork.getListMenu({});

        if (response) {
          this.isLoading = false;
          this.list_menu = response?.data?.rows;
        }
      } catch (error) {
        this.isLoading = false;
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },

    async deleteMenu({ id }) {
      try {
        const response = await MenuNetwork.deleteMenu({ id: id });

        if (response) {
          this.$store.dispatch("toast/showToastSuccess", {
            title: "Hapus Data Menu",
            text: "Berhasil Menghapus Data Menu",
          });

          this.getListMenu();
        }
      } catch (error) {
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },

    handleAddMenu() {
      this.$router.push("/menu/add");
    },

    handleEditMenu({ id }) {
      this.$router.push(`/menu/${id}/edit`);
    },

    handleDeleteMenu({ id, title }) {
      this.$swal({
        title: `Apakah Yakin Untuk Menghapus Menu ${title}?`,
        icon: "info",
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonText: "Ya!",
        cancelButtonText: "Batalkan",
        customClass: {
          confirmButton: "btn btn-primary",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteMenu({ id: id });
        }
      });
    },
  },

  mounted() {
    this.getListMenu();
  },
};
</script>

<style scoped>
.number-width {
  width: 10%;
}
.menu-width {
  width: 80%;
}
.check-width {
  width: 10%;
}
</style>

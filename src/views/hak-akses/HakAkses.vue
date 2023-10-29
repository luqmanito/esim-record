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
          <h5 class="card-title mb-2">Hak Akses</h5>

          <div class="d-flex align-items-center row pb-2 gap-3 gap-md-0">
            <div class="col-md-4">
              <label class="form-label">Filter Berdasarkan Tipe Role :</label>

              <select
                id="role_type_list"
                name="role_type_list"
                class="form-select w-100 text-capitalize"
                v-model="role_type"
                :disabled="list_role_type.loading"
              >
                <option value="">
                  {{
                    list_role_type.loading ? "Loading..." : "Pilih Tipe Role"
                  }}
                </option>
                <option
                  v-for="tipe in list_role_type.data"
                  :value="`${tipe?.id}_${tipe?.role_type}`"
                  :key="`${tipe?.id}-${tipe?.role_type}`"
                >
                  {{ tipe.role }} - {{ tipe?.role_types?.role_type }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="card-body">
          <div
            class="row my-2 d-flex justify-content-center align-items-center"
          >
            <div class="col-md-12">
              <div
                class="d-flex flex-sm-column flex-md-row align-items-center justify-content-md-end my-sm-1 my-md-0"
              >
                <div class="dt-buttons ms-sm-2">
                  <BaseButton
                    @click="setAksesByRole"
                    :isLoading="isLoadingSubmit"
                    :isDisabled="!list.length || isLoadingSubmit"
                    title="Simpan Pengaturan"
                  >
                    <template name="icon-left">
                      <tabler-icon icon="DeviceFloppyIcon"></tabler-icon>
                    </template>
                  </BaseButton>
                </div>
              </div>
            </div>
          </div>

          <div class="table-responsive mb-2">
            <table class="table table-hover">
              <thead class="table-light">
                <tr>
                  <th colspan="3" class="number-width">No</th>
                  <th colspan="3" class="menu-width">Menu</th>
                  <th colspan="1" class="check-width text-center">
                    <!-- <span>Akses</span> -->
                    <div class="form-check form-check-inline">
                      <input
                        ref="checkboxAll"
                        @click="handleCheckAll"
                        :id="`akses-check-all`"
                        class="form-check-input"
                        type="checkbox"
                        :isDisabled="!list.length || isLoadingSubmit"
                        :checked="isCheckedAll"
                      />
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr v-if="isLoading">
                  <td colspan="7" class="text-center">Loading...</td>
                </tr>

                <tr v-else-if="!isLoading && !role_type">
                  <td colspan="7" class="text-center">
                    Silahkan Pilih Tipe Role Terlebih Dahulu
                  </td>
                </tr>

                <!-- Menu -->
                <template v-else-if="!isLoading && list.length">
                  <template v-for="(menu, index) in list">
                    <tr :key="menu?.id">
                      <td colspan="3" style="width: 50px">
                        <span>
                          {{ index + 1 }}
                        </span>
                      </td>

                      <td colspan="3">
                        <tabler-icon :icon="menu?.icon" />
                        <span class="fw-bolder ms-25">
                          {{ menu?.title }}
                        </span>
                      </td>

                      <td class="text-center">
                        <div class="form-check form-check-inline">
                          <input
                            @click="
                              (event) =>
                                handleClickItem({ event: event, id: menu?.id })
                            "
                            :id="`akses-${index}-${menu?.id}`"
                            class="form-check-input"
                            type="checkbox"
                            :checked="isChecked(menu?.id)"
                          />
                        </div>
                      </td>
                    </tr>

                    <!-- Sub Menu -->
                    <template
                      v-if="menu?.children && Array.isArray(menu?.children)"
                    >
                      <template v-for="(subMenu, indexMenu) in menu?.children">
                        <tr :key="subMenu?.id">
                          <td colspan="3" style="padding-left: 50px">
                            <span> {{ index + 1 }}.{{ indexMenu + 1 }} </span>
                          </td>

                          <td colspan="3" style="padding-left: 50px">
                            <tabler-icon :icon="subMenu?.icon" />
                            <span class="fw-bolder ms-25">
                              {{ subMenu?.title }}
                            </span>
                          </td>

                          <td class="text-center">
                            <div class="form-check form-check-inline">
                              <input
                                @click="
                                  (event) =>
                                    handleClickItem({
                                      event: event,
                                      id: subMenu?.id,
                                    })
                                "
                                :id="`akses-${indexMenu}-${subMenu?.id}`"
                                class="form-check-input"
                                type="checkbox"
                                :checked="isChecked(subMenu?.id)"
                              />
                            </div>
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
                              <td colspan="3" style="padding-left: 75px">
                                <span>
                                  {{ index + 1 }}.{{ indexMenu + 1 }}.{{
                                    indexFunctionMenu + 1
                                  }}
                                </span>
                              </td>

                              <td colspan="3" style="padding-left: 75px">
                                <span>
                                  {{ functionMenu?.title }}
                                </span>
                              </td>

                              <td class="text-center">
                                <div class="form-check form-check-inline">
                                  <input
                                    @click="
                                      (event) =>
                                        handleClickItem({
                                          event: event,
                                          id: functionMenu?.id,
                                        })
                                    "
                                    :id="`akses-${indexFunctionMenu}-${functionMenu?.id}`"
                                    class="form-check-input"
                                    type="checkbox"
                                    :checked="isChecked(functionMenu?.id)"
                                  />
                                </div>
                              </td>
                            </tr>
                          </template>
                        </template>
                      </template>
                    </template>
                  </template>
                </template>

                <tr v-else>
                  <td colspan="7" class="text-center">
                    Tidak ada Data ditemukan
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
import HakAksesNetwork from "@/network/lib/hak-akses";
import RolesNetwork from "@/network/lib/roles";

import BreadCrumb from "@/components/BreadCrumb/BreadCrumb.vue";
import BaseButton from "@/components/Button/BaseButton.vue";

import collectRecursiveNode from "@/utils/collectRecursiveNode";

export default {
  name: "HakAkses",
  components: {
    BreadCrumb,
    BaseButton,
  },
  data() {
    return {
      isLoading: false,
      isLoadingSubmit: false,
      list: [],
      total_list: 0,
      role_type: "",
      list_role_type: {
        loading: false,
        data: [],
      },
      selectedAkses: [],
    };
  },

  computed: {
    isChecked() {
      return (value) => this.selectedAkses.includes(value);
    },
    isCheckedAll() {
      return (
        this.total_list > 0 && this.total_list == this.selectedAkses.length
      );
    },
  },

  methods: {
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

    async getListHakAkses() {
      this.isLoading = true;
      try {
        const response = await HakAksesNetwork.getListHakAkses({
          role_id: this.role_type?.split("_")[0],
          role_type: this.role_type?.split("_")[1],
        });

        if (response) {
          this.isLoading = false;
          this.list = response?.data;
        }
      } catch (error) {
        this.isLoading = false;
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },

    async setAksesByRole() {
      try {
        this.isLoadingSubmit = true;
        const response = await HakAksesNetwork.setAksesByRole({
          role_id: this.role_type?.split("_")[0],
          access: this.selectedAkses,
        });

        if (response) {
          this.isLoadingSubmit = false;
          this.$store.dispatch("toast/showToastSuccess", {
            title: "Simpan Data Akses",
            text: "Berhasil Menyimpan Data Akses",
          });
        }
      } catch (error) {
        this.isLoadingSubmit = false;
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },

    handleCheckAll(event) {
      const isChecked = event.target.checked;

      if (isChecked) {
        this.selectedAkses = [];

        const listSelected = [];

        const flattenList = collectRecursiveNode(this.list);

        flattenList.nodes.map((item) => {
          listSelected.push(item?.id);
        });

        this.selectedAkses = listSelected;
      } else {
        this.selectedAkses = [];
      }
    },

    handleClickItem({ event, id }) {
      const isChecked = event.target.checked;

      if (isChecked) {
        const list = [...this.selectedAkses, id];

        this.selectedAkses = list;
      } else {
        const list = this.selectedAkses.filter(
          (selectedId) => selectedId !== id
        );
        this.selectedAkses = list;
      }
    },
  },

  watch: {
    role_type: {
      handler: function (value) {
        this.selectedAkses = [];

        if (value) {
          this.getListHakAkses();
        }
      },
      deep: true,
    },

    list: {
      handler: function () {
        const flatted = collectRecursiveNode(this.list);

        const list_selected = [];

        flatted.nodes.map((item) => {
          if (item?.allowed > 0) {
            list_selected.push(item?.id);
          }
        });

        this.selectedAkses = list_selected;

        this.total_list = flatted.nodes.length;
      },
    },
  },

  mounted() {
    this.getListRoleType();
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

<template>
  <BaseModal
    :open="isShowModal"
    classNameModal="modal-lg"
    id="modal_history_rfid"
    :showFooter="false"
  >
    <h3 class="text-center mb-1">History RFID</h3>
    <p class="text-center">Detail History RFID yang telah disimpan</p>

    <div class="row mb-2 mt-2">
      <div class="col-md-6">
        <label class="form-label" for="filter-tanggal"
          >Filter Berdasarkan Tanggal</label
        >

        <flat-pickr
          :config="config"
          class="form-control"
          v-model="date"
          name="filter-tanggal"
          placeholder="Pilih Tanggal"
        ></flat-pickr>
      </div>

      <div class="col-md-6">
        <label class="form-label" for="filter-users"
          >Filter Berdasarkan Users</label
        >

        <v-select
          @search="onSearchUsers"
          label="id"
          :multiple="false"
          placeholder="Cari Users"
          :options="list_users.data"
          :clearable="true"
          :filterable="false"
          :disabled="list_users.loading"
          :loading="list_users.loading"
          v-model="users"
        >
          <template slot="no-options"> Users tidak ditemukan </template>

          <template slot="option" slot-scope="option">
            <div class="d-center">
              {{ option.name }}
            </div>
          </template>
          <template slot="selected-option" slot-scope="option">
            <div class="selected d-center">
              {{ option.name }}
            </div>
          </template>
        </v-select>
      </div>

       <div class="col-md-12 mt-2">
        <label class="form-label" for="selected-rfid">RFID</label>

        <select
          id="selected-rfid"
          name="selected-rfid"
          class="form-select"
          v-model="pk"
        >
          <option value="">Semua RFID</option>
          <option
            v-for="(item, index) in listRFID"
            :key="`${index}-${item?.rfid}`"
            :value="item?.id"
          >
            {{ item.rfid }}
          </option>
        </select>
      </div>
    </div>

    <div class="mt-1">
      <div class="col-md-12">
        <div class="table-responsive">
          <v-table
            class="table table-hover"
            :data="list_history_rfid.data"
            :pageSize="params.limit"
          >
            <thead class="table-light" slot="head">
              <tr>
                <th class="text-center">History</th>
              </tr>
            </thead>
            <tbody slot="body" slot-scope="{ displayData }">
              <tr v-if="list_history_rfid.loading">
                <td colspan="2" class="text-center">Loading...</td>
              </tr>

              <tr
                v-else-if="!list_history_rfid.loading && displayData.length"
                v-for="(item, index) in displayData"
                :key="item.id"
              >
                <div
                  id="accordionIcon"
                  class="accordion accordion-without-arrow px-0 py-0"
                  data-toggle-hover="true"
                >
                  <div class="accordion-item">
                    <div
                      class="accordion-header text-body d-flex justify-content-between"
                      :id="`accordionIcon${index}`"
                    >
                      <button
                        type="button"
                        class="accordion-button"
                        :data-bs-toggle="'collapse'"
                        :data-bs-target="`#accordionIcon-${index}`"
                        :aria-controls="`accordionIcon-${index}`"
                        aria-expanded="true"
                      >
                        <div class="d-flex flex-column">
                          <h5
                            :class="[
                              item?.method === 'PUT' ? 'fw-bolder' : 'fw-light',
                            ]"
                          >
                            <span
                              class="badge rounded-pill me-25"
                              :class="badgeActions(item?.method)"
                            >
                              {{ actions(item?.method) }}
                            </span>

                            {{
                              documentParsed(item?.before)?.rfid ||
                              documentParsed(item?.after)?.rfid
                            }}
                          </h5>
                          <div class="d-flex">
                            <div>
                              <small class="text-muted me-25">oleh</small>
                              <small class="text-body">
                                {{ item?.user?.name }}</small
                              >
                              <span class="text-muted ms-50 me-25">|</span>
                              <small class="text-muted">{{
                                dateToNow(item?.updated_at)
                              }}</small>
                            </div>
                          </div>
                        </div>
                      </button>
                    </div>

                    <div
                      v-if="item?.method === 'PUT'"
                      :id="`accordionIcon-${index}`"
                      class="accordion-collapse collapse"
                      data-bs-parent="#accordionIcon"
                    >
                      <div class="accordion-body">
                        <div class="row">
                          <div
                            :class="[
                              item?.method === 'PUT' ? 'col-md-6' : 'col-md-12',
                            ]"
                          >
                            <div class="card card-body h-100">
                              <small>Sebelum</small>
                              <hr />
                              <json-viewer
                                class="d-block"
                                :preview-mode="true"
                                :value="
                                  item?.method === 'PUT'
                                    ? documentParsed(item?.before)
                                    : documentParsed(item?.after)
                                "
                              ></json-viewer>
                            </div>
                          </div>
                          <div v-if="item?.method === 'PUT'" class="col-md-6">
                            <div class="card card-body h-100">
                              <small>Sesudah</small>
                              <hr />
                              <json-viewer
                                class="d-block"
                                :preview-mode="true"
                                :value="documentParsed(item?.after)"
                              ></json-viewer>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </tr>

              <tr v-else>
                <td colspan="2" class="text-center">
                  Tidak ada History RFID ditemukan
                </td>
              </tr>
            </tbody>
          </v-table>
        </div>

        <CustomPagination
          v-if="
            !list_history_rfid.loading && list_history_rfid.data.length
          "
          :currentDataLength="list_history_rfid.data.length"
          :totalData="meta.total"
        >
          <template #page>
            <smart-pagination
              v-if="list_history_rfid.data"
              :currentPage.sync="params.page"
              :totalPages="Math.ceil(meta.total / params.limit)"
              :hideSinglePage="false"
              :boundary-links="true"
            >
            </smart-pagination>
          </template>
        </CustomPagination>
      </div>
    </div>
  </BaseModal>
</template>

<script>
import HistoryActivityNetwork from "@/network/lib/history-activity";
import UsersNetwork from "@/network/lib/users";

import debounce from "lodash.debounce";
import flatPickr from "vue-flatpickr-component";

import BaseModal from "@/components/Modal/BaseModal.vue";
import BaseButton from "@/components/Button/BaseButton.vue";
import Spinner from "@/components/Loading/Spinner.vue";
import CustomPagination from "@/components/Pagination/CustomPagination.vue";
import DropdownLimit from "@/components/DropdownLimit/DropdownLimit.vue";

import { formatDateMoments as momentDateToNow } from "@/utils/momentDateFormat";

export default {
  name: "ModalHistoryRFID",
  components: {
    BaseModal,
    BaseButton,
    Spinner,
    CustomPagination,
    flatPickr,
    DropdownLimit,
  },
  props: {
    isShowModal: {
      type: Boolean,
      default: false,
    },
    listRFID: {
      type: Array,
      default: () => [],
    },
    selectedRFID: {
      type: Object,
    },
  },
  data() {
    return {
      isLoading: false,
      list_history_rfid: {
        loading: false,
        data: [],
      },
      date: null,
      config: {
        wrap: true,
        mode: "range",
        altInput: true,
        altFormat: "d-m-Y",
        allowInput: true,
      },
      users: "",
      list_users: {
        loading: false,
        data: [],
      },
      pk: "",
      params: {
        limit: 10,
        page: 1,
        search: "",
      },
      meta: {
        total: 0,
        per_page: 0,
        current_page: 0,
      },
    };
  },
  computed: {
    offset() {
      let offset = 0;
      if (this.params.search !== "") {
        offset = 0;
      } else {
        offset = (this.params.page - 1) * this.params.limit;
      }
      return offset;
    },

    from() {
      if (typeof this.date === "string") {
        if (this.date.includes("to")) {
          return this.date.split("to")[0].trim();
        } else {
          return this.date;
        }
      }

      return "";
    },

    to() {
      if (typeof this.date === "string") {
        if (this.date.includes("to")) {
          return this.date.split("to")[1].trim();
        } else {
          return this.date;
        }
      }

      return "";
    },

    actions() {
      return (value) => {
        if (value === "POST") {
          return "Create";
        } else if (value === "PUT") {
          return "Edit";
        } else if (value === "DELETE") {
          return "Delete";
        }
      };
    },

    badgeActions() {
      return (value) => {
        if (value === "POST") {
          return "badge-light-primary";
        } else if (value === "PUT") {
          return "badge-light-info";
        } else if (value === "DELETE") {
          return "badge-light-danger";
        }
      };
    },

    documentParsed() {
      return (value) => {
        if (typeof value === "string") {
          const parsed = JSON.parse(value, null, 4);

          return parsed;
        }

        return {};
      };
    },

    dateToNow() {
      return (value) => {
        if (value) {
          return momentDateToNow(value);
        }
      };
    },

    filterHistory() {
      return [
        this.params.limit,
        this.limit,
        this.search,
        this.date,
        this.users,
        this.pk,
      ];
    },
  },
  methods: {
    async getListUsers({ search }) {
      try {
        this.list_users.loading = true;
        const response = await UsersNetwork.getListUsers({
          search,
        });

        if (response) {
          this.list_users.loading = false;
          this.list_users.data = response?.data?.rows;
        }
      } catch (error) {
        this.list_users.loading = false;
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },

    async getListHistoryRFID({ limit, offset, from, to, created_by, pk }) {
      try {
        this.list_history_rfid.loading = true;
        const response = await HistoryActivityNetwork.getListHistoryActivity({
          module: "rfid",
          limit,
          offset,
          from,
          to,
          created_by,
          pk,
        });

        if (response) {
          this.list_history_rfid.loading = false;
          this.list_history_rfid.data = response?.data?.rows;
          this.meta = {
            current_page: response?.data?.meta?.current_page,
            per_page: response?.data?.meta?.per_page,
            total: response?.data?.meta?.total,
          };
        }
      } catch (error) {
        this.list_history_rfid.loading = false;
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },

    onSearchUsers(search, loading) {
      loading(true);
      this.handleSearchUsers(loading, search, this);
    },

    handleSearchUsers: debounce((loading, search, vm) => {
      UsersNetwork.getListUsers({
        search: search,
      })
        .then((response) => {
          vm.list_users.data = response?.data?.rows;
          loading(false);
        })
        .catch((error) => {
          loading(false);
          this.$store.dispatch("toast/showToastError", {
            error: error,
          });
        });
    }, 500),
  },

  watch: {
    filterHistory() {
      this.getListHistoryRFID({
        limit: this.params.limit,
        offset: this.params.offset,
        from: this.from,
        to: this.to,
        created_by: this.users?.id,
        pk: this.pk,
      });
    },
    selectedRFID(value) {
      if (value) {
        this.pk = value?.id;
        this.params.limit = 10;
        this.date = null;
        this.created_by = "";
        this.users = "";
      }
    },
  },

  mounted() {
    this.getListUsers({});
  },
};
</script>

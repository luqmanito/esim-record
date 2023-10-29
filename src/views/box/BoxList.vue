<template>
  <div class="card">
    <div class="card-header border-bottom row">
      <h5 class="card-title mb-2">List Box</h5>
    </div>

    <div class="card-body">
      <div class="row my-2 d-flex justify-content-center align-items-center">
        <div class="col-md-3">
          <div
            class="d-flex justify-content-md-start justify-content-sm-center align-items-md-start align-items-sm-center"
          >
            <DropdownLimit v-model="params.limit" />
          </div>
        </div>

        <div class="col-md-9">
          <div
            class="d-flex flex-sm-column flex-md-row align-items-center justify-content-md-end my-sm-1 my-md-0"
          >
            <div class="mb-md-0">
              <InputSearch
                type="search"
                class="form-control"
                placeholder="Cari Box"
                v-model="params.search"
              />
            </div>
            <!-- <div class="dt-buttons ms-sm-2">
              <BaseButton
                @click="handleAddBox"
                title="Tambah Box"
                :access="['masterboxadd']"
              >
                <template name="icon-left">
                  <tabler-icon icon="PlusIcon"></tabler-icon>
                </template>
              </BaseButton>
            </div> -->
          </div>
        </div>
      </div>

      <div class="table-responsive mb-2">
        <v-table
          class="table table-hover"
          :data="listBox"
          :pageSize="params.limit"
        >
          <thead class="table-light" slot="head">
            <tr>
              <th>No</th>
              <v-th sortKey="serial_number">Nomor Seri</v-th>
              <v-th sortKey="created_at">Tanggal Dibuat</v-th>
              <v-th sortKey="status" class="text-center">Status</v-th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody slot="body" slot-scope="{ displayData }">
            <tr v-if="isLoading">
              <td colspan="5" class="text-center">Loading...</td>
            </tr>

            <tr
              v-else-if="!isLoading && displayData.length"
              v-for="(item, index) in displayData"
              :key="item.id"
            >
              <td>{{ offset + (index + 1) }}</td>
              <td>{{ item?.serial_number || "-" }}</td>
              <td>
                {{ item?.created_at ? formatDate(item?.created_at) : "-" }}
              </td>
              <td class="text-center">
                <span
                  v-if="item?.status"
                  class="badge rounded-pill"
                  :class="badgeStatusBox(item?.status)"
                >
                  {{ labelStatusBox(item?.status) }}
                </span>

                <span v-else>-</span>
              </td>
              <td>
                <div class="d-flex align-items-center col-actions">
                  <BaseButton
                    :access="['masterboxedit']"
                    @click="handleEditBox({ id: item?.id })"
                    className="btn btn-icon me-1"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    data-bs-original-title="Edit"
                  >
                    <tabler-icon class="me-25" icon="EditIcon" size="24" />
                  </BaseButton>

                  <BaseButton
                    @click="
                      handleDeleteBox({
                        id: item?.id,
                        title: `${item?.dimensi?.box} ${item?.serial_number}`,
                      })
                    "
                    :access="['masterboxdelete']"
                    className="btn btn-icon me-1"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    data-bs-original-title="Delete"
                  >
                    <tabler-icon class="me-25" icon="TrashIcon" size="24" />
                  </BaseButton>
                </div>
              </td>
            </tr>

            <tr v-else>
              <td colspan="5" class="text-center">Tidak ada Box ditemukan</td>
            </tr>
          </tbody>
        </v-table>
      </div>
      <CustomPagination
        v-if="!isLoading"
        :currentDataLength="listBox?.length"
        :totalData="meta.total"
      >
        <template #page>
          <smart-pagination
            v-if="listBox.length"
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
</template>

<script>
import BoxNetwork from "@/network/lib/box";

import BaseButton from "@/components/Button/BaseButton.vue";
import DropdownLimit from "@/components/DropdownLimit/DropdownLimit.vue";
import CustomPagination from "@/components/Pagination/CustomPagination.vue";
import InputSearch from "@/components/InputSearch/InputSearch.vue";
import Spinner from "@/components/Loading/Spinner.vue";

import { formatDateMoments } from "@/utils/momentDateFormat";

export default {
  name: "BoxList",
  components: {
    BaseButton,
    CustomPagination,
    DropdownLimit,
    Spinner,
    InputSearch,
  },
  data() {
    return {
      isLoading: false,
      listBox: [],
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

    changeListBox() {
      return [this.params.limit, this.offset, this.params.search];
    },

    formatDate() {
      return (value) => formatDateMoments(value);
    },
    badgeStatusBox() {
      return (value) => {
        if (value === "empty") {
          return "badge-light-dark";
        } else if (value === "booked") {
          return "badge-light-success";
        } else if (value === "filled") {
          return "badge-light-primary";
        }
      };
    },
    labelStatusBox() {
      return (value) => {
        if (value === "empty") {
          return "Belum Terisi";
        } else if (value === "booked") {
          return "Sudah di Booking";
        } else if (value === "filled") {
          return "Sudah Terisi";
        }
      };
    },
  },

  watch: {
    changeListBox: {
      handler: function () {
        this.getListBox();
      },
      deep: true,
    },
  },

  methods: {
    async getListBox() {
      this.isLoading = true;

      try {
        const response = await BoxNetwork.getListBox({
          limit: this.params.limit,
          offset: this.offset,
          search: this.params.search,
        });

        if (response) {
          this.isLoading = false;
          this.listBox = response?.data?.rows;
          this.meta = {
            current_page: response?.data?.meta?.current_page,
            per_page: response?.data?.meta?.per_page,
            total: response?.data?.meta?.total,
          };
        }
      } catch (error) {
        this.isLoading = false;
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },

    async deleteBox({ id }) {
      try {
        const response = await BoxNetwork.deleteBox({ id: id });

        if (response) {
          this.$store.dispatch("toast/showToastSuccess", {
            title: "Hapus Data Box",
            text: "Berhasil Menghapus Data Box",
          });

          this.getListBox();
        }
      } catch (error) {
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },

    handleAddBox() {
      this.$router.push("/box/add");
    },

    handleEditBox({ id }) {
      this.$router.push(`/box/${id}/edit`);
    },

    handleDeleteBox({ id, title }) {
      this.$swal({
        title: `Apakah Yakin Untuk Menghapus Box ${title}?`,
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
          this.deleteBox({ id: id });
        }
      });
    },
  },

  mounted() {
    this.getListBox();
  },
};
</script>

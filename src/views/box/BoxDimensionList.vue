<template>
  <div class="card">
    <div class="card-header border-bottom row">
      <h5 class="card-title mb-2">List Dimensi</h5>
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
            <div class="dt-buttons ms-sm-2">
              <BaseButton
                @click="handleAddDimensionBox"
                title="Tambah Dimensi Box"
                :access="['masterboxdimensionadd']"
              >
                <template name="icon-left">
                  <tabler-icon icon="PlusIcon"></tabler-icon>
                </template>
              </BaseButton>
            </div>
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
              <v-th sortKey="box">Box</v-th>
              <th>Deskripsi</th>
              <v-th sortKey="created_at">Tanggal Dibuat</v-th>
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
              <td>{{ item?.box || "-" }}</td>
              <td class="text-truncate">{{ item?.deskripsi || "-" }}</td>
              <td>
                {{ item?.created_at ? formatDate(item?.created_at) : "-" }}
              </td>
              <td>
                <div class="d-flex align-items-center col-actions">
                  <BaseButton
                    className="btn btn-icon me-1"
                    @click="
                      toggleModalHistory({
                        value: true,
                        item: item,
                      })
                    "
                    data-bs-toggle="modal"
                    data-bs-target="#modal_history_box_dimension"
                  >
                    <tabler-icon class="me-25" icon="HistoryIcon" size="24" />
                  </BaseButton>

                  <BaseButton
                    :access="['masterboxdimensionedit']"
                    @click="handleEditDimensionBox({ id: item?.id })"
                    className="btn btn-icon me-1"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    data-bs-original-title="Edit"
                  >
                    <tabler-icon class="me-25" icon="EditIcon" size="24" />
                  </BaseButton>

                  <BaseButton
                    @click="
                      handleDeleteDimensionBox({
                        id: item?.id,
                        title: item?.box,
                      })
                    "
                    :access="['masterboxdimensiondelete']"
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
              <td colspan="5" class="text-center">
                Tidak ada Dimensi Box ditemukan
              </td>
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

    <ModalHistoryBoxDimension
      :listBox="listBox"
      :selectedBox="selectedBox"
      :isShowModal="isShowModal"
    />
  </div>
</template>

<script>
import BoxNetwork from "@/network/lib/box";

import BaseButton from "@/components/Button/BaseButton.vue";
import DropdownLimit from "@/components/DropdownLimit/DropdownLimit.vue";
import CustomPagination from "@/components/Pagination/CustomPagination.vue";
import InputSearch from "@/components/InputSearch/InputSearch.vue";
import Spinner from "@/components/Loading/Spinner.vue";

import ModalHistoryBoxDimension from "@/views/box/components/ModalHistoryBoxDimension.vue";

import { formatDateMoments } from "@/utils/momentDateFormat";

export default {
  name: "BoxDimensionList",
  components: {
    BaseButton,
    CustomPagination,
    DropdownLimit,
    Spinner,
    InputSearch,
    ModalHistoryBoxDimension,
  },
  data() {
    return {
      isShowModal: false,
      isLoading: false,
      listBox: [],
      selectedBox: {},
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

    changeListDimensionBox() {
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
    changeListDimensionBox: {
      handler: function () {
        this.getListDimensionBox();
      },
      deep: true,
    },
  },

  methods: {
    async getListDimensionBox() {
      this.isLoading = true;

      try {
        const response = await BoxNetwork.getListDimensionBox({
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

    async deleteDimensionBox({ id }) {
      try {
        const response = await BoxNetwork.deleteDimensionBox({ id: id });

        if (response) {
          this.$store.dispatch("toast/showToastSuccess", {
            title: "Hapus Data Dimensi Box",
            text: "Berhasil Menghapus Data Dimensi Box",
          });

          this.getListDimensionBox();
        }
      } catch (error) {
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },

    handleAddDimensionBox() {
      this.$router.push("/box/dimension/add");
    },

    handleEditDimensionBox({ id }) {
      this.$router.push(`/box/dimension/${id}/edit`);
    },

    handleDeleteDimensionBox({ id, title }) {
      this.$swal({
        title: `Apakah Yakin Untuk Menghapus Dimensi Box ${title}?`,
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
          this.deleteDimensionBox({ id: id });
        }
      });
    },

    toggleModalHistory({ value, item }) {
      this.isShowModal = value;
      this.selectedBox = item;
    },
  },

  mounted() {
    this.getListDimensionBox();
  },
};
</script>

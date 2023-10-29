<template>
  <div>
    <div class="card">
      <div class="card-header border-bottom row">
        <h5 class="card-title mb-2">List Ruangan</h5>
      </div>

      <div class="card-body">
        <div class="row my-2 d-flex justify-content-center align-items-center">
          <div class="col-md-2">
            <div
              class="d-flex justify-content-md-start justify-content-sm-center align-items-md-start align-items-sm-center"
            >
              <DropdownLimit v-model="params.limit" />
            </div>
          </div>

          <div class="col-md-10">
            <div
              class="d-flex flex-sm-column flex-md-row align-items-center justify-content-md-end my-sm-1 my-md-0"
            >
              <div class="mb-md-0">
                <InputSearch
                  type="search"
                  class="form-control"
                  placeholder="Cari Ruangan"
                  v-model="params.search"
                />
              </div>
              <div class="dt-buttons ms-sm-2">
                <BaseButton @click="handleAddRuangan" title="Tambah Ruangan">
                  <template name="icon-left">
                    <tabler-icon icon="PlusIcon"></tabler-icon>
                  </template>
                </BaseButton>
              </div>
            </div>
          </div>
        </div>

        <div class="table-responsive mb-2">
          <VTable
            class="table table-hover"
            :data="listRuangan"
            :pageSize="params.limit"
          >
            <template class="table-light" #head>
              <tr>
                <th>No</th>
                <VTh sortKey="ruangan">Ruangan</VTh>
                <VTh sortKey="row_capacity">Baris</VTh>
                <VTh sortKey="column_capacity">Kolum</VTh>
                <th>Gudang</th>
                <VTh sortKey="status" class="text-center">Status</VTh>
                <th>Actions</th>
              </tr>
            </template>
            <template #body="{ rows }">
              <tr v-if="isLoading">
                <td colspan="7" class="text-center">Loading...</td>
              </tr>
              <tr
                v-else-if="!isLoading && rows.length"
                v-for="(item, index) in rows"
                :key="item.id"
              >
                <td>{{ offset + (index + 1) }}</td>
                <td>{{ item?.ruangan }}</td>
                <td>{{ item?.row_capacity }}</td>
                <td>{{ item?.column_capacity }}</td>
                <td>{{ item?.gudang?.gudang || "-" }}</td>
                <td class="text-center">
                  <span
                    class="badge rounded-pill"
                    :class="
                      item?.status == 1
                        ? 'badge-light-success'
                        : 'badge-light-danger'
                    "
                  >
                    {{ item?.status == 1 ? "Aktif" : "Tidak Aktif" }}
                  </span>
                </td>
                <td>
                  <div class="d-flex align-items-center col-actions">
                    <BaseButton
                      @click="handleDetailRuangan({ id: item?.id })"
                      className="btn btn-icon me-1"
                      :access="['masterruangan']"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      data-bs-original-title="Detail"
                    >
                      <tabler-icon icon="EyeIcon" size="24" />
                    </BaseButton>

                    <div class="dropdown">
                      <BaseButton
                        className="btn btn-sm btn-icon dropdown-toggle hide-arrow"
                        :access="['masterruangan']"
                        data-bs-toggle="dropdown"
                      >
                        <tabler-icon icon="DotsVerticalIcon" size="24" />
                      </BaseButton>

                      <div class="dropdown-menu dropdown-menu-end">
                        <BaseButton
                          @click="handleEditRuangan({ id: item?.id })"
                          className="dropdown-item w-100"
                          :access="['masterruanganedit']"
                          title="Edit"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          data-bs-original-title="Edit"
                        >
                          <tabler-icon
                            class="me-25"
                            icon="EditIcon"
                            size="16"
                          />
                        </BaseButton>

                        <BaseButton
                          @click="
                            handleDeleteRuangan({
                              id: item?.id,
                              title: item?.ruangan,
                            })
                          "
                          className="dropdown-item w-100"
                          :access="['masterruangandelete']"
                          title="Delete"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          data-bs-original-title="Delete"
                        >
                          <tabler-icon
                            class="me-25"
                            icon="TrashIcon"
                            size="16"
                          />
                        </BaseButton>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr v-else>
                <td colspan="7" class="text-center">
                  Tidak ada Layanan ditemukan
                </td>
              </tr>
            </template>
          </VTable>

          <CustomPagination
            v-if="!isLoading"
            :currentDataLength="listRuangan?.length"
            :totalData="meta.total"
          >
            <template #page>
              <VTPagination
                v-if="listRuangan.length"
                :currentPage.sync="params.page"
                :total-pages="Math.ceil(meta.total / params.limit)"
                :hideSinglePage="false"
                :boundary-links="true"
              >
                <template #firstPage>
                  <tabler-icon icon="ChevronsLeftIcon" />
                </template>

                <template #lastPage>
                  <tabler-icon icon="ChevronsRightIcon" />
                </template>
                <template #previous>
                  <span>Prev</span>
                </template>
                <template #next>
                  <span>Next</span>
                </template>
              </VTPagination>
            </template>
          </CustomPagination>
        </div>

        <!-- <div class="mb-2">
            <table class="table table-responsive table-hover">
              <thead class="table-light">
                <tr>
                  <th>No</th>
                  <th>Ruangan</th>
                  <th>Baris</th>
                  <th>Kolum</th>
                  <th>Gudang</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                <template
                  v-if="
                    Array.isArray(listRuang?.data) && listRuang?.data?.length
                  "
                >
                  <tr v-for="(item, index) in listRuang?.data" :key="item?.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item?.ruangan }}</td>
                    <td>{{ item?.row_capacity }}</td>
                    <td>{{ item?.column_capacity }}</td>
                    <td>{{ item?.gudang?.gudang }}</td>
                    <td>
                      <span
                        class="badge rounded-pill"
                        :class="
                          item?.status == 1
                            ? 'badge-light-success'
                            : 'badge-light-danger'
                        "
                      >
                        {{ item?.status == 1 ? "Aktif" : "Tidak Aktif" }}
                      </span>
                    </td>
                    <td>
                      <div class="d-flex align-items-center col-actions">
                        <BaseButton
                          className="btn btn-icon me-1"
                          :access="['masterruangan']"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          data-bs-original-title="Edit"
                        >
                          <tabler-icon icon="EyeIcon" size="24" />
                        </BaseButton>

                        <div class="dropdown">
                          <BaseButton
                            className="btn btn-sm btn-icon dropdown-toggle hide-arrow"
                            :access="['masterruangan']"
                            data-bs-toggle="dropdown"
                          >
                            <tabler-icon icon="DotsVerticalIcon" size="24" />
                          </BaseButton>

                          <div class="dropdown-menu dropdown-menu-end">
                            <BaseButton
                              className="dropdown-item w-100"
                              :access="['masterruanganedit']"
                              title="Edit"
                            >
                              <tabler-icon
                                class="me-25"
                                icon="EditIcon"
                                size="16"
                              />
                            </BaseButton>

                            <BaseButton
                              className="dropdown-item w-100"
                              :access="['masterruangandelete']"
                              title="Delete"
                            >
                              <tabler-icon
                                class="me-25"
                                icon="TrashIcon"
                                size="16"
                              />
                            </BaseButton>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import RuanganNetwork from "@/network/lib/ruangan";
import BreadCrumb from "@/components/BreadCrumb/BreadCrumb.vue";
import BaseButton from "@/components/Button/BaseButton.vue";
import DropdownLimit from "@/components/DropdownLimit/DropdownLimit.vue";
import CustomPagination from "@/components/Pagination/CustomPagination.vue";
import InputSearch from "@/components/InputSearch/InputSearch.vue";
import Spinner from "@/components/Loading/Spinner.vue";

export default {
  name: "Ruangan",
  components: {
    BreadCrumb,
    BaseButton,
    DropdownLimit,
    InputSearch,
    CustomPagination,
    Spinner,
  },
  data() {
    return {
      isLoading: false,
      listRuangan: [],
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
    changeListRuangan() {
      return [this.params.limit, this.offset, this.params.search];
    },
  },
  watch: {
    changeListRuangan: {
      handler: function () {
        this.getListRuangan();
      },
      deep: true,
    },
  },
  methods: {
    async getListRuangan() {
      this.isLoading = true;
      try {
        const response = await RuanganNetwork.getListRuangan({
          limit: this.params.limit,
          offset: this.offset,
          search: this.params.search,
        });

        if (response) {
          this.isLoading = false;
          this.listRuangan = response?.data?.rows;
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

    async deleteRuangan({ id }) {
      try {
        const response = await RuanganNetwork.deleteRuangan({ id: id });

        if (response) {
          this.$store.dispatch("toast/showToastSuccess", {
            title: "Hapus Data Ruangan",
            text: "Berhasil Menghapus Data Ruangan",
          });

          this.getListRuangan();
        }
      } catch (error) {
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },

    handleAddRuangan() {
      this.$router.push("/ruangan/add");
    },

    handleDetailRuangan({ id }) {
      this.$router.push(`/ruangan/${id}/detail`);
    },

    handleEditRuangan({ id }) {
      this.$router.push(`/ruangan/${id}/edit`);
    },

    handleDeleteRuangan({ id, title }) {
      this.$swal({
        title: `Apakah Yakin Untuk Menghapus Ruangan ${title}?`,
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
          this.deleteRuangan({ id: id });
        }
      });
    },
  },
  mounted() {
    this.getListRuangan();
  },
};
</script>

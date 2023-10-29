<template>
  <div class="col-lg-6 col-md-6 col-12">
    <div class="card">
      <div class="card-body">
        <div class="row">
          <!-- Chart -->
          <div class="col-sm-6 col-lg-5">
            <ApexChartsDonut
              :height="120"
              :series="series"
              :labels="labels"
              totalLabel="Kapasitas"
              :totalValue="percentageCapacity"
            />
          </div>

          <!-- Description -->
          <div class="col-sm-6 col-lg-7">
            <h4 class="card-title mb-1 fw-bold">{{ ruangan }}</h4>
            <div class="font-small-2">Kapasitas Box</div>
            <h5 class="mb-1">{{ total_box_capacity || 0 }} Box</h5>

            <div
              class="d-flex align-items-center justify-content-between col-actions mt-1"
            >
              <BaseDropdownButton
                @click="handleDetail"
                type="button"
                title="Lihat Detail"
                :access="['masterruangan']"
                dropdownToggleClassName="btn btn-outline-primary dropdown-toggle dropdown-toggle-split waves-effect"
              >
                <template #dropdown>
                  <BaseButton
                    @click="toggleModalHistory"
                    className="dropdown-item w-100"
                    data-bs-toggle="modal"
                    data-bs-target="#modal_history_ruangan"
                    title="History"
                  >
                    <tabler-icon class="me-25" icon="HistoryIcon" size="16" />
                  </BaseButton>

                  <BaseButton
                    @click="handleEdit"
                    className="dropdown-item w-100"
                    :access="['masterruanganedit']"
                    title="Edit"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    data-bs-original-title="Edit"
                  >
                    <tabler-icon class="me-25" icon="EditIcon" size="16" />
                  </BaseButton>

                  <BaseButton
                    @click="handleDelete"
                    className="dropdown-item w-100"
                    :access="['masterruangandelete']"
                    title="Delete"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    data-bs-original-title="Delete"
                  >
                    <tabler-icon class="me-25" icon="TrashIcon" size="16" />
                  </BaseButton>

                  <BaseButton
                    @click="handleSettingPrefix"
                    className="dropdown-item w-100"
                    :access="['masterruanganedit']"
                    title="Atur Prefix"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    data-bs-original-title="Prefix"
                  >
                    <tabler-icon class="me-25" icon="SettingsIcon" size="16" />
                  </BaseButton>
                </template>
              </BaseDropdownButton>
            </div>

            <!-- <p class="card-text text-muted font-small-2">
              <span class="fw-bolder">68.2%</span
              ><span> more earnings than last month.</span>
            </p> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseButton from "@/components/Button/BaseButton.vue";
import BaseDropdownButton from "@/components/Button/BaseDropdownButton.vue";

import ApexChartsDonut from "@/components/ApexCharts/ApexChartsDonut.vue";

export default {
  name: "RuanganCardItem",
  props: [
    "id",
    "ruangan",
    "row_capacity",
    "column_capacity",
    "gudang",
    "status",
    "total_box_capacity",
    "total_box_used",
  ],
  components: {
    BaseButton,
    BaseDropdownButton,
    ApexChartsDonut,
  },
  data() {
    return {
      labels: ["Baris", "Kolom"],
      series: [
        parseInt(this.row_capacity || 0),
        parseInt(this.column_capacity),
      ],
    };
  },
  computed: {
    percentageCapacity() {
      return (
        parseInt(this.total_box_used) / parseInt(this.total_box_capacity) || 0
      );
    },
  },
  methods: {
    handleDelete() {
      this.$emit("handle-delete");
    },
    handleEdit() {
      this.$emit("handle-edit");
    },
    handleDetail() {
      this.$emit("handle-detail");
    },
    handleSettingPrefix() {
      this.$emit("handle-setting-prefix");
    },
    toggleModalHistory() {
      this.$emit("toggle-modal-history");
    },
  },
};
</script>

<template>
  <div class="col-lg-4 col-md-6 col-12">
    <div class="card card-profile hovering-zoom relative">
      <div class="dropdown position-absolute top-0 end-0 p-1">
        <BaseButton
          className="btn btn-icon badge badge-center rounded-pill bg-primary"
          :access="['masterruangan']"
          data-bs-toggle="dropdown"
        >
          <tabler-icon icon="DotsVerticalIcon" class="text-white" size="24" />
        </BaseButton>

        <div class="dropdown-menu dropdown-menu-end">
          <BaseButton
            @click="toggleModalHistory"
            className="dropdown-item w-100"
            data-bs-toggle="modal"
            data-bs-target="#modal_history_gudang"
            title="History"
          >
            <tabler-icon class="me-25" icon="HistoryIcon" size="16" />
          </BaseButton>

          <BaseButton
            @click="handleEdit"
            className="dropdown-item w-100"
            :access="['mastergudangedit']"
            title="Edit"
          >
            <tabler-icon class="me-25" icon="EditIcon" size="16" />
          </BaseButton>

          <BaseButton
            @click="handleDelete"
            className="dropdown-item w-100"
            :access="['mastergudangdelete']"
            title="Delete"
          >
            <tabler-icon class="me-25" icon="TrashIcon" size="16" />
          </BaseButton>
        </div>
      </div>
      <img
        src="/app-assets/images/gudang.webp"
        class="img-fluid card-img-top"
        alt="Photo Gudang"
        @error="
          (event) => (event.target.src = '/app-assets/images/gudang.webp')
        "
      />
      <div class="card-body p-2">
        <h3>{{ name }}</h3>
        <h6 class="text-muted">{{ address }}</h6>
        <h6 class="text-muted">{{ spanPhoneMasked(phone) }}</h6>

        <hr class="mb-2" />
        <div class="d-flex justify-content-center align-items-center">
          <div>
            <h6 class="text-muted fw-bolder">Kode</h6>
            <h3 class="mb-0">{{ code || "-" }}</h3>
          </div>
        </div>
      </div>

      <div
        class="w-100 py-50 rounded-bottom text-white fw-bold"
        :class="[isActive ? 'bg-success' : 'bg-dark']"
      >
        <span class="d-flex justify-content-center align-items-center">
          {{ isActive ? "Aktif" : "Tidak Aktif" }}
          <tabler-icon
            class="ms-50"
            :icon="isActive ? 'CircleCheckIcon' : 'CircleXIcon'"
        /></span>
      </div>
    </div>
  </div>
</template>

<script>
import BaseButton from "@/components/Button/BaseButton.vue";

export default {
  name: "GudangCardItem",
  components: {
    BaseButton,
  },
  props: ["id", "name", "address", "phone", "code", "status"],
  computed: {
    isActive() {
      if (this.status == 1) {
        return true;
      } else {
        return false;
      }
    },
    spanPhoneMasked() {
      return (value) => {
        if (!value) {
          return "-";
        }

        if (typeof value === "string") {
          const codePhoneArea = value.slice(0, 2);

          const restOfPhone = value.slice(2, value.length);

          return `+(${codePhoneArea})-${restOfPhone}`;
        }

        return null;
      };
    },
  },
  methods: {
    handleDelete() {
      this.$emit("handle-delete");
    },
    handleEdit() {
      this.$emit("handle-edit");
    },
    toggleModalHistory() {
      this.$emit("toggle-modal-history");
    },
  },
};
</script>

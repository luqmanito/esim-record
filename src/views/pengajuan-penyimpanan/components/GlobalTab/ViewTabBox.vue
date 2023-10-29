<template>
  <div class="row my-2">
    <div class="content-body">
      <div class="rounded border p-2 mb-2">
        <small class="fw-bolder card-text text-uppercase ms-2 text-primary">Informasi Box Tersimpan</small>
        <hr />

        <div class="table-responsive ">
          <table class="table">
            <thead class="table-light">
              <tr>
                <th>No</th>
                <th>Layanan</th>
                <th>Dimensi Box</th>
                <th class="text-center">Jumlah Box</th>
              </tr>
            </thead>

            <tbody>
              <template v-if="savedBox.length">
                <tr v-for="(box, index) in savedBox" :key="`saved-box-${index}-${box.id}`">
                  <td>{{ index + 1 }}</td>
                  <td>{{ box.layanan?.layanan }}</td>
                  <td>{{ box.dimensi_box?.box }}</td>
                  <td class="text-center">{{ box.jumlah_box }}</td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>

      <div class="row py-3">
        <div class="col-lg-6 text-sm-center text-lg-start mb-sm-2 mb-lg-0">
          <BaseButton type="button" @click="handleClickAction({ type: 'back', urutan: urutanBack })"
            className="btn btn-outline-primary" title="Sebelumnya">
            <template #icon-left>
              <tabler-icon icon="ChevronLeftIcon" />
            </template>
          </BaseButton>
        </div>

        <div class="col-lg-6 text-sm-center text-lg-end mb-sm-2 mb-lg-0">
          <BaseButton v-if="currentStep?.penyimpananflow?.status == 'done'" :isDisabled="isDisabled"
            @click="handleClickAction({ type: 'next', urutan: urutanNext })" type="button" className="btn btn-primary"
            title="Selanjutnya">
            <template #icon-right>
              <tabler-icon icon="ChevronRightIcon" />
            </template>
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
import BaseButton from "@/components/Button/BaseButton.vue";

export default {
  name: 'ViewTabBox',
  components: {
    BaseButton
  },
  props: {
    urutanBack: {
      type: [String, Number]
    },
    urutanNext: {
      type: [String, Number]
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    currentStep() {
      return this.$store.state.pengajuanPenyimpanan.currentStep;
    },
    savedBox() {
      return this.$store.state.pengajuanPenyimpanan.fjb?.savedBox;
    },
  },
  methods: {
    handleClickAction({ type, urutan }) {
      this.$emit("handle-click-action", { type, urutan });
    },
  },
}
</script>
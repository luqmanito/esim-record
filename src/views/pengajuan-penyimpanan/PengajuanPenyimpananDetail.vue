<template>
  <div class="content-wrapper">
    <div class="content-body">
      <Spinner v-if="isLoading" className="mt-5" />

      <div v-else class="card">
        <div class="card-header bg-primary justify-content-center">
          <h5 class="card-title text-white">
            {{ detailPengajuanPenyimpanan?.pelanggan?.nama }}
          </h5>
        </div>

        <section class="stepper">
          <div class="bs-stepper">
            <template v-if="Array.isArray(listStep)">
              <div @mousedown.left="onMouseDown">
                <vue-horizontal class="bs-stepper-header horizontal" ref="horizontal" snap="center" @scroll="onScroll"
                  :button="false">
                  <template v-for="(step, index) in listStep">
                    <StepperHeaderItem :key="step.urutan" :urutan="step.urutan" :code="step.code" :title="step.proses"
                      :isActive="isActive(step.code)" :isCompleted="step.penyimpananflow.status == 'done'"
                      :isDisabled="isDisabled(step.penyimpananflow.status)" @handle-click-step="
                        handleClickStep({ urutan: step.urutan - 1 })
                      ">
                      <template #icon>
                        <v-icon :name="step.icon || 'la-box-solid'" />
                      </template>
                    </StepperHeaderItem>
                    <div v-if="index !== listStep.length - 1" :key="`line-${step.urutan}`"
                      class="line d-flex justify-content-center align-items-center">
                      <tabler-icon icon="ChevronRightIcon" class="font-medium-2" />
                    </div>
                  </template>
                </vue-horizontal>
              </div>
            </template>

            <div class="bs-stepper-content">
              <transition name="fade-top" mode="out-in">
                <component :is="currentStep?.code" @handle-click-action="handleClickAction" />
              </transition>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import VueHorizontal from "vue-horizontal";
import Spinner from "@/components/Loading/Spinner.vue";
import StepperHeaderItem from "@/views/pengajuan-penyimpanan/components/StepperHeaderItem.vue";

export default {
  name: "PengajuanPenyimpananDetail",
  components: {
    VueHorizontal,
    StepperHeaderItem,
    Spinner,
    fmp: () =>
      import(
        "@/views/pengajuan-penyimpanan/components/StepFormMinat/StepFormMinat.vue"
      ),
    pjb: () =>
      import(
        "@/views/pengajuan-penyimpanan/components/StepPerhitunganJumlahBox/StepPerhitunganJumlahBox.vue"
      ),
    ktk: () =>
      import(
        "@/views/pengajuan-penyimpanan/components/StepKontrak/StepKontrak.vue"
      ),
    piv: () =>
      import(
        "@/views/pengajuan-penyimpanan/components/StepPembayaranDraftInvoice/StepPembayaranDraftInvoice.vue"
      ),
  },
  data() {
    return {
      isLoading: false,
      pelanggan: {},
      listFlowPenyimpanan: {
        loading: false,
        data: [],
      },
      stepperHeader: {
        left: 0,
        originX: 0,
        originLeft: 0,
        hasPrev: false,
        hasNext: true,
      },
    };
  },

  computed: {
    idParams() {
      return this.$route.params?.id;
    },

    isActive() {
      return (value) => value === this.currentStep?.code;
    },

    listStep() {
      return this.$store.state.pengajuanPenyimpanan.listStep;
    },

    currentStep() {
      return this.$store.state.pengajuanPenyimpanan.currentStep;
    },

    isDisabled() {
      return (value) => {
        if (value != 'done' && value != 'progress') {
          return true
        } else {
          return false
        }
      };
    },

    detailPengajuanPenyimpanan() {
      return this.$store.state.pengajuanPenyimpanan.detail;
    },

    savedBox() {
      return this.$store.state.pengajuanPenyimpanan.fjb?.savedBox;
    },

    syncedContract() {
      return this.$store.state.pengajuanPenyimpanan.ktk?.syncedContract;
    },

    syncedTransaction() {
      return this.$store.state.pengajuanPenyimpanan.piv?.syncedTransaction;
    }

  },

  methods: {
    handleClickStep({ urutan }) {
      this.$store.commit("pengajuanPenyimpanan/SET_CURRENT_STEP", {
        ...this.listStep[urutan],
      });
    },

    handlePrevOrNextStep({ type, urutan }) {
      if (type == "next") {
        const nextStep = this.listStep.find((item) => item.urutan == urutan);

        if (nextStep) {
          this.$store.commit("pengajuanPenyimpanan/SET_CURRENT_STEP", {
            ...nextStep,
          });
        }
      } else if (type == "back") {
        const prevStep = this.listStep.find((item) => item.urutan == urutan);

        if (prevStep) {
          this.$store.commit("pengajuanPenyimpanan/SET_CURRENT_STEP", {
            ...prevStep,
          });
        }
      }
    },

    async handleClickAction({ type, urutan }) {
      if (type == "save") {
        const choosenStep = this.listStep.find(item => item?.urutan == urutan)
        if (choosenStep?.code == "fmp") {
          this.saveFormPengajuanMinat({
            id: this.idParams,
          });
        } else if (choosenStep?.code == "pjb") {
          const box = [];

          this.savedBox.map((item) =>
            box.push({
              layanan_id: item.layanan.id,
              box_dimension_id: item.dimensi_box.id,
              qty_box: item.jumlah_box,
            })
          );

          this.savePerhitunganBox({
            id: this.idParams,
            box: box,
          });

        } else if (choosenStep?.code == 'ktk') {
          this.saveLOCKontrak({
            id: this.idParams,
            pelanggan_id: this.detailPengajuanPenyimpanan?.pelanggan?.id,
            contract_number: this.syncedContract?.ContractNumber
          });
        } else if (choosenStep?.code == 'piv') {
          this.saveDraftInvoice({
            id: this.idParams,
            invoice_number: this.syncedTransaction?.TransactionNumber,
            customer_transaction_id: this.syncedTransaction?.CustomerTransactionId
          });
        }
      } else {
        this.handlePrevOrNextStep({ type, urutan });
      }
    },

    onScroll({ left, hasPrev, hasNext }) {
      this.stepperHeader.left = left;

      this.stepperHeader.hasPrev = hasPrev;
      this.stepperHeader.hasNext = hasNext;
    },

    onMouseDown(e) {
      this.stepperHeader.originX = e.pageX;
      this.stepperHeader.originLeft = this.stepperHeader.left;

      window.addEventListener("mouseup", this.onMouseUp);
      window.addEventListener("mousemove", this.onMouseMove);
    },

    onMouseUp() {
      window.removeEventListener("mouseup", this.onMouseUp);
      window.removeEventListener("mousemove", this.onMouseMove);
    },

    onMouseMove(e) {
      const offset = e.pageX - this.stepperHeader.originX;
      const left = this.stepperHeader.originLeft - offset;
      this.$refs.horizontal.scrollToLeft(left, "auto");
    },

    async getPengajuanPenyimpananById() {
      this.isLoading = true;

      try {
        const response = await this.$store.dispatch(
          "pengajuanPenyimpanan/getDetailPengajuanPenyimpanan",
          { id: this.idParams }
        );

        if (response) {
          this.isLoading = false;

          return response;
        }
      } catch (error) {
        this.isLoading = false;
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },

    async saveFormPengajuanMinat({ id }) {
      let loader = this.$loading.show();

      try {
        const response = await this.$store.dispatch(
          "pengajuanPenyimpanan/saveFormPengajuanMinat",
          { id }
        );

        if (response) {
          loader.hide();
          return response;
        }
      } catch (error) {
        loader.hide();
      } finally {
        loader.hide();
      }
    },

    async savePerhitunganBox({ id, box }) {
      let loader = this.$loading.show();

      try {
        const response = await this.$store.dispatch(
          "pengajuanPenyimpanan/savePerhitunganBox",
          { id, box }
        );

        if (response) {
          loader.hide();
          return response;
        }
      } catch (error) {
        loader.hide();
      } finally {
        loader.hide();
      }
    },

    async saveLOCKontrak({ id, pelanggan_id, contract_number }) {
      let loader = this.$loading.show();

      try {
        const response = await this.$store.dispatch(
          "pengajuanPenyimpanan/saveLOCKontrak",
          { id, pelanggan_id, contract_number }
        );

        if (response) {
          loader.hide();
          return response;
        }
      } catch (error) {
        loader.hide();
      } finally {
        loader.hide();
      }
    },

    async saveDraftInvoice({ id, invoice_number, customer_transaction_id }) {
      let loader = this.$loading.show();

      try {
        const response = await this.$store.dispatch(
          "pengajuanPenyimpanan/saveDraftInvoice",
          { id, invoice_number, customer_transaction_id }
        );

        if (response) {
          loader.hide();
          return response;
        }
      } catch (error) {
        loader.hide();
      } finally {
        loader.hide();
      }
    }
  },

  created() {
    this.getPengajuanPenyimpananById().then(() => {
      if (Array.isArray(this.listStep)) {
        const currentProgress = this.listStep.find(
          (item) => item.penyimpananflow.status === "progress"
        );

        if (currentProgress) {
          this.$store.commit(
            "pengajuanPenyimpanan/SET_CURRENT_STEP",
            currentProgress
          );
        } else {
          this.$store.commit(
            "pengajuanPenyimpanan/SET_CURRENT_STEP",
            this.listStep[0]
          );
        }
      }
    });
  },

  destroyed() {
    this.$store.dispatch('pengajuanPenyimpanan/clearState')
  }
};
</script>
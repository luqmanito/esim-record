<template>
  <div id="piv" role="tabpanel" aria-labelledby="piv_trigger">
    <div class="content-header text-center">
      <h5 class="mb-0">Pembayaran Draft Invoice</h5>
      <small class="text-muted">Draft Invoice Sebelum Invoice Final</small>
    </div>

    <div class="content-body">
      <ul class="nav nav-pills flex-column flex-md-row mt-5 justify-content-center">
        <li class="nav-item">
          <a @click="handleClickView('input_data_draft_invoice')" class="nav-link"
            :class="[view_tab === 'input_data_draft_invoice' ? 'active' : '']"><tabler-icon icon="FileDescriptionIcon" />
            Input Data
            Draft Invoice
          </a>
        </li>
        <li class="nav-item">
          <a @click="handleClickView('pelanggan')" class="nav-link"
            :class="[view_tab === 'pelanggan' ? 'active' : '']"><tabler-icon icon="UserCircleIcon" /> Pelanggan
          </a>
        </li>

        <li class="nav-item">
          <a @click="handleClickView('box')" class="nav-link" :class="[view_tab === 'box' ? 'active' : '']"><tabler-icon
              icon="BoxIcon" /> Box
          </a>
        </li>
      </ul>

      <transition name="fade-top" mode="out-in">
        <keep-alive>
          <component :is="view_tab" :urutanBack="currentStep?.urutan - 1" :urutanNext="currentStep?.urutan + 1"
            @handle-click-action="handleClickAction"></component>
        </keep-alive>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: "piv",
  components: {
    ["input_data_draft_invoice"]: () =>
      import(
        "@/views/pengajuan-penyimpanan/components/StepPembayaranDraftInvoice/ViewTabInputDataDraftInvoice.vue"
      ),
    pelanggan: () =>
      import(
        "@/views/pengajuan-penyimpanan/components/GlobalTab/ViewTabPelanggan.vue"
      ),
    box: () =>
      import(
        "@/views/pengajuan-penyimpanan/components/GlobalTab/ViewTabBox.vue"
      ),
  },
  data() {
    return {
      view_tab: "input_data_draft_invoice",
    };
  },
  computed: {
    query_view() {
      return this.$route.query?.view;
    },
    currentStep() {
      return this.$store.state.pengajuanPenyimpanan.currentStep;
    },
  },
  methods: {
    handleClickView(value) {
      this.$router.replace({
        query: { view: value },
      }).catch(err => {
        // Ignore the vuex err regarding  navigating to the page they are already on.
        if (
          err.name !== 'NavigationDuplicated' &&
          !err.message.includes('Avoided redundant navigation to current location')
        ) {
          // But print any other errors to the console
          console.error(err)
        }
      });
    },

    handleClickAction({ type, urutan }) {
      this.$emit("handle-click-action", { type, urutan });
    },
  },
  watch: {
    query_view: function (value) {
      if (value == "input_data_draft_invoice") {
        this.view_tab = "input_data_draft_invoice";
      } else if (value == 'pelanggan') {
        this.view_tab = "pelanggan";
      } else if (value == 'box') {
        this.view_tab = "box";
      } else {
        this.view_tab = "input_data_draft_invoice";
      }
    },
  },
  destroyed() {
    this.$router.push({
      query: null,
    }).catch(err => {
      // Ignore the vuex err regarding  navigating to the page they are already on.
      if (
        err.name !== 'NavigationDuplicated' &&
        !err.message.includes('Avoided redundant navigation to current location')
      ) {
        // But print any other errors to the console
        console.error(err)
      }
    });
  },
}
</script>
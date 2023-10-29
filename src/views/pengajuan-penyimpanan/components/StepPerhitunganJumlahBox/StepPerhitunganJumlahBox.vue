<template>
  <div id="pjb" role="tabpanel" aria-labelledby="pjb_trigger">
    <div class="content-header text-center">
      <h5 class="mb-0">Perhitungan Box</h5>
      <small class="text-muted">Perhitungan jumlah box yang akan disimpan</small>
    </div>

    <div class="content-body">
      <ul class="nav nav-pills flex-column flex-md-row mt-5 justify-content-center">
        <li class="nav-item">
          <a @click="handleClickView('input_data_box')" class="nav-link"
            :class="[view_tab === 'input_data_box' ? 'active' : '']"><tabler-icon icon="BoxIcon" /> Input Data Box
          </a>
        </li>

        <li class="nav-item">
          <a @click="handleClickView('detail_pelanggan')" class="nav-link"
            :class="[view_tab === 'detail_pelanggan' ? 'active' : '']"><tabler-icon icon="UserCircleIcon" /> Detail
            Pelanggan
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
  name: "pjb",
  components: {
    ["input_data_box"]: () =>
      import(
        "@/views/pengajuan-penyimpanan/components/StepPerhitunganJumlahBox/ViewTabInputDataBox.vue"
      ),
    ["detail_pelanggan"]: () =>
      import(
        "@/views/pengajuan-penyimpanan/components/GlobalTab/ViewTabPelanggan.vue"
      ),
  },
  data() {
    return {
      view_tab: "input_data_box",
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
      if (value == "input_data_box") {
        this.view_tab = value;
      } else if (value == "detail_pelanggan") {
        this.view_tab = value;
      } else {
        this.view_tab = "detail_pelanggan";
      }
    },
  },
  mounted() {
    if (
      this.query_view == "input_data_box" ||
      this.query_view == "detail_pelanggan"
    ) {
      this.view_tab = this.query_view;
    }
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
};
</script>
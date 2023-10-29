<template>
  <div class="content-wrapper">
    <div class="content-header row">
      <div class="content-header-left col-md-9 col-12 mb-2">
        <BreadCrumb :showHeader="true" />
      </div>

      <!-- Content Header Right -->
      <!-- <div class="content-header-right text-md-end col-md-3 col-12 d-md-block">
        <div class="btn-group" role="group">
          <BaseButton
            @click="view_list = 'BoxList'"
            className="btn btn-icon view-btn grid-view-btn waves-effect"
            :class="[
              view_list === 'BoxList' ? 'btn-primary' : 'btn-outline-primary',
            ]"
            title="List Box"
          >
            <tabler-icon icon="BoxIcon" class="me-25" />
          </BaseButton>
          <BaseButton
            @click="view_list = 'BoxDimensionList'"
            className="btn btn-icon btn-outline-primary view-btn grid-view-btn waves-effect"
            :class="[
              view_list === 'BoxDimensionList'
                ? 'btn-primary'
                : 'btn-outline-primary',
            ]"
            title="List Dimensi Box"
          >
            <tabler-icon icon="PackagesIcon" class="me-25" />
          </BaseButton>
        </div>
      </div> -->
    </div>

    <div class="content-body">
      <!-- Nav Pills -->
      <ul class="nav nav-pills flex-column flex-md-row">
        <li class="nav-item">
          <a
            class="nav-link"
            @click="handleClickView('dimension_list')"
            :class="[view_list === 'dimension_list' ? 'active' : '']"
            ><tabler-icon icon="BoxIcon" /> Dimensi</a
          >
        </li>
        <li class="nav-item">
          <a
            @click="handleClickView('box_list')"
            class="nav-link"
            :class="[view_list === 'box_list' ? 'active' : '']"
            ><tabler-icon icon="PackagesIcon" /> List Box</a
          >
        </li>
      </ul>
      <transition name="slide-fade" mode="out-in">
        <component :is="view_list"></component>
      </transition>
    </div>
  </div>
</template>

<script>
import BreadCrumb from "@/components/BreadCrumb/BreadCrumb.vue";
import BaseButton from "@/components/Button/BaseButton.vue";

export default {
  name: "Box",
  components: {
    BreadCrumb,
    BaseButton,

    ["box_list"]: () => import("@/views/box/BoxList.vue"),
    ["dimension_list"]: () => import("@/views/box/BoxDimensionList.vue"),
  },
  data() {
    return {
      view_list: "dimension_list",
    };
  },
  computed: {
    query_view() {
      return this.$route.query?.view;
    },
  },
  methods: {
    handleClickView(value) {
      this.$router.replace({
        query: { view: value },
      });
    },
  },
  watch: {
    query_view: function (value) {
      if (value == "box_list") {
        this.view_list = value;
      } else if (value == "dimension_list") {
        this.view_list = value;
      } else {
        this.view_list = "dimension_list";
      }
    },
  },
  mounted() {
    if (this.query_view == "box_list" || this.query_view == "dimension_list") {
      this.view_list = this.query_view;
    }
  },
};
</script>

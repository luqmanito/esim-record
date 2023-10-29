<template>
  <div
    class="main-menu menu-fixed menu-light menu-accordion menu-shadow"
    :class="[
      {
        expanded:
          !isVerticalMenuCollapsed ||
          (isVerticalMenuCollapsed && isMouseHovered),
      },
    ]"
    @mouseenter="updateMouseHovered(true)"
    @mouseleave="updateMouseHovered(false)"
  >
    <div class="navbar-header expanded">
      <slot
        name="header"
        :toggleVerticalMenuActive="toggleVerticalMenuActive"
        :toggleCollapsed="toggleCollapsed"
        :collapseTogglerIcon="collapseTogglerIcon"
      >
        <ul class="nav navbar-nav flex-row">
          <li class="nav-item">
            <router-link to="/">
              <a class="navbar-brand"
                ><span
                  class="brand-logo d-flex justify-content-center align-items-center"
                >
                  <img
                    class="logo"
                    :src="appLogoImage"
                    height="24"
                    alt="logo"
                  />
                  <h2 class="brand-text">{{ appName }}</h2>
                </span>
              </a>
            </router-link>
          </li>
          <li class="nav-item ms-auto nav-toggle">
            <a class="nav-link modern-nav-toggle pe-0">
              <tabler-icon
                class="d-block d-xl-none text-primary toggle-icon"
                icon="XIcon"
                size="22"
                @click="toggleVerticalMenuActive"
              />
              <tabler-icon
                size="22"
                :icon="collapseTogglerIconTabler"
                class="d-none d-xl-block collapse-toggle-icon text-primary"
                @click="toggleCollapsed"
              />
            </a>
          </li>
        </ul>
      </slot>
    </div>

    <!-- Shadow -->
    <div :class="{ 'd-block': shallShadowBottom }" class="shadow-bottom" />

    <!-- main menu content-->
    <VueCustomScrollbar
      :settings="perfectScrollbarSettings"
      class="main-menu-content scroll-area"
      tagname="ul"
      @ps-scroll-y="
        (evt) => {
          shallShadowBottom = evt.srcElement.scrollTop > 0;
        }
      "
    >
      <MenuItemWithDropdown
        :menu="menu"
        :functions="functions"
        :isShowIconNavHeader="
          !isVerticalMenuCollapsed ||
          (isVerticalMenuCollapsed && isMouseHovered)
        "
      />
    </VueCustomScrollbar>
  </div>
</template>

<script>
import VueCustomScrollbar from "vue-custom-scrollbar/src/vue-scrollbar.vue";
import { provide, computed, ref } from "vue";
import useVerticalNavMenu from "@/functions/useVerticalNavMenu";
import MenuItemWithDropdown from "@/components/common/MenuItemWithDropdown.vue";

export default {
  name: "MainMenu",
  components: {
    VueCustomScrollbar,
    MenuItemWithDropdown,
  },
  props: {
    isVerticalMenuActive: {
      type: Boolean,
      required: true,
    },
    toggleVerticalMenuActive: {
      type: Function,
      required: true,
    },
  },
  computed: {
    appName() {
      return this.$store.state.appConfig.app.appName;
    },
    appLogoImage() {
      return this.$store.state.appConfig.app.appLogoImage;
    },
    menu() {
      const listMenu = this.$store.state.auth.menu;

      if (Array.isArray(listMenu) && listMenu.length) {
        // Sort ASC By urutan
        listMenu.sort((a, b) => a?.menu?.urutan - b?.menu?.urutan);
      }

      return listMenu;
    },
    functions() {
      const listFunctions = this.$store.state.auth.functions;

      return listFunctions;
    },
  },
  setup(props) {
    const perfectScrollbarSettings = {
      maxScrollbarLength: 60,
      wheelPropagation: false,
    };

    const {
      isMouseHovered,
      isVerticalMenuCollapsed,
      updateMouseHovered,
      toggleCollapsed,
      collapseTogglerIcon,
    } = useVerticalNavMenu(props);

    // Shadow bottom is UI specific and can be removed by user => It's not in `useVerticalNavMenu`
    const shallShadowBottom = ref(false);

    provide("isMouseHovered", isMouseHovered);

    provide("openGroups", ref([]));

    const collapseTogglerIconTabler = computed(() =>
      collapseTogglerIcon.value === "unpinned"
        ? "CircleIcon"
        : "CircleCheckIcon"
    );

    return {
      perfectScrollbarSettings,
      isMouseHovered,
      isVerticalMenuCollapsed,
      updateMouseHovered,
      toggleCollapsed,
      collapseTogglerIcon,
      collapseTogglerIconTabler,

      // Shadow Bottom
      shallShadowBottom,
    };
  },
};
</script>

<style scoped>
.logo {
  object-fit: cover;
}
</style>

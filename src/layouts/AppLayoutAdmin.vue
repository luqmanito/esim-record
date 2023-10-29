<template>
  <div :class="contentWidth === 'boxed' ? 'container p-0' : null">
    <div
      class="vertical-layout vh-100"
      :class="[layoutClasses]"
      :data-col="isNavMenuHidden ? '1-column' : null"
    >
      <b-navbar
        :toggleable="false"
        :variant="navbarBackgroundColor"
        class="header-navbar navbar navbar-shadow align-items-center"
        :class="[navbarTypeClass]"
      >
        <slot
          name="navbar"
          :toggleVerticalMenuActive="toggleVerticalMenuActive"
          :navbarBackgroundColor="navbarBackgroundColor"
          :navbarTypeClass="[
            ...navbarTypeClass,
            'header-navbar navbar navbar-shadow align-items-center',
          ]"
        >
          <Header :toggle-vertical-menu-active="toggleVerticalMenuActive" />
        </slot>
      </b-navbar>

      <MainMenu
        v-if="!isNavMenuHidden"
        :is-vertical-menu-active="isVerticalMenuActive"
        :toggle-vertical-menu-active="toggleVerticalMenuActive"
      >
      </MainMenu>

      <div class="app-content content overflow-hidden">
        <div class="content-overlay"></div>
        <div class="header-navbar-shadow"></div>

        <transition :name="routerTransition" mode="out-in">
          <router-view />
        </transition>
      </div>

      <!-- Vertical Nav Menu Overlay -->
      <div
        class="sidenav-overlay"
        :class="overlayClasses"
        @click="isVerticalMenuActive = false"
      />

      <footer class="footer footer-light" :class="[footerTypeClass]">
        <Footer />
        <ScrollToTop v-if="enableScrollToTop" />
      </footer>
    </div>
  </div>
</template>

<script>
import { onUnmounted, watch } from "vue";
import store from "@/store";

import ScrollToTop from "@/components/ScrollToTop/ScrollToTop.vue";

import Header from "@/components/common/Header.vue";
import MainMenu from "@/components/common/MainMenu.vue";
import Footer from "@/components/common/Footer.vue";

import { BNavbar } from "bootstrap-vue";

import useAppConfig from "@/functions/useAppConfig";

import useVerticalLayout from "@/functions/useVerticalLayout";

import { $themeBreakpoints } from "@themeConfig";

import { useWindowSize } from "@vueuse/core";

export default {
  name: "AppLayoutAdmin",
  components: {
    Header,
    MainMenu,
    Footer,
    ScrollToTop,
    BNavbar,
  },

  watch: {
    $route() {
      if (this.$store.state.app.windowWidth < $themeBreakpoints.xl) {
        this.isVerticalMenuActive = false;
      }
    },
  },

  computed: {
    layoutContentRenderer() {
      const rendererType = this.$route.meta.contentRenderer;
      if (rendererType === "sidebar-left")
        return "layout-content-renderer-left";
      if (rendererType === "sidebar-left-detached")
        return "layout-content-renderer-left-detached";
      return "layout-content-renderer-default";
    },
  },

  setup() {
    const enableScrollToTop = store.state.appConfig.enableScrollToTop || true;

    // Set Window Width in store (Vuex)
    store.commit("app/UPDATE_WINDOW_WIDTH", window.innerWidth);
    const { width: windowWidth } = useWindowSize();
    watch(windowWidth, (val) => {
      store.commit("app/UPDATE_WINDOW_WIDTH", val);
    });

    const {
      routerTransition,
      navbarBackgroundColor,
      navbarType,
      footerType,
      isNavMenuHidden,
      contentWidth,
    } = useAppConfig();

    const {
      isVerticalMenuActive,
      toggleVerticalMenuActive,
      isVerticalMenuCollapsed,
      overlayClasses,
      layoutClasses,
      resizeHandler,
      navbarTypeClass,
      footerTypeClass,
    } = useVerticalLayout(navbarType, footerType);

    // Resize handler
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    onUnmounted(() => {
      window.removeEventListener("resize", resizeHandler);
    });

    return {
      isVerticalMenuActive,
      toggleVerticalMenuActive,
      isVerticalMenuCollapsed,
      overlayClasses,
      layoutClasses,
      navbarTypeClass,
      footerTypeClass,

      // App Config
      routerTransition,
      navbarBackgroundColor,
      isNavMenuHidden,

      contentWidth,

      enableScrollToTop,
    };
  },
};
</script>

<style lang="scss">
@import "@/assets/scss/base/themes/bordered-layout.scss";
</style>

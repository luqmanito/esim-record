<template>
  <div id="app" class="h-100" :class="[skinClasses]">
    <component :is="layout">
      <router-view />
    </component>

    <portal-target name="modal" multiple> </portal-target>
  </div>
</template>

<script>
// This will be populated in `beforeCreate` hook
import { $themeColors, $themeBreakpoints } from "@themeConfig";

import { useCssVar } from "@vueuse/core";

import useAppConfig from "@/functions/useAppConfig";

import store from "@/store";

export default {
  name: "App",
  components: {
    AppLayoutAdmin: () => import("@/layouts/AppLayoutAdmin.vue"),
    AppLayoutAuth: () => import("@/layouts/AppLayoutAuth.vue"),
    AppLayoutBlank: () => import("@/layouts/AppLayoutBlank.vue"),
  },
  computed: {
    /**
     * Change layout dynamically based on
     * `layout` property in `$route.meta `object
     */
    layout() {
      return this.$route.meta?.layout;
    },
  },
  beforeCreate() {
    // Set colors in theme
    const colors = [
      "primary",
      "secondary",
      "success",
      "info",
      "warning",
      "danger",
      "light",
      "dark",
    ];

    for (let i = 0, len = colors.length; i < len; i++) {
      $themeColors[colors[i]] = useCssVar(
        `--${colors[i]}`,
        document.documentElement
      ).value.trim();
    }

    // Set Theme Breakpoints
    const breakpoints = ["xs", "sm", "md", "lg", "xl"];

    // eslint-disable-next-line no-plusplus
    for (let i = 0, len = breakpoints.length; i < len; i++) {
      $themeBreakpoints[breakpoints[i]] = Number(
        useCssVar(
          `--breakpoint-${breakpoints[i]}`,
          document.documentElement
        ).value.slice(0, -2)
      );

      // Set RTL
      const isRTL = store.state.appConfig.layout.isRTL;
      document.documentElement.setAttribute("dir", isRTL ? "rtl" : "ltr");
    }
  },
  setup() {
    const { skin, skinClasses } = useAppConfig();

    // If skin is dark when initialized => Add class to body
    if (skin.value === "dark") document.body.classList.add("dark-layout");

    return {
      skinClasses,
    };
  },
};
</script>

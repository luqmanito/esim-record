<template>
  <div
    class="
      vertical-layout vertical-menu-modern
      blank-page
      navbar-floating
      footer-static
    "
    data-open="click"
    data-menu="vertical-menu-modern"
    data-col="blank-page"
  >
    <div class="app-content content">
      <div class="content-overlay"></div>
      <div class="header-navbar-shadow"></div>

      <div class="content-wrapper">
        <div class="content-header row"></div>
        <div class="content-body">
          <div class="auth-wrapper auth-cover p-0 m-0">
            <div class="auth-inner row m-0">
              <!-- Left Text-->
              <div class="d-none d-lg-flex col-lg-8 align-items-center m-0 p-0">
                <div
                  class="
                    w-100
                    h-100
                    d-lg-flex
                    align-items-center
                    justify-content-center
                    bg-primary
                  "
                >
                  <img
                    style="object-fit: cover"
                    class="img-fluid w-100 h-100"
                    :src="background_picture"
                    alt="image"
                  />
                </div>
              </div>
              <!-- /Left Text-->
              <!-- Login-->
              <div
                class="
                  d-flex
                  col-lg-4
                  align-items-center
                  justify-content-center
                  px-2
                  p-lg-5
                  bg-white
                  vh-100
                  py-2
                  overflow-auto
                "
              >
                <transition :name="routerTransition" mode="out-in">
                  <router-view />
                </transition>
              </div>
              <!-- /Login-->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import useAppConfig from "@/functions/useAppConfig";

export default {
  name: "AppLayoutAuth",
  computed: {
    background_picture() {
      return (
        this.$route?.meta?.background_picture ||
        "/app-assets/images/3d/checklist-box.png"
      );
    },
  },
   setup() {
    const { routerTransition } = useAppConfig();

    return {
      routerTransition,
    };
  },
};
</script>

<style scoped>
.image-warehouse {
  height: 100%;
  width: 100%;
  object-position: center;
  object-fit: cover;
  opacity: 0.45;
}
</style>

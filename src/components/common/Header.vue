<template>
  <div class="navbar-container d-flex content align-items-center">
    <!-- Nav Menu Toggler -->
    <ul class="nav navbar-nav d-xl-none">
      <li class="nav-item">
        <a class="nav-link" @click="toggleVerticalMenuActive">
          <tabler-icon icon="Menu2Icon" size="24" />
        </a>
      </li>
    </ul>

    <!--  For Bookmark Etc -->
    <div class="d-flex align-items-center">
      <ul class="nav navbar-nav d-xl-none"></ul>
    </div>

    <ul class="nav navbar-nav align-items-center ms-auto">
      <!-- Dark Mode -->
      <li class="nav-item d-lg-block">
        <a
          @click="skin = isDark ? 'light' : 'dark'"
          class="nav-link nav-link-style"
        >
          <tabler-icon :icon="`${isDark ? 'Sun' : 'MoonStars'}Icon`" size="24"
        /></a>
      </li>
      <li class="nav-item dropdown dropdown-notification me-25">
        <a class="nav-link" data-bs-toggle="dropdown"
          ><tabler-icon size="24" icon="BellIcon"></tabler-icon>
          <span class="badge rounded-pill bg-danger badge-up">3</span>
        </a>
        <ul class="dropdown-menu dropdown-menu-media dropdown-menu-end">
          <li class="dropdown-menu-header">
            <div class="dropdown-header d-flex">
              <h4 class="notification-title mb-0 me-auto">Notifikasi</h4>
              <div class="badge rounded-pill badge-light-primary">
                3 Notifikasi Terbaru
              </div>
            </div>
          </li>

          <VueCustomScrollbar
            v-once
            :settings="perfectScrollbarSettings"
            class="scrollable-container media-list ps scroll-area"
            tagname="li"
          >
            <a class="d-flex">
              <div class="list-item d-flex align-items-start">
                <div class="me-1">
                  <div class="avatar">
                    <img
                      src="/app-assets/images/portrait/small/avatar-s-15.jpg"
                      alt="avatar"
                      width="32"
                      height="32"
                    />
                  </div>
                </div>
                <div class="list-item-body flex-grow-1">
                  <p class="media-heading">
                    <span class="fw-bolder">Congratulation Sam 🎉</span>winner!
                  </p>
                  <small class="notification-text">
                    Won the monthly best seller badge.</small
                  >
                </div>
              </div> </a
            ><a class="d-flex">
              <div class="list-item d-flex align-items-start">
                <div class="me-1">
                  <div class="avatar">
                    <img
                      src="/app-assets/images/portrait/small/avatar-s-3.jpg"
                      alt="avatar"
                      width="32"
                      height="32"
                    />
                  </div>
                </div>
                <div class="list-item-body flex-grow-1">
                  <p class="media-heading">
                    <span class="fw-bolder">New message</span>&nbsp;received
                  </p>
                  <small class="notification-text">
                    You have 10 unread messages</small
                  >
                </div>
              </div> </a
            ><a class="d-flex">
              <div class="list-item d-flex align-items-start">
                <div class="me-1">
                  <div class="avatar bg-light-danger">
                    <div class="avatar-content">MD</div>
                  </div>
                </div>
                <div class="list-item-body flex-grow-1">
                  <p class="media-heading">
                    <span class="fw-bolder">Revised Order 👋</span
                    >&nbsp;checkout
                  </p>
                  <small class="notification-text">
                    MD Inc. order updated</small
                  >
                </div>
              </div>
            </a>

            <div class="ps__rail-x" style="left: 0px; bottom: 0px">
              <div
                class="ps__thumb-x"
                tabindex="0"
                style="left: 0px; width: 0px"
              ></div>
            </div>
            <div class="ps__rail-y" style="top: 0px; right: 0px">
              <div
                class="ps__thumb-y"
                tabindex="0"
                style="top: 0px; height: 0px"
              ></div>
            </div>
          </VueCustomScrollbar>

          <li class="dropdown-menu-footer">
            <BaseButton
              class="btn btn-primary w-100"
              title="Lihat Semua Notifikasi"
            />
          </li>
        </ul>
      </li>
      <li class="nav-item dropdown dropdown-user">
        <a
          class="nav-link dropdown-toggle dropdown-user-link"
          id="dropdown-user"
          data-bs-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <div class="user-nav d-sm-flex d-none">
            <span class="user-name fw-bolder">{{ name || "-" }}</span
            ><span class="user-status">{{ profile || "-" }}</span>
          </div>

          <!-- Avatar -->
          <span class="avatar me-25"
            ><img
              class="round bg-primary"
              :src="photo || '/app-assets/images/avatars/avatar-default.png'"
              alt="avatar"
              height="40"
              width="40"
          /></span>

          <!-- <tabler-icon icon="ChevronDownIcon" /> -->
        </a>
        <div
          class="dropdown-menu dropdown-menu-end"
          aria-labelledby="dropdown-user"
        >
          <router-link to="/account/profile" class="dropdown-item">
            <tabler-icon class="me-50" icon="UserCircleIcon" /> Profile
          </router-link>

          <div class="dropdown-divider"></div>

          <router-link to="/account/settings" class="dropdown-item"
            ><tabler-icon class="me-50" icon="SettingsIcon" /> Settings
          </router-link>

          <a @click="logout" class="dropdown-item"
            ><tabler-icon icon="LogoutIcon" class="me-50" /> Logout</a
          >
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import VueCustomScrollbar from "vue-custom-scrollbar/src/vue-scrollbar.vue";
import { computed } from "vue";
import useAppConfig from "@/functions/useAppConfig";
import BaseButton from "@/components/Button/BaseButton.vue";

export default {
  name: "Header",
  props: {
    toggleVerticalMenuActive: {
      type: Function,
      default: () => {},
    },
  },
  components: {
    VueCustomScrollbar,
    BaseButton,
  },

  computed: {
    name() {
      return this.$store.state.auth.account?.name;
    },
    profile() {
      return this.$store.state.auth.account?.profile?.profile;
    },
    photo() {
      return this.$store.state.auth.account?.photo;
    },
  },

  methods: {
    logout() {
      this.$swal({
        title: "Apakah Yakin Untuk Logout dari Aplikasi?",
        icon: "info",
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonText: "Ya!",
        cancelButtonText: "Batalkan",
        customClass: {
          confirmButton: "btn btn-primary",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          this.$store.dispatch("auth/logout");
          this.$router.push("/auth/login");
        }
      });
    },
  },

  setup() {
    const { skin } = useAppConfig();

    const isDark = computed(() => skin.value === "dark");

    const perfectScrollbarSettings = {
      maxScrollbarLength: 60,
      wheelPropagation: false,
    };

    return { skin, isDark, perfectScrollbarSettings };
  },
};
</script>

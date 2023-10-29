import appLogoImage from "/app-assets/images/logo/logo-jiep-square.png";

const APP_MEDIA_HOST = import.meta.env.VITE_MEDIA_HOST;

export default {
  namespaced: true,
  state: {
    app: {
      appName: "SIM Record", // Will update name in navigation menu (Branding)
      // eslint-disable-next-line global-require
      appLogoImage: appLogoImage, // Will update logo in navigation menu (Branding)
      appMediaHost: APP_MEDIA_HOST,
    },
    layout: {
      isRTL: false,
      skin: "light",
      routerTransition: "zoom-fade", // zoom-fade, slide-fade, fade-bottom, fade, zoom-out, none
      type: "vertical", // vertical, horizontal
      contentWidth: "full", // full, boxed
      menu: {
        hidden: false,
        isCollapsed: false,
      },
      navbar: {
        // ? For horizontal menu, navbar type will work for navMenu type
        type: "floating", // static , sticky , floating, hidden
        backgroundColor: "", // BS color options [primary, success, etc]
      },
      footer: {
        type: "static", // static, sticky, hidden
      },
      customizer: true,
      enableScrollToTop: true,
    },
  },
  getters: {},
  mutations: {
    TOGGLE_RTL(state) {
      state.layout.isRTL = !state.layout.isRTL;
      document.documentElement.setAttribute(
        "dir",
        state.layout.isRTL ? "rtl" : "ltr"
      );
    },
    UPDATE_SKIN(state, skin) {
      state.layout.skin = skin;

      // Update DOM for dark-layout
      if (skin === "dark") document.body.classList.add("dark-layout");
      else if (document.body.className.match("dark-layout"))
        document.body.classList.remove("dark-layout");
    },
    UPDATE_ROUTER_TRANSITION(state, val) {
      state.layout.routerTransition = val;
    },
    UPDATE_CONTENT_WIDTH(state, val) {
      state.layout.contentWidth = val;
    },
    UPDATE_NAV_MENU_HIDDEN(state, val) {
      state.layout.menu.hidden = val;
    },
    UPDATE_NAVBAR_CONFIG(state, obj) {
      Object.assign(state.layout.navbar, obj);
    },
    UPDATE_FOOTER_CONFIG(state, obj) {
      Object.assign(state.layout.footer, obj);
    },
  },
  actions: {},
};

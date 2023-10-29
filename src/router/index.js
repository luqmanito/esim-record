import Vue from "vue";
import VueRouter from "vue-router";
import ToastificationContent from "@/components/Toastification/ToastificationContent.vue";

import store from "@/store";

Vue.use(VueRouter);

// Middleware for Check access meta with store vuex
function userHasMenuAccess(to, from, next) {
  const { key } = to.meta;
  const listAccess = store.getters["auth/access"];

  if (Array.isArray(key)) {
    for (let i in key) {
      let isIncluded = listAccess.includes(key[i]);

      if (isIncluded) {
        return next();
      } else {
        Vue.$toast.error({
          component: ToastificationContent,
          props: {
            title: "Akses Ditolak",
            icon: "AlertTriangleIcon",
            text: `Anda Tidak Memiliki Akses`,
            variant: "error",
          },
        });
        return next(from.fullPath);
      }
    }
  }
}

// Middleware for Check Token Email
function isHasTokenEmail(to, from, next) {
  const token = to.query?.token;

  const isValidToken = typeof token === "string" && token.length === 50;

  if (isValidToken) {
    return next();
  } else {
    Vue.$toast.error({
      component: ToastificationContent,
      props: {
        title: "Akses Ditolak",
        icon: "AlertTriangleIcon",
        text: `Anda Tidak Memiliki Token atau Token Tidak Valid`,
        variant: "error",
      },
    });
    return next(from.fullPath);
  }
}

// Middleware for Check is From Verify Page and Verified Email
function isVerifiedEmail(to, from, next) {
  const pathVerifiedPage = "/account/verify";

  // Middleware from verified page
  const isFromVerifiedPage = from.path == pathVerifiedPage;

  const isHaveId = to.query?.id;

  const isHaveEmail = to.query?.email;

  if (isHaveId && isHaveEmail) {
    return next();
  } else {
    Vue.$toast.error({
      component: ToastificationContent,
      props: {
        title: "Akses Ditolak",
        icon: "AlertTriangleIcon",
        text: `Anda Tidak Berhak Mengakses Halaman atau Belum Terverifikasi`,
        variant: "error",
      },
    });
    return next(from.fullPath);
  }
}

// Middleware for Check Token Forget Password
function isVerifiedForgetPassword(to, from, next) {
  const isHaveToken = to.query?.token;

  if (isHaveToken) {
    return next();
  } else {
    Vue.$toast.error({
      component: ToastificationContent,
      props: {
        title: "Akses Ditolak",
        icon: "AlertTriangleIcon",
        text: `Anda Tidak Berhak Mengakses Halaman atau Belum Terverifikasi`,
        variant: "error",
      },
    });
    return next(from.fullPath);
  }
}

const router = new VueRouter({
  mode: "history",
  scrollBehavior(to, from) {
    if (to.path != from.path) {
      return { x: 0, y: 0 };
    }
  },
  routes: [
    {
      path: "/",
      redirect: () => {
        return { path: "/dashboard" };
      },
    },
    {
      path: "/auth",
      redirect: (to) => {
        return { path: "/auth/login" };
      },
    },
    {
      path: "/auth/login",
      name: "Login",
      component: () => import("@/views/auth/Login.vue"),
      meta: {
        public: true,
        pageTitle: "Login",
        layout: "AppLayoutAuth",
        background_picture: "/app-assets/images/3d/checklist-box.png",
      },
    },
    {
      path: "/auth/register",
      name: "Register",
      component: () => import("@/views/auth/Register.vue"),
      meta: {
        public: true,
        pageTitle: "Register",
        layout: "AppLayoutAuth",
        background_picture: "/app-assets/images/3d/checklist-box.png",
      },
      beforeEnter: isVerifiedEmail,
    },

    // Forgot Password
    {
      path: "/auth/forgot-password",
      name: "ForgotPassword",
      component: () => import("@/views/auth/ForgotPassword.vue"),
      meta: {
        public: true,
        pageTitle: "Lupa Password",
        layout: "AppLayoutAuth",
        background_picture: "/app-assets/images/3d/checklist-box.png",
      },
    },
    {
      path: "/auth/forgot-password/verify",
      name: "ForgotPasswordVerify",
      component: () => import("@/views/auth/ForgotPasswordVerify.vue"),
      meta: {
        public: true,
        pageTitle: "Verifikasi Kode",
        layout: "AppLayoutAuth",
        background_picture: "/app-assets/images/3d/web-verify.png",
      },
      beforeEnter: isVerifiedForgetPassword,
    },
    {
      path: "/auth/forgot-password/reset",
      name: "ForgotPasswordReset",
      component: () => import("@/views/auth/ForgotPasswordReset.vue"),
      meta: {
        public: true,
        pageTitle: "Reset Password",
        layout: "AppLayoutAuth",
        background_picture: "/app-assets/images/3d/phone-with-password.png",
      },
    },

    // Account
    // Verify
    {
      path: "/account/verify",
      name: "AccountVerify",
      component: () => import("@/views/account/verify/VerifyEmail.vue"),
      meta: {
        public: true,
        pageTitle: "Verifikasi",
        layout: "AppLayoutAuth",
        background_picture: "/app-assets/images/3d/web-verify.png",
      },
      beforeEnter: isHasTokenEmail,
    },

    // Profile
    {
      path: "/account/profile",
      name: "AccountProfile",
      component: () => import("@/views/account/profile/Profile.vue"),
      meta: {
        pageTitle: "Profile",
        layout: "AppLayoutAdmin",
        breadcrumb: [
          {
            text: "Profile",
            disabled: false,
            href: "/account/profile",
            active: true,
          },
        ],
      },
    },
    {
      path: "/account/settings",
      name: "AccountSettings",
      component: () => import("@/views/account/settings/Settings.vue"),
      meta: {
        pageTitle: "Settings",
        layout: "AppLayoutAdmin",
        breadcrumb: [
          {
            text: "Settings",
            disabled: false,
            href: "/account/settings",
            active: true,
          },
        ],
      },
    },

    // Dashboard
    {
      path: "/dashboard",
      name: "Dashboard",
      component: () => import("@/views/dashboard/Dashboard.vue"),
      meta: {
        pageTitle: "Dashboard",
        layout: "AppLayoutAdmin",
        key: ["dashboard"],
        breadcrumb: [
          {
            text: "Dashboard",
            disabled: false,
            href: "/dashboard",
            active: true,
          },
        ],
      },
    },

    // Layanan
    {
      path: "/layanan",
      name: "Layanan",
      component: () => import("@/views/layanan/Layanan.vue"),
      meta: {
        pageTitle: "Layanan",
        layout: "AppLayoutAdmin",
        key: ["masterlayanan"],
        breadcrumb: [
          {
            text: "Layanan",
            disabled: false,
            href: "/layanan",
            active: true,
          },
        ],
      },
      beforeEnter: userHasMenuAccess,
    },
    {
      path: "/layanan/add",
      name: "LayananAdd",
      component: () => import("@/views/layanan/LayananAdd.vue"),
      meta: {
        pageTitle: "Tambah Layanan",
        layout: "AppLayoutAdmin",
        key: ["masterlayananadd"],
        breadcrumb: [
          {
            text: "Layanan",
            disabled: false,
            href: "/layanan",
            active: false,
          },
          {
            text: "Tambah Layanan",
            disabled: true,
            href: "/layanan/add",
            active: true,
          },
        ],
      },
      beforeEnter: userHasMenuAccess,
    },
    {
      path: "/layanan/:id/edit",
      name: "LayananEdit",
      component: () => import("@/views/layanan/LayananEdit.vue"),
      meta: {
        pageTitle: "Edit Layanan",
        layout: "AppLayoutAdmin",
        key: ["masterlayananedit"],
        breadcrumb: [
          {
            text: "Layanan",
            disabled: false,
            href: "/layanan",
            active: false,
          },
          {
            text: "Edit Layanan",
            disabled: true,
            href: "/layanan/:id/edit",
            active: true,
          },
        ],
      },
      beforeEnter: userHasMenuAccess,
    },

    // Gudang
    {
      path: "/gudang",
      name: "Gudang",
      component: () => import("@/views/gudang/Gudang.vue"),
      meta: {
        pageTitle: "Gudang",
        layout: "AppLayoutAdmin",
        key: ["mastergudang"],
        breadcrumb: [
          {
            text: "Gudang",
            disabled: false,
            href: "/gudang",
            active: true,
          },
        ],
      },
      beforeEnter: userHasMenuAccess,
    },
    {
      path: "/gudang/add",
      name: "GudangAdd",
      component: () => import("@/views/gudang/GudangAdd.vue"),
      meta: {
        pageTitle: "Tambah Gudang",
        layout: "AppLayoutAdmin",
        key: ["mastergudangadd"],
        breadcrumb: [
          {
            text: "Gudang",
            disabled: false,
            href: "/gudang",
            active: false,
          },
          {
            text: "Tambah Gudang",
            disabled: true,
            href: "/gudang/add",
            active: true,
          },
        ],
      },
      beforeEnter: userHasMenuAccess,
    },
    {
      path: "/gudang/:id/edit",
      name: "GudangEdit",
      component: () => import("@/views/gudang/GudangEdit.vue"),
      meta: {
        pageTitle: "Edit Gudang",
        layout: "AppLayoutAdmin",
        key: ["mastergudangedit"],
        breadcrumb: [
          {
            text: "Gudang",
            disabled: false,
            href: "/gudang",
            active: false,
          },
          {
            text: "Edit Gudang",
            disabled: true,
            href: "/gudang/:id/edit",
            active: true,
          },
        ],
      },
      beforeEnter: userHasMenuAccess,
    },

    // Ruangan
    {
      path: "/ruangan",
      name: "Ruangan",
      component: () => import("@/views/ruangan/Ruangan.vue"),
      meta: {
        pageTitle: "Ruangan",
        layout: "AppLayoutAdmin",
        key: ["masterruangan"],
        breadcrumb: [
          {
            text: "Ruangan",
            disabled: false,
            href: "/ruangan",
            active: true,
          },
        ],
      },
      beforeEnter: userHasMenuAccess,
    },
    {
      path: "/ruangan/add",
      name: "RuanganAdd",
      component: () => import("@/views/ruangan/RuanganAdd.vue"),
      meta: {
        pageTitle: "Tambah Ruangan",
        layout: "AppLayoutAdmin",
        key: ["masterruanganadd"],
        breadcrumb: [
          {
            text: "Ruangan",
            disabled: false,
            href: "/ruangan",
            active: false,
          },
          {
            text: "Tambah Ruangan",
            disabled: true,
            href: "/ruangan/add",
            active: true,
          },
        ],
      },
      beforeEnter: userHasMenuAccess,
    },
    {
      path: "/ruangan/:id/edit",
      name: "RuanganEdit",
      component: () => import("@/views/ruangan/RuanganEdit.vue"),
      meta: {
        pageTitle: "Edit Ruangan",
        layout: "AppLayoutAdmin",
        key: ["masterruanganedit"],
        breadcrumb: [
          {
            text: "Ruangan",
            disabled: false,
            href: "/ruangan",
            active: false,
          },
          {
            text: "Edit Ruangan",
            disabled: true,
            href: "/ruangan/:id/edit",
            active: true,
          },
        ],
      },
      beforeEnter: userHasMenuAccess,
    },
    {
      path: "/ruangan/setting-prefix",
      name: "RuanganSettingPrefix",
      component: () => import("@/views/ruangan/RuanganSettingPrefix.vue"),
      meta: {
        pageTitle: "Setting Prefix Ruangan",
        layout: "AppLayoutAdmin",
        key: ["masterruanganedit"],
        breadcrumb: [
          {
            text: "Ruangan",
            disabled: false,
            href: "/ruangan",
            active: false,
          },
          {
            text: "Setting Prefix Ruangan",
            disabled: true,
            href: "/ruangan/setting-prefix",
            active: true,
          },
        ],
      },
      beforeEnter: userHasMenuAccess,
    },
    {
      path: "/ruangan/detail",
      name: "RuanganDetail",
      component: () => import("@/views/ruangan/RuanganDetail.vue"),
      meta: {
        pageTitle: "Detail Ruangan",
        layout: "AppLayoutAdmin",
        key: ["masterruangan"],
        breadcrumb: [
          {
            text: "Ruangan",
            disabled: false,
            href: "/ruangan",
            active: false,
          },
          {
            text: "Detail Ruangan",
            disabled: true,
            href: "/ruangan/detail",
            active: true,
          },
        ],
      },
      beforeEnter: userHasMenuAccess,
    },

    // Rak
    {
      path: "/rak",
      name: "Rak",
      component: () => import("@/views/rak/Rak.vue"),
      meta: {
        pageTitle: "Rak",
        layout: "AppLayoutAdmin",
        key: ["masterrak"],
        breadcrumb: [
          {
            text: "Rak",
            disabled: false,
            href: "/rak",
            active: true,
          },
        ],
      },
      beforeEnter: userHasMenuAccess,
    },

    // Box
    {
      path: "/box",
      name: "Box",
      component: () => import("@/views/box/Box.vue"),
      meta: {
        pageTitle: "Box",
        layout: "AppLayoutAdmin",
        key: ["masterbox"],
        breadcrumb: [
          {
            text: "Box",
            disabled: false,
            href: "/box",
            active: true,
          },
        ],
      },
      beforeEnter: userHasMenuAccess,
    },
    {
      path: "/box/add",
      name: "BoxAdd",
      component: () => import("@/views/box/BoxAdd.vue"),
      meta: {
        pageTitle: "Tambah Box",
        layout: "AppLayoutAdmin",
        key: ["masterboxadd"],
        breadcrumb: [
          {
            text: "Box",
            disabled: false,
            href: "/box",
            active: true,
          },
          {
            text: "Tambah Box",
            disabled: true,
            href: "/box/add",
            active: true,
          },
        ],
      },
      beforeEnter: userHasMenuAccess,
    },
    {
      path: "/box/:id/edit",
      name: "BoxEdit",
      component: () => import("@/views/box/BoxEdit.vue"),
      meta: {
        pageTitle: "Edit Box",
        layout: "AppLayoutAdmin",
        key: ["masterboxedit"],
        breadcrumb: [
          {
            text: "Box",
            disabled: false,
            href: "/box",
            active: true,
          },
          {
            text: "Edit Box",
            disabled: true,
            href: "/box/:id/edit",
            active: true,
          },
        ],
      },
      beforeEnter: userHasMenuAccess,
    },

    // Box Dimension
    {
      path: "/box/dimension/add",
      name: "BoxDimensionAdd",
      component: () => import("@/views/box/BoxDimensionAdd.vue"),
      meta: {
        pageTitle: "Tambah Dimensi Box",
        layout: "AppLayoutAdmin",
        key: ["masterboxdimensionadd"],
        breadcrumb: [
          {
            text: "Box",
            disabled: false,
            href: "/box",
            active: false,
          },
          {
            text: "Tambah Dimensi Box",
            disabled: true,
            href: "/box/dimension/add",
            active: true,
          },
        ],
      },
      beforeEnter: userHasMenuAccess,
    },
    {
      path: "/box/dimension/:id/edit",
      name: "BoxDimensionEdit",
      component: () => import("@/views/box/BoxDimensionEdit.vue"),
      meta: {
        pageTitle: "Edit Dimensi Box",
        layout: "AppLayoutAdmin",
        key: ["masterboxdimensionedit"],
        breadcrumb: [
          {
            text: "Box",
            disabled: false,
            href: "/box",
            active: false,
          },
          {
            text: "Edit Dimensi Box",
            disabled: true,
            href: "/box/dimension/:id/edit",
            active: true,
          },
        ],
      },
      beforeEnter: userHasMenuAccess,
    },

    // RFID
    {
      path: "/rfid",
      name: "RFID",
      component: () => import("@/views/rfid/RFID.vue"),
      meta: {
        pageTitle: "RFID",
        layout: "AppLayoutAdmin",
        key: ["masterrfid"],
        breadcrumb: [
          {
            text: "RFID",
            disabled: false,
            href: "/rfid",
            active: true,
          },
        ],
      },
      beforeEnter: userHasMenuAccess,
    },
    {
      path: "/rfid/add",
      name: "RFIDAdd",
      component: () => import("@/views/rfid/RFIDAdd.vue"),
      meta: {
        pageTitle: "Tambah RFID",
        layout: "AppLayoutAdmin",
        key: ["masterrfidadd"],
        breadcrumb: [
          {
            text: "RFID",
            disabled: false,
            href: "/rfid",
            active: false,
          },
          {
            text: "Tambah RFID",
            disabled: true,
            href: "/rfid/add",
            active: true,
          },
        ],
      },
      beforeEnter: userHasMenuAccess,
    },
    {
      path: "/rfid/:id/edit",
      name: "RFIDEdit",
      component: () => import("@/views/rfid/RFIDEdit.vue"),
      meta: {
        pageTitle: "Edit RFID",
        layout: "AppLayoutAdmin",
        key: ["masterrfidedit"],
        breadcrumb: [
          {
            text: "RFID",
            disabled: false,
            href: "/rfid",
            active: false,
          },
          {
            text: "Edit RFID",
            disabled: true,
            href: "/rfid/:id/edit",
            active: true,
          },
        ],
      },
      beforeEnter: userHasMenuAccess,
    },

    // Segel
    {
      path: "/segel",
      name: "Segel",
      component: () => import("@/views/segel/Segel.vue"),
      meta: {
        pageTitle: "Segel",
        layout: "AppLayoutAdmin",
        key: ["masterseal", "mastersegel"],
        breadcrumb: [
          {
            text: "Segel",
            disabled: false,
            href: "/segel",
            active: true,
          },
        ],
      },
      beforeEnter: userHasMenuAccess,
    },

    // Dokumen
    {
      path: "/dokumen",
      name: "Dokumen",
      component: () => import("@/views/dokumen/Dokumen.vue"),
      meta: {
        pageTitle: "Dokumen",
        layout: "AppLayoutAdmin",
        key: ["masterdokumen"],
        breadcrumb: [
          {
            text: "Dokumen",
            disabled: false,
            href: "/dokumen",
            active: true,
          },
        ],
      },
      beforeEnter: userHasMenuAccess,
    },
    {
      path: "/dokumen/add",
      name: "DokumenAdd",
      component: () => import("@/views/dokumen/DokumenAdd.vue"),
      meta: {
        pageTitle: "Tambah Dokumen",
        layout: "AppLayoutAdmin",
        key: ["masterdokumenadd"],
        breadcrumb: [
          {
            text: "Dokumen",
            disabled: false,
            href: "/dokumen",
            active: false,
          },
          {
            text: "Tambah Dokumen",
            disabled: true,
            href: "/dokumen/add",
            active: true,
          },
        ],
      },
      beforeEnter: userHasMenuAccess,
    },
    {
      path: "/dokumen/:id/edit",
      name: "DokumenEdit",
      component: () => import("@/views/dokumen/DokumenEdit.vue"),
      meta: {
        pageTitle: "Edit Dokumen",
        layout: "AppLayoutAdmin",
        key: ["masterdokumenedit"],
        breadcrumb: [
          {
            text: "Dokumen",
            disabled: false,
            href: "/dokumen",
            active: false,
          },
          {
            text: "Edit Dokumen",
            disabled: true,
            href: "/dokumen/:id/edit",
            active: true,
          },
        ],
      },
      beforeEnter: userHasMenuAccess,
    },

    // Kode Klasifikasi
    {
      path: "/kode-klasifikasi",
      name: "KodeKlasifikasi",
      component: () => import("@/views/kode-klasifikasi/KodeKlasifikasi.vue"),
      meta: {
        pageTitle: "Kode Klasifikasi",
        layout: "AppLayoutAdmin",
        key: ["masterkodeklasifikasi"],
        breadcrumb: [
          {
            text: "Kode Klasifikasi",
            disabled: false,
            href: "/kode-klasifikasi",
            active: true,
          },
        ],
      },
      beforeEnter: userHasMenuAccess,
    },
    {
      path: "/kode-klasifikasi/add",
      name: "KodeKlasifikasiAdd",
      component: () =>
        import("@/views/kode-klasifikasi/KodeKlasifikasiAdd.vue"),
      meta: {
        pageTitle: "Tambah Kode Klasifikasi",
        layout: "AppLayoutAdmin",
        key: ["masterkodeklasifikasiadd"],
        breadcrumb: [
          {
            text: "Kode Klasifikasi",
            disabled: false,
            href: "/kode-klasifikasi",
            active: false,
          },
          {
            text: "Tambah Kode Klasifikasi",
            disabled: true,
            href: "/kode-klasifikasi/add",
            active: true,
          },
        ],
      },
      beforeEnter: userHasMenuAccess,
    },
    {
      path: "/kode-klasifikasi/:id/edit",
      name: "KodeKlasifikasiEdit",
      component: () =>
        import("@/views/kode-klasifikasi/KodeKlasifikasiEdit.vue"),
      meta: {
        pageTitle: "Edit Kode Klasifikasi",
        layout: "AppLayoutAdmin",
        key: ["masterkodeklasifikasiedit"],
        breadcrumb: [
          {
            text: "Kode Klasifikasi",
            disabled: false,
            href: "/kode-klasifikasi",
            active: false,
          },
          {
            text: "Edit Kode Klasifikasi",
            disabled: true,
            href: "/kode-klasifikasi/:id/edit",
            active: true,
          },
        ],
      },
      beforeEnter: userHasMenuAccess,
    },

    // Roles
    {
      path: "/roles",
      name: "Roles",
      component: () => import("@/views/roles/Roles.vue"),
      meta: {
        pageTitle: "Roles",
        layout: "AppLayoutAdmin",
        key: ["manusersrole"],
        breadcrumb: [
          {
            text: "Roles",
            disabled: false,
            href: "/roles",
            active: true,
          },
        ],
      },
      beforeEnter: userHasMenuAccess,
    },
    {
      path: "/roles/add",
      name: "RolesAdd",
      component: () => import("@/views/roles/RolesAdd.vue"),
      meta: {
        pageTitle: "Tambah Roles",
        layout: "AppLayoutAdmin",
        key: ["manusersroleadd"],
        breadcrumb: [
          {
            text: "Roles",
            disabled: false,
            href: "/roles",
            active: false,
          },
          {
            text: "Tambah Roles",
            disabled: true,
            href: "/roles/add",
            active: true,
          },
        ],
      },
      beforeEnter: userHasMenuAccess,
    },
    {
      path: "/roles/:id/edit",
      name: "RolesEdit",
      component: () => import("@/views/roles/RolesEdit.vue"),
      meta: {
        pageTitle: "Edit Roles",
        layout: "AppLayoutAdmin",
        key: ["manusersroleedit"],
        breadcrumb: [
          {
            text: "Roles",
            disabled: false,
            href: "/roles",
            active: false,
          },
          {
            text: "Edit Roles",
            disabled: true,
            href: "/roles/:id/edit",
            active: true,
          },
        ],
      },
      beforeEnter: userHasMenuAccess,
    },

    // Hak Akses
    {
      path: "/hak-akses",
      name: "HakAkses",
      component: () => import("@/views/hak-akses/HakAkses.vue"),
      meta: {
        pageTitle: "Hak Akses",
        layout: "AppLayoutAdmin",
        key: ["manusershakakses"],
        breadcrumb: [
          {
            text: "Hak Akses",
            disabled: false,
            href: "/hak-akses",
            active: true,
          },
        ],
      },
      beforeEnter: userHasMenuAccess,
    },

    // Users
    {
      path: "/users",
      name: "Users",
      component: () => import("@/views/users/Users.vue"),
      meta: {
        pageTitle: "Users",
        layout: "AppLayoutAdmin",
        key: ["manusersuser"],
        breadcrumb: [
          {
            text: "Users",
            disabled: false,
            href: "/users",
            active: true,
          },
        ],
      },
      beforeEnter: userHasMenuAccess,
    },
    {
      path: "/users/add",
      name: "UsersAdd",
      component: () => import("@/views/users/UsersAdd.vue"),
      meta: {
        pageTitle: "Tambah Users",
        layout: "AppLayoutAdmin",
        key: ["manusersuseradd"],
        breadcrumb: [
          {
            text: "Users",
            disabled: false,
            href: "/users",
            active: false,
          },
          {
            text: "Tambah Users",
            disabled: true,
            href: "/users/add",
            active: true,
          },
        ],
      },
      beforeEnter: userHasMenuAccess,
    },
    {
      path: "/users/:id/edit",
      name: "UsersEdit",
      component: () => import("@/views/users/UsersEdit.vue"),
      meta: {
        pageTitle: "Edit Users",
        layout: "AppLayoutAdmin",
        key: ["manusersuseredit"],
        breadcrumb: [
          {
            text: "Users",
            disabled: false,
            href: "/users",
            active: false,
          },
          {
            text: "Edit Users",
            disabled: true,
            href: "/users/:id/edit",
            active: true,
          },
        ],
      },
      beforeEnter: userHasMenuAccess,
    },

    // Pengajuan Penyimpanan
    {
      path: "/pengajuan-penyimpanan",
      name: "PengajuanPenyimpanan",
      component: () =>
        import("@/views/pengajuan-penyimpanan/PengajuanPenyimpanan.vue"),
      meta: {
        pageTitle: "Pengajuan Penyimpanan",
        layout: "AppLayoutAdmin",
        key: ["arsippengajuan"],
        breadcrumb: [
          {
            text: "Pengajuan Penyimpanan",
            disabled: false,
            href: "/pengajuan-penyimpanan",
            active: true,
          },
        ],
      },
      beforeEnter: userHasMenuAccess,
    },
    {
      path: "/pengajuan-penyimpanan/:id/detail",
      name: "PengajuanPenyimpananDetail",
      component: () =>
        import("@/views/pengajuan-penyimpanan/PengajuanPenyimpananDetail.vue"),
      meta: {
        pageTitle: "Pengajuan Penyimpanan Detail",
        layout: "AppLayoutAdmin",
        key: ["arsippengajuan"],
        breadcrumb: [
          {
            text: "Pengajuan Penyimpanan",
            disabled: false,
            href: "/pengajuan-penyimpanan",
            active: false,
          },
          {
            text: "Detail Pengajuan Penyimpanan",
            disabled: true,
            href: "/pengajuan-penyimpanan/:id/detail",
            active: true,
          },
        ],
      },
      beforeEnter: userHasMenuAccess,
    },

    // Error 404
    {
      path: "/error-404",
      name: "error404",
      component: () => import("@/views/errors/NotFound.vue"),
      meta: {
        pageTitle: "Error404",
        layout: "AppLayoutBlank",
      },
    },

    // Catch All Routes
    {
      path: "*",
      redirect: "error-404",
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const isAuthenticated = store.getters["auth/isAuthenticated"];

  // Check By meta with key 'public'
  const isPrivateRoute = to.matched.some((record) => !record.meta.public);
  const isPublicRoute = to.matched.some((record) => record.meta.public);

  if (isPrivateRoute && !isAuthenticated) {
    return next({ path: "/auth/login" });
  } else if (isPublicRoute && isAuthenticated) {
    return next({ path: "/" });
  } else {
    return next();
  }
});

// For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach((to, from, next) => {
  // Remove initial loading
  const appLoading = document.getElementById("loading-bg");
  if (appLoading) {
    appLoading.style.display = "none";
  }

  document.title =
    `${to.meta?.pageTitle} | JIEP SIM Record` || "JIEP SIM Record";
});

export default router;

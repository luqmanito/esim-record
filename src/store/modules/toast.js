import ToastificationContent from "@/components/Toastification/ToastificationContent.vue";
import errorCode from "@/utils/errorCode";

export default {
  namespaced: true,
  actions: {
    showToastSuccess({}, payload) {
      this._vm.$toast.success({
        component: ToastificationContent,
        props: {
          title: payload.title,
          icon: payload.icon || "CircleCheckIcon",
          text: payload.text,
          variant: payload.variant || "success",
        },
      });
    },
    showToastInfo({}, payload) {
      this._vm.$toast.info({
        component: ToastificationContent,
        props: {
          title: payload.title,
          icon: payload.icon || "InfoCircleIcon",
          text: payload.text,
          variant: payload.variant || "info",
        },
      });
    },
    showToastError({}, payload) {
      if (
        payload?.error?.response &&
        payload?.error?.response?.status != 404 &&
        payload?.error?.response?.status != 401
      ) {
        const errorStatus = errorCode.filter(
          (value) => value.code == payload?.error?.response?.status
        );

        this._vm.$toast.error({
          component: ToastificationContent,
          props: {
            title:
              payload.title ||
              errorStatus[0]?.message ||
              "Terjadi Kesalahan Komunikasi Data",
            icon: payload.icon || "AlertTriangleIcon",
            text: payload.title || payload?.error?.response?.data?.message,
            variant: payload.variant || "danger",
          },
        });
      } else {
        if (payload?.error?.response?.status >= 500) {
          this._vm.$toast.error({
            component: ToastificationContent,
            props: {
              title: "Terjadi Kesalahan Komunikasi Data",
              icon: "AlertTriangleIcon",
              text: "Terjadi kesalahan pada sistem kami",
              variant: "danger",
            },
          });
        } else {
          const errorStatus = errorCode.filter(
            (value) => value.code == payload?.error?.response?.status
          );

          this._vm.$toast.error({
            component: ToastificationContent,
            props: {
              title: payload.title || "Terjadi Kesalahan Komunikasi Data",
              icon: payload.icon || "AlertTriangleIcon",
              text: payload.title || payload?.error?.response?.data?.message,
              variant: payload.variant || "danger",
            },
          });
        }

        throw payload?.error;
      }
    },
  },
};

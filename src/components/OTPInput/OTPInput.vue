<template>
  <div class="d-flex">
    <input
      ref="otpItems"
      type="text"
      :disabled="isDisabled"
      class="form-control digit-box text-primary text-capitalize"
      v-for="(element, index) in digitCount"
      :key="element + index"
      :autofocus="index === 0"
      pattern="[a-zA-Z0-9-]+"
      placeholder="_"
      maxlength="1"
      @keydown="(event) => handleKeyDown(event, index)"
      :class="[refsInputItem(index) !== null ? 'border-primary' : '']"
    />
  </div>
</template>

<script>
export default {
  name: "OTPInput",
  props: {
    digitCount: {
      type: Number,
      required: true,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    refsInputItem() {
      return (index) => {
        if (!this.isMounted) return null;

        return this.$refs.otpItems[index].value;
      };
    },
  },
  data() {
    return {
      isCompleted: false,
      digits: [],
      isMounted: false,
    };
  },
  methods: {
    isDigitsFull() {
      for (const elem of this.digits) {
        if (elem == null || elem == undefined) {
          return false;
        }
      }

      return true;
    },

    handleKeyDown(event, index) {
      if (
        event.key !== "Tab" &&
        event.key !== "ArrowRight" &&
        event.key !== "ArrowLeft"
      ) {
        this.$refs.otpItems[index].value = null;

        event.preventDefault();
      }

      if (event.key === "Backspace") {
        this.digits[index] = null;
        this.$refs.otpItems[index].value = null;

        if (index != 0) {
          this.$refs.otpItems[index - 1].focus();
        }

        return;
      }

      if (event.key.length === 1 && new RegExp("[0-9a-zA-Z]").test(event.key)) {
        this.digits[index] = event.key;

        this.$refs.otpItems[index].value = event.key;

        if (index != this.digitCount - 1) {
          this.$refs.otpItems[index + 1].focus();
        }
      }

      if (this.isDigitsFull()) {
        this.$emit("update:otp", this.digits.join(""));
      }
    },
  },
  mounted() {
    this.isMounted = true;
    if (this.digitCount) {
      const list = [];
      for (let i = 0; i < this.digitCount; i++) {
        list[i] = null;
      }

      this.digits = list;
    }
  },
};
</script>

<style scoped>
.digit-box {
  height: 40px;
  width: 40px;
  margin-right: 10px;
  margin-bottom: 10px;
  display: inline-block;
  font-weight: 600;
  font-size: 13px;
  line-height: 100%;
}
</style>

<template>
  <input
    :type="type"
    :value="internalValue"
    @input="updateInternalValue"
    :placeholder="placeholder"
    v-bind="$attrs"
  />
</template>

<script>
import debounce from "lodash.debounce";

export default {
  name: "InputSearch",
  props: {
    value: String,
    type: { type: String, default: "text" },
    placeholder: String,
  },
  data() {
    return {
      internalValue: this.value,
      touched: false,
    };
  },
  watch: {
    value(value) {
      if (!this.touched) this.internalValue = value;
    },
  },
  methods: {
    updateInternalValue(event) {
      this.touched = true;
      this.updateValue(event.target.value);
    },

    // Debounce event emit to prevent unnecessary data fetching
    updateValue: debounce(function (value) {
      this.touched = false;
      this.$emit("input", value);
      this.$emit("update:value", value);
    }, 500),
  },
};
</script>

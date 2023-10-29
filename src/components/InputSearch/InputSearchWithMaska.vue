<template>
  <input
    v-maska
    :type="type"
    :data-maska="dataMaska"
    :placeholder="placeholder"
    @maska="updateInternalValue"
    :value="internalValue.masked"
    v-bind="$attrs"
  />
</template>

<script>
import { vMaska } from "maska";
import debounce from "lodash.debounce";

export default {
  name: "InputSearchWithMaska",
  directives: { maska: vMaska },
  props: {
    value: Object,
    type: { type: String, default: "text" },
    placeholder: String,
    dataMaska: String,
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
      this.updateValue(event);
    },

    // Debounce event emit to prevent unnecessary data fetching
    updateValue: debounce(function (value) {
      this.touched = false;
      this.$emit("update:masked", value.detail.masked);
      this.$emit("update:unmasked", value.detail.unmasked);
      this.$emit("update:completed", value.detail.completed);
      this.$emit("input", value.detail);
    }, 500),
  },
};
</script>

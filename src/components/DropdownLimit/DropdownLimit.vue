<template>
  <div>
    <select
      class="form-select select-limit"
      :value="value"
      @input="$emit('input', parseInt($event.target.value))"
    >
      <option
        v-if="!options.includes(value)"
        :value="value"
        :hidden="!options.includes(value)"
      >
        {{ value }}
      </option>
      <template v-if="Array.isArray(options) && options.length">
        <option v-for="item in options" :key="item" :value="item">
          {{ item }}
        </option>
      </template>
    </select>
  </div>
</template>

<script>
export default {
  name: "DropdownLimit",
  props: {
    defaultValue: {
      type: [String, Number],
    },
    value: {
      type: [String, Number],
    },
    options: {
      type: Array,
      default: function () {
        return [10, 20, 30, 40, 50];
      },
    },
  },
};
</script>

<style scoped>
.select-limit {
  background-position: calc(100% - 3px) 11px, calc(100% - 20px) 13px, 100% 0;
  width: 5rem;
}
</style>

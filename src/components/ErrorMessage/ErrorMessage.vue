<template>
  <div>
    <!-- This is for Vuelidators Errors Message -->
    <div v-if="Array.isArray(errors) && errors.length">
      <div v-for="(error, index) of errors" :key="`errors-${index}`">
        <div class="text-danger pt-1">
          {{ error.$message }}
        </div>
      </div>
    </div>

    <!-- This is for Normal String Errors Message -->
    <div v-if="typeof errors === 'string'">
      <div class="text-danger pt-1">{{ errors }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ErrorMessage",
  props: {
    errors: {
      type: [String, Array],
      required: true,
    },
  },
};
</script>

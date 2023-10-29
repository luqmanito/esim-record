<template>
  <div class="space-prefix-item">
    <div class="card shadow-none cursor-pointer border rounded h-100">
      <div
        class="card-body d-flex flex-column justify-content-center align-items-center text-center rounded"
        data-bs-toggle="tooltip"
        data-bs-html="true"
        data-bs-trigger="hover"
        :data-bs-original-title="data?.prefix"
        :title="data?.prefix"
      >
        <slot />
        <span v-if="data">{{ data?.prefix }}{{ data?.ruang_row }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RuanganPrefixSpaceItem",
  props: ["data"],
};
</script>

<style>
.space-prefix-item {
  height: 540px;
  width: 70px;
  margin: 5px;
}
</style>

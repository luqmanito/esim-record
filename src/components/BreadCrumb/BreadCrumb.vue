<template>
  <div class="row breadcrumbs-top">
    <div class="col-12">
      <h2 v-if="showHeader" class="content-header-title float-start mb-0">
        {{ name }}
      </h2>
      <div v-if="breadcrumbMeta" class="breadcrumb-wrapper">
        <ol class="breadcrumb">
          <li
            class="breadcrumb-item"
            v-for="(item, index) in breadcrumbMeta"
            :key="`route-${index}`"
          >
            <router-link
              :to="link(item.href)"
              :class="[item?.active ? 'text-primary' : 'text-body']"
            >
              {{ item?.text || "" }}</router-link
            >
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BreadCrumb",
  props: {
    showHeader: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    name() {
      return this.$route?.meta?.pageTitle || this.$route?.name;
    },
    matched() {
      return this.$route.matched;
    },
    breadcrumbMeta() {
      return this.$route?.meta?.breadcrumb;
    },
    link() {
      return (value) => {
        if (typeof value === "string") {
          let replaceLink = value.replace(
            /:(\w+)/g,
            (match, key) => this.$route.params[key] || match
          );

          return replaceLink;
        }
      };
    },
  },
};
</script>

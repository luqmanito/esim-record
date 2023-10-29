<template>
  <ul
    class="navigation navigation-main"
    id="main-menu-navigation"
    data-menu="menu-navigation"
  >
    <template v-for="(item, indexItem) in menu">
      <li
        :class="
          !item?.parent_id && item?.children
            ? 'navigation-header'
            : currentRoute.toString().includes(item?.url)
            ? 'nav-item active'
            : 'nav-item'
        "
        :key="`${indexItem}-${item.id}`"
      >
        <router-link
          v-if="item?.url != '' && !item?.children"
          :to="item?.url"
          class="d-flex align-items-center"
        >
          <tabler-icon size="21" :icon="item?.icon || 'GridIcon'" />
          <span class="menu-title text-truncate">{{ item?.title }}</span>
        </router-link>
        <div v-else>
          <span class="menu-title text-truncate">{{ item?.title }}</span>
          <tabler-icon icon="DotsIcon" v-if="!isShowIconNavHeader" />
        </div>
      </li>

      <template v-if="item?.children">
        <li
          v-for="children in item?.children"
          :key="children?.id"
          class="nav-item"
          :class="[
            currentRoute.toString().includes(children?.url) ? 'active' : '',
          ]"
        >
          <router-link :to="children?.url" class="d-flex align-items-center">
            <tabler-icon size="21" :icon="children?.icon || 'GridIcon'" />
            <span class="menu-title text-truncate">{{ children?.title }}</span>
          </router-link>
        </li>
      </template>
    </template>
  </ul>
</template>

<script>
export default {
  name: "MenuItem",
  props: {
    menu: {
      type: Array,
      default: [],
    },
    functions: {
      type: Array,
      default: [],
    },
    isShowIconNavHeader: {
      type: Boolean,
    },
  },
  computed: {
    currentRoute() {
      return this.$route.path;
    },
  },
};
</script>

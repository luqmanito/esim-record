<template>
  <ul
    class="navigation navigation-main"
    id="main-menu-navigation"
    data-menu="menu-navigation"
  >
    <template v-for="(item, indexItem) in menu">
      <template v-if="!item?.parent_id && item?.children">
        <li
          class="navigation-header"
          :key="`navigation-header-${indexItem}-${item.id}`"
        >
          <span class="menu-title text-truncate">{{ item?.title }}</span>
          <tabler-icon icon="DotsIcon" v-if="!isShowIconNavHeader" />
        </li>
      </template>

      <li
        class="nav-item"
        :class="[
          isActiveNav(item) ? 'active' : isHasChildren(item) ? 'has-sub' : '',
          isActiveCollapsedNav(item?.children) && isShowIconNavHeader
            ? 'open '
            : '',
          isActiveCollapsedNav(item?.children)
            ? 'has-sub sidebar-group-active'
            : '',
        ]"
        :key="`${indexItem}-${item.id}`"
      >
        <router-link
          @click.native="setActiveGroupId('')"
          v-if="isHasUrl(item)"
          :to="item?.url"
          class="d-flex align-items-center"
        >
          <tabler-icon size="22" :icon="item?.icon || 'GridDotsIcon'" />
          <span class="menu-title text-truncate">{{ item?.title }}</span>
        </router-link>

        <!-- Header Group -->
        <a
          v-else
          class="align-items-center"
          @click="setActiveGroupId(item?.id)"
        >
          <tabler-icon size="21" :icon="item?.icon || 'GridDotsIcon'" />
          <span class="menu-title text-truncate">{{ item?.title }}</span>
        </a>

        <ul class="menu-content">
          <li
            class="ms-3"
            v-for="children in item?.children"
            :key="children?.id"
            :class="[isChildrenActiveMenu(children) ? 'active' : '']"
          >
            <router-link :to="children?.url" class="d-flex align-items-center">
              <tabler-icon
                class="icon-children"
                :icon="children?.icon || 'GridDotsIcon'"
              />
              <span class="menu-title text-truncate py-25">{{
                children?.title
              }}</span>
            </router-link>
          </li>
        </ul>
      </li>
    </template>
  </ul>
</template>

<script>
export default {
  name: "MenuItemWithDropdown",
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
  data() {
    return {
      activeGroupId: "",
    };
  },
  methods: {
    setActiveGroupId(value) {
      if (this.activeGroupId !== value) {
        this.activeGroupId = value;
      } else {
        this.activeGroupId = "";
      }
    },
  },
  computed: {
    currentRoutePath() {
      return this.$route.path;
    },
    isActiveNav() {
      return (item) =>
        !item?.parent_id &&
        !item?.children &&
        this.currentRoutePath.toString().includes(item?.url);
    },
    isActiveCollapsedNav() {
      return (children) => {
        if (children && Array.isArray(children)) {
          for (let i in children) {
            let isIncluded = this.activeGroupId === children[i]?.parent_id;

            if (isIncluded) {
              return true;
            } else {
              return false;
            }
          }
        }
      };
    },
    isHasChildren() {
      return (item) => item?.children;
    },
    isHasUrl() {
      return (item) => item?.url && item?.url !== "-";
    },
    isChildrenActiveMenu() {
      return (children) => {
        if (this.currentRoutePath.toString().includes(children?.url)) {
          return true;
        } else {
          return false;
        }
      };
    },
  },
  mounted() {
    // Set Default Active Group Id
    if (this.menu && Array.isArray(this.menu)) {
      this.menu.map((item) => {
        const children = item?.children;
        if (children && Array.isArray(children)) {
          for (let i in children) {
            let currentActiveChildren = this.currentRoutePath
              .toString()
              .includes(children[i]?.url);

            if (currentActiveChildren) {
              this.activeGroupId = children[i]?.parent_id;
              return;
            }
          }
        }
      });
    }
  },
};
</script>

<style scoped>
.icon-children {
  font-size: 18px !important;
  height: 18px !important;
  width: 18px !important;
}
</style>

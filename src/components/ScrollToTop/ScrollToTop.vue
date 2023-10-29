<template>
  <div class="scroll-top scroll-top-opacity" :class="{ show: y > 250 }">
    <BaseButton @click="scrollToTop" class="btn btn-icon">
      <tabler-icon icon="ArrowUpIcon" size="16" />
    </BaseButton>
  </div>
</template>

<script>
import { useWindowScroll } from "@vueuse/core";
import BaseButton from "@/components/Button/BaseButton.vue";

export default {
  name: 'ScrollToTop',
  components: {
    BaseButton,
  },
  setup() {
    const { y } = useWindowScroll();

    const scrollToTop = () => {
      const rootEle = document.documentElement;
      rootEle.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

    return {
      y,
      scrollToTop,
    };
  },
};
</script>

<style lang="scss" scoped>
.scroll-top-opacity {
  opacity: 0;
  transition: all 0.5s ease;

  &.show {
    opacity: 1;
  }
}
</style>

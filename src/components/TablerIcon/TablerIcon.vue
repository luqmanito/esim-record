<script>
import * as icons from "vue-tabler-icons";

export default {
  name: "TablerIcon",
  functional: true,
  props: {
    icon: {
      required: true,
      type: [String, Object],
    },
    size: {
      type: String,
      default: "16",
    },
    badge: {
      type: [String, Object, Number],
      default: null,
    },
    badgeClasses: {
      type: [String, Object, Array],
      default: "badge-primary",
    },
  },
  render(h, { props, data }) {
    // Create Feather Icon
    const svg = h(icons[props.icon], { props: { size: props.size }, ...data });

    // If no badge is provided => Render just SVG
    if (!props.badge) return svg;

    // Badge
    const badgeEl = h(
      "span",
      { staticClass: "badge badge-up badge-pill", class: props.badgeClasses },
      [props.badge]
    );

    // Return span with children
    return h("span", { staticClass: "position-relative" }, [svg, badgeEl]);
  },
};
</script>
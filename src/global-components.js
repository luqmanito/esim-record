import Vue from "vue";
import FeatherIcon from "@/components/FeatherIcon/FeatherIcon.vue";
import TablerIcon from "@/components/TablerIcon/TablerIcon.vue";
import vSelect from "vue-select";

Vue.component(FeatherIcon.name, FeatherIcon);
Vue.component(TablerIcon.name, TablerIcon);

vSelect.props.components.default = () => ({
  Deselect: {
    render: (createElement) =>
      createElement("tabler-icon", {
        attrs: {
          icon: "XIcon",
          size: "14",
          style: "fill: none;",
        },
      }),
  },
  OpenIndicator: {
    render: (createElement) =>
      createElement("tabler-icon", {
        attrs: {
          icon: "ChevronDownIcon",
          size: "14",
          style: "fill: none;",
        },
      }),
  },
  SearchInput: {
    render: (createElement) =>
      createElement("select", {
        attrs: {
          class: "form-control",
        },
      }),
  },
});

Vue.component(vSelect);

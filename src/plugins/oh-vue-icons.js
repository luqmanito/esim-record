import Vue from "vue";
import { OhVueIcon, addIcons } from "oh-vue-icons";
import {
  LaWpforms,
  LaCalculatorSolid,
  LaFileContractSolid,
  LaSignatureSolid,
  LaFileInvoiceSolid,
  LaBriefcaseSolid,
  LaShippingFastSolid,
  LaVoteYeaSolid,
  LaWindowMaximize,
  LaClipboardListSolid 
} from "oh-vue-icons/icons";

addIcons(
  LaWpforms,
  LaCalculatorSolid,
  LaFileContractSolid,
  LaSignatureSolid,
  LaFileInvoiceSolid,
  LaBriefcaseSolid,
  LaShippingFastSolid,
  LaVoteYeaSolid,
  LaWindowMaximize,
  LaClipboardListSolid
);

Vue.component("v-icon", OhVueIcon);

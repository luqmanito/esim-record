<template>
  <apexchart :height="height" :options="chartOptions" :series="series" />
</template>

<script>
const $strokeColor2 = "#28c76f66";
const $strokeColor3 = "#28c76f33";

const $strokeColorPrimary = "rgba(234, 123, 11, 0.8)";
const $strokeColorPrimary2 = "rgba(234, 123, 11, 0.4)";

const $strokeColorSecondary = "rgba(7, 162, 75, 0.8)";
const $strokeColorSecondary2 = "rgba(7, 162, 75, 0.4)";

export default {
  name: "ApexChartsDonut",
  props: {
    height: {
      type: [String, Number],
      default: 120,
    },
    options: {
      type: Object,
      default: null,
    },
    series: {
      type: Array,
      default: () => [],
    },
    labels: {
      type: Array,
      default: () => [],
    },
    totalLabel: {
      type: String,
      default: "Total",
    },
    totalValue: {
      type: [String, Number],
      default: 0,
    },
  },
  data() {
    return {
      chartOptions: {
        chart: {
          type: "donut",
          toolbar: {
            show: false,
          },
          fontFamily: "Public Sans, Segoe UI",
        },
        dataLabels: {
          enabled: false,
        },
        legend: { show: false },
        comparedResult: [2, -3, 8],
        labels: this.labels,
        stroke: { width: 0 },
        colors: [$strokeColorSecondary, $strokeColorSecondary2],
        grid: {
          padding: {
            right: -20,
            bottom: -8,
            left: -20,
          },
        },
        plotOptions: {
          pie: {
            startAngle: -10,
            donut: {
              labels: {
                show: true,
                name: {
                  offsetY: 15,
                },
                value: {
                  offsetY: -15,
                  formatter(val) {
                    // eslint-disable-next-line radix
                    return `${parseInt(val)}`;
                  },
                },
                total: {
                  show: true,
                  offsetY: 15,
                  label: this.totalLabel,
                  fontSize: "11px",
                  formatter() {
                    return `${this.totalValue || 0}%`;
                  },
                },
              },
            },
          },
        },
        responsive: [
          {
            breakpoint: 1325,
            options: {
              chart: {
                height: 100,
              },
            },
          },
          {
            breakpoint: 1200,
            options: {
              chart: {
                height: 120,
              },
            },
          },
          {
            breakpoint: 1045,
            options: {
              chart: {
                height: 100,
              },
            },
          },
          {
            breakpoint: 992,
            options: {
              chart: {
                height: 120,
              },
            },
          },
        ],
        ...this.options,
      },
    };
  },
};
</script>

<template>
    <BaseModal
      :open="isShowModal"
      classNameModal="modal-lg"
      id="modal_detail_oracle"
      :showFooter="false"
      :order="2"
    >
      <h3 class="text-center mb-1">Detail Oracle Item</h3>
      <p class="text-center">Detail Oracle Item yang telah di sinkronisasikan</p>
  
      <div class="mt-3">
        <Spinner v-if="isLoading" />
  
        <div v-if="!isLoading" class="col-md-12">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Keterangan</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="fw-bolder">Kode Organisasi</td>
                  <td>
                    {{ detail?.OrganizationCode || "-" }}
                  </td>
                </tr>
                <tr>
                  <td class="fw-bolder">Nomor Item</td>
                  <td>
                    {{ detail?.ItemNumber || "-" }}
                  </td>
                </tr>
                <tr>
                  <td class="fw-bolder">Deskripsi Item</td>
                  <td>
                    {{ detail?.ItemDescription || "-" }}
                  </td>
                </tr>
                <tr>
                  <td class="fw-bolder">Status Item</td>
                  <td>
                    <span
                      v-if="detail?.ItemStatusValue"
                      class="badge rounded-pill"
                      :class="
                        detail?.ItemStatusValue == 'Active'
                          ? 'badge-light-success'
                          : 'badge-light-danger'
                      "
                    >
                      {{ detail?.ItemStatusValue }}
                    </span>
                    <span v-else>-</span>
                  </td>
                </tr>
                <tr>
                  <td class="fw-bolder">Status Approval</td>
                  <td>
                    <span
                      v-if="detail?.ApprovalStatusValue"
                      class="badge rounded-pill"
                      :class="
                        detail?.ApprovalStatusValue == 'Approved'
                          ? 'badge-light-success'
                          : 'badge-light-dark'
                      "
                    >
                      {{ detail?.ApprovalStatusValue }}
                    </span>
  
                    <span v-else>{{ detail?.ApprovalStatusValue }}</span>
                  </td>
                </tr>
                <tr>
                  <td class="fw-bolder">Harga Pokok Penjualan</td>
                  <td v-if="detail?.ListPrice">
                    {{ changeCurrency(detail?.ListPrice) }}
                  </td>
  
                  <td v-else>-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
  
        <div class="col-md-12">
          <div class="table-responsive">
            <table class="table table-hover"></table>
          </div>
        </div>
      </div>
    </BaseModal>
  </template>
  
  <script>
  import BaseModal from "@/components/Modal/BaseModal.vue";
  import BaseButton from "@/components/Button/BaseButton.vue";
  import Spinner from "@/components/Loading/Spinner.vue";
  import LayananNetwork from "@/network/lib/layanan";
  
  import currencyFormat from "@/utils/currencyFormat";
  
  export default {
    name: "ModalDetailItemOracle",
    components: {
      BaseModal,
      BaseButton,
      Spinner,
    },
    props: {
      isShowModal: {
        type: Boolean,
        default: false,
      },
      syncOracleItem: {
        type: Object,
        defaut: null,
      },
      selectedItemData: {
        type: [String, Object],
        default: null,
      },
    },
    data() {
      return {
        isLoading: false,
        detail: {},
      };
    },
    methods: {
      async getSyncOracleDetailItemByNumber({ ItemId, OrganizationId }) {
        try {
          this.isLoading = true;
          const response = await LayananNetwork.getSyncOracleDetailItemByNumber({
            ItemId,
            OrganizationId,
          });
  
          if (response) {
            this.isLoading = false;
            const data = response?.data?.items;
            if (Array.isArray(data) && data.length) {
              this.detail = data[0];
            }
          }
        } catch (error) {
          this.isLoading = false;
          this.$store.dispatch("toast/showToastError", {
            error: error,
          });
        }
      },
      changeCurrency(value) {
        return currencyFormat(value);
      },
    },
  
    watch: {
      syncOracleItem(value) {
        if (value) {
          this.getSyncOracleDetailItemByNumber({
            ItemId: value?.ItemId,
            OrganizationId: value?.OrganizationId,
          });
        }
      },
    },
  };
  </script>
  
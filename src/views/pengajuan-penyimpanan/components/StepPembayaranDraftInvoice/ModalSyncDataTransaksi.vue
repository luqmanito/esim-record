<template>
  <BaseModal :open="isShowModal" classNameModal="modal-xl" id="sync_data_transaksi" :showFooter="false" :order="1">
    <h3 class="text-center mb-1">Sinkronisasi Data Transaksi</h3>
    <p class="text-center">
      Sinkronisasikan Data Transaksi Oracle ke dalam pengajuan
    </p>

    <div class="row mt-2">
      <div class="col-12 col-md-4">
        <div class="input-group">
          <label class="form-label" for="input-no-transaksi-modal">Nomor Transaksi</label>

          <div class="input-group">
            <InputSearch id="input-no-transaksi-modal" class="form-control" placeholder="Contoh : 2206001000869"
              v-model="input_no_transaksi" />
            <!-- <BaseButton type="button" className="btn btn-primary" title="Sync" data-bs-toggle="modal"
                data-bs-target="#sync_data_pelanggan">
              </BaseButton> -->
          </div>
        </div>

      </div>


      <div class="table-responsive mt-2">
        <table class="table table-hover">
          <thead class="table-light">
            <tr>
              <th>No</th>
              <th>Nomor Transaksi</th>
              <th>Transaction Source</th>
              <th>Transaction Type</th>
              <th>Customer</th>
              <th>Balance Amount</th>
              <th>Transaction Date</th>
              <th class="text-center">Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="listOracleTransaction.loading">
              <td colspan="8" class="text-center">Loading...</td>
            </tr>

            <tr v-else-if="!listOracleTransaction.loading && listOracleTransaction.data.length"
              v-for="(item, index) in listOracleTransaction.data" :key="item?.Id">
              <td>{{ index + 1 }}</td>
              <td>{{ item?.TransactionNumber || "-" }}</td>
              <td>{{ item?.TransactionSource || "-" }}</td>
              <td>{{ item?.TransactionType || "-" }}</td>
              <td>
                {{ item?.BillToCustomerName || "-" }}
              </td>
              <td>{{ item?.InvoiceCurrencyCode }} {{ item?.InvoiceBalanceAmount || 0 }}</td>
              <td>{{ formatDate(item?.TransactionDate) }}</td>

              <td>
                <span class="badge rounded-pill" :class="statusClass(item?.InvoiceStatus)">
                  {{ item?.InvoiceStatus }}
                </span>
              </td>
              <td>
                <div class="d-flex align-items-center col-actions">
                  <BaseButton v-if="isSelected(item?.CustomerTransactionId)"
                    @click="handleSelectedDataOracle({ transaction: item })" className="btn btn-sm btn-success me-1"
                    data-bs-toggle="tooltip" data-bs-placement="top" data-bs-original-title="Dipilih" title="Dipilih">
                    <tabler-icon class="me-25" icon="ChecksIcon" size="24" />
                  </BaseButton>

                  <BaseButton v-else @click="handleSelectedDataOracle({ transaction: item })"
                    className="btn btn-sm btn-primary me-1" data-bs-toggle="tooltip" data-bs-placement="top"
                    data-bs-original-title="Pilih" title="Pilih">
                    <tabler-icon class="me-25" icon="CheckIcon" size="24" />
                  </BaseButton>
                </div>
              </td>
            </tr>

            <tr v-else>
              <td colspan="8" class="text-center">Tidak ada Data ditemukan</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </BaseModal>
</template>
  
<script>
import PengajuanPenyimpananNetwork from '@/network/lib/pengajuan-penyimpanan'

import BaseModal from "@/components/Modal/BaseModal.vue";
import BaseButton from "@/components/Button/BaseButton.vue";
import InputSearch from "@/components/InputSearch/InputSearch.vue";

import { formatDateMoments } from "@/utils/momentDateFormat";

export default {
  name: 'ModalSyncDataTransaksi',
  components: {
    BaseModal,
    BaseButton,
    InputSearch
  },
  props: {
    no_transaksi: {
      type: [String, Number],
    },
    isShowModal: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isLoadingSubmit: false,
      input_no_transaksi: "",
      listOracleTransaction: {
        loading: false,
        data: []
      }
    }
  },
  computed: {
    syncedTransaction() {
      return this.$store.state.pengajuanPenyimpanan.piv.syncedTransaction;
    },
    formatDate() {
      return value => {
        return formatDateMoments(value)
      }
    },
    statusClass() {
      return value => {
        if (typeof value == 'string') {
          const valueString = value.toLowerCase()
          if (valueString == 'incomplete') {
            return 'badge-light-warning'
          } else if (valueString == 'complete') {
            return 'badge-light-success'
          } else {
            return 'badge-light-dark'
          }
        }
      }
    },
    isSelected() {
      return value => {
        if (this.syncedTransaction?.CustomerTransactionId == value) {
          return true;
        } else {
          return false;
        }
      }
    },
  },

  methods: {
    async getListOracleTransactionSync({ transaction_number }) {
      try {
        this.listOracleTransaction.loading = true;
        const response =
          await PengajuanPenyimpananNetwork.getListOracleTransactionSync({
            transaction_number,
          });

        if (response) {
          this.listOracleTransaction.loading = false;
          this.listOracleTransaction.data = response?.data?.items;
        }
      } catch (error) {
        this.listOracleTransaction.data = [];
        this.listOracleTransaction.loading = false;
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },

    async handleSelectedDataOracle({ transaction }) {
      this.$store.commit("pengajuanPenyimpanan/SET_PIV_SYNCED_TRANSACTION", transaction);

      this.$emit('handle-set-input-parent', { transaction_number: transaction?.TransactionNumber })

      document
        .getElementById("close_button_modal_sync_data_transaksi")
        .click();
    }
  },

  watch: {
    no_transaksi(value) {
      if (value) {
        const stringValue = value.toString();
        if (stringValue.length >= 10) {
          this.input_no_transaksi = stringValue;
        }
      }
    },

    input_no_transaksi(value) {
      if (value) {
        this.getListOracleTransactionSync({
          transaction_number: value
        })
      }
    }
  }
}
</script>
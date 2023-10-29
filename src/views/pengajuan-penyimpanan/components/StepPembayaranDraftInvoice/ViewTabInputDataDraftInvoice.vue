<template>
  <div class="my-2">
    <div class="row">
      <div class="col-12 col-md-6 offset-0 offset-md-3 rounded border p-2 mb-2">
        <h5 class="mb-0 text-center mb-2">Sinkronisasi Transaksi</h5>
        <div class="input-group">
          <label class="form-label" for="input-no-transaksi">Masukkan No Transaksi</label>
          <div class="input-group">
            <InputSearch id="input-no-transaksi" class="form-control" placeholder="Contoh : 2206001000869"
              v-model="no_transaksi" />
            <BaseButton :isDisabled="isButtonSyncDisable" type="button" className="btn btn-primary" title="Sync"
              data-bs-toggle="modal" data-bs-target="#sync_data_transaksi">
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <template v-if="isAlreadySyncedTransaction">
      <div>
        <div class="row rounded border p-2 mb-2">
          <small class="fw-bolder card-text text-uppercase ms-2 text-primary mb-2">Informasi Umum</small>
          <hr />

          <div class="col-12 col-md-4 table-responsive">
            <table class="table table-hover">
              <tbody>
                <tr>
                  <td class="fw-bolder" style="width: 30%;">Business Unit</td>
                  <td style="width: 70%;">
                    {{ syncedTransaction?.BusinessUnit || "-" }}
                  </td>
                </tr>
                <tr>
                  <td class="fw-bolder">Transaction Source</td>
                  <td>
                    {{ syncedTransaction?.TransactionSource || "-" }}
                  </td>
                </tr>
                <tr>
                  <td class="fw-bolder">Transaction Type</td>
                  <td>
                    {{ syncedTransaction?.TransactionType || "-" }}
                  </td>
                </tr>
                <tr>
                  <td class="fw-bolder">Transaction Number</td>
                  <td>
                    {{ syncedTransaction?.TransactionNumber || "-" }}
                  </td>
                </tr>
                <tr>
                  <td class="fw-bolder">Document Number</td>
                  <td>
                    {{ syncedTransaction?.DocumentNumber || "-" }}
                  </td>
                </tr>
                <tr>
                  <td class="fw-bolder">Status</td>
                  <td>
                    <span class="badge rounded-pill" :class="statusClass(syncedTransaction?.InvoiceStatus)">
                      {{ syncedTransaction?.InvoiceStatus }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="col-12 col-md-4 table-responsive">
            <table class="table table-hover">
              <tbody>
                <tr>
                  <td class="fw-bolder" style="width: 30%;">Transaction Date</td>
                  <td style="width: 70%;">
                    {{ formatDate(syncedTransaction?.TransactionDate) }}
                  </td>
                </tr>
                <tr>
                  <td class="fw-bolder">Accounting Date</td>
                  <td>
                    {{ formatDate(syncedTransaction?.AccountingDate) }}
                  </td>
                </tr>
                <tr>
                  <td class="fw-bolder">Sales Person</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td class="fw-bolder">Invoicing Rule</td>
                  <td>{{ syncedTransaction?.InvoicingRules || "-" }}</td>
                </tr>
                <tr>
                  <td class="fw-bolder">Notes</td>
                  <td>
                    <template v-if="Array.isArray(syncedTransaction?.notes)">
                      <ul>
                        <li v-for="(note, index) in syncedTransaction?.notes" :key="`note-${index}`">
                          {{ note }}
                        </li>
                      </ul>
                    </template>
                    <span v-else>-</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="col-12 col-md-4 table-responsive">
            <table class="table table-hover">
              <tbody>
                <tr>
                  <td class="fw-bolder" style="width: 30%;">Currency</td>
                  <td style="width: 70%;">
                    {{ syncedTransaction?.InvoiceCurrencyCode || "" }}
                  </td>
                </tr>
                <tr>
                  <td class="fw-bolder">Transaction Total</td>
                  <td>
                    {{ syncedTransaction?.InvoiceBalanceAmount || 0 }}
                  </td>
                </tr>
                <tr>
                  <td class="fw-bolder">Lines</td>
                  <td>
                    <span
                      v-if="Array.isArray(syncedTransaction.receivablesInvoiceLines) && syncedTransaction.receivablesInvoiceLines.length">
                      {{ syncedTransaction?.receivablesInvoiceLines[0]?.LineAmount }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td class="fw-bolder">Tax</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td class="fw-bolder">Freight</td>
                  <td>{{ syncedTransaction?.FreightAmount || 0 }}</td>
                </tr>
                <tr>
                  <td class="fw-bolder">Charges</td>
                  <td>-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="row rounded border p-2 mb-2">
          <div class="col-12 col-md-4 table-responsive">
            <small class="fw-bolder card-text text-uppercase ms-2 text-primary mb-2">Customer</small>
            <hr />

            <table class="table table-hover">
              <tbody>
                <tr>
                  <td class="fw-bolder" style="width: 30%;">Bill - to Name</td>
                  <td style="width: 70%;">
                    {{ syncedTransaction?.BillToCustomerName || "-" }}
                  </td>
                </tr>
                <tr>
                  <td class="fw-bolder">Bill - to Site</td>
                  <td>
                    {{ syncedTransaction?.BillToSite || "-" }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="col-12 col-md-8">
            <small class="fw-bolder card-text text-uppercase ms-2 text-primary mb-2">Payment</small>
            <hr />

            <div class="row">
              <div class="col-12 col-md-6 table-responsive">
                <table class="table table-hover">
                  <tbody>
                    <tr>
                      <td class="fw-bolder" style="width: 30%;">Ship - to Name</td>
                      <td style="width: 70%;">
                        {{ syncedTransaction?.ShipToCustomerName || "-" }}
                      </td>
                    </tr>
                    <tr>
                      <td class="fw-bolder">Ship - to Site</td>
                      <td>
                        {{ syncedTransaction?.ShipToSite || "-" }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="col-12 col-md-6 table-responsive">
                <table class="table table-hover">
                  <tbody>
                    <tr>
                      <td class="fw-bolder" style="width: 30%;">Payment Terms</td>
                      <td style="width: 70%;">
                        {{ syncedTransaction?.PaymentTerms || "-" }}
                      </td>
                    </tr>
                    <tr>
                      <td class="fw-bolder">Due Date</td>
                      <td>
                        {{ formatDate(syncedTransaction?.DueDate) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>

        <div
          v-if="Array.isArray(syncedTransaction?.receivablesInvoiceLines) && syncedTransaction?.receivablesInvoiceLines.length"
          class="row rounded border p-2 mb-2">
          <small class="fw-bolder card-text text-uppercase ms-2 text-primary mb-2">Invoice Lines</small>
          <hr />

          <div class="position-relative overflow-auto">
            <table class="table table-bordered">
              <thead class="table-light">
                <tr>
                  <th rowspan="2" class="text-center align-middle sticky-col first-col">Line</th>
                  <th rowspan="2" class="align-middle sticky-col second-col">Item</th>
                  <th rowspan="2" class="align-middle sticky-col third-col">Description</th>
                  <th rowspan="1" colspan="5" class="text-center align-middle">Line Information</th>
                  <th rowspan="1" colspan="2" class="text-center align-middle">Sales Order</th>
                </tr>
                <tr>
                  <!-- Line Information -->
                  <th class="align-middle">Memo Line</th>
                  <th class="align-middle">UOM</th>
                  <th class="text-center align-middle">Quantity</th>
                  <th class="text-center align-middle">Unit Price</th>
                  <th class="text-center align-middle">Amount</th>

                  <!-- Sales Order -->
                  <th class="text-center align-middle">Number</th>
                  <th class="text-center align-middle">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in syncedTransaction?.receivablesInvoiceLines" :key="`invoice-lines-${index}`">
                  <td class="text-center sticky-col first-col">{{ item?.LineNumber }}</td>
                  <td class="sticky-col second-col">
                    {{ syncedTransaction?.receivablesInvoiceDFF[index]?.segmentProduct || "-" }}
                  </td>
                  <td class="sticky-col third-col">
                    {{ item?.Description || "-" }}
                  </td>

                  <!-- Line Information -->
                  <td>
                    {{ item?.MemoLine || "-" }}
                  </td>
                  <td>
                    {{ item?.UnitOfMeasure || "-" }}
                  </td>
                  <td class="text-center">
                    {{ item?.Quantity || "-" }}
                  </td>
                  <td class="text-center">
                    {{ item?.UnitSellingPrice || "-" }}
                  </td>
                  <td class="text-center">
                    {{ item?.LineAmount || "-" }}
                  </td>

                  <!-- Sales Order -->
                  <td>
                    {{ item?.SalesOrder || "-" }}
                  </td>
                  <td>
                    {{ formatDate(item?.SalesOrderDate) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </template>

    <div class="row py-3">
      <div class="col-lg-6 text-sm-center text-lg-start mb-sm-2 mb-lg-0">
        <BaseButton type="button" @click="handleClickAction({ type: 'back', urutan: currentStep?.urutan - 1 })"
          className="btn btn-outline-primary" title="Sebelumnya">
          <template #icon-left>
            <tabler-icon icon="ChevronLeftIcon" />
          </template>
        </BaseButton>
      </div>

      <div class="col-lg-6 text-sm-center text-lg-end mb-sm-2 mb-lg-0">
        <BaseButton v-if="currentStep?.penyimpananflow?.status == 'progress'"
          :isDisabled="!syncedTransaction || !syncedTransaction?.CustomerTransactionId"
          @click="handleClickAction({ type: 'save', urutan: currentStep?.urutan })" type="button"
          className="btn btn-primary" title="Simpan">
          <template #icon-right>
            <tabler-icon icon="DeviceFloppyIcon" />
          </template>
        </BaseButton>

        <BaseButton v-else @click="handleClickAction({ type: 'next', urutan: currentStep?.urutan + 1 })" type="button"
          className="btn btn-primary" title="Selanjutnya">
          <template #icon-right>
            <tabler-icon icon="ChevronRightIcon" />
          </template>
        </BaseButton>
      </div>
    </div>

    <ModalSyncDataTransaksi :no_transaksi="no_transaksi" @handle-set-input-parent="handleSetInputParent" />
  </div>
</template>

<script>
import BaseButton from "@/components/Button/BaseButton.vue";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage.vue";
import InputSearch from "@/components/InputSearch/InputSearch.vue";

import ModalSyncDataTransaksi from '@/views/pengajuan-penyimpanan/components/StepPembayaranDraftInvoice/ModalSyncDataTransaksi.vue'

import { formatDateMoments } from "@/utils/momentDateFormat";

export default {
  name: "ViewTabInputDataDraftInvoice",
  components: {
    BaseButton,
    ErrorMessage,
    InputSearch,
    ModalSyncDataTransaksi
  },
  data() {
    return {
      no_transaksi: ""
    }
  },
  computed: {
    currentStep() {
      return this.$store.state.pengajuanPenyimpanan.currentStep;
    },
    isButtonSyncDisable() {
      if (typeof this.no_transaksi == 'string' && this.no_transaksi.length >= 10) {
        return false
      } else {
        return true
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
    syncedTransaction() {
      return this.$store.state.pengajuanPenyimpanan.piv.syncedTransaction
    },
    detailPelanggan() {
      return this.$store.state.pengajuanPenyimpanan.detail?.pelanggan
    },
    isAlreadySyncedTransaction() {
      if (typeof this.syncedTransaction == 'object' && Object.keys(this.syncedTransaction).length) {
        return true
      } else {
        return false
      }
    },
    formatDate() {
      return value => {
        return formatDateMoments(value)
      }
    },
  },
  methods: {
    handleClickAction({ type, urutan }) {
      this.$emit("handle-click-action", { type, urutan });
    },

    handleSetInputParent({ transaction_number }) {
      this.no_transaksi = transaction_number
    }
  },
  mounted() {
    if (typeof this.syncedTransaction == 'object' && Object.keys(this.syncedTransaction).length) {
      this.no_transaksi = this.syncedTransaction?.TransactionNumber
    } else if (this.detailPelanggan?.transaction) {
      const data = {
        TransactionNumber: this.detailPelanggan?.transaction?.transaction_number,
        ContractTypeName: this.detailPelanggan?.transaction?.oracle_contract_type_name,
        Cognomen: this.detailPelanggan?.transaction?.oracle_cognomen,
        PartyName: this.detailPelanggan?.transaction?.oracle_party_name,
        StsCode: this.detailPelanggan?.transaction?.oracle_sts_code,
        LedgerCurrency: this.detailPelanggan?.transaction?.oracle_ledger_currency,
        EstimatedAmount: this.detailPelanggan?.transaction?.oracle_estimated_amount,
        StartDate: this?.detailPelanggan?.transaction?.oracle_start_date,
        EndDate: this?.detailPelanggan?.transaction?.oracle_end_date,
        UpdatedAtDate: this?.detailPelanggan?.transaction?.updated_at
      }
      this.no_transaksi = data.TransactionNumber
      // this.$store.commit("pengajuanPenyimpanan/SET_PIV_SYNCED_TRANSACTION", data)
    }
  }
}
</script>

<style scoped>
@media (min-width: 575.98px) {
  .sticky-col {
    position: -webkit-sticky;
    position: sticky;
  }

  .first-col {
    width: 100px;
    min-width: 100px;
    max-width: 100px;
    left: 0px;
    background-color: white;
  }

  .second-col {
    width: 200px;
    min-width: 200px;
    max-width: 200px;
    left: 100px;
    background-color: white;
  }

  .third-col {
    width: 200px;
    min-width: 200px;
    max-width: 200px;
    left: 300px;
    background-color: white;
  }
}
</style>
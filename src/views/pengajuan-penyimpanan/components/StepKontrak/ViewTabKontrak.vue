<template>
  <div class="my-2">
    <div class="row">
      <div class="col-12 col-md-6 offset-0 offset-md-3 rounded border p-2 mb-2">
        <h5 class="mb-0 text-center mb-2">Sinkronisasi Kontrak</h5>
        <div class="input-group">
          <label class="form-label" for="input-no-kontrak">Masukkan No Kontrak</label>
          <div class="input-group">
            <InputSearch id="input-no-kontrak" class="form-control" placeholder="Contoh : 4521/SPK/XII/2020"
              v-model="no_kontrak" />
            <BaseButton :isDisabled="isButtonSyncDisable" type="button" className="btn btn-primary" title="Sync"
              data-bs-toggle="modal" data-bs-target="#sync_data_kontrak">
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isAlreadySyncedContract" class="rounded border p-2 mb-2">
      <div class="table-responsive">
        <table class="table table-hover">
          <tbody>
            <tr>
              <td class="fw-bolder" style="width: 30%;">No Kontrak</td>
              <td style="width: 70%;">
                {{ syncedContract?.ContractNumber || "-" }}
              </td>
            </tr>
            <tr>
              <td class="fw-bolder">Tipe Kontrak</td>
              <td>
                {{ syncedContract?.ContractTypeName || "-" }}
              </td>
            </tr>
            <tr>
              <td class="fw-bolder">Nama Kontrak</td>
              <td>
                {{ syncedContract?.Cognomen || "-" }}
              </td>
            </tr>
            <tr>
              <td class="fw-bolder">Pelanggan</td>
              <td>
                {{ syncedContract?.PartyName || "-" }}
              </td>
            </tr>
            <tr>
              <td class="fw-bolder">Status</td>
              <td>
                <span class="badge rounded-pill text-capitalize" :class="statusClass(syncedContract?.StsCode)">
                  {{ syncedContract?.StsCode || "Tidak Diketahui" }}
                </span>
              </td>
            </tr>
            <tr>
              <td class="fw-bolder">Jumlah</td>
              <td>
                {{ syncedContract?.LedgerCurrency }} {{ syncedContract?.EstimatedAmount }}
              </td>
            </tr>
            <tr>
              <td class="fw-bolder">Tanggal Mulai Kontrak</td>
              <td>
                {{ formatDate({ value: syncedContract?.StartDate }) }}
              </td>
            </tr>
            <tr>
              <td class="fw-bolder">Tanggal Akhir Kontrak</td>
              <td>
                {{ formatDate({ value: syncedContract?.EndDate }) }}
              </td>
            </tr>
            <tr>
              <td class="fw-bolder">Terakhir Sinkronisasi</td>
              <td>
                <span class="badge rounded-pill" :class="lastSyncClass(syncedContract?.UpdatedAtDate)">
                  {{ syncedContract?.UpdatedAtDate
                    ? `${formatDate({ value: syncedContract?.UpdatedAtDate, format: "D MMMM YYYY, h:mm:ss a" })}`
                    : "Belum Tersinkronisasi" }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

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
          :isDisabled="!syncedContract || !syncedContract?.ContractNumber"
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

    <ModalSyncDataKontrak :no_kontrak="no_kontrak" @handle-set-input-parent="handleSetInputParent" />
  </div>
</template>

<script>
import BaseButton from "@/components/Button/BaseButton.vue";
import InputSearch from "@/components/InputSearch/InputSearch.vue";
import ModalSyncDataKontrak from '@/views/pengajuan-penyimpanan/components/StepKontrak/ModalSyncDataKontrak.vue'

import { formatDateMoments } from "@/utils/momentDateFormat";

export default {
  name: "ViewTabKontrak",
  components: {
    BaseButton,
    InputSearch,
    ModalSyncDataKontrak
  },
  data() {
    return {
      no_kontrak: ""
    }
  },
  computed: {
    currentStep() {
      return this.$store.state.pengajuanPenyimpanan.currentStep;
    },

    syncedContract() {
      return this.$store.state.pengajuanPenyimpanan.ktk.syncedContract
    },

    isButtonSyncDisable() {
      if (typeof this.no_kontrak == 'string' && this.no_kontrak.length >= 17) {
        return false
      } else {
        return true
      }
    },

    statusClass() {
      return value => {
        if (typeof value == 'string' && value.toLowerCase() == 'active') {
          return "badge-light-success";
        } else {
          return "badge-light-danger";
        }
      }
    },

    lastSyncClass() {
      return value => {
        if (value) {
          return "badge-light-success";
        } else {
          return "badge-light-danger";
        }
      }
    },

    detailPelanggan() {
      return this.$store.state.pengajuanPenyimpanan.detail?.pelanggan
    },

    formatDate() {
      return value => {
        return formatDateMoments(value?.value, value?.format);
      }
    },

    isAlreadySyncedContract() {
      if (typeof this.syncedContract == 'object' && Object.keys(this.syncedContract).length) {
        return true
      } else {
        return false
      }
    }
  },

  methods: {
    handleClickAction({ type, urutan }) {
      this.$emit("handle-click-action", { type, urutan });
    },

    handleSetInputParent({ contract_number }) {
      this.no_kontrak = contract_number
    }
  },

  mounted() {
    if (typeof this.syncedContract == 'object' && Object.keys(this.syncedContract).length) {
      this.no_kontrak = this.syncedContract?.ContractNumber
    } else if (this.detailPelanggan?.kontrak) {
      const data = {
        ContractNumber: this.detailPelanggan?.kontrak?.contract_number,
        ContractTypeName: this.detailPelanggan?.kontrak?.oracle_contract_type_name,
        Cognomen: this.detailPelanggan?.kontrak?.oracle_cognomen,
        PartyName: this.detailPelanggan?.kontrak?.oracle_party_name,
        StsCode: this.detailPelanggan?.kontrak?.oracle_sts_code,
        LedgerCurrency: this.detailPelanggan?.kontrak?.oracle_ledger_currency,
        EstimatedAmount: this.detailPelanggan?.kontrak?.oracle_estimated_amount,
        StartDate: this?.detailPelanggan?.kontrak?.oracle_start_date,
        EndDate: this?.detailPelanggan?.kontrak?.oracle_end_date,
        UpdatedAtDate: this?.detailPelanggan?.kontrak?.updated_at
      }
      this.no_kontrak = data.ContractNumber
      this.$store.commit("pengajuanPenyimpanan/SET_KTK_SYNCED_CONTRACT", data)
    }
  }
}
</script>
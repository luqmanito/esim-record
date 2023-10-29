<template>
  <BaseModal :open="isShowModal" classNameModal="modal-xl" id="sync_data_kontrak" :showFooter="false" :order="1">
    <h3 class="text-center mb-1">Sinkronisasi Data Kontrak</h3>
    <p class="text-center">
      Sinkronisasikan Data Kontrak Oracle ke dalam pengajuan
    </p>

    <div class="row mt-2">
      <div class="col-12 col-md-4">
        <div class="input-group">
          <label class="form-label" for="input-no-kontrak-modal">Nomor Kontrak</label>

          <div class="input-group">
            <InputSearch id="input-no-kontrak-modal" class="form-control" placeholder="Contoh : 4521/SPK/XII/2020"
              v-model="input_no_kontrak" />
            <!-- If Need Manual Button for Sync -->
            <!-- <BaseButton type="button" className="btn btn-primary" title="Sync">
            </BaseButton> -->
          </div>
        </div>

      </div>


      <div class="table-responsive mt-2">
        <table class="table table-hover">
          <thead class="table-light ">
            <tr>
              <th class="align-middle">No</th>
              <th class="align-middle">Nomor Kontrak</th>
              <th class="align-middle">Tipe Kontrak</th>
              <th class="align-middle">Nama Kontrak</th>
              <th class="align-middle" style="width: 300px;">Pelanggan</th>
              <th class="text-center align-middle">Status</th>
              <th class="text-center align-middle">Jumlah</th>
              <th class="align-middle">Tgl Mulai</th>
              <th class="align-middle">Tgl Akhir</th>
              <th class="align-middle">Deskripsi</th>
              <th class="align-middle">Action</th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="listOracleContract.loading">
              <td colspan="11" class="text-center">Loading...</td>
            </tr>

            <tr v-else-if="!listOracleContract.loading && listOracleContract.data.length"
              v-for="(item, index) in listOracleContract.data" :key="item?.Id">
              <td>{{ index + 1 }}</td>
              <td>{{ item?.ContractNumber || "-" }}</td>
              <td>{{ item?.ContractTypeName || "-" }}</td>
              <td>{{ item?.Cognomen || "-" }}</td>
              <td>{{ item?.PartyName || "-" }}</td>
              <td class="text-center">
                <span class="badge rounded-pill text-capitalize" :class="statusClass(item?.StsCode)">
                  {{ item?.StsCode || "Tidak Diketahui" }}
                </span>
              </td>
              <td class="text-center"> {{ item?.LedgerCurrency }} {{ item?.EstimatedAmount }}</td>
              <td>{{ formatDate(item?.StartDate) || "-" }}</td>
              <td>{{ formatDate(item?.EndDate) || "-" }}</td>
              <td>{{ item?.Description || "-" }}</td>
              <td>
                <div class="d-flex align-items-center col-actions">
                  <BaseButton v-if="isSelected(item?.ContractNumber)"
                    @click="handleSelectedDataOracle({ contract: item })" className="btn btn-sm btn-success me-1"
                    data-bs-toggle="tooltip" data-bs-placement="top" data-bs-original-title="Dipilih" title="Dipilih">
                    <tabler-icon class="me-25" icon="ChecksIcon" size="24" />
                  </BaseButton>

                  <BaseButton v-else @click="handleSelectedDataOracle({ contract: item })"
                    className="btn btn-sm btn-primary me-1" data-bs-toggle="tooltip" data-bs-placement="top"
                    data-bs-original-title="Pilih" title="Pilih">
                    <tabler-icon class="me-25" icon="CheckIcon" size="24" />
                  </BaseButton>
                </div>
              </td>
            </tr>

            <tr v-else>
              <td colspan="11" class="text-center">Tidak ada Data ditemukan</td>
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
  name: 'ModalSyncDataKontrak',
  components: {
    BaseModal,
    BaseButton,
    InputSearch
  },
  props: {
    no_kontrak: {
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
      input_no_kontrak: "",
      listOracleContract: {
        loading: false,
        data: []
      }
    }
  },
  computed: {
    formatDate() {
      return value => {
        return formatDateMoments(value)
      }
    },
    syncedContract() {
      return this.$store.state.pengajuanPenyimpanan.ktk.syncedContract;
    },
    isSelected() {
      return value => {
        if (this.syncedContract?.ContractNumber == value) {
          return true;
        } else {
          return false;
        }
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
    }
  },

  methods: {
    async getListOracleContractSync({ contract_number }) {
      try {
        this.listOracleContract.loading = true;
        const response =
          await PengajuanPenyimpananNetwork.getListOracleContractSync({
            contract_number,
          });

        if (response) {
          this.listOracleContract.loading = false;
          this.listOracleContract.data = response?.data?.items;
        }
      } catch (error) {
        this.listOracleContract.data = [];
        this.listOracleContract.loading = false;
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },

    async handleSelectedDataOracle({ contract }) {
      this.$store.commit("pengajuanPenyimpanan/SET_KTK_SYNCED_CONTRACT", contract);

      this.$emit('handle-set-input-parent', { contract_number: contract?.ContractNumber })

      document
        .getElementById("close_button_modal_sync_data_kontrak")
        .click();
    }
  },

  watch: {
    no_kontrak(value) {
      if (value) {
        const stringValue = value.toString();
        if (stringValue.length >= 17) {
          this.input_no_kontrak = stringValue;
        }
      }
    },

    input_no_kontrak(value) {
      if (value) {
        this.getListOracleContractSync({
          contract_number: value
        })
      }
    }
  }
}
</script>


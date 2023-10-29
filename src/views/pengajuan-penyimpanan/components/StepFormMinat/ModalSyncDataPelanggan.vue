<template>
  <BaseModal
    :open="isShowModal"
    classNameModal="modal-xl"
    id="sync_data_pelanggan"
    :showFooter="false"
    :order="1"
  >
    <h3 class="text-center mb-1">Sinkronisasi Data Pelanggan</h3>
    <p class="text-center">
      Sinkronisasikan Data Oracle Pelanggan ke dalam pengajuan
    </p>

    <div class="row mt-2">
      <div class="col-12 col-md-4">
        <label class="form-label" for="search-type">Cari Berdasarkan</label>

        <select
          id="search-type"
          name="search-type"
          class="form-select"
          @change="handleChangeSearchType"
          :value="searchType"
          tabindex="1"
        >
          <option value="">Pilih Tipe Pencarian</option>
          <option value="npwp">NPWP</option>
          <option value="account_number">No Akun</option>
          <option value="customer_name">Nama Customer</option>
        </select>
      </div>

      <div v-if="searchType == 'npwp'" class="col-12 col-md-4">
        <label class="form-label" for="npwp-input">Masukkan No NPWP</label>

        <InputSearchWithMaska
          id="npwp-input"
          class="form-control"
          placeholder="Contoh : 10.100.100.1-100.000"
          dataMaska="##.###.###.#-###.####"
          v-model="input_no_npwp"
        />
      </div>

      <div v-else-if="searchType == 'account_number'" class="col-12 col-md-4">
        <label class="form-label" for="account_number-input">No Akun</label>

        <InputSearch
          type="search"
          id="account_number-input"
          class="form-control"
          placeholder="Contoh : 10"
          v-model="input_account_number"
        />
      </div>

      <div v-else-if="searchType == 'customer_name'" class="col-12 col-md-4">
        <label class="form-label" for="customer_name-input"
          >Nama Customer</label
        >

        <InputSearch
          type="search"
          id="customer_name-input"
          class="form-control"
          placeholder="Contoh : PT JIEP ECO GREEN"
          v-model="input_customer_name"
        />
      </div>
    </div>

    <div class="table-responsive mt-2">
      <table class="table table-hover">
        <thead class="table-light">
          <tr>
            <th>No</th>
            <th>Customer ID</th>
            <th>Nama</th>
            <th>No NPWP</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="listOracleAccount.loading">
            <td colspan="7" class="text-center">Loading...</td>
          </tr>

          <tr
            v-else-if="
              !listOracleAccount.loading && listOracleAccount.data.length
            "
            v-for="(item, index) in listOracleAccount.data"
            :key="item.AccountId"
          >
            <td>{{ index + 1 }}</td>
            <td>{{ item.CustomerId }}</td>
            <td>{{ item.CustomerName }}</td>
            <td>{{ item.TaxpayerIdentificationNumber }}</td>
            <td>
              <div class="d-flex align-items-center col-actions">
                <BaseButton
                  v-if="isSelected(item.CustomerId)"
                  @click="
                    handleSelectDataOracle({
                      pelanggan_id: pelanggan_id,
                      accountId: item.AccountId,
                    })
                  "
                  :disabled="isLoadingSubmit"
                  :isLoading="isLoadingSubmit"
                  className="btn btn-sm btn-success me-1"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  data-bs-original-title="Tersinkronisasi"
                  title="Tersinkronisasi"
                >
                  <tabler-icon class="me-25" icon="ChecksIcon" size="24" />
                </BaseButton>

                <BaseButton
                  v-else
                  @click="
                    handleSelectDataOracle({
                      pelanggan_id: pelanggan_id,
                      accountId: item.AccountId,
                    })
                  "
                  :disabled="isLoadingSubmit"
                  :isLoading="isLoadingSubmit"
                  className="btn btn-sm btn-primary me-1"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  data-bs-original-title="Pilih"
                  title="Pilih"
                >
                  <tabler-icon class="me-25" icon="CheckIcon" size="24" />
                </BaseButton>
              </div>
            </td>
          </tr>

          <tr v-else>
            <td colspan="7" class="text-center">Tidak ada Data ditemukan</td>
          </tr>
        </tbody>
      </table>
    </div>
  </BaseModal>
</template>

<script>
import PengajuanPenyimpananNetwork from "@/network/lib/pengajuan-penyimpanan";

import BaseModal from "@/components/Modal/BaseModal.vue";
import BaseButton from "@/components/Button/BaseButton.vue";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage.vue";
import InputSearchWithMaska from "@/components/InputSearch/InputSearchWithMaska.vue";
import InputSearch from "@/components/InputSearch/InputSearch.vue";

export default {
  name: "ModalSyncDataPelanggan",
  components: {
    BaseModal,
    BaseButton,
    ErrorMessage,
    InputSearchWithMaska,
    InputSearch,
  },
  props: {
    no_npwp: {
      type: [String, Number],
    },
    pelanggan_id: {
      type: [String, Number],
    },
    selected_customer_id: {
      type: [String, Number],
    },
    isShowModal: {
      type: Boolean,
      default: false,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isLoadingSubmit: false,
      searchType: "",
      input_account_number: "",
      input_customer_name: "",
      input_no_npwp: {
        masked: "",
        unmasked: "",
        completed: false,
      },
      listOracleAccount: {
        loading: false,
        data: [],
      },
    };
  },

  computed: {
    isSelected() {
      return (value) => {
        if (this.selected_customer_id == value) {
          return true;
        } else {
          return false;
        }
      };
    },

    changeListOracleAccountSync() {
      return [
        this.input_no_npwp.masked,
        this.input_account_number,
        this.input_customer_name,
      ];
    },
  },

  methods: {
    handleChangeSearchType(event) {
      this.searchType = event.target.value;
      this.input_no_npwp.masked = "";
      this.input_account_number = "";
      this.input_customer_name = "";
    },

    async getListOracleAccountSync({ no_npwp, account_number, customer_name }) {
      try {
        this.listOracleAccount.loading = true;
        const response =
          await PengajuanPenyimpananNetwork.getListOracleAccountSync({
            no_npwp,
            account_number,
            customer_name,
          });

        if (response) {
          this.listOracleAccount.loading = false;
          this.listOracleAccount.data = response?.data?.items;
        }
      } catch (error) {
        this.listOracleAccount.data = [];
        this.listOracleAccount.loading = false;
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },

    async handleSelectDataOracle({ pelanggan_id, accountId }) {
      let loader = this.$loading.show();
      try {
        this.isLoadingSubmit = true;

        const response =
          await PengajuanPenyimpananNetwork.getSelectedOracleAccountById({
            pelanggan_id,
            accountId,
          });

        if (response) {
          this.isLoadingSubmit = false;
          loader.hide();

          this.$emit("handle-refresh");

          document
            .getElementById("close_button_modal_sync_data_pelanggan")
            .click();
        }
      } catch (error) {
        loader.hide();
        this.isLoadingSubmit = false;
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },
  },

  watch: {
    no_npwp(value) {
      if (value) {
        const stringValue = value.toString();
        if (stringValue.length >= 20) {
          this.searchType = "npwp";
          this.input_no_npwp.masked = stringValue;
        }
      }
    },

    changeListOracleAccountSync() {
      if (this.input_no_npwp.masked) {
        this.getListOracleAccountSync({
          no_npwp: this.input_no_npwp.masked,
        });
      } else if (this.input_account_number) {
        this.getListOracleAccountSync({
          account_number: this.input_account_number,
        });
      } else if (this.input_customer_name) {
        this.getListOracleAccountSync({
          customer_name: this.input_customer_name,
        });
      }
    },
  },
};
</script>

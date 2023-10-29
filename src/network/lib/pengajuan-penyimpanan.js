import axiosClient from "@/network/axiosClient";

export default {
  getListPengajuanPenyimpanan({ limit = 10, offset = 0, search = "" }) {
    return axiosClient.get(
      `penyimpanan/list?limit=${limit}&offset=${offset}&search=${search}`
    );
  },

  getPengajuanPenyimpananById({ id }) {
    return axiosClient.get(`penyimpanan/detail/${id}`);
  },

  getListFlowPenyimpanan() {
    return axiosClient.get("penyimpanan/list/flow");
  },

  getSelectedAccountOracleById({ id, account }) {
    return axiosClient.get(
      `penyimpanan/selected-account/${id}/${account}?onlyData=true`
    );
  },

  getListOracleAccountSync({ no_npwp, account_number, customer_name }) {
    return axiosClient.get(
      `oracle/customer/list?onlyData=true&expand=all${
        no_npwp ? `&TaxpayerIdentificationNumber=${no_npwp}` : ""
      }${account_number ? `&AccountNumber=${account_number}` : ""}${
        customer_name ? `&CustomerName=${customer_name}` : ""
      }`
    );
  },

  getSelectedOracleAccountById({ pelanggan_id, accountId }) {
    return axiosClient.get(
      `penyimpanan/selected-account/${pelanggan_id}/${accountId}?onlyData=true`
    );
  },

  getListOracleContractSync({ contract_number }) {
    return axiosClient.get(
      `oracle/contract/list?ContractNumber=${contract_number}`
    );
  },

  getListOracleTransactionSync({ transaction_number }) {
    return axiosClient.get(
      `oracle/draft-invoice/list?TransactionNumber=${transaction_number}&expand=all`
    );
  },

  // Form Minat Pelanggan
  saveFormPengajuanMinat({ id }) {
    return axiosClient.put(`penyimpanan/pengajuan-minat/${id}`);
  },

  // Perhitungan Box
  savePerhitunganBox({ id, box }) {
    return axiosClient.put(`penyimpanan/perhitungan-box/${id}`, { box });
  },

  // LOC Kontrak
  saveLOCKontrak({ id, pelanggan_id, contract_number }) {
    return axiosClient.put(`penyimpanan/loc-kontrak/${id}`, {
      pelanggan_id,
      contract_number,
    });
  },

  // Draft Invoice
  saveDraftInvoice({ id, invoice_number, customer_transaction_id }) {
    return axiosClient.put(`penyimpanan/draft-invoice/${id}`, {
      invoice_number,
      customer_transaction_id,
    });
  },
};

import axiosClient from "@/network/axiosClient";

export default {
  getListLayanan({
    limit = 10,
    offset = 0,
    search = "",
    order = "DESC",
    order_key = "created_at",
  }) {
    return axiosClient.get(
      `layanan/list?limit=${limit}&offset=${offset}&search=${search}&order=${order}&order_key=${order_key}`
    );
  },
  getLayananById({ id }) {
    return axiosClient.get(`layanan/row/${id}`);
  },
  createLayanan({ layanan, tipe, status }) {
    return axiosClient.post("layanan/create", {
      layanan,
      tipe,
      status,
    });
  },
  editLayanan({ id, layanan, tipe, status }) {
    return axiosClient.put(`layanan/edit/${id}`, {
      layanan,
      tipe,
      status,
    });
  },
  deleteLayanan({ id }) {
    return axiosClient.delete(`layanan/remove/${id}`);
  },

  getSyncOracleListCatalog() {
    return axiosClient.get(`oracle/catalogs/list?onlyData=true`);
  },

  getSyncOracleListOrganization() {
    return axiosClient.get(`oracle/organisasi/list?onlyData=true`);
  },

  getSyncOracleListItemByCatalog({ id }) {
    return axiosClient.get(`/oracle/items/catalogs/${id}?onlyData=false`);
  },

  editSyncOracle(id, payload) {
    return axiosClient.put(`layanan/sync/edit/${id}`, payload);
  },

  getSyncOracleListItemByCatalogWithFilter({ CatalogId, OrganizationId }) {
    return axiosClient.get(
      `oracle/items/catalogs?params=CatalogId=${CatalogId};OrganizationId=${OrganizationId}`
    );
  },
  getSyncOracleDetailItemByNumber({ ItemId, OrganizationId }) {
    return axiosClient.get(
      `oracle/items/detail?ItemId=${ItemId}&OrganizationId=${OrganizationId}`
    );
  },
};

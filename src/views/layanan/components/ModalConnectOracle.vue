<template>
  <BaseModal
    :open="isShowModal"
    classNameModal="modal-xl"
    id="modal_connect_oracle"
    :showFooter="false"
    :order="1"
  >
    <h3 class="text-center mb-1">
      Sinkronisasi Layanan Oracle Berdasarkan Katalog dan Organisasi
    </h3>
    <p class="text-center">
      Sinkronisasikan Layanan Oracle kedalam Layanan Aplikasi
    </p>

    <p class="text-center">
      <b> Layanan yang Sinkronisasikan : {{ itemSelected?.selectedLayanan }}</b>
    </p>

    <div class="row mb-2 mt-2">
      <div class="col-4">
        <label class="form-label" for="organization">Organisasi</label>

        <select
          id="organization"
          name="organization"
          class="form-select"
          :disabled="listByOrganization.loading"
          v-model="organizationSelected"
          tabindex="2"
        >
          <option value="">
            {{ listByOrganization.loading ? "Loading..." : "Pilih Items" }}
          </option>
          <option
            v-for="item in listByOrganization.data"
            :key="`${item.OrganizationId}`"
            :value="item.OrganizationId"
          >
            {{ item.OrganizationName }} ({{ item?.OrganizationCode }})
          </option>
        </select>
      </div>

      <div class="col-md-4">
        <label class="form-label" for="katalog">Katalog</label>

        <select
          id="katalog"
          name="katalog"
          class="form-select"
          v-model="catalogSelected"
          :disabled="listByCatalog.loading"
          tabindex="1"
        >
          <option value="">
            {{ listByCatalog.loading ? "Loading..." : "Pilih Katalog" }}
          </option>
          <option
            v-for="catalog in listByCatalog.data"
            :key="`${catalog.CatalogId}`"
            :value="catalog.CatalogId"
          >
            {{ catalog.CatalogName }} ({{ catalog.CatalogCode }})
          </option>
        </select>
      </div>
    </div>

    <div class="table-responsive mt-1">
      <v-table class="table table-hover" :data="list.data">
        <thead class="table-light" slot="head">
          <tr>
            <th style="width: 1%">No</th>
            <th class="text-left">Item</th>
            <th class="text-left">Description</th>
            <th class="text-left">Kode Organisasi</th>
            <th style="width: 15%">Actions</th>
          </tr>
        </thead>
        <tbody slot="body">
          <tr v-if="!catalogSelected || !organizationSelected">
            <td colspan="5" class="text-center">
              Silahkan Pilih Organisasi dan Katalog Terlebih Dahulu
            </td>
          </tr>
          <tr
            v-else-if="
              list.isLoading && catalogSelected && organizationSelected
            "
          >
            <td colspan="5" class="text-center">Loading...</td>
          </tr>
          <tr
            v-else-if="
              !list.isLoading &&
              catalogSelected &&
              organizationSelected &&
              list.data.length === 0
            "
          >
            <td colspan="5" class="text-center">Data tidak tersedia</td>
          </tr>
          <tr
            v-else-if="
              !list.isLoading &&
              list.data.length &&
              catalogSelected &&
              organizationSelected
            "
            v-for="(item, index) in list.data"
            :key="item.id"
          >
            <td>{{ index + 1 }}</td>
            <td>{{ item.Item }}</td>
            <td>{{ item.ItemDescription }}</td>
            <td>{{ item.OrganizationCode }}</td>
            <td>
              <BaseButton
                v-if="
                  !sync.isLoading &&
                  parseInt(sync.id) === item.ItemId &&
                  parseInt(sync.organization) === item?.OrganizationId
                "
                className="btn btn-success"
                :isDisabled="true"
                title="Sync"
              >
                <template name="icon-left">
                  <tabler-icon icon="ChecksIcon"></tabler-icon>
                </template>
              </BaseButton>

              <BaseButton
                v-else
                :className="
                  sync.isLoading &&
                  parseInt(sync.id) != item.ItemId &&
                  parseInt(sync.organization) == item?.OrganizationId
                    ? 'btn btn-dark'
                    : 'btn btn-primary'
                "
                :isDisabled="sync.isLoading"
                :isLoading="
                  sync.isLoading &&
                  parseInt(sync.id) === item.ItemId &&
                  parseInt(sync.organization) == item?.OrganizationId
                    ? true
                    : false
                "
                @click="handleSyncLayanan(item)"
                :title="
                  sync.isLoading &&
                  parseInt(sync.id) === item.ItemId &&
                  parseInt(sync.organization) == item?.OrganizationId
                    ? 'Loading...'
                    : 'Pilih'
                "
              >
                <template name="icon-left">
                  <tabler-icon icon="CheckIcon"></tabler-icon>
                </template>
              </BaseButton>
            </td>
          </tr>
        </tbody>
      </v-table>
    </div>
  </BaseModal>
</template>

<script>
import BaseModal from "@/components/Modal/BaseModal.vue";
import BaseButton from "@/components/Button/BaseButton.vue";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage.vue";
import LayananNetwork from "@/network/lib/layanan";

export default {
  name: "ModalConnectOracle",
  components: {
    ErrorMessage,
    BaseModal,
    BaseButton,
  },
  props: {
    idLayanan: {
      type: [String, Number],
    },
    isShowModal: {
      type: Boolean,
      default: false,
    },
    itemSelected: {
      type: Object,
      default: null,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      list: {
        isLoading: false,
        data: [],
      },
      catalogSelected: "",
      organizationSelected: "",
      sync: {
        id: "",
        organization: "",
      },
      listByCatalog: {
        loading: true,
        data: [],
      },
      listByOrganization: {
        loading: false,
        data: [],
      },
    };
  },

  computed: {
    filterSelected() {
      return [this.catalogSelected, this.organizationSelected];
    },
  },
  methods: {
    async getListCatalog() {
      this.listByCatalog.loading = true;
      await LayananNetwork.getSyncOracleListCatalog()
        .then((response) => {
          const { data } = response;
          this.listByCatalog.loading = false;
          this.listByCatalog.data = data?.items;
        })
        .catch((error) => {
          this.listByCatalog.loading = false;
          this.$store.dispatch("toast/showToastError", {
            error: error,
          });
        });
    },

    async getListOrganization() {
      this.listByOrganization.loading = true;
      await LayananNetwork.getSyncOracleListOrganization()
        .then((response) => {
          const { data } = response;
          this.listByOrganization.loading = false;
          this.listByOrganization.data = data?.items;
        })
        .catch((error) => {
          this.listByOrganization.loading = false;
          this.$store.dispatch("toast/showToastError", {
            error: error,
          });
        });
    },

    async handleSyncLayanan(item) {
      this.sync.id = item?.ItemId;
      this.sync.isLoading = true;

      try {
        const response = await LayananNetwork.editSyncOracle(
          this.itemSelected.id,
          item
        );

        if (response) {
          this.sync.isLoading = false;

          this.getSyncOracleListItemByCatalogWithFilter({
            CatalogId: this.catalogSelected,
            OrganizationId: this.organizationSelected,
          });

          this.$emit("refresh");
        }
      } catch (error) {
        this.sync.isLoading = false;
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },

    async getSyncOracleListItemByCatalogWithFilter({
      CatalogId,
      OrganizationId,
    }) {
      try {
        this.list.isLoading = true;

        const response =
          await LayananNetwork.getSyncOracleListItemByCatalogWithFilter({
            CatalogId,
            OrganizationId,
          });

        if (response) {
          this.list.isLoading = false;
          this.list.data = response?.data?.items;
        }
      } catch (error) {
        this.list.isLoading = false;
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },
  },
  watch: {
    filterSelected(value) {
      this.getSyncOracleListItemByCatalogWithFilter({
        CatalogId: value[0],
        OrganizationId: value[1],
      });
    },

    itemSelected(value) {
      this.catalogSelected = value.oracleCatalogId || "";
      this.organizationSelected = value?.oracleOrganizationId || "";
      this.sync.id = value.oracleItemId || "";
      this.sync.organization = value.oracleOrganizationId || "";
    },
  },

  mounted() {
    this.getListCatalog();
    this.getListOrganization();
  },
};
</script>

<style scoped>
.text-small {
  font-size: 12px;
}
</style>

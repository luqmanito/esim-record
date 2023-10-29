<template>
  <div id="fmp" role="tabpanel" aria-labelledby="fmp_trigger">
    <div class="content-header text-center">
      <h5 class="mb-0">Form Minat Pelanggan</h5>
      <small class="text-muted">Data Form yang sudah diisi oleh pelanggan</small>
    </div>

    <div class="content-body">
      <template v-if="dataFormMinat?.no_npwp && dataFormMinat?.tax_payer_identification_number">
        <div v-if="dataFormMinat?.no_npwp != dataFormMinat?.tax_payer_identification_number"
          class="alert alert-warning alert-validation-msg alert-dismissible mt-3" role="alert">
          <div class="alert-body d-flex align-items-center">
            <tabler-icon icon="InfoCircleIcon" class="me-1 text-warning" />
            <span class="text-dark"><strong class="text-warning">Perhatian</strong>. No NPWP yang anda isi berbeda dengan
              data yang disimpan di Oracle.</span>
          </div>
          <button @click="handleCloseAlert" type="button" class="btn-close" data-bs-dismiss="alert"
            aria-label="Close"></button>
        </div>
      </template>

      <Spinner v-if="isLoading" className="mt-2" />

      <div v-else class="row" :class="[isShowAlert ? 'mt-0' : 'mt-3']">
        <div class="col-12 col-md-7">
          <div class="rounded border p-2 mb-2">
            <div>
              <small class="fw-bolder card-text text-uppercase ms-2 text-primary">Informasi Akun</small>
              <hr />
              <div class="table-responsive">
                <table class="table">
                  <tbody>
                    <tr>
                      <td class="fw-bolder width-30-percentage">Nama PIC</td>
                      <td class="width-70-percentage">
                        {{ dataFormMinat?.nama }}
                      </td>
                    </tr>
                    <tr v-if="dataFormMinat?.no_ktp">
                      <td class="fw-bolder">No KTP</td>
                      <td>{{ dataFormMinat?.no_ktp }}</td>
                    </tr>
                    <tr v-if="dataFormMinat?.no_npwp">
                      <td class="fw-bolder">No NPWP</td>
                      <td>{{ dataFormMinat?.no_npwp }}</td>
                    </tr>
                    <tr>
                      <td class="fw-bolder">No Telepon</td>
                      <td>{{ formatPhone(dataFormMinat?.tlp) }}</td>
                    </tr>
                    <tr>
                      <td class="fw-bolder">Email</td>
                      <td>
                        {{ dataFormMinat?.email }}
                        <span class="badge rounded-pill text-capitalize" :class="
                          statusEmailClass(dataFormMinat?.user?.verified)
                        ">
                          {{ statusEmail(dataFormMinat?.user?.verified) }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="rounded border p-2 mb-2">
            <small class="fw-bolder card-text text-uppercase ms-2 text-primary">Informasi Perusahaan</small>
            <hr />
            <div class="table-responsive mb-2">
              <table class="table">
                <tbody>
                  <tr>
                    <td class="fw-bolder width-30-percentage">
                      Nama Perusahaan
                    </td>
                    <td class="width-70-percentage">
                      {{ dataFormMinat?.nama || "-" }}
                    </td>
                  </tr>
                  <tr>
                    <td class="fw-bolder">Office Type</td>
                    <td>
                      {{ officeType(dataFormMinat?.type) }}
                    </td>
                  </tr>
                  <tr>
                    <td class="fw-bolder">Email</td>
                    <td>{{ dataFormMinat?.email || "-" }}</td>
                  </tr>
                  <tr>
                    <td class="fw-bolder">Kota</td>
                    <td class="text-capitalize">
                      {{ dataFormMinat?.kabkot?.nama || "-" }}
                    </td>
                  </tr>
                  <tr>
                    <td class="fw-bolder">Provinsi</td>
                    <td>{{ dataFormMinat?.provinsi?.nama || "-" }}</td>
                  </tr>
                  <tr>
                    <td class="fw-bolder">Blok</td>
                    <td>{{ dataFormMinat?.blok || "-" }}</td>
                  </tr>
                  <tr>
                    <td class="fw-bolder">Kavling</td>
                    <td>{{ dataFormMinat?.kavling || "-" }}</td>
                  </tr>
                  <tr>
                    <td class="fw-bolder">Kode Pos</td>
                    <td>{{ dataFormMinat?.kodepos || "-" }}</td>
                  </tr>
                  <tr>
                    <td class="fw-bolder">Alamat</td>
                    <td>{{ dataFormMinat?.alamat || "-" }}</td>
                  </tr>
                  <tr v-if="dataFormMinat?.file_ktp">
                    <td class="fw-bolder">File KTP</td>
                    <td>
                      <vue-dropzone ref="dropzoneFileKTP" id="file_ktp" :options="vueDropzoneOptions"
                        :useCustomSlot="true" :duplicateCheck="true">
                        <div>
                          <h3 class="dropzone-custom-title">File KTP</h3>
                        </div>
                      </vue-dropzone>
                    </td>
                  </tr>
                  <tr v-if="dataFormMinat?.file_npwp">
                    <td class="fw-bolder">File NPWP</td>
                    <td>
                      <vue-dropzone ref="dropzoneFileNPWP" id="file_npwp" :options="vueDropzoneOptions"
                        :useCustomSlot="true" :duplicateCheck="true">
                        <div>
                          <h3 class="dropzone-custom-title">File NPWP</h3>
                        </div>
                      </vue-dropzone>
                    </td>
                  </tr>

                  <tr>
                    <td class="fw-bolder">Status</td>
                    <td>
                      <span class="badge rounded-pill ms-1" :class="statusClass(dataFormMinat?.oracle_last_sync)">
                        <span class="text-capitalize">
                          {{
                            dataFormMinat?.oracle_last_sync
                            ? "Tersinkronisasi"
                            : "Belum Tersinkronisasi"
                          }}
                        </span>
                        {{ dataFormMinat?.oracle_last_sync ?
                          ` - ${formatDate({
                            value: dataFormMinat?.oracle_last_sync,
                            format: "D MMMM YYYY, h:mm:ss a",
                          })}` : ""
                        }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-5">
          <div class="rounded border p-2 mb-1">
            <small class="fw-bolder card-text text-uppercase text-primary">Sinkronisasi Data Pelanggan</small>
            <hr />
            <div class="row">
              <div class="input-group">
                <InputSearchWithMaska class="form-control" placeholder="Contoh : 10.100.100.1-100.000"
                  dataMaska="##.###.###.#-###.####" v-model="no_npwp" />
                <BaseButton :disabled="!isValidNPWP" type="button" className="btn btn-primary" title="Sync"
                  data-bs-toggle="modal" data-bs-target="#sync_data_pelanggan">
                </BaseButton>
              </div>
            </div>
          </div>

          <div v-if="dataFormMinat?.oracle_last_sync" class="rounded border p-2 mb-5">
            <small class="fw-bolder card-text text-uppercase ms-2 text-primary">Data Oracle</small>
            <hr />
            <div class="table-responsive">
              <table class="table">
                <tbody>
                  <tr>
                    <td class="fw-bolder" style="width: 30%">Account ID</td>
                    <td style="width: 70%">
                      {{ dataFormMinat?.oracle_account_id || "-" }}
                    </td>
                  </tr>
                  <tr>
                    <td class="fw-bolder">Account Number</td>
                    <td>{{ dataFormMinat?.oracle_account_number || "-" }}</td>
                  </tr>
                  <tr>
                    <td class="fw-bolder">Customer Name</td>
                    <td>{{ dataFormMinat?.oracle_customer_name || "-" }}</td>
                  </tr>
                  <tr>
                    <td class="fw-bolder">Customer ID</td>
                    <td>
                      {{ dataFormMinat?.oracle_customer_customer_id || "-" }}
                    </td>
                  </tr>
                  <tr>
                    <td class="fw-bolder">Tax Payer ID</td>
                    <td>
                      {{
                        dataFormMinat?.tax_payer_identification_number || "-"
                      }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      <div class="row py-3">
        <div class="col-lg-6 text-sm-center text-lg-start mb-sm-2 mb-lg-0">
          <!-- <BaseButton
              type="button"
              className="btn btn-outline-primary"
              title="Sebelumnya"
            >
              <template #icon-left>
                <tabler-icon icon="ChevronLeftIcon" />
              </template>
            </BaseButton> -->
        </div>

        <div class="col-lg-6 text-sm-center text-lg-end mb-sm-2 mb-lg-0">
          <BaseButton v-if="currentStep?.penyimpananflow?.status == 'progress'"
            :isDisabled="!dataFormMinat?.oracle_last_sync"
            @click="handleClickAction({ type: 'save', urutan: currentStep?.urutan })" type="button"
            className="btn btn-primary" title="Simpan">
            <template #icon-right>
              <tabler-icon icon="DeviceFloppyIcon" />
            </template>
          </BaseButton>

          <BaseButton v-else :isDisabled="!dataFormMinat?.oracle_last_sync"
            @click="handleClickAction({ type: 'next', urutan: currentStep?.urutan + 1 })" type="button"
            className="btn btn-primary" title="Selanjutnya">
            <template #icon-right>
              <tabler-icon icon="ChevronRightIcon" />
            </template>
          </BaseButton>
        </div>
      </div>
    </div>

    <ModalSyncDataPelanggan :no_npwp="no_npwp.masked" :pelanggan_id="dataFormMinat?.id"
      :selected_customer_id="dataFormMinat?.oracle_customer_customer_id" @handle-refresh="handleRefresh" />
  </div>
</template>

<script>
import Spinner from "@/components/Loading/Spinner.vue";
import BaseButton from "@/components/Button/BaseButton.vue";
import InputSearchWithMaska from "@/components/InputSearch/InputSearchWithMaska.vue";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage.vue";
import ModalSyncDataPelanggan from "@/views/pengajuan-penyimpanan/components/StepFormMinat/ModalSyncDataPelanggan.vue";

import vue2Dropzone from "vue2-dropzone";
import { options as dropzoneOptions } from "@/utils/vueDropzoneConfig";
import formatPhoneNumber from "@/utils/formatPhoneNumber";
import { formatDateMoments } from "@/utils/momentDateFormat";

export default {
  name: "fmp",
  components: {
    Spinner,
    BaseButton,
    InputSearchWithMaska,
    ErrorMessage,
    vueDropzone: vue2Dropzone,
    ModalSyncDataPelanggan,
  },
  data() {
    return {
      isLoading: false,
      isShowAlert: true,
      no_npwp: {
        masked: "",
        unmasked: "",
        completed: false,
      },
      vueDropzoneOptions: {
        ...dropzoneOptions,
        thumbnailWidth: 200,
        thumbnailHeight: 150,
        maxThumbnailFilesize: 200,
        acceptedFiles: "image/*",
        uploadMultiple: false,
        maxFiles: 1,
        clickable: false,
        addRemoveLinks: false,
      },
    };
  },
  computed: {
    idParams() {
      return this.$route.params?.id;
    },

    currentStep() {
      return this.$store.state.pengajuanPenyimpanan.currentStep;
    },

    appMediaHost() {
      return this.$store.state.appConfig.app.appMediaHost;
    },

    isValidNPWP() {
      if (this.no_npwp.masked.length >= 20) {
        return true;
      } else {
        return false;
      }
    },

    statusEmailClass() {
      return (value) => {
        if (value == 1) {
          return "badge-light-success";
        } else if (value == 0) {
          return "badge-light-danger";
        } else {
          return "badge-light-dark";
        }
      };
    },

    statusEmail() {
      return (value) => {
        if (value == 1) {
          return "Terverifikasi";
        } else if (value == 0) {
          return "Belum Terverifikasi";
        } else {
          return "Tidak Diketahui";
        }
      };
    },

    statusClass() {
      return (value) => {
        if (value) {
          return "badge-light-success";
        } else {
          return "badge-light-danger";
        }
      };
    },

    officeType() {
      return (value) => {
        if (value == "head") {
          return "Head Office";
        } else if (value == "branch") {
          return "Branch Office";
        } else {
          return "Tidak Diketahui";
        }
      };
    },

    dataFormMinat() {
      return this.$store.state.pengajuanPenyimpanan.detail?.pelanggan;
    },

    formatPhone() {
      return (value) => {
        return formatPhoneNumber(value);
      };
    },

    formatDate() {
      return (value) => {
        return formatDateMoments(value?.value, value?.format);
      };
    },
  },
  methods: {
    handleCloseAlert() {
      this.isShowAlert = false
    },

    handleRefresh() {
      this.getPengajuanPenyimpananById();
    },

    handleClickAction({ type, urutan }) {
      this.$emit("handle-click-action", { type, urutan });
    },

    async getPengajuanPenyimpananById() {
      this.isLoading = true;

      try {
        const response = await this.$store.dispatch(
          "pengajuanPenyimpanan/getDetailPengajuanPenyimpanan",
          { id: this.idParams }
        );

        if (response) {
          const data = response?.data;

          this.no_npwp.masked = data?.pelanggan?.no_npwp;

          this.isLoading = false;
        }
      } catch (error) {
        this.isLoading = false;
        this.$store.dispatch("toast/showToastError", {
          error: error,
        });
      }
    },
  },

  mounted() {
    if (this.dataFormMinat?.no_npwp) {
      this.no_npwp.masked = this.dataFormMinat?.no_npwp;
    }

    if (this.dataFormMinat.file_npwp) {
      const url = `${this.appMediaHost}${this.dataFormMinat.file_npwp?.path}`;

      const file = {
        size: this.dataFormMinat?.file_npwp?.size,
        name: this.dataFormMinat?.file_npwp?.filename,
        type: this.dataFormMinat?.file_npwp?.type,
      };

      this.$refs.dropzoneFileNPWP.manuallyAddFile(file, url);
      this.$refs.dropzoneFileNPWP.dropzone.emit("thumbnail", file, url);
      this.$refs.dropzoneFileNPWP.dropzone.emit("complete", file);
    }

    if (this.dataFormMinat.file_ktp) {
      const url = `${this.appMediaHost}${this.dataFormMinat.file_ktp?.path}`;

      const file = {
        size: this.dataFormMinat?.file_ktp?.size,
        name: this.dataFormMinat?.file_ktp?.filename,
        type: this.dataFormMinat?.file_ktp?.type,
      };

      this.$refs.dropzoneFileKTP.manuallyAddFile(file, url);
      this.$refs.dropzoneFileKTP.dropzone.emit("thumbnail", file, url);
      this.$refs.dropzoneFileKTP.dropzone.emit("complete", file);
    }
  },
};
</script>

<style scoped>
.width-70-percentage {
  width: 70%;
}

.width-30-percentage {
  width: 30%;
}

.dropzone {
  min-height: 200px;
}
</style>
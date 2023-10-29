<template>
  <div class="row my-2">
    <div class="content-body">
      <template v-if="dataPelanggan?.no_npwp && dataPelanggan?.tax_payer_identification_number">
        <div v-if="dataPelanggan?.no_npwp != dataPelanggan?.tax_payer_identification_number"
          class="alert alert-warning alert-validation-msg alert-dismissible" role="alert">
          <div class="alert-body d-flex align-items-center">
            <tabler-icon icon="InfoCircleIcon" class="me-1 text-warning" />
            <span class="text-dark"><strong class="text-warning">Perhatian</strong>. No NPWP yang anda isi berbeda dengan
              data yang disimpan di Oracle.</span>
          </div>
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      </template>

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
                    {{ dataPelanggan?.nama }}
                  </td>
                </tr>
                <tr v-if="dataPelanggan?.no_ktp">
                  <td class="fw-bolder">No KTP</td>
                  <td>{{ dataPelanggan?.no_ktp }}</td>
                </tr>
                <tr v-if="dataPelanggan?.no_npwp">
                  <td class="fw-bolder">No NPWP</td>
                  <td>{{ dataPelanggan?.no_npwp }}</td>
                </tr>
                <tr>
                  <td class="fw-bolder">No Telepon</td>
                  <td>{{ formatPhone(dataPelanggan?.tlp) }}</td>
                </tr>
                <tr>
                  <td class="fw-bolder">Email</td>
                  <td>
                    {{ dataPelanggan?.email }}
                    <span class="badge rounded-pill text-capitalize" :class="
                      statusEmailClass(dataPelanggan?.user?.verified)
                    ">
                      {{ statusEmail(dataPelanggan?.user?.verified) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="rounded border p-2 mb-2">
        <small class="fw-bolder card-text text-uppercase ms-2 text-primary">Informasi Pelanggan</small>
        <hr />

        <div class="table-responsive">
          <table class="table">
            <tbody>
              <tr>
                <td class="fw-bolder width-30-percentage">Nama Pelanggan</td>
                <td class="width-70-percentage">
                  {{ dataPelanggan?.nama || "-" }}
                </td>
              </tr>
              <tr>
                <td class="fw-bolder">Office Type</td>
                <td>
                  {{ officeType(dataPelanggan?.type) }}
                </td>
              </tr>
              <tr>
                <td class="fw-bolder">Email</td>
                <td>{{ dataPelanggan?.email || "-" }}</td>
              </tr>
              <tr>
                <td class="fw-bolder">Kota</td>
                <td class="text-capitalize">
                  {{ dataPelanggan?.kabkot?.nama || "-" }}
                </td>
              </tr>
              <tr>
                <td class="fw-bolder">Provinsi</td>
                <td>{{ dataPelanggan?.provinsi?.nama || "-" }}</td>
              </tr>
              <tr>
                <td class="fw-bolder">Blok</td>
                <td>{{ dataPelanggan?.blok || "-" }}</td>
              </tr>
              <tr>
                <td class="fw-bolder">Kavling</td>
                <td>{{ dataPelanggan?.kavling || "-" }}</td>
              </tr>
              <tr>
                <td class="fw-bolder">Kode Pos</td>
                <td>{{ dataPelanggan?.kodepos || "-" }}</td>
              </tr>
              <tr>
                <td class="fw-bolder">Alamat</td>
                <td>{{ dataPelanggan?.alamat || "-" }}</td>
              </tr>
              <tr v-if="dataPelanggan?.file_ktp">
                <td class="fw-bolder">File KTP</td>
                <td>
                  <vue-dropzone ref="dropzoneFileKTP" id="file_ktp" :options="vueDropzoneOptions" :useCustomSlot="true"
                    :duplicateCheck="true">
                    <div>
                      <h3 class="dropzone-custom-title">File KTP</h3>
                    </div>
                  </vue-dropzone>
                </td>
              </tr>
              <tr v-if="dataPelanggan?.file_npwp">
                <td class="fw-bolder">File NPWP</td>
                <td>
                  <vue-dropzone ref="dropzoneFileNPWP" id="file_npwp" :options="vueDropzoneOptions" :useCustomSlot="true"
                    :duplicateCheck="true">
                    <div>
                      <h3 class="dropzone-custom-title">File NPWP</h3>
                    </div>
                  </vue-dropzone>
                </td>
              </tr>

              <tr>
                <td class="fw-bolder">Status</td>
                <td>
                  <span class="badge rounded-pill ms-1" :class="statusClass(dataPelanggan?.oracle_last_sync)">
                    <span class="text-capitalize">
                      {{
                        dataPelanggan?.oracle_last_sync
                        ? "Tersinkronisasi"
                        : "Belum Tersinkronisasi"
                      }}
                    </span>

                    {{ dataPelanggan?.oracle_last_sync ?
                      ` - ${formatDate({
                        value: dataPelanggan?.oracle_last_sync,
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

      <div v-if="dataPelanggan?.oracle_last_sync" class="rounded border p-2 mb-5">
        <small class="fw-bolder card-text text-uppercase ms-2 text-primary">Data Oracle</small>
        <hr />
        <div class="table-responsive">
          <table class="table">
            <tbody>
              <tr>
                <td class="fw-bolder" style="width: 30%">Account ID</td>
                <td style="width: 70%">
                  {{ dataPelanggan?.oracle_account_id || "-" }}
                </td>
              </tr>
              <tr>
                <td class="fw-bolder">Account Number</td>
                <td>{{ dataPelanggan?.oracle_account_number || "-" }}</td>
              </tr>
              <tr>
                <td class="fw-bolder">Customer Name</td>
                <td>{{ dataPelanggan?.oracle_customer_name || "-" }}</td>
              </tr>
              <tr>
                <td class="fw-bolder">Customer ID</td>
                <td>
                  {{ dataPelanggan?.oracle_customer_customer_id || "-" }}
                </td>
              </tr>
              <tr>
                <td class="fw-bolder">Tax Payer ID</td>
                <td>
                  {{
                    dataPelanggan?.tax_payer_identification_number || "-"
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="row py-3">
        <div class="col-lg-6 text-sm-center text-lg-start mb-sm-2 mb-lg-0">
          <BaseButton type="button" @click="handleClickAction({ type: 'back', urutan: urutanBack })"
            className="btn btn-outline-primary" title="Sebelumnya">
            <template #icon-left>
              <tabler-icon icon="ChevronLeftIcon" />
            </template>
          </BaseButton>
        </div>

        <div class="col-lg-6 text-sm-center text-lg-end mb-sm-2 mb-lg-0">
          <BaseButton v-if="currentStep?.penyimpananflow?.status == 'done'" :isDisabled="isDisabled"
            @click="handleClickAction({ type: 'next', urutan: urutanNext })" type="button" className="btn btn-primary"
            title="Selanjutnya">
            <template #icon-right>
              <tabler-icon icon="ChevronRightIcon" />
            </template>
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
import formatPhoneNumber from "@/utils/formatPhoneNumber";
import { formatDateMoments } from "@/utils/momentDateFormat";

import vue2Dropzone from "vue2-dropzone";
import { options as dropzoneOptions } from "@/utils/vueDropzoneConfig";

import BaseButton from "@/components/Button/BaseButton.vue";

export default {
  name: "ViewTabDetailPelanggan",
  props: {
    urutanBack: {
      type: [String, Number]
    },
    urutanNext: {
      type: [String, Number]
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  components: {
    BaseButton,
    vueDropzone: vue2Dropzone,
  },
  data() {
    return {
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
    appMediaHost() {
      return this.$store.state.appConfig.app.appMediaHost;
    },
    dataPelanggan() {
      return this.$store.state.pengajuanPenyimpanan.detail?.pelanggan;
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
    currentStep() {
      return this.$store.state.pengajuanPenyimpanan.currentStep;
    },
    savedBox() {
      return this.$store.state.pengajuanPenyimpanan.fjb?.savedBox;
    },
  },
  methods: {
    handleClickAction({ type, urutan }) {
      this.$emit("handle-click-action", { type, urutan });
    },
  },
  mounted() {
    if (this.dataPelanggan.file_npwp) {
      const url = `${this.appMediaHost}${this.dataPelanggan.file_npwp?.path}`;

      const file = {
        size: this.dataPelanggan?.file_npwp?.size,
        name: this.dataPelanggan?.file_npwp?.filename,
        type: this.dataPelanggan?.file_npwp?.type,
      };

      this.$refs.dropzoneFileNPWP.manuallyAddFile(file, url);
      this.$refs.dropzoneFileNPWP.dropzone.emit("thumbnail", file, url);
      this.$refs.dropzoneFileNPWP.dropzone.emit("complete", file);
    }

    if (this.dataPelanggan.file_ktp) {
      const url = `${this.appMediaHost}${this.dataPelanggan.file_ktp?.path}`;

      const file = {
        size: this.dataPelanggan?.file_ktp?.size,
        name: this.dataPelanggan?.file_ktp?.filename,
        type: this.dataPelanggan?.file_ktp?.type,
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
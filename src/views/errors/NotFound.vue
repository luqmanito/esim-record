<template>
  <div class="content-wrapper">
    <div class="content-body">
      <!-- Error page-->
      <div class="misc-wrapper">
        <div class="misc-inner p-2 p-sm-3">
          <div
            class="w-100 d-flex flex-column justify-content-center text-center vh-100"
          >
            <h2 class="mb-1">Halaman Tidak Ditemukan 🕵🏻‍♀️</h2>
            <p class="mb-2">Oops! 😖 Halaman yang anda tuju tidak ditemukan.</p>
            <div>
              <router-link
                class="btn btn-primary mb-2 btn-sm-block waves-effect waves-float waves-light"
                to="/"
              >
                Kembali ke beranda
              </router-link>
            </div>
            <div>
              <img
                class="img-fluid"
                src="/app-assets/images/pages/error.svg"
                alt="Error page"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- / Error page-->
    </div>
  </div>
</template>

<script>
export default {
  name: "NotFound",
};
</script>

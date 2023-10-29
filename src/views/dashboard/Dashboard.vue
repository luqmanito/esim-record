<template>
  <div class="content-wrapper">
    <div class="content-header row">
      <div class="content-header-left col-md-9 col-12 mb-2">
        <BreadCrumb :showHeader="true" />
      </div>
    </div>

    <div class="content-body">
      <!-- Dashboard Ecommerce Starts -->
      <section id="dashboard-ecommerce">
        <div class="row match-height">
        

          <!-- Statistics Card -->
          <div class="col-12">
            <div class="card card-statistics">
              <div class="card-header">
                <h4 class="card-title">Statistics</h4>
                <div class="d-flex align-items-center">
                  <p class="card-text font-small-2 me-25 mb-0">
                    Updated 1 month ago
                  </p>
                </div>
              </div>
              <div class="card-body statistics-body">
                <div class="row">
                  <div class="col-xl-3 col-sm-6 col-12 mb-2 mb-xl-0">
                    <div class="d-flex flex-row">
                      <div class="avatar bg-light-primary me-2">
                        <div class="avatar-content">
                          <tabler-icon
                            icon="TrendingUpIcon"
                            class="avatar-icon"
                          />
                        </div>
                      </div>
                      <div class="my-auto">
                        <h4 class="fw-bolder mb-0">230k</h4>
                        <p class="card-text font-small-3 mb-0">Sales</p>
                      </div>
                    </div>
                  </div>
                  <div class="col-xl-3 col-sm-6 col-12 mb-2 mb-xl-0">
                    <div class="d-flex flex-row">
                      <div class="avatar bg-light-secondary me-2">
                        <div class="avatar-content">
                          <tabler-icon icon="UserIcon" class="avatar-icon" />
                        </div>
                      </div>
                      <div class="my-auto">
                        <h4 class="fw-bolder mb-0">8.549k</h4>
                        <p class="card-text font-small-3 mb-0">Customers</p>
                      </div>
                    </div>
                  </div>
                  <div class="col-xl-3 col-sm-6 col-12 mb-2 mb-sm-0">
                    <div class="d-flex flex-row">
                      <div class="avatar bg-light-warning me-2">
                        <div class="avatar-content">
                          <tabler-icon icon="BoxIcon" class="avatar-icon" />
                        </div>
                      </div>
                      <div class="my-auto">
                        <h4 class="fw-bolder mb-0">1.423k</h4>
                        <p class="card-text font-small-3 mb-0">Products</p>
                      </div>
                    </div>
                  </div>
                  <div class="col-xl-3 col-sm-6 col-12">
                    <div class="d-flex flex-row">
                      <div class="avatar bg-light-info me-2">
                        <div class="avatar-content">
                          <tabler-icon
                            icon="CoinIcon"
                            class="avatar-icon"
                          />
                        </div>
                      </div>
                      <div class="my-auto">
                        <h4 class="fw-bolder mb-0">$9745</h4>
                        <p class="card-text font-small-3 mb-0">Revenue</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--/ Statistics Card -->
        </div>

        <div class="row match-height">
          <div class="col-lg-4 col-12">
            <div class="row match-height">
              <!-- Bar Chart - Orders -->
              <div class="col-lg-6 col-md-3 col-6">
                <div class="card">
                  <div class="card-body pb-50">
                    <h6>Orders</h6>
                    <h2 class="fw-bolder mb-1">2,76k</h2>
                    <div id="statistics-order-chart"></div>
                  </div>
                </div>
              </div>
              <!--/ Bar Chart - Orders -->

              <!-- Line Chart - Profit -->
              <div class="col-lg-6 col-md-3 col-6">
                <div class="card card-tiny-line-stats">
                  <div class="card-body pb-50">
                    <h6>Profit</h6>
                    <h2 class="fw-bolder mb-1">6,24k</h2>
                    <div id="statistics-profit-chart"></div>
                  </div>
                </div>
              </div>
              <!--/ Line Chart - Profit -->

              <!-- Earnings Card -->
              <div class="col-lg-12 col-md-6 col-12">
                <div class="card earnings-card">
                  <div class="card-body">
                    <div class="row">
                      <div class="col-6">
                        <h4 class="card-title mb-1">Earnings</h4>
                        <div class="font-small-2">This Month</div>
                        <h5 class="mb-1">$4055.56</h5>
                        <p class="card-text text-muted font-small-2">
                          <span class="fw-bolder">68.2%</span
                          ><span> more earnings than last month.</span>
                        </p>
                      </div>
                      <div class="col-6">
                        <div id="earnings-chart"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!--/ Earnings Card -->
            </div>
          </div>

          <!-- Transaction Card -->
          <div class="col-lg-8 col-md-6 col-12">
            <div class="card card-transaction">
              <div class="card-header">
                <h4 class="card-title">Transactions</h4>
                <div class="dropdown chart-dropdown">
                  <tabler-icon
                    icon="DotsVerticalIcon"
                    data-bs-toggle="dropdown"
                    class="font-medium-3 cursor-pointer"
                  />

                  <div class="dropdown-menu dropdown-menu-end">
                    <a class="dropdown-item" href="#">Last 28 Days</a>
                    <a class="dropdown-item" href="#">Last Month</a>
                    <a class="dropdown-item" href="#">Last Year</a>
                  </div>
                </div>
              </div>
              <div class="card-body">
                <div class="transaction-item">
                  <div class="d-flex">
                    <div class="avatar bg-light-primary rounded float-start">
                      <div class="avatar-content">
                        <tabler-icon
                          icon="WalletIcon"
                          class="avatar-icon font-medium-3"
                        />
                      </div>
                    </div>
                    <div class="transaction-percentage">
                      <h6 class="transaction-title">Wallet</h6>
                      <small>Starbucks</small>
                    </div>
                  </div>
                  <div class="fw-bolder text-danger">- $74</div>
                </div>
                <div class="transaction-item">
                  <div class="d-flex">
                    <div class="avatar bg-light-secondary rounded float-start">
                      <div class="avatar-content">
                        <tabler-icon
                          icon="CheckIcon"
                          class="avatar-icon font-medium-3"
                        />
                      </div>
                    </div>
                    <div class="transaction-percentage">
                      <h6 class="transaction-title">Bank Transfer</h6>
                      <small>Add Money</small>
                    </div>
                  </div>
                  <div class="fw-bolder text-success">+ $480</div>
                </div>
                <div class="transaction-item">
                  <div class="d-flex">
                    <div class="avatar bg-light-warning rounded float-start">
                      <div class="avatar-content">
                        <tabler-icon
                          icon="CoinIcon"
                          class="avatar-icon font-medium-3"
                        />
                      </div>
                    </div>
                    <div class="transaction-percentage">
                      <h6 class="transaction-title">Paypal</h6>
                      <small>Add Money</small>
                    </div>
                  </div>
                  <div class="fw-bolder text-success">+ $590</div>
                </div>
                <div class="transaction-item">
                  <div class="d-flex">
                    <div class="avatar bg-light-info rounded float-start">
                      <div class="avatar-content">
                        <tabler-icon
                          icon="CreditCardIcon"
                          class="avatar-icon font-medium-3"
                        />
                      </div>
                    </div>
                    <div class="transaction-percentage">
                      <h6 class="transaction-title">Mastercard</h6>
                      <small>Ordered Food</small>
                    </div>
                  </div>
                  <div class="fw-bolder text-danger">- $23</div>
                </div>
                <div class="transaction-item">
                  <div class="d-flex">
                    <div class="avatar bg-light-danger rounded float-start">
                      <div class="avatar-content">
                        <tabler-icon
                          icon="SendIcon"
                          class="avatar-icon font-medium-3"
                        />
                      </div>
                    </div>
                    <div class="transaction-percentage">
                      <h6 class="transaction-title">Transfer</h6>
                      <small>Refund</small>
                    </div>
                  </div>
                  <div class="fw-bolder text-success">+ $98</div>
                </div>
              </div>
            </div>
          </div>
          <!--/ Transaction Card -->
        </div>
      </section>
      <!-- Dashboard Ecommerce ends -->
    </div>
  </div>
</template>

<script>
import BreadCrumb from "@/components/BreadCrumb/BreadCrumb.vue";

export default {
  name: "Dashboard",
  components: {
    BreadCrumb,
  },
};
</script>

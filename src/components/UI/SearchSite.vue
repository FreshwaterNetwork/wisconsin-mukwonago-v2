<template>
  <div>
    <p class="q-mt-sm">
      <b>
        By clicking on the map, select one or more features of interest to
        explore the impact of nearby high capacity pumping.
      </b>
    </p>
    <p style="margin-bottom:0px;">
      <b>What is the yearly average pumping rate for the well?</b>
    </p>
    <p class="text-caption">
      A typical home uses around 200 gallons per day or 0.14 gpm, so a
      subdivision of 50 homes uses around 7-10 gpm on average. An irrigation
      well uses between 400 and 1200 gpm for 10-50 percent of the time during
      the summer growing months. The exact amount depends on the time of year,
      rainfall, and crop. Municipal wells might pump up to 700 gpm, however most
      would be less when averaged over an entire year. To put these pumping
      rates into perspective, a garden hose turned on full blast has a flow of
      about 3 gpm.
    </p>

    <!-- Pump rate selector  -->
    <q-select
      v-model="pumpRateValue"
      rounded
      outlined
      :options="searchOptions"
      dense
      label="Select a Pumping Rate"
      style="width:200px; display:block; margin:auto;"
      for="pump-rate"
    />
    <p
      v-if="!noGPM"
      style="color: red; margin-bottom: 0px;"
      class="text-center q-mt-sm"
    >
      A pump rate and feature(s) <strong>must</strong> be selected to display
      data.
    </p>

    <!-- Data Table -->
    <div
      class="q-pa-md"
      :style="!selectedFeatures ? 'overflow-y: scroll;' : ''"
    >
      <q-markup-table v-if="selectedFeatures != ''">
        <thead>
          <tr>
            <th>Feature Name</th>
            <th>Drawdown (cm)</th>
            <th>Depletion Potential (%)</th>
            <th>
              <icon-button
                v-if="!infoVis"
                type="info"
                method="show-info"
                @show-info="infoVis = true"
              ></icon-button>
              <icon-button
                v-if="infoVis"
                type="close"
                method="hide-info"
                @hide-info="infoVis = false"
              ></icon-button>
            </th>
          </tr>
        </thead>
        <q-dialog v-model="infoVis">
          <q-card>
            <q-card-section class="row items-center q-pb-none">
              <div class="text-h6">Searching for a Pumping Site</div>
              <q-space />
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>
            <q-card-section>
              <div>
                <p><b>Drawdown (cm):</b></p>
                <p>
                  A pumping well creates a cone of depression in the water table
                  that is centered on the well. Here, drawdown is the average
                  amount the water table is lowered over the area of the fen by
                  the pumping well in units of centimeters. Because healthy fens
                  are associated more with shallow and stable water levels and
                  less with minimum seepage rates and because drawdown in fens
                  is more easily measured than seepage, drawdown is used as the
                  primary indicator of potential harm to the fen. An average
                  drawdown of 5 cm or greater over the area of the fen is likely
                  to include localized areas with much greater drawdowns, up to
                  20 cm or more. Drawdowns of 20 cm or greater have been shown
                  to negatively impact the health of the fen (Aldous and Bach,
                  2014).
                </p>
                <p><b>Depletion Potential (%):</b></p>
                <p>
                  This is the percent reduction in groundwater discharge to a
                  stream, river, or lake due to pumping. When a well pumps,
                  groundwater discharge is decreased since some of the
                  groundwater is now flowing to the well rather than to the
                  surface water. Depletion potential rather than drawdown is
                  used as the primary indicator of harm to stream, rivers and
                  lakes. This is because reduced groundwater flows are related
                  to poor water and habitat quality. In addition, depletion
                  potential is a more sensitive measure than drawdown because
                  only very large pumping rates will cause measurable drawdowns
                  in streams, rivers, and lakes. Depletion potentials over 5%
                  are considered significant, and further consideration should
                  be given to the impact of groundwater pumping on the stream,
                  river or lake. Please note that the data for headwater river
                  locations includes information about depletion potential for
                  both the stream reaches and ponds of the headwaters.
                </p>
                <q-img
                  :src="'/img/icons/wss-cycle-diagram.jpg'"
                  style="height: 350px;"
                />
              </div>
            </q-card-section>
          </q-card>
        </q-dialog>
        <tbody>
          <tr v-for="(feat, index) in selectedFeatures" :key="feat">
            <td>{{ feat.CommonName }}</td>
            <td></td>
            <td>
              <q-btn
                size="10px"
                color="secondary"
                icon="map"
                style="display: block; margin: auto;"
                :class="{ active: activeIndex === index }"
                @click="
                  toggleActive(index);
                  showRemoveLayer(feat);
                "
              ></q-btn>
            </td>
            <td>
              <q-btn
                round
                size="10px"
                color="red"
                icon="close"
                style="display: flex; margin: auto;"
                @click="removeSelected(feat)"
              ></q-btn>
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>
    <q-btn to="/tab3" color="primary" class="back-btn">
      Back
    </q-btn>
  </div>
</template>

<script>
import IconButton from './IconButton.vue';
export default {
  components: { IconButton },
  name: 'search',
  data() {
    return {
      searchOptions: [
        { label: '25 gpm', value: '25' },
        { label: '50 gpm', value: '50' },
        { label: '75 gpm', value: '75' },
        { label: '100 gpm', value: '100' },
      ],
      infoVis: false,
      buttonCol: false,
      activeIndex: -1,
      pumpRateValue: '',
      noGPM: false,
    };
  },
  computed: {
    selectedFeatures() {
      return this.$store.state.selectedFeatures;
    },
    removeHighlight: {
      get() {
        return this.$store.state.removeHighlight;
      },
      set(value) {
        this.$store.commit('updateRemoveHighlight', value);
      },
    },
  },
  methods: {
    removeSelected(val) {
      const index = this.selectedFeatures.indexOf(val);
      if (index !== -1) {
        this.selectedFeatures.splice(index, 1);
      }
      this.removeHighlight = true;
    },
    showRemoveLayer(val) {
      if (this.buttonCol === true) {
        const index = this.selectedFeatures.indexOf(val);
        if (index !== -1) {
          console.log('GPM layer added to map');
          // this.buttonCol === true;
        }
      } else {
        const index = this.selectedFeatures.indexOf(val);
        if (index !== -1) {
          console.log('GPM layer removed from map');
          // this.buttonCol === false;
        }
      }
    },
    toggleActive(index) {
      this.activeIndex = this.activeIndex === index ? -1 : index;
      this.buttonCol = !this.buttonCol;
      let gpm = this.pumpRateValue.value;
      if (gpm) {
        console.log(gpm);
        this.noGPM = true;
      } else {
        console.log('No GPM selected.');
        this.noGPM = false;
      }
    },
    gpmValue() {
      let gpm = this.pumpRateValue.value;
      if (gpm) {
        console.log(gpm);
        this.noGPM = true;
      } else {
        console.log('No GPM selected.');
        this.noGPM = false;
      }
    },
  },
};
</script>

<style scoped>
.back-btn {
  display: flex;
  position: relative;
  margin: 10px auto 10px auto;
}
.active {
  background-color: red !important;
  color: white !important;
}
</style>

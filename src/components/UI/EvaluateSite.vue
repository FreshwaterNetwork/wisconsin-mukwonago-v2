<template>
  <div>
    <p class="q-mt-md">
      <b>Enter a location or click on the map to drop a pin:</b>
    </p>
    <!-- <p class="text-caption">
        Exact locations are not permissible, will snap to a pre-determined
        6-acre grid.
      </p> -->
    <div style="display: flex;">
      <q-input
        outlined
        v-model="locationValue"
        for="locationID"
        label="Location or Address"
        style="display:block; margin:auto 5px auto auto;"
        @input="locationValue"
      />
      <q-btn
        round
        color="primary"
        icon="search"
        style="margin: auto auto auto 5px"
        @click="updateLocationValue"
      />
    </div>
    <div style="display: flex;">
      <p class="q-mt-md">
        <b>What is the yearly average pumping rate for the well?</b>
      </p>
      <icon-button
        v-if="showInfo === false"
        type="info"
        class="q-mt-sm"
        method="show-info"
        @show-info="showInfo = true"
        style="margin-left:5px;"
      />
      <icon-button
        v-if="showInfo === true"
        type="close"
        class="q-mt-sm"
        method="hide-info"
        @hide-info="showInfo = false"
        style="margin-left:5px;"
      />
    </div>
    <p v-if="showInfo === true">
      A typical home uses around 200 gallons per day or 0.14 gpm, so a
      subdivision of 50 homes uses around 7-10 gpm on average. An irrigation
      well uses between 400 and 1200 gpm for 10-50 percent of the time during
      the summer growing months. The exact amount depends on the time of year,
      rainfall, and crop. Municipal wells might pump up to 700 gpm, however most
      would be less when averaged over an entire year. To put these pumping
      rates into perspective, a garden hose turned on full blast has a flow of
      about 3 gpm.
    </p>
    <q-select
      v-model="pumpRateValue"
      outlined
      :options="evalOptions"
      label="Select a Pumping Rate"
      style="width:200px; display:block; margin:auto auto 10px auto;"
      dense
    />
    <!-- <p
      v-if="!pumpRateValue || (locationValue == '' && this.pointCoord == '')"
      style="color: red;"
      class="text-center q-my-sm"
    >
      A pump rate and location <strong>must</strong> be selected to display
      data.
    </p> -->
    <!-- Data Table -->
    <!-- <q-markup-table>
        <thead>
          <tr>
            <th>Feature Name</th>
            <th>Drawdown (cm)</th>
            <th>
              Depletion<br />
              Potential (%)
            </th>
            <th>
              Well Yield from<br />
              Outside of Basin (%)
            </th>
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
                  style="height: auto; width: 400px; margin:auto; display:block;"
                />
              </div>
            </q-card-section>
          </q-card>
        </q-dialog>
        <tbody>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </q-markup-table> -->
    <q-table
      :rows="rows"
      :columns="columns"
      row-key="name"
      no-data-label="A pump rate and location must be selected to display data."
      wrap-cells
      table-header-style="padding: 4px;"
    >
      <template v-slot:top-right>
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
        <q-dialog v-model="infoVis">
          <q-card>
            <q-card-section class="row items-center q-pb-none">
              <div class="text-h6">Evaluating a Pumping Site</div>
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
                  style="height: auto; width: 400px; margin:auto; display:block;"
                />
              </div>
            </q-card-section>
          </q-card>
        </q-dialog>
      </template>
      <template v-slot:body-cell-drawdown="props">
        <q-td :style="getCellStyles(props.row.drawdown)">
          {{ props.row.drawdown }}
        </q-td>
      </template>
      <template v-slot:body-cell-depletion="props">
        <q-td :style="getCellStyles(props.row.depletion)">
          {{ props.row.depletion }}
        </q-td>
      </template>
    </q-table>
  </div>
  <q-btn
    to="/tab3"
    color="primary"
    class="back-btn"
    @click="this.planType = ''"
  >
    Back
  </q-btn>
</template>

<script>
import IconButton from './IconButton.vue';

export default {
  name: 'evaluate',
  components: { IconButton },
  data() {
    return {
      evalOptions: [
        { label: '25 gpm', value: '25' },
        { label: '50 gpm', value: '50' },
        { label: '75 gpm', value: '75' },
        { label: '100 gpm', value: '100' },
        { label: '125 gpm', value: '125' },
        { label: '150 gpm', value: '150' },
        { label: '200 gpm', value: '200' },
        { label: '250 gpm', value: '250' },
        { label: '300 gpm', value: '300' },
        { label: '400 gpm', value: '400' },
        { label: '500 gpm', value: '500' },
      ],
      locationValue: '',
      pumpRateValue: '',
      infoVis: false,
      columns: [
        { name: 'name', align: 'left', label: 'Feature Name', field: 'name' },
        {
          name: 'drawdown',
          align: 'left',
          label: 'Drawdown (cm)',
          field: 'drawdown',
        },
        {
          name: 'depletion',
          align: 'left',
          label: 'Depletion Potential (%)',
          field: 'depletion',
        },
        {
          name: 'yield',
          align: 'left',
          label: 'Well Yield from Outside of Basin (%)',
          field: 'yield',
        },
      ],
      rows: [],
      ddQuery: '',
      depQuery: '',
      dd: '--',
      dep: '--',
      showInfo: false,
    };
  },
  computed: {
    planType: {
      get() {
        return this.$store.state.planType;
      },
      set(value) {
        this.$store.commit('updatePlanType', value);
      },
    },
    selectedFeatures() {
      return this.$store.state.selectedFeatures;
    },
    pointCoord() {
      return this.$store.state.pointCoord;
    },
    evalCircle() {
      return this.$store.state.evalCircle;
    },
    circleFeatures() {
      return this.$store.state.circleFeatures;
    },
    resultsFeatures() {
      return this.$store.state.resultsFeatures;
    },
    nonCoordLoc: {
      get() {
        return this.$store.state.nonCoordLoc;
      },
      set(value) {
        this.$store.commit('updateNonCoordLoc', value);
      },
    },
  },
  methods: {
    updateLocationValue(val) {
      let inputBox = document.getElementById('locationID').value;
      val = inputBox;
      this.$store.commit('updateLocationValue', val);
      this.locationValue = val;
      this.nonCoordLoc = true;
      console.log(val);
    },
    createRows() {
      let featName;
      console.log(this.featName, this.ddQuery, this.depQuery);
      // let yieldQuery;
      let comName;
      this.rows = [];
      this.circleFeatures.forEach((feat) => {
        featName = feat.Name;
        // .replace('_', '-');
        comName = feat.CommonName;
        console.log(comName);

        if (comName.endsWith('Fen') === true) {
          this.ddQuery = featName + '_ddn_mean';
          console.log('this is a fen');
        } else {
          console.log('this is not a fen');
          this.depQuery = featName + '_flow_rel';
        }

        this.resultsFeatures.forEach((a) => {
          if (a.gpm === this.pumpRateValue.value) {
            for (const key in a) {
              // console.log(key);
              if (key === this.ddQuery) {
                if (comName.endsWith('Fen') === true) {
                  this.dd = a[key];
                  this.dep = '--';
                  console.log(a[key]);
                }
              } else if (key === this.depQuery) {
                if (comName.endsWith('Fen') === false) {
                  this.dep = a[key];
                  this.dd = '--';
                  console.log(this.dep);
                }
              }
            }
          }
        });

        let row = {
          name: comName,
          drawdown: this.dd,
          depletion: this.dep,
          yield: 'test',
        };

        this.rows.push(row);
      });
    },
    getCellStyles(drawdown, depletion) {
      if (drawdown >= 5 || depletion >= 5) {
        return { color: 'red' };
      } else {
        return {};
      }
    },
  },
  watch: {
    pumpRateValue() {
      this.createRows();
    },
    circleFeatures() {
      this.locationValue = '';
      if (this.pointCoord != '') {
        this.locationValue = this.pointCoord;
      }
    },
    locationValue() {
      this.pumpRateValue = '';
      this.rows = [];
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
.q-table__top {
  padding: 0px !important;
}
</style>

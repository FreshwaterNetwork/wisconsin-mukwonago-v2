<template>
  <div>
    <p class="q-mt-md">
      <b>
        Select one or more features of interest from the drop down to explore
        the impact of nearby high capacity pumping.
      </b>
    </p>
    <q-select
      v-model="featureSelect"
      multiple
      outlined
      :options="featureOptions"
      label="Select Feature(s)"
      use-chips
    />
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
    <!-- Pump rate selector  -->
    <q-btn-toggle
      v-model="pumpRateValue"
      toggle-color="primary"
      :options="searchOptions"
      spread
      style="margin: auto;"
    />
    <p
      v-if="!pumpRateValue || featureSelect == ''"
      style="color: red;"
      class="text-center q-mt-md"
    >
      A pump rate and feature(s) <strong>must</strong> be selected to display
      data.
    </p>
    <div style="margin:auto; width: fit-content;">
      <icon-button
        v-if="!infoVis"
        type="info"
        method="show-info"
        @show-info="infoVis = true"
        class="q-mt-md"
      ></icon-button>
      <icon-button
        v-if="infoVis"
        type="close"
        method="hide-info"
        @hide-info="infoVis = false"
        class="q-mt-md"
      ></icon-button>
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
                less with minimum seepage rates and because drawdown in fens is
                more easily measured than seepage, drawdown is used as the
                primary indicator of potential harm to the fen. An average
                drawdown of 5 cm or greater over the area of the fen is likely
                to include localized areas with much greater drawdowns, up to 20
                cm or more. Drawdowns of 20 cm or greater have been shown to
                negatively impact the health of the fen (Aldous and Bach, 2014).
              </p>
              <p><b>Depletion Potential (%):</b></p>
              <p>
                This is the percent reduction in groundwater discharge to a
                stream, river, or lake due to pumping. When a well pumps,
                groundwater discharge is decreased since some of the groundwater
                is now flowing to the well rather than to the surface water.
                Depletion potential rather than drawdown is used as the primary
                indicator of harm to stream, rivers and lakes. This is because
                reduced groundwater flows are related to poor water and habitat
                quality. In addition, depletion potential is a more sensitive
                measure than drawdown because only very large pumping rates will
                cause measurable drawdowns in streams, rivers, and lakes.
                Depletion potentials over 5% are considered significant, and
                further consideration should be given to the impact of
                groundwater pumping on the stream, river or lake. Please note
                that the data for headwater river locations includes information
                about depletion potential for both the stream reaches and ponds
                of the headwaters.
              </p>
              <q-img
                :src="'/img/icons/wss-cycle-diagram.jpg'"
                style="height: auto; width: 400px; margin:auto; display:block;"
              />
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
    <!-- Data Table -->
    <div>
      <!-- <q-markup-table
        v-if="featureSelect != '' && this.tempBool === true"
        :style="!featureSelect ? 'overflow-y: scroll;' : ''"
      >
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
                  style="height: auto; width: 400px; margin:auto; display:block;"
                />
              </div>
            </q-card-section>
          </q-card>
        </q-dialog>
        <tbody>
          <tr
            v-for="(feat, index) in featureSelect"
            :key="index"
            id="table-row"
          >
            <td>{{ feat.label }}</td>
            <td>
              <q-btn
                v-if="
                  feat.display != true &&
                    feat.btn != true &&
                    this.mapQuery === '' &&
                    feat.label.endsWith('Fen') === true
                "
                :key="index"
                size="10px"
                color="secondary"
                :disable="this.pumpRateValue === '' ? true : false"
                icon="map"
                style="display: block; margin: auto;"
                :class="{ active: activeIndex === index }"
                @click="toggleActive(feat, index)"
              ></q-btn>
              <q-btn
                v-if="
                  feat.btn === true &&
                    feat.display === true &&
                    this.mapQuery != '' &&
                    feat.label.endsWith('Fen') === true
                "
                :key="index"
                size="10px"
                color="primary"
                icon="map"
                style="display: block; margin: auto;"
                :class="{ active: activeIndex === index }"
                @click="removeRaster(feat)"
              ></q-btn>
            </td>
            <td>
              <q-btn
                v-if="
                  feat.display != true &&
                    feat.btn != true &&
                    this.mapQuery === '' &&
                    feat.label.endsWith('Fen') === false
                "
                :key="index"
                size="10px"
                color="secondary"
                :disable="this.pumpRateValue === '' ? true : false"
                icon="map"
                style="display: block; margin: auto;"
                :class="{ active: activeIndex === index }"
                @click="toggleActive(feat, index), createRadio()"
              ></q-btn>
              <q-btn
                v-if="
                  feat.btn === true &&
                    feat.display === true &&
                    this.mapQuery != '' &&
                    feat.label.endsWith('Fen') === false
                "
                :key="index"
                size="10px"
                color="primary"
                icon="map"
                style="display: block; margin: auto;"
                :class="{ active: activeIndex === index }"
                @click="removeRaster(feat)"
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
      </q-markup-table> -->
      <div v-if="this.pumpRateValue != ''">
        <q-expansion-item
          switch-toggle-side
          default-opened
          header-class="text-h6"
          label="Streams"
        >
          <div v-for="(feat, index) in radioOptions" :key="index">
            <q-checkbox
              v-model="radioFeature"
              v-if="feat.type === 'srl'"
              :label="feat.label"
              :val="feat.label"
              toggle-order="ft"
              style="margin-left: 62px"
              @update:model-value="checkClick"
            />
          </div>
        </q-expansion-item>

        <q-expansion-item
          switch-toggle-side
          default-opened
          header-class="text-h6"
          label="Lakes"
        >
          <div v-for="(feat, index) in radioOptions" :key="index">
            <q-checkbox
              v-model="radioFeature"
              v-if="feat.type === 'lake'"
              :label="feat.label"
              :val="feat.label"
              toggle-order="ft"
              style="margin-left: 62px"
              @update:model-value="checkClick"
            />
          </div>
        </q-expansion-item>

        <q-expansion-item
          switch-toggle-side
          default-opened
          header-class="text-h6"
          label="Fens"
        >
          <div v-for="(feat, index) in radioOptions" :key="index">
            <q-checkbox
              v-model="radioFeature"
              v-if="feat.type === 'fen'"
              :label="feat.label"
              :val="feat.label"
              toggle-order="ft"
              style="margin-left: 62px"
              @update:model-value="checkClick"
            />
          </div>
        </q-expansion-item>

        <q-btn
          color="primary"
          label="Remove Features"
          @click="
            this.radioOptions = [];
            this.pumpRateValue = '';
            this.addRaster = false;
            this.mapQuery = '';
            this.featureSelect = [];
          "
          style="margin: 10px auto 10px auto; width: fit-content; display:block;"
        />
      </div>
    </div>
    <q-btn
      to="/tab3"
      color="primary"
      class="back-btn"
      @click="
        this.addRaster = false;
        this.planType = '';
      "
    >
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
        { label: '25 gpm', value: '25 gpm' },
        { label: '50 gpm', value: '50 gpm' },
        { label: '75 gpm', value: '75 gpm' },
        { label: '100 gpm', value: '100 gpm' },
      ],
      featureOptions: [
        {
          label: 'Streams',
          disable: true,
        },
        {
          label: 'Muk R. at Bluff Rd',
          display: false,
          btn: false,
          d: ' - Depletion - ',
          type: 'srl',
        },
        {
          label: 'Muk Trib below Bluff Rd Fen',
          display: false,
          btn: false,
          d: ' - Depletion - ',
          type: 'srl',
        },
        {
          label: 'Muk R. below Bluff Rd Fen',
          display: false,
          btn: false,
          d: ' - Depletion - ',
          type: 'srl',
        },
        {
          label: 'Muk R. at Lulu Lake',
          display: false,
          btn: false,
          d: ' - Depletion - ',
          type: 'srl',
        },
        {
          label: 'Muk R. at Eagle Spring Lake',
          display: false,
          btn: false,
          d: ' - Depletion - ',
          type: 'srl',
        },
        {
          label: 'Jericho Ck at Co Rd NN',
          display: false,
          btn: false,
          d: ' - Depletion - ',
          type: 'srl',
        },
        {
          label: 'Jericho Ck at Co Rd LO',
          display: false,
          btn: false,
          d: ' - Depletion - ',
          type: 'srl',
        },
        {
          label: 'Muk R. below Eagle Spring Lake',
          display: false,
          btn: false,
          d: ' - Depletion - ',
          type: 'srl',
        },
        {
          label: 'Muk R. at Rainbow Spring Rd',
          display: false,
          btn: false,
          d: ' - Depletion - ',
          type: 'srl',
        },
        {
          label: 'Muk Trib at Town Line Rd',
          display: false,
          btn: false,
          d: ' - Depletion - ',
          type: 'srl',
        },
        {
          label: 'Muk Trib below Lake Beulah',
          display: false,
          btn: false,
          d: ' - Depletion - ',
          type: 'srl',
        },
        {
          label: 'Muk Trib at Muk R.',
          display: false,
          btn: false,
          d: ' - Depletion - ',
          type: 'srl',
        },
        {
          label: 'Muk R. below Beulah Rd',
          display: false,
          btn: false,
          d: ' - Depletion - ',
          type: 'srl',
        },
        {
          label: 'Muk R. at Lower Phantom Lake',
          display: false,
          btn: false,
          d: ' - Depletion - ',
          type: 'srl',
        },
        {
          label: 'Muk R. below Lower Phantom Lake',
          display: false,
          btn: false,
          d: ' - Depletion - ',
          type: 'srl',
        },
        {
          label: 'Muk R. below Holz Pkwy',
          display: false,
          btn: false,
          d: ' - Depletion - ',
          type: 'srl',
        },
        {
          label: 'Muk Trib below I43',
          display: false,
          btn: false,
          d: ' - Depletion - ',
          type: 'srl',
        },
        {
          label: 'Muk R. at Fox R.',
          display: false,
          btn: false,
          d: ' - Depletion - ',
          type: 'srl',
        },
        {
          label: 'Lake',
          disable: true,
        },
        {
          label: 'Rainbow Springs Lake',
          display: false,
          btn: false,
          d: ' - Depletion - ',
          type: 'lake',
        },
        {
          label: 'Pickerel Lake',
          display: false,
          btn: false,
          d: ' - Depletion - ',
          type: 'lake',
        },
        {
          label: 'Lulu Lake',
          display: false,
          btn: false,
          d: ' - Depletion - ',
          type: 'lake',
        },
        {
          label: 'Eagle Spring Lake',
          display: false,
          btn: false,
          d: ' - Depletion - ',
          type: 'lake',
        },
        {
          label: 'Phantom Lake',
          display: false,
          btn: false,
          d: ' - Depletion - ',
          type: 'lake',
        },
        {
          label: 'Lake Beulah/Army Lake',
          display: false,
          btn: false,
          d: ' - Depletion - ',
          type: 'lake',
        },
        {
          label: 'Fen',
          disable: true,
        },
        {
          label: 'Pickerel Lake Fen',
          display: false,
          btn: false,
          d: ' - Drawdown - ',
          type: 'fen',
        },
        {
          label: 'Bluff Road Fen',
          display: false,
          btn: false,
          d: ' - Drawdown - ',
          type: 'fen',
        },
        {
          label: 'Lulu Lake Fen',
          display: false,
          btn: false,
          d: ' - Drawdown - ',
          type: 'fen',
        },
        {
          label: 'Lakewood Fen',
          display: false,
          btn: false,
          d: ' - Drawdown - ',
          type: 'fen',
        },
        {
          label: 'Meyer Sedge Fen',
          display: false,
          btn: false,
          d: ' - Drawdown - ',
          type: 'fen',
        },
        {
          label: 'Jericho Creek Fen',
          display: false,
          btn: false,
          d: ' - Drawdown - ',
          type: 'fen',
        },
      ],
      infoVis: false,
      buttonCol: false,
      activeIndex: -1,
      pumpRateValue: '',
      noGPM: false,
      featureSelect: [],
      featureChoice: '',
      gpmVal: '',
      sublayers: [
        {
          id: 8,
          title: 'Muk R. at Bluff Rd - Depletion - 75 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 9,
          title: 'Muk R. at Bluff Rd - Depletion - 50 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 10,
          title: 'Muk R. at Bluff Rd - Depletion - 25 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 11,
          title: 'Muk R. at Bluff Rd - Depletion - 100 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 12,
          title: 'Muk Trib below Bluff Rd Fen - Depletion - 75 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 13,
          title: 'Muk Trib below Bluff Rd Fen - Depletion - 50 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 14,
          title: 'Muk Trib below Bluff Rd Fen - Depletion - 25 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 15,
          title: 'Muk Trib below Bluff Rd Fen - Depletion - 100 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 16,
          title: 'Muk R. below Bluff Rd Fen - Depletion - 75 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 17,
          title: 'Muk R. below Bluff Rd Fen - Depletion - 50 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 18,
          title: 'Muk R. below Bluff Rd Fen - Depletion - 25 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 19,
          title: 'Muk R. below Bluff Rd Fen - Depletion - 100 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 20,
          title: 'Muk R. at Lulu Lake - Depletion - 75 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 21,
          title: 'Muk R. at Lulu Lake - Depletion - 50 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 22,
          title: 'Muk R. at Lulu Lake - Depletion - 25 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 23,
          title: 'Muk R. at Lulu Lake - Depletion - 100 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 24,
          title: 'Muk R. at Eagle Spring Lake - Depletion - 75 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 25,
          title: 'Muk R. at Eagle Spring Lake - Depletion - 50 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 26,
          title: 'Muk R. at Eagle Spring Lake - Depletion - 25 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 27,
          title: 'Muk R. at Eagle Spring Lake - Depletion - 100 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 28,
          title: 'Jericho Ck at Co Rd NN - Depletion - 75 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 29,
          title: 'Jericho Ck at Co Rd NN - Depletion - 50 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 30,
          title: 'Jericho Ck at Co Rd NN - Depletion - 25 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 31,
          title: 'Jericho Ck at Co Rd NN - Depletion - 100 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 32,
          title: 'Jericho Ck at Co Rd LO - Depletion - 75 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 33,
          title: 'Jericho Ck at Co Rd LO - Depletion - 50 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 34,
          title: 'Jericho Ck at Co Rd LO - Depletion - 25 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 35,
          title: 'Jericho Ck at Co Rd LO - Depletion - 100 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 36,
          title: 'Muk R. below Eagle Spring Lake - Depletion - 75 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 37,
          title: 'Muk R. below Eagle Spring Lake - Depletion - 50 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 38,
          title: 'Muk R. below Eagle Spring Lake - Depletion - 25 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 39,
          title: 'Muk R. below Eagle Spring Lake - Depletion - 100 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 40,
          title: 'Muk R. at Rainbow Spring Rd - Depletion - 75 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 41,
          title: 'Muk R. at Rainbow Spring Rd - Depletion - 50 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 42,
          title: 'Muk R. at Rainbow Spring Rd - Depletion - 25 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 43,
          title: 'Muk R. at Rainbow Spring Rd - Depletion - 100 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 44,
          title: 'Muk Trib at Town Line Rd - Depletion - 75 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 45,
          title: 'Muk Trib at Town Line Rd - Depletion - 50 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 46,
          title: 'Muk Trib at Town Line Rd - Depletion - 25 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 47,
          title: 'Muk Trib at Town Line Rd - Depletion - 100 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 48,
          title: 'Muk Trib below Lake Beulah - Depletion - 75 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 49,
          title: 'Muk Trib below Lake Beulah - Depletion - 50 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 50,
          title: 'Muk Trib below Lake Beulah - Depletion - 25 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 51,
          title: 'Muk Trib below Lake Beulah - Depletion - 100 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 52,
          title: 'Muk Trib at Muk R. - Depletion - 75 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 53,
          title: 'Muk Trib at Muk R. - Depletion - 50 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 54,
          title: 'Muk Trib at Muk R. - Depletion - 25 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 55,
          title: 'Muk Trib at Muk R. - Depletion - 100 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 56,
          title: 'Muk R. below Beulah Rd - Depletion - 75 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 57,
          title: 'Muk R. below Beulah Rd - Depletion - 50 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 58,
          title: 'Muk R. below Beulah Rd - Depletion - 25 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 59,
          title: 'Muk R. below Beulah Rd - Depletion - 100 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 60,
          title: 'Muk R. at Lower Phantom Lake - Depletion - 75 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 61,
          title: 'Muk R. at Lower Phantom Lake - Depletion - 50 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 62,
          title: 'Muk R. at Lower Phantom Lake - Depletion - 25 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 63,
          title: 'Muk R. at Lower Phantom Lake - Depletion - 100 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 64,
          title: 'Muk R. below Lower Phantom Lake - Depletion - 75 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 65,
          title: 'Muk R. below Lower Phantom Lake - Depletion - 50 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 66,
          title: 'Muk R. below Lower Phantom Lake - Depletion - 25 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 67,
          title: 'Muk R. below Lower Phantom Lake - Depletion - 100 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 68,
          title: 'Muk R. below Holz Pkwy - Depletion - 75 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 69,
          title: 'Muk R. below Holz Pkwy - Depletion - 50 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 70,
          title: 'Muk R. below Holz Pkwy - Depletion - 25 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 71,
          title: 'Muk R. below Holz Pkwy - Depletion - 100 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 72,
          title: 'Muk Trib below I43 - Depletion - 75 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 73,
          title: 'Muk Trib below I43 - Depletion - 50 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 74,
          title: 'Muk Trib below I43 - Depletion - 25 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 75,
          title: 'Muk Trib below I43 - Depletion - 100 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 76,
          title: 'Muk R. at Fox R. - Depletion - 75 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 77,
          title: 'Muk R. at Fox R. - Depletion - 50 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 78,
          title: 'Muk R. at Fox R. - Depletion - 25 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 79,
          title: 'Muk R. at Fox R. - Depletion - 100 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 80,
          title: 'Rainbow Springs Lake - Depletion - 75 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 81,
          title: 'Rainbow Springs Lake - Depletion - 50 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 82,
          title: 'Rainbow Springs Lake - Depletion - 25 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 83,
          title: 'Rainbow Springs Lake - Depletion - 100 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 84,
          title: 'Pickerel Lake - Depletion - 75 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 85,
          title: 'Pickerel Lake - Depletion - 50 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 86,
          title: 'Pickerel Lake - Depletion - 25 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 87,
          title: 'Pickerel Lake - Depletion - 100 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 88,
          title: 'Lulu Lake - Depletion - 75 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 89,
          title: 'Lulu Lake - Depletion - 700 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 90,
          title: 'Lulu Lake - Depletion - 50 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 91,
          title: 'Lulu Lake - Depletion - 25 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 92,
          title: 'Lulu Lake - Depletion - 100 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 93,
          title: 'Eagle Spring Lake - Depletion - 75 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 94,
          title: 'Eagle Spring Lake - Depletion - 50 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 95,
          title: 'Eagle Spring Lake - Depletion - 25 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 96,
          title: 'Eagle Spring Lake - Depletion - 100 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 97,
          title: 'Phantom Lake - Depletion - 75 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 98,
          title: 'Phantom Lake - Depletion - 50 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 99,
          title: 'Phantom Lake - Depletion - 25 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 100,
          title: 'Phantom Lake - Depletion - 100 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 101,
          title: 'Lake Beulah/Army Lake - Depletion - 75 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 102,
          title: 'Lake Beulah/Army Lake - Depletion - 50 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 103,
          title: 'Lake Beulah/Army Lake - Depletion - 25 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 104,
          title: 'Lake Beulah/Army Lake - Depletion - 100 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 105,
          title: 'Pickerel Lake Fen - Drawdown - 75 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 106,
          title: 'Pickerel Lake Fen - Drawdown - 50 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 107,
          title: 'Pickerel Lake Fen - Drawdown - 25 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 108,
          title: 'Pickerel Lake Fen - Drawdown - 100 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 109,
          title: 'Bluff Road Fen - Drawdown - 75 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 110,
          title: 'Bluff Road Fen - Drawdown - 50 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 111,
          title: 'Bluff Road Fen - Drawdown - 25 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 112,
          title: 'Bluff Road Fen - Drawdown - 100 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 113,
          title: 'Lulu Lake Fen - Drawdown - 75 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 114,
          title: 'Lulu Lake Fen - Drawdown - 50 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 115,
          title: 'Lulu Lake Fen - Drawdown - 25 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 116,
          title: 'Lulu Lake Fen - Drawdown - 100 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 117,
          title: 'Lakewood Fen - Drawdown - 75 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 118,
          title: 'Lakewood Fen - Drawdown - 50 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 119,
          title: 'Lakewood Fen - Drawdown - 25 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 120,
          title: 'Lakewood Fen - Drawdown - 100 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 121,
          title: 'Meyer Sedge Fen - Drawdown - 75 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 122,
          title: 'Meyer Sedge Fen - Drawdown - 50 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 123,
          title: 'Meyer Sedge Fen - Drawdown - 25 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 124,
          title: 'Meyer Sedge Fen - Drawdown - 100 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 125,
          title: 'Jericho Creek Fen - Drawdown - 75 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 126,
          title: 'Jericho Creek Fen - Drawdown - 50 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 127,
          title: 'Jericho Creek Fen - Drawdown - 25 gpm',
          visible: false,
          opacity: 0.7,
        },
        {
          id: 128,
          title: 'Jericho Creek Fen - Drawdown - 100 gpm',
          visible: false,
          opacity: 0.7,
        },
      ],
      radioOptions: [],
      selectedRadio: '',
      tempBool: false,
      radioFeature: [],
      showInfo: false,
    };
  },
  computed: {
    selectedFeatures() {
      return this.$store.state.selectedFeatures;
    },
    mapQuery: {
      get() {
        return this.$store.state.mapQuery;
      },
      set(value) {
        this.$store.commit('updateMapQuery', value);
      },
    },
    addRaster: {
      get() {
        return this.$store.state.addRaster;
      },
      set(value) {
        this.$store.commit('updateAddRaster', value);
      },
    },
    featCounter: {
      get() {
        return this.$store.state.featCounter;
      },
      set(value) {
        this.$store.commit('updateFeatCounter', value);
      },
    },
  },
  methods: {
    // Remove selected feature from the list and table
    removeSelected(feat) {
      this.mapQuery = '';
      const index = this.radioOptions.indexOf(feat);
      console.log(index);
      if (index !== -1) {
        this.radioOptions.splice(index, 1);
        feat.display = true;
        if (this.mapQuery != feat) {
          this.addRaster = false;
        }
        console.log('inside of remove selected');

        this.featureSelect.forEach((a) => {
          let indextwo = this.featureSelect.indexOf(a);

          if (indextwo === index) {
            this.featureSelect.splice(indextwo, 1);
          }
        });
      }
    },
    // Feature raster to show on map
    toggleActive(val, index) {
      this.activeIndex = this.activeIndex === index ? -1 : index;
      this.addRaster = true;
      this.featureChoice = val.label;
      this.gpmVal = this.pumpRateValue;
      this.mapQuery = '';
      val.btn = true;
      val.display = true;

      if (this.mapQuery === '') {
        if (val.label.endsWith('Fen') === false) {
          this.mapQuery = this.featureChoice + ' - Depletion - ' + this.gpmVal;
        } else if (val.label.endsWith('Fen') === true) {
          this.mapQuery = this.featureChoice + ' - Drawdown - ' + this.gpmVal;
        }
      }
    },
    // Feature raster to remove from map
    removeRaster(val) {
      val.btn = false;
      val.display = false;
      this.mapQuery = '';
      this.$store.commit('updateAddRaster', false);
      this.activeIndex = -1;
    },
    createRadio() {
      if (this.featureSelect && this.pumpRateValue) {
        console.log(this.radioOptions);

        let label = '';
        let d = '';
        let gpm = '';
        let radio;
        let type = '';

        this.featureSelect.forEach((feat) => {
          console.log(feat);

          label = feat.label;
          d = feat.d;
          gpm = this.pumpRateValue;
          type = feat.type;

          console.log(label, d, gpm, type);

          radio = {
            label: label + d + gpm,
            type: type,
          };

          console.log(radio);

          this.radioOptions.push(radio);
          this.featCounter++;
        });
      }
    },
    checkClick(event) {
      if (event.length > 0) {
        this.radioFeature = [event.pop()];
        console.log(event);
      }
    },
  },
  watch: {
    featureSelect() {
      if (this.addRaster === true) {
        this.$store.commit('updateAddRaster', false);
        this.mapQuery = '';
      }
      this.radioOptions = [];
      // if (this.pumpRateValue != '') {
      // console.log(this.featureSelect);

      let radio;
      // let label = this.featureSelect.label;
      // let d = this.featureSelect.d;
      // let gpm = this.pumpRateValue;
      // let type = this.featureSelect.type;

      // console.log(label);

      // radio = {
      //   label: label + d + gpm,
      //   type: type,
      // };

      this.createRadio();

      if (this.radioOptions != []) {
        this.radioOptions.forEach((f) => {
          if (f == radio) {
            this.radioOptions.pop(f);
            this.radioOptions.push(radio);
            console.log(radio);
            console.log(this.radioOptions);
          }
        });
      } else {
        this.radioOptions.push(radio);
      }
      // }
    },
    pumpRateValue() {
      this.radioOptions = [];
      this.mapQuery = '';
      this.addRaster = false;
      this.createRadio();
    },
    radioFeature() {
      this.mapQuery = '';

      if (this.radioFeature.length === 0) {
        this.addRaster = false;
        this.mapQuery = '';
      } else {
        this.radioFeature.forEach((f) => {
          this.mapQuery = f;
          this.addRaster = true;
        });
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
.q-radio:hover {
  color: red;
}
</style>

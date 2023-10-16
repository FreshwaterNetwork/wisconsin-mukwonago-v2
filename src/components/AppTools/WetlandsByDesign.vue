<template>
  <div>
    <div class="text-h6 text-weight-medium text-center">
      <span>Wetlands and Watersheds Explorer</span>
      <!-- <q-btn
        icon="fas fa-bars"
        color="primary"
        padding="5px"
        class="q-mr-md"
        style="margin: 0px 10px 0px 10px;"
      > -->
      <!-- <q-menu anchor="top right" self="top left">
          <q-list dense>
            <q-item clickable v-close-popup>
              <q-item-section>Bookmark and Share</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>Download Data</q-item-section>
            </q-item>
          </q-list>
        </q-menu> -->
      <!-- </q-btn> -->
      <icon-button
        v-if="this.appInfo === false"
        type="info"
        method="show-info"
        @show-info="this.appInfo = !this.appInfo"
        style="margin-left: 5px; width: 20px; height: 20px;"
      ></icon-button>
      <icon-button
        v-if="this.appInfo === true"
        type="close"
        method="hide-info"
        @hide-info="this.appInfo = !this.appInfo"
        style="margin-left: 5px; width: 20px; height: 20px;"
      ></icon-button>
      <p v-if="this.appInfo == true">
        <a
          href="https://maps.freshwaternetwork.org/wisconsin/plugins/wetlands-watershed-explorer/assets/WetlandsByDesign_FinalReport.pdf"
          target="_blank"
          >View Report</a
        >
      </p>
    </div>
    <hr />
    <div class="text-body1 q-pa-sm">
      <q-btn-toggle
        spread
        toggle-color="primary"
        v-model="this.projectType"
        :options="[
          { label: 'New Site', value: 'new' },
          { label: 'Existing Site', value: 'existing' },
        ]"
      />
      <!-- New Site -->
      <div v-if="this.projectType === 'new'" class="q-pa-md">
        <span
          v-if="this.firstSelected == false && this.wetlandWatersheds == []"
          style="width: fit-content; margin: auto; display: block;"
        >
          <b>Select a Watershed to get started</b>
        </span>
        <!-- add v-if firstselected = true to div below once layers are added to themap.vue -->
        <div>
          <q-expansion-item
            default-opened
            label="Selected Watersheds:"
            style="background: rgb(237 237 237)"
            dense
          >
            <q-list dense>
              <q-item
                v-for="ws in wetlandWatersheds"
                :key="ws"
                style="background-color: white"
              >
                <q-item-section>
                  {{ ws.desc + ': ' + ws.name + ' - ' + ws.huc }}
                </q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>
          <div style="width: fit-content; margin: 10px auto 10px auto;">
            <q-btn-toggle
              v-if="this.showNumServices == true"
              v-model="this.serviceType"
              toggle-color="primary"
              color="white"
              text-color="black"
              :options="[
                { label: 'Num. of Services', value: 'nos' },
                { label: 'Restoration Feasibility', value: 'rf' },
              ]"
            />
          </div>
          <div>
            <q-expansion-item
              default-opened
              label="Watershed Comparison Services:"
              style="background: rgb(237 237 237)"
              dense
              v-if="this.showServices == true || this.showNumServices == true"
            >
              <div v-if="this.showServices == true" class="new-option">
                <div
                  v-for="option in options"
                  :key="option"
                  style="background: white;"
                >
                  <q-radio
                    v-model="this.option"
                    :val="option.value"
                    :label="option.label"
                    size="30px"
                    @update:model-value="optionUpdate()"
                  />
                  <icon-button
                    v-if="option.visible === false"
                    type="info"
                    method="show-desc"
                    @show-desc="option.visible = !option.visible"
                    style="margin-left: 5px; width: 20px; height: 20px;"
                  ></icon-button>
                  <icon-button
                    v-if="option.visible === true"
                    type="close"
                    method="hide-desc"
                    @hide-desc="option.visible = !option.visible"
                    style="margin-left: 5px; width: 20px; height: 20px;"
                  ></icon-button>
                  <div class="option-description" v-show="option.visible">
                    {{ option.description }}
                  </div>
                </div>
              </div>
              <div
                class="new-option"
                v-if="showNumServices == true && this.serviceType === 'nos'"
              >
                <div
                  v-for="option in serviceOptions"
                  :key="option"
                  style="background: white;"
                >
                  <q-radio
                    v-model="this.serviceOption"
                    :val="option.value"
                    :label="option.label"
                    size="30px"
                  />
                  <icon-button
                    v-if="option.visible === false"
                    type="info"
                    method="show-desc"
                    @show-desc="option.visible = !option.visible"
                    style="margin-left: 5px; width: 20px; height: 20px;"
                  ></icon-button>
                  <icon-button
                    v-if="option.visible === true"
                    type="close"
                    method="hide-desc"
                    @hide-desc="option.visible = !option.visible"
                    style="margin-left: 5px; width: 20px; height: 20px;"
                  ></icon-button>
                  <div class="option-description" v-show="option.visible">
                    {{ option.description }}
                  </div>
                </div>
              </div>
              <div class="new-option" v-if="this.serviceType === 'rf'">
                <div
                  v-for="option in rfOptions"
                  :key="option"
                  style="background-color: white;"
                >
                  <q-radio
                    v-model="this.rfOption"
                    :val="option.value"
                    :label="option.label"
                    size="30px"
                  />
                  <icon-button
                    v-if="option.visible === false"
                    type="info"
                    method="show-desc"
                    @show-desc="option.visible = !option.visible"
                    style="margin-left: 5px; width: 20px; height: 20px;"
                  ></icon-button>
                  <icon-button
                    v-if="option.visible === true"
                    type="close"
                    method="hide-desc"
                    @hide-desc="option.visible = !option.visible"
                    style="margin-left: 5px; width: 20px; height: 20px;"
                  ></icon-button>
                  <div class="option-description" v-show="option.visible">
                    {{ option.description }}
                  </div>
                </div>
              </div>
            </q-expansion-item>
            <q-expansion-item
              label="Wetland Wildlife Habitat:"
              style="background: rgb(237 237 237)"
              dense
              v-if="this.showNumServices == true"
            >
              <div
                v-for="guild in guildOptions"
                :key="guild"
                style="background-color: white;"
              >
                <q-radio
                  v-model="this.guild"
                  :val="guild.value"
                  :label="guild.label"
                  size="30px"
                />
                <icon-button
                  v-if="guild.visible === false"
                  type="info"
                  method="show-desc"
                  @show-desc="guild.visible = !guild.visible"
                  style="margin-left: 5px; width: 20px; height: 20px;"
                ></icon-button>
                <icon-button
                  v-if="guild.visible === true"
                  type="close"
                  method="hide-desc"
                  @hide-desc="guild.visible = !guild.visible"
                  style="margin-left: 5px; width: 20px; height: 20px;"
                ></icon-button>
                <div class="option-description" v-show="guild.visible">
                  {{ guild.description }}
                </div>
              </div>
              <q-btn
                id="guild-button"
                color="primary"
                dense
                label="Remove Guild Layer"
                @click="this.noGuild()"
              />
            </q-expansion-item>
            <q-expansion-item
              v-if="this.rangeOfService == true"
              label="Range of Services:"
              style="background: rgb(237 237 237)"
              default-opened
              dense
            >
              <div
                style="padding-left: 15px; background-color: white; padding-top: 10px"
                v-if="this.serviceType == 'nos'"
              >
                <div
                  style="margin: auto; width: max-content; display: block; padding-bottom: 10px"
                >
                  Wetland ID: <strong>{{ this.wetlandId }}</strong>
                  <br />
                  Wetland Area: <strong>{{ this.watershedAcres }} acres</strong>
                </div>

                <p v-if="this.countOfServices != 0">
                  Count of Services ≥ High:
                  <strong>{{ this.countOfServices }}</strong>
                </p>

                <p v-if="this.floodAbatement != 0">
                  Flood Abatement: <strong> {{ this.floodAbatement }}</strong>
                </p>

                <p v-if="this.fishAquaticHabitat != 0">
                  Fish and Aquatic Habitat:
                  <strong> {{ this.fishAquaticHabitat }}</strong>
                </p>

                <p v-if="this.phosphorousRetention != 0">
                  Phosphorous Retention:
                  <strong> {{ this.phosphorousRetention }}</strong>
                </p>

                <p v-if="this.sedimentRetention != 0">
                  Sediment Retention:
                  <strong> {{ this.sedimentRetention }}</strong>
                </p>

                <p v-if="this.nitrogenReduction != 0">
                  Nitrogen Reduction:
                  <strong> {{ this.nitrogenReduction }}</strong>
                </p>

                <p v-if="this.surfaceWaterSupply != 0">
                  Surface Water Supply:
                  <strong> {{ this.surfaceWaterSupply }}</strong>
                </p>

                <p v-if="this.shorelineProtection != 0">
                  Shoreline Protection:
                  <strong> {{ this.shorelineProtection }}</strong>
                </p>

                <p v-if="this.carbonStorage != 0">
                  Carbon Storage: <strong> {{ this.carbonStorage }}</strong>
                </p>

                <p v-if="this.floristicIntegrity != 0">
                  Floristic Integrity:
                  <strong> {{ this.floristicIntegrity }}</strong>
                </p>
              </div>
              <div
                v-if="this.serviceType == 'rf'"
                style="padding-left: 15px; background-color: white; padding-top: 10px"
              >
                <div
                  style="margin: auto; width: max-content; display: block; padding-bottom: 10px"
                >
                  Wetland ID: <strong>{{ this.wetlandId }}</strong>
                  <br />
                  Wetland Area: <strong>{{ this.watershedAcres }} acres</strong>
                </div>

                <div>
                  <q-circular-progress
                    v-if="
                      this.loadingRf == true && this.loadingComplete == false
                    "
                    indeterminate
                    rounded
                    size="50px"
                    color="black"
                    style="margin: auto; width: max-contents; display: block"
                  />
                </div>

                <div
                  v-if="this.loadingComplete == true && this.loadingRf == false"
                >
                  <div v-if="this.overallFeas">
                    Overall Feasibility:
                    <div
                      v-if="this.overallFeas <= -1"
                      id="overall-feas-negative"
                    ></div>
                    <div
                      v-if="this.overallFeas == 0"
                      id="overall-feas-zero"
                    ></div>
                    <div
                      v-if="this.overallFeas == 1"
                      id="overall-feas-one"
                    ></div>
                    <div
                      v-if="this.overallFeas == 2"
                      id="overall-feas-two"
                    ></div>
                    <div
                      v-if="this.overallFeas >= 3"
                      id="overall-feas-three"
                    ></div>
                  </div>

                  <div v-if="this.landUseCons">
                    Land Use Considerations:
                    <div id="land-less-one" v-if="this.landUseCons < 1"></div>
                    <div id="land-one" v-if="this.landUseCons == 1"></div>
                    <div id="land-two" v-if="this.landUseCons == 2"></div>
                    <div id="land-more-two" v-if="this.landUseCons > 2"></div>
                  </div>

                  <div v-if="this.invasiveSpeciesCons">
                    Invasive Species Considerations:
                    <div
                      id="invasive-less-two"
                      v-if="this.invasiveSpeciesCons < -2"
                    ></div>
                    <div
                      id="invasive-two"
                      v-if="this.invasiveSpeciesCons == -2"
                    ></div>
                    <div
                      id="invasive-one"
                      v-if="this.invasiveSpeciesCons == -1"
                    ></div>
                    <div
                      id="invasive-more-zero"
                      v-if="this.invasiveSpeciesCons > 0"
                    ></div>
                  </div>
                </div>
              </div>
            </q-expansion-item>
          </div>
        </div>
      </div>
      <!-- Existing Site -->
      <div v-if="this.projectType === 'existing'">
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
      </div>
    </div>
  </div>
</template>

<script>
import IconButton from '../UI/IconButton.vue';

export default {
  name: 'wetlands-by-design',
  components: { IconButton },
  data() {
    return {
      firstSelected: false,
      guildOptions: [
        {
          label: 'All Guilds',
          value: 'All Guilds',
          visible: false,
          id: 52,
          description:
            'A wildlife guild is a group of species that use the same or similar habitats and resources. Some wetlands, and associated uplands, can support multiple guilds.',
        },
        {
          label: 'Forest Interior Guild',
          value: 'Forest Interior Birds Guild',
          visible: false,
          id: 48,
          description:
            'The Forest Interior Guild includes species that require forested wetlands embedded within heavily forested landscapes. Black-and-white warbler, northern waterthrush, and northern flying squirrels are examples.',
        },
        {
          label: 'Shrub Swamp Guild',
          value: 'Wet Shrub Birds Guild',
          visible: false,
          id: 51,
          description:
            'The Shrub Swamp Guild includes species that depend on dense thickets over wet soils that usually flood in spring, such as willow and alder flycatchers.',
        },
        {
          label: 'Shallow Marsh Guild',
          value: 'Shallow Marsh Birds Guild',
          visible: false,
          id: 50,
          description:
            'The Shallow Marsh Guild includes species that use open canopy wetlands with shallow water, or that are saturated most of the year, and may use adjacent open canopy uplands for breeding or foraging. These include American bittern, blue-winged teal, amphibians and aquatic invertebrates.',
        },
        {
          label: 'Open Waters Guild',
          value: 'Open Water Birds Guild',
          visible: false,
          id: 49,
          description:
            'The Open Waters Guild includes species that prefer large areas of open water, or where water is deeper and lasts longer than in a shallow marsh. Terns and diving ducks are examples.',
        },
        {
          label: 'All-Guild Restoration Opportunities',
          value: 'All-Guild Restoration Opportunities',
          visible: false,
          id: 53,
          description:
            'Restorable wetlands may have the potential to provide habitat for multiple guilds, depending on the habitat type restored and its proximity to core guild habitat.',
        },
      ],
      options: [
        {
          label: 'Combined Services',
          value: 'Combined Services',
          visible: false,
          id8: 30,
          id10: 31,
          id12: 32,
          description:
            'Wetlands can provide multiple services. Each wetland’s characteristics determine which services that wetland provides and to what extent. Some watersheds have lost more services than others, due to historical wetland loss and alteration.',
        },
        {
          label: 'Sediment Retention',
          value: 'Sediment Retention',
          visible: false,
          id8: 42,
          id10: 43,
          id12: 44,
          description:
            'Wetlands retain some sediment that would otherwise move downstream. Excess sediment in streams impairs water quality and aquatic habitat.',
        },
        {
          label: 'Flood Abatement',
          value: 'Flood Abatement',
          visible: false,
          id8: 33,
          id10: 34,
          id12: 35,
          description:
            'After heavy rainfall, many wetlands detain storm water runoff and overbank flooding from rivers, which slows the flow of excess water downstream.',
        },
        {
          label: 'Fish and Aquatic Habitat',
          value: 'Fish and Aquatic Habitat',
          visible: false,
          id8: 36,
          id10: 37,
          id12: 38,
          description:
            'Wetlands support some part of the full life cycle for most fish and aquatic life.',
        },
        {
          label: 'Nutrient Transformation',
          value: 'Nutrient Transformation',
          visible: false,
          id8: 39,
          id10: 40,
          id12: 41,
          description:
            'Wetlands remove nutrients from the water and convert them into plants, soil, or harmless gas.',
        },
        {
          label: 'Surface Water Supply',
          value: 'Surface Water Supply',
          visible: false,
          id8: 45,
          id10: 46,
          id12: 47,
          description:
            'Wetlands often contribute water to streams and rivers, especially during dry periods.',
        },
      ],
      serviceOptions: [
        {
          label: 'Count of Services ≥ High',
          value: 'Count of Services ≥ High',
          description:
            'Current and potentially restorable wetlands often have the potential to provide more than one service at “high” or “very high” levels.',
          visible: false,
          rfId: 16,
          nosId: 6,
        },
        {
          label: 'Flood Abatement',
          value: 'Flood Abatement',
          description:
            'After heavy rainfall, many wetlands detain storm water runoff and overbank flooding from rivers, which slows the flow of excess water downstream.',
          visible: false,
          rfId: 17,
          nosId: 7,
        },
        {
          label: 'Fish and Aquatic Habitat',
          value: 'Fish and Aquatic Habitat',
          description:
            'Wetlands support some part of the full life cycle for most fish and aquatic life.',
          visible: false,
          rfId: 18,
          nosId: 8,
        },
        {
          label: 'Phosphorous Retention',
          value: 'Phosphorous Retention',
          description:
            'Wetlands can intercept phosphorus from water and sediments, and store it in plants and soils.',
          visible: false,
          rfId: 19,
          nosId: 9,
        },
        {
          label: 'Sediment Retention',
          value: 'Sediment Retention',
          description:
            'Wetlands retain some sediment that would otherwise move downstream. Excess sediment in streams impairs water quality and aquatic habitat.',
          visible: false,
          rfId: 20,
          nosId: 10,
        },
        {
          label: 'Nitrogen Reduction',
          value: 'Nitrogen Reduction',
          description:
            'Wetlands remove nitrate from the water and convert it into plants, soil, or harmless gas.',
          visible: false,
          rfId: 21,
          nosId: 11,
        },
        {
          label: 'Surface Water Supply',
          value: 'Surface Water Supply',
          description:
            'Many wetlands contribute water to streams and rivers, especially during dry periods.',
          visible: false,
          rfId: 25,
          nosId: 15,
        },
        {
          label: 'Shoreline Protection',
          value: 'Shoreline Protection',
          description:
            'Wetlands reduce wave energy in lakes and slow flows in rivers, protecting banks and shorelines from erosion.',
          visible: false,
          rfId: 22,
          nosId: 12,
        },
        {
          label: 'Carbon Storage',
          value: 'Carbon Storage',
          description:
            'Wetlands capture carbon dioxide, a greenhouse gas, and store carbon in vegetation and deep organic soils.',
          visible: false,
          rfId: 23,
          nosId: 13,
        },
        {
          label: 'Floristic Integrity',
          value: 'Floristic Integrity',
          description:
            'Some wetlands are of high condition, containing a healthy array of plant species.',
          visible: false,
          rfId: 24,
          nosId: 14,
        },
      ],
      rfOptions: [
        {
          label: 'Overall Feasibility',
          value: 'Overall Feasibility',
          description:
            'Potentially restorable wetlands (PRWs) are ranked for restoration feasibility based on land use and susceptibility to invasive plants. PRWs are also ranked based on these categories, individually (see below). This information helps to distinguish which PRWs have fewer obstacles to restoration and merit further assessment at the site level. None of the feasibility factors preclude wetland restoration.',
          visible: false,
          id: 54,
        },
        {
          label: 'Land Use Considerations',
          value: 'Land Use Considerations',
          description:
            'Land use and land cover factors affect restoration feasibility. Agricultural lands are the most feasible due to the general absence of structures. Proximity to urban areas reduces feasibility, varying by intensity of development. Due to regulations, proximity to airports is a consideration, but not an absolute barrier. Sites within drainage districts are considered not feasible for restoration.',
          visible: false,
          id: 55,
        },
        {
          label: 'Invasive Species Considerations',
          value: 'Invasive Species Considerations',
          description:
            'The presence of invasive plants, or proximity to an invasive plant seed source, reduces the habitat quality of wetland restorations and may increase long-term management needs. Four common invaders are considered: reed canary grass, Phragmites, cattails, and invasive shrubs (buckthorn or honeysuckle).',
          visible: false,
          id: 56,
        },
      ],
      huc6: '',
      huc8: '',
      huc10: '',
      huc12: '',
      wsLength: '',
      appInfo: false,
    };
  },
  computed: {
    wetlandWatersheds() {
      return this.$store.state.wetlandWatersheds;
    },
    projectType: {
      get() {
        return this.$store.state.projectType;
      },
      set(value) {
        this.$store.commit('updateProjectType', value);
      },
    },
    wbdApp: {
      get() {
        return this.$store.state.wbdApp;
      },
      set(value) {
        this.$store.commit('updateWbdApp', value);
      },
    },
    showServices: {
      get() {
        return this.$store.state.showServices;
      },
      set(value) {
        this.$store.commit('updateShowServices', value);
      },
    },
    hideNumServices: {
      get() {
        return this.$store.state.hideNumServices;
      },
      set(value) {
        this.$store.commit('updateHideNumServices', value);
      },
    },
    hideServices: {
      get() {
        return this.$store.state.hideServices;
      },
      set(value) {
        this.$store.commit('updateHideServices', value);
      },
    },
    showNumServices: {
      get() {
        return this.$store.state.showNumServices;
      },
      set(value) {
        this.$store.commit('updateShowNumServices', value);
      },
    },
    serviceType: {
      get() {
        return this.$store.state.serviceType;
      },
      set(value) {
        this.$store.commit('updateServiceType', value);
      },
    },
    serviceOption: {
      get() {
        return this.$store.state.serviceOption;
      },
      set(value) {
        this.$store.commit('updateServiceOption', value);
      },
    },
    rfOption: {
      get() {
        return this.$store.state.rfOption;
      },
      set(value) {
        this.$store.commit('updateRfOption', value);
      },
    },
    option: {
      get() {
        return this.$store.state.option;
      },
      set(value) {
        this.$store.commit('updateOption', value);
      },
    },
    hucHover() {
      return this.$store.state.hucHover;
    },
    rangeOfService() {
      return this.$store.state.rangeOfService;
    },
    optionLayers: {
      get() {
        return this.$store.state.optionLayers;
      },
      set(value) {
        this.$store.commit('updateOptionLayers', value);
      },
    },
    rfLayer: {
      get() {
        return this.$store.state.rfLayer;
      },
      set(value) {
        this.$store.commit('updateRfLayer', value);
      },
    },
    serviceLayer: {
      get() {
        return this.$store.state.serviceLayer;
      },
      set(value) {
        this.$store.commit('updateServiceLayer', value);
      },
    },
    guild: {
      get() {
        return this.$store.state.guild;
      },
      set(value) {
        this.$store.commit('updateGuild', value);
      },
    },
    guildLayer: {
      get() {
        return this.$store.state.guildLayer;
      },
      set(value) {
        this.$store.commit('updateGuildLayer', value);
      },
    },
    removeGuild: {
      get() {
        return this.$store.state.removeGuild;
      },
      set(value) {
        this.$store.commit('updateRemoveGuild', value);
      },
    },
    watershedRange: {
      get() {
        return this.$store.state.watershedRange;
      },
      set(value) {
        this.$store.commit('updateWatershedRange', value);
      },
    },
    countOfServices: {
      get() {
        return this.$store.state.countOfServices;
      },
      set(value) {
        this.$store.commit('updateCountOfServices', value);
      },
    },
    floodAbatement: {
      get() {
        return this.$store.state.floodAbatement;
      },
      set(value) {
        this.$store.commit('updateFloodAbatement', value);
      },
    },
    fishAquaticHabitat: {
      get() {
        return this.$store.state.fishAquaticHabitat;
      },
      set(value) {
        this.$store.commit('updateFishAquaticHabitat', value);
      },
    },
    phosphorousRetention: {
      get() {
        return this.$store.state.phosphorousRetention;
      },
      set(value) {
        this.$store.commit('updatePhosphorousRetention', value);
      },
    },
    sedimentRetention: {
      get() {
        return this.$store.state.sedimentRetention;
      },
      set(value) {
        this.$store.commit('updateSedimentRetention', value);
      },
    },
    nitrogenReduction: {
      get() {
        return this.$store.state.nitrogenReduction;
      },
      set(value) {
        this.$store.commit('updateNitrogenReduction', value);
      },
    },
    surfaceWaterSupply: {
      get() {
        return this.$store.state.surfaceWaterSupply;
      },
      set(value) {
        this.$store.commit('updateSurfaceWaterSupply', value);
      },
    },
    shorelineProtection: {
      get() {
        return this.$store.state.shorelineProtection;
      },
      set(value) {
        this.$store.commit('updateShorelineProtection', value);
      },
    },
    carbonStorage: {
      get() {
        return this.$store.state.carbonStorage;
      },
      set(value) {
        this.$store.commit('updateCarbonStorage', value);
      },
    },
    floristicIntegrity: {
      get() {
        return this.$store.state.floristicIntegrity;
      },
      set(value) {
        this.$store.commit('updateFloristicIntegrity', value);
      },
    },
    watershedAcres: {
      get() {
        return this.$store.state.watershedAcres;
      },
      set(value) {
        this.$store.commit('updateWatershedAcres', value);
      },
    },
    wetlandId: {
      get() {
        return this.$store.state.wetlandId;
      },
      set(value) {
        this.$store.commit('updateWetlandId', value);
      },
    },
    overallFeas: {
      get() {
        return this.$store.state.overallFeas;
      },
      set(value) {
        this.$store.commit('updateOverallFeas', value);
      },
    },
    landUseCons: {
      get() {
        return this.$store.state.landUseCons;
      },
      set(value) {
        this.$store.commit('updateLandUseCons', value);
      },
    },
    invasiveSpeciesCons: {
      get() {
        return this.$store.state.invasiveSpeciesCons;
      },
      set(value) {
        this.$store.commit('updateinvasiveSpeciesCons', value);
      },
    },
    loadingRf: {
      get() {
        return this.$store.state.loadingRf;
      },
      set(value) {
        this.$store.commit('updateLoadingRf', value);
      },
    },
    loadingComplete: {
      get() {
        return this.$store.state.loadingComplete;
      },
      set(value) {
        this.$store.commit('updateLoadingComplete', value);
      },
    },
  },
  methods: {
    noGuild() {
      this.guild = '';
      this.removeGuild = true;
    },
    optionUpdate() {
      this.optionLayers = {};

      this.options.forEach((option) => {
        if (option.label == this.option) {
          this.optionLayers = {
            id8: option.id8,
            id10: option.id10,
            id12: option.id12,
          };
        }
      });
    },
  },
  watch: {
    rfOption() {
      this.rfLayer = 0;
      // this.overallFeas = 0;
      // this.landUseCons = 0;
      // this.invasiveSpeciesCons = 0;

      this.wetlandIdString = '';
      this.watershedAcres = 0;

      this.rfOptions.forEach((option) => {
        if (option.label === this.rfOption) {
          this.rfLayer = option.id;
        }
      });
    },
    serviceOption() {
      this.serviceLayer = 0;

      this.serviceOptions.forEach((option) => {
        if (option.label == this.serviceOption) {
          if (this.serviceType === 'nos') {
            this.serviceLayer = option.nosId;
          } else if (this.serviceType === 'rf') {
            this.serviceLayer = option.rfId;
          }
        }
      });
    },
    guild() {
      this.guildOptions.forEach((option) => {
        console.log(option.value);
        console.log(this.guild);
        if (option.value == this.guild) {
          this.guildLayer = option.id;
        }
      });

      console.log(this.guildLayer);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.option-description {
  background: white;
  border-radius: 2px;
  padding: 5px;
  margin-left: 25px;
}
#print-header {
  position: absolute;
  top: 0px;
  height: 30px;
}
#print-footer {
  position: absolute;
  bottom: 0px;
  height: 30px;
}
#print-map {
  position: absolute;
  top: 30px;
  height: 500px;
}
#guild-button {
  margin: auto;
  width: fit-content;
  display: block;
}
#overall-feas-negative {
  display: inline-block;
  background-color: rgb(254, 229, 217);
  border: 1px solid black;
  border-radius: 0 !important;
  width: 20px;
  height: 20px;
}
#overall-feas-zero {
  display: inline-block;
  background-color: rgb(252, 174, 145);
  border: 1px solid black;
  border-radius: 0 !important;
  width: 20px;
  height: 20px;
}
#overall-feas-one {
  display: inline-block;
  background-color: rgb(251, 106, 74);
  border: 1px solid black;
  border-radius: 0 !important;
  width: 20px;
  height: 20px;
}
#overall-feas-two {
  display: inline-block;
  background-color: rgb(222, 45, 38) !important;
  border: 1px solid black;
  border-radius: 0 !important;
  width: 20px;
  height: 20px;
}
#overall-feas-three {
  display: inline-block;
  background-color: rgb(165, 15, 21);
  border: 1px solid black;
  border-radius: 0 !important;
  width: 20px;
  height: 20px;
}
#land-less-one {
  display: inline-block;
  background-color: rgb(254, 229, 217);
  border: 1px solid black;
  border-radius: 0 !important;
  width: 20px;
  height: 20px;
}
#land-one {
  display: inline-block;
  background-color: rgb(252, 174, 145);
  border: 1px solid black;
  border-radius: 0 !important;
  width: 20px;
  height: 20px;
}
#land-two {
  display: inline-block;
  background-color: rgb(251, 106, 74);
  border: 1px solid black;
  border-radius: 0 !important;
  width: 20px;
  height: 20px;
}
#land-more-two {
  display: inline-block;
  background-color: rgb(203, 24, 29);
  border: 1px solid black;
  border-radius: 0 !important;
  width: 20px;
  height: 20px;
}
#invasive-less-two {
  display: inline-block;
  background-color: rgb(254, 229, 217);
  border: 1px solid black;
  border-radius: 0 !important;
  width: 20px;
  height: 20px;
}
#invasive-two {
  display: inline-block;
  background-color: rgb(252, 174, 145);
  border: 1px solid black;
  border-radius: 0 !important;
  width: 20px;
  height: 20px;
}
#invasive-one {
  display: inline-block;
  background-color: rgb(251, 106, 74);
  border: 1px solid black;
  border-radius: 0 !important;
  width: 20px;
  height: 20px;
}
#invasive-more-zero {
  display: inline-block;
  background-color: rgb(203, 24, 29);
  border: 1px solid black;
  border-radius: 0 !important;
  width: 20px;
  height: 20px;
}
</style>

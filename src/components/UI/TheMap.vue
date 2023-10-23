<template>
  <div id="map">
    <!-- <div id="supportingLayers" v-if="$store.state.config.supportingLayersOnMap">
      <SupportingLayers displayClass="supportingLayersMap" />
    </div> -->
    <div id="toolbarDiv" class="">
      <button
        id="distance"
        class="esri-widget--button esri-interactive esri-icon-measure-line esriCustomButton"
        title="Distance Measurement Tool"
        @click="activateLineMeasurement()"
      ></button>
      <button
        id="area"
        class="esri-widget--button esri-interactive esri-icon-measure-area esriCustomButton"
        title="Area Measurement Tool"
        @click="activateAreaMeasurement()"
      ></button>
      <button
        id="clear"
        class="esri-widget--button esri-interactive esri-icon-trash esriCustomButton"
        title="Clear Measurements"
        @click="clearMeasurements()"
      ></button>
      <button
        id="printBtn"
        class="esri-widget--button esri-interactive esri-icon-printer esriCustomButton"
        title="Print Map"
        @click="getMapPrint()"
      ></button>
    </div>
    <div id="info">
      <span id="name"></span>
      <span id="huc"></span>
    </div>
  </div>
</template>

<script>
// import SupportingLayers from '../AppTools/SupportingLayers.vue';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import MapImageLayer from '@arcgis/core/layers/MapImageLayer';
// import Sublayer from '@arcgis/core/layers/support/Sublayer.js';
import Legend from '@arcgis/core/widgets/Legend';
import Measurement from '@arcgis/core/widgets/Measurement';
import Expand from '@arcgis/core/widgets/Expand';
import BasemapGallery from '@arcgis/core/widgets/BasemapGallery';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import ScaleBar from '@arcgis/core/widgets/ScaleBar';
import Search from '@arcgis/core/widgets/Search.js';
import PortalBasemapsSource from '@arcgis/core/widgets/BasemapGallery/support/PortalBasemapsSource';
import Portal from '@arcgis/core/portal/Portal';
import Graphic from '@arcgis/core/Graphic.js';
import Circle from '@arcgis/core/geometry/Circle.js';
import Sketch from '@arcgis/core/widgets/Sketch';
import Point from '@arcgis/core/geometry/Point.js';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol.js';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer.js';
// import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol.js';
// import FeatureSet from '@arcgis/core/rest/support/FeatureSet.js';
// import Extent from '@arcgis/core/geometry/Extent.js';
// import Renderer from '@arcgis/core/renderers/Renderer.js';
// import FeatureFilter from '@arcgis/core/layers/support/FeatureFilter';
// import FeatureEffect from '@arcgis/core/layers/support/FeatureEffect';

//global in order to have access to the maplayer
let esri = {
  mapView: '',
  modelLayer: '',
  supportingMapLayer: '',
  legend: '',
  map: '',
  measurement: '',
  lgExpand: '',
  mapImage: '',
  sketch: '',
  graphicsLayer: '',
  selectedWatershed: '',
  selectedWatershedLayerView: '',
  rfWatershed: '',
  rfWatershedLayerView: '',
  createEvent: false,
  selectSite: false,
  serviceChangeWs: '',
};

export default {
  name: 'TheMap',
  components: {
    // SupportingLayers,
  },
  props: ['searchText'],
  data() {
    return {
      active: true,
      upstreamFeatures: [
        {
          st: 'sfr_1',
          qt: 'Muk R. at Fox R.',
          lk: ['lk1', 'lk2', 'lk3', 'lk4', 'lk5', 'lk6', 'lk7', 'lk8'],
        },
        { st: 'sfr_2', qt: 'Muk Trib below I43', lk: [] },
        {
          st: 'sfr_3',
          qt: 'Muk R. below Holz Pkwy',
          lk: ['lk1', 'lk2', 'lk3', 'lk4', 'lk5', 'lk6', 'lk7', 'lk8'],
        },
        {
          st: 'sfr_4',
          qt: 'Muk R. below Lower Phantom Lake',
          lk: ['lk1', 'lk2', 'lk3', 'lk4', 'lk5', 'lk6', 'lk7', 'lk8'],
        },
        {
          st: 'sfr_5',
          qt: 'Muk R. at Lower Phantom Lake',
          lk: ['lk1', 'lk3', 'lk4', 'lk5', 'lk6', 'lk7', 'lk8'],
        },
        {
          st: 'sfr_6',
          qt: 'Muk R. below Beulah Rd',
          lk: ['lk3', 'lk4', 'lk6', 'lk7', 'lk8'],
        },
        { st: 'sfr_7', qt: 'Muk Trib at Muk R.', lk: ['lk1', 'lk5'] },
        { st: 'sfr_8', qt: 'Muk Trib below Lake Beulah', lk: ['lk1', 'lk5'] },
        { st: 'sfr_9', qt: 'Muk Trib at Town Line Rd', lk: ['lk5'] },
        {
          st: 'sfr_10',
          qt: 'Muk R. at Rainbow Spring Rd',
          lk: ['lk3', 'lk4', 'lk6', 'lk7', 'lk8'],
        },
        {
          st: 'sfr_11',
          qt: 'Muk R. below Eagle Spring Lake',
          lk: ['lk3', 'lk4', 'lk7', 'lk8'],
        },
        { st: 'sfr_12', qt: 'Jericho Ck at Co Rd LO', lk: [] },
        { st: 'sfr_13', qt: 'Jericho Ck at Co Rd NN', lk: [] },
        {
          st: 'sfr_14',
          qt: 'Muk R. at Eagle Spring Lake',
          lk: ['lk4', 'lk7', 'lk8'],
        },
        { st: 'sfr_15', qt: 'Muk R. at Lulu Lake', lk: ['lk7', 'lk8'] },
        { st: 'sfr_16', qt: 'Muk R. below Bluff Rd Fen', lk: ['lk7', 'lk8'] },
        { st: 'sfr_17', qt: 'Muk Trib below Bluff Rd Fen', lk: ['lk7'] },
        { st: 'sfr_18', qt: 'Muk R. at Bluff Rd', lk: ['lk7'] },
      ],
      radios: [],
      h6: false,
      h8: false,
      h10: false,
      h12: false,
      selectedHuc: '',
      layerIndex: 0,
      highlightWetland: '',
      legend: '',
    };
  },
  computed: {
    supportingMapVisibleLayers() {
      //returns list of all ticked objects [{mapService: index in config, id: layerid, type: type}, ...]
      return this.$store.state.tree.tickedObj;
    },
    supportingVisibleLayerOpacity() {
      //returns object {value: OpacVal, id: Layerid}
      return this.$store.state.supportingVisibleLayerOpacity;
    },
    selectedFeatures() {
      return this.$store.state.selectedFeatures;
    },
    // newLocationValue() {
    //   return this.$store.state.locationValue;
    // },
    locationValue: {
      get() {
        return this.$store.state.locationValue;
      },
      set(value) {
        this.$store.commit('updateLocationValue', value);
      },
    },
    mapQuery() {
      return this.$store.state.mapQuery;
    },
    addRaster() {
      return this.$store.state.addRaster;
    },
    planType() {
      return this.$store.state.planType;
    },
    featCounter() {
      return this.$store.state.featCounter;
    },
    pointCoord: {
      get() {
        return this.$store.state.pointCoord;
      },
      set(value) {
        this.$store.commit('updatePointCoord', value);
      },
    },
    evalCircle: {
      get() {
        return this.$store.state.evalCircle;
      },
      set(value) {
        this.$store.commit('updateEvalCircle', value);
      },
    },
    circleFeatures: {
      get() {
        return this.$store.state.circleFeatures;
      },
      set(value) {
        this.$store.commit('updateCircleFeatures', value);
      },
    },
    resultsFeatures: {
      get() {
        return this.$store.state.resultsFeatures;
      },
      set(value) {
        this.$store.commit('updateResultsFeatures', value);
      },
    },
    nonCoordLoc() {
      return this.$store.state.nonCoordLoc;
    },
    projectType() {
      return this.$store.state.projectType;
    },
    wbdApp() {
      return this.$store.state.wbdApp;
    },
    wetlandWatersheds: {
      get() {
        return this.$store.state.wetlandWatersheds;
      },
      set(value) {
        this.$store.commit('updateWetlandWatersheds', value);
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
    hucHover: {
      get() {
        return this.$store.state.hucHover;
      },
      set(value) {
        this.$store.commit('updateHucHover', value);
      },
    },
    rangeOfService: {
      get() {
        return this.$store.state.rangeOfService;
      },
      set(value) {
        this.$store.commit('updateRangeOfService', value);
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
    optionLayers() {
      return this.$store.state.optionLayers;
    },
    rfLayer() {
      return this.$store.state.rfLayer;
    },
    serviceLayer() {
      return this.$store.state.serviceLayer;
    },
    guildLayer() {
      return this.$store.state.guildLayer;
    },
    removeGuild() {
      return this.$store.state.removeGuild;
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
        this.$store.commit('updateInvasiveSpeciesCons', value);
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
    firstSelected: {
      get() {
        return this.$store.state.firstSelected;
      },
      set(value) {
        this.$store.commit('updateFirstSelected', value);
      },
    },
    previousSelected() {
      return this.$store.state.previousSelected;
    },
    selectedData: {
      get() {
        return this.$store.state.selectedData;
      },
      set(value) {
        this.$store.commit('updateSelectedData', value);
      },
    },
    rfData: {
      get() {
        return this.$store.state.rfData;
      },
      set(value) {
        this.$store.commit('updateRfData', value);
      },
    },
    showCombined: {
      get() {
        return this.$store.state.showCombined;
      },
      set(value) {
        this.$store.commit('updateShowCombined', value);
      },
    },
  },
  watch: {
    supportingMapVisibleLayers() {
      this.updateSupportingVisibility();
    },
    supportingVisibleLayerOpacity() {
      this.updateSupportingOpacity();
    },
    mapQuery() {
      let queryTitle = '';
      let layerTitle = '';

      if (this.addRaster === true) {
        console.log(this.mapQuery);

        esri.mapImage.sublayers.forEach((sub) => {
          layerTitle = sub.title;
          queryTitle = this.mapQuery;
          sub.visible = false;

          if (queryTitle === layerTitle) {
            sub.visible = true;
            console.log(sub);
          } else {
            sub.visible = false;
          }
        });
      }
      if (this.addRaster === false) {
        console.log(this.addRaster);
        esri.mapImage.sublayers.forEach((sub) => {
          console.log(sub.visible);
          sub.visible = false;
        });
      }
    },
    planType() {
      esri.mapView.graphics.removeAll();
    },
    optionLayers() {
      console.log(this.optionLayers);
      console.log(this.wetlandWatersheds.length);
      if (this.wetlandWatersheds.length == 1) {
        this.updateFeatureLayer(this.optionLayers.id8);
        console.log(this.optionLayers.id8);
      } else if (this.wetlandWatersheds.length == 2) {
        this.updateFeatureLayer(this.optionLayers.id10);
      } else if (this.wetlandWatersheds.length == 3) {
        this.updateFeatureLayer(this.optionLayers.id12);
      }
    },
    removeGuild() {
      if (this.removeGuild == true) {
        esri.mapImage.findSublayerById(48).visible = false;
        esri.mapImage.findSublayerById(49).visible = false;
        esri.mapImage.findSublayerById(50).visible = false;
        esri.mapImage.findSublayerById(51).visible = false;
        esri.mapImage.findSublayerById(52).visible = false;
        esri.mapImage.findSublayerById(53).visible = false;
        this.removeGuild == false;
      }
    },
    guildLayer() {
      //figure out how to remove previous guild layer
      esri.mapImage.findSublayerById(48).visible = false;
      esri.mapImage.findSublayerById(49).visible = false;
      esri.mapImage.findSublayerById(50).visible = false;
      esri.mapImage.findSublayerById(51).visible = false;
      esri.mapImage.findSublayerById(52).visible = false;
      esri.mapImage.findSublayerById(53).visible = false;

      esri.mapImage.findSublayerById(this.guildLayer).visible = true;
    },
    serviceLayer() {
      esri.mapImage.findSublayerById(this.layerIndex).visible = false;
      esri.mapImage.findSublayerById(this.rfLayer).visible = false;
      esri.map.remove(esri.selectedWatershed);
      esri.map.remove(esri.rfWatershed);
      if (esri.serviceChangeWs) {
        esri.map.remove(esri.serviceChangeWs);
      }
      esri.serviceChangeWs = '';
      // this.h8 = true;
      // esri.rfWatershed = '';

      // if (this.highlightWetland) {
      //   this.highlightWetland.remove();
      //   this.highlightWetland = null;
      // }

      esri.mapImage.sublayers.forEach((layer) => {
        if (
          layer.title ==
          'Potentially Restorable Wetlands - ' + this.serviceOption
        ) {
          this.layerIndex = layer.id;
          let urlRF;

          urlRF =
            'https://services2.coastalresilience.org/arcgis/rest/services/Wisconsin/wi_wetlands_by_design/MapServer/' +
            this.serviceLayer;

          esri.serviceChangeWs = new FeatureLayer({
            url: urlRF,
            title: 'Potentially Restorable Wetlands - ' + this.serviceOption,
          });

          esri.serviceChangeWs.definitionExpression =
            "WHUC10 = '" + this.selectedHuc + "'";
          // esri.map.add(esri.serviceChangeWs);
        }

        if (layer.title == 'Current Wetlands - ' + this.serviceOption) {
          this.layerIndex = layer.id;

          let url =
            'https://services2.coastalresilience.org/arcgis/rest/services/Wisconsin/wi_wetlands_by_design/MapServer/' +
            this.layerIndex;

          esri.selectedWatershed = new FeatureLayer({
            url: url,
            title: this.serviceOption,
          });

          esri.selectedWatershed.definitionExpression =
            "WHUC10 = '" + this.selectedHuc + "'";
          esri.map.add(esri.selectedWatershed);
          // esri.map.add(esri.serviceChangeWs);
        }

        esri.map.add(esri.serviceChangeWs);
      });
    },
    serviceType() {
      if (this.highlightWetland) {
        this.highlightWetland.remove();
        this.highlightWetland = null;
      }

      esri.mapImage.findSublayerById(54).visible = false;
      esri.map.remove(esri.rfWatershed);
      esri.map.remove(esri.selectedWatershed);
      if (this.serviceType === 'rf') {
        let urlRF;

        urlRF =
          'https://services2.coastalresilience.org/arcgis/rest/services/Wisconsin/wi_wetlands_by_design/MapServer/' +
          this.rfLayer;

        esri.rfWatershed = new FeatureLayer({
          url: urlRF,
          title: 'Wetland Feasibility - ' + this.rfOption,
        });

        esri.rfWatershed.definitionExpression =
          "WHUC10 = '" + this.selectedHuc + "'";

        if (esri.mapImage.findSublayerById(this.layerIndex).visible == true) {
          esri.mapImage.findSublayerById(this.layerIndex).visible = false;
        }
        esri.mapImage.findSublayerById(70).visible = true;
        esri.map.add(esri.rfWatershed);
        esri.map.remove(esri.selectedWatershed);
      } else if (this.serviceType === 'nos') {
        let urlRF;

        urlRF =
          'https://services2.coastalresilience.org/arcgis/rest/services/Wisconsin/wi_wetlands_by_design/MapServer/' +
          this.serviceLayer;

        esri.rfWatershed = new FeatureLayer({
          url: urlRF,
          title: 'Wetland Feasibility - ' + this.serviceOption,
        });

        esri.rfWatershed.definitionExpression =
          "WHUC10 = '" + this.selectedHuc + "'";

        esri.map.add(esri.rfWatershed);
        esri.mapImage.findSublayerById(70).visible = false;

        esri.map.add(esri.selectedWatershed);
      }
    },
    rfLayer() {
      esri.mapImage.findSublayerById(70).visible = true;
      esri.mapImage.findSublayerById(54).visible = false;

      esri.map.remove(esri.rfWatershed);
      let urlRF;

      if (this.serviceType == 'nos') {
        urlRF =
          'https://services2.coastalresilience.org/arcgis/rest/services/Wisconsin/wi_wetlands_by_design/MapServer/' +
          this.serviceLayer;
      } else if (this.serviceType == 'rf') {
        urlRF =
          'https://services2.coastalresilience.org/arcgis/rest/services/Wisconsin/wi_wetlands_by_design/MapServer/' +
          this.rfLayer;
      }

      esri.rfWatershed = new FeatureLayer({
        url: urlRF,
        title: 'Wetland Feasibility - ' + this.rfOption,
      });

      esri.rfWatershed.definitionExpression =
        "WHUC10 = '" + this.selectedHuc + "'";

      esri.map.add(esri.rfWatershed);
    },
    previousSelected() {
      if (esri.featureLayer) {
        esri.featureLayer.destroy();
      }
      if (esri.selectedWatershed) {
        esri.selectedWatershed.destroy();
      }
      if (esri.rfWatershed) {
        esri.rfWatershed.destroy();
      }
      if (esri.serviceChangeWs) {
        esri.serviceChangeWs.destroy();
      }
      if (this.highlightWetland) {
        this.highlightWetland.remove();
        this.highlightWetland = null;
      }
      if (this.previousSelected.hucLevel == 'HUC 6') {
        this.h8 = false;
        this.h10 = false;
        this.h12 = false;
        this.showServices = true;
        this.showNumServices = false;
        this.selectSite = false;
        this.rangeOfService = false;

        esri.defExp = "WHUC6 = '" + this.previousSelected.hucNum + "'";
        esri.mapImage.findSublayerById(0).definitionExpression =
          "WHUC8 <> '" + this.previousSelected.hucNum + "'";

        esri.mapImage.findSublayerById(1).visible = false;
        esri.mapImage.findSublayerById(3).visible = false;
        esri.mapImage.findSublayerById(4).visible = false;
        esri.mapImage.findSublayerById(2).visible = true;

        this.updateFeatureLayer(this.optionLayers.id8);

        this.wetlandWatersheds.forEach((i, index) => {
          if (i.desc != 'HUC 6') {
            this.wetlandWatersheds.splice(index);
          }
        });
      } else if (this.previousSelected.hucLevel == 'HUC 8') {
        this.h8 = true;
        this.h10 = false;
        this.h12 = false;
        this.showServices = true;
        this.showNumServices = false;
        this.selectSite = false;
        this.rangeOfService = false;

        esri.defExp = "WHUC8 = '" + this.previousSelected.hucNum + "'";
        esri.mapImage.findSublayerById(0).definitionExpression =
          "WHUC10 <> '" + this.previousSelected.hucNum + "'";

        esri.mapImage.findSublayerById(1).visible = false;
        esri.mapImage.findSublayerById(3).visible = true;
        esri.mapImage.findSublayerById(4).visible = false;
        esri.mapImage.findSublayerById(2).visible = false;

        this.updateFeatureLayer(this.optionLayers.id10);

        this.wetlandWatersheds.forEach((i, index) => {
          if (i.desc == 'HUC 10') {
            this.wetlandWatersheds.splice(index);
          }
        });
      }
    },
  },

  mounted() {
    esri.layers = new MapImageLayer({
      url:
        'https://cirrus.tnc.org/arcgis/rest/services/FN_Wisconsin/mukwonago_groundwater_data/MapServer',
      sublayers: esri.sublayers,
    });

    // Portal IDs for TNC Basemaps. Use any id to set the map's basemap.
    const tncHillshadeMapId = 'd22aed9a4acb4bc8ae8f2141732af496';
    const tncDarkMapId = '1f48b2b2456c44ad9c58d6741378c2ba';
    const oceansMapId = '67ab7f7c535c4687b6518e6d2343e8a2';
    const hybridMapId = '86265e5a4bbb4187a59719cf134e0018';
    console.log(tncDarkMapId, oceansMapId, hybridMapId);

    //select a basemap
    esri.map = new Map({
      basemap: {
        portalItem: {
          id: tncHillshadeMapId,
        },
      },
      layers: esri.layers,
    });

    //create the map view

    let c = [-91.393376, 44.666754];
    let z = 6;

    this.$watch('wbdApp', () => {
      if (this.wbdApp === true) {
        z = 6;
        c = [-91.01424, 44.960553];

        esri.mapImage = new MapImageLayer({
          url:
            'https://services2.coastalresilience.org/arcgis/rest/services/Wisconsin/wi_wetlands_by_design/MapServer',
          title: 'Wetlands By Design',
          sublayers: [
            {
              id: 1,
              title: 'HUC - 6 - Boundary',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 2,
              title: 'HUC - 8 - Boundary',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 3,
              title: 'HUC - 10 - Boundary',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 4,
              title: 'HUC - 12 - Boundary',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 5,
              title: 'Wetlands - Selected',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 6,
              title: 'Current Wetlands - Count of Services ≥ High',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 7,
              title: 'Current Wetlands - Flood Abatement',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 8,
              title: 'Current Wetlands - Fish and Aquatic Habitat',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 9,
              title: 'Current Wetlands - Phosphorous Retention',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 10,
              title: 'Current Wetlands - Sediment Retention',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 11,
              title: 'Current Wetlands - Nitrogen Reduction',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 12,
              title: 'Current Wetlands - Shoreline Protection',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 13,
              title: 'Current Wetlands - Carbon Storage',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 14,
              title: 'Current Wetlands - Floristic Integrity',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 15,
              title: 'Current Wetlands - Surface Water Supply',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 16,
              title:
                'Potentially Restorable Wetlands - Count of Services ≥ High',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 17,
              title: 'Potentially Restorable Wetlands - Flood Abatement',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 18,
              title:
                'Potentially Restorable Wetlands - Fish and Aquatic Habitat',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 19,
              title: 'Potentially Restorable Wetlands - Phosphorous Retention',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 20,
              title: 'Potentially Restorable Wetlands - Sediment Retention',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 21,
              title: 'Potentially Restorable Wetlands - Nitrogen Reduction',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 22,
              title: 'Potentially Restorable Wetlands - Shoreline Protection',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 23,
              title: 'Potentially Restorable Wetlands - Carbon Storage',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 24,
              title: 'Potentially Restorable Wetlands - Floristic Integrity',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 25,
              title: 'Potentially Restorable Wetlands - Surface Water Supply',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 26,
              title: 'HUC - 6 - Selected',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 27,
              title: 'HUC - 8 - Selected',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 28,
              title: 'HUC - 10 - Selected',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 29,
              title: 'HUC - 12 - Selected',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 30,
              title: 'HUC8 - Combined Services',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 31,
              title: 'HUC10 - Combined Services',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 32,
              title: 'HUC12 - Combined Services',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 33,
              title: 'HUC8 - Flood Abatement',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 34,
              title: 'HUC10 - Flood Abatement',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 35,
              title: 'HUC12 - Flood Abatement',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 36,
              title: 'HUC8 - Fish and Aquatic Habitat',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 37,
              title: 'HUC10 - Fish and Aquatic Habitat',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 38,
              title: 'HUC12 - Fish and Aquatic Habitat',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 39,
              title: 'HUC8 - Nutrient Transformation',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 40,
              title: 'HUC10 - Nutrient Transformation',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 41,
              title: 'HUC12 - Nutrient Transformation',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 42,
              title: 'HUC8 - Sediment Retention',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 43,
              title: 'HUC10 - Sediment Retention',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 44,
              title: 'HUC12 - Sediment Retention',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 45,
              title: 'HUC8 - Surface Water Supply',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 46,
              title: 'HUC10 - Surface Water Supply',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 47,
              title: 'HUC12 - Surface Water Supply',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 48,
              title: 'Forest Interior Birds Guild',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 49,
              title: 'Open Water Birds Guild',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 50,
              title: 'Shallow Marsh Birds Guild',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 51,
              title: 'Wet Shrub Birds Guild',
              visible: false,
              opacity: 0.7,
            },
            { id: 52, title: 'All Guilds', visible: false, opacity: 0.7 },
            {
              id: 53,
              title: 'All-Guild Restoration Opportunities',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 57,
              title: 'Existing Wetlands',
              visible: false,
              opacity: 0.7,
            },
            { id: 58, title: 'wetlands_040103', visible: false, opacity: 0.7 },
            { id: 59, title: 'wetlands_040301', visible: false, opacity: 0.7 },
            { id: 60, title: 'wetlands_040302', visible: false, opacity: 0.7 },
            { id: 61, title: 'wetlands_040400', visible: false, opacity: 0.7 },
            { id: 62, title: 'wetlands_070300', visible: false, opacity: 0.7 },
            { id: 63, title: 'wetlands_070400', visible: false, opacity: 0.7 },
            { id: 64, title: 'wetlands_070500', visible: false, opacity: 0.7 },
            { id: 65, title: 'wetlands_070600', visible: false, opacity: 0.7 },
            { id: 66, title: 'wetlands_0707001', visible: false, opacity: 0.7 },
            { id: 67, title: 'wetlands_0707002', visible: false, opacity: 0.7 },
            { id: 68, title: 'wetlands_070900', visible: false, opacity: 0.7 },
            { id: 69, title: 'wetlands_071200', visible: false, opacity: 0.7 },
            {
              id: 70,
              title: 'Restoration Feasibility - Existing Wetlands',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 54,
              title: 'Wetland Feasibility - Overall Feasibility',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 55,
              title: 'Wetland Feasibility - Land use considerations',
              visible: false,
              opacity: 0.7,
            },
            {
              id: 56,
              title: 'Wetland Feasibility - Invasive species considerations',
              visible: false,
              opacity: 0.7,
            },
            { id: 0, title: 'HUC - Mask', visible: false, opacity: 0.7 },
          ],
        });

        esri.map.removeAll();
        esri.map.remove(muk_watershed);
        esri.map.remove(muk_srl);
        esri.map.remove(muk_lakes);
        esri.map.remove(muk_fens);
        esri.map.remove(muk_streams);
        esri.graphicsLayer.removeAll();

        esri.mapView.goTo({ center: c, zoom: z });
        // esri.sketch.visible = true;
        esri.map.add(esri.mapImage);
        _this.updateFeatureLayer(1);
      } else {
        esri.defExp = '';

        z = 10;
        c = [-88.47431, 42.879521];

        esri.mapImage = new MapImageLayer({
          url:
            'https://services2.coastalresilience.org/arcgis/rest/services/Wisconsin/Mukwonago/MapServer/',
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
        });

        esri.map.removeAll();
        esri.map.remove(hucMask);
        esri.map.remove(huc6ws);
        esri.map.remove(huc8ws);
        esri.map.remove(huc10ws);
        esri.map.remove(huc12ws);
        this.wetlandWatersheds = [];
        this.h6 = false;
        this.h8 = false;
        this.h10 = false;
        this.h12 = false;
        this.showServices = false;
        this.showNumServices = false;
        this.rangeOfService = false;
        this.serviceType = '';
        this.selectedHuc = '';
        esri.graphicsLayer.removeAll();
        if (esri.featureLayer) {
          esri.featureLayer.destroy();
        }

        esri.mapView.whenLayerView(muk_srl).then(function(layerView) {
          muk_srlLayerView = layerView;
        });

        esri.mapView.whenLayerView(muk_lakes).then(function(layerView) {
          muk_lakesLayerView = layerView;
        });

        esri.mapView.whenLayerView(muk_fens).then(function(layerView) {
          muk_fensLayerView = layerView;
        });

        esri.mapView.goTo({ center: c, zoom: z });

        esri.map.add(muk_watershed);
        esri.map.add(muk_srl);
        esri.map.add(muk_lakes);
        esri.map.add(muk_fens);
        esri.map.add(muk_streams);
      }
    });

    esri.mapView = new MapView({
      map: esri.map,
      center: c,
      zoom: z,
      container: this.$el,
      highlightOptions: {
        color: 'yellow',
      },
    });

    //add supporting map layers listed in config
    this.$store.state.config.supportingMapLayers.forEach((service) => {
      let l = new MapImageLayer({
        url: service.mapService,
      });
      esri.map.add(l);
      l.when(function() {
        //create sublayer list
        let sublayerList = [];
        let layer = esri.map.layers.items.find((layer) => {
          return layer.type == 'map-image' && layer.url == service.mapService;
        });
        console.log(layer); //todo figure out why layer.sublayers is not working

        l.allSublayers.items.forEach((sublayer) => {
          //see if popup template recrod exists...
          let popups = service.popupTemplate;
          let layerConfig = popups.find(({ id }) => id == sublayer.id);
          //if the template is configured
          if (layerConfig) {
            //create template
            let fieldInfos = layerConfig.fields;
            let template = {
              actions: [],
              content: [
                {
                  type: 'fields',
                  fieldInfos: fieldInfos,
                },
              ],
            };
            sublayerList.push({
              id: sublayer.id,
              visible: false,
              opacity: 1,
              popupTemplate: template,
            });
            console.log(sublayer.id, layerConfig.fields);
          }
          //if there is no popup push without a template
          else {
            sublayerList.push({
              id: sublayer.id,
              visible: false,
              opacity: 1,
            });
          }
        });
        l.sublayers = sublayerList;
      });
    });

    // Mukwonago Layers

    const muk_watershed = new FeatureLayer({
      url:
        'https://services2.coastalresilience.org/arcgis/rest/services/Wisconsin/Mukwonago/MapServer/0',
    });

    const muk_srl = new FeatureLayer({
      url:
        'https://services2.coastalresilience.org/arcgis/rest/services/Wisconsin/Mukwonago/MapServer/1',
    });
    let muk_srlLayerView = '';
    console.log(muk_srlLayerView);

    const muk_lakes = new FeatureLayer({
      url:
        'https://services2.coastalresilience.org/arcgis/rest/services/Wisconsin/Mukwonago/MapServer/2',
    });
    let muk_lakesLayerView = '';
    console.log(muk_lakesLayerView);

    const muk_fens = new FeatureLayer({
      url:
        'https://services2.coastalresilience.org/arcgis/rest/services/Wisconsin/Mukwonago/MapServer/3',
    });
    let muk_fensLayerView = '';
    console.log(muk_fensLayerView);

    const muk_streams = new FeatureLayer({
      url:
        'https://services2.coastalresilience.org/arcgis/rest/services/Wisconsin/Mukwonago/MapServer/4',
    });

    const all_results = new FeatureLayer({
      url:
        'https://services2.coastalresilience.org/arcgis/rest/services/Wisconsin/Mukwonago/MapServer/5',
    });

    let _this = this;

    let highlightLake = '';
    let highlightStream = '';

    const srf_lakes = new FeatureLayer({
      url:
        'https://services2.coastalresilience.org/arcgis/rest/services/Wisconsin/Mukwonago/MapServer/6',
      outFields: ['*'],
    });

    const srf_streams = new FeatureLayer({
      url:
        'https://services2.coastalresilience.org/arcgis/rest/services/Wisconsin/Mukwonago/MapServer/7',
      outFields: ['*'],
    });

    // Wetlands by Design layers
    const hucMask = new FeatureLayer({
      url:
        'https://services2.coastalresilience.org/arcgis/rest/services/Wisconsin/wi_wetlands_by_design/MapServer/0',
      outFields: ['*'],
    });
    const huc6ws = new FeatureLayer({
      url:
        'https://services2.coastalresilience.org/arcgis/rest/services/Wisconsin/wi_wetlands_by_design/MapServer/1',
      outFields: ['*'],
    });
    const huc8ws = new FeatureLayer({
      url:
        'https://services2.coastalresilience.org/arcgis/rest/services/Wisconsin/wi_wetlands_by_design/MapServer/2',
      outFields: ['*'],
    });
    const huc10ws = new FeatureLayer({
      url:
        'https://services2.coastalresilience.org/arcgis/rest/services/Wisconsin/wi_wetlands_by_design/MapServer/3',
      outFields: ['*'],
    });
    const huc12ws = new FeatureLayer({
      url:
        'https://services2.coastalresilience.org/arcgis/rest/services/Wisconsin/wi_wetlands_by_design/MapServer/4',
      outFields: ['*'],
    });

    _this.$watch('mapQuery', () => {
      if (highlightStream) {
        highlightStream.remove();
      }
      if (highlightLake) {
        highlightLake.remove();
      }
      if (_this.addRaster === true) {
        esri.map.add(srf_lakes);
        let srf_lakesLayerView;
        esri.mapView.whenLayerView(srf_lakes).then(function(layerView) {
          srf_lakesLayerView = layerView;
        });

        esri.map.add(srf_streams);
        let srf_streamsLayerView;
        esri.mapView.whenLayerView(srf_streams).then(function(layerView) {
          srf_streamsLayerView = layerView;
        });

        this.upstreamFeatures.forEach((feat) => {
          if (this.mapQuery != '') {
            if (this.mapQuery.startsWith(feat.qt)) {
              console.log(feat);
              let lake;
              let srl;
              if (feat.lk != []) {
                feat.lk.forEach((a) => {
                  lake = "'" + a + "'";
                  const queryLakes = srf_lakes.createQuery();
                  queryLakes.where = 'lake_name = ' + lake;

                  srf_lakes.queryFeatures(queryLakes).then(function(result) {
                    let feature = result.features[0];
                    console.log(feature.attributes.lake_name);
                    if (highlightLake) {
                      highlightLake.remove();
                      highlightLake = null;
                    }
                    highlightLake = srf_lakesLayerView.highlight(
                      feature.attributes['OBJECTID']
                    );
                  });
                });
              }
              if (feat.st) {
                srl = "'" + feat.st + "'";
                const queryStreams = srf_streams.createQuery();
                queryStreams.where = 'sfr_name =' + srl;
                console.log(queryStreams.where);

                srf_streams.queryFeatures(queryStreams).then(function(result) {
                  let feature = result.features[0];
                  if (highlightStream) {
                    highlightStream.remove();
                    highlightStream = null;
                  }
                  highlightStream = srf_streamsLayerView.highlight(
                    feature.attributes['OBJECTID']
                  );
                  console.log('streams highlighted');
                });
              }
            }
          }
        });
      } else {
        if (highlightLake) {
          highlightLake.remove();
        }
        if (highlightStream) {
          highlightStream.remove();
        }
        esri.map.remove(srf_lakes);
        esri.map.remove(srf_streams);
      }
    });

    esri.mapView.ui.add('info', 'top-right');

    esri.mapView.on('pointer-move', (event) => {
      if (this.wbdApp == true) {
        this.fixLegendLabels();

        let huc;
        let objectID;

        esri.mapView.hitTest(event).then((e) => {
          if (e.results.length) {
            const hitGraphic = e.results[0].graphic;
            const name = hitGraphic.attributes.name;
            let query;

            if (name) {
              if (this.h6 == false) {
                huc = hitGraphic.attributes.WHUC6;
                query = esri.featureLayer.createQuery();
                objectID = hitGraphic.attributes.OBJECTID;
                query.where = 'OBJECTID = ' + objectID;
              } else if (this.h6 == true && this.h8 == false) {
                query = esri.featureLayer.createQuery();
                objectID = hitGraphic.attributes.OBJECTID;
                query.where = 'OBJECTID = ' + objectID;

                huc = hitGraphic.attributes.WHUC8;
                this.countOfServices = this.numToLoss(
                  hitGraphic.attributes.AllNeeds
                );
                this.floodAbatement = this.numToLoss(
                  hitGraphic.attributes.FloodAb
                );
                this.sedimentRetention = this.numToLoss(
                  hitGraphic.attributes.SedPhos
                );
                this.nitrogenReduction = this.numToLoss(
                  hitGraphic.attributes.Nitrogen
                );
                this.fishAquaticHabitat = this.numToLoss(
                  hitGraphic.attributes.FishAqua
                );
                this.surfaceWaterSupply = this.numToLoss(
                  hitGraphic.attributes.SurfWat
                );
              } else if (this.h8 == true && this.h10 == false) {
                query = esri.featureLayer.createQuery();
                objectID = hitGraphic.attributes.OBJECTID;
                query.where = 'OBJECTID = ' + objectID;

                huc = hitGraphic.attributes.WHUC8;
                this.countOfServices = this.numToLoss(
                  hitGraphic.attributes.AllNeeds
                );
                this.floodAbatement = this.numToLoss(
                  hitGraphic.attributes.FloodAb
                );
                this.sedimentRetention = this.numToLoss(
                  hitGraphic.attributes.SedPhos
                );
                this.nitrogenReduction = this.numToLoss(
                  hitGraphic.attributes.Nitrogen
                );
                this.fishAquaticHabitat = this.numToLoss(
                  hitGraphic.attributes.FishAqua
                );
                this.surfaceWaterSupply = this.numToLoss(
                  hitGraphic.attributes.SurfWat
                );
              }
              this.showCombined = true;
              document.getElementById('info').style.visibility = 'visible';
              document.getElementById('huc').innerHTML = huc;
              document.getElementById('name').innerHTML = name + ' - ';
            } else {
              document.getElementById('info').style.visibility = 'hidden';
              this.showCombined = false;
            }
          }
        });
      }
    });

    esri.mapView.on('click', function(response) {
      if (_this.wbdApp == false) {
        if (_this.planType === 'evaluate') {
          // let point;

          _this.circleFeatures = [];
          _this.resultsFeatures = [];

          let markerSymbol = new SimpleMarkerSymbol({
            style: 'circle',
            color: [125, 125, 125],
            size: 5,
            outline: {
              color: [225, 0, 0],
              width: 1,
            },
          });

          let point = new Point({
            x: response.mapPoint.longitude,
            y: response.mapPoint.latitude,
            symbol: markerSymbol,
          });

          let pointGraphic = new Graphic({
            geometry: point,
            symbol: markerSymbol,
          });

          _this.pointCoord =
            response.mapPoint.longitude.toFixed(6) +
            ', ' +
            response.mapPoint.latitude.toFixed(6);

          let circle = new Circle({
            center: point,
            geodesic: true,
            radius: 2,
            radiusUnit: 'miles',
          });

          let circleGraphic = new Graphic({
            geometry: circle,
            symbol: {
              type: 'simple-fill',
              color: null,
              outline: {
                type: 'simple-line',
                color: [125, 125, 125],
                width: 2,
                style: 'short-dash',
              },
            },
          });

          const query = muk_srl.createQuery(circle);
          const queryb = muk_lakes.createQuery(circle);
          const queryc = muk_fens.createQuery(circle);
          const queryd = all_results.createQuery(point);

          query.geometry = circle;
          queryb.geometry = circle;
          queryc.geometry = circle;
          queryd.geometry = point;

          muk_srl.queryFeatures(query).then(function(result) {
            result.features.forEach((feat) => {
              _this.circleFeatures.push(feat.attributes);
            });
          });

          muk_lakes.queryFeatures(queryb).then(function(result) {
            result.features.forEach((feat) => {
              _this.circleFeatures.push(feat.attributes);
            });
          });

          muk_fens.queryFeatures(queryc).then(function(result) {
            result.features.forEach((feat) => {
              _this.circleFeatures.push(feat.attributes);
            });
          });

          all_results.queryFeatures(queryd).then(function(result) {
            result.features.forEach((feat) => {
              _this.resultsFeatures.push(feat.attributes);
            });
          });

          console.log(_this.circleFeatures);
          console.log(_this.resultsFeatures);

          esri.mapView.graphics.removeAll();
          esri.mapView.graphics.add(circleGraphic);
          esri.mapView.graphics.add(pointGraphic);

          _this.evalCircle = true;
        }
      } else if (_this.wbdApp == true) {
        let huc6 = {};
        let huc8 = {};
        let huc10 = {};
        // let huc12 = {};
        let query;

        let point = new Point({
          x: response.mapPoint.longitude,
          y: response.mapPoint.latitude,
        });

        const opts = {
          include: esri.featureLayer,
        };

        let a = document.getElementsByClassName('esri-legend__layer-caption');

        for (let i = 0; i < a.length; i++) {
          if (a[i].innerHTML == 'ALL_RANK' || a[i].innerHTML == 'AllNeeds') {
            a[i].innerHTML = '';
          }
        }

        esri.mapView.hitTest(response, opts).then((e) => {
          if (e.results.length > 0) {
            if (_this.h6 == false) {
              query = huc6ws.createQuery(point);
              query.geometry = point;

              esri.mapImage.findSublayerById(0).visible = true;
              esri.mapImage.findSublayerById(1).visible = false;
              esri.mapImage.findSublayerById(2).visible = true;

              huc6ws.queryFeatures(query).then(function(result) {
                let feature = result.features[0].attributes;
                huc6 = {
                  desc: 'HUC 6',
                  name: feature.name,
                  huc: feature.WHUC6,
                };
                _this.selectedHuc = feature.WHUC6;
                _this.h6 = true;
                _this.wetlandWatersheds.push(huc6);
                _this.showServices = true;
                _this.firstSelected = true;

                esri.defExp = "WHUC6 = '" + _this.selectedHuc + "'";

                _this.updateFeatureLayer(_this.optionLayers.id8);
              });
            } else if (_this.h6 == true && _this.h8 == false) {
              esri.map.remove(huc8ws);
              esri.mapImage.findSublayerById(2).visible = false;
              esri.mapImage.findSublayerById(3).visible = true;
              console.log(esri.legend);

              query = huc8ws.createQuery(point);
              query.geometry = point;
              huc8ws.queryFeatures(query).then(function(result) {
                let feature = result.features[0].attributes;
                huc8 = {
                  desc: 'HUC 8',
                  name: feature.name,
                  huc: feature.WHUC8,
                };
                _this.selectedHuc = feature.WHUC8;
                _this.wetlandWatersheds.push(huc8);
                _this.h8 = true;

                esri.defExp = "WHUC8 = '" + _this.selectedHuc + "'";
                _this.updateFeatureLayer(_this.optionLayers.id10);
              });
            } else if (_this.h8 == true && _this.h10 == false) {
              esri.map.remove(huc10ws);
              esri.map.remove(esri.rfWatershed);
              huc10 = {};

              if (esri.featureLayer) {
                esri.featureLayer.destroy();
              }

              _this.showServices = false;
              _this.showNumServices = true;

              query = huc10ws.createQuery(point);
              query.geometry = point;
              huc10ws.queryFeatures(query).then(function(result) {
                let feature = result.features[0].attributes;
                huc10 = {
                  desc: 'HUC 10',
                  name: feature.name,
                  huc: feature.WHUC10,
                };
                _this.selectedHuc = feature.WHUC10;
                _this.wetlandWatersheds.push(huc10);
                _this.h10 = true;
                _this.selectSite = true;

                esri.mapImage.findSublayerById(0).definitionExpression =
                  "WHUC10 <> '" + _this.selectedHuc + "'";

                // esri.defExp = "WHUC10 = '" + _this.selectedHuc + "'";
                // _this.updateFeatureLayer(_this.optionLayers.id12);
                esri.mapImage.sublayers.forEach((layer) => {
                  if (
                    layer.title ==
                    'Current Wetlands - ' + _this.serviceOption
                  ) {
                    _this.layerIndex = layer.id;

                    let url =
                      'https://services2.coastalresilience.org/arcgis/rest/services/Wisconsin/wi_wetlands_by_design/MapServer/' +
                      _this.layerIndex;

                    esri.selectedWatershed = new FeatureLayer({
                      url: url,
                      title: 'Current Wetlands - ' + _this.serviceOption,
                    });

                    esri.selectedWatershed.definitionExpression =
                      "WHUC10 = '" + _this.selectedHuc + "'";

                    let urlRF;

                    if (_this.serviceType == 'nos') {
                      urlRF =
                        'https://services2.coastalresilience.org/arcgis/rest/services/Wisconsin/wi_wetlands_by_design/MapServer/' +
                        _this.serviceLayer;
                    } else if (_this.serviceType == 'rf') {
                      urlRF =
                        'https://services2.coastalresilience.org/arcgis/rest/services/Wisconsin/wi_wetlands_by_design/MapServer/' +
                        _this.rfLayer;
                    }

                    esri.rfWatershed = new FeatureLayer({
                      url: urlRF,
                      title:
                        'Potentially Restorable Wetlands - ' +
                        _this.serviceOption,
                    });

                    esri.rfWatershedLayerView = {};

                    esri.mapView
                      .whenLayerView(esri.rfWatershed)
                      .then(function(layerView) {
                        esri.rfWatershedLayerView = layerView;
                      });

                    esri.rfWatershed.definitionExpression =
                      "WHUC10 = '" + _this.selectedHuc + "'";

                    if (esri.serviceChangeWs) {
                      esri.map.remove(esri.serviceChangeWs);
                      console.log('removed changews and added rfwatershed');
                    }
                    esri.map.add(esri.rfWatershed);

                    let a = document.getElementsByClassName(
                      'esri-legend__layer-caption'
                    );

                    for (let i = 0; i < a.length; i++) {
                      if (
                        a[i].innerHTML == 'ALL_RANK' ||
                        a[i].innerHTML == 'AllNeeds'
                      ) {
                        console.log('found an all rank');
                        a[i].innerHTML = '';
                      }
                    }

                    esri.map.add(esri.selectedWatershed);
                  }
                });
              });

              esri.mapView.goTo({ center: point, zoom: 9 });

              // _this.h6 = false;
              _this.h8 = false;
              // _this.h10 = false;
              _this.h12 = true;
              _this.showCombined = false;
            }
          } else if (_this.h12 == true) {
            // get range dat

            _this.fixLegendLabels();

            _this.rangeOfService = true;
            _this.wetlandIdString = '';
            _this.watershedAcres = 0;
            _this.watershedRange = [];
            let potentialId;

            let urlPRW =
              'https://services2.coastalresilience.org/arcgis/rest/services/Wisconsin/wi_wetlands_by_design/MapServer/70';

            let prwLayer = new FeatureLayer({
              url: urlPRW,
            });

            let point = new Point({
              x: response.mapPoint.longitude,
              y: response.mapPoint.latitude,
            });

            if (_this.serviceType === 'nos') {
              esri.selectedWatershedLayerView = {};

              esri.mapView
                .whenLayerView(esri.selectedWatershed)
                .then(function(layerView) {
                  esri.selectedWatershedLayerView = layerView;
                });

              let query = esri.selectedWatershed.createQuery(point);
              query.geometry = point;

              esri.selectedWatershed
                .queryFeatures(query)
                .then(function(result) {
                  let feature = result.features[0].attributes;
                  _this.selectedData = true;

                  if (_this.highlightWetland) {
                    _this.highlightWetland.remove();
                    _this.highlightWetland = null;
                  }

                  if (
                    _this.highlightWetland == null ||
                    _this.highlightWetland == ''
                  ) {
                    _this.highlightWetland = esri.selectedWatershedLayerView.highlight(
                      feature['OBJECTID']
                    );
                  }

                  _this.wetlandId = feature.wetlandIdString;
                  _this.floodAbatement = _this.numToRange(feature.FA_RANK);
                  _this.sedimentRetention = _this.numToRange(feature.SS_RANK);
                  _this.phosphorousRetention = _this.numToRange(
                    feature.PR_RANK
                  );
                  _this.nitrogenReduction = _this.numToRange(feature.NR_RANK);
                  _this.shorelineProtection = _this.numToRange(feature.SP_RANK);
                  _this.fishAquaticHabitat = _this.numToRange(feature.FAH_RANK);
                  _this.carbonStorage = _this.numToRange(feature.CS_RANK);
                  _this.floristicIntegrity = _this.numToRange(feature.FQ_RANK);
                  _this.surfaceWaterSupply = _this.numToRange(feature.SBS_RANK);
                  _this.countOfServices = _this.numToRange(feature.ALL_RANK);
                  _this.watershedAcres = feature.acres;
                });

              esri.rfWatershed.queryFeatures(query).then(function(result) {
                let feature = result.features[0].attributes;
                _this.rfData = true;

                if (_this.highlightWetland) {
                  _this.highlightWetland.remove();
                  _this.highlightWetland = null;
                }

                if (
                  _this.highlightWetland == null ||
                  _this.highlightWetland == ''
                ) {
                  _this.highlightWetland = esri.rfWatershedLayerView.highlight(
                    feature['OBJECTID']
                  );
                }

                _this.wetlandId = feature.wetlandIdString;
                _this.floodAbatement = _this.numToRange(feature.FA_RANK);
                _this.sedimentRetention = _this.numToRange(feature.SS_RANK);
                _this.phosphorousRetention = _this.numToRange(feature.PR_RANK);
                _this.nitrogenReduction = _this.numToRange(feature.NR_RANK);
                _this.shorelineProtection = _this.numToRange(feature.SP_RANK);
                _this.fishAquaticHabitat = _this.numToRange(feature.FAH_RANK);
                _this.carbonStorage = _this.numToRange(feature.CS_RANK);
                _this.floristicIntegrity = _this.numToRange(feature.FQ_RANK);
                _this.surfaceWaterSupply = _this.numToRange(feature.SBS_RANK);
                _this.countOfServices = _this.numToRange(feature.ALL_RANK);
                _this.watershedAcres = feature.acres;
              });
            } else if (_this.serviceType === 'rf') {
              esri.map.remove(esri.selectedWatershed);
              esri.map.remove(esri.serviceChangeWs);
              esri.mapImage.findSublayerById(_this.rfLayer).visible = true;

              let rfquery = esri.rfWatershed.createQuery(point);
              rfquery.geometry = point;

              esri.rfWatershed.queryFeatures(rfquery).then(function(result) {
                let feature = result.features[0].attributes;

                if (_this.highlightWetland) {
                  _this.highlightWetland.remove();
                  _this.highlightWetland = null;
                }

                if (
                  _this.highlightWetland == null ||
                  _this.highlightWetland == ''
                ) {
                  _this.highlightWetland = esri.rfWatershedLayerView.highlight(
                    feature['OBJECTID']
                  );
                }

                potentialId = feature.wetlandIdString;
                _this.watershedAcres = feature.acres;

                let prwquery = esri.rfWatershed.createQuery();
                prwquery.where = 'wetlandIdString = ' + "'" + potentialId + "'";

                _this.loadingRf = true;
                _this.loadingComplete = false;

                prwLayer.queryFeatures(prwquery).then(function(result) {
                  let feat = result.features[0].attributes;
                  _this.loadingRf = false;
                  _this.loadingComplete = true;

                  _this.wetlandId = feat.wetlandIdString;
                  _this.overallFeas = feat.FEAS_Total;
                  _this.landUseCons = feat.Num_Val;
                  _this.invasiveSpeciesCons = feat.IS_Num;
                });
              });
            }
          }
        });
      }
    });

    _this.$watch('locationValue', () => {
      console.log(this.locationValue);

      if (this.nonCoordLoc === true) {
        searchWidg.search(this.locationValue).then((event) => {
          this.searchResults = event.results;
          let geom = this.searchResults[0].results[0].feature.geometry;

          console.log(geom);

          if (_this.planType === 'evaluate') {
            // let point;

            _this.circleFeatures = [];
            _this.resultsFeatures = [];

            let markerSymbol = new SimpleMarkerSymbol({
              style: 'circle',
              color: [125, 125, 125],
              size: 5,
              outline: {
                color: [225, 0, 0],
                width: 1,
              },
            });

            let point = new Point({
              x: geom.longitude,
              y: geom.latitude,
              symbol: markerSymbol,
            });

            let pointGraphic = new Graphic({
              geometry: point,
              symbol: markerSymbol,
            });

            let circle = new Circle({
              center: point,
              geodesic: true,
              radius: 2,
              radiusUnit: 'miles',
            });

            let circleGraphic = new Graphic({
              geometry: circle,
              symbol: {
                type: 'simple-fill',
                color: null,
                outline: {
                  type: 'simple-line',
                  color: [125, 125, 125],
                  width: 2,
                  style: 'short-dash',
                },
              },
            });

            const query = muk_srl.createQuery(circle);
            const queryb = muk_lakes.createQuery(circle);
            const queryc = muk_fens.createQuery(circle);
            const queryd = all_results.createQuery(point);

            query.geometry = circle;
            queryb.geometry = circle;
            queryc.geometry = circle;
            queryd.geometry = point;

            muk_srl.queryFeatures(query).then(function(result) {
              result.features.forEach((feat) => {
                _this.circleFeatures.push(feat.attributes);
              });
            });

            muk_lakes.queryFeatures(queryb).then(function(result) {
              result.features.forEach((feat) => {
                _this.circleFeatures.push(feat.attributes);
              });
            });

            muk_fens.queryFeatures(queryc).then(function(result) {
              result.features.forEach((feat) => {
                _this.circleFeatures.push(feat.attributes);
              });
            });

            all_results.queryFeatures(queryd).then(function(result) {
              result.features.forEach((feat) => {
                _this.resultsFeatures.push(feat.attributes);
              });
            });

            console.log(_this.circleFeatures);
            console.log(_this.resultsFeatures);

            esri.mapView.graphics.removeAll();
            esri.mapView.graphics.add(circleGraphic);
            esri.mapView.graphics.add(pointGraphic);

            _this.evalCircle = true;
          }
        });
      }
    });

    _this.$watch('featCounter', () => {
      const rad = document.getElementsByClassName('q-radio');

      console.log(rad);

      for (let i = 0; i < rad.length; i++) {
        _this.radios.push(rad[i].ariaLabel);
      }

      let i;
      let q;

      _this.radios.forEach((r) => {
        i = r.split(' -');
        q = i[0];
      });

      for (let i = 0; i < rad.length; i++) {
        rad[i].addEventListener('mouseover', function() {
          console.log('I am hovering');

          if (_this.planType === 'search') {
            let highlightLakes = '';
            let highlightSrl = '';
            let highlightFens = '';

            const querya = muk_srl.createQuery();
            querya.where = 'CommonName = ' + "'" + q + "'";

            const queryb = muk_lakes.createQuery();
            queryb.where = 'CommonName = ' + "'" + q + "'";

            const queryc = muk_fens.createQuery();
            queryc.where = 'CommonName = ' + "'" + q + "'";

            muk_srl.queryFeatures(querya).then(function(result) {
              let feature = result.features[0];

              if (feature) {
                if (highlightSrl) {
                  highlightSrl.remove();
                  highlightSrl = null;
                } else {
                  highlightSrl = muk_srlLayerView.highlight(
                    feature.attributes['OBJECTID']
                  );
                }
              }
            });

            muk_lakes.queryFeatures(queryb).then(function(result) {
              let feature = result.features[0];

              if (feature) {
                if (highlightLakes) {
                  highlightLakes.remove();
                  highlightLakes = null;
                } else {
                  highlightLakes = muk_lakesLayerView.highlight(
                    feature.attributes['OBJECTID']
                  );
                }
              }
            });

            muk_fens.queryFeatures(queryc).then(function(result) {
              let feature = result.features[0];

              if (feature) {
                if (highlightFens) {
                  highlightFens.remove();
                  highlightFens = null;
                } else {
                  highlightFens = muk_fensLayerView.highlight(
                    feature.attributes['OBJECTID']
                  );
                }
              }
            });
          }
        });
      }
    });

    //add scalebar widget
    let scaleBar = new ScaleBar({
      view: esri.mapView,
      unit: 'dual',
    });
    esri.mapView.ui.add(scaleBar, {
      position: 'bottom-right',
    });

    // add search widget
    let searchWidg = new Search({
      view: esri.mapView,
    });
    esri.mapView.ui.add(searchWidg, {
      position: 'top-right',
      index: 0,
    });

    // sketch tools
    esri.graphicsLayer = new GraphicsLayer();
    esri.map.add(esri.graphicsLayer);
    esri.sketch = new Sketch({
      layer: esri.graphicsLayer,
      view: esri.mapView,
      creationMode: 'update',
      availableCreateTools: ['polygon'],
    });
    esri.mapView.ui.add(esri.sketch, 'top-leading');
    esri.sketch.visible = false;
    esri.sketch.visibleElements = {
      selectionTools: {
        'lasso-selection': false,
        'rectangle-selection': false,
      },
      settingsMenu: false,
    };
    esri.sketch.on('create', function(event) {
      if (event.state === 'complete') {
        // esri.sketch.visible = true;
        esri.mapView.goTo(esri.graphicsLayer.graphics.items[0]);
        console.log(esri.graphicsLayer);
        esri.graphicsLayer.visible = true;
        console.log(event);
      }
    });

    // add measure tools
    esri.measurement = new Measurement({
      view: esri.mapView,
    });
    esri.mapView.ui.add(esri.measurement, 'top-left');

    // create legend widget
    var numbers = Array.from({ length: 71 }, (_, i) => i);
    console.log(numbers);
    esri.legend = new Legend({
      view: esri.mapView,
    });

    // create expand widget to hide and show legend
    esri.lgExpand = new Expand({
      view: esri.mapView,
      content: esri.legend,
    });

    // add expand to map
    esri.mapView.ui.add(esri.lgExpand, 'bottom-left');
    // show expanded legend on desktop, collapse on mobile
    this.$q.screen.lt.sm || this.$q.screen.lt.md
      ? true
      : esri.lgExpand.expand();

    //watch size of map view and adjust legend to close if map gets too small
    esri.mapView.on('resize', function(event) {
      if (event.width < 546) {
        esri.lgExpand.collapse();
      }
      if (event.width > 546) {
        esri.lgExpand.expand();
      }
    });

    let portal = new Portal();

    // basemaps
    const allowedBasemapTitles = [
      'Imagery Hybrid',
      'Ocean Basemap',
      'TNC Light with Hillshade',
      'TNC Dark Gray Map',
    ];
    // filtering portal basemaps
    const source = new PortalBasemapsSource({
      portal,
      query: {
        id: 'defa1b2287604d069c70af515331e30f',
      },
      filterFunction: (basemap) =>
        allowedBasemapTitles.indexOf(basemap.portalItem.title) > -1,
    });

    // basemap gallery widget
    // var basemapGallery = new BasemapGallery({
    //   view: esri.mapView,
    //   source: source,
    //   container: document.createElement('div'),
    // });

    let view = esri.mapView;
    // expand to hold basemap gallery
    const bgExpand = new Expand({
      view,
      content: new BasemapGallery({ source, view }),
      expandIconClass: 'esri-icon-basemap',
    });
    esri.mapView.ui.add(bgExpand, 'top-right');

    // place expand in view
    esri.mapView.ui.add(bgExpand, {
      position: 'top-right',
    });
    // close expand when basemap is changed
    esri.map.watch('basemap.title', function() {
      bgExpand.collapse();
    });

    // move zoom controls to top right
    esri.mapView.ui.move(['zoom'], 'top-right');
  },

  methods: {
    updateFeatureLayer(id) {
      let title;

      if (this.h6 == false) {
        title = 'HUC 6 Boundary';
      } else if (this.h6 == true && this.h8 == false) {
        title = 'HUC 8 - ' + this.option;
      } else if (this.h8 == true && this.h10 == false) {
        title = 'HUC 10 - ' + this.option;
      }

      if (esri.featureLayer) {
        esri.featureLayer.destroy();
      }
      esri.featureLayer = new FeatureLayer({
        url:
          'https://services2.coastalresilience.org/arcgis/rest/services/Wisconsin/wi_wetlands_by_design/MapServer/' +
          id,
        title: title,
        outFields: ['*'],
        opacity: 0.6,
      });
      esri.map.add(esri.featureLayer);
      esri.featureLayer.definitionExpression = esri.defExp;
      esri.featureLayer.queryExtent().then(function(results) {
        esri.mapView.goTo(results.extent);
      });
    },

    numToRange(num) {
      if (num == 1) {
        return 'Very High';
      } else if (num == 2) {
        return 'High';
      } else if (num == 3) {
        return 'Moderate';
      } else {
        return 'Not Applicable';
      }
    },

    numToLoss(num) {
      if (num == 1) {
        return 'Most Loss';
      } else if (num == 2) {
        return 'Moderate Loss';
      } else if (num == 3) {
        return 'Least Loss';
      }
    },

    fixLegendLabels() {
      let a = document.getElementsByClassName('esri-legend__layer-caption');

      for (let i = 0; i < a.length; i++) {
        if (a[i].innerHTML == 'ALL_RANK' || a[i].innerHTML == 'AllNeeds') {
          console.log('found an all rank');
          a[i].innerHTML = '';
        }
      }
    },

    updateSupportingVisibility() {
      // turn off all raster layer visibility
      esri.map.layers.items.forEach((fl) => {
        if (fl.type === 'feature') {
          fl.visible = false;
        }
        if (fl.type == 'map-image') {
          fl.allSublayers.items.forEach((sl) => {
            if (sl.layer.type == 'map-image') {
              sl.visible = false;
            }
          });
        }
      });
      // turn on all sublayers that are checked in the TOC
      this.supportingMapVisibleLayers.forEach((l) => {
        //if type is raster layer - find the sublayer and make visible
        if (l.type === 'Raster Layer') {
          console.log(l);
          let layer = esri.map.layers.items.find((layer) => {
            return (
              layer.type == 'map-image' &&
              layer.url ==
                this.$store.state.config.supportingMapLayers[l.mapServiceIndex]
                  .mapService
            );
          });
          let sublayer = layer.allSublayers.items.find((sublayer) => {
            return sublayer.id == l.id;
          });
          sublayer.visible = true;
        }
        if (l.type === 'Feature Layer') {
          //check to see if feature layer exists.  if it does make it visible, if not create it.
          let i = esri.map.layers.items.findIndex(
            (layer) =>
              layer.layerId == l.id &&
              layer.url ==
                this.$store.state.config.supportingMapLayers[l.mapServiceIndex]
                  .mapService
          );

          if (i >= 0) {
            console.log('finds feature layer');
            esri.map.layers.items[i].visible = true;
          } else {
            //check to see if fl has a popup template defined
            console.log('creates feature layer');
            let layerList = this.$store.state.config.supportingMapLayers[
              l.mapServiceIndex
            ].popupTemplate;
            let i = layerList.findIndex((layer) => layer.id == l.id);
            if (i >= 0) {
              let template = {
                title: layerList[i].title,
                content: [
                  {
                    type: 'text',
                    text:
                      layerList[i].label +
                      ':  <b>{ ' +
                      layerList[i].field +
                      '}</b>',
                  },
                ],
              };
              //get index of map server
              esri.map.add(
                new FeatureLayer({
                  url:
                    this.$store.state.config.supportingMapLayers[
                      l.mapServiceIndex
                    ].mapService +
                    '/' +
                    l.id,
                  popupTemplate: template,
                })
              );
            }
            //if no popup defined create the feature layer without popup
            else {
              esri.map.add(
                new FeatureLayer({
                  url:
                    this.$store.state.config.supportingMapLayers[
                      l.mapServiceIndex
                    ].mapService +
                    '/' +
                    l.id,
                })
              );
            }
          }
        }
      });
    },

    updateSupportingOpacity() {
      let l = this.supportingVisibleLayerOpacity;
      // if it is a raster find the sublayer and set the opacity
      if (l.type === 'Raster Layer') {
        let layer = esri.map.layers.items.find((layer) => {
          return (
            layer.type == 'map-image' &&
            layer.url ==
              this.$store.state.config.supportingMapLayers[l.mapServiceIndex]
                .mapService
          );
        });
        let sublayer = layer.allSublayers.items.find((sublayer) => {
          return sublayer.id == l.id;
        });
        sublayer.opacity = l.value;
      }
      //if it is a feature layers, create it if it does not exist but make visibility false.  then set its opacity so that
      //when the user turns it on, it will find the layer and match the ui opacity dial.
      if (l.type == 'Feature Layer') {
        let i = esri.map.layers.items.findIndex(
          (layer) =>
            layer.layerId == l.id &&
            layer.url ==
              this.$store.state.config.supportingMapLayers[l.mapServiceIndex]
                .mapService
        );

        if (i >= 0) {
          console.log('finds feature layer');
          esri.map.layers.items[i].opacity = l.value;
        } else {
          //check to see if fl has a popup template defined
          console.log('creates feature layer');
          let layerList = this.$store.state.config.supportingMapLayers[
            l.mapServiceIndex
          ].popupTemplate;
          let i = layerList.findIndex((layer) => layer.id == l.id);
          if (i >= 0) {
            let template = {
              title: layerList[i].title,
              content: [
                {
                  type: 'text',
                  text:
                    layerList[i].label +
                    ':  <b>{ ' +
                    layerList[i].field +
                    '}</b>',
                },
              ],
            };
            //get index of map server
            esri.map.add(
              new FeatureLayer({
                url:
                  this.$store.state.config.supportingMapLayers[
                    l.mapServiceIndex
                  ].mapService +
                  '/' +
                  l.id,
                popupTemplate: template,
                visible: false,
                opacity: l.value,
              })
            );
          }
          //if no popup defined create the feature layer without popup
          else {
            esri.map.add(
              new FeatureLayer({
                url:
                  this.$store.state.config.supportingMapLayers[
                    l.mapServiceIndex
                  ].mapService +
                  '/' +
                  l.id,
                visible: false,
                opacity: l.value,
              })
            );
          }
        }
      }
    },

    getMapPrint() {
      esri.mapView
        .takeScreenshot({ width: 1000, height: 700, orientation: 'landscape' })
        .then((screenshot) => {
          let image = screenshot.dataUrl;
          this.$store.commit('updateMapPrintURI', image);
          setTimeout(function() {
            // wait until all resources loaded
            window.print();
          }, 250);
        });
    },

    activateAreaMeasurement() {
      const distanceButton = document.getElementById('distance');
      const areaButton = document.getElementById('area');
      esri.measurement.activeTool = 'area';
      distanceButton.classList.remove('active');
      areaButton.classList.add('active');
    },

    activateLineMeasurement() {
      const distanceButton = document.getElementById('distance');
      const areaButton = document.getElementById('area');
      esri.measurement.activeTool = 'distance';
      distanceButton.classList.add('active');
      areaButton.classList.remove('active');
    },

    // Clears all measurements
    clearMeasurements() {
      const distanceButton = document.getElementById('distance');
      const areaButton = document.getElementById('area');
      distanceButton.classList.remove('active');
      areaButton.classList.remove('active');
      esri.measurement.clear();
    },

    updateSelectedFeatures(val) {
      this.$store.commit('updateSelectedFeatures', val);
    },

    applyFilter(layer, where) {
      layer.featureEffect = {
        filter: {
          where,
        },
        includedEffect: [
          {
            scale: 36978595,
            value: 'drop-shadow(4px, 4px, 8px)',
          },
          {
            scale: 18489297,
            value: 'drop-shadow(3px, 3px, 6px)',
          },
          {
            scale: 4622324,
            value: 'drop-shadow(2px, 2px, 4px)',
          },
        ],
        // excludedEffect: 'opacity(30%)',
      };
      console.log(where);
    },
  },
  mutations: {
    updateLocationValue(state, val) {
      state.locationValue = val;
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
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import 'https://js.arcgis.com/4.20/@arcgis/core/assets/esri/themes/light/main.css';

#map {
  flex: 1;
  min-height: calc(100vh - 49px);
  height: 100%;
  width: 100%;
  position: relative;
  border-bottom: #999 solid 1pt;
}
#mapStory {
  flex: 1;
  height: calc(100vh - 200px);
  height: 100%;
  width: 100%;
  position: relative;
  border-bottom: #999 solid 1pt;
}

@media screen and (max-width: 700px) {
  #map {
    min-height: 20vh;
    height: 100%;
    width: 100%;
    position: relative;
    border-bottom: #999 solid 1pt;
  }
}
#toolbarDiv {
  position: absolute;
  left: 10px;
  top: 10px;
  display: flex;
  box-shadow: 0 1px 2px rgb(0 0 0 / 60%);
}
#info {
  background-color: black;
  opacity: 0.6;
  color: white;
  height: 40px;
  width: auto;
  font-size: large;
  margin: 0px 0px 5px auto;
  padding-left: 15px;
  padding-right: 15px;
  display: block;
  border-radius: 3px;
  padding-top: 5px !important;
  visibility: hidden;
}

esri-expand__content esri-expand__content--expanded div {
  background-color: white;
}
#toolbarDiv button {
  border: unset;
}
#area {
  border-right: solid 1px rgba(110, 110, 110, 0.3) !important;
  border-left: solid 1px rgba(110, 110, 110, 0.3) !important;
}

.esri-widget--button.active,
.esri-widget--button.active:hover,
.esri-widget--button.active:focus {
  cursor: default;
  background-color: lightgrey;
}
.esri-widget--button.active path,
.esri-widget--button.active:hover path,
.esri-widget--button.active:focus path {
  fill: #e4e4e4;
}

.esri-widget *:focus-visible,
.esri-widget *:focus {
  outline: none;
}
</style>
<style>
.esri-legend__service h3 {
  line-height: unset;
}
.esri-legend__layer-cell {
  padding-top: 0;
  padding-bottom: 0;
}
.esri-measurement {
  margin: 40px 0 0 -4px;
}
.esri-ui-corner .esri-component,
.esri-expand__content {
  box-shadow: 1px 1px 2px rgb(0 0 0 / 60%);
}

.esri-scale-bar__line {
  background-color: white !important;
}

/* .esri-legend__layer-caption {
  display: none !important;
  visibility: hidden !important;
} */

#legend-label-remove {
  display: none !important;
  visibility: hidden !important;
}
</style>
http://localhost:8080/protecting-groundwater

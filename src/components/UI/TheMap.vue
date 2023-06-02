<template>
  <div id="map">
    <!-- <div id="supportingLayers" v-if="$store.state.config.supportingLayersOnMap">
      <SupportingLayers displayClass="supportingLayersMap" />
    </div> -->
    <!-- <button
      id="printBtn"
      class="esri-widget--button esri-interactive esri-icon-printer esriCustomButton"
      title="Print Map"
      @click="getMapPrint()"
    ></button> -->
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
import Point from '@arcgis/core/geometry/Point.js';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol.js';
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
      locationValue: '',
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
    newLocationValue() {
      return this.$store.state.locationValue;
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
  },
  watch: {
    supportingMapVisibleLayers() {
      this.updateSupportingVisibility();
    },
    supportingVisibleLayerOpacity() {
      this.updateSupportingOpacity();
    },
    addRaster() {
      let queryTitle = '';
      let layerTitle = '';

      const srf_lakes = new FeatureLayer({
        url:
          'https://services2.coastalresilience.org/arcgis/rest/services/Wisconsin/Mukwonago/MapServer/6',
        outFields: ['*'],
      });
      esri.map.add(srf_lakes);
      let srf_lakesLayerView = '';
      esri.mapView.whenLayerView(srf_lakes).then(function(layerView) {
        srf_lakesLayerView = layerView;
      });

      const srf_streams = new FeatureLayer({
        url:
          'https://services2.coastalresilience.org/arcgis/rest/services/Wisconsin/Mukwonago/MapServer/7',
        outFields: ['*'],
      });
      esri.map.add(srf_streams);
      let srf_streamsLayerView = '';
      esri.mapView.whenLayerView(srf_streams).then(function(layerView) {
        srf_streamsLayerView = layerView;
      });

      let highlight;

      this.upstreamFeatures.forEach((feat) => {
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
                highlight?.remove();
                highlight = srf_lakesLayerView.highlight(
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
              console.log(result);
              console.log(feature);
              highlight?.remove();
              highlight = srf_streamsLayerView.highlight(
                feature.attributes['OBJECTID']
              );
              console.log('streams highlighted');
            });
          }
        }
      });

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
        esri.map.remove(
          srf_streams,
          srf_lakes,
          srf_lakesLayerView,
          srf_streamsLayerView
        );
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
    console.log(tncDarkMapId, tncHillshadeMapId, hybridMapId);

    //select a basemap
    esri.map = new Map({
      basemap: {
        portalItem: {
          id: oceansMapId,
        },
      },
      layers: [esri.layers],
    });

    //create the map view
    esri.mapView = new MapView({
      map: esri.map,
      center: [-88.47431, 42.879521],
      zoom: 11,
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

    const muk_watershed = new FeatureLayer({
      url:
        'https://services2.coastalresilience.org/arcgis/rest/services/Wisconsin/Mukwonago/MapServer/0',
    });
    esri.map.add(muk_watershed);

    const muk_srl = new FeatureLayer({
      url:
        'https://services2.coastalresilience.org/arcgis/rest/services/Wisconsin/Mukwonago/MapServer/1',
    });
    esri.map.add(muk_srl);
    let muk_srlLayerView = '';
    console.log(muk_srlLayerView);
    esri.mapView.whenLayerView(muk_srl).then(function(layerView) {
      muk_srlLayerView = layerView;
    });

    const muk_lakes = new FeatureLayer({
      url:
        'https://services2.coastalresilience.org/arcgis/rest/services/Wisconsin/Mukwonago/MapServer/2',
    });
    esri.map.add(muk_lakes);
    let muk_lakesLayerView = '';
    console.log(muk_lakesLayerView);
    esri.mapView.whenLayerView(muk_lakes).then(function(layerView) {
      muk_lakesLayerView = layerView;
    });

    const muk_fens = new FeatureLayer({
      url:
        'https://services2.coastalresilience.org/arcgis/rest/services/Wisconsin/Mukwonago/MapServer/3',
    });
    esri.map.add(muk_fens);
    let muk_fensLayerView = '';
    console.log(muk_fensLayerView);
    esri.mapView.whenLayerView(muk_fens).then(function(layerView) {
      muk_fensLayerView = layerView;
    });

    const muk_streams = new FeatureLayer({
      url:
        'https://services2.coastalresilience.org/arcgis/rest/services/Wisconsin/Mukwonago/MapServer/4',
    });
    esri.map.add(muk_streams);

    const all_results = new FeatureLayer({
      url:
        'https://services2.coastalresilience.org/arcgis/rest/services/Wisconsin/Mukwonago/MapServer/5',
    });

    let _this = this;

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

    esri.map.add(esri.mapImage);

    let highlight;

    esri.mapView.on('click', function(response) {
      if (_this.planType === 'evaluate') {
        _this.circleFeatures = [];
        _this.resultsFeatures = [];

        let markerSymbol = new SimpleMarkerSymbol({
          style: 'circle',
          color: [255, 0, 0],
          size: 10,
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
              color: [255, 0, 0],
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

        if (highlight) {
          highlight.remove();
        }

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
        esri.mapView.graphics.add(circleGraphic, pointGraphic);

        _this.evalCircle = true;

        console.log(_this.evalCircle);
        console.log(response);
      }
    });

    // let highlight;

    // _this.$watch('evalCircle', () => {
    //   console.log('evalCircle watcher initiated');
    //   if (_this.evalCircle === true) {
    //     // let layerArray = [muk_srl, muk_fens, muk_lakes];
    //     esri.mapView.on('pointer-move', (event) => {
    //       const opts = {
    //         include: muk_srl,
    //         muk_fens,
    //         muk_lakes,
    //       };
    //       esri.mapView.hitTest(event, opts).then((e) => {
    //         if (e.results.length) {
    //           console.log('we have results from the hittest');
    //           const hitGraphic = e.results[0].graphic;
    //           console.log(e.results);
    //           console.log(hitGraphic);

    //           const query = muk_lakes.createQuery();
    //           const queryb = muk_srl.createQuery();
    //           const queryc = muk_fens.createQuery();

    //           let objectID = hitGraphic.attributes.OBJECTID;
    //           query.where = 'OBJECTID = ' + objectID;
    //           queryb.where = 'OBJECTID = ' + objectID;
    //           queryc.where = 'OBJECTID = ' + objectID;

    //           if (highlight) {
    //             highlight.remove();
    //           }
    //           muk_lakes.queryFeatures(query).then((result) => {
    //             const feature = result.features[0];
    //             highlight = muk_lakesLayerView.highlight(
    //               feature.attributes['OBJECTID']
    //             );
    //           });
    //           muk_srl.queryFeatures(queryb).then((result) => {
    //             const feature = result.features[0];
    //             highlight = muk_srlLayerView.highlight(
    //               feature.attributes['OBJECTID']
    //             );
    //           });
    //           muk_fens.queryFeatures(queryc).then((result) => {
    //             const feature = result.features[0];
    //             highlight = muk_fensLayerView.highlight(
    //               feature.attributes['OBJECTID']
    //             );
    //           });
    //         }
    //       });
    //     });
    //   }
    // });

    //code to add highlight feature for map image layer
    // esri.mapView.popup.watch('selectedFeature', function(gra) {
    //   if (gra) {
    //     esri.mapView.graphics.removeAll();
    //     var h = esri.mapView.highlightOptions;
    //     gra.symbol = {
    //       type: 'simple-fill', // autocasts as new SimpleFillSymbol()
    //       color: [h.color.r, h.color.g, h.color.b, 0],
    //       outline: {
    //         // autocasts as new SimpleLineSymbol()
    //         color: [h.color.r, h.color.g, h.color.b, h.color.a],
    //         width: 1,
    //       },
    //     };
    //     esri.mapView.graphics.add(gra);
    //   } else {
    //     esri.mapView.graphics.removeAll();
    //   }
    // });

    // esri.mapView.popup.watch('visible', function(vis) {
    //   if (!vis) {
    //     esri.mapView.graphics.removeAll();
    //   }
    // });

    //add supporting layers widget to map if true
    // if (this.$store.state.config.supportingLayersOnMap) {
    //   let supportingLayersExpand = new Expand({
    //     expandIconClass: 'esri-icon-layer-list',
    //     expandTooltip: 'Expand LayerList',
    //     view: esri.mapView,
    //     content: document.getElementById('supportingLayers'),
    //   });
    //   esri.mapView.ui.add(supportingLayersExpand, 'top-right');
    // }

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

    _this.$watch('newLocationValue', (newVal, locationValue) => {
      if (newVal !== locationValue) {
        searchWidg.search(newVal);
      }
    });

    // add measure tools
    esri.measurement = new Measurement({
      view: esri.mapView,
    });
    esri.mapView.ui.add(esri.measurement, 'top-left');

    // create legend widget
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
        .takeScreenshot({ width: 1000, height: 700 })
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
#printBtn {
  position: absolute;
  z-index: 100;
  right: 15px;
  top: 175px;
  border: none;
  box-shadow: 1.5px 1.5px 1px 0px rgb(0 0 0 / 40%);
}
#toolbarDiv {
  position: absolute;
  left: 10px;
  top: 10px;
  display: flex;
  box-shadow: 0 1px 2px rgb(0 0 0 / 60%);
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
</style>

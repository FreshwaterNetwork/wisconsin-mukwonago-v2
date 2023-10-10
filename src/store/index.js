import { createStore } from 'vuex';
import esriRequest from '@arcgis/core/request';

export default createStore({
  state: {
    data: {
      // data retrieved from web services
      supportingLayers: '', //used to create the supportinglayer tree
      slReady: false,
    },
    config: {
      // config info
      supportingMapLayers: [
        {
          mapService:
            'https://services2.coastalresilience.org/arcgis/rest/services/Wisconsin/Mukwonago/MapServer',
          skipLayers: [],
          title: 'Wisconsin',
          popupTemplate: [
            {
              id: 9999,
              fields: [
                { fieldName: 'Subbasin', label: 'Sub Basin' },
                { fieldName: 'SubbasinR', label: 'Sub Basin R' },
                { fieldName: 'AreaC', label: 'Area(units)' },
              ],
            },
            // for now this placeholder is required.  I am not sure why but the last layer in this list will not display correctly.
            {
              id: 9999,
              fields: [{ fieldName: 'none', label: 'placeholder' }],
            },
          ],
        },
      ],

      supportingLayersTitle: 'Additional Layers',
      supportingLayersOnMap: true,
      supportingLayersInPanel: true,
      panelDisplayType: 'tabsVertical', //plain, tabsHorizontal, tabsVertical
      appDisplayType: 'webMap', //storyMap, webMap
      condensedTabs: false,
      containerWidth: '',
    },
    // app state info -- supporting layers
    tree: { ticked: [], expanded: [999], tickedObj: [] },
    selectedLayerList: [],
    supportingVisibleLayerOpacity: {},

    // app state info -- layout
    showControls: false,
    hideControls: true,
    mapPrintURI: '',
    planType: '',
    agreed: false,
    selectedFeatures: [],
    locationValue: '',
    removeHighlight: false,
    mapQuery: '',
    addRaster: false,
    pointCoord: '',
    evalCircle: false,
    circleFeatures: [],
    resultsFeatures: [],
    featCounter: 0,
    nonCoordLoc: false,
    wetlandWatersheds: [],
    projectType: 'new',
    wbdApp: '',
    showServices: false,
    hideServices: false,
    showNumServices: false,
    hideNumServices: false,
    serviceType: 'nos',
    serviceOption: 'Count of Services ≥ High',
    rfOption: 'Overall Feasibility',
    option: 'Combined Services',
    guild: '',
    guildLayer: 0,
    hucHover: false,
    rangeOfService: false,
    optionLayers: { id8: 30, id10: 31, id12: 32 },
    rfLayer: 54,
    serviceLayer: 16,
    removeGuild: false,
  },
  mutations: {
    //data retrieved from web services
    updateSupportingLayers(state, obj) {
      state.data.supportingLayers = obj;
    },
    updateSLReady(state, bool) {
      state.data.slReady = bool;
    },
    updateSupportingSublayerList(state, obj) {
      state.data.supportingSublayerList = obj;
    },

    //app state -- supporting layers
    updateTreeState(state, obj) {
      state.tree.ticked = obj.ticked;
      state.tree.expanded = obj.expanded;
      state.tree.tickedObj = obj.tickedObj;
    },
    updateSupportingLayerVisibleOpacity(state, obj) {
      state.supportingVisibleLayerOpacity = obj;
    },
    updateMapPrintURI(state, uri) {
      state.mapPrintURI = uri;
    },
    updateCondensedTabs(state, bool) {
      state.condensedTabs = bool;
    },
    updateContainerWidth(state, val) {
      state.containerWidth = val;
    },
    updatePlanType(state, val) {
      state.planType = val;
    },
    updateAgreed(state, val) {
      state.agreed = val;
    },
    updateSelectedFeatures(state, val) {
      state.selectedFeatures = '';
      state.selectedFeatures = val;
    },
    updateLocationValue(state, val) {
      state.locationValue = val;
    },
    updateRemoveHighlight(state, val) {
      state.removeHighlight = val;
    },
    updateMapQuery(state, val) {
      state.mapQuery = val;
    },
    updateAddRaster(state, val) {
      state.addRaster = val;
    },
    updatePointCoord(state, val) {
      state.pointCoord = val;
    },
    updateEvalCircle(state, val) {
      state.evalCircle = val;
    },
    updateCircleFeatures(state, val) {
      state.circleFeatures = val;
    },
    updateResultsFeatures(state, val) {
      state.resultsFeatures = val;
    },
    updateFeatCounter(state, val) {
      state.featCounter = val;
    },
    updateNonCoordLoc(state, val) {
      state.nonCoordLoc = val;
    },
    updateWetlandWatersheds(state, val) {
      state.wetlandWatersheds = val;
    },
    updateProjectType(state, val) {
      state.projectType = val;
    },
    updateWbdApp(state, val) {
      state.wbdApp = val;
    },
    updateShowServices(state, val) {
      state.showServices = val;
    },
    updateHideNumServices(state, val) {
      state.hideNumServices = val;
    },
    updateHideServices(state, val) {
      state.hideServices = val;
    },
    updateShowNumServices(state, val) {
      state.showNumServices = val;
    },
    updateServiceType(state, val) {
      state.serviceType = val;
    },
    updateServiceOption(state, val) {
      state.serviceOption = val;
    },
    updateRfOption(state, val) {
      state.rfOption = val;
    },
    updateOption(state, val) {
      state.option = val;
    },
    updateHucHover(state, val) {
      state.hucHover = val;
    },
    updateRangeOfService(state, val) {
      state.rangeOfService = val;
    },
    updateOptionLayers(state, val) {
      state.optionLayers = val;
    },
    updateRfLayer(state, val) {
      state.rfLayer = val;
    },
    updateServiceLayer(state, val) {
      state.serviceLayer = val;
    },
    updateGuild(state, val) {
      state.guild = val;
    },
    updateGuildLayer(state, val) {
      state.guildLayer = val;
    },
    updateRemoveGuild(state, val) {
      state.removeGuild = val;
    },
  },

  actions: {
    requestSupportingLayers(context) {
      //for each map service object in supporting map layers
      try {
        let obj = [];
        let smnum = context.state.config.supportingMapLayers.length;
        let smcount = 0;
        context.state.config.supportingMapLayers.forEach((service, index) => {
          esriRequest(service.mapService + '/layers?f=pjson', {
            responseType: 'json',
          }).then(function(response) {
            let layerJson = response.data.layers;
            //push main header to the object
            obj.push({
              label: service.title,
              children: [],
              id: 999 + index,
              noTick: true,
              type: 'header',
            });
            let storeNodes = [];
            let type = '';
            layerJson.forEach((l) => {
              service.popupTemplate.forEach((popup) => {
                if (l.id == popup.id) {
                  type = 'Featue Layer';
                } else type = 'Raster Layer';
              });
              // add layer to layer viewer if it's id is not present in the skip array
              if (service.skipLayers.indexOf(l.id) == -1) {
                // Group Layer with no parent
                if (l.type == 'Group Layer' && !l.parentLayer) {
                  //push the object to the list as child of main header
                  obj[index].children.push({
                    label: l.name,
                    children: [],
                    id: l.id + '_' + index,
                    noTick: true,
                    type: type,
                  });
                  //find the index of the object we just pushed, saves the reference to the location
                  let parentIndex = obj[index].children.findIndex(
                    (obj) => obj.id == l.id + '_' + index
                  );
                  //save the parent node to the store with reference to its location in the object
                  storeNodes.push({
                    parentIndex: parentIndex,
                    parentLoc: obj[index].children[parentIndex],
                    parentId: l.id + '_' + index,
                    description: l.description,
                  });
                }
                // featurel layer with parent
                if (l.type !== 'Group Layer' && l.parentLayer) {
                  //find the location of the parent in the node lookup
                  let nodesIndex = storeNodes.findIndex(
                    (obj) => obj.parentId == l.parentLayer.id + '_' + index
                  );
                  //set the location of the parent
                  let parentLoc = storeNodes[nodesIndex].parentLoc;
                  //push the child to the parent
                  parentLoc.children.push({
                    label: l.name,
                    children: [],
                    body: 'toggle',
                    id: l.id + '_' + index,
                    description: l.description,
                    type: type,
                  });
                }
                // group layer with parent
                if (l.type == 'Group Layer' && l.parentLayer) {
                  //find the location of the parent in the node lookup
                  let nodesIndex = storeNodes.findIndex(
                    (obj) => obj.parentId == l.parentLayer.id + '_' + index
                  );
                  //set the location of the parent
                  let parentLoc = storeNodes[nodesIndex].parentLoc;
                  //push the new parent into the found parent as child
                  parentLoc.children.push({
                    label: l.name,
                    children: [],
                    id: l.id + '_' + index,
                    noTick: true,
                    type: type,
                  });
                  //find the index of the child we just pushed
                  let parentIndex = parentLoc.children.findIndex(
                    (obj) => obj.id == l.id + '_' + index
                  );
                  //save the reference to the location
                  parentLoc = parentLoc.children[parentIndex];
                  //save the parent node to the store with reference to its location in the object
                  storeNodes.push({
                    parentIndex: parentIndex,
                    parentLoc: parentLoc,
                    parentId: l.id + '_' + index,
                    description: l.description,
                  });
                }
                // feature layer with no parent length = number of nodes
                if (l.type !== 'Group Layer' && !l.parentLayer) {
                  obj[index].children.push({
                    label: l.name,
                    children: [],
                    body: 'toggle',
                    id: l.id + '_' + index,
                    description: l.description,
                    type: type,
                  });
                }
              }
            });
            smcount = smcount + 1;
            if (smcount == smnum) {
              context.commit('updateSupportingLayers', obj);
              context.commit('updateSLReady', true);
            }
          });
        });
      } catch (error) {
        context.commit('updateSupportingLayers', 'error');
      }
    },
  },
});

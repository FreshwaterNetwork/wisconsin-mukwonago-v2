<template>
  <div>
    <div class="text-h6 text-weight-medium text-center">
      Wisconsin’s Waters, Wetlands, and Watersheds
    </div>
    <hr />
    <div class="text-body1 q-pa-sm">
      Wisconsin’s waters and wetlands help our state thrive, benefiting people,
      fish, and wildlife. Explore the following mapping tools to better
      understand these important resources and guide decisions around protecting
      and restoring them.
    </div>
    <br />
    <!-- <div class="text-subtitle2">Start Exploring:</div> -->
    <div v-for="app in appOptions" :key="app" class="app-option q-my-sm">
      <strong>
        <div class="text-center">
          {{ app.name }}
        </div>
      </strong>
      <hr />
      <div>{{ app.description }}</div>
      <div style="width: fit-content; margin: 10px auto 10px auto;">
        <q-btn
          color="primary"
          label="Open Application"
          :to="app.tab == '2' ? { name: 'tab2' } : { name: 'tab3' }"
          @click="this.setApp(app)"
        ></q-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tab1',
  components: {},
  data() {
    return {
      appOptions: [
        {
          name: 'Wetlands by Design: A Watershed Approach',
          description:
            'Wetlands can improve water quality, reduce flood impacts, help streams flow, provide habitat, and offer many other services. But not all wetlands provide the same services to the same degree! To find the best sites to restore and protect—and the most promising watersheds to work in—check out the Wetlands and Watersheds Explorer.',
          tab: '2',
          id: 1,
        },
        {
          name:
            'Protecting Groundwater Dependent Ecosystems: Decision Support for Well Placement in the Mukwonago Basin',
          description:
            'Groundwater dependent ecosystems (gde) are systems that depend on groundwater inputs to support their natural flora and fauna. These ecosystems can occur in wetlands, lakes and rivers. One rare gde is the fen, a wetland that depend mostly on groundwater inputs rather than surface water flows to support the wetland. The Mukwonago River Basin in southeast Wisconsin has several remaining fens that need careful protection. This tool is designed to help site high capacity groundwater wells in areas of the basin that protect a select group of important groundwater dependent ecosystems – fens, rivers and lakes – in the watershed. Impacts are reported in the drawdown experienced in fens or the depletion potential in rivers and lakes. The results presented are based off a groundwater model developed by the USGS, model documentation can be found here.',
          tab: '3',
          id: 2,
        },
      ],
    };
  },
  computed: {
    wbdApp: {
      get() {
        return this.$store.state.wbdApp;
      },
      set(value) {
        this.$store.commit('updateWbdApp', value);
      },
    },
  },
  methods: {
    setApp(val) {
      if (val.id == 1) {
        this.wbdApp = true;
      } else {
        this.wbdApp = false;
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.app-option {
  padding: 10px;
  margin-right: 3px;
}
.app-option:hover {
  background-color: #c1e7c1;
  border-radius: 2px;
  padding: 10px;
  margin-right: 3px;
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
</style>

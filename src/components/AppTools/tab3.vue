<template>
  <div>
    <div class="text-h6 text-weight-medium text-center">
      <span>Protecting Groundwater Dependent Ecosystems</span>
    </div>
    <hr />
    <div class="user-agreement" v-if="agreed === false">
      <span>
        <strong>
          <div class="text-center">
            Protecting Groundwater Dependent Ecosystems Intended Use Agreement
          </div>
        </strong>
      </span>
      <br />
      <span>
        The data presented in this tool is intended to help evaluate potential
        impacts on groundwater dependent ecosystems when siting new
        high-capacity wells. The maps included in this tool are interpretations
        of model results and every reasonable effort was made to ensure that the
        information presented conforms to sound scientific principles; however,
        the maps should not be used to guide site-specific decisions without
        verification. The tool is not intended to be predictive or account for
        all impacts of groundwater pumping on the health of a watershed. This
        data is intended for planning purposes only. Proper use of the tool is
        the sole responsibility of the user.
      </span>
      <br />
      <q-btn
        color="primary"
        @click="agreed = true"
        style="margin: 15px auto auto auto; display: block;"
      >
        Agree & Enter
      </q-btn>
    </div>
    <div v-if="agreed">
      <div v-if="!planType">
        Groundwater dependent ecosystems (gde) are systems that depend on
        groundwater inputs to support their natural flora and fauna. These
        ecosystems can occur in wetlands, lakes and rivers. One rare gde is the
        fen, a type of wetland that depends mostly on groundwater inputs rather
        than surface water flows to support the wetland. The Mukwonago River
        Basin in southeast Wisconsin has several remaining fens that need
        careful protection.
      </div>

      <div class="q-pa-md">
        <q-btn-group spread>
          <q-btn
            :color="planType === 'evaluate' ? 'primary' : 'white'"
            label="Evaluate a Planned Pumping Site"
            :text-color="planType === 'evaluate' ? 'white' : 'black'"
            to="/tab3/evaluate"
            @click="planType = 'evaluate'"
          />
          <q-btn
            :color="planType === 'search' ? 'primary' : 'white'"
            label="Search for a Pumping Site"
            :text-color="planType === 'search' ? 'white' : 'black'"
            to="/tab3/search"
            @click="planType = 'search'"
          />
        </q-btn-group>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tab3',
  computed: {
    planType: {
      get() {
        return this.$store.state.planType;
      },
      set(value) {
        this.$store.commit('updatePlanType', value);
      },
    },
    addRaster() {
      return this.$store.state.addRaster;
    },
    agreed: {
      get() {
        return this.$store.state.agreed;
      },
      set(value) {
        this.$store.commit('updateAgreed', value);
      },
    },
  },
  watch: {
    planType() {
      if (this.planType === '') {
        this.addRaster = false;
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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

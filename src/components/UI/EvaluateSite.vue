<template>
  <div class="q-pa-md">
    <div>
      <p style="margin-bottom:0px;">
        <b>Enter a location or click on the map to drop a pin:</b>
      </p>
      <p class="text-caption">
        Exact locations are not permissible, will snap to a pre-determined
        6-acre grid.
      </p>
      <div style="display: flex;">
        <q-input
          rounded
          dense
          outlined
          v-model="locationValue"
          clearable
          for="locationID"
          label="Location or Address"
          style="width:200px; display:block; margin:auto 5px auto auto;"
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
    <div>
      <p style="margin-bottom:0px; margin-top: 5px;">
        <b>What is the yearly average pumping rate for the well?</b>
      </p>
      <p class="text-caption">
        A typical home uses around 200 gallons per day or 0.14 gpm, so a
        subdivision of 50 homes uses around 7-10 gpm on average. An irrigation
        well uses between 400 and 1200 gpm for 10-50 percent of the time during
        the summer growing months. The exact amount depends on the time of year,
        rainfall, and crop. Municipal wells might pump up to 700 gpm, however
        most would be less when averaged over an entire year. To put these
        pumping rates into perspective, a garden hose turned on full blast has a
        flow of about 3 gpm.
      </p>
      <q-select
        rounded
        outlined
        :options="evalOptions"
        dense
        label="Select a Pumping Rate"
        style="width:200px; display:block; margin:auto;"
      />
    </div>
    <q-btn to="/tab3" color="primary" class="back-btn">
      Back
    </q-btn>
  </div>
</template>

<script>
export default {
  name: 'evaluate',
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
  },
  methods: {
    updateLocationValue(val) {
      let inputBox = document.getElementById('locationID').value;
      val = inputBox;
      this.$store.commit('updateLocationValue', val);
      console.log(val);
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
</style>

<template>
  <div>
    <div class="text-h6 text-weight-medium text-center">
      <span>Wetlands and Watersheds Explorer</span>
      <q-btn
        icon="fas fa-bars"
        color="primary"
        padding="5px"
        class="q-mr-md"
        style="margin: 0px 10px 0px 10px;"
      >
        <q-menu anchor="top right" self="top left">
          <q-list dense>
            <q-item clickable v-close-popup>
              <q-item-section>Bookmark and Share</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>Download Data</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>Print Map</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>Measure</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>Draw</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>
    <hr />
    <div class="text-body1 q-pa-sm">
      <q-btn-toggle
        spread
        toggle-color="primary"
        v-model="projectType"
        :options="[
          { label: 'New Site', value: 'new' },
          { label: 'Existing Site', value: 'known' },
        ]"
      />
      <!-- New Site -->
      <div v-if="projectType === 'new'" class="q-pa-md">
        <span>Click on a watershed to search for a new site</span>
        <div>
          <q-expansion-item
            default-opened
            label="Selected Watersheds:"
            style="background: rgb(237 237 237)"
          >
            <q-card>
              <q-card-section>
                This is a list of selected watersheds.
              </q-card-section>
            </q-card>
          </q-expansion-item>
          <q-expansion-item
            default-opened
            label="Watershed Comparison Services:"
            style="background: rgb(237 237 237)"
          >
            <div
              v-for="option in options"
              :key="option"
              style="background: white;"
            >
              <div class="new-option">
                <q-radio
                  :val="option.value"
                  :label="option.label"
                  size="30px"
                />
                <icon-button
                  v-if="option.visible === false"
                  type="info"
                  method="show-desc"
                  @show-desc="option.visible = !option.visible"
                  style="margin-left: 5px;"
                ></icon-button>
                <icon-button
                  v-if="option.visible === true"
                  type="close"
                  method="hide-desc"
                  @hide-desc="option.visible = !option.visible"
                  style="margin-left: 5px;"
                ></icon-button>
                <div class="option-description" v-show="option.visible">
                  {{ option.description }}
                </div>
              </div>
            </div>
          </q-expansion-item>
        </div>
      </div>
      <!-- Existing Site -->
      <div v-if="projectType === 'known'">
        <span>This is a known project</span>
      </div>
    </div>
  </div>
</template>

<script>
import IconButton from '../UI/IconButton.vue';

export default {
  name: 'tab2',
  components: { IconButton },
  data() {
    return {
      projectType: '',
      options: [
        {
          label: 'Combined Services',
          value: 'combined',
          visible: false,
          description:
            'Wetlands can provide multiple services. Each wetland’s characteristics determine which services that wetland provides and to what extent. Some watersheds have lost more services than others, due to historical wetland loss and alteration.',
        },
        {
          label: 'Sediment Retention',
          value: 'sediment',
          visible: false,
          description:
            'Wetlands retain some sediment that would otherwise move downstream. Excess sediment in streams impairs water quality and aquatic habitat.',
        },
        {
          label: 'Flood Abatement',
          value: 'flood',
          visible: false,
          description:
            'After heavy rainfall, many wetlands detain storm water runoff and overbank flooding from rivers, which slows the flow of excess water downstream.',
        },
        {
          label: 'Fish and Aquatic Habitat',
          value: 'fish',
          visible: false,
          description:
            'Wetlands support some part of the full life cycle for most fish and aquatic life.',
        },
        {
          label: 'Nutrient Transformation',
          value: 'nutrient',
          visible: false,
          description:
            'Wetlands remove nutrients from the water and convert them into plants, soil, or harmless gas.',
        },
        {
          label: 'Surface Water Supply',
          value: 'surface',
          visible: false,
          description:
            'Wetlands often contribute water to streams and rivers, especially during dry periods.',
        },
      ],
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.option-description {
  background: #c1e7c1;
  border-radius: 2px;
  padding: 5px;
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

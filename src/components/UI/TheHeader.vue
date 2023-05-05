<template>
  <div>
    <header class="print-hide">
      <q-btn flat icon="menu" color="white" padding="none" class="q-mr-md">
        <q-menu>
          <q-list style="min-width: 100px" dense>
            <q-item
              clickable
              v-close-popup
              tag="a"
              target="_blank"
              href="https://www.nature.org/en-us/what-we-do/our-priorities/protect-water-and-land/land-and-water-stories/protecting-our-ocean/?vu=r.v_marine"
            >
              <q-item-section>The Nature Conservancy</q-item-section>
              <q-item-section side>
                <q-icon name="link" size="xs"></q-icon>
              </q-item-section>
            </q-item>
            <q-separator inset />
            <q-item
              clickable
              v-close-popup
              tag="a"
              target="_blank"
              href="https://coastalresilience.org/terms-of-use/"
            >
              <q-item-section>Legal Disclosure</q-item-section>
              <q-item-section side>
                <q-icon name="link" size="xs"></q-icon>
              </q-item-section>
            </q-item>
            <q-separator inset />
            <q-item clickable>
              <q-item-section>Other Regions</q-item-section>
              <q-item-section side>
                <q-icon name="fas fa-arrow-right" size="xs"></q-icon>
              </q-item-section>
              <q-menu anchor="top right" self="top left">
                <q-list dense>
                  <q-item
                    clickable
                    v-close-popup
                    tag="a"
                    target="_blank"
                    href="https://maps.freshwaternetwork.org/louisiana/"
                  >
                    <q-item-section>Louisiana</q-item-section>
                  </q-item>
                  <q-item
                    clickable
                    v-close-popup
                    tag="a"
                    target="_blank"
                    href="https://maps.freshwaternetwork.org/mississippi/"
                  >
                    <q-item-section>Mississippi</q-item-section>
                  </q-item>
                  <q-item
                    clickable
                    v-close-popup
                    tag="a"
                    target="_blank"
                    href="https://maps.freshwaternetwork.org/northeast/"
                  >
                    <q-item-section>Northeast Region</q-item-section>
                  </q-item>
                  <q-item
                    clickable
                    v-close-popup
                    tag="a"
                    target="_blank"
                    href="https://maps.freshwaternetwork.org/louisiana/"
                  >
                    <q-item-section>Alabama Demo</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-item>

            <!-- <div>
              <q-dialog persistent v-model="otherRegions">
                <q-card>
                  <q-card-section>
                    <div class="text-h6 text-center">Other Regions</div>
                  </q-card-section>
                  <q-card-section style="display: grid;">
                    <q-btn
                      class="region-button"
                      color="primary"
                      tag="a"
                      target="_blank"
                      href="https://google.com/"
                      >Louisiana</q-btn
                    >
                    <q-btn class="region-button" color="primary">
                      Mississippi
                    </q-btn>
                    <q-btn class="region-button" color="primary">
                      Northeast Region
                    </q-btn>
                    <q-btn class="region-button" color="primary">
                      Alabama Demo
                    </q-btn>
                  </q-card-section>
                  <q-card-actions align="right">
                    <q-btn flat label="Close" color="primary" v-close-popup />
                  </q-card-actions>
                </q-card>
              </q-dialog>
            </div> -->
          </q-list>
        </q-menu>
      </q-btn>
      <span class="text-h5 text-white"
        ><span class="text-weight-medium"> Freshwater Network</span>
        <span class="text-secondary text-subtitle1"
          >&nbsp;&nbsp;Wisconsin's Waters, Wetlands, and Watersheds</span
        ></span
      >
      <!-- <div>
        <q-btn
          @click="showHelp = true"
          padding="none"
          color="white"
          flat
          icon="help"
        />
      </div> -->
    </header>

    <!-- INTRO DIALOG -->

    <!-- <q-dialog v-model="showHelp" :persistent="persistent">
      <q-card style="height: 72vh; max-width: 70vw">
        <q-toolbar class="bg-white">
          <q-toolbar-title>
            <span class="text-weight-thin text-primary"
              >Application Title
              <span class="text-weight-thin text-secondary">
                app subtitle
              </span>
            </span></q-toolbar-title
          >
        </q-toolbar>
        <q-img
          src="pexels-jeshootscom-576832.jpg"
          style="width: 70vw;height:55vh"
        >
        </q-img>
        <q-card-actions class="q-pb-none">
          <q-checkbox
            v-if="showUserOption"
            v-model="userHideDialogOptionMeramac"
            label="Do not show again"
          />
          <q-space />
          <q-btn
            flat
            label="OK"
            color="primary"
            @click="setUserChoice"
            v-close-popup
          />
        </q-card-actions>
        <div v-if="showUserOption" class="text-caption q-ml-md text-grey-7">
          *This dialog can be rerieved at any time by clicking the help button
          at the top of the screen
        </div>
      </q-card>
    </q-dialog> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      step: 1,
      showHelp: true,
      userHideDialogOptionMeramac: false,
      showUserOption: true,
      persistent: true,
    };
  },
  mounted() {
    //localStorage.userHideDialogOptionMeramac = '';
    if (localStorage.userHideDialogOptionMeramac == 'true') {
      this.showHelp = false;
      this.showUserOption = false;
      this.persistent = false;
    }
  },
  methods: {
    setUserChoice() {
      if (this.userHideDialogOptionMeramac == true) {
        localStorage.userHideDialogOptionMeramac = 'true';
        this.showUserOption = false;
        this.persistent = false;
      }
    },
  },
};
// removed from .header //
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Are+You+Serious&family=Carattere&family=Cookie&family=Merienda&display=swap');
header {
  background: var(--q-primary);
  height: 50px;
  color: white;
  font-size: 22px;
  padding: 10px 20px;
  box-shadow: 0px 8px 8px -2px rgb(51 51 51 / 42%);
  border-bottom: 1px solid var(--q-primary);
  position: relative;
  z-index: 10;
  display: flex;
}

.storymap {
  background: #fff;
  height: 50px;
  color: #000000;
  font-size: 25px;
  padding: 10px 20px;
  box-shadow: 0px 8px 8px -2px rgb(51 51 51 / 42%);
  position: relative;
  z-index: 10;
  display: flex;
  font-family: 'Merienda', cursive;
}

.q-img__content {
  background-color: rgba(255, 255, 255, 0.8);
}

header span {
  flex: 1;
  width: 700px;
  overflow: hidden;
  white-space: wrap;
  text-overflow: ellipsis;
}

header button {
  font-size: 15px;
}

.region-button {
  margin: 5px;
}

@media screen and (max-width: 700px) {
  header {
    background: var(--q-primary);
    height: 30px;
    color: #fff;
    font-size: 14px;
    padding: 5px 10px;
    box-shadow: 0px 8px 8px -2px rgb(51 51 51 / 42%);
    position: relative;
    z-index: 10;
    display: flex;
  }
  header button {
    font-size: 12px;
  }
}
</style>

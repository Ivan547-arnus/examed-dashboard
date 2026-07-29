<template>
  <q-dialog v-model="model">
    <q-card v-bind="$theme.card" class="full-width" style="max-width: 520px">
      <q-item class="bg-primary text-secondary">
        <q-item-section>
          <q-item-label class="text-h6">Configura coordenadas</q-item-label>
          <q-item-label caption class="text-grey-3">
            Usa cordenadas tipo UTM o GPS
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn
            v-bind="$theme.btnIcon"
            icon="sym_o_close"
            flat
            v-close-popup
            color="secondary"
          ></q-btn>
        </q-item-section>
      </q-item>
      <q-card-section>
        <q-form
          id="coordenadas-form"
          @submit.prevent="onSubmit"
          class="row q-col-gutter-md"
        >
          <div class="col-12">
            <q-radio v-model="state.type" val="utm" label="UTM" />
            <q-radio
              v-model="state.type"
              val="gps"
              class="q-ml-md"
              label="GPS"
            />
          </div>
          <q-input
            v-bind="$theme.input"
            v-model="state.utm"
            v-if="state.type === 'utm'"
            class="col-12"
            label="Coordenadas UTM"
            hint="Ejemplo: 14N 431548 2270993"
            :rules="[$rules.required('Campo obligatorio')]"
          ></q-input>
          <q-input
            v-bind="$theme.input"
            v-model="state.gps.lat"
            v-if="state.type === 'gps'"
            class="col-6"
            label="Latitud"
            type="number"
            hint="Ejemplo: 43.1548"
            :rules="[$rules.required('Campo obligatorio')]"
          ></q-input>
          <q-input
            v-bind="$theme.input"
            v-model="state.gps.lng"
            v-if="state.type === 'gps'"
            class="col-6"
            label="Longitud"
            type="number"
            hint="Ejemplo: -70.60993"
            :rules="[$rules.required('Campo obligatorio')]"
          ></q-input>
        </q-form>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-actions>
        <q-btn
          v-bind="$theme.btn"
          class="q-ml-auto"
          label="Cancelar"
          color="primary"
          outline
          v-close-popup
        ></q-btn>
        <q-btn
          v-bind="$theme.btn"
          type="submit"
          form="coordenadas-form"
          class="q-ml-auto"
          label="Aceptar"
          color="primary"
          text-color="secondary"
        ></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import proj4 from "proj4";
import { alert } from "src/config/dialog";
import { reactive, ref } from "vue";
const emit = defineEmits(["submit"]);
const model = ref(false);
const state = reactive({
  type: "utm" as "utm" | "gps",
  gps: {
    lat: null,
    lng: null,
  },
  utm: null,
});
function onSubmit() {
  normalizeCoords();
}

function reset() {
  state.type = "utm";
  state.gps.lat = null;
  state.gps.lng = null;
  state.utm = null;
}

function normalizeCoords() {
  try {
    if (state.type === "utm") {
      if (!state.utm) throw new Error("Especifique una coordenada UTM");
      const utmValues = String(state.utm).split(" ");
      if (utmValues.length !== 3)
        throw new Error("El formato de la coordenada UTM es inválido");
      const [zoneHemisphere, easting, northing] = utmValues as [
        string,
        number,
        number,
      ];
      if (
        !Number.isFinite(Number(easting)) ||
        !Number.isFinite(Number(northing))
      ) {
        throw new Error("Las coordenadas UTM son inválidas");
      }
      const zone = zoneHemisphere.slice(0, -1);
      const hemisphere = zoneHemisphere.slice(-1);
      if (
        !Number.isFinite(Number(zone)) ||
        (hemisphere !== "N" && hemisphere !== "S")
      ) {
        throw new Error("El hemisferio de la coordenada UTM es inválido");
      }
      const utmProj = `+proj=utm +zone=${zone} +${hemisphere === "N" ? "north" : "south"} +ellps=WGS84 +datum=WGS84 +units=m +no_defs`;
      const wgs84 = "+proj=longlat +datum=WGS84 +no_defs";
      const coords = proj4(utmProj, wgs84, [Number(easting), Number(northing)]);
      emit("submit", [Number(coords[1]), Number(coords[0])], state.utm);
      model.value = false;
    } else {
      if (
        !Number.isFinite(Number(state.gps.lat)) ||
        !Number.isFinite(Number(state.gps.lng))
      ) {
        throw new Error("Las coordenadas GPS deben de ser números válidos");
      }
      emit("submit", [Number(state.gps.lat), Number(state.gps.lng)]);
      model.value = false;
    }
  } catch (e) {
    console.error(e);
    void alert("Error", String(e), {
      type: "negative",
    });
  }
}

defineExpose({
  open() {
    reset();
    model.value = true;
  },
});
</script>

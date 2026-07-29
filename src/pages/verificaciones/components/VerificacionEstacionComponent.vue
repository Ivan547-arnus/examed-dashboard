<template>
  <q-form id="verification-station-form" @submit.prevent="onSubmit">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-card v-bind="$theme.card">
          <q-item class="bg-primary text-secondary">
            <q-item-section>
              <q-item-label class="text-h6">
                Información general
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-card-section>
            <div class="row q-col-gutter-md">
              <q-input
                v-bind="$theme.input"
                v-model="stationStore.station.razon_social"
                label="Razon social"
                class="col-12"
              ></q-input>
              <q-input
                v-bind="$theme.input"
                v-model="stationStore.station.rfc"
                label="RFC"
                class="col-12"
              ></q-input>
              <q-input
                v-bind="$theme.input"
                v-model="stationStore.station.calle"
                label="Calle y número"
                class="col-12"
              ></q-input>
              <q-input
                v-bind="$theme.input"
                v-model="stationStore.station.colonia"
                label="Colonia"
                class="col-12"
              ></q-input>
              <q-input
                v-bind="$theme.input"
                v-model="stationStore.station.cp"
                label="Código postal"
                class="col-12"
              ></q-input>
              <q-fetch-select
                v-bind="$theme.input"
                v-model="stationStore.station.state"
                label="Estado"
                class="col-12 col-sm-6"
                url="/utils/states"
                option-label="nombre"
                @update:modelValue="
                  () => (stationStore.station.municipality = null)
                "
              ></q-fetch-select>
              <q-fetch-select
                v-bind="$theme.input"
                v-model="stationStore.station.municipality"
                label="Municipio"
                class="col-12 col-sm-6"
                option-label="nombre"
                :block-fetch="!stationStore.station.state"
                :disable="!stationStore.station.state"
                :url="`/utils/municipalities/${stationStore.station.state?.id}`"
              ></q-fetch-select>
            </div>
          </q-card-section>
        </q-card>
        <q-card v-bind="$theme.card" class="q-mt-md">
          <q-item class="bg-primary text-secondary">
            <q-item-section>
              <q-item-label class="text-h6">
                Información de contacto
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-card-section>
            <div class="row q-col-gutter-md">
              <q-input
                v-bind="$theme.input"
                v-model="stationStore.station.correo"
                label="Correo"
                class="col-12"
                :rules="[$rules.email('Formato de correo invalido')]"
              ></q-input>
              <q-input
                v-bind="$theme.input"
                v-model="stationStore.station.telefono"
                label="Teléfono"
                class="col-12"
                mask="(###) ###-####"
                unmasked-value
              ></q-input>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-6">
        <q-card v-bind="$theme.card">
          <q-item class="bg-primary text-secondary">
            <q-item-section>
              <q-item-label class="text-h6">
                Configuración de ubicación
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-card-section>
            <div
              class="full-width flex column items-center"
              v-if="!stationStore.station.cordenadas_gps"
            >
              <q-avatar color="grey-4" size="4rem" class="q-mb-md">
                <q-icon name="sym_o_info"></q-icon>
              </q-avatar>
              <p class="text-h6 text-center">
                Aun no se han configurado coordenadas
              </p>
              <p class="text-center text-caption">
                Configura las coordenadas para poder tener diferentes funciones
                de geolocalización
              </p>
              <q-btn
                v-bind="$theme.btn"
                color="primary"
                text-color="secondary"
                label="Obtener coordenadas por dirección"
                @click="handleGeocode"
              ></q-btn>

              <q-btn
                v-bind="$theme.btn"
                class="q-mt-md"
                color="grey-3"
                text-color="primary"
                label="Agregar coordenadas manualmente"
                @click="coordenadasDialogRef?.open()"
              ></q-btn>
            </div>
            <template v-if="stationStore.station.cordenadas_gps">
              <q-banner class="bg-grey-3 border-md-radius q-mb-md">
                <template #avatar v-if="$q.screen.gt.md">
                  <q-avatar size="4rem">
                    <q-icon
                      name="sym_o_globe_location_pin"
                      color="primary"
                    ></q-icon>
                  </q-avatar>
                </template>
                <p class="text-h6 text-primary">Aviso</p>
                <p class="text-primary">
                  Si el icono no se muestra en la locación exacta puedes
                  arrastrar el mapa y dar click en el mapa para seleccionar una
                  ubicación que se ajuste mejor o puedes ingresar las
                  coordenadas manualmente.
                </p>
                <template #action>
                  <q-btn
                    v-bind="$theme.btn"
                    color="primary"
                    text-color="secondary"
                    icon="sym_o_manufacturing"
                    icon-right="sym_o_arrow_drop_down"
                    label="Configurar coordenadas"
                  >
                    <q-menu v-bind="$theme.menu">
                      <q-list>
                        <q-item
                          clickable
                          v-ripple
                          v-close-popup
                          @click="handleGeocode"
                        >
                          <q-item-section>
                            Obtener coordenadas por dirección
                          </q-item-section>
                        </q-item>

                        <q-item
                          clickable
                          v-ripple
                          v-close-popup
                          @click="coordenadasDialogRef?.open()"
                        >
                          <q-item-section>
                            Agregar coordenadas manualmente
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                </template>
              </q-banner>
              <div
                ref="mapContainer"
                class="full-width border-md-radius"
                style="height: 500px"
              ></div>
            </template>
          </q-card-section>
        </q-card>
        <div class="full-width flex justify-end q-mt-md">
          <q-btn
            v-bind="$theme.btn"
            type="submit"
            form="verification-station-form"
            color="primary"
            text-color="secondary"
            icon="sym_o_save"
            label="Guardar cambios"
          ></q-btn>
        </div>
      </div>
    </div>
  </q-form>
  <CoordenadasDialog ref="coordenadasDialogRef" @submit="setDataLocation" />
</template>

<script lang="ts" setup>
import QFetchSelect from "src/components/QFetchSelect.vue";
import CoordenadasDialog from "src/pages/estaciones/components/CoordenadasDialog.vue";
import { utils } from "src/boot/helpers";
import { alert, question } from "src/config/dialog";
import { useStation } from "src/stores/station-store";
import { useVerificacion } from "src/stores/verificacion-store";
import { Station, type IStation } from "src/types/IStation";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useQuasar } from "quasar";
import { nextTick, onUnmounted, ref, watch } from "vue";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const $q = useQuasar();
const stationStore = useStation();
const verificationStore = useVerificacion();
const coordenadasDialogRef = ref<InstanceType<typeof CoordenadasDialog> | null>(
  null,
);
const mapContainer = ref<HTMLElement | null>(null);
const ZOOM_LEVEL = 17;
const markers: L.Marker[] = [];
let map: L.Map | null = null;

watch(
  () => verificationStore.verificacion.station,
  (station) => {
    if (station) {
      stationStore.station = new Station(station);
      if (stationStore.station.cordenadas_gps) {
        const [lat, lng] = stationStore.station.cordenadas_gps.split(",");
        void setDataLocation([Number(lat), Number(lng)]);
      }
    }
  },
  { immediate: true },
);

async function handleGeocode() {
  utils.showLoading("Obteniendo ubicación...");
  const { error, message, data } = await stationStore.geocoding();
  utils.hideLoading();

  if (error) {
    await alert("Error", message, {
      type: "negative",
    });
    return;
  }

  if (data) {
    void setDataLocation(data as [number, number]);
  }
}

async function setDataLocation(data: [number, number], utm: string | null = null) {
  stationStore.station.cordenadas_gps = data.join(",");
  stationStore.station.cordenadas_utm = utm ?? utils.gpsToUTM(data);

  await nextTick();
  const currentMap = startMap();
  if (currentMap) {
    currentMap.setView(data, ZOOM_LEVEL);
    removeMarkers();
    const marker = L.marker(data);
    marker.addTo(currentMap);
    markers.push(marker);
  }
}

function startMap() {
  if (map) {
    return map;
  }

  if (mapContainer.value) {
    map = L.map(mapContainer.value, {
      center: [0, 0],
      zoom: ZOOM_LEVEL,
      doubleClickZoom: false,
    });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);
    map.addEventListener("click", ({ latlng }) => {
      void setDataLocation([latlng.lat, latlng.lng]);
    });
    return map;
  }
}

function removeMarkers() {
  for (const marker of markers) {
    map?.removeLayer(marker);
  }
  markers.length = 0;
}

async function onSubmit() {
  const answer = await question(
    "Guardar estación",
    "¿Seguro de que deseas guardar los cambios de la estación?",
    { type: "info" },
  );

  if (!answer) return;

  const { error, message, data } = await stationStore.update(
    stationStore.station.id,
  );

  await alert(error ? "Error" : "Operación exitosa", message, {
    type: error ? "negative" : "positive",
  });

  if (!error && data) {
    const updatedStation = data as IStation;
    stationStore.station = new Station(updatedStation);
  }
}

onUnmounted(() => {
  if (map) {
    map.remove();
  }
});
</script>

<template>
  <q-page padding class="extended-xl">
    <q-btn
      v-bind="$theme.btn"
      class="q-mb-md"
      label="Regresar"
      color="grey-3"
      text-color="pimary"
      icon="sym_o_arrow_back"
      @click="() => void router.push('/estaciones')"
    ></q-btn>
    <div class="row q-mb-md q-col-gutter-md items-stretch">
      <div class="col-12 col-md-4">
        <q-card v-bind="$theme.card" class="verification-summary-card">
          <q-card-section class="verification-summary-card__content">
            <div
              class="verification-summary-card__icon bg-primary text-secondary"
            >
              <q-icon name="sym_o_fact_check" size="26px"></q-icon>
            </div>
            <div class="verification-summary-card__body">
              <div class="text-h6 verification-summary-card__title">
                <span>Verificación actual</span>
              </div>
              <div class="verification-summary-card__description">
                Actualmente no tiene una solicitud de verificación activa.
              </div>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-actions align="right" class="q-pa-md">
            <q-btn
              v-bind="$theme.btn"
              label="Crear solicitud"
              icon-right="sym_o_arrow_forward"
            ></q-btn>
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card v-bind="$theme.card" class="verification-summary-card">
          <q-card-section class="verification-summary-card__content">
            <div
              class="verification-summary-card__icon bg-primary text-secondary"
            >
              <q-icon name="sym_o_history" size="26px"></q-icon>
            </div>
            <div class="verification-summary-card__body">
              <div class="text-h6 verification-summary-card__title">
                <span> Ultima verificación </span>
                <q-chip
                  dense
                  square
                  color="green-1"
                  text-color="positive"
                  icon="sym_o_verified"
                  class="q-mt-sm"
                >
                  Vigente
                </q-chip>
              </div>
              <div class="verification-summary-card__description">
                La última verificación registrada para esta estación fue el
                20/06/2027.
              </div>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-actions align="right" class="q-pa-md">
            <q-btn
              v-bind="$theme.btn"
              label="Ver verificación"
              icon-right="sym_o_arrow_forward"
            ></q-btn>
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card v-bind="$theme.card" class="station-actions-card">
          <q-card-section>
            <div class="text-h6 q-mb-sm">Acciones rápidas</div>
            <div class="text-caption text-grey-7 q-mb-md">
              Consulta dispensarios o guarda los cambios realizados en la
              información de la estación.
            </div>
            <div class="station-actions-card__actions">
              <q-btn
                v-bind="$theme.btn"
                :to="`/estaciones/dispensarios/${$router.currentRoute.value.params.id}`"
                outline
                color="primary"
                icon="sym_o_local_gas_station"
                label="Ver dispensarios"
              ></q-btn>
              <q-btn
                v-bind="$theme.btn"
                type="submit"
                form="station-form"
                color="primary"
                text-color="secondary"
                icon="sym_o_save"
                label="Guardar cambios"
              ></q-btn>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <q-form
      id="station-form"
      class="row q-col-gutter-md"
      @submit.prevent="onSubmit"
    >
      <div class="col-12 col-sm-6">
        <q-card v-bind="$theme.card">
          <q-item class="bg-primary text-secondary">
            <q-item-section>
              <q-item-label class="text-h6"> Información general </q-item-label>
            </q-item-section>
          </q-item>
          <q-card-section>
            <div class="row q-col-gutter-md">
              <q-input
                v-bind="$theme.input"
                label="Razon social"
                class="col-12"
                v-model="stationStore.station.razon_social"
              ></q-input>

              <q-input
                v-bind="$theme.input"
                label="RFC"
                class="col-12"
                v-model="stationStore.station.rfc"
              ></q-input>
              <q-input
                v-bind="$theme.input"
                label="Calle y número"
                class="col-12"
                v-model="stationStore.station.calle"
              ></q-input>
              <q-input
                v-bind="$theme.input"
                label="Colonia"
                class="col-12"
                v-model="stationStore.station.colonia"
              ></q-input>
              <q-input
                v-bind="$theme.input"
                label="Código postal"
                class="col-12"
                v-model="stationStore.station.cp"
              ></q-input>
              <q-fetch-select
                v-bind="$theme.input"
                label="Estado"
                class="col-6"
                url="/utils/states"
                option-label="nombre"
                v-model="stationStore.station.state"
                @update:modelValue="
                  () => (stationStore.station.municipality = null)
                "
              ></q-fetch-select>
              <q-fetch-select
                v-bind="$theme.input"
                label="Municipio"
                class="col-6"
                option-label="nombre"
                :block-fetch="!stationStore.station.state"
                :disable="!stationStore.station.state"
                :url="`/utils/municipalities/${stationStore.station.state?.id}`"
                v-model="stationStore.station.municipality"
              ></q-fetch-select>
            </div>
          </q-card-section>
        </q-card>
        <q-card v-bind="$theme.card" class="q-mt-md">
          <q-item class="bg-primary text-secondary">
            <q-item-section>
              <q-item-label class="text-h6"
                >Información de contacto</q-item-label
              >
            </q-item-section>
          </q-item>
          <q-card-section>
            <div class="row q-col-gutter-md">
              <q-input
                v-bind="$theme.input"
                label="Correo"
                class="col-12"
                v-model="stationStore.station.correo"
                :rules="[$rules.email('Formato de correo invalido')]"
              ></q-input>
              <q-input
                v-bind="$theme.input"
                label="Teléfono"
                class="col-12"
                mask="(###) ###-####"
                unmasked-value
                v-model="stationStore.station.telefono"
              ></q-input>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6">
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
                textColor="secondary"
                label="Obtener coordenadas por dirección"
                @click="handleGeocode"
              ></q-btn>

              <q-btn
                v-bind="$theme.btn"
                class="q-mt-md"
                color="grey-3"
                textColor="primary"
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
              <div ref="mapContainer" class="map border-md-radius"></div>
            </template>
          </q-card-section>
        </q-card>
      </div>
    </q-form>
    <CoordenadasDialog ref="coordenadasDialogRef" @submit="setDataLocation" />
  </q-page>
</template>

<script setup lang="ts">
import QFetchSelect from "src/components/QFetchSelect.vue";
import { useStation } from "src/stores/station-store";
import L from "leaflet";
import { nextTick, onMounted, onUnmounted, ref } from "vue";
import "leaflet/dist/leaflet.css";
import { useRouter } from "vue-router";
import { alert, question } from "src/config/dialog";
import { utils } from "src/boot/helpers";
import CoordenadasDialog from "src/pages/estaciones/components/CoordenadasDialog.vue";
import { useQuasar } from "quasar";
const $q = useQuasar();
const mapContainer = ref(null);
const coordenadasDialogRef = ref<InstanceType<typeof CoordenadasDialog> | null>(
  null,
);
let map: L.Map | null = null;
const stationStore = useStation();
const router = useRouter();
const ZOOM_LEVEL = 17;
const markers: L.Marker[] = [];

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

async function setDataLocation(data: [number, number]) {
  stationStore.station.cordenadas_gps = data.join(",");
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
    "Estación",
    "¿Seguro de que deseas guardar los cambios?",
    {
      type: "info",
    },
  );
  if (!answer) {
    return;
  }
  const { error, message } = await stationStore.update(
    Number(router.currentRoute.value.params.id),
  );

  await alert(error ? "Error" : "Operación exitosa", message, {
    type: error ? "negative" : "positive",
  });

  void router.push("/estaciones");
}

onMounted(async () => {
  const { error, message } = await stationStore.get(
    Number(router.currentRoute.value.params.id),
  );
  if (error) {
    await alert("Error", message, {
      type: "negative",
    });
    void router.push("/estaciones");
    return;
  }

  if (stationStore.station.cordenadas_gps) {
    const [lat, lng] = stationStore.station.cordenadas_gps.split(",");
    void setDataLocation([Number(lat), Number(lng)]);
  }
});

onUnmounted(() => {
  if (map) {
    map.remove();
  }
});
</script>

<style lang="scss" scoped>
.verification-summary-card,
.station-actions-card {
  height: 100%;
  overflow: hidden;
  border: 1px solid rgba(15, 23, 42, 0.08);
}

.verification-summary-card {
  display: grid;
  grid-template-rows: 1fr auto;
}

.verification-summary-card__content {
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr);
  gap: 14px;
  align-items: start;
}

.verification-summary-card__icon {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.verification-summary-card__body {
  min-width: 0;
}

.verification-summary-card__eyebrow,
.station-actions-card__eyebrow {
  margin-bottom: 4px;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(15, 23, 42, 0.56);
}

.verification-summary-card__title {
  color: #132238;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.verification-summary-card__description {
  margin-top: 6px;
  color: rgba(15, 23, 42, 0.68);
  font-size: 0.9rem;
  line-height: 1.4;
}

.station-actions-card__actions {
  display: grid;
  gap: 10px;
}

.station-actions-card__actions .q-btn {
  width: 100%;
}

.map {
  width: 100%;
  height: 500px;
}
</style>

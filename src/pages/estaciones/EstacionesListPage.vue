<template>
  <q-page padding class="extended-xl">
    <q-card v-bind="$theme.card" class="bg-transparent no-shadow">
      <q-card-section class="q-px-none">
        <div class="row q-col-gutter-md">
          <div class="col-12 flex justify-end">
            <div class="row justify-end q-col-gutter-md">
              <div class="col-12 col-sm-auto flex justify-end">
                <!-- <q-btn-group v-bind="$theme.btn">
                  <q-btn
                    v-bind="$theme.btn"
                    :class="{
                      'bg-primary': !stationStore.grid,
                      'text-secondary': !stationStore.grid,
                    }"
                    label="Lista"
                    icon="sym_o_view_list"
                    @click="stationStore.grid = false"
                  />
                  <q-btn
                    v-bind="$theme.btn"
                    :class="{
                      'bg-primary': stationStore.grid,
                      'text-secondary': stationStore.grid,
                    }"
                    label="Cuadricula"
                    icon="sym_o_grid_view"
                    @click="stationStore.grid = true"
                  />
                </q-btn-group> -->
              </div>
              <div class="col-12 col-sm-auto flex justify-end">
                <q-btn
                  v-bind="$theme.btn"
                  color="primary"
                  text-color="secondary"
                  icon="sym_o_local_gas_station"
                  label="Crear estación"
                  @click="preCreacionEstacionDialogRef?.open()"
                >
                </q-btn>
              </div>
            </div>
          </div>
          <q-input
            v-bind="$theme.input"
            class="col-12 col-sm-6 col-md-3"
            dense
            label="Busca por nombre o CRE"
            clearable
            debounce="1000"
            v-model="stationStore.search"
          >
            <template #append>
              <q-icon name="sym_o_search" color="primary"></q-icon>
            </template>
          </q-input>
          <q-fetch-select
            v-bind="$theme.input"
            class="col-12 col-sm-6 col-md-3"
            dense
            label="Selecciona un estado"
            clearable
            url="/utils/states"
            option-label="nombre"
            v-model="stationStore.state"
            @update:model-value="
              () => {
                stationStore.municipality = null;
              }
            "
          >
          </q-fetch-select>
          <q-fetch-select
            v-bind="$theme.input"
            class="col-12 col-sm-6 col-md-3"
            dense
            label="Selecciona un municipio"
            clearable
            :url="`/utils/municipalities/${stationStore.state?.id ?? ''}`"
            option-label="nombre"
            :block-fetch="!stationStore.state"
            v-model="stationStore.municipality"
            :disable="!stationStore.state"
          >
          </q-fetch-select>
          <div class="col-3 flex justify-end"></div>
        </div>
      </q-card-section>
    </q-card>
    <q-card
      v-bind="$theme.card"
      class="full-width"
      :class="{
        'bg-transparent no-shadow': stationStore.grid,
      }"
    >
      <q-table-component
        class="border-xs-radius"
        table-header-class="text-h6 bg-primary text-secondary"
        :grid="stationStore.grid"
        url="/stations"
        v-model:pagination="pagination"
        :columns="columns"
        ref="stationTableRef"
        v-model:search="stationStore.search"
        :request-data="tableRequestData"
      >
        <template #body-cell-actions="props">
          <q-td v-bind="props">
            <q-btn outline v-bind="$theme.btnIcon" icon="sym_o_more_vert" flat>
              <q-menu v-bind="$theme.menu">
                <q-list>
                  <q-item
                    clickable
                    v-ripple
                    v-if="!props.row.current_verification"
                    @click="handleCreateVerification(props.row.id)"
                  >
                    <q-item-section avatar>
                      <q-icon name="sym_o_add_notes"></q-icon>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Crear solicitud</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item
                    clickable
                    v-ripple
                    :to="`/estaciones/editar/${props.row.id}`"
                  >
                    <q-item-section avatar>
                      <q-icon name="sym_o_edit_square"></q-icon>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Editar estación</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item
                    clickable
                    v-ripple
                    :to="`/estaciones/dispensarios/${props.row.id}`"
                  >
                    <q-item-section avatar>
                      <q-icon name="sym_o_edit_square"></q-icon>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Configurar dispensarios</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-td>
        </template>
        <template #no-data>
          <div class="no-items text-primary">
            <q-avatar v-bind="$theme.avatar" color="grey-3" size="78px">
              <q-icon name="sym_o_info" color="primary" size="1.25em"></q-icon>
            </q-avatar>
            <span class="text-h6">
              Oops, lo sentimos pero no se encontraron estaciones
            </span>
            <span class="text-caption">
              Crea una nueva estación para comenzar
            </span>
            <q-btn
              v-bind="$theme.btn"
              icon="sym_o_add"
              color="primary"
              text-color="secondary"
              label="Crear estación"
              @click="preCreacionEstacionDialogRef?.open()"
            ></q-btn>
          </div>
        </template>
        <template v-slot:item="props">
          <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
            <q-card v-bind="$theme.card" class="station-card">
              <q-card-section class="station-card__hero ">
                <div class="row items-start no-wrap q-col-gutter-xs">
                  <div class="col">
                    <div
                      class="row items-start justify-between q-col-gutter-sm"
                    >
                      <div class="col">
                        <div class="text-bold station-card__title">
                          {{ props.row.razon_social ?? "-" }}
                        </div>
                      </div>
                    </div>
                    <div class="station-card__location">
                      <q-icon name="sym_o_location_on" size="18px" />
                      <span>
                        {{ props.row.municipality.nombre }},
                        {{ props.row.state.nombre }}
                      </span>
                    </div>
                  </div>
                </div>
              </q-card-section>
              <q-separator></q-separator>
              <q-card-section class="q-pt-md">
                <div class="station-card__info-list">
                  <q-item class="full-width bg-grey-2 border-md-radius">
                    <q-item-section
                      avatar
                      class="q-pa-none"
                      style="min-width: 36px"
                    >
                      <q-icon name="sym_o_assignment" color="primary" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption>Permiso CRE</q-item-label>
                      <q-item-label>{{ props.row.cre }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-btn
                        v-bind="$theme.btn"
                        @click="$utils.copyToClipboard(props.row.cre)"
                        dense
                        flat
                        icon="sym_o_content_copy"
                      ></q-btn>
                    </q-item-section>
                  </q-item>

                  <q-item class="full-width bg-grey-2 border-md-radius">
                    <q-item-section
                      avatar
                      class="q-pa-none"
                      style="min-width: 36px"
                    >
                      <q-icon name="sym_o_pin_drop" color="primary" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption>Dirección</q-item-label>
                      <q-item-label>{{
                        props.row.formatted_address ?? "-"
                      }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-btn
                        v-bind="$theme.btn"
                        @click="
                          $utils.copyToClipboard(props.row.formatted_address)
                        "
                        dense
                        flat
                        icon="sym_o_content_copy"
                      ></q-btn>
                    </q-item-section>
                  </q-item>
                </div>
                <div class="row q-mt-md q-col-gutter-x-md">
                  <div class="col-6">
                    <q-btn
                      v-bind="$theme.btn"
                      class="full-width"
                      color="grey-2"
                      text-color="primary"
                      :to="`/estaciones/editar/${props.row.id}`"
                    >
                      <div class="flex column items-center">
                        <q-icon name="sym_o_edit_square"></q-icon>
                        <span>Editar</span>
                      </div>
                    </q-btn>
                  </div>
                  <div class="col-6">
                    <q-btn
                      v-bind="$theme.btn"
                      class="full-width"
                      color="grey-2"
                      text-color="primary"
                      :to="`/estaciones/dispensarios/${props.row.id}`"
                    >
                      <div class="flex column items-center">
                        <q-icon name="sym_o_local_gas_station"></q-icon>
                        <span>Dispensarios</span>
                      </div>
                    </q-btn>
                  </div>
                </div>
              </q-card-section>

              <q-separator />

              <q-card-section class="station-card__footer">
                <div class="station-card__verification" v-if="props.row.current_verification">
                  <q-icon name="sym_o_fact_check" size="22px" color="primary" />
                  <div>
                    <div class="station-card__label">
                      <span>
                        Verificación en curso
                      </span>
                      <q-chip
                        v-if="props.row.current_verification.estatus"
                        v-bind="verificationStatusChip(props.row.current_verification.estatus)"
                        dense
                        square
                        class="q-ma-none"
                      ></q-chip>
                    </div>
                    <div class="station-card__value station-card__verification-header">
                      <span>
                        {{ props.row.current_verification.folio || "Sin folio" }}
                      </span>
                      <div class="station-card__hint">
                        Fecha de solicitud:
                        {{
                          props.row.current_verification.fecha_solicitud
                            ? $filters.date(props.row.current_verification.fecha_solicitud)
                            : "Sin fecha"
                        }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="station-card__verification" v-else>
                  <q-icon name="sym_o_fact_check" size="22px" color="primary" />
                  <div>
                    <div class="station-card__label">Verificación en curso</div>
                    <div class="station-card__value">
                      Sin solicitud en curso
                    </div>
                    <div class="station-card__hint">
                      Crea una solicitud para comenzar el seguimiento de esta
                      estación.
                    </div>
                  </div>
                </div>

                <q-btn
                  v-if="!props.row.current_verification"
                  v-bind="$theme.btn"
                  @click="handleCreateVerification(props.row.id)"
                  icon="sym_o_add_notes"
                  color="primary"
                  text-color="secondary"
                  class="full-width station-card__action"
                  label="Crear solicitud"
                >
                </q-btn>
                <q-btn
                  v-else
                  v-bind="$theme.btn"
                  :to="`/verificaciones/${props.row.current_verification.id}`"
                  icon="sym_o_fact_check"
                  color="primary"
                  text-color="secondary"
                  class="full-width station-card__action"
                  label="Ver solicitud"
                >
                </q-btn>
              </q-card-section>
            </q-card>
          </div>
        </template>
      </q-table-component>
    </q-card>
    <PreCreacionEstacionDialog ref="preCreacionEstacionDialogRef" />
  </q-page>
</template>

<script setup lang="ts">
import QTableComponent from "src/components/QTableComponent.vue";
import { useStation } from "src/stores/station-store";
import type { IStation } from "src/types/IStation";
import { verificationStatusChip } from "src/types/IVerification";
import { computed, ref, watch } from "vue";
import PreCreacionEstacionDialog from "src/pages/estaciones/components/PreCreacionEstacionDialog.vue";
import QFetchSelect from "src/components/QFetchSelect.vue";
import { alert, question } from "src/config/dialog";
import { useRouter } from "vue-router";
const stationTableRef = ref<{ refresh: () => void } | null>(null);
const router = useRouter();
const pagination = ref({
  page: 1,
  rowsPerPage: 12,
  sortBy: null,
  descending: false,
  rowsNumber: 0,
});
const preCreacionEstacionDialogRef = ref<{ open: () => void } | null>(null);
const tableRequestData = computed(() => {
  const filters = [];
  if (stationStore.state) {
    filters.push({
      key: "id_state",
      operator: "=",
      value: stationStore.state.id,
    });
  }

  if (stationStore.municipality) {
    filters.push({
      key: "id_municipality",
      operator: "=",
      value: stationStore.municipality.id,
    });
  }
  return { filters };
});

const columns = [
  {
    name: "cre",
    field: "cre",
    label: "Permiso CRE",
    align: "left",
    searchable: true,
    sortable: false,
  },
  {
    name: "razon_social",
    field: "razon_social",
    label: "Razón social",
    align: "left",
    searchable: true,
    sortable: false,
  },
  {
    name: "state",
    field: (row: IStation) =>
      row.state?.nombre + ", " + row.municipality?.nombre,
    label: "Estado - Municipio",
    align: "left",
    searchable: false,
    sortable: false,
  },
  {
    name: "formatted_address",
    field: "formatted_address",
    label: "Dirección",
    align: "left",
    searchable: false,
    sortable: false,
  },
  {
    name: "actions",
    field: "actions",
    label: "Acciones",
    align: "right",
    searchable: false,
    sortable: false,
  },
];

const stationStore = useStation();

async function handleCreateVerification(stationId: number) {
  const answer = await question(
    "Crear solicitud",
    "¿Seguro que deseas crear una solicitud de verificación para la estación seleccionada?",
    {
      type: "info",
    },
  );
  if (!answer) return;
  const { error, message, data } = await stationStore.creteVerification(stationId);
  if (error) {
    void alert("Error", message, {
      type: "negative",
    });
    return;
  } else {
    void router.push(`/verificaciones/${data?.id}`);
  }
}

watch(
  tableRequestData,
  () => {
    stationTableRef.value?.refresh();
  },
  { flush: "post" },
);
</script>

<style scoped lang="scss">
.station-card {
  height: 100%;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto auto auto;
  border: 1px solid rgba(15, 23, 42, 0.08);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.station-card:hover {
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.12);
}

.station-card__avatar {
  background: rgba(25, 118, 210, 0.14);
  color: var(--q-primary);
  font-size: 1.15rem;
  font-weight: 700;
  border: 1px solid rgba(25, 118, 210, 0.18);
}

.station-card__eyebrow {
  margin-bottom: 4px;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(15, 23, 42, 0.56);
}

.station-card__title {
  line-height: 1.2;
  color: #132238;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.station-card__chip {
  max-width: 180px;
}

.station-card__chip :deep(.q-chip__content) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.station-card__location {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: rgba(15, 23, 42, 0.72);
  font-size: 0.92rem;
}

.station-card__info-list {
  display: grid;
  gap: 10px;
}

.station-card__info-item {
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr);
  gap: 10px;
  align-items: start;
  padding: 12px;
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.035);
  border: 1px solid rgba(15, 23, 42, 0.06);
}

.station-card__label {
  margin-bottom: 4px;
  font-size: 0.76rem;
  font-weight: 700;
  text-transform: uppercase;
  display: flex;
  justify-content: space-between;
}

.station-card__value {
  color: #132238;
  line-height: 1.4;
  word-break: break-word;
}

.station-card__verification-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
  font-weight: 600;
}

.station-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.station-card__footer {
  display: grid;
  gap: 14px;
  background: rgba(15, 23, 42, 0.02);
}

.station-card__verification {
  display: grid;
  grid-template-columns: 22px minmax(0, 1fr);
  gap: 10px;
  align-items: start;
}

.station-card__hint {
  margin-top: 4px;
  color: rgba(15, 23, 42, 0.6);
  font-size: 0.83rem;
  line-height: 1.35;
}

.station-card__action {
  min-height: 42px;
}

.no-items {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  align-items: center;
  margin-top: 27.5vh;
  margin-bottom: 27.5vh;
}
</style>

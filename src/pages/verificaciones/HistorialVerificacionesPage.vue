<template>
  <q-page padding class="extended-xl">
    <q-card v-bind="$theme.card" class="bg-transparent no-shadow">
      <q-card-section class="q-px-none">
        <div class="row q-col-gutter-md">
          <q-input
            v-bind="$theme.input"
            class="col-12 col-sm-6 col-md-3"
            dense
            label="Buscar por permiso CRE"
            clearable
            debounce="1000"
            v-model="cre"
          >
            <template #append>
              <q-icon name="sym_o_search" color="primary"></q-icon>
            </template>
          </q-input>
          <q-input
            v-bind="$theme.input"
            class="col-12 col-sm-6 col-md-3"
            dense
            label="Busca por folio"
            clearable
            debounce="1000"
            v-model="folio"
          >
            <template #append>
              <q-icon name="sym_o_search" color="primary"></q-icon>
            </template>
          </q-input>
          <q-select
            v-bind="$theme.input"
            class="col-12 col-sm-6 col-md-3"
            dense
            label="Selecciona un estatus"
            clearable
            clear-icon="sym_o_close"
            :options="['Borrador', 'Pendiente', 'Aprobada', 'Finalizada']"
            v-model="estatus"
          >
          </q-select>
          <q-select
            v-bind="$theme.input"
            class="col-12 col-sm-6 col-md-3"
            dense
            label="Selecciona un tipo"
            clearable
            clear-icon="sym_o_close"
            :options="['Inicial', 'Periodica', 'Extraodinaria']"
            v-model="tipo"
          >
          </q-select>
        </div>
      </q-card-section>
    </q-card>
    <q-card v-bind="$theme.card" class="full-width bg-transparent no-shadow">
      <q-table-component
        class="border-xs-radius"
        grid
        url="verifications/get-all"
        v-model:pagination="pagination"
        :columns="columns"
        ref="verificationTableRef"
        :request-data="tableRequestData"
      >
        <template #no-data>
          <div class="no-items text-primary">
            <q-avatar v-bind="$theme.avatar" color="grey-3" size="78px">
              <q-icon name="sym_o_info" color="primary" size="1.25em"></q-icon>
            </q-avatar>
            <span class="text-h6">
              Oops, lo sentimos pero no se encontraron verificaciones
            </span>
            <span class="text-caption">
              Crea una solicitud de verificación para comenzar
            </span>
          </div>
        </template>
        <template v-slot:item="props">
          <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
            <q-card v-bind="$theme.card" class="verification-card">
              <q-card-section class="verification-card__hero">
                <div class="row items-start justify-between q-col-gutter-sm">
                  <div class="col">
                    <div class="verification-card__folio">
                      <span class="text-bold verification-card__title">
                        Folio: {{ props.row.folio || "Sin folio" }}
                      </span>
                    </div>
                  </div>
                  <div class="col-auto">
                    <q-chip
                      v-if="props.row.estatus"
                      v-bind="verificationStatusChip(props.row.estatus)"
                      dense
                      square
                      class="q-ma-none"
                    ></q-chip>
                  </div>
                </div>
                <div
                  class="verification-card__station"
                  v-if="props.row.station"
                >
                  <q-icon name="sym_o_assignment" size="18px" />
                  <span>{{ props.row.station.cre }}</span>
                </div>
              </q-card-section>
              <q-separator></q-separator>
              <q-card-section >
                <div class="verification-card__info-list">
                  <q-item class="full-width bg-grey-2 border-md-radius">
                    <q-item-section
                      avatar
                      class="q-pa-none"
                      style="min-width: 36px"
                    >
                      <q-icon name="sym_o_fact_check" color="primary" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption>Tipo de verificación</q-item-label>
                      <q-item-label>
                        {{ props.row.tipo || "Sin tipo" }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item class="full-width bg-grey-2 border-md-radius">
                    <q-item-section
                      avatar
                      class="q-pa-none"
                      style="min-width: 36px"
                    >
                      <q-icon name="sym_o_calendar_month" color="primary" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption>Fecha de solicitud</q-item-label>
                      <q-item-label>
                        {{
                          props.row.fecha_solicitud
                            ? $filters.date(props.row.fecha_solicitud)
                            : "Sin fecha"
                        }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item class="full-width bg-grey-2 border-md-radius">
                    <q-item-section
                      avatar
                      class="q-pa-none"
                      style="min-width: 36px"
                    >
                      <q-icon name="sym_o_payments" color="primary" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption>Total</q-item-label>
                      <q-item-label>
                        {{ $filters.currency(props.row.total ?? 0) }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item class="full-width bg-grey-2 border-md-radius">
                    <q-item-section
                      avatar
                      class="q-pa-none"
                      style="min-width: 36px"
                    >
                      <q-icon name="sym_o_engineering" color="primary" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption>Verificadores</q-item-label>
                      <q-item-label>
                        {{ verifierLabel(props.row.verifiers?.[0]?.verifier) }}
                        <span class="text-caption text-grey-7">
                          · Principal
                        </span>
                      </q-item-label>
                      <q-item-label v-if="props.row.verifiers?.[1]?.verifier">
                        {{ verifierLabel(props.row.verifiers[1].verifier) }}
                        <span class="text-caption text-grey-7">
                          · Auxiliar
                        </span>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </div>
              </q-card-section>

              <q-separator />

              <q-card-section class="verification-card__footer">
                <q-btn
                  v-bind="$theme.btn"
                  :to="`/verificaciones/${props.row.id}`"
                  icon="sym_o_fact_check"
                  color="primary"
                  text-color="secondary"
                  class="full-width verification-card__action"
                  label="Ver solicitud"
                >
                </q-btn>
              </q-card-section>
            </q-card>
          </div>
        </template>
      </q-table-component>
    </q-card>
  </q-page>
</template>

<script lang="ts" setup>
import QTableComponent from "src/components/QTableComponent.vue";
import { verificationStatusChip } from "src/types/IVerification";
import type { IUser } from "src/types/IUser";
import { computed, ref, watch } from "vue";

const verificationTableRef = ref<{ refresh: () => void } | null>(null);
const folio = ref<string | null>(null);
const estatus = ref<string | null>(null);
const tipo = ref<string | null>(null);
const cre = ref<string | null>(null);
const pagination = ref({
  page: 1,
  rowsPerPage: 12,
  sortBy: null,
  descending: false,
  rowsNumber: 0,
});

const tableRequestData = computed(() => {
  const filters = [];
  if (estatus.value) {
    filters.push({
      key: "estatus",
      operator: "=",
      value: estatus.value,
    });
  }

  if (folio.value) {
    filters.push({
      key: "folio",
      value: folio.value,
    });
  }

  if (tipo.value) {
    filters.push({
      key: "tipo",
      operator: "=",
      value: tipo.value,
    });
  }

  if (cre.value) {
    filters.push({
      key: "StationCre",
      value: cre.value,
    });
  }
  return { filters };
});

const columns = [
  {
    name: "folio",
    field: "folio",
    label: "Folio",
    align: "left",
    searchable: true,
    sortable: false,
  },
  {
    name: "tipo",
    field: "tipo",
    label: "Tipo",
    align: "left",
    searchable: false,
    sortable: false,
  },
  {
    name: "estatus",
    field: "estatus",
    label: "Estatus",
    align: "left",
    searchable: false,
    sortable: false,
  },
  {
    name: "fecha_solicitud",
    field: "fecha_solicitud",
    label: "Fecha de solicitud",
    align: "left",
    searchable: false,
    sortable: false,
  },
];

function verifierLabel(verifier?: IUser | null) {
  if (!verifier) return "No asignado";

  const internalNumber = verifier.verifier_data?.no_interno_formatted;
  return internalNumber
    ? `${internalNumber} - ${verifier.fullname}`
    : verifier.fullname;
}

watch(
  tableRequestData,
  () => {
    verificationTableRef.value?.refresh();
  },
  { flush: "post" },
);
</script>

<style scoped lang="scss">
.verification-card {
  height: 100%;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto 1fr auto auto;
  border: 1px solid rgba(15, 23, 42, 0.08);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.verification-card:hover {
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.12);
}

.verification-card__folio {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.verification-card__eyebrow {
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(15, 23, 42, 0.56);
}

.verification-card__title {
  line-height: 1.2;
  color: #132238;
}

.verification-card__station {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: rgba(15, 23, 42, 0.72);
  font-size: 0.92rem;
}

.verification-card__info-list {
  display: grid;
  gap: 10px;
}

.verification-card__footer {
  display: grid;
  gap: 14px;
  background: rgba(15, 23, 42, 0.02);
}

.verification-card__action {
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

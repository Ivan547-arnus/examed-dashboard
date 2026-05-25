<template>
  <q-page padding class="extended">
    <div class="full-width flex justify-end">
      <q-btn
        v-bind="$theme.btn"
        color="primary"
        text-color="secondary"
        icon="sym_o_local_gas_station"
        label="Crear estación"
      ></q-btn>
    </div>
    <q-table-component grid url="/stations">
      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
          <q-card v-bind="$theme.card" class="station-card">
            <q-card-section class="station-card__hero">
              <div class="row items-start no-wrap q-col-gutter-md">
                <div class="col">
                  <div class="row items-start justify-between q-col-gutter-sm">
                    <div class="col">
                      <div class="text-h6 station-card__title">
                        {{ getStationName(props.row.razon_social) }}
                      </div>
                    </div>
                  </div>
                  <div class="station-card__location">
                    <q-icon name="sym_o_location_on" size="18px" />
                    <span>{{ formatLocation(props.row) }}</span>
                  </div>
                </div>
                <div class="col-auto">
                  <q-btn
                    v-bind="$theme.btnIcon"
                    flat
                    icon="sym_o_more_vert"
                  ></q-btn>
                </div>
              </div>
            </q-card-section>

            <q-card-section class="q-pt-md">
              <div class="station-card__info-list">
                <div class="station-card__info-item">
                  <q-icon name="sym_o_assignment" size="20px" color="primary" />
                  <div>
                    <div class="station-card__label">Permiso CRE</div>
                    <div class="station-card__value">{{ formatCre(props.row.cre) }}</div>
                  </div>
                </div>

                <div class="station-card__info-item">
                  <q-icon name="sym_o_pin_drop" size="20px" color="primary" />
                  <div>
                    <div class="station-card__label">Dirección</div>
                    <div class="station-card__value">{{ formatAddress(props.row) }}</div>
                  </div>
                </div>
              </div>
            </q-card-section>

            <q-separator />

            <q-card-section class="station-card__footer">
              <div class="station-card__verification">
                <q-icon name="sym_o_fact_check" size="22px" color="primary" />
                <div>
                  <div class="station-card__label">Última verificación</div>
                  <div class="station-card__value">Sin registro disponible</div>
                  <div class="station-card__hint">
                    Crea una solicitud para comenzar el seguimiento de esta estación.
                  </div>
                </div>
              </div>

              <q-btn
                v-bind="$theme.btn"
                color="primary"
                text-color="secondary"
                class="full-width station-card__action"
              >
                Crear solicitud
              </q-btn>
            </q-card-section>
          </q-card>
        </div>
      </template>
    </q-table-component>
  </q-page>
</template>

<script setup lang="ts">
import QTableComponent from 'src/components/QTableComponent.vue';

type NullableText = null | string | number | undefined;

interface StationRow {
  razon_social?: NullableText;
  cre?: NullableText;
  calle?: NullableText;
  colonia?: NullableText;
  cp?: NullableText;
  municipality?: {
    nombre?: NullableText;
  } | null;
  state?: {
    nombre?: NullableText;
  } | null;
}


function normalizeText(value: NullableText) {
  if (value === null || value === undefined) return '';

  return String(value).trim();
}

function getStationName(name: NullableText) {
  return normalizeText(name) || 'Sin razón social';
}

function formatCre(cre: NullableText) {
  return normalizeText(cre) || 'Sin permiso registrado';
}


function formatLocation(row: StationRow) {
  const location = [row.municipality?.nombre, row.state?.nombre]
    .map(normalizeText)
    .filter(Boolean);

  return location.join(', ') || 'Ubicación no disponible';
}

function formatAddress(row: StationRow) {
  const address = [row.calle, row.colonia].map(normalizeText).filter(Boolean);

  if (row.cp) {
    address.push(`C.P. ${normalizeText(row.cp)}`);
  }

  return address.join(', ') || 'Dirección no disponible';
}
</script>

<style scoped lang="scss">
.station-card {
  height: 100%;
  overflow: hidden;
  border: 1px solid rgba(15, 23, 42, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.station-card:hover {
  transform: translateY(-2px);
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
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(15, 23, 42, 0.54);
}

.station-card__value {
  color: #132238;
  line-height: 1.4;
  word-break: break-word;
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
</style>

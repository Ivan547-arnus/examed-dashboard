<template>
  <q-form id="verification-config-form" @submit.prevent="onSubmit">
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card v-bind="$theme.card">
          <q-item class="bg-primary text-secondary">
            <q-item-section>
              <q-item-label class="text-h6">Verificadores</q-item-label>
              <q-item-label caption class="text-grey-3">
                Selecciona los verificadores asignados a esta solicitud.
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-card-section>
            <div class="row q-col-gutter-md">
              <q-fetch-select
                v-bind="$theme.input"
                v-model="verificationStore.verificacion.verifiers[0].verifier"
                class="col-12 col-md-6"
                url="/verifier/users/get-select"
                label="Verificador principal"
                :disable="disableEdit"
              >
                <template #option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section avatar>
                      <q-avatar
                        v-bind="$theme.avatar"
                        color="primary"
                        text-color="secondary"
                      >
                        {{ scope.opt.verifier_data.no_interno_formatted }}
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-h5">
                        {{ scope.opt.fullname }}
                      </q-item-label>
                      <q-item-label caption>
                        <QChipRemainingDays
                          :fecha-vencimiento="
                            scope.opt.verifier_data?.medida?.fecha_vencimiento
                          "
                          type="medida"
                        ></QChipRemainingDays>
                        <QChipRemainingDays
                          :fecha-vencimiento="
                            scope.opt.verifier_data?.termometro
                              ?.fecha_vencimiento
                          "
                          type="termometro"
                        ></QChipRemainingDays>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
                <template #selected-item="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section avatar>
                      <q-avatar
                        v-bind="$theme.avatar"
                        color="primary"
                        text-color="secondary"
                      >
                        {{ scope.opt.verifier_data.no_interno_formatted }}
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-h5">
                        {{ scope.opt.fullname }}
                      </q-item-label>
                      <q-item-label caption>
                        <QChipRemainingDays
                          :fecha-vencimiento="
                            scope.opt.verifier_data?.medida?.fecha_vencimiento
                          "
                          type="medida"
                        ></QChipRemainingDays>
                        <QChipRemainingDays
                          :fecha-vencimiento="
                            scope.opt.verifier_data?.termometro
                              ?.fecha_vencimiento
                          "
                          type="termometro"
                        ></QChipRemainingDays>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-fetch-select>
              <q-fetch-select
                v-bind="$theme.input"
                v-model="verificationStore.verificacion.verifiers[1].verifier"
                class="col-12 col-md-6"
                url="/verifier/users/get-select"
                option-label="fullname"
                label="Verificador auxiliar (opcional)"
                clearable
                clear-icon="sym_o_close"
                :disable="disableEdit"
              >
                <template #option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section avatar>
                      <q-avatar
                        v-bind="$theme.avatar"
                        color="primary"
                        text-color="secondary"
                      >
                        {{ scope.opt.verifier_data.no_interno_formatted }}
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-h5">
                        {{ scope.opt.fullname }}
                      </q-item-label>
                      <q-item-label caption>
                        <QChipRemainingDays
                          :fecha-vencimiento="
                            scope.opt.verifier_data?.medida?.fecha_vencimiento
                          "
                          type="medida"
                        ></QChipRemainingDays>
                        <QChipRemainingDays
                          :fecha-vencimiento="
                            scope.opt.verifier_data?.termometro
                              ?.fecha_vencimiento
                          "
                          type="termometro"
                        ></QChipRemainingDays>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
                <template #selected-item="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section avatar>
                      <q-avatar
                        v-bind="$theme.avatar"
                        color="primary"
                        text-color="secondary"
                      >
                        {{ scope.opt.verifier_data.no_interno_formatted }}
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-h5">
                        {{ scope.opt.fullname }}
                      </q-item-label>
                      <q-item-label caption>
                        <QChipRemainingDays
                          :fecha-vencimiento="
                            scope.opt.verifier_data?.medida?.fecha_vencimiento
                          "
                          type="medida"
                        ></QChipRemainingDays>
                        <QChipRemainingDays
                          :fecha-vencimiento="
                            scope.opt.verifier_data?.termometro
                              ?.fecha_vencimiento
                          "
                          type="termometro"
                        ></QChipRemainingDays>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-fetch-select>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card v-bind="$theme.card">
          <q-item class="bg-primary text-secondary">
            <q-item-section>
              <q-item-label class="text-h6">Datos de inspección</q-item-label>
            </q-item-section>
          </q-item>
          <q-card-section>
            <div class="row q-col-gutter-md">
              <q-select
                v-bind="$theme.input"
                v-model="verificationStore.verificacion.tipo"
                class="col-12 col-sm-6"
                label="Tipo"
                :options="typeOptions"
                :disable="disableEdit"
                emit-value
                map-options
              ></q-select>

              <q-input
                v-bind="$theme.input"
                v-model="verificationStore.verificacion.fecha_solicitud"
                class="col-12 col-sm-6"
                label="Fecha solicitud"
                :disable="disableEdit"
              >
                <template #append>
                  <q-icon name="sym_o_calendar_month">
                    <q-popup-proxy cover>
                      <q-date
                        v-model="verificationStore.verificacion.fecha_solicitud"
                        mask="DD/MM/YYYY"
                      ></q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>

              <q-input
                v-bind="$theme.input"
                v-model="verificationStore.verificacion.fecha_inicio_inspeccion"
                class="col-12 col-sm-6"
                label="Fecha inicio inspección"
                mask="##/##/####"
                :disable="disableEdit"
              >
                <template #append>
                  <q-icon name="sym_o_calendar_month">
                    <q-popup-proxy cover>
                      <q-date
                        v-model="
                          verificationStore.verificacion.fecha_inicio_inspeccion
                        "
                        mask="DD/MM/YYYY"
                      ></q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>

              <q-input
                v-bind="$theme.input"
                v-model="verificationStore.verificacion.hora_inicio_inspeccion"
                class="col-12 col-sm-6"
                label="Hora inicio inspección"
                mask="##:##"
                :disable="disableEdit"
              >
                <template #append>
                  <q-icon name="sym_o_schedule">
                    <q-popup-proxy cover>
                      <q-time
                        v-model="
                          verificationStore.verificacion.hora_inicio_inspeccion
                        "
                        mask="HH:mm"
                        format24h
                      ></q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>

              <q-input
                v-bind="$theme.input"
                v-model="
                  verificationStore.verificacion.fecha_termino_inspeccion
                "
                mask="##/##/####"
                class="col-12 col-sm-6"
                label="Fecha término inspección"
                :disable="disableEdit"
              >
                <template #append>
                  <q-icon name="sym_o_calendar_month">
                    <q-popup-proxy cover>
                      <q-date
                        v-model="
                          verificationStore.verificacion
                            .fecha_termino_inspeccion
                        "
                        mask="DD/MM/YYYY"
                      ></q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>

              <q-input
                v-bind="$theme.input"
                v-model="verificationStore.verificacion.hora_termino_inspeccion"
                class="col-12 col-sm-6"
                label="Hora término inspección"
                mask="##:##"
                :disable="disableEdit"
              >
                <template #append>
                  <q-icon name="sym_o_schedule">
                    <q-popup-proxy cover>
                      <q-time
                        v-model="
                          verificationStore.verificacion.hora_termino_inspeccion
                        "
                        mask="HH:mm"
                        format24h
                      ></q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card v-bind="$theme.card">
          <q-item class="bg-primary text-secondary">
            <q-item-section>
              <q-item-label class="text-h6">Datos del solicitante</q-item-label>
            </q-item-section>
          </q-item>
          <q-card-section>
            <div class="row q-col-gutter-md">
              <q-input
                v-bind="$theme.input"
                v-model="verificationStore.verificacion.nombre_solicitante"
                class="col-12"
                label="Nombre"
                :disable="disableEdit"
              ></q-input>
              <q-input
                v-bind="$theme.input"
                v-model="
                  verificationStore.verificacion.primer_apellido_solicitante
                "
                class="col-12 col-sm-6"
                label="Primer apellido"
                :disable="disableEdit"
              ></q-input>
              <q-input
                v-bind="$theme.input"
                v-model="
                  verificationStore.verificacion.segundo_apellido_solicitante
                "
                class="col-12 col-sm-6"
                label="Segundo apellido (opcional)"
                :disable="disableEdit"
              ></q-input>
              <q-input
                v-bind="$theme.input"
                v-model="verificationStore.verificacion.telefono_solicitante"
                class="col-12 col-sm-6"
                label="Teléfono (opcional)"
                mask="(###) ###-####"
                unmasked-value
                :disable="disableEdit"
              ></q-input>
              <q-input
                v-bind="$theme.input"
                v-model="verificationStore.verificacion.correo_solicitante"
                class="col-12 col-sm-6"
                label="Correo (opcional)"
                :rules="[$rules.email('Formato de correo invalido')]"
                :disable="disableEdit"
              ></q-input>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12">
        <q-card v-bind="$theme.card">
          <q-item class="bg-primary text-secondary">
            <q-item-section>
              <q-item-label class="text-h6">Importes</q-item-label>
            </q-item-section>
          </q-item>
          <q-card-section>
            <div class="row q-col-gutter-md">
              <q-input
                v-bind="$theme.input"
                v-model="verificationStore.verificacion.precio_x_manguera"
                class="col-12 col-sm-4"
                label="Precio por manguera"
                type="number"
                step="0.01"
                min="0"
                :disable="disableEdit"
              ></q-input>
              <q-input
                v-bind="$theme.input"
                v-model="verificationStore.verificacion.iva_x_manguera"
                class="col-12 col-sm-4"
                label="IVA por manguera"
                type="number"
                step="0.01"
                min="0"
                :disable="disableEdit"
              ></q-input>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12">
        <div v-if="stationDispensers.length" class="row q-col-gutter-md">
          <div
            v-for="dispenser in stationDispensers"
            :key="dispenser?.id"
            class="col-12 col-sm-6 col-md-3"
          >
            <q-card v-bind="$theme.card" class="full-height">
              <q-item
                :class="
                  isDispenserActive(dispenser?.id) ? 'bg-primary' : 'bg-grey-3'
                "
              >
                <q-item-section avatar>
                  <q-avatar
                    v-bind="$theme.avatar"
                    :color="
                      isDispenserActive(dispenser?.id) ? 'secondary' : 'primary'
                    "
                    :text-color="
                      isDispenserActive(dispenser?.id) ? 'primary' : 'secondary'
                    "
                    icon="sym_o_local_gas_station"
                  ></q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label
                    class="text-h6"
                    :class="
                      isDispenserActive(dispenser?.id)
                        ? 'text-secondary'
                        : 'text-primary'
                    "
                  >
                    {{ dispenser?.marca }}
                  </q-item-label>
                  <q-item-label
                    caption
                    :class="
                      isDispenserActive(dispenser?.id)
                        ? 'text-grey-3'
                        : 'text-grey-8'
                    "
                  >
                    {{ dispenser?.modelo }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side v-if="!disableEdit">
                  <q-toggle
                    :model-value="isDispenserActive(dispenser?.id)"
                    color="secondary"
                    @update:model-value="
                      (value) => toggleDispenser(dispenser, value)
                    "
                  ></q-toggle>
                </q-item-section>
              </q-item>

              <q-card-section>
                <q-list bordered separator class="border-md-radius">
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="sym_o_tag" color="primary"></q-icon>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption>No. serie</q-item-label>
                      <q-item-label>{{ dispenser?.no_serie }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="sym_o_approval" color="primary"></q-icon>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption>No. aprobación</q-item-label>
                      <q-item-label>{{ dispenser?.no_aprobacion }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section avatar>
                      <q-icon
                        name="sym_o_calendar_month"
                        color="primary"
                      ></q-icon>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption>Año aprobación</q-item-label>
                      <q-item-label>{{
                        dispenser?.ano_aprobacion
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="sym_o_valve" color="primary"></q-icon>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption>No. instrumentos</q-item-label>
                      <q-item-label>{{ dispenser?.hoses_count }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <div v-else class="column items-center text-center q-py-xl">
          <q-avatar
            v-bind="$theme.avatar"
            color="grey-3"
            text-color="primary"
            size="72px"
            icon="sym_o_info"
          ></q-avatar>
          <div class="text-h6 q-mt-md">No hay dispensarios registrados</div>
          <div class="text-caption text-grey-7 q-mt-sm">
            La estación no tiene dispensarios disponibles para seleccionar.
          </div>
        </div>
      </div>

      <div class="col-12 flex justify-end" v-if="!disableEdit">
        <q-btn
          v-bind="$theme.btn"
          type="submit"
          form="verification-config-form"
          color="primary"
          text-color="secondary"
          icon="sym_o_save"
          label="Guardar configuración"
        ></q-btn>
      </div>
    </div>
  </q-form>
</template>

<script lang="ts" setup>
import QChipRemainingDays from "src/components/QChipRemainingDaysComponent.vue";
import QFetchSelect from "src/components/QFetchSelect.vue";
import { alert, question } from "src/config/dialog";
import { useVerificacion } from "src/stores/verificacion-store";
import type { IDispenser } from "src/types/IStation";
import {
  StationVerificationDispenser,
  type IStationVerificationDispenser,
} from "src/types/IVerification";
import { computed } from "vue";

type VerificationType = "Inicial" | "Periodica" | "Extraodinaria";

const verificationStore = useVerificacion();
const disableEdit = computed(() => verificationStore.verificacion.estatus !== 'Borrador');
const typeOptions: { label: string; value: VerificationType }[] = [
  { label: "Inicial", value: "Inicial" },
  { label: "Periódica", value: "Periodica" },
  { label: "Extraordinaria", value: "Extraodinaria" },
];

const stationDispensers = computed(() => {
  if(disableEdit.value) return verificationStore.verificacion?.dispensers.map(el => el.dispenser)
  return verificationStore.verificacion.station?.dispensers ?? [];
});

function getVerificationDispenser(dispenserId?: number | null) {
  if (!dispenserId) return null;
  return (
    verificationStore.verificacion.dispensers.find(
      (dispenser) => dispenser.id_station_dispenser === dispenserId,
    ) ?? null
  );
}

function isDispenserActive(dispenserId?: number | null) {
  return Boolean(getVerificationDispenser(dispenserId));
}

function toggleDispenser(dispenser: IDispenser | null, value: boolean) {
  if (!dispenser || !dispenser.id) return;

  if (value && !isDispenserActive(dispenser.id)) {
    verificationStore.verificacion.dispensers.push(
      new StationVerificationDispenser({
        id_station_verification: verificationStore.verificacion.id,
        id_station_dispenser: dispenser.id,
        dispenser: dispenser,
      }),
    );
    return;
  }

  if (!value) {
    verificationStore.verificacion.dispensers =
      verificationStore.verificacion.dispensers.filter(
        (verificationDispenser: IStationVerificationDispenser) =>
          verificationDispenser.id_station_dispenser !== dispenser.id,
      );
  }
}

async function onSubmit() {
  const answer = await question(
    "Guardar solicitud",
    "¿Seguro que deseas crear una solicitud de verificación para la estación seleccionada?",
    {
      type: "info",
    },
  );

  if(!answer) return;
  const { error, message, data } = await verificationStore.update();
  await alert(error ? "Error" : "Operación existosa", message, {
    type: error ? "negative" : "positive"
  })
  if (!error && data && data.id) {
    void verificationStore.get(data.id)
  }
}
</script>

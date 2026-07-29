<template>
  <div>
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-lg-9 col-md-8">
        <q-card v-bind="$theme.card">
          <q-item class="bg-primary text-secondary">
            <q-item-section>
              <q-item-label class="text-h6 text-weight-bold">
                Dispensarios a revisar
              </q-item-label>
              <q-item-label class="text-grey-3">
                Información general de los dispensarios a revisar
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-chip
                color="green-3"
                text-color="green-9"
                icon="sym_o_local_gas_station"
                :label="`${selectedDispensers.length} seleccionados`"
              ></q-chip>
            </q-item-section>
          </q-item>

          <q-separator></q-separator>

          <q-list v-if="selectedDispensers.length" separator>
            <q-item
              v-for="(verificationDispenser, index) in selectedDispensers"
              :key="
                verificationDispenser.id ??
                verificationDispenser.id_station_dispenser ??
                index
              "
              class="q-py-md"
            >
              <q-item-section avatar>
                <q-avatar
                  v-bind="$theme.avatar"
                  rounded
                  color="grey-3"
                  text-color="primary"
                  icon="sym_o_local_gas_station"
                ></q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label caption class="text-grey-7">
                  Dispensario {{ index + 1 }}
                </q-item-label>
                <q-item-label class="text-weight-bold">
                  {{ dispenserName(verificationDispenser) }}
                </q-item-label>
                <q-item-label caption>
                  No. serie:
                  {{
                    verificationDispenser.dispenser?.no_serie || "Sin no. serie"
                  }}
                </q-item-label>
              </q-item-section>

              <q-item-section side class="items-end">
                <div class="text-weight-bold">
                  {{ verificationDispenser.dispenser?.hoses_count ?? 0 }}
                  instrumentos
                </div>
                <div class="text-caption text-grey-7">
                  {{
                    $filters.currency(dispenserSubtotal(verificationDispenser))
                  }}
                </div>
              </q-item-section>
            </q-item>
          </q-list>

          <q-card-section v-else>
            <div class="column items-center text-center q-py-xl">
              <q-avatar
                v-bind="$theme.avatar"
                color="grey-3"
                text-color="primary"
                size="72px"
                icon="sym_o_info"
              ></q-avatar>
              <div class="text-h6 q-mt-md">
                No hay dispensarios seleccionados
              </div>
              <div class="text-caption text-grey-7 q-mt-sm">
                Selecciona al menos un dispensario en la configuración de
                solicitud.
              </div>
            </div>
          </q-card-section>
          <q-separator></q-separator>
          <q-card-section class="bg-grey-1">
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label class="text-grey-7">
                    Número de instrumentos
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label class="text-weight-bold">
                    {{ verificationStore.hosesCount }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label class="text-grey-7">
                    Costo por instrumento
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label class="text-weight-bold">
                    {{ $filters.currency(verification.precio_x_manguera ?? 0) }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label class="text-grey-7">
                    IVA por instrumento
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label class="text-weight-bold">
                    {{ $filters.currency(verification.iva_x_manguera ?? 0) }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-separator></q-separator>

              <q-item>
                <q-item-section>
                  <q-item-label class="text-h4">Total</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label class="text-h4 text-weight-bold text-primary">
                    {{ $filters.currency(verificationStore.total) }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-lg-3 col-md-4">
        <q-btn
          v-bind="$theme.btn"
          icon="sym_o_download"
          class="full-width q-mb-md"
          color="grey-3"
          text-color="primary"
          @click="verificationStore.generateServiceRequestPDF()"
          label="Descargar solicitud"
        >
        </q-btn>
        <q-btn
          v-bind="$theme.btn"
          @click="onConfirm"
          icon="sym_o_check_circle"
          class="full-width q-mb-md"
          color="positive"
          label="Confirmar"
        >
        </q-btn>
        <q-card v-bind="$theme.card">
          <q-item class="bg-grey-3 text-primary">
            <q-item-section>
              <q-item-label class="text-h6 text-weight-bold">
                Verificadores
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-card-section>
            <q-list>
              <q-item class="q-px-none">
                <q-item-section avatar>
                  <q-avatar
                    v-bind="$theme.avatar"
                    :class="fieldStatusClass(principalVerifier)"
                  >
                    <q-icon name="sym_o_engineering" color="white"></q-icon>
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ verifierLabel(principalVerifier) }}</q-item-label>
                  <q-item-label caption>Principal</q-item-label>
                </q-item-section>
              </q-item>
              <q-item class="q-px-none">
                <q-item-section avatar>
                  <q-avatar
                    v-bind="$theme.avatar"
                    :class="fieldStatusClass(auxiliaryVerifier, false)"
                  >
                    <q-icon name="sym_o_engineering" color="white"></q-icon>
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ verifierLabel(auxiliaryVerifier) }}</q-item-label>
                  <q-item-label caption>Auxiliar</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>

        <q-card v-bind="$theme.card" class="q-mt-md">
          <q-item class="bg-grey-3 text-primary">
            <q-item-section>
              <q-item-label class="text-h6 text-weight-bold">
                Datos del solicitante
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-card-section class="q-pt-none">
            <q-list>
              <q-item class="q-px-none">
                <q-item-section avatar>
                  <q-avatar
                    v-bind="$theme.avatar"
                    :class="fieldStatusClass(verification.nombre_solicitante)"
                  >
                    <q-icon name="sym_o_person" color="white"></q-icon>
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ applicantFullname }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item class="q-px-none">
                <q-item-section avatar>
                  <q-avatar
                    v-bind="$theme.avatar"
                    :class="fieldStatusClass(verification.correo_solicitante, false)"
                  >
                    <q-icon name="sym_o_mail" color="white"></q-icon>
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{
                    verification.correo_solicitante || "Sin correo"
                  }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item class="q-px-none">
                <q-item-section avatar>
                  <q-avatar
                    v-bind="$theme.avatar"
                    :class="fieldStatusClass(verification.telefono_solicitante, false)"
                  >
                    <q-icon name="sym_o_call" color="white"></q-icon>
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{
                    verification.telefono_solicitante || "Sin teléfono"
                  }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>

        <q-card v-bind="$theme.card" class="q-mt-md">
          <q-item class="bg-grey-3 text-primary">
            <q-item-section>
              <q-item-label class="text-h6 text-weight-bold">
                Datos de inspección
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-card-section class="q-pt-none">
            <q-list>
              <q-item class="q-px-none">
                <q-item-section avatar>
                  <q-avatar
                    v-bind="$theme.avatar"
                    :class="fieldStatusClass(verification.tipo)"
                  >
                    <q-icon name="sym_o_fact_check" color="white"></q-icon>
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ verificationTypeLabel }}</q-item-label>
                  <q-item-label caption>Tipo de verificación</q-item-label>
                </q-item-section>
              </q-item>

              <q-item class="q-px-none">
                <q-item-section avatar>
                  <q-avatar
                    v-bind="$theme.avatar"
                    :class="fieldStatusClass(verification.fecha_solicitud)"
                  >
                    <q-icon name="sym_o_calendar_month" color="white"></q-icon>
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{
                    verification.fecha_solicitud || "Sin fecha"
                  }}</q-item-label>
                  <q-item-label caption>Fecha de solicitud</q-item-label>
                </q-item-section>
              </q-item>

              <q-item class="q-px-none">
                <q-item-section avatar>
                  <q-avatar
                    v-bind="$theme.avatar"
                    :class="
                      fieldStatusClass(
                        verification.fecha_inicio_inspeccion &&
                          verification.hora_inicio_inspeccion,
                      )
                    "
                  >
                    <q-icon name="sym_o_play_circle" color="white"></q-icon>
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ inspectionStart }}</q-item-label>
                  <q-item-label caption>Inicio</q-item-label>
                </q-item-section>
              </q-item>

              <q-item class="q-px-none">
                <q-item-section avatar>
                  <q-avatar
                    v-bind="$theme.avatar"
                    :class="
                      fieldStatusClass(
                        verification.fecha_termino_inspeccion &&
                          verification.hora_termino_inspeccion,
                      )
                    "
                  >
                    <q-icon name="sym_o_stop_circle" color="white"></q-icon>
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ inspectionEnd }}</q-item-label>
                  <q-item-label caption>Término</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useVerificacion } from "src/stores/verificacion-store";
import type { IStationVerificationDispenser } from "src/types/IVerification";
import type { IUser } from "src/types/IUser";
import { computed } from "vue";
import { alert, question } from "src/config/dialog";
const verificationStore = useVerificacion();

const verification = computed(() => verificationStore.verificacion);
const selectedDispensers = computed(() => verification.value.dispensers ?? []);
const principalVerifier = computed(
  () => verification.value.verifiers[0]?.verifier ?? null,
);
const auxiliaryVerifier = computed(
  () => verification.value.verifiers[1]?.verifier ?? null,
);


const applicantFullname = computed(() => {
  const fullname = [
    verification.value.nombre_solicitante,
    verification.value.primer_apellido_solicitante,
    verification.value.segundo_apellido_solicitante,
  ]
    .filter(Boolean)
    .join(" ");

  return fullname || "Sin nombre";
});

const verificationTypeLabel = computed(() => {
  if (verification.value.tipo === "Periodica") return "Periódica";
  if (verification.value.tipo === "Extraodinaria") return "Extraordinaria";
  return verification.value.tipo || "Sin tipo";
});

const inspectionStart = computed(() => {
  return formatDateTime(
    verification.value.fecha_inicio_inspeccion,
    verification.value.hora_inicio_inspeccion,
  );
});

const inspectionEnd = computed(() => {
  return formatDateTime(
    verification.value.fecha_termino_inspeccion,
    verification.value.hora_termino_inspeccion,
  );
});

function fieldStatusClass(value: unknown, required = true) {
  const isEmpty =
    value === null ||
    value === undefined ||
    (typeof value === "string" && value.trim() === "");

  if (!isEmpty) return "bg-positive";
  return required ? "bg-negative" : "bg-positive";
}

function verifierLabel(verifier: IUser | null) {
  if (!verifier) return "No asignado";

  const internalNumber = verifier.verifier_data?.no_interno_formatted;
  return internalNumber
    ? `${internalNumber} - ${verifier.fullname}`
    : verifier.fullname;
}

function dispenserName(verificationDispenser: IStationVerificationDispenser) {
  const dispenser = verificationDispenser.dispenser;
  if (!dispenser) return "Dispensario sin información";

  return (
    [dispenser.marca, dispenser.modelo].filter(Boolean).join(" ") ||
    "Dispensario"
  );
}

function dispenserSubtotal(
  verificationDispenser: IStationVerificationDispenser,
) {
  const hosesCount = verificationDispenser.dispenser?.hoses_count ?? 0;
  const price = Number(verification.value.precio_x_manguera ?? 0);
  const iva = Number(verification.value.iva_x_manguera ?? 0);

  return ((price + iva) * hosesCount).toFixed(2);
}

function formatDateTime(date: string | null, time: string | null) {
  if (date && time) return `${date} ${time}`;
  if (date) return date;
  if (time) return time;
  return "Sin fecha/hora";
}

async function onConfirm() {
  const answer = await question("Confirmar verificación", '<span class="text-weight-bold">¿Seguro que deseas continuar?</span><br> La verificación ya no podra editarse y sera asignada a los verificadores seleccionados', {
    type: "info"
  })
  if (!answer) return;
  const { error, message, data } = await verificationStore.approve();
  await alert(error ? "Error" : "Operación exitosa", message, {
    type: error ? 'negative' : 'positive'
  });
  if (!error && data && data.id) {
    void verificationStore.get(data.id)
    verificationStore.tab = 'config'
  }
}
</script>

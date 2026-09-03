<template>
  <div class="row q-col-gutter-lg">
    <div class="col-12 col-lg-9 col-md-8">
      <q-card v-bind="$theme.card">
        <q-item class="bg-primary text-secondary">
          <q-item-section avatar>
            <q-avatar v-bind="$theme.avatar" color="secondary" text-color="primary" icon="sym_o_local_gas_station"></q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-h6 text-weight-bold">
              {{ verification.station?.razon_social || "Sin estación" }}
            </q-item-label>
            <q-item-label class="text-grey-3">
              Folio {{ verification.folio || "Sin folio" }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-chip v-bind="verificationStatusChip(verification.estatus)" dense square></q-chip>
          </q-item-section>
        </q-item>

        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <div class="text-caption text-grey-7">Razón social</div>
              <div class="text-weight-bold">
                {{ verification.station?.razon_social || "Sin información" }}
              </div>
            </div>
            <div class="col-12 col-sm-6">
              <div class="text-caption text-grey-7">RFC</div>
              <div class="text-weight-bold">
                {{ verification.station?.rfc || "Sin información" }}
              </div>
            </div>
            <div class="col-12 col-sm-6">
              <div class="text-caption text-grey-7">CRE</div>
              <div class="text-weight-bold">
                {{ verification.station?.cre || "Sin información" }}
              </div>
            </div>
            <div class="col-12 col-sm-6">
              <div class="text-caption text-grey-7">Dirección</div>
              <div class="text-weight-bold">
                {{ stationAddress }}
              </div>
            </div>
            <div class="col-12 col-sm-6">
              <div class="text-caption text-grey-7">Correo</div>
              <div class="text-weight-bold">
                {{ verification.station?.correo || "Sin información" }}
              </div>
            </div>
            <div class="col-12 col-sm-6">
              <div class="text-caption text-grey-7">Teléfono</div>
              <div class="text-weight-bold">
                {{ verification.station?.telefono || "Sin información" }}
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card v-bind="$theme.card" class="q-mt-md">
        <q-item class="bg-grey-3 text-primary">
          <q-item-section>
            <q-item-label class="text-h6 text-weight-bold">
              Datos de la inspección
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6 col-md-4">
              <div class="text-caption text-grey-7">Tipo de verificación</div>
              <div class="text-weight-bold">{{ verificationTypeLabel }}</div>
            </div>
            <div class="col-12 col-sm-6 col-md-4">
              <div class="text-caption text-grey-7">Fecha de solicitud</div>
              <div class="text-weight-bold">
                {{ verification.fecha_solicitud || "Sin fecha" }}
              </div>
            </div>
            <div class="col-12 col-sm-6 col-md-4">
              <div class="text-caption text-grey-7">Consecutivo</div>
              <div class="text-weight-bold">
                {{ verification.consecutivo ?? "Sin información" }}
              </div>
            </div>
            <div class="col-12 col-sm-6 col-md-4">
              <div class="text-caption text-grey-7">Inicio de inspección</div>
              <div class="text-weight-bold">{{ inspectionStart }}</div>
            </div>
            <div class="col-12 col-sm-6 col-md-4">
              <div class="text-caption text-grey-7">Término de inspección</div>
              <div class="text-weight-bold">{{ inspectionEnd }}</div>
            </div>
            <div class="col-12 col-sm-6 col-md-4">
              <div class="text-caption text-grey-7">Hora término sugerida</div>
              <div class="text-weight-bold">
                {{ verification.hora_termino_sugerida || "Sin información" }}
              </div>
            </div>
          </div>
          <template v-if="verification.observaciones">
            <q-separator class="q-my-md"></q-separator>
            <div class="text-caption text-grey-7">Observaciones</div>
            <div class="text-weight-bold">{{ verification.observaciones }}</div>
          </template>
        </q-card-section>
      </q-card>

      <q-card v-bind="$theme.card" class="q-mt-md">
        <q-item class="bg-grey-3 text-primary">
          <q-item-section>
            <q-item-label class="text-h6 text-weight-bold">
              Dispensarios verificados
            </q-item-label>
            <q-item-label caption>
              Detalle por dispensario de los puntos de verificación
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-chip
              color="green-3"
              text-color="green-9"
              icon="sym_o_local_gas_station"
              :label="`${dispensers.length} dispensarios`"
            ></q-chip>
          </q-item-section>
        </q-item>

        <q-list v-if="dispensers.length" separator>
          <q-expansion-item
            v-for="(verificationDispenser, index) in dispensers"
            :key="verificationDispenser.id ?? verificationDispenser.id_station_dispenser ?? index"
            header-class="text-primary text-weight-bold"
            expand-icon-class="text-primary"
          >
            <template #header>
              <q-item-section avatar>
                <q-avatar v-bind="$theme.avatar" rounded color="grey-3" text-color="primary" icon="sym_o_local_gas_station"></q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label caption class="text-grey-7">
                  Dispensario {{ index + 1 }}
                </q-item-label>
                <q-item-label class="text-weight-bold">
                  {{ dispenserName(verificationDispenser) }}
                </q-item-label>
                <q-item-label caption>
                  No. serie: {{ verificationDispenser.dispenser?.no_serie || "Sin no. serie" }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <div class="text-weight-bold">
                  {{ verificationDispenser.dispenser?.hoses_count ?? 0 }} instrumentos
                </div>
              </q-item-section>
            </template>

            <q-card-section class="bg-grey-1">
              <div class="row q-col-gutter-md q-mb-md">
                <div class="col-6 col-md-3">
                  <div class="text-caption text-grey-7">No. aprobación</div>
                  <div class="text-weight-bold">
                    {{ verificationDispenser.dispenser?.no_aprobacion || "Sin información" }}
                  </div>
                </div>
                <div class="col-6 col-md-3">
                  <div class="text-caption text-grey-7">Año aprobación</div>
                  <div class="text-weight-bold">
                    {{ verificationDispenser.dispenser?.ano_aprobacion || "Sin información" }}
                  </div>
                </div>
                <q-space></q-space>
                <div class="col-12 col-md-3">
                  <q-fetch-select
                    v-bind="$theme.input"
                    label="Norma"
                    url="/utils/policies"
                    option-label="nombre"
                    v-model="verificationDispenser.policy"
                    @update:model-value="(item) => handleUpdatePolicyData(verificationDispenser, 'id_policy', item.id)"
                  ></q-fetch-select>
                </div>
                <div
                  class="col-6 col-md-3"
                  v-for="field in visibleDispenserLitrosFields(verificationDispenser)"
                  :key="field.key"
                >
                  <q-input
                    v-model="verificationDispenser[field.key]"
                    @change="setDispenserNumberField(verificationDispenser, field.key, verificationDispenser[field.key])"
                    v-bind="$theme.input"
                    :label="field.label"
                    type="number"
                    suffix="L"
                  ></q-input>
                </div>
              </div>

              <q-separator class="q-mb-md"></q-separator>

              <div class="text-caption text-grey-7 q-mb-sm">
                Puntos de verificación
              </div>
              <div class="row q-col-gutter-sm q-mb-md">
                <div
                  class="col-6 col-md-4"
                  v-for="field in visibleDispenserFields(verificationDispenser)"
                  :key="field.key"
                >
                  <q-item class="border-md-radius fit" tag="label">
                    <q-item-section side>
                      <q-toggle
                        :model-value="isDispenserFieldCompliant(verificationDispenser[field.key])"
                        @update:model-value="(value) => setDispenserField(verificationDispenser, field.key, value)"
                        color="positive"
                        checked-icon="sym_o_check"
                        unchecked-icon="sym_o_close"
                      ></q-toggle>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ field.label }}</q-item-label>
                      <q-item-label caption v-if="field.caption">{{ field.caption }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </div>
              </div>

              <template v-if="verificationDispenser.dispenser?.hoses?.length">
                <q-separator class="q-mb-md"></q-separator>
                <div class="text-caption text-grey-7 q-mb-sm">Mangueras</div>
                <div class="row q-col-gutter-sm">
                  <div
                    class="col-6 col-sm-4 col-md-3"
                    v-for="hose in verificationDispenser.dispenser.hoses"
                    :key="hose.id"
                  >
                    <q-chip
                      square
                      color="grey-3"
                      text-color="primary"
                      icon="sym_o_valve"
                      :label="`${hose.manguera} - ${hose.fuel_type?.nombre || 'Sin producto'}`"
                    ></q-chip>
                  </div>
                </div>
              </template>
            </q-card-section>
          </q-expansion-item>
        </q-list>

        <q-card-section v-else>
          <div class="column items-center text-center q-py-xl">
            <q-avatar v-bind="$theme.avatar" color="grey-3" text-color="primary" size="72px" icon="sym_o_info"></q-avatar>
            <div class="text-h6 q-mt-md">No hay dispensarios verificados</div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div class="col-12 col-lg-3 col-md-4">
      <q-card v-bind="$theme.card">
        <q-item class="bg-primary text-secondary">
          <q-item-section>
            <q-item-label class="text-h6 text-weight-bold">
              Documentación
            </q-item-label>
            <q-item-label class="text-grey-3">
              Descarga los documentos generados de esta verificación
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-card-section>
          <q-btn
            v-bind="$theme.btn"
            icon="sym_o_download"
            class="full-width"
            color="grey-3"
            text-color="primary"
            @click="verificationStore.generateServiceRequestPDF()"
            label="Descargar solicitud"
          ></q-btn>
          <q-btn
            v-bind="$theme.btn"
            icon="sym_o_download"
            class="full-width q-mt-sm"
            color="grey-3"
            text-color="primary"
            @click="verificationStore.generateDictamenPDF()"
            label="Descargar dictamen"
          ></q-btn>
        </q-card-section>
      </q-card>

      <q-card v-bind="$theme.card" class="q-mt-md">
        <q-item class="bg-grey-3 text-primary">
          <q-item-section>
            <q-item-label class="text-h6 text-weight-bold">
              Verificadores
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn
              v-bind="$theme.btnIcon"
              icon="sym_o_sync"
              color="positive"
              @click="handleVerifierSnapshot"
            ></q-btn>
          </q-item-section>
        </q-item>
        <q-card-section>
          <q-list>
            <q-item class="q-px-none">
              <q-item-section avatar>
                <q-avatar v-bind="$theme.avatar" :class="fieldStatusClass(principalVerifier)">
                  <q-icon name="sym_o_engineering" color="white"></q-icon>
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ verifierLabel(principalVerifier) }}</q-item-label>
                <q-item-label caption>Principal</q-item-label>
              </q-item-section>
            </q-item>
            <template v-if="principalVerifier">
              <q-item
                dense
                class="q-px-none verifier-technical-item"
                v-for="technicalValue in technicalValues(principalVerifierData)"
                :key="technicalValue.label"
              >
                <q-item-section>
                  <q-item-label caption>{{ technicalValue.label }}</q-item-label>
                </q-item-section>
                <q-item-section side class="verifier-technical-item__value">
                  <q-item-label class="text-weight-bold">
                    {{ technicalValue.value }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-separator></q-separator>
              <q-expansion-item
                v-if="verifierMaterials(principalVerifierData).length"
                label="Equipo utilizado"
                icon="sym_o_construction"
                header-class="text-primary text-weight-bold border-md-radius"
                expand-icon-class="text-primary"
                class="q-mt-sm"
              >
                <div
                  v-for="material in verifierMaterials(principalVerifierData)"
                  :key="material.label"
                  class="q-px-md"
                >
                  <div class="text-caption text-grey-7 q-mb-sm">{{ material.label }}</div>
                  <div class="text-weight-bold">
                    {{ material.data.nombre || "Sin información" }}
                  </div>
                  <div class="text-caption" v-if="material.data.marca || material.data.modelo">
                    {{ [material.data.marca, material.data.modelo].filter(Boolean).join(" ") }}
                  </div>
                  <div class="text-caption" v-if="material.data.no_serie">
                    No. serie: {{ material.data.no_serie }}
                  </div>
                  <div class="text-caption" v-if="material.data.informe">
                    Informe: {{ material.data.informe }}
                  </div>
                  <div class="text-caption" v-if="material.data.fecha_calibracion || material.data.fecha_vencimiento">
                    Calibración: {{ material.data.fecha_calibracion ? $filters.date(material.data.fecha_calibracion) : "Sin dato" }} · Vence: {{ material.data.fecha_vencimiento ? $filters.date(material.data.fecha_vencimiento) : "Sin dato" }}
                  </div>
                  <q-separator class="q-mt-sm"></q-separator>
                </div>
              </q-expansion-item>
            </template>
            <q-item class="q-px-none">
              <q-item-section avatar>
                <q-avatar v-bind="$theme.avatar" :class="fieldStatusClass(auxiliaryVerifier, false)">
                  <q-icon name="sym_o_engineering" color="white"></q-icon>
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ verifierLabel(auxiliaryVerifier) }}</q-item-label>
                <q-item-label caption>Auxiliar</q-item-label>
              </q-item-section>
            </q-item>
            <template v-if="auxiliaryVerifier">
              <q-item
                dense
                class="q-px-none verifier-technical-item"
                v-for="technicalValue in technicalValues(auxiliaryVerifierData)"
                :key="technicalValue.label"
              >
                <q-item-section>
                  <q-item-label caption>{{ technicalValue.label }}</q-item-label>
                </q-item-section>
                <q-item-section side class="verifier-technical-item__value">
                  <q-item-label class="text-weight-bold">
                    {{ technicalValue.value }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-separator></q-separator>
              <q-expansion-item
                v-if="verifierMaterials(auxiliaryVerifierData).length"
                label="Equipo utilizado"
                icon="sym_o_construction"
                header-class="text-primary text-weight-bold border-md-radius"
                expand-icon-class="text-primary"
                class="q-mt-sm"
              >
                <div
                  v-for="material in verifierMaterials(auxiliaryVerifierData)"
                  :key="material.label"
                  class="q-px-md"
                >
                  <div class="text-caption text-grey-7 q-mb-sm">{{ material.label }}</div>
                  <div class="text-weight-bold">
                    {{ material.data.nombre || "Sin información" }}
                  </div>
                  <div class="text-caption" v-if="material.data.marca || material.data.modelo">
                    {{ [material.data.marca, material.data.modelo].filter(Boolean).join(" ") }}
                  </div>
                  <div class="text-caption" v-if="material.data.no_serie">
                    No. serie: {{ material.data.no_serie }}
                  </div>
                  <div class="text-caption" v-if="material.data.informe">
                    Informe: {{ material.data.informe }}
                  </div>
                  <div class="text-caption" v-if="material.data.fecha_calibracion || material.data.fecha_vencimiento">
                    Calibración: {{ material.data.fecha_calibracion ? $filters.date(material.data.fecha_calibracion) : "Sin dato" }} · Vence: {{ material.data.fecha_vencimiento ? $filters.date(material.data.fecha_vencimiento) : "Sin dato" }}
                  </div>
                  <q-separator class="q-mt-sm"></q-separator>
                </div>
              </q-expansion-item>
            </template>
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
                <q-avatar v-bind="$theme.avatar" :class="fieldStatusClass(verification.nombre_solicitante)">
                  <q-icon name="sym_o_person" color="white"></q-icon>
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ applicantFullname }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item class="q-px-none">
              <q-item-section avatar>
                <q-avatar v-bind="$theme.avatar" :class="fieldStatusClass(verification.correo_solicitante, false)">
                  <q-icon name="sym_o_mail" color="white"></q-icon>
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ verification.correo_solicitante || "Sin correo" }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item class="q-px-none">
              <q-item-section avatar>
                <q-avatar v-bind="$theme.avatar" :class="fieldStatusClass(verification.telefono_solicitante, false)">
                  <q-icon name="sym_o_call" color="white"></q-icon>
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ verification.telefono_solicitante || "Sin teléfono" }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>

      <q-card v-bind="$theme.card" class="q-mt-md">
        <q-item class="bg-grey-3 text-primary">
          <q-item-section>
            <q-item-label class="text-h6 text-weight-bold">
              Importes
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-card-section class="q-pt-none">
          <q-list>
            <q-item class="q-px-none">
              <q-item-section>
                <q-item-label class="text-grey-7">Número de instrumentos</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label class="text-weight-bold">
                  {{ verificationStore.hosesCount }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item class="q-px-none">
              <q-item-section>
                <q-item-label class="text-grey-7">Costo por instrumento</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label class="text-weight-bold">
                  {{ $filters.currency(verification.precio_x_manguera ?? 0) }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item class="q-px-none">
              <q-item-section>
                <q-item-label class="text-grey-7">IVA por instrumento</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label class="text-weight-bold">
                  {{ $filters.currency(verification.iva_x_manguera ?? 0) }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-separator class="q-my-sm"></q-separator>
            <q-item class="q-px-none">
              <q-item-section>
                <q-item-label class="text-h6">Total</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label class="text-h6 text-weight-bold text-primary">
                  {{ $filters.currency(verificationStore.total) }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useVerificacion } from "src/stores/verificacion-store";
import {
  verificationStatusChip,
  type IStationVerificationDispenser,
  type IStationVerificationVerifier,
  type IStationVerificationVerifierMaterial,
} from "src/types/IVerification";
import type { IUser } from "src/types/IUser";
import { computed } from "vue";
import { Loading } from "quasar";
import { theme } from "src/boot/helpers";
import { CreateNotify } from "src/config/notify";
import { question } from "src/config/dialog";
import QFetchSelect from "src/components/QFetchSelect.vue";

const verificationStore = useVerificacion();

const verification = computed(() => verificationStore.verificacion);
const dispensers = computed(() => verification.value.dispensers ?? []);
const principalVerifier = computed(
  () => verification.value.verifiers[0]?.verifier ?? null,
);
const auxiliaryVerifier = computed(
  () => verification.value.verifiers[1]?.verifier ?? null,
);
const principalVerifierData = computed(() => verification.value.verifiers[0] ?? null);
const auxiliaryVerifierData = computed(() => verification.value.verifiers[1] ?? null);

type DispenserNumericField =
  | "9_2_1"
  | "desperfectos_9_2"
  | "7_2_4_y_7_2_4_2"
  | "9_2_2_y_5_3_2_3"
  | "9_2_3_y_5_3_3"
  | "leyendas_9_2"
  | "tipo_producto_9_2"
  | "mangueras_9_2_4_1"
  | "8_1"
  | "9_3_2"
  | "temperatura_general"
  | "limpieza_equipo_patron";

type DispenserNumberField = "litros_minimos" | "litros_maximos";

const dispenserFields: {
  key: DispenserNumericField;
  label: string;
  caption?: string;
  policies: number[];
}[] = [
  { key: "9_2_1", label: "9.2.1", caption: "Dispositivos contador o computador debe marcar ceros y debe indicar como mínimo el volumen de combustible líquido despachado, el precio por litro y el importe de la venta", policies: [] },
  { key: "desperfectos_9_2", label: "9.2", caption:"Condiciones que generen desperfectos", policies: [] },
  { key: "7_2_4_y_7_2_4_2", label: "7.2.4 y 7.2.4.2", caption:"Preparación del Equipo y corrida de ambientación", policies: [] },
  { key: "9_2_2_y_5_3_2_3", label: "9.2.2 y 5.3.2.3", caption: "Caratula indicadora", policies: [] },
  { key: "9_2_3_y_5_3_3", label: "9.2.3 y 5.3.3", caption: "Mecanismo de ajuste", policies: [] },
  { key: "leyendas_9_2", label: "9.2", caption: "Leyendas Información Importante para el consumidor", policies: [] },
  { key: "tipo_producto_9_2", label: "9.2", caption: "Tipo de producto a despachar en forma clara y precisa", policies: [] },
  { key: "mangueras_9_2_4_1", label: "9.2.4.1", caption: "Mangueras de descarga", policies: [] },
  { key: "8_1", label: "8.1", caption: "Marcado de Alcance de medición en gasto volumétrico para el cual está diseñado (solo dispensarios)", policies: [] },
  { key: "9_3_2", label: "9.3.2", caption:"Alcance Medición declarado. Solo Aprobaciones NOM-005-SCFI-2017. Elemento primario de medición", policies: [2] },
  { key: "limpieza_equipo_patron", label: "Limpieza equipo patrón", policies: [] },
];

const dispenserLitrosFields: {
  key: DispenserNumberField;
  label: string;
  policies: number[];
}[] = [
  { key: "litros_minimos", label: "Litros mínimos", policies: [2] },
  { key: "litros_maximos", label: "Litros máximos", policies: [2] },
];

function isFieldVisibleForPolicy(
  field: { policies: number[] },
  verificationDispenser: IStationVerificationDispenser,
) {
  if (!field.policies.length) return true;

  const policyId = verificationDispenser.policy?.id ?? verificationDispenser.id_policy;
  if (policyId === null || policyId === undefined) return false;
  return field.policies.includes(policyId);
}

function visibleDispenserFields(verificationDispenser: IStationVerificationDispenser) {
  return dispenserFields.filter((field) =>
    isFieldVisibleForPolicy(field, verificationDispenser),
  );
}

function visibleDispenserLitrosFields(verificationDispenser: IStationVerificationDispenser) {
  return dispenserLitrosFields.filter((field) =>
    isFieldVisibleForPolicy(field, verificationDispenser),
  );
}

const verifierMaterialLabels: {
  key: "mesa_niveladora" | "medida" | "termometro" | "cronometro" | "embudo";
  label: string;
}[] = [
  { key: "medida", label: "Medida volumétrica" },
  { key: "termometro", label: "Termómetro" },
  { key: "cronometro", label: "Cronómetro" },
  { key: "mesa_niveladora", label: "Mesa niveladora" },
  { key: "embudo", label: "Embudo" },
];

function technicalValues(verifierData: IStationVerificationVerifier | null) {
  return [
    { label: "V20", value: verifierData?.v20 ?? "Sin dato" },
    { label: "KC", value: verifierData?.kc ?? "Sin dato" },
    { label: "Alpha", value: verifierData?.alpha ?? "Sin dato" },
  ];
}

function verifierMaterials(verifierData: IStationVerificationVerifier | null) {
  if (!verifierData) return [];

  return verifierMaterialLabels
    .map(({ key, label }) => ({ label, data: verifierData[key] }))
    .filter(
      (material): material is { label: string; data: IStationVerificationVerifierMaterial } =>
        !!material.data,
    );
}

const stationAddress = computed(() => {
  const station = verification.value.station;
  if (!station) return "Sin información";

  return station.formatted_address || "Sin información";
});

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

const inspectionStart = computed(() =>
  formatDateTime(
    verification.value.fecha_inicio_inspeccion,
    verification.value.hora_inicio_inspeccion,
  ),
);

const inspectionEnd = computed(() =>
  formatDateTime(
    verification.value.fecha_termino_inspeccion,
    verification.value.hora_termino_inspeccion,
  ),
);

function fieldStatusClass(value: unknown, required = true) {
  const isEmpty =
    value === null ||
    value === undefined ||
    (typeof value === "string" && value.trim() === "");

  if (!isEmpty) return "bg-positive";
  return required ? "bg-negative" : "bg-positive";
}

function isDispenserFieldCompliant(value: number | null | undefined) {
  return Number(value) === 1;
}

function setDispenserField(
  verificationDispenser: IStationVerificationDispenser,
  key: DispenserNumericField,
  value: boolean,
) {
  verificationDispenser[key] = value ? 1 : 0;
  void handleUpdatePolicyData(verificationDispenser, key, value ? 1 : 0)
}

function setDispenserNumberField(
  verificationDispenser: IStationVerificationDispenser,
  key: DispenserNumberField,
  value: string | number | null,
) {
  void handleUpdatePolicyData(verificationDispenser, key, String(value))
}

async function handleUpdatePolicyData(verificationDispenser: IStationVerificationDispenser, key: string, value: string | number) {
  const { error, message } = await verificationStore.updatePolicyData(Number(verificationDispenser.id_station_dispenser), key, value);
  CreateNotify(error, message);
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

function formatDateTime(date: string | null, time: string | null) {
  if (date && time) return `${date} ${time}`;
  if (date) return date;
  if (time) return time;
  return "Sin fecha/hora";
}


async function handleVerifierSnapshot() {
  const answer = await question("Obtener datos de verificadores", '<span class="text-weight-bold">¿Seguro que deseas continuar?</span><br> Los datos mas actuales de los verificadores serán obtenidos', {
    type: "info"
  })
  if (!answer) return;
  Loading.show({
    ...theme.loading,
    message: "Obteniendo datos actuales de verificadores...",
  });
  try {
    const result = await verificationStore.verifiersSnapshot();
    CreateNotify(result.error ? "negative" : "positive", result.message);
    if (!result.error) {
      await verificationStore.get(verification.value.id as number)
    }
  } finally {
    Loading.hide();
  }
}
</script>

<style lang="scss" scoped>
.verifier-technical-item {
  align-items: flex-start;

  &__value {
    max-width: 60%;
    min-width: 0;

    .q-item-label {
      word-break: break-all;
      text-align: right;
      white-space: normal;
    }
  }
}

.verification-point {
  cursor: default;

  &__checkbox :deep(.q-checkbox__inner) {
    opacity: 1;
  }
}
</style>

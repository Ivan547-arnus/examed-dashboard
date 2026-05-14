<template>
  <q-form id="assigment-form" ref="assigmentFormRef" class="column q-gutter-md" @submit.prevent="emit('submit')">
    <div class="row justify-end">
      <div class="col-auto">
        <q-btn v-bind="$theme.btn" type="button" color="positive" icon="sym_o_add" label="Agregar lote"
          @click="addAssigment" />
      </div>
    </div>

    <q-card v-for="(assigment, index) in model" :key="index" flat bordered class="border-md-radius bg-grey-1">
      <q-card-section class="row q-col-gutter-md">
        <div class="col-12 row items-center justify-between">
          <div>
            <q-item-label class="text-subtitle1">Lote {{ index + 1 }}</q-item-label>
            <q-item-label caption>
              Folios a asignar en este lote: {{ getQuantity(assigment) - (assigment.tieneExepciones ? assigment.excepciones.length : 0) }} {{ getAssigmentSummary(assigment) }}
            </q-item-label>
          </div>
          <q-btn v-bind="$theme.btnIcon" type="button" flat round color="negative" icon="sym_o_close"
            v-if="model.length > 1" @click="removeAssigment(index)">
            <q-tooltip class="bg-negative">Quitar lote</q-tooltip>
          </q-btn>
        </div>

        <q-select v-bind="$theme.input" v-model="assigment.tipo" label="Seleccione el tipo de folios"
          class="col-12 col-md-6" :options="folioTypes" emit-value :rules="[$rules.required('Campo requerido')]"
          @update:model-value="(value) => handleSelectType(value, assigment)">
          <template #option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label>{{ scope.opt.label }}</q-item-label>
                <q-item-label caption>{{ scope.opt.description }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-input v-bind="$theme.input" v-model="assigment.folio_inicial" mask="#" reverse-fill-mask reactive-rules
          label="Folio inicial" class="col-6 col-md-3" :rules="[
            $rules.required('Campo requerido'),
            $rules.maxValue(
              toNumber(assigment.folio_final) ?? 0,
              'El folio inicial debe ser menor al folio final'
            )
          ]" />
        <q-input v-bind="$theme.input" v-model="assigment.folio_final" mask="#" reverse-fill-mask reactive-rules
          label="Folio final" class="col-6 col-md-3" :rules="[
            $rules.required('Campo requerido'),
            $rules.minValue(
              toNumber(assigment.folio_inicial) ?? 0,
              'El folio final debe ser mayor al folio inicial'
            )
          ]" />
        <q-input v-bind="$theme.input" v-model="assigment.observaciones" class="col-12" label="Observaciones (Opcional)"
          type="textarea" rows="3" />
        <div class="col-12">
          <q-item tag="label" v-ripple class="border-md-radius">
            <q-item-section>
              <q-item-label class="text-h6">Existen excepciones</q-item-label>
              <q-item-label caption>Habilita esta opcion en caso de que algun folio dentro del lote no este disponible
                por algun
                motivo</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle label="" v-model="assigment.tieneExepciones"></q-toggle>
            </q-item-section>
          </q-item>
        </div>
        <q-select v-bind="$theme.input" v-if="assigment.tieneExepciones" v-model="assigment.excepciones"
          label="Seleccione los folios que no estan disponibles" multiple use-chips option-label="label"
          :options="assigment.opciones" class="col-12" @focus="getAvailableFolios(assigment)" >
          <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
            <q-item v-bind="itemProps">
              <q-item-section>
                <q-item-label  >
                  {{ opt.label }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-toggle :model-value="selected" @update:model-value="toggleOption(opt)" />
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-card-section>
    </q-card>
  </q-form>
</template>


<script setup lang="ts">
import type { QForm } from 'quasar';
import { useFolio } from 'src/stores/folio-store';
import { folioTypes, type IVerifierFolioAssignment } from 'src/types/IVerifierFolioAssignment';
import { ref } from 'vue';
const folioStore = useFolio();
const emit = defineEmits<{
  submit: [];
}>();

const model = defineModel<IVerifierFolioAssignment[]>({
  default: () => []
});

const assigmentFormRef = ref<QForm | null>(null);

function handleSelectType(value: IVerifierFolioAssignment['tipo'], assigment: IVerifierFolioAssignment) {
  if (value === 'Holograma semestral') {
    assigment.prefijo = `U${folioStore.year}02${folioStore.periodNumber}`;
  } else if (value === 'Precinto') {
    assigment.prefijo = 'UI';
  } else if (value === 'Holograma inicial') {
    assigment.prefijo = `U${folioStore.year}023`;
  } else {
    assigment.prefijo = null;
  }

}

function createEmptyAssigment(): IVerifierFolioAssignment {
  return {
    tipo: null,
    prefijo: null,
    folio_inicial: null,
    folio_final: null,
    observaciones: null,
    excepciones: [],
    tieneExepciones: false
  };
}

function toNumber(value: IVerifierFolioAssignment['folio_inicial']) {
  if (value === null || value === undefined) return null;
  const parsedValue = Number(value);

  return Number.isNaN(parsedValue) ? null : parsedValue;
}

function getQuantity(assigment: IVerifierFolioAssignment) {
  const folioInicial = toNumber(assigment.folio_inicial) ?? 0;
  const folioFinal = toNumber(assigment.folio_final) ?? 0;
  const quantity = folioFinal - folioInicial;

  return quantity > 0 ? quantity + 1 : 0;
}


function getAssigmentSummary(assigment: IVerifierFolioAssignment) {
  if (!assigment.folio_final || !assigment.folio_inicial) {
    return '';
  }
  if (assigment.tipo == 'Holograma semestral' || assigment.tipo == 'Holograma inicial') {
    return `del ${assigment.prefijo}${String(assigment.folio_inicial).padStart(7, '0')} al ${assigment.prefijo}${String(assigment.folio_final).padStart(7, '0')}`
  } else if (assigment.tipo == 'Precinto') {
    return `del ${assigment.prefijo}${assigment.folio_inicial} al ${assigment.prefijo}${assigment.folio_final}`
  }

  return `del ${assigment.folio_inicial} al ${assigment.folio_final}`;
}

function getAvailableFolios(assigment: IVerifierFolioAssignment) {
  if (!assigment.tieneExepciones || !assigment.folio_final || !assigment.folio_inicial) return [];
  const cantidad = getQuantity(assigment);
  const folioInicial = toNumber(assigment.folio_inicial) ?? 0;
  assigment.opciones = Array.from({ length: cantidad }, (_, index) => folioInicial + index).map(folio => {
    if (assigment.tipo == 'Holograma semestral' || assigment.tipo == 'Holograma inicial') {
      return {
        label: `${assigment.prefijo}${String(folio).padStart(7, '0')}`,
        value: folio
      }
    } else if (assigment.tipo == 'Precinto') {
      return {
        label: `${assigment.prefijo}${folio}`,
        value: folio
      }
    }
    return {
      label: `${folio}`,
      value: folio
    }
  });
}


function addAssigment() {
  model.value = [...model.value, createEmptyAssigment()];
}

function removeAssigment(index: number) {
  if (model.value.length === 1) {
    model.value = [createEmptyAssigment()];
    return;
  }

  model.value = model.value.filter((_, assigmentIndex) => assigmentIndex !== index);
}

function resetValidation() {
  assigmentFormRef.value?.resetValidation();
}

defineExpose({
  resetValidation
});
</script>

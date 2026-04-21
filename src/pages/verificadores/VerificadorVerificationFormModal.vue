<template>
  <q-dialog v-model="model">
    <q-card v-bind="$theme.card" class="full-width verification-dialog">
      <q-item class="bg-primary text-white">
        <q-item-section>
          <q-item-label class="text-h5">Nueva verificación</q-item-label>
          <q-item-label caption class="text-grey-2">
            Registra la fecha, el informe y el tipo de calibración del equipo
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn v-bind="$theme.btnIcon" flat round color="white" icon="sym_o_close" @click="model = false"></q-btn>
        </q-item-section>
      </q-item>
      <q-card-section>
        <q-form id="verification-form" ref="verificationFormRef" class="row q-col-gutter-md" @submit.prevent="onSubmit">
          <div class="col-12">
            <q-option-group v-model="state.tipo" :options="typeOptions" color="primary" inline />
          </div>
          <q-input v-bind="$theme.input" v-model="state.data" class="col-12" label="Informe"
            :rules="[$rules.required('Campo requerido')]"></q-input>
          <q-input v-bind="$theme.input" v-model="state.fecha" class="col-12" label="Fecha"
            :rules="[$rules.required('Campo requerido')]" mask="##/##/####" fill-mask12>
            <template #append>
              <q-icon v-bind="$theme.btnIcon" color="primary" name="sym_o_event">
                <q-popup-proxy>
                  <q-date v-model="state.fecha" mask="DD/MM/YYYY" :options="disableFutureDates"></q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-form>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-actions align="right" class="bg-white q-pa-md">
        <q-btn v-bind="$theme.btn" color="grey-3" text-color="primary" label="Cancelar" v-close-popup></q-btn>
        <q-btn v-bind="$theme.btn" type="submit" form="verification-form" color="primary" icon="sym_o_save"
          :loading="saving" label="Guardar verificación"></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import dayjs from 'src/plugins/dayjs';
import { date, type QForm } from 'quasar';
import { make } from 'src/boot/axios';
import { alert, question } from 'src/config/dialog';
import { nextTick, ref } from 'vue';


type VerificationType = 'medida' | 'termometro';

interface IVerificationForm {
  tipo: VerificationType;
  data: string;
  fecha: string;
}

const props = defineProps<{
  verifierId: string;
}>();

const emit = defineEmits<{
  saved: [];
}>();

interface IVerificationTypeOption {
  label: string;
  value: VerificationType;
}

const model = ref(false);
const saving = ref(false);
const verificationFormRef = ref<null | QForm>(null);
const typeOptions: IVerificationTypeOption[] = [
  { label: 'Medida volumétrica', value: 'medida' },
  { label: 'Termómetro', value: 'termometro' }
];
const state = ref<IVerificationForm>({
  tipo: 'medida',
  data: '',
  fecha: dayjs().format('DD/MM/YYYY')
});

function resetForm() {
  state.value = {
    tipo: 'medida',
    data: '',
    fecha: dayjs().format('DD/MM/YYYY')
  };
}


async function onSubmit() {
  const isValid = await verificationFormRef.value?.validate();
  if (!isValid) return;

  const answer = await question(
    'Guardar verificación',
    '<p class="text-bold q-ma-none q-mb-xs">¿Seguro que desea continuar?</p>La verificación será agregada al equipo actual',
    { type: 'info' },
  );

  if (!answer) return;

  try {
    saving.value = true;
    const {
      data: { error, message },
    } = await make(
      `/verifier/users/${props.verifierId}/calibrations`,
      'POST',
      {
        ...state.value,
        fecha: dayjs(state.value.fecha, 'DD/MM/YYYY').format('YYYY-MM-DD'),
      },
      'Guardando verificación...',
    );

    await alert(error ? 'Error' : 'Operación exitosa', message, { type: error ? 'negative' : 'positive' });

    if (error) return;

    emit('saved');
    model.value = false;
    resetForm();
  } catch (error) {
    console.log(error);
    await alert('Error', 'No fue posible guardar la verificación', { type: 'negative' });
  } finally {
    saving.value = false;
  }
}

function disableFutureDates(dateStr:string) {
  // Returns true (enables) if date is today or in the future
  return dateStr <= date.formatDate(Date.now(), 'YYYY/MM/DD');
}

defineExpose({
  open: async () => {
    resetForm();
    model.value = true;
    await nextTick();
    verificationFormRef.value?.resetValidation();
  }
});
</script>

<style scoped lang="scss">
.verification-dialog {
  width: 100%;
  max-width: 420px;
}
</style>

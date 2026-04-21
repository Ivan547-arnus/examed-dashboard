<template>
  <q-dialog v-model="model">
    <q-card v-bind="$theme.card" class="full-width material-dialog">
      <q-item class="bg-primary text-white">
        <q-item-section>
          <q-item-label class="text-h5">Asignar equipo de trabajo</q-item-label>
          <q-item-label caption class="text-grey-2">
            Ingresa el nombre del equipo que utilizará el verificador
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn v-bind="$theme.btnIcon" flat round color="white" icon="sym_o_close" @click="model = false"></q-btn>
        </q-item-section>
      </q-item>
      <q-card-section>
        <q-form id="material-form" ref="materialFormRef" @submit.prevent="onSubmit">
          <q-input
            v-bind="$theme.input"
            v-model="state.nombre"
            :rules="[$rules.required('Campo requerido')]"
            autofocus
            label="Nombre del equipo"
          ></q-input>
        </q-form>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-actions align="right" class="bg-white q-pa-md">
        <q-btn v-bind="$theme.btn" color="grey-3" text-color="primary" label="Cancelar" v-close-popup></q-btn>
        <q-btn
          v-bind="$theme.btn"
          type="submit"
          form="material-form"
          color="primary"
          icon="sym_o_save"
          :loading="saving"
          label="Guardar equipo"
        ></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import type { QForm } from 'quasar';
import { make } from 'src/boot/axios';
import { alert, question } from 'src/config/dialog';
import { nextTick, ref } from 'vue';

interface IVerifierMaterialCalibrationUser {
  id: number;
  username: string;
  name: string;
  lastname: string;
  second_lastname: string;
  fullname: string;
}

interface IVerifierMaterialCalibration {
  id: number;
  id_verifier_material: number;
  id_user: number;
  tipo: string;
  fecha: string;
  data: string;
  created_at: string;
  updated_at: string;
  user: IVerifierMaterialCalibrationUser;
}

interface IVerifierMaterial {
  id: number;
  id_user: number;
  nombre: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  latest_calibration_measure: IVerifierMaterialCalibration | null;
  latest_calibration_termometer: IVerifierMaterialCalibration | null;
}

const props = defineProps<{
  verifierId: number | string;
}>();

const emit = defineEmits<{
  saved: [material: IVerifierMaterial];
}>();

const model = ref(false);
const saving = ref(false);
const materialFormRef = ref<null | QForm>(null);
const state = ref({
  nombre: ''
});

function resetForm() {
  state.value.nombre = '';
}

async function onSubmit() {
  const isValid = await materialFormRef.value?.validate();
  if (!isValid) return;

  const answer = await question(
    'Asignar equipo',
    '<p class="text-bold q-ma-none q-mb-xs">¿Seguro que desea continuar?</p>El equipo de trabajo será asignado al verificador actual',
    { type: 'info' },
  );

  if (!answer) return;

  try {
    saving.value = true;
    const {
      data: { error, message, data },
    } = await make<IVerifierMaterial, { nombre: string }>(
      `/verifier/users/${props.verifierId}/material`,
      'POST',
      state.value,
      'Asignando equipo de trabajo...',
    );

    await alert(error ? 'Error' : 'Operación exitosa', message, { type: error ? 'negative' : 'positive' });

    if (error) return;

    emit('saved', data);
    model.value = false;
    resetForm();
  } catch (error) {
    console.log(error);
    await alert('Error', 'No fue posible asignar el equipo de trabajo', { type: 'negative' });
  } finally {
    saving.value = false;
  }
}

defineExpose({
  open: async () => {
    resetForm();
    model.value = true;
    await nextTick();
    materialFormRef.value?.resetValidation();
  }
});
</script>

<style scoped lang="scss">
.material-dialog {
  width: 100%;
  max-width: 480px;
}
</style>

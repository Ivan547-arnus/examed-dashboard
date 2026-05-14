<template>
  <q-card v-bind="$theme.card" class="q-mt-md" v-if="state.material">
    <q-item class="bg-primary text-white">
      <q-item-section>
        <q-item-label class="text-h5">Equipo</q-item-label>
        <q-item-label caption class="text-grey-2">
          Visualiza el equipo y su ultima verificación
        </q-item-label>
      </q-item-section>
      <q-item-section side style="display: flex !important; flex-direction: row;">
        <q-btn id="add-verification" v-bind="$theme.btnIcon" color="grey-3" text-color="primary"
          @click="openVerificationDialog" icon="sym_o_add_notes">
          <q-tooltip class="bg-primary">Agregar resultados de nueva verificación</q-tooltip>
        </q-btn>
      </q-item-section>
    </q-item>
    <q-card-section>
      <q-item class="q-px-none">
        <q-item-section>
          <q-item-label class="text-h5">Equipo {{ state.material.nombre }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-item-label :class="`${lastCalibrationStatus.colorClass} border-md-radius q-pa-sm text-white`">
            {{ lastCalibrationStatus.label }}
          </q-item-label>
        </q-item-section>
      </q-item>
      <span class="text-h6">Datos de ultima verificación</span>
      <q-markup-table separator="horizontal" flat bordered class="q-mt-sm border-md-radius">
        <thead>
          <tr>
            <th class="text-left">Informe medida volumetrica</th>
            <th class="text-right">Fecha de medida volumetrica</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-left">{{ state.material.latest_calibration_measure?.data ?? 'Sin registro' }}</td>
            <td class="text-right">{{ getCalibrationDate(state.material.latest_calibration_measure) }}</td>
          </tr>
        </tbody>
      </q-markup-table>
      <q-item-label caption class="q-mt-xs">{{ getCalibrationCaption(state.material.latest_calibration_measure)
        }}</q-item-label>
      <q-markup-table separator="horizontal" flat bordered class="q-mt-md border-md-radius">
        <thead>
          <tr>
            <th class="text-left">Informe termómetro</th>
            <th class="text-right">Fecha de medida termómetro</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-left">{{ state.material.latest_calibration_termometer?.data ?? 'Sin registro' }}</td>
            <td class="text-right">{{ getCalibrationDate(state.material.latest_calibration_termometer) }}</td>
          </tr>
        </tbody>
      </q-markup-table>
      <q-item-label caption class="q-mt-xs">{{
        getCalibrationCaption(state.material.latest_calibration_termometer)
        }}</q-item-label>
    </q-card-section>
  </q-card>
  <q-card v-bind="$theme.card" class="q-mt-md" v-else>
    <q-item class="bg-primary text-white">
      <q-item-section>
        <q-item-label class="text-h5">Equipo</q-item-label>
        <q-item-label caption class="text-grey-2">
          Este verificador aun no tiene un equipo de trabajo asignado
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-card-section class="column items-center text-center q-py-xl">
      <q-avatar size="72px" color="grey-3" text-color="primary" icon="sym_o_inventory_2"></q-avatar>
      <q-item-label class="text-h6 q-mt-md">
        No hay material registrado
      </q-item-label>
      <q-item-label caption class="q-mt-sm">
        Asigna el producto con el que trabaja este verificador para comenzar a registrar sus calibraciones.
      </q-item-label>
      <q-btn v-bind="$theme.btn" class="q-mt-lg" color="primary" icon="sym_o_add" label="Asignar equipo de trabajo"
        @click="openMaterialDialog"></q-btn>
    </q-card-section>
  </q-card>

  <verificador-material-form-modal ref="materialModalRef" :verifier-id="(router.currentRoute.value.params.id as string)"
    @saved="onMaterialSaved" />
  <verificador-verification-form-modal v-if="state.material" ref="verificationModalRef"
    :verifier-id="(router.currentRoute.value.params.id as string)" @saved="onVerificationSaved" />
</template>

<script lang="ts">
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
  remaining_days: number;
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

interface IVerifierMaterialStatus {
  remainingDays: number | null;
  colorClass: string;
  alert?: string | boolean;
  label: string;
}
</script>

<script lang="ts" setup>
import { filters } from 'src/boot/helpers';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import VerificadorMaterialFormModal from '../VerificadorMaterialFormModal.vue';
import VerificadorVerificationFormModal from '../VerificadorVerificationFormModal.vue';
import { make } from 'src/boot/axios';

const materialModalRef = ref<null | { open: () => void }>(null);
const verificationModalRef = ref<null | { open: () => void }>(null);
const state = ref({
  material: null as IVerifierMaterial | null
})
const router = useRouter();
function openMaterialDialog() {
  materialModalRef.value?.open()
}

function openVerificationDialog() {
  verificationModalRef.value?.open()
}

function getCalibrationDate(calibration: IVerifierMaterialCalibration | null) {
  return calibration?.fecha ? filters.date(calibration.fecha) : 'Sin registro'
}

function getCalibrationCaption(calibration: IVerifierMaterialCalibration | null) {
  if (!calibration) return 'No hay calibraciones registradas'
  const userName = calibration.user.fullname

  return `Registrado el ${filters.date(calibration.created_at)} por ${userName}`
}

const lastCalibrationStatus = computed<IVerifierMaterialStatus>(() => {
  const material = state.value.material

  if (!material) {
    return {
      remainingDays: null,
      colorClass: 'bg-grey-6',
      alert: false,
      label: 'Sin calibraciones'
    }
  }


  if (!material.latest_calibration_measure && !material.latest_calibration_termometer) {
    return {
      remainingDays: null,
      colorClass: 'bg-grey-6',
      alert: false,
      label: 'Sin calibraciones'
    }
  }

  const remainingDays = (material.latest_calibration_measure?.remaining_days ?? 0) > (material.latest_calibration_termometer?.remaining_days ?? 0) ? (material.latest_calibration_measure?.remaining_days ?? 0) : (material.latest_calibration_termometer?.remaining_days ?? 0);

  if (remainingDays <= 0) {
    return {
      remainingDays,
      colorClass: 'bg-negative',
      alert: 'negative',
      label: remainingDays === 0 ? 'Vence hoy' : `Vencido hace ${Math.abs(remainingDays)} dias`
    }
  }

  if (remainingDays < 30) {
    return {
      remainingDays,
      colorClass: 'bg-negative',
      alert: 'negative',
      label: `Vence en ${remainingDays} dias`
    }
  }

  if (remainingDays < 90) {
    return {
      remainingDays,
      colorClass: 'bg-warning',
      alert: false,
      label: `Vence en ${remainingDays} dias`
    }
  }

  return {
    remainingDays,
    colorClass: 'bg-positive',
    alert: false,
    label: `Vence en ${remainingDays} dias`
  }
})





function onMaterialSaved() {
  void getMaterial()
}



function onVerificationSaved() {
  void getMaterial()
}



async function getMaterial() {
  try {
    const id = router.currentRoute.value.params.id as string
    const {
      data: {
        error,
        message,
        data
      }
    } = await make<IVerifierMaterial | null>(`/verifier/users/${id}/get-material`, 'GET', {}, false);
    if (!error) {
      state.value.material = data
    } else {
      state.value.material = null
      console.log(message)
    }
  } catch (error) {
    state.value.material = null
    console.log(error)
  }
}
</script>

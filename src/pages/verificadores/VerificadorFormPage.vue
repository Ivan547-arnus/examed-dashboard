<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12 flex justify-between">
        <q-btn v-bind="$theme.btn" color="grey-3" text-color="primary" to="/verificadores" icon="sym_o_arrow_back"
          label="Regresar"></q-btn>
      </div>
      <div class="col-12 col-sm-7 col-md-8">
        <q-tabs v-model="tab" no-caps active-color="primary" inline-label indicator-color="primary" >
          <q-tab name="hologramas" label="Hologramas" icon="sym_o_license"></q-tab>
          <q-tab label="Equipo y calibraciones" name="equipos" icon="sym_o_thermostat" :alert="lastCalibrationStatus.alert"></q-tab>
        </q-tabs>
        <q-separator></q-separator>
        <template v-if="tab === 'hologramas'">
          <q-card v-bind="$theme.card" class="q-mt-md">
            <q-item class="bg-primary text-white">
              <q-item-section>
                <q-item-label class="text-h5">Asignación de hologramas</q-item-label>
                <q-item-label caption class="text-grey-2">
                  Ingrese la cantidad de folios a asignar
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-card-section>
              <q-form id="assigment-form" ref="assigmentFormRef" class="row q-col-gutter-md" @submit.prevent="onAssign">
                <q-item-label class="col-12 text-h6">Cantidad de folios a asignar: {{ quantity }}</q-item-label>
                <q-input v-bind="$theme.input" mask="#" reverse-fill-mask label="Folio inicial" class="col-6"
                  v-model="state.assigment.folio_inicial" reactive-rules
                  :rules="[$rules.required('Campo requerido'), $rules.maxValue((state.assigment.folio_final ?? 0), 'El folio inicial debe ser menor al folio final')]"></q-input>
                <q-input v-bind="$theme.input" mask="#" reactive-rules reverse-fill-mask label="Folio final"
                  class="col-6" v-model="state.assigment.folio_final"
                  :rules="[$rules.required('Campo requerido'), $rules.minValue((state.assigment.folio_inicial ?? 0), 'El folio final debe ser mayor al folio inicial')]"></q-input>
                <q-input v-bind="$theme.input" class="col-12" label="Observaciones (Opcional)" type="textarea" rows="3"
                  v-model="state.assigment.observaciones"></q-input>
                <q-item-label class="col-12" caption>
                  Ingresa observaciones a tomar en cuenta en esta asignación, cada asignacion puede tener sus propias
                  observaciones.
                </q-item-label>
              </q-form>
            </q-card-section>
            <q-separator></q-separator>
            <q-card-actions align="right" class="bg-white q-pa-md">
              <q-btn v-bind="$theme.btn" type="submit" form="assigment-form" color="primary" icon="sym_o_assignment_add"
                label="Asignar folios"></q-btn>
            </q-card-actions>
          </q-card>
          <q-card v-bind="$theme.card" class="q-mt-md">
            <q-item class="bg-primary text-white">
              <q-item-section>
                <q-item-label class="text-h5">Historico de hologramas</q-item-label>
                <q-item-label caption class="text-grey-2">
                  Verifique el historico de folios asignados de: {{ state.user.name }} {{ state.user.lastname }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn v-bind="$theme.btnIcon" @click="handleExport" color="grey-3" text-color="primary"
                  icon="sym_o_download">
                  <q-tooltip class="bg-primary">Descargar asignaciones</q-tooltip>
                </q-btn>
              </q-item-section>
            </q-item>
            <q-table-component ref="tableAssigment"
              :url="`/verifier/users/${$router.currentRoute.value.params.id}/assignments`"
              v-model:pagination="pagination" :columns="columns" table-header-class="bg-grey-3">
              <template #no-data>
                <div class="full-width column items-center justify-center q-pa-md">
                  <q-avatar icon="sym_o_info" text-color="primary" color="grey-3" size="78px"></q-avatar>
                  <q-item-label class="text-h6 q-mt-md">El verificador aun no tiene folios asignados</q-item-label>
                </div>
              </template>
              <template #body-cell-actions="props">
                <q-td key="actions" :props="props">
                  <q-btn v-bind="$theme.btnIcon" @click="cancelAssign(props.row.id)"
                    :disabled="!validateExpiration(props.row.fecha_expiracion)" icon="sym_o_block" color="negative">
                    <q-tooltip class="bg-negative" v-if="validateExpiration(props.row.fecha_expiracion)">Cancelar
                      asignación</q-tooltip>
                    <q-tooltip class="bg-negative" v-else>El tiempo para cancelar la asignación ha expirado, la fecha de
                      expiración es: {{ $filters.dateTime(props.row.fecha_expiracion) }}</q-tooltip>
                  </q-btn>
                </q-td>
              </template>
            </q-table-component>
          </q-card>
        </template>
        <template v-else-if="tab === 'equipos'">
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
                  @click="openVerificationDialog"
                  icon="sym_o_add_notes">
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
              <q-btn
                v-bind="$theme.btn"
                class="q-mt-lg"
                color="primary"
                icon="sym_o_add"
                label="Asignar equipo de trabajo"
                @click="openMaterialDialog"
              ></q-btn>
            </q-card-section>
          </q-card>
        </template>
      </div>
      <div class="col-12 col-sm-5 col-md-4">
        <q-card v-bind="$theme.card">
          <q-item class="bg-primary text-white">
            <q-item-section>
              <q-item-label class="text-h5">Información personal</q-item-label>
              <q-item-label caption class="text-grey-2">
                Actualice la información personal del verificador si es necesario
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-card-section>
            <q-form id="verificador-form" class="row q-col-gutter-md" @submit.prevent="onSubmit">
              <q-input v-bind="$theme.input" v-model="state.user.name" :rules="[$rules.required('Campo requerido')]"
                label="Nombre" class="col-12"></q-input>
              <q-input v-bind="$theme.input" v-model="state.user.lastname" :rules="[$rules.required('Campo requerido')]"
                label="Primer apellido" class="col-12"></q-input>
              <q-input v-bind="$theme.input" v-model="state.user.second_lastname" label="Segundo apellido (Opcional)"
                class="col-12"></q-input>
              <q-input v-bind="$theme.input" v-model="state.user.email"
                :rules="[$rules.required('Campo requerido'), $rules.email('Correo invalido')]" label="Email"
                class="col-12"></q-input>
              <q-input v-bind="$theme.input" v-model="state.user.phone" mask="(###) ###-##-##" unmasked-value
                label="Teléfono (Opcional)" class="col-12"></q-input>
              <q-input v-bind="$theme.input" v-model="state.user.username" :rules="[$rules.required('Campo requerido')]"
                label="Nombre de usuario" class="col-12"></q-input>
              <q-toggle v-model="state.user.change_password" color="primary" text-color="secondary"
                label="Actualizar contraseña"></q-toggle>
              <template v-if="state.user.change_password">
                <q-input v-bind="$theme.input" v-model="state.user.password"
                  :type="state.user.show_password ? 'text' : 'password'" :rules="[
                    $rules.required('Campo requerido'),
                    $rules.minLength(8, 'La contraseña debe tener al menos 8 caracteres')
                  ]" label="Contraseña" class="col-12">
                  <template #append>
                    <q-icon :name="state.user.show_password ? 'sym_o_visibility_off' : 'sym_o_visibility'"
                      @click="state.user.show_password = !state.user.show_password"></q-icon>
                  </template>
                </q-input>
                <q-input v-bind="$theme.input" v-model="state.user.password_confirmation"
                  :type="state.user.show_password_confirmation ? 'text' : 'password'" :rules="[
                    $rules.required('Campo requerido'),
                    $rules.minLength(8, 'La contraseña debe tener al menos 8 caracteres'),
                    $rules.sameAs(state.user.password, 'Las contraseñas no coinciden')
                  ]" label="Confirmar contraseña" class="col-12">
                  <template #append>
                    <q-icon :name="state.user.show_password_confirmation ? 'sym_o_visibility_off' : 'sym_o_visibility'"
                      @click="
                        state.user.show_password_confirmation = !state.user.show_password_confirmation
                        "></q-icon>
                  </template>
                </q-input>
              </template>
            </q-form>
          </q-card-section>
          <q-separator></q-separator>
          <q-card-actions align="right" class="bg-white q-pa-md">
            <q-btn v-bind="$theme.btn" type="submit" form="verificador-form" color="primary" icon="sym_o_save"
              label="Guardar"></q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>
    <verificador-material-form-modal
      ref="materialModalRef"
      :verifier-id="(router.currentRoute.value.params.id as string)"
      @saved="onMaterialSaved"
    />
    <verificador-verification-form-modal
      v-if="state.material"
      ref="verificationModalRef"
      :verifier-id="(router.currentRoute.value.params.id as string)"
      @saved="onVerificationSaved"
    />
  </q-page>
</template>

<script setup lang="ts">
import { file, make } from 'src/boot/axios';
import { filters, theme, utils } from 'src/boot/helpers';
import QTableComponent from 'src/components/QTableComponent.vue';
import VerificadorMaterialFormModal from 'src/pages/verificadores/VerificadorMaterialFormModal.vue';
import VerificadorVerificationFormModal from 'src/pages/verificadores/VerificadorVerificationFormModal.vue';
import { alert, question, questionWithAnswer } from 'src/config/dialog';
import { type IUser, User } from 'src/types/IUser';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

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

const router = useRouter();
const tab = ref('hologramas');
const assigmentFormRef = ref<null | { resetValidation: () => void }>(null);
const materialModalRef = ref<null | { open: () => void }>(null);
const verificationModalRef = ref<null | { open: () => void }>(null);
const pagination = ref({ page: 1, rowsPerPage: 5, sortBy: 'created_at', descending: true, rowsNumber: 0 });
const tableAssigment = ref<null | { refresh: () => void }>(null);
const state = ref({
  user: new User,
  material: null as IVerifierMaterial | null,
  assigment: {
    folio_inicial: null,
    folio_final: null,
    observaciones: null
  }
});

const validateExpiration = (date: string) => {
  const today = new Date();
  const expiration = new Date(date);
  return expiration > today;
}

const columns = [
  {
    name: 'folio_inicial',
    field: (row: { folio_inicial: number }) => row.folio_inicial.toLocaleString(),
    label: 'Folio inicial',
    align: 'left',
    sortable: true
  },
  {
    name: 'folio_final',
    field: (row: { folio_final: number }) => row.folio_final.toLocaleString(),
    label: 'Folio final',
    align: 'left',
    sortable: true
  },
  {
    name: 'created_at',
    field: (row: { created_at: string }) => filters.dateTime(row.created_at),
    label: 'Fecha de asignación',
    align: 'left',
    sortable: true
  },
  {
    name: 'actions',
    field: 'actions',
    label: 'Acciones',
    align: 'right',
    sortable: false
  }
]

async function getUser(id: string) {
  try {
    const {
      data: {
        error,
        message,
        data
      }
    } = await make<IUser>(`/verifier/users/${id}`, 'GET', {}, 'Obteniendo verificador...');
    if (!error) {
      state.value.user = new User(data)
    } else {
      await alert('Error', message, { type: 'negative' })
      void router.push('/verificadores')
    }
  } catch (error) {
    await alert('Error', 'Error al obtener el verificador', { type: 'negative' })
    void router.push('/verificadores')
    console.log(error)
  }
}

async function onSubmit() {
  const answer = await question('Guardar', '<p class="text-bold q-ma-none q-mb-xs">¿Seguro que desea continuar?</p>El usuario se guardará con los datos ingresados', { type: 'info' })
  if (!answer) return
  const {
    data: {
      error,
      message
    }
  } = await make(`verifier/users/${state.value.user.id}`, 'PUT', {
    ...state.value.user,
  })

  await alert(error ? 'Error' : 'Operación exitosa', message, { type: error ? 'negative' : 'positive' })
}

async function onAssign() {
  const answer = await question('Asignación', '<p class="text-bold q-ma-none q-mb-xs">¿Seguro que desea continuar?</p> Los folios serán asignados al verificador actual', { type: 'info' })
  if (!answer) return
  const {
    data: {
      error,
      message
    }
  } = await make(`verifier/users/${state.value.user.id}/assign`, 'POST', {
    ...state.value.assigment,
    id_verifier: state.value.user.id
  }, 'Asignando folios...')

  await alert(error ? 'Error' : 'Operación exitosa', message, { type: error ? 'negative' : 'positive' })
  if (!error) {
    resetAssigment();
    await nextTick();
    assigmentFormRef.value?.resetValidation();
    tableAssigment.value?.refresh();
  }
}

async function cancelAssign(id: number) {
  const { answer, value } = await questionWithAnswer('Cancelar asignación', '<p class="text-bold q-ma-none q-mb-xs">¿Seguro que desea continuar?</p> La asignación se cancelará permanentemente', {
    type: 'negative',
    icon: 'sym_o_warning',
    input: {
      label: 'Motivo de cancelación',
    },
    ok: {
      ...theme.btn,
      color: 'negative',
      textColor: 'white',
      label: 'Aceptar'
    }
  });
  if (!answer) return;
  const {
    data: {
      error,
      message
    }
  } = await make(`verifier/users/${state.value.user.id}/cancel-assignment`, 'DELETE', {
    id,
    motivo_cancelacion: value
  });
  void alert(!error ? 'Cancelado' : 'Error al cancelar', message, { type: !error ? 'positive' : 'negative' })
  if (!error) {
    tableAssigment.value?.refresh();
  }
}

function resetAssigment() {
  state.value.assigment.folio_inicial = null;
  state.value.assigment.folio_final = null;
  state.value.assigment.observaciones = null;
}

const quantity = computed(() => {
  return (state.value.assigment.folio_final ?? 0) - (state.value.assigment.folio_inicial ?? 0)
})

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

function getCalibrationDate(calibration: IVerifierMaterialCalibration | null) {
  return calibration?.fecha ? filters.date(calibration.fecha) : 'Sin registro'
}

function getCalibrationCaption(calibration: IVerifierMaterialCalibration | null) {
  if (!calibration) return 'No hay calibraciones registradas'
  const userName = calibration.user.fullname

  return `Registrado el ${filters.date(calibration.created_at)} por ${userName}`
}

function openMaterialDialog() {
  materialModalRef.value?.open()
}

function onMaterialSaved() {
  void getMaterial()
}

function openVerificationDialog() {
  verificationModalRef.value?.open()
}

function onVerificationSaved() {
  void getMaterial()
}


async function handleExport() {
  const data = await file(`verifier/users/${state.value.user.id}/export-assignments`, 'GET', {}, 'Exportando asignaciones...');
  if (data.type == 'application/json') {
    void alert('Error al exportar', 'Ha ocurrido un error al exportar las asignaciones', { type: 'negative' })
  } else {
    utils.downloadBlob(data.data, 'asignaciones', 'xlsx')
  }
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

watch(() => tab.value, (value) => {
  if(value === 'equipos') {
    void getMaterial()
  }
})

onMounted(() => {
  if (router.currentRoute.value.params.id) {
    void getUser(router.currentRoute.value.params.id as string);
    void getMaterial()
    resetAssigment();
  }
})
</script>

<template>
  <q-page padding class="extended">
    <div style="max-width: 1440px; margin: auto">
      <div class="full-width flex justify-start q-mb-md">
        <q-btn v-bind="$theme.btn" color="white" text-color="primary" to="/verificadores" icon="sym_o_arrow_back"
          label="Regresar"></q-btn>
      </div>
      <div class="summary-container">
        <div>
          <q-card v-bind="$theme.card">
            <q-card-section>
              <q-item>
                <q-item-section avatar>
                  <q-avatar v-bind="$theme.avatar" size="40px" color="dark" class="q-mr-sm" round>
                    <q-icon name="sym_o_engineering" color="secondary" size="1.2em"></q-icon>
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-h5">{{ verificadorStore.user?.fullname }}</q-item-label>
                  <q-item-label caption class="text-dark">Verificador</q-item-label>
                </q-item-section>
              </q-item>
            </q-card-section>
          </q-card>
        </div>
        <div>
          <q-card v-bind="$theme.card">
            <q-card-section>
              <q-item>
                <q-item-section avatar>
                  <q-avatar v-bind="$theme.avatar" size="40px" color="dark" class="q-mr-sm" round>
                    <q-icon name="sym_o_calendar_month" color="secondary" size="1.2em"></q-icon>
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-h5">{{ folioStore.period }} {{ folioStore.year }}</q-item-label>
                  <q-item-label caption class="text-dark">Periodo Actual</q-item-label>
                </q-item-section>
              </q-item>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <q-card v-bind="$theme.card" class="q-mt-md">
        <q-item class="bg-primary text-secondary">
          <q-item-section>
            <q-item-label class="text-h5">Asignación de Hologramas, Distintivos y Precintos</q-item-label>
            <q-item-label caption class="text-grey-2">
              Configure las asignaciones de hologramas, distintivos y precintos
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-card-section>
          <v-folio-asignacion-component ref="assigmentFormRef" v-model="state.assigments" @submit="onAssign" />
        </q-card-section>
        <q-separator></q-separator>
        <q-card-actions align="right" class="bg-white q-pa-md">
          <q-btn v-bind="$theme.btn" type="submit" form="assigment-form" color="primary" text-color="secondary"
            icon="sym_o_assignment_add" label="Asignar folios"></q-btn>
        </q-card-actions>
      </q-card>
      <q-card v-bind="$theme.card" class="q-mt-md">
        <q-item class="bg-primary text-secondary">
          <q-item-section>
            <q-item-label class="text-h5">Historico de folios</q-item-label>
            <q-item-label caption class="text-grey-2">
              Verifique el historico de hologramas, distintivos y precintos asignados al verificador, así como su fecha
              de asignación
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
          :url="`/verifier/users/${$router.currentRoute.value.params.id}/assignments`" v-model:pagination="pagination"
          :columns="columns" table-header-class="bg-grey-3">
          <template #no-data>
            <div class="full-width column items-center justify-center q-pa-md">
              <q-avatar icon="sym_o_info" text-color="primary" color="grey-3" size="78px"></q-avatar>
              <q-item-label class="text-h6 q-mt-md">El verificador aun no tiene folios asignados</q-item-label>
            </div>
          </template>
          <template #body-cell-actions="props">
            <q-td key="actions" :props="props">
              <q-btn v-bind="$theme.btnIcon" icon="sym_o_more_vert" flat>
                <q-menu v-bind="$theme.menu">
                  <q-list separator class="border-md-radius">

                    <q-item clickable v-ripple class="text-dark" v-if="props.row.observaciones"
                      @click="handleObservationView(props.row)">
                      <q-item-section avatar>
                        <q-icon name="sym_o_message"></q-icon>
                      </q-item-section>
                      <q-item-section no-wrap>
                        <q-item-label class="text-dark">
                          Ver observaciones
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item clickable v-ripple class="text-dark"
                      v-if="props.row.exceptions && props.row.exceptions.length"
                      @click="handleExceptionView(props.row)">
                      <q-item-section avatar>
                        <q-icon name="sym_o_info"></q-icon>
                      </q-item-section>
                      <q-item-section no-wrap>
                        <q-item-label class="text-dark">
                          Ver excepciones
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item clickable :disable="!validateExpiration(props.row.fecha_expiracion)" v-ripple
                      class="text-negative" @click="cancelAssign(props.row)">
                      <q-item-section avatar>
                        <q-icon name="sym_o_block"></q-icon>
                      </q-item-section>
                      <q-item-section no-wrap>Cancelar asignación</q-item-section>
                      <q-tooltip class="bg-negative" v-if="!validateExpiration(props.row.fecha_expiracion)">El tiempo
                        para cancelar la asignación ha expirado, la fecha de
                        expiración es: {{ $filters.dateTime(props.row.fecha_expiracion) }}</q-tooltip>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </q-td>
          </template>
        </q-table-component>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { file, make } from 'src/boot/axios';
import { filters, theme, utils } from 'src/boot/helpers';
import QTableComponent from 'src/components/QTableComponent.vue';
import { alert, question, questionWithAnswer } from 'src/config/dialog';
import VFolioAsignacionComponent from 'src/pages/verificadores/components/VFolioAsignacionComponent.vue';
import { useFolio } from 'src/stores/folio-store';
import { useVerificador } from 'src/stores/verificador-store';
import { formatFolio, type IVerifierFolioAssignment } from 'src/types/IVerifierFolioAssignment';
import { nextTick, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const pagination = ref({ page: 1, rowsPerPage: 5, sortBy: 'created_at', descending: true, rowsNumber: 0 });
const assigmentFormRef = ref<null | { resetValidation: () => void }>(null);
const tableAssigment = ref<null | { refresh: () => void }>(null);
const state = ref({
  assigments: [createEmptyAssigment()]
});


const folioStore = useFolio();
const verificadorStore = useVerificador();

const columns = [
  {
    name: 'ano_periodo',
    field: (row: { ano: string, periodo: string }) => row.ano + ' / ' + row.periodo,
    label: 'Año / Periodo',
    align: 'left',
    sortable: false
  },
  {
    name: 'tipo',
    field: (row: { tipo: string }) => row.tipo,
    label: 'Tipo',
    align: 'left',
    sortable: false
  },
  {
    name: 'folio_inicial',
    field: (row: { folio_inicial_completo: string }) => row.folio_inicial_completo,
    label: 'Folio inicial',
    align: 'left',
    sortable: true
  },
  {
    name: 'folio_final',
    field: (row: { folio_final_completo: string }) => row.folio_final_completo,
    label: 'Folio final',
    align: 'left',
    sortable: true
  },
  {
    name: 'cantidad',
    field: (row: { folio_inicial: number, folio_final: number, exceptions_count: number }) => (row.folio_final - row.folio_inicial + 1) + ' folio(s) - ' + row.exceptions_count + ' exepcion(es)',
    label: 'Cantidad de folios',
    align: 'left',
    sortable: false
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
const router = useRouter();

function createEmptyAssigment(): IVerifierFolioAssignment {
  return {
    prefijo: null,
    tipo: null,
    folio_inicial: null,
    folio_final: null,
    observaciones: null,
    excepciones: [],
    tieneExepciones: false
  };
}

function validateExpiration(date: string) {
  const today = new Date();
  const expiration = new Date(date);
  return expiration > today;
}

function buildExceptionsTableHtml(row: IVerifierFolioAssignment & { exceptions: { folio: number }[] }) {
  const rows = row.exceptions.map((exception, index) => {
    const folio = formatFolio(row, exception.folio);

    return `
      <tr>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e0e0e0; text-align: center; font-weight: 600;">${index + 1}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e0e0e0;">${folio}</td>
      </tr>
    `;
  }).join('');

  return `
    <div>
      <p style="margin: 0 0 12px 0;">Los siguientes folios fueron marcados como excepciones:</p>
      <div style="border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <table style="width: 100%; border-collapse: collapse; background: #ffffff;">
          <thead>
            <tr style="background: var(--q-primary); color: var(--q-secondary);">
              <th style="padding: 10px 12px; text-align: center; border-bottom: 1px solid #e0e0e0; width: 72px;">#</th>
              <th style="padding: 10px 12px; text-align: left; border-bottom: 1px solid #e0e0e0;">Folio</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  `;
}

function handleExceptionView(row: IVerifierFolioAssignment & { exceptions: { folio: number }[] }) {
  if (row.exceptions.length > 0) {
    void alert('Excepciones', buildExceptionsTableHtml(row), {
      maxWidth: 560,
      type: 'info', ok: {
        color: 'positive',
        label: 'Cerrar'
      }
    })
  }
}

function handleObservationView(row: IVerifierFolioAssignment) {
  if (row.observaciones) {
    void alert('Observaciones', row.observaciones, {
      maxWidth: 560,
      type: 'info', ok: {
        color: 'positive',
        label: 'Cerrar'
      }
    })
  }
}


async function onAssign() {
  const answer = await question('Asignación de folios', '<p class="text-bold q-ma-none q-mb-xs">¿Seguro que desea continuar?</p> Los folios serán asignados al verificador actual', { type: 'info' })
  if (!answer) return
  const {
    data: {
      error,
      message
    }
  } = await make(`verifier/users/${(router.currentRoute.value.params.id as string)}/assign`, 'POST', {
    ano: folioStore.year,
    periodo: folioStore.periodNumber,
    id_verifier: (router.currentRoute.value.params.id as string),
    lotes: state.value.assigments.map(assigment => {
      return {
        ...assigment,
        folio_final: Number(assigment.folio_final),
        folio_inicial: Number(assigment.folio_inicial)
      }
    })
  }, 'Asignando folios...')

  await alert(error ? 'Error' : 'Operación exitosa', message, { type: error ? 'negative' : 'positive' })
  if (!error) {
    resetAssigment();
    await nextTick();
    assigmentFormRef.value?.resetValidation();
    tableAssigment.value?.refresh();
  }
}

async function cancelAssign(row: { id: string, fecha_expiracion: string }) {
  if (!validateExpiration(row.fecha_expiracion)) return;
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
  } = await make(`verifier/users/${(router.currentRoute.value.params.id as string)}/cancel-assignment`, 'DELETE', {
    id: row.id,
    motivo_cancelacion: value
  });
  void alert(!error ? 'Cancelado' : 'Error al cancelar', message, { type: !error ? 'positive' : 'negative' })
  if (!error) {
    tableAssigment.value?.refresh();
  }
}

function resetAssigment() {
  state.value.assigments = [createEmptyAssigment()];
}

async function handleExport() {
  const data = await file(`verifier/users/${(router.currentRoute.value.params.id as string)}/export-assignments`, 'GET', {}, 'Exportando asignaciones...');
  if (data.type == 'application/json') {
    void alert('Error al exportar', 'Ha ocurrido un error al exportar las asignaciones', { type: 'negative' })
  } else {
    utils.downloadBlob(data.data, 'asignaciones', 'xlsx')
  }
}

onMounted(() => {
  if (router.currentRoute.value.params.id) {
    void verificadorStore.getUser(router.currentRoute.value.params.id as string);
  }
})

</script>

<style scoped lang="scss">
.summary-container {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  height: 100%;
  gap: 16px;
}
</style>

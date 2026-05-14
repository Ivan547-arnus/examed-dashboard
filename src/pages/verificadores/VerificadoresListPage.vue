<template>
  <q-page padding class="extended">
    <q-card v-bind="$theme.card" class="bg-transparent no-shadow">
      <q-card-section class="q-px-none">
        <div class="row q-col-gutter-md justify-between">
          <q-input class="col-12 col-sm-5" v-bind="$theme.input" v-model="search" label="Buscar..." dense clearable
            clear-icon="sym_o_close">
            <template #append>
              <q-icon name="sym_o_search"></q-icon>
            </template>
          </q-input>
          <div>
            <q-btn v-bind="$theme.btn" icon="sym_o_add" color="dark" label="Nuevo verificador" text-color="secondary"
              @click="verifierFormRef?.open()"></q-btn>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <q-card v-bind="$theme.card" class="full-width">
      <q-table-component ref="table" url="/verifier/users" :search="search" class="border-xs-radius"
        table-header-class="text-h6 bg-primary text-secondary" :columns="columns">
        <template #no-data>
          <div class="no-items text-primary">
            <q-avatar v-bind="$theme.avatar" color="grey-3" size="78px">
              <q-icon name="sym_o_info" color="primary" size="1.25em"></q-icon>
            </q-avatar>
            <span class="text-h6">{{ search?.length ? `Oops, aun no existen verificadores para "${search}"` : 'Oops, aun no existen verificadores' }}</span>
            <q-btn outline v-bind="$theme.btn" @click="verifierFormRef?.open()" icon="sym_o_add" color="primary"
              label="Nuevo verificador"></q-btn>
          </div>
        </template>

        <template #body-cell-cal_medida_vol="props">
          <q-td key="cal_termometro" :props="props">
            <q-chip v-bind="formatRemainingDays(props.row.verifier_data?.medida?.fecha_vencimiento)" />
          </q-td>
        </template>
        <template #body-cell-cal_termometro="props">
          <q-td key="cal_medida_vol" :props="props">
            <q-chip v-bind="formatRemainingDays(props.row.verifier_data?.termometro?.fecha_vencimiento)" />
          </q-td>
        </template>
        <template #body-cell-actions="props">
          <q-td key="actions" :props="props">
            <q-btn v-bind="$theme.btnIcon" flat round color="grey-9" icon="sym_o_more_vert">
              <q-menu v-bind="$theme.menu">
                <q-list separator class="border-xs-radius">
                  <q-item clickable v-ripple class="text-dark" :to="`/verificadores/editar/${props.row.id}`">
                    <q-item-section avatar>
                      <q-icon name="sym_o_edit_square" color="dark"></q-icon>
                    </q-item-section>
                    <q-item-section class="text-no-wrap">Actualizar datos personales</q-item-section>
                  </q-item>
                  <q-item clickable v-ripple class="text-dark" :to="`/verificadores/asignacion-folios/${props.row.id}`">
                    <q-item-section avatar>
                      <q-icon name="sym_o_license" color="dark"></q-icon>
                    </q-item-section>
                    <q-item-section class="text-no-wrap">Asignación de folios</q-item-section>
                  </q-item>
                  <q-item clickable v-ripple class="text-dark"
                    :to="`/verificadores/configuracion-equipo/${props.row.id}`">
                    <q-item-section avatar>
                      <q-icon name="sym_o_manufacturing" color="dark"></q-icon>
                    </q-item-section>
                    <q-item-section class="text-no-wrap">Configuración de equipo</q-item-section>
                  </q-item>
                  <q-item clickable v-ripple class="text-negative" @click="handleDelete(props.row.id)">
                    <q-item-section avatar>
                      <q-icon name="sym_o_delete" color="negative"></q-icon>
                    </q-item-section>
                    <q-item-section>Eliminar verificador</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-td>
        </template>
      </q-table-component>
    </q-card>
    <VerificadorFormModal ref="verifierFormRef" v-model="showFormModal" @saved="onSaved"></VerificadorFormModal>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import VerificadorFormModal from './VerificadorFormModal.vue';
import type { IUser } from 'src/types/IUser';
import QTableComponent from 'src/components/QTableComponent.vue';
import { alert, question } from 'src/config/dialog';
import { theme } from 'src/boot/helpers';
import { make } from 'src/boot/axios';
import dayjs from 'dayjs';
const verifierFormRef = ref<null | { open: () => void }>(null);
const showFormModal = ref(false);
const search = ref('');
const table = ref<null | { refresh: () => void }>(null);
const columns = [
  {
    name: 'name',
    field: 'name',
    label: 'Nombre',
    align: 'left',
    searchable: true,
    sortable: true
  },
  {
    name: 'lastname',
    field: 'lastname',
    label: 'Primer apellido',
    align: 'left',
    searchable: true,
    sortable: false
  },
  {
    name: 'second_lastname',
    field: (row: IUser) => row.second_lastname ?? '-',
    label: 'Segundo apellido',
    align: 'left',
    searchable: true,
    sortable: false
  },
  {
    name: 'username',
    field: 'username',
    label: 'Nombre de usuario',
    align: 'left',
    color: 'primary',
    searchable: true,
    sortable: false
  },
  {
    name: 'email',
    field: 'email',
    label: 'Email',
    align: 'left',
    color: 'primary',
    sortable: false
  },
  {
    name: 'phone',
    field: (row: IUser) => row.phone ?? '-',
    label: 'Teléfono',
    align: 'left',
    color: 'primary',
    sortable: false
  },
  {
    name: 'cal_medida_vol',
    field: 'cal_medida_vol',
    label: 'Cal. Medida vol.',
    align: 'left',
    color: 'primary',
    sortable: false
  },
  {
    name: 'cal_termometro',
    field: 'cal_termometro',
    label: 'Cal. Termometro',
    align: 'left',
    color: 'primary',
    sortable: false
  },
  {
    name: 'actions',
    field: 'actions',
    label: 'Acciones',
    align: 'right',
    sortable: false
  }
];

function formatRemainingDays(fechaVencimiento: null | string) {
  if (!fechaVencimiento) {
    return {
      color: 'grey-3',
      textColor: 'grey-9',
      dense: true,
      label: 'Sin calibraciones'
    }
  }

  const today = dayjs();
  const remainingDays = dayjs(fechaVencimiento).diff(today, 'days');

  if (remainingDays < 30) {
    return {
      color: 'red-1',
      textColor: 'red-9',
      dense: true,
      label: remainingDays < 0 ? `Vencio hace ${Math.abs(remainingDays)} dias` : `Vence en ${Math.abs(remainingDays)} dias`
    }
  }

  if (remainingDays < 90) {
    return {
      remainingDays,
      color: 'yellow-1',
      textColor: 'yellow-9',
      dense: true,
      label: `Vence en ${Math.abs(remainingDays)} dias`
    }
  }

  return {
    remainingDays,
    color: 'green-1',
    textColor: 'green-9',
    dense: true,
    label: `Vence en ${Math.abs(remainingDays)} dias`
  }
}

function onSaved() {
  table.value?.refresh();
}

async function handleDelete(id: string) {
  const answer = await question('Eliminar usuario', '<p class="text-bold q-ma-none q-mb-xs">¿Seguro que desea continuar?</p> El verificador se eliminará permanentemente', {
    type: 'negative',
    icon: 'sym_o_warning',
    ok: {
      ...theme.btn,
      label: 'Eliminar',
      color: 'negative',
    }
  });
  if (!answer) return;
  const {
    data: {
      error,
      message
    }
  } = await make(`/admin/users/${id}`, 'DELETE');
  void alert(!error ? 'Eliminado' : 'Error al eliminar', message, { type: !error ? 'positive' : 'negative' })
  if (!error) {
    table.value?.refresh();
  }
}
</script>

<style lang="scss" scoped>
.no-items {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  align-items: center;
  margin-top: 27.5vh;
  margin-bottom: 27.5vh;
}
</style>

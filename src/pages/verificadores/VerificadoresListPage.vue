<template>
  <q-page padding>
    <q-card v-bind="$theme.card" class="bg-primary">
      <q-card-section>
        <div class="row q-col-gutter-md justify-end">
          <q-input class="col-12 col-sm-3" v-bind="$theme.input" v-model="search" label="Buscar..." dense clearable
            clear-icon="sym_o_close">
            <template #append>
              <q-icon name="sym_o_search"></q-icon>
            </template>
          </q-input>
          <div>
            <q-btn
              v-bind="$theme.btn"
              icon="sym_o_add"
              color="grey-3"
              label="Nuevo verificador"
              text-color="primary"
              @click="verifierFormRef?.open()"
            ></q-btn>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <q-card v-bind="$theme.card" class="full-width q-mt-md">
      <q-table-component ref="table" url="/verifier/users" :search="search" class="border-xs-radius"
        table-header-class="text-h6 bg-grey-3 text-dark" :columns="columns">
        <template #no-data>
          <div class="no-items text-primary">
            <q-avatar v-bind="$theme.avatar" color="primary" size="78px">
              <q-icon name="sym_o_info" color="white" size="1.75em"></q-icon>
            </q-avatar>
            <span class="text-h6">{{ search?.length ? `Oops, aun no existen verificadores para "${search}"` : 'Oops, aun no existen verificadores' }}</span>
            <q-btn outline v-bind="$theme.btn" @click="verifierFormRef?.open()" icon="sym_o_add" color="primary"
              label="Nuevo verificador"></q-btn>
          </div>
        </template>
        <template #body-cell-actions="props">
          <q-td key="actions" :props="props">
            <q-btn v-bind="$theme.btnIcon" flat round color="grey-9" icon="sym_o_more_vert">
              <q-menu v-bind="$theme.menu">
                <q-list separator class="border-xs-radius">
                  <q-item clickable v-ripple class="text-dark" :to="`/verificadores/editar/${props.row.id}`">
                    <q-item-section avatar>
                      <q-icon name="sym_o_manufacturing" color="dark"></q-icon>
                    </q-item-section>
                    <q-item-section class="text-no-wrap">Configurar verificador</q-item-section>
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
import { useRouter } from 'vue-router';
import type { IUser } from 'src/types/IUser';
import QTableComponent from 'src/components/QTableComponent.vue';
import { alert, question } from 'src/config/dialog';
import { theme } from 'src/boot/helpers';
import { make } from 'src/boot/axios';
const router = useRouter();
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
    field: (row:IUser) => row.second_lastname ?? '-',
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
    field: (row:IUser) => row.phone ?? '-',
    label: 'Teléfono',
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
function onSaved(data:IUser) {
  void router.push('/verificadores/editar/' + data.id);
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

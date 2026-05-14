<template>
  <q-page padding class="extended">
    <q-card v-bind="$theme.card" class="bg-transparent no-shadow">
      <q-card-section class="q-px-none">
        <div class="row justify-between">
          <q-input class="col-12 col-sm-5" v-bind="$theme.input" v-model="search" label="Buscar..." dense clearable
            clear-icon="sym_o_close">
            <template #append>
              <q-icon name="sym_o_search"></q-icon>
            </template>
          </q-input>
          <div>
            <q-btn v-bind="$theme.btn" class="col-12 col-sm-4" to="/administradores/nuevo" icon="sym_o_add"
              color="dark" label="Nuevo administrador" text-color="secondary"></q-btn>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <q-card v-bind="$theme.card" class="full-width">
      <q-table-component ref="table" :loading="loading" url="/admin/users" :search="search" class="border-xs-radius"
        table-header-class="text-h6 bg-primary text-secondary" :columns="columns">
        <template #no-data>
          <div class="no-items text-primary" v-if="!loading">
            <q-avatar v-bind="$theme.avatar" color="grey-3" size="78px">
              <q-icon name="sym_o_info" color="primary" size="1.25em"></q-icon>
            </q-avatar>
            <span class="text-h6">{{ search?.length ? `Oops, aun no existen administradores para "${search}"` : 'Oops, aun no existen administradores' }}</span>
            <q-btn outline v-bind="$theme.btn" to="/administradores/nuevo" icon="sym_o_add" color="primary"
              label="Nuevo administrador"></q-btn>
          </div>
        </template>
        <template #body-cell-actions="props">
          <q-td key="actions" :props="props">
            <q-btn v-bind="$theme.btnIcon" flat round color="grey-9" icon="sym_o_more_vert">
              <q-menu v-bind="$theme.menu">
                <q-list separator class="border-xs-radius">
                  <q-item clickable v-ripple class="text-dark" :to="`/administradores/editar/${props.row.id}`">
                    <q-item-section avatar>
                      <q-icon name="sym_o_edit_square" color="dark"></q-icon>
                    </q-item-section>
                    <q-item-section>Editar administrador</q-item-section>
                  </q-item>
                  <q-item clickable v-ripple class="text-negative" @click="handleDelete(props.row.id)">
                    <q-item-section avatar>
                      <q-icon name="sym_o_delete" color="negative"></q-icon>
                    </q-item-section>
                    <q-item-section>Eliminar administrador</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-td>
        </template>
      </q-table-component>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { make } from 'src/boot/axios';
import { theme } from 'src/boot/helpers';
import QTableComponent from 'src/components/QTableComponent.vue';
import { alert, question } from 'src/config/dialog';
import { ref } from 'vue';
const search = ref('')
const loading = ref(false)
const table = ref<{ refresh: () => void } | null>(null);
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
    searchable: true,
    align: 'left',
    sortable: false
  },
  {
    name: 'second_lastname',
    field: 'second_lastname',
    label: 'Segundo apellido',
    searchable: true,
    align: 'left',
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
    field: 'phone',
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

async function handleDelete(id: string) {
  const answer = await question('Eliminar usuario', '<p class="text-bold q-ma-none q-mb-xs">¿Seguro que desea continuar?</p> El administrador se eliminará permanentemente', {
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

<style scoped lang="scss">
.new-item {
  max-width: 240px;
  width: 100%;
  height: 320px;
  background-color: $accent;
  border-radius: 12px;
  border: 1px dashed $primary;
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

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

@media (max-width: $breakpoint-sm-min) {
  .no-items {
    width: 100%;
    max-width: unset;
  }

  .new-item {
    width: 100%;
    max-width: unset;
  }
}
</style>

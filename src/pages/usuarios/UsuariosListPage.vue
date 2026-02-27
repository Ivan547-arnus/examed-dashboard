<template>
  <q-page padding class="container">
    <div class="flex q-gutter-md">
      <q-input v-bind="$theme.input" style="width: 280px;" v-model="search" label="Buscar..." dense clearable clear-icon="bi-x">
        <template #append>
          <q-icon name="bi-search"></q-icon>
        </template>
      </q-input>
      <q-btn v-bind="$theme.btn" to="/usuarios/nuevo" icon="bi-plus" color="primary" text-color="secondary">Crear
        Usuario</q-btn>
    </div>
    <q-card class="bg-transparent no-shadow" style="width: 100%;">
      <q-table-component ref="table" url="/admin/users" :search="search" table-header-class="text-h6" style="width: 100%;" :columns="columns"
        class="bg-transparent no-shadow">
        <template #no-data>
          <div class="no-items text-primary">
            <span class="text-h4">Aun no existen usuarios</span>
            <q-btn v-bind="$theme.btn" to="/usuarios/nuevo" icon="bi-plus" color="primary" text-color="secondary">Crear Usuario</q-btn>
          </div>
        </template>
        <template #body="props">
          <q-tr :props="props">
            <q-td key="name" :props="props">
              <div>
                {{ props.row.name }}
              </div>
            </q-td>
            <q-td key="last_name" :props="props">
              <div>
                {{ props.row.last_name }}
              </div>
            </q-td>
            <q-td key="email" :props="props">
              <div>
                {{ props.row.email }}
              </div>
            </q-td>
            <q-td key="actions" :props="props">
              <div class="flex justify-center">
                <q-btn v-bind="$theme.btnIcon" icon="bi-pencil-square" color="primary" text-color="secondary"
                  :to="`/usuarios/editar/${props.row.id}`"></q-btn>
                <q-btn v-bind="$theme.btnIcon" @click="handleDelete(props.row.id)" icon="bi-trash" color="negative" text-color="white"></q-btn>
              </div>
            </q-td>
          </q-tr>
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
const table = ref<{ refresh: () => void } | null>(null);
const columns = [
  {
    name: 'name',
    field: 'name',
    label: 'Nombre',
    align: 'center',
    sortable: true
  },
  {
    name: 'last_name',
    field: 'last_name',
    label: 'Apellidos',
    align: 'center',
    sortable: false
  },
  {
    name: 'email',
    field: 'email',
    label: 'Email',
    align: 'center',
    color: 'primary',
    sortable: false
  },
  {
    name: 'actions',
    field: 'actions',
    label: 'Acciones',
    align: 'center',
    sortable: false
  }
];

async function handleDelete(id: string) {
  const answer = await question('¿Eliminar usuario?', 'El usuario se eliminara permanentemente', {
    type:'negative',
    icon: 'bi-exclamation-circle',
    ok: {
      ...theme.btn,
      label: 'Eliminar',
      color: 'negative',
    }
  });
  if(!answer) return;
  const {
    data: {
      error,
      message
    }
  } = await make(`/admin/users/${id}`, 'DELETE');
  void alert(!error ? 'Eliminado': 'Error al eliminar', message, { type: !error ? 'positive' : 'negative' })
  if(!error) {
    table.value?.refresh();
  }
}
</script>

<style scoped lang="scss">
.container {
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-columns: 1fr;
  gap: 16px;
  width: 100%;
  justify-items: flex-end;
}

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
  cursor: pointer;
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

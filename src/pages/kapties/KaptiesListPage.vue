<template>
  <q-page padding class="container">
    <div class="flex q-gutter-md">
      <q-input v-bind="$theme.input" style="width: 280px;" v-model="search" label="Buscar..." dense clearable clear-icon="bi-x">
        <template #append>
          <q-icon name="bi-search"></q-icon>
        </template>
      </q-input>
      <q-btn v-bind="$theme.btn" to="/kapties/nuevo" icon="bi-plus" color="primary" text-color="secondary">Crear
        Kaptie</q-btn>
    </div>
    <q-card class="bg-transparent no-shadow" style="width: 100%;">
      <q-table-component ref="table" url="/kapties" :search="search" table-header-class="text-h6" style="width: 100%;" :columns="columns"
        class="bg-transparent no-shadow">
        <template #no-data>
          <div class="no-items text-primary">
            <span class="text-h4">Aun no tienes kapties</span>
            <q-btn v-bind="$theme.btn" to="/kapties/nuevo" icon="bi-plus" color="primary" text-color="secondary">Crear
              Kaptie</q-btn>
          </div>
        </template>
        <template #body="props">
          <q-tr :props="props">
            <q-td key="marker" :props="props">
              <div>
                <q-img v-if="props.row.marker_uuid" no-spinner style="max-height: 60px; max-width: 60px" fit="cover" class="border-md-radius" :src="$filters.imageUrl(props.row.marker_uuid)" />
                <q-icon v-else name="bi-image" color="grey-4" size="md"></q-icon>
              </div>
            </q-td>
            <q-td key="title" :props="props" class="be-vietnam-pro-bold">
              <div>
                {{ props.row.title }}
              </div>
            </q-td>
            <q-td key="description" :props="props">
              <div>
                {{ props.row.description }}
              </div>
            </q-td>
            <q-td key="status" :props="props">
              <div>
                <q-chip v-if="props.row.status == 'draft'" class="be-vietnam-pro-bold" color="grey-4" text-color="dark">
                  Borrador
                </q-chip>
              </div>
            </q-td>
            <q-td key="created_at" :props="props">
              <div>
                {{ $filters.dateTime(props.row.created_at) }}
              </div>
            </q-td>
            <q-td key="actions" :props="props">
              <div class="flex justify-center">
                <q-btn v-bind="$theme.btnIcon" icon="bi-qr-code" color="primary" text-color="secondary"
                  :href="$filters.imageUrl(props.row.qr_code.uuid)" target="_blank"></q-btn>
                <q-btn v-bind="$theme.btnIcon" icon="bi-pencil-square" color="primary" text-color="secondary"
                  :to="`/kapties/editar/${props.row.id}`"></q-btn>
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
    name: 'marker',
    field: 'marker',
    label: 'Portada',
    align: 'center',
    sortable: false
  },
  {
    name: 'title',
    field: 'title',
    label: 'Titulo',
    align: 'center',
    sortable: true
  },
  {
    name: 'description',
    field: 'description',
    label: 'Descripción',
    align: 'center',
    sortable: false
  },
  {
    name: 'status',
    field: 'status',
    label: 'Estatus',
    align: 'center',
    color: 'primary',
    sortable: false
  },
  {
    name: 'created_at',
    field: 'created_at',
    label: 'Fecha de creación',
    align: 'center',
    color: 'primary',
    sortable: true
  },
  {
    name: 'actions',
    field: 'actions',
    label: 'Acciones',
    align: 'center',
    color: 'primary',
    sortable: false
  },
];

async function handleDelete(id: string) {
  const answer = await question('¿Eliminar kaptie?', 'El Kaptie se eliminara permanentemente', {
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
  } = await make(`kapties/${id}`, 'DELETE');
  void alert(error ? 'Eliminado': 'Error al eliminar', message)
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

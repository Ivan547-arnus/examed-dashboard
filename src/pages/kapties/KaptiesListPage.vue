<template>
  <q-page padding class="container">
    <div class="flex q-gutter-md">
      <q-input v-bind="$theme.input" style="width: 280px;" v-model="search" label="Buscar..." dense clearable
        clear-icon="bi-x">
        <template #append>
          <q-icon name="bi-search"></q-icon>
        </template>
      </q-input>
      <q-btn v-bind="$theme.btn" to="/kapties/nuevo" icon="bi-plus" color="primary" text-color="secondary">Crear
        Kaptie</q-btn>
    </div>
    <q-card class="bg-transparent no-shadow" style="width: 100%;">
      <q-table-component ref="table" row-key="id" url="/kapties" :search="search" table-header-class="text-h6"
        style="width: 100%;" :columns="columns" class="bg-transparent no-shadow kapties-table" grid hide-header>
        <template #no-data>
          <div class="no-items text-primary">
            <q-icon color="grey-6" name="bi-exclamation-triangle" size="120px"></q-icon>
            <span class="text-h4">Aun no tienes kapties</span>
            <q-btn v-bind="$theme.btn" to="/kapties/nuevo" icon="bi-plus" color="primary" text-color="secondary">Crear
              Kaptie</q-btn>
          </div>
        </template>
        <template #item="props">
          <div class="q-pa-sm col-12 col-sm-6 col-md-4 col-xl-3">
            <q-card class="kaptie-card">
              <div v-if="props.row.marker_uuid" class="kaptie-card__media">
                <q-img no-spinner fit="contain" class="kaptie-card__image"
                  :src="$filters.imageUrl(props.row.marker_uuid)" />
              </div>
              <div v-else class="kaptie-card__media kaptie-card__media--placeholder">
                <q-icon name="bi-image" color="grey-5" size="48px"></q-icon>
              </div>

              <q-card-section class="q-pb-sm">
                <div class="flex justify-between items-center q-gutter-sm">
                  <div class="text-h5 text-primary kaptie-card__title">
                    {{ props.row.title }}
                  </div>
                  <q-select v-bind="$theme.input" v-model="props.row.status" @update:model-value="(value) => handleChangeStatus(props.row, value)" :options="statusOptions" emit-value
                    map-options dense class="kaptie-card__status" />
                </div>

                <p class="kaptie-card__description text-normal text-primary q-mt-sm q-mb-md">
                  {{ props.row.description || 'Sin descripción' }}
                </p>
                <p class="text-normal text-primary q-my-none">
                  Visitado: 0
                </p>

                <div class="text-caption text-grey-7">
                  Creado: {{ $filters.dateTime(props.row.created_at) }}
                </div>
              </q-card-section>

              <q-separator></q-separator>

              <q-card-actions align="between" class="kaptie-card__actions">
                <q-btn v-bind="$theme.btnIcon" icon="bi-qr-code" color="primary" text-color="secondary"
                  :href="$filters.imageUrl(props.row.qr_code.uuid)" target="_blank"></q-btn>
                <q-btn v-bind="$theme.btnIcon" icon="bi-pencil-square" color="primary" text-color="secondary"
                  :to="`/kapties/editar/${props.row.id}`"></q-btn>
                <q-btn v-bind="$theme.btnIcon" @click="handleDelete(props.row.id)" icon="bi-trash" color="negative"
                  text-color="white"></q-btn>
              </q-card-actions>
            </q-card>
          </div>
        </template>
      </q-table-component>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { Notify } from 'quasar';
import { make } from 'src/boot/axios';
import { theme } from 'src/boot/helpers';
import QTableComponent from 'src/components/QTableComponent.vue';
import { alert, question } from 'src/config/dialog';
import type { IKaptie } from 'src/types/IKaptie';
import { ref } from 'vue';
const search = ref('')
const table = ref<{ refresh: () => void } | null>(null);
const statusOptions = [
  { label: 'Borrador', value: 'draft' },
  { label: 'Publicado', value: 'published' }
];
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

async function handleChangeStatus(row: IKaptie, value:string) {
  const {
    data: {
      error,
      message
    }
  } = await make(`kapties/${row.id}/change-status`, 'PUT', { status: value });
  if (error) {
    void alert(!error ? 'Actualizado' : 'Error al actualizar', message)
  } else {
    Notify.create({
      type: 'positive',
      message,
      classes: 'border-md-radius'
    });
  }
}

async function handleDelete(id: string) {
  const answer = await question('¿Eliminar kaptie?', 'El Kaptie se eliminara permanentemente', {
    type: 'negative',
    icon: 'bi-exclamation-circle',
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
  } = await make(`kapties/${id}`, 'DELETE');
  void alert(error ? 'Eliminado' : 'Error al eliminar', message)
  if (!error) {
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
  min-height: 620px;
}

.kaptie-card {
  height: 100%;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 12px 30px rgba(14, 52, 90, 0.08);
}

.kaptie-card__media {
  height: 180px;
  background-color: $grey-2;
}

.kaptie-card__media--placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
}

.kaptie-card__image {
  width: 100%;
  height: 100%;
}

.kaptie-card__title {
  flex: 1;
  line-height: 1.2;
}

.kaptie-card__status {
  min-width: 140px;
}

.kaptie-card__description {
  min-height: 66px;
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.kaptie-card__actions {
  padding: 12px 16px 16px;
  justify-content: flex-end;
  gap: 8px;
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

  .kaptie-card__media {
    height: 160px;
  }
}
</style>

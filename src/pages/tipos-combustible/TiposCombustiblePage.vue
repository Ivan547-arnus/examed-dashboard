<template>
  <q-page padding class="extended">
    <q-card v-bind="$theme.card" class="bg-transparent no-shadow">
      <q-card-section class="q-px-none">
        <div class="row q-col-gutter-md justify-between items-center">
          <q-input
            v-bind="$theme.input"
            v-model="search"
            class="col-12 col-sm-5"
            label="Buscar..."
            dense
            clearable
          >
            <template #append>
              <q-icon name="sym_o_search"></q-icon>
            </template>
          </q-input>
          <div class="col-12 col-sm-auto">
            <q-btn
              v-bind="$theme.btn"
              color="dark"
              text-color="secondary"
              icon="sym_o_add"
              label="Nuevo tipo"
              @click="() => openFuelTypeDialog()"
            ></q-btn>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card v-bind="$theme.card" class="full-width bg-transparent no-shadow">
      <q-table-component
        ref="tableRef"
        v-model:loading="loading"
        v-model:pagination="pagination"
        :search="search"
        :columns="columns"
        url="/fuel-types/get-all"
        grid
        hide-header
        class="border-xs-radius"
        table-header-class="text-h6 bg-primary text-secondary"
      >
        <template #no-data>
          <q-card v-bind="$theme.card" class="full-width bg-transparent no-shadow">
            <q-card-section class="column items-center text-center q-py-xl">
              <q-avatar
                v-bind="$theme.avatar"
                color="grey-1"
                text-color="primary"
                size="78px"
                icon="sym_o_info"
              ></q-avatar>
              <div class="text-h6 q-mt-md">
                {{
                  search?.length
                    ? `Oops, aun no existen tipos para "${search}"`
                    : "Oops, aun no existen tipos de combustible"
                }}
              </div>
              <q-btn
                v-bind="$theme.btn"
                outline
                color="primary"
                icon="sym_o_add"
                label="Nuevo tipo"
                class="q-mt-md"
                @click="() => openFuelTypeDialog()"
              ></q-btn>
            </q-card-section>
          </q-card>
        </template>

        <template #item="props">
          <div class="q-pa-xs col-12 col-sm-6 col-md-4 col-lg-3">
            <q-card v-bind="$theme.card" class="full-height">
              <q-card-section>
                <q-list bordered separator class="border-md-radius">
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="sym_o_tag" color="primary"></q-icon>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption>Identificador</q-item-label>
                      <q-item-label>#{{ props.row.id }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="sym_o_local_gas_station" color="primary"></q-icon>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption>Nombre</q-item-label>
                      <q-item-label>{{ props.row.nombre }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>

              <q-separator></q-separator>
              <q-card-actions align="right" class="q-pa-md">
                <q-btn
                  v-bind="$theme.btn"
                  flat
                  color="primary"
                  icon="sym_o_edit_square"
                  label="Editar"
                  @click="() => openFuelTypeDialog(props.row)"
                ></q-btn>
                <q-btn
                  v-bind="$theme.btn"
                  flat
                  color="negative"
                  icon="sym_o_delete"
                  label="Eliminar"
                  @click="() => handleDelete(props.row)"
                ></q-btn>
              </q-card-actions>
            </q-card>
          </div>
        </template>
      </q-table-component>
    </q-card>

    <TipoCombustibleFormDialog ref="fuelTypeDialogRef" @saved="onSaved" />
  </q-page>
</template>

<script lang="ts" setup>
import { make } from "src/boot/axios";
import { theme } from "src/boot/helpers";
import QTableComponent from "src/components/QTableComponent.vue";
import { alert, question } from "src/config/dialog";
import { useUtilsStore } from "src/stores/utils-store";
import type { IFuelType } from "src/types/IStation";
import { ref } from "vue";
import TipoCombustibleFormDialog from "./TipoCombustibleFormDialog.vue";

const utilsStore = useUtilsStore();
const search = ref("");
const loading = ref(false);
const tableRef = ref<{ refresh: () => void } | null>(null);
const fuelTypeDialogRef = ref<InstanceType<
  typeof TipoCombustibleFormDialog
> | null>(null);
const pagination = ref({
  page: 1,
  rowsPerPage: 12,
  sortBy: null,
  descending: false,
  rowsNumber: 0,
});
const columns = [
  {
    name: "id",
    field: "id",
    label: "ID",
    align: "left",
    searchable: false,
    sortable: true,
  },
  {
    name: "nombre",
    field: "nombre",
    label: "Nombre",
    align: "left",
    searchable: true,
    sortable: true,
  },
  {
    name: "actions",
    field: "actions",
    label: "Acciones",
    align: "right",
    searchable: false,
    sortable: false,
  },
];

function openFuelTypeDialog(fuelType?: IFuelType) {
  void fuelTypeDialogRef.value?.open(fuelType);
}

async function onSaved() {
  tableRef.value?.refresh();
  await utilsStore.fetchFuelTypes();
}

async function handleDelete(fuelType: IFuelType) {
  const answer = await question(
    "Eliminar",
    `<p class="text-bold q-ma-none q-mb-xs">¿Seguro que desea continuar?</p>El tipo de combustible "${fuelType.nombre}" se eliminará permanentemente.`,
    {
      type: "negative",
      icon: "sym_o_warning",
      ok: {
        ...theme.btn,
        label: "Eliminar",
        color: "negative",
      },
    },
  );

  if (!answer) return;

  const {
    data: { error, message },
  } = await make(`/fuel-types/${fuelType.id}`, "DELETE", {}, "Eliminando...");

  await alert(error ? "Error al eliminar" : "Eliminado", message, {
    type: error ? "negative" : "positive",
  });

  if (!error) {
    tableRef.value?.refresh();
    await utilsStore.fetchFuelTypes();
  }
}
</script>

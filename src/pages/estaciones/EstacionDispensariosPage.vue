<template>
  <q-page padding class="extended">
    <div class="row q-col-gutter-md q-mb-md items-center justify-between">
      <div class="col-12 col-md-auto">
        <q-btn
          v-bind="$theme.btn"
          label="Regresar"
          color="grey-3"
          text-color="primary"
          icon="sym_o_arrow_back"
          @click="() => void router.push('/estaciones')"
        ></q-btn>
      </div>
      <div class="col-12 col-md-auto flex q-gutter-md justify-end">
        <q-btn
          v-bind="$theme.btn"
          outline
          color="primary"
          icon="sym_o_edit_square"
          label="Editar estación"
          :to="`/estaciones/editar/${$router.currentRoute.value.params.id}`"
        ></q-btn>
        <q-btn
          v-bind="$theme.btn"
          color="primary"
          text-color="secondary"
          icon="sym_o_add"
          label="Nuevo dispensario"
          @click="() => openDispenserDialog()"
        ></q-btn>
      </div>
    </div>

    <q-card v-bind="$theme.card" class="q-mb-md">
      <q-item class="bg-primary text-secondary">
        <q-item-section avatar>
          <q-avatar
            v-bind="$theme.avatar"
            color="secondary"
            text-color="primary"
            icon="sym_o_local_gas_station"
          ></q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-h5">Dispensarios</q-item-label>
          <q-item-label caption class="text-grey-2">
            {{ stationStore.station.razon_social }} -
            {{ stationStore.station.cre }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-chip
            class="border-md-radius"
            color="secondary"
            text-color="primary"
            icon="sym_o_sensors"
            square
          >
            {{ dispensers.length }} registrados
          </q-chip>
        </q-item-section>
      </q-item>
    </q-card>

    <div v-if="dispensers.length" class="row q-col-gutter-md">
      <div
        v-for="dispenser in dispensers"
        :key="dispenser.id"
        class="col-12 col-sm-6 col-md-4"
      >
        <q-card v-bind="$theme.card" class="full-height">
          <q-item class="bg-primary">
            <q-item-section avatar>
              <q-avatar
                v-bind="$theme.avatar"
                color="secondary"
                text-color="primary"
                icon="sym_o_local_gas_station"
              ></q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-h6 text-secondary">
                {{ dispenser.marca }}
              </q-item-label>
              <q-item-label caption class="text-grey-3">
                {{ dispenser.modelo }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn
                v-bind="$theme.btnIcon"
                color="secondary"
                flat
                round
                icon="sym_o_more_vert"
              >
                <q-menu v-bind="$theme.menu">
                  <q-list separator>
                    <q-item
                      clickable
                      v-ripple
                      v-close-popup
                      @click="() => openDispenserDialog(dispenser)"
                    >
                      <q-item-section avatar>
                        <q-icon name="sym_o_edit_square"></q-icon>
                      </q-item-section>
                      <q-item-section>Editar dispensario</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-ripple
                      v-close-popup
                      class="text-negative"
                      @click="deleteDispenser(dispenser)"
                    >
                      <q-item-section avatar>
                        <q-icon name="sym_o_delete" color="negative"></q-icon>
                      </q-item-section>
                      <q-item-section>Eliminar dispensario</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </q-item-section>
          </q-item>

          <q-card-section>
            <q-list bordered separator class="border-md-radius">
              <q-item>
                <q-item-section avatar>
                  <q-icon name="sym_o_tag" color="primary"></q-icon>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>No. serie</q-item-label>
                  <q-item-label>{{ dispenser.no_serie }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar>
                  <q-icon name="sym_o_approval" color="primary"></q-icon>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>No. aprobación</q-item-label>
                  <q-item-label>{{ dispenser.no_aprobacion }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar>
                  <q-icon name="sym_o_calendar_month" color="primary"></q-icon>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>Año aprobación</q-item-label>
                  <q-item-label>{{ dispenser.ano_aprobacion }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>

          <q-separator></q-separator>

          <q-card-section>
            <div class="row items-center q-mb-sm">
              <div class="col text-subtitle1 text-weight-medium">Mangueras</div>
              <div class="col-auto">
                <q-chip dense square color="grey-3" text-color="primary">
                  {{ dispenser.hoses.length }}
                </q-chip>
              </div>
            </div>
            <q-markup-table
              flat
              bordered
              separator="horizontal"
              class="border-md-radius"
            >
              <thead>
                <tr>
                  <th class="text-left">Manguera</th>
                  <th class="text-left">Tipo</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="hose in dispenser.hoses" :key="hose.id">
                  <td class="text-left">
                    <q-badge color="primary" text-color="secondary">
                      {{ hose.manguera }}
                    </q-badge>
                  </td>
                  <td class="text-left">{{ hose.fuel_type?.nombre }}</td>
                </tr>
              </tbody>
            </q-markup-table>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card v-else v-bind="$theme.card">
      <q-card-section class="column items-center text-center q-py-xl">
        <q-avatar
          v-bind="$theme.avatar"
          size="76px"
          color="grey-3"
          text-color="primary"
          icon="sym_o_local_gas_station"
        ></q-avatar>
        <div class="text-h6 q-mt-md">No hay dispensarios registrados</div>
        <div class="text-caption text-grey-7 q-mt-sm">
          Agrega el primer dispensario para configurar sus mangueras.
        </div>
        <q-btn
          v-bind="$theme.btn"
          class="q-mt-lg"
          color="primary"
          text-color="secondary"
          icon="sym_o_add"
          label="Nuevo dispensario"
          @click="() => openDispenserDialog()"
        ></q-btn>
      </q-card-section>
    </q-card>

    <EstacionDispenserFormDialog
      ref="dispenserDialogRef"
      :station-id="stationId"
      @saved="onDispenserSaved"
    />
  </q-page>
</template>

<script lang="ts" setup>
import { alert, question } from "src/config/dialog";
import { useStation } from "src/stores/station-store";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import EstacionDispenserFormDialog from "src/pages/estaciones/components/EstacionDispenserFormDialog.vue";
import type { IDispenser, IStation } from "src/types/IStation";
import { useUtilsStore } from "src/stores/utils-store";

const stationStore = useStation();
const router = useRouter();
const utilsStore = useUtilsStore();
const dispenserDialogRef = ref<InstanceType<
  typeof EstacionDispenserFormDialog
> | null>(null);
const stationId = computed(() => Number(router.currentRoute.value.params.id));
const dispensers = computed(() => {
  return (
    (stationStore.station as typeof stationStore.station & IStation)
      .dispensers ?? []
  );
});

async function loadStation() {
  const { error, message } = await stationStore.get(stationId.value, true);
  if (error) {
    await alert("Error", message, {
      type: "negative",
    });
    void router.push("/estaciones");
  }
}

function openDispenserDialog(dispenser?: IDispenser) {
  void dispenserDialogRef.value?.open(dispenser);
}

function onDispenserSaved() {
  void loadStation();
}

async function deleteDispenser(dispenser: IDispenser) {
  const answer = await question(
    "Eliminar dispensario",
    `<p class="text-bold q-ma-none q-mb-xs">¿Seguro que desea continuar?</p>El dispensario será eliminado de la estación actual.`,
    { type: "info" },
  );
  if (!answer) return;

  const { error, message } = await stationStore.deleteDispenser(dispenser.id!);
  await alert(error ? "Error" : "Éxito", message, {
    type: error ? "negative" : "positive",
  });
  void loadStation();
}

onMounted(() => {
  void loadStation();
  void utilsStore.fetchFuelTypes();
});
</script>

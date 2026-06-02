<template>
  <q-dialog v-model="model">
    <q-card v-bind="$theme.card" class="full-width" style="max-width: 760px">
      <q-item class="bg-primary text-secondary">
        <q-item-section>
          <q-item-label class="text-h5">
            {{ dispenserForm.id ? "Editar dispensario" : "Nuevo dispensario" }}
          </q-item-label>
          <q-item-label caption class="text-grey-2">
            {{
              dispenserForm.id
                ? "Actualiza la información del dispensario seleccionado"
                : "Captura la información del dispensario y sus mangueras"
            }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn
            v-bind="$theme.btnIcon"
            flat
            round
            color="secondary"
            icon="sym_o_close"
            @click="model = false"
          ></q-btn>
        </q-item-section>
      </q-item>

      <q-card-section>
        <q-form
          id="dispenser-form"
          ref="dispenserFormRef"
          class="row q-col-gutter-md"
          @submit.prevent="onSubmit"
        >
          <q-input
            v-bind="$theme.input"
            v-model="dispenserForm.marca"
            class="col-12 col-md-6"
            label="Marca"
            :rules="[$rules.required('Campo requerido')]"
          ></q-input>
          <q-input
            v-bind="$theme.input"
            v-model="dispenserForm.modelo"
            class="col-12 col-md-6"
            label="Modelo"
            :rules="[$rules.required('Campo requerido')]"
          ></q-input>
          <q-input
            v-bind="$theme.input"
            v-model="dispenserForm.no_serie"
            class="col-12 col-md-6"
            label="No. serie"
            :rules="[$rules.required('Campo requerido')]"
          ></q-input>
          <q-input
            v-bind="$theme.input"
            v-model="dispenserForm.no_aprobacion"
            class="col-12 col-md-6"
            label="No. aprobación"
            :rules="[$rules.required('Campo requerido')]"
          ></q-input>
          <q-input
            v-bind="$theme.input"
            v-model="dispenserForm.ano_aprobacion"
            class="col-12 col-md-6"
            label="Año aprobación"
            mask="####"
            :rules="[$rules.required('Campo requerido')]"
          ></q-input>

          <div class="col-12">
            <q-separator class="q-my-sm"></q-separator>
            <div class="row items-center q-mb-md">
              <div class="col">
                <div class="text-subtitle1 text-weight-medium">Mangueras</div>
                <div class="text-caption text-grey-7">
                  Agrega una manguera por posición y tipo de combustible.
                </div>
              </div>
              <div class="col-auto">
                <q-btn
                  v-bind="$theme.btn"
                  :disable="dispenserForm.hoses.length > 5"
                  outline
                  color="primary"
                  icon="sym_o_add"
                  label="Agregar manguera"
                  @click="addHose"
                ></q-btn>
              </div>
            </div>

            <q-list bordered separator class="border-md-radius">
              <q-item v-for="(hose, index) in dispenserForm.hoses" :key="index">
                <q-item-section>
                  <div class="row q-col-gutter-md">
                    <q-select
                      v-bind="$theme.input"
                      v-model="hose.manguera"
                      class="col-6"
                      label="Manguera"
                      :options="hoseOptions"
                      :rules="[$rules.required('Campo requerido')]"
                    ></q-select>
                    <q-select
                      v-bind="$theme.input"
                      v-model="hose.fuel_type"
                      class="col-6"
                      label="Tipo combustible"
                      option-label="nombre"
                      :options="utilsStore.fuelTypes"
                      :rules="[$rules.required('Campo requerido')]"
                    ></q-select>
                  </div>
                </q-item-section>
                <q-item-section side>
                  <q-btn
                    v-bind="$theme.btnIcon"
                    flat
                    round
                    color="negative"
                    icon="sym_o_delete"
                    :disable="dispenserForm.hoses.length === 1"
                    @click="removeHose(index)"
                  ></q-btn>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-form>
      </q-card-section>

      <q-separator></q-separator>
      <q-card-actions align="right" class="q-pa-md">
        <q-btn
          v-bind="$theme.btn"
          color="grey-3"
          text-color="primary"
          label="Cancelar"
          v-close-popup
        ></q-btn>
        <q-btn
          v-bind="$theme.btn"
          type="submit"
          form="dispenser-form"
          color="primary"
          text-color="secondary"
          icon="sym_o_save"
          :label="
            dispenserForm.id ? 'Actualizar dispensario' : 'Guardar dispensario'
          "
          :loading="saving"
        ></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { make } from "src/boot/axios";
import { alert, question } from "src/config/dialog";
import { nextTick, ref } from "vue";
import type { QForm } from "quasar";
import { hoseOptions, type IDispenser } from "src/types/IStation";
import { useUtilsStore } from "src/stores/utils-store";
const props = defineProps<{
  stationId: number;
}>();

const emit = defineEmits<{
  saved: [];
}>();

const model = ref(false);
const saving = ref(false);
const dispenserFormRef = ref<QForm | null>(null);
const dispenserForm = ref<IDispenser>(getDefaultDispenserForm());
const utilsStore = useUtilsStore();

function getDefaultDispenserForm(): IDispenser {
  return {
    marca: "",
    modelo: "",
    no_serie: "",
    no_aprobacion: "",
    ano_aprobacion: "",
    hoses: [
      {
        manguera: "A",
        fuel_type: null,
      },
    ],
  };
}

function addHose() {
  const nextHose = String.fromCharCode(65 + Math.min(dispenserForm.value.hoses.length, 5));
  dispenserForm.value.hoses.push({
    manguera: nextHose,
    fuel_type: null,
  });
}

function removeHose(index: number) {
  dispenserForm.value.hoses.splice(index, 1);
}

async function onSubmit() {
  const isValid = await dispenserFormRef.value?.validate();
  if (!isValid) return;

  const isEdition = Boolean(dispenserForm.value.id);
  const answer = await question(
    isEdition ? "Actualizar dispensario" : "Guardar dispensario",
    `<p class="text-bold q-ma-none q-mb-xs">¿Seguro que desea continuar?</p>El dispensario será ${isEdition ? "actualizado" : "agregado"} en la estación actual.`,
    { type: "info" },
  );

  if (!answer) return;

  try {
    saving.value = true;
    const {
      data: { error, message },
    } = await make(
      `/stations/${props.stationId}/dispensers${isEdition ? `/${dispenserForm.value.id}` : ""}`,
      isEdition ? "PUT" : "POST",
      {
        ...dispenserForm.value,
        hoses: dispenserForm.value.hoses.map((hose) => ({
          ...hose,
          id_fuel_type: hose.fuel_type?.id,
        })),
        id_station: props.stationId,
      },
      isEdition ? "Actualizando dispensario..." : "Guardando dispensario...",
    );

    await alert(error ? "Error" : "Operación exitosa", message, {
      type: error ? "negative" : "positive",
    });

    if (error) return;

    model.value = false;
    emit("saved");
  } catch (error) {
    console.error(error);
    await alert("Error", "No fue posible guardar el dispensario", {
      type: "negative",
    });
  } finally {
    saving.value = false;
  }
}

defineExpose({
  async open(dispenser?: IDispenser) {
    dispenserForm.value = dispenser
      ? {
          ...dispenser,
          hoses: dispenser.hoses.map((hose) => ({ ...hose })),
        }
      : getDefaultDispenserForm();
    model.value = true;
    await nextTick();
    dispenserFormRef.value?.resetValidation();
  },
});
</script>

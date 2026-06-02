<template>
  <q-dialog v-model="model">
    <q-card v-bind="$theme.card" class="full-width" style="max-width: 420px">
      <q-item class="bg-primary text-secondary">
        <q-item-section>
          <q-item-label class="text-h5">
            {{ state.id ? "Editar tipo" : "Nuevo tipo" }}
          </q-item-label>
          <q-item-label caption class="text-grey-2">
            {{
              state.id
                ? "Actualiza el tipo de combustible seleccionado"
                : "Registra un nuevo tipo de combustible"
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
          id="fuel-type-form"
          ref="formRef"
          class="row q-col-gutter-md"
          @submit.prevent="onSubmit"
        >
          <q-input
            v-bind="$theme.input"
            v-model="state.nombre"
            class="col-12"
            label="Nombre"
            :rules="[$rules.required('Campo requerido')]"
          ></q-input>
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
          form="fuel-type-form"
          color="primary"
          text-color="secondary"
          icon="sym_o_save"
          :label="state.id ? 'Actualizar' : 'Guardar'"
          :loading="saving"
        ></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { make } from "src/boot/axios";
import { alert, question } from "src/config/dialog";
import type { IFuelType } from "src/types/IStation";
import { nextTick, ref } from "vue";
import type { QForm } from "quasar";

type FuelTypeForm = Partial<IFuelType> & {
  nombre: string;
};

const emit = defineEmits<{
  saved: [];
}>();

const model = ref(false);
const saving = ref(false);
const formRef = ref<QForm | null>(null);
const state = ref<FuelTypeForm>(getDefaultState());

function getDefaultState(): FuelTypeForm {
  return {
    nombre: "",
  };
}

async function onSubmit() {
  const isValid = await formRef.value?.validate();
  if (!isValid) return;

  const isEdition = Boolean(state.value.id);
  const answer = await question(
    isEdition ? "Actualizar tipo" : "Guardar tipo",
    `<p class="text-bold q-ma-none q-mb-xs">¿Seguro que desea continuar?</p>El tipo de combustible será ${isEdition ? "actualizado" : "creado"}.`,
    { type: "info" },
  );

  if (!answer) return;

  try {
    saving.value = true;
    const {
      data: { error, message },
    } = await make(
      `/fuel-types${isEdition ? `/${state.value.id}` : ""}`,
      isEdition ? "PUT" : "POST",
      { ...state.value },
      isEdition ? "Actualizando tipo..." : "Guardando tipo...",
    );

    await alert(error ? "Error" : "Operación exitosa", message, {
      type: error ? "negative" : "positive",
    });

    if (error) return;

    model.value = false;
    emit("saved");
  } catch (error) {
    console.error(error);
    await alert("Error", "No fue posible guardar el tipo de combustible", {
      type: "negative",
    });
  } finally {
    saving.value = false;
  }
}

defineExpose({
  async open(fuelType?: IFuelType) {
    state.value = fuelType ? { ...fuelType } : getDefaultState();
    model.value = true;
    await nextTick();
    formRef.value?.resetValidation();
  },
});
</script>

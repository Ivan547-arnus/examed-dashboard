<template>
  <q-page padding class="flex flex-center">
    <q-card v-bind="$theme.card" class="full-width" style="max-width: 520px">
      <q-item class="bg-primary text-secondary">
        <q-item-section avatar>
          <q-avatar color="secondary" text-color="primary" icon="sym_o_fact_check"></q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-h5">Nueva verificación</q-item-label>
          <q-item-label caption class="text-grey-2">
            Ingresa el permiso CRE para crear una solicitud de verificación
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-card-section class="q-pa-xl">
        <q-form class="column" @submit.prevent="onSubmit">
          <q-input
            v-bind="$theme.input"
            v-model="code"
            label="Permiso CRE"
            class="full-width"
            autofocus
            clearable
            clear-icon="sym_o_close"
            :rules="[$rules.required('Campo requerido')]"
          >
          </q-input>

          <div class="q-mt-md flex justify-end">
            <q-btn
              v-bind="$theme.btn"
              type="submit"
              color="primary"
              text-color="secondary"
              icon="sym_o_add_notes"
              label="Crear solicitud"
              size="lg"
            ></q-btn>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const code = ref("");

function onSubmit() {
  console.log("Código capturado:", code.value);
}
</script>

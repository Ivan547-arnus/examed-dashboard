<template>
  <q-dialog v-model="model">
    <q-card v-bind="$theme.card" class="full-width" style="max-width: 520px">
      <q-item class="bg-primary text-secondary">
        <q-item-section>
          <q-item-label class="text-h5"> Crear estación </q-item-label>
          <q-item-label caption class="text-white">
            Validaremos si la estación ya existe con el permiso CRE
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn
            v-bind="$theme.btnIcon"
            flat
            color="secondary"
            icon="sym_o_close"
            v-close-popup
          ></q-btn>
        </q-item-section>
      </q-item>
      <q-card-section>
        <q-banner class="border-md-radius bg-grey-3 q-mb-md">
          <template v-slot:avatar>
            <q-icon name="sym_o_info" color="primary" />
          </template>
          <template v-slot:default>
            El permiso CRE es un valor unico que identifica la estación y nos
            permite evitar duplicados, por favor verifica que sea ingresado
            correctamente.
          </template>
        </q-banner>
        <q-form id="pre-creacion-estacion-form" @submit.prevent="onSubmit">
          <q-input
            v-bind="$theme.input"
            v-model="cre"
            label="Permiso CRE"
            :rules="[$rules.required('Campo requerido')]"
          />
        </q-form>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-actions align="right">
        <q-btn v-bind="$theme.btn" label="Cancelar" v-close-popup outline />
        <q-btn
          v-bind="$theme.btn"
          type="submit"
          form="pre-creacion-estacion-form"
          label="Validar y crear"
          color="primary"
          text-color="secondary"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { make } from "src/boot/axios";
import { theme } from "src/boot/helpers";
import { alert, question } from "src/config/dialog";
import type { IStation } from "src/types/IStation";
import { ref } from "vue";
import { useRouter } from "vue-router";
const cre = ref(null);
const model = ref(false);
const router = useRouter();
async function onSubmit() {
  const answer = await question(
    "Aviso",
    "¿Seguro que deseas continuar? se creara una estación con el permiso CRE ingresado",
    {
      type: "info",
    },
  );
  if (!answer) return;
  try {
    const {
      data: { error, message, data },
    } = await make<IStation>(
      "/stations/validate-exists",
      "GET",
      {
        id: cre.value,
      },
      "Validando...",
    );
    if (error) {
      void alert("Error", message, {
        type: "negative",
      });
    } else {
      if (data) {
        void question(
          "Advertencia",
          "Se encontró una estación con el mismo permiso CRE.",
          {
            type: "info",
            cancel: {
              ...theme.btn,
              outline: true,
              label: "Cerrar",
              color: "primary",
            },
            ok: {
              ...theme.btn,
              color: "primary",
              textColor: "secondary",
              label: "Ir a la estación",
              iconRight: "sym_o_arrow_forward",
            },
          },
        ).then((result) => {
          if (result) {
            // TODO: lo mandamos a la estacion que haya encontrado
            void router.push(`/estaciones/editar/${data.id}`);
          } else {
            model.value = false;
          }
        });
      } else {
        // TODO: Creamos la estación solo con la información adicional
        const createResponse = await make<IStation>(
          "/stations/pre-create",
          "POST",
          {
            cre: cre.value,
          },
          "Creando estación",
        );
        if (createResponse.data.error) {
          void alert("Error", createResponse.data.message, {
            type: "negative",
          });
        } else {
          void router.push(`/estaciones/editar/${createResponse.data.data.id}`);
        }
      }
    }
  } catch (error) {
    console.error(error);
    void alert(
      "Error",
      "Lo sentimos, ocurrió un error al validar la estación.",
      {
        type: "negative",
      },
    );
  }
}
defineExpose({
  open() {
    model.value = true;
  },
});
</script>

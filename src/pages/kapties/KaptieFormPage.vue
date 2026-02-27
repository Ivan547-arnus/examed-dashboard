<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12 flex justify-between">
        <q-btn v-bind="$theme.btn" color="white" text-color="primary" to="/kapties" icon="bi-arrow-left-short"
          label="Regresar"></q-btn>
        <q-btn v-bind="$theme.btn" type="submit" form="kaptie-form" icon="bi-check-lg" color="primary"
          text-color="secondary" label="Guardar"></q-btn>
      </div>
      <div class="col-12">
        <q-form class="row q-col-gutter-md" id="kaptie-form" @submit.prevent="onSubmit">
          <div class="col-12 col-md-4">
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-card v-bind="$theme.card">
                  <q-card-section>
                    <p class="text-h4 text-primary q-my-none">Información general del kaptie</p>
                    <q-input v-bind="$theme.input" :rules="[$rules.required('Campo requerido')]" label="Título"
                      class="q-mb-md" v-model="state.title"></q-input>
                    <q-input v-bind="$theme.input" type="textarea" rows="6"
                      :rules="[$rules.required('Campo requerido')]" label="Descripción" class="q-mb-md"
                      v-model="state.description"></q-input>
                  </q-card-section>
                </q-card>
              </div>
              <div class="col-12" v-if="state.qr_code">
                <q-expansion-item header-class="border-md-radius" v-model="expanded" icon="bi-qr-code"
                  label="Información del QR">
                  <div class="column q-mt-md">
                    <q-btn v-bind="$theme.btn" color="primary" text-color="secondary" icon="bi-arrow-clockwise"
                      @click="handleRegenerateQR" label="Regenerar QR"></q-btn>
                    <q-btn v-bind="$theme.btn" class="q-mt-md" color="accent" text-color="primary" label="Abrir QR"
                      icon="bi-box-arrow-up-right" :href="$filters.imageUrl(state.qr_code.uuid)"
                      target="_blank"></q-btn>
                  </div>
                  <q-card class="q-mt-md" v-bind="$theme.card">
                    <q-img class="col-12" no-spinner :src="$filters.imageUrl(state.qr_code.uuid)" />
                  </q-card>
                </q-expansion-item>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-8">
            <div class="col-12">
              <q-banner class="bg-accent border-md-radius q-mb-md" v-if="state.status == 'draft'">
                <template v-slot:avatar>
                  <q-icon name="bi-info-circle" color="primary"></q-icon>
                </template>
                <span class="text-primary">El Kaptie actual aun se encuentra como borrador aun no se ecnuentra
                  publicado</span>
              </q-banner>
              <q-banner class="bg-accent border-md-radius q-mb-md" v-if="!state.id">
                <template v-slot:avatar>
                  <q-icon name="bi-info-circle" color="primary"></q-icon>
                </template>
                <span class="text-primary">Cuando se haya guardado el kaptie generaremos tu QR</span>
              </q-banner>
            </div>
            <q-card v-bind="$theme.card">
              <q-card-section>
                <p class="text-h4 text-primary q-my-none">Configuración</p>
                <div class="row q-col-gutter-md justify-evenly">
                  <div class="col-12 col-sm-6 col-md-5">
                    <q-item class="q-pa-none">
                      <q-item-section>
                        <q-item-label caption>Imagen de portada</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-field borderless no-error-icon v-model="state.marker">
                      <template #control>
                        <q-upload-component file-icon="bi-file-image" accept="image/*"
                          v-model="state.marker"></q-upload-component>
                      </template>
                    </q-field>
                  </div>
                  <div class="col-12 col-sm-6 col-md-5">
                    <q-item class="q-pa-none">
                      <q-item-section>
                        <q-item-label caption>Zip de kaptie</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-field borderless no-error-icon v-model="state.zip_file">
                      <template #control>
                        <q-upload-component file-icon="bi-file-zip" v-model="state.zip_file"
                          accept="application/x-zip, application/zip, application/octet-stream, application/x-zip-compressed"></q-upload-component>
                      </template>
                    </q-field>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { make } from 'src/boot/axios';
import { theme } from 'src/boot/helpers';
import QUploadComponent from 'src/components/QUploadComponent.vue';
import { alert, question } from 'src/config/dialog';
import type { IKaptie } from 'src/types/IKaptie';
import { Kaptie } from 'src/types/IKaptie';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter()
const state = ref<Kaptie>(new Kaptie)
const expanded = ref(false)
async function onSubmit() {
  const answer = await question('Guardar', 'El Kaptie se guardará con los datos ingresados', { type: 'info', ok: { ...theme.btn, label: 'Guardar', color: 'primary', textColor: 'secondary' } })
  if (!answer) return
  const {
    data: {
      error,
      message
    }
  } = await make(`kapties${state.value.id ? '/' + state.value.id : ''}`, state.value.id ? 'PUT' : 'POST', {
    ...state.value,
    marker_id: state.value.marker?.id,
    zip_file_id: state.value.zip_file?.id
  })

  if (error) {
    await alert('Error', message, { type: 'negative' })
  } else {
    await router.push('/kapties')
  }

}

async function getKaptie(id: string) {
  try {
    const {
      data: {
        error,
        message,
        data
      }
    } = await make<IKaptie>(`kapties/${id}`, 'GET');

    if (!error) {
      state.value = new Kaptie(data)
    } else {
      await alert('Error', message, { type: 'negative' })
      void router.push('/kapties')
    }
  } catch (error) {
    await alert('Error', 'Error al obtener el kaptie', { type: 'negative' })
    void router.push('/kapties')
    console.log(error)
  }
}

async function handleRegenerateQR() {
  try {
    const {
      data: {
        error,
        message,
        data
      }
    } = await make<IKaptie>(`kapties/${state.value.id}/qr-code`, 'PUT');
    if (!error) {
      state.value = new Kaptie(data)
    } else {
      console.log(message)
    }
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  if (router.currentRoute.value.params.id) {
    void getKaptie(router.currentRoute.value.params.id as string)
  }
})
</script>

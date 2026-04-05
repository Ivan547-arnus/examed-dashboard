<template>
  <!-- @vue-ignore -->
  <q-uploader v-bind="$props" ref="uploader" :factory="handleUpload" auto-upload @removed="handleRemoved"
    @uploaded="handleUploaded" :max-files="1" class="q-uploader border-xs-radius no-shadow">
    <template #header>
    </template>
    <template #list="scope">
      <div class="q-uploader-container" :class="`bg-${$props.color || 'white'}`">
        <div class="q-uploader-card text-normal" v-if="scope.files.length || model?.id">
          <img  :src="fileRoute" v-if="isImage && fileRoute" class="border-xs-radius"
            style="max-height: 60px;" />

          <q-icon :name="$props.fileIcon || 'bi-file-earmark'" color="primary" size="xl" v-else></q-icon>
          <q-item dense>
            <q-item-section>
              <q-item-label caption>{{ model?.id ? (+model.size / 1024 / 1024 ).toFixed(2) + 'MB' : scope.files[0].__sizeLabel }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item dense>
            <q-item-section>
              <q-item-label>{{ model?.id ? model.name : scope.files[0].name }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item dense>
            <q-item-section>
              <q-btn v-if="scope.files.length" v-bind="$theme.btn" flat dense label="Eliminar" color="negative"
                @click="scope.removeFile(scope.files[0])"></q-btn>
                 <q-btn v-else-if="model?.id" v-bind="$theme.btn" flat dense label="Eliminar" color="negative"
                @click="model = null"></q-btn>
            </q-item-section>
          </q-item>
        </div>

        <div class="drag-drop-zone" v-else>
          <q-icon size="xl" color="primary" name="bi-cloud-arrow-up"></q-icon>
          <span class="text-primary text-h5">Arrastra un archivo aqui</span>
          <span class="text-primary text-h5">o</span>
          <q-btn v-bind="$theme.btn" color="primary" text-color="secondary" label="Selecciona un archivo">
            <q-uploader-add-trigger v-if="!model" />
          </q-btn>
        </div>
      </div>
    </template>
  </q-uploader>
</template>

<script lang="ts" setup>
import { LocalStorage, type QUploader, type QUploaderProps } from 'quasar';
import type { IFile } from 'src/types/IFile';
import { computed, ref } from 'vue';
const uploader = ref<QUploader | null>(null);
defineProps<QUploaderProps & { color?: string, fileIcon?: string }>()
const model = defineModel<IFile | null>();
function handleUpload() {
  if(model.value) return
  return {
    url: process.env.API_URL + '/uploads',
    method: 'POST',
    fieldName: 'file',
      headers: [
        {
          name: 'Authorization',
          value: 'Bearer ' + (LocalStorage.getItem('token') as string),
        },
    ],
  };
};

const fileRoute = computed(() => {
  if (!model.value) return null;
  return process.env.API_URL + '/uploads/' + model.value.uuid;
});


const isImage = computed(() => {
  if (!model.value) return false;
  return model.value.mime_type.startsWith('image/');
})

function handleRemoved() {
  model.value = null
};

function handleUploaded(data: { xhr: XMLHttpRequest }) {
  try {
    const {
      error,
      data: fileData,
    } = JSON.parse(data.xhr.response);
    if (!error) {
      model.value = fileData
    } else {
      uploader.value?.reset();
      model.value = null
    }
  } catch {
    uploader.value?.reset();
    model.value = null
  }
};
</script>

<style>
.q-uploader__list {
  padding: 0 !important;
}
</style>

<style lang="scss" scoped>
.q-uploader {
  aspect-ratio: 1 / 1;
  width: 100%;

  .q-uploader-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .q-uploader-container {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    width: 100%;
    height: 100%;
    border-radius: 12px;
    border: 1px dashed $primary;
  }


  .drag-drop-zone {
    padding: 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
}
</style>

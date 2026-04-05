<template>
  <div class="fullscreen bg-grey-4 text-primary text-center q-pa-md flex flex-center">
    <div>
      <div>
        <q-img no-spinner src="~assets/logo.png" fit="contain" class="border-xs-radius" style="width: 320px;"></q-img>
      </div>
      <div class="text-h2">
        404
      </div>

      <div class="text-h6 q-mb-md">
        Oops. No hay nada aquí...
      </div>

      <q-btn
        v-bind="$theme.btn"
        color="primary"
        text-color="white"
        to="/"
        label="Volver al inicio"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

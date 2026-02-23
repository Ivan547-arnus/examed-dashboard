<template>
  <router-view />
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';

const $q = useQuasar()
$q.loadingBar.setDefaults({ color: 'secondary', size: '2px' })
</script>

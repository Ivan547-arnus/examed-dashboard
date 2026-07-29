<template>
  <q-chip v-bind="$utils.formatRemainingDays($props.fechaVencimiento, $props.type)" />
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    fechaVencimiento: string | null;
    type?: 'termometro' | 'medida';
  }>(),
  {
    fechaVencimiento: null,
  },
);
</script>

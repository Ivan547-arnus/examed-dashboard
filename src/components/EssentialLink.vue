<template>
  <q-item :to="$props.to" clickable v-ripple class="border-md-radius q-mt-sm item-class text-dark" active-class="text-dark active-class">
    <q-item-section avatar>
      <q-icon :name="$props.icon"></q-icon>
    </q-item-section>
    <q-item-section>{{ $props.title }}</q-item-section>
  </q-item>
</template>

<script setup lang="ts">
export interface EssentialLinkProps {
  title: string;
  icon?: string;
  to?: string;
};

withDefaults(defineProps<EssentialLinkProps>(), {
  link: '#',
  icon: '',
});
</script>

<style lang="scss" scoped>
.active-class {
  border: 1px solid $secondary !important;
}

.item-class {
  color: $secondary !important;
}
</style>

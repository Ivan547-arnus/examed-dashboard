<template>
  <q-item
    :to="$props.to"
    clickable
    v-ripple
    class="border-md-radius q-mt-sm item-class text-dark"
    active-class="text-dark active-class"
    exact
    @click="handleExpand"
  >
    <q-item-section avatar>
      <q-icon :name="$props.icon"></q-icon>
    </q-item-section>
    <q-item-section>{{ $props.title }}</q-item-section>
    <q-item-section
      side
      v-if="$props.nodes && $props.nodes.length > 0"
    >
      <q-icon name="sym_o_arrow_drop_down" color="secondary"></q-icon>
    </q-item-section>
  </q-item>

  <q-slide-transition>
    <div v-show="expanded" class="container-nodes border-md-radius">
      <essential-link
        v-for="(child, index) in $props.nodes"
        :key="index"
        v-bind="child"
      ></essential-link>
    </div>
  </q-slide-transition>
</template>

<script setup lang="ts">
import EssentialLink from "src/components/EssentialLink.vue";
import type { IEssentialLink } from "src/types/IEssentialLink";
import { ref } from "vue";
const expanded = ref(false);
const props = withDefaults(defineProps<IEssentialLink>(), {
  icon: "",
  to: "",
  nodes: () => [],
});

function handleExpand() {
  if (!props.nodes || props.nodes.length === 0) return;
  expanded.value = !expanded.value;
}
</script>

<style lang="scss" scoped>
.active-class {
  border: 1px solid $secondary !important;
}

.item-class {
  color: $secondary !important;
}

.container-nodes {
  width: 95%;
  margin-left: 5%;
}
</style>

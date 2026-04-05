<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-card v-bind="$theme.card" :style="{ maxWidth: $props.maxWidth ? $props.maxWidth + 'px' : '420px', 'min-width': '320px' }">
      <q-item class="full-width" :class="`bg-${color}-9`">
        <q-item-section avatar v-if="typeof $props.icon === 'string'">
          <q-avatar :color="`bg-${color}-9`" size="36px">
            <q-icon :name="$props.icon" :color="`white`" size="1.8em"></q-icon>
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-h4" :class="`text-white`">
            {{ $props.title }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn icon="close" flat round dense v-close-popup :color="`white`" />
        </q-item-section>
      </q-item>
      <q-separator :color="`${color}-2`"></q-separator>
      <q-card-section>
        <q-item class="q-px-none">
          <q-item-section>
            <q-item-label>
              <span v-html="$props.message"></span>
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-card-section>
      <q-separator :color="`grey-3`"></q-separator>
      <q-card-actions class="action-buttons" :class="$props.reverseActions ? `reverse bg-white` : `bg-white`">
        <q-btn v-if="$props.cancel && typeof $props.cancel === 'object'" v-bind="{...$theme.btn, ...$props.cancel}" @click="onDialogCancel"
          class="full-width" />
        <div v-else></div>
        <q-btn v-if="$props.ok && typeof $props.ok === 'object'" v-bind="{...$theme.btn, ...$props.ok}" @click="onDialogOK"
          class="full-width" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
export interface IQuestionProps extends QDialogOptions {
  title?: string,
  message?: string,
  type?: 'positive' | 'negative' | 'info'
  reverseActions?: boolean,
  icon?: string | boolean,
  maxWidth?: number,
}
</script>

<script lang="ts" setup>
import type { QDialogOptions } from 'quasar';
import { useDialogPluginComponent } from 'quasar';
import { computed } from 'vue';
const props = defineProps<IQuestionProps>()
defineEmits([...useDialogPluginComponent.emits]);
const {
  dialogRef,
  onDialogHide,
  onDialogCancel,
  onDialogOK
} = useDialogPluginComponent();

const color = computed(() => {
  if (!props.type) return 'cyan'
  const colors = {
    'positive': 'green',
    'negative': 'red',
    'info': 'grey'
  }

  return colors[props.type]
})

</script>


<style lang="scss" scoped>
.action-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  justify-self: end;
  width: 100%;

  &.reverse {
    direction: rtl;
  }
}
</style>

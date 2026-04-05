<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-card v-bind="$theme.card" style="max-width: 420px" class="full-width">
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
      <q-card-section class="column items-center">
        <span class="q-mt-sm q-mx-md text-center" v-html="$props.message"></span>
        <q-form class="full-width q-mt-md" id="answer-form" @submit="onDialogOK(model)">
          <q-input v-bind="{ ...$theme.input, ...$props.input as Object }" v-model="model" autogrow />
        </q-form>
      </q-card-section>
      <q-card-section class="q-pt-none action-buttons" :class="{ 'reverse': $props.reverseActions }">
        <q-btn v-if="$props.cancel && typeof $props.cancel === 'object'" v-bind="$props.cancel" class="full-width"
          @click="onDialogCancel" />
        <q-btn v-if="$props.ok && typeof $props.ok === 'object'" class="full-width" v-bind="$props.ok" type="submit" form="answer-form" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
export interface IQuestionWithAnswerProps extends QDialogOptions {
  title?: string,
  message?: string,
  type?: 'positive' | 'negative' | 'info'
  reverseActions?: boolean,
  icon?: string,
  input?: Omit<QInputProps, 'modelValue'>
  value?: string | null
}
</script>

<script lang="ts" setup>
import type { QDialogOptions, QInputProps } from 'quasar';
import { useDialogPluginComponent } from 'quasar';
import { computed, onMounted, ref } from 'vue';
const props = defineProps<IQuestionWithAnswerProps>()
defineEmits([...useDialogPluginComponent.emits]);
const {
  dialogRef,
  onDialogHide,
  onDialogCancel,
  onDialogOK,
} = useDialogPluginComponent();
const model = ref<string | null>(null)
const color = computed(() => {
  if (!props.type) return 'cyan'
  const colors = {
    'positive': 'green',
    'negative': 'red',
    'info': 'cyan'
  }

  return colors[props.type]
})

onMounted(() => {
  if (props.value) model.value = props.value
  else model.value = null
})
</script>


<style lang="scss" scoped>
.action-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1em;

  &.reverse {
    direction: rtl;
  }
}
</style>

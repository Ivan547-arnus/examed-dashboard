<template>
  <!--@vue-skip-->
  <q-select v-bind="$props" v-model="model" :options="options">
    <template v-for="(_, slot) of $slots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope || {}"></slot>
    </template>
  </q-select>
</template>

<script lang="ts" setup>
import type { QSelectProps } from "quasar";
import { make } from "src/boot/axios";
import { onMounted, ref, watch } from "vue";
const props = withDefaults(
  defineProps<
    {
      url: string;
      method?: "POST" | "GET" | "PUT" | "DELETE";
      blockFetch?: boolean;
    } & Omit<QSelectProps, "options">
  >(),
  {
    method: "GET",
  },
);

const model = defineModel("modelValue");
const options = ref([]);

async function fetchOptions() {
  if (props.blockFetch) return;

  try {
    const {
      data: { data, error },
    } = await make<[]>(props.url, props.method, {});
    if (!error) {
      options.value = data;
    } else {
      options.value = [];
    }
  } catch {
    options.value = [];
  }
}

watch(() => props.url, fetchOptions);
watch(() => props.blockFetch, fetchOptions);

onMounted(() => {
  void fetchOptions();
});
</script>

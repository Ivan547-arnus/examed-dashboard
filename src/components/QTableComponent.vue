<template>
  <!-- @vue-ignore -->
  <q-table ref="table" v-bind="$props" :rows="rows" :loading="loading" v-model:pagination="pagination"
    @request="handleTableRequest">
    <!-- @vue-skip -->
    <template v-for="(_, slot) of $slots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
    <template #bottom>
      <div class="full-width flex justify-end q-gutter-sm q-my-sm">
        <q-btn v-bind="$theme.btn" color="primary" text-color="white"
          :label="`Registros por pagina: ${pagination.rowsPerPage}`" icon-right="bi-arrow-down-short">
          <q-menu v-bind="$theme.menu" anchor="bottom right" self="top right">
            <q-list>
              <q-item v-for="item in [5, 7, 10, 25, 50, 100]" clickable v-close-popup @click="() =>  { pagination.rowsPerPage = item; handleRequest(); }"
                :key="item" class="be-vietnam-pro-bold">
                <q-item-section>{{ item }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
        <q-btn v-bind="$theme.btnIcon" :disabled="pagination.page == 1" dense color="primary" text-color="white"
          icon="sym_o_arrow_left" @click="() => { pagination.page--; handleRequest(); }"></q-btn>
        <q-pagination rounded size="16px" v-model="pagination.page" @update:model-value="handleRequest" color="primary"
          active-color="primary" active-text-color="white" text-color="primary" :min="range.min" :max="range.max" />
        <q-btn v-bind="$theme.btnIcon" :disabled="pagination.page == range.max" dense color="primary" text-color="white"
          icon="sym_o_arrow_right" @click="() => { pagination.page++; handleRequest(); }"></q-btn>
        <q-btn v-bind="$theme.btnIcon" @click="handleRequest" dense text-color="white" color="primary"
          icon="sym_o_refresh">
        </q-btn>
      </div>
    </template>
  </q-table>
</template>
<script lang="ts">
interface Props extends Omit<QTableProps, 'rows'> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns?: any[] | undefined;
  url?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any[];
  disableFilters?: boolean,
  requestData?: Record<string, unknown>,
  filterColumns?: string[]
}
</script>

<script lang="ts" setup>
import { debounce, type QTableProps, type QTableSlots } from 'quasar';
import { make } from 'src/boot/axios';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
const props = withDefaults(defineProps<Props>(), {});
const search = defineModel<string>('search');
const loading = defineModel<boolean>('loading');
defineSlots<QTableSlots>()
const rows = ref([]);
const pagination = defineModel<{ page: number; rowsPerPage: number; sortBy: null | string; descending: boolean; rowsNumber: number }>('pagination', {
  default: {
    page: 1,
    rowsPerPage: 10,
    sortBy: null,
    descending: false,
    rowsNumber: 0
  }
});
const searchFields = computed(() => {
  return props.columns?.filter((column) => column.searchable === true).map((column) => column.name)
});
const range = computed(() => ({
  min: pagination.value.page == 1 ? 1 : Math.max((Math.ceil(pagination.value.rowsNumber / pagination.value.rowsPerPage)) - 5, 1),
  max: Math.ceil(pagination.value.rowsNumber / pagination.value.rowsPerPage)
}))



async function handleTableRequest(val: { pagination: { page: number; rowsPerPage: number; sortBy: string; descending: boolean } }) {
  pagination.value.sortBy = val.pagination.sortBy;
  pagination.value.descending = val.pagination.descending;
  pagination.value.page = val.pagination.page;
  pagination.value.rowsPerPage = val.pagination.rowsPerPage;
  await nextTick()
  void handleRequest();
}

async function handleRequest() {
  if (!props.url) return
  try {
    loading.value = true
    const {
      data: { error, data }
    } = await make<{ data: [], total: number, current_page: number }>(props.url, 'GET', {
      ...props.requestData,
      search: search.value,
      searchFields: searchFields.value,
      rowsPerPage: pagination.value.rowsPerPage,
      page: pagination.value.page,
      sortBy: pagination.value.sortBy,
      descending: pagination.value.descending ? 1 : 0
    })
    if (!error) {
      rows.value = data.data
      pagination.value.rowsNumber = data.total
      await nextTick()
      if (pagination.value.page > range.value.max) {
        pagination.value.page = range.value.max
      }
    } else {
      rows.value = []
      pagination.value.rowsNumber = 0
    }
    loading.value = false
  } catch (error) {

    loading.value = false
    rows.value = []
    pagination.value.rowsNumber = 0
  }
}

watch(() => search.value, debounce(handleRequest, 500))

onMounted(async () => {
  await handleRequest()
})

defineExpose({
  refresh: handleRequest
})
</script>


<style lang="scss">
.sticky-first-column-table {
  max-width: 100%;

  th:first-child,
  td:first-child {
    background-color: white;
    position: sticky;
    left: 0;
    z-index: 1;
  }
}

.sticky-last-column-table {
  max-width: 100%;

  td:last-child {
    background-color: white;
  }

  th:last-child,
  td:last-child {
    background-color: white;
    position: sticky;
    right: 0;
    z-index: 1;
  }
}
</style>

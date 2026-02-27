<template>
  <!-- @vue-ignore -->
  <q-table ref="table" v-bind="$props" :rows="rows" :loading="loading" v-model:pagination="pagination" @request="handleTableRequest">
    <!-- @vue-skip -->
    <template v-for="(_, slot) of $slots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
    <template #bottom>
      <div class="full-width flex justify-end q-gutter-sm q-mt-xs">
        <q-btn v-bind="$theme.btn" color="primary" text-color="secondary"
          :label="`Registros por pagina: ${pagination.rowsPerPage}`" icon-right="bi-arrow-down-short">
          <q-menu v-bind="$theme.menu" anchor="bottom right" self="top right">
            <q-list>
              <q-item v-for="item in [10, 25, 50, 100]" clickable v-close-popup
                @click="pagination.rowsPerPage = item;" :key="item"
                class="be-vietnam-pro-bold">
                <q-item-section>{{ item }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
        <q-btn v-bind="$theme.btnIcon" :disabled="pagination.page == 1" dense color="primary" text-color="secondary"
          icon="bi-arrow-left-short" @click="() => { pagination.page--; handleRequest(); }"></q-btn>
        <q-pagination size="md" push active-design="push" v-model="pagination.page" @update:model-value="handleRequest" color="white" active-color="primary"
          active-text-color="secondary" text-color="dark" :min="range.min" :max="range.max" />
        <q-btn v-bind="$theme.btnIcon" :disabled="pagination.page == range.max" dense color="primary"
          text-color="secondary" icon="bi-arrow-right-short"
          @click="() => { pagination.page++; handleRequest(); }"></q-btn>
        <q-btn v-bind="$theme.btnIcon" @click="handleRequest" dense text-color="secondary" color="primary"
          icon="bi-arrow-clockwise">
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
const loading = ref(false)
const table = ref(null);
const props = withDefaults(defineProps<Props>(), {});
const search = defineModel<string>('search');
defineSlots<QTableSlots>()
const rows = ref([]);
const pagination = ref({
  sortBy: null as null | string,
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
});

const range = computed(() => ({
  min: pagination.value.page == 1 ? 1 : Math.max((Math.ceil(pagination.value.rowsNumber / pagination.value.rowsPerPage)) - 5, 1),
  max: Math.ceil(pagination.value.rowsNumber / pagination.value.rowsPerPage)
}))



async function handleTableRequest(val:{pagination:{ page: number; rowsPerPage: number; sortBy: string; descending: boolean }}) {
  pagination.value.sortBy = val.pagination.sortBy;
  pagination.value.descending = val.pagination.descending;
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

watch(() => pagination.value.rowsPerPage, () => {
  void handleRequest()
})

watch(() => search.value, debounce(handleRequest, 500))

onMounted(async () => {
  await handleRequest()
})

defineExpose({
  refresh: handleRequest
})
</script>

<style scoped>
.q-table-scrollbar {
  overflow-x: auto;
  overflow-y: hidden;
  height: 16px;
}

.q-table-scrollbar-inner {
  height: 1px;
  /* necessary to make scrollbar visible */
}
</style>

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

.q-table__bottom {
  border: none !important;
}

.q-table {

  th {
    border: none;
    background-color: $primary !important;
    color: $secondary !important;
    font-size: 1 !important;
  }

  th:first-child {
    border-top-left-radius: 16px !important;
    border-bottom-left-radius: 16px !important;
  }

  th:last-child {
    border-top-right-radius: 16px !important;
    border-bottom-right-radius: 16px !important;
  }

  tbody {

    tr {
      td {
        background-color: transparent !important;
        padding: 0 !important;
        border: none !important;

        &::before {
          background-color: transparent !important;
        }

        &>div {
          margin-top: 16px;
          height: 80px;
          text-align: center;
          width: 100% !important;
          background-color: white !important;
          color: $primary !important;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
      }

      td:first-child {
        &>div {
          border-top-left-radius: 16px !important;
          border-bottom-left-radius: 16px !important;
        }
      }

      td:last-child {
        &>div {
          border-top-right-radius: 16px !important;
          border-bottom-right-radius: 16px !important;
        }
      }
    }
  }
}
</style>

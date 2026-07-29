<template>
  <q-page padding class="extended-xl">
    <div style="max-width: 1680px; margin: 0 auto;">
      <div class="row justify-center q-col-gutter-md">
        <div class="col-12">
          <div class="row q-col-gutter-md items-stretch">
            <div class="col-12 col-sm-6 col-md">
              <q-card v-bind="$theme.card" class="bg-primary full-width full-height">
                <q-card-section>
                  <q-item>
                    <q-item-section avatar>
                      <q-avatar
                        v-bind="$theme.avatar"
                        color="secondary"
                        text-color="primary"
                        icon="sym_o_badge"
                      ></q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption class="text-secondary">
                        Folio de verificación
                      </q-item-label>
                      <q-item-label class="text-bold text-secondary">
                        {{ verificationStore.folio ?? "Sin folio" }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-sm-6 col-md">
              <q-card v-bind="$theme.card" class="bg-primary full-width full-height">
                <q-card-section>
                  <q-item>
                    <q-item-section avatar>
                      <q-avatar
                        v-bind="$theme.avatar"
                        color="secondary"
                        text-color="primary"
                        icon="sym_o_local_gas_station"
                      ></q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption class="text-secondary">
                        Dispensarios
                      </q-item-label>
                      <q-item-label class="text-bold text-secondary">
                        {{ verificationStore.dispensersCount }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-sm-6 col-md">
              <q-card v-bind="$theme.card" class="bg-primary full-width full-height">
                <q-card-section>
                  <q-item>
                    <q-item-section avatar>
                      <q-avatar
                        v-bind="$theme.avatar"
                        color="secondary"
                        text-color="primary"
                        icon="sym_o_valve"
                      ></q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption class="text-secondary">
                        No. de instrumentos
                      </q-item-label>
                      <q-item-label class="text-bold text-secondary">
                        {{ verificationStore.hosesCount }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-sm-6 col-md">
              <q-card v-bind="$theme.card" class="bg-primary full-width full-height">
                <q-card-section>
                  <q-item>
                    <q-item-section avatar>
                      <q-avatar
                        v-bind="$theme.avatar"
                        color="secondary"
                        text-color="primary"
                        icon="sym_o_attach_money"
                      ></q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption class="text-secondary">
                        Precio por manguera + IVA
                      </q-item-label>
                      <q-item-label class="text-bold text-secondary">
                        {{ $filters.currency(Number(verificationStore.verificacion.precio_x_manguera ?? 0) + Number(verificationStore.verificacion.iva_x_manguera ?? 0)) }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-sm-6 col-md">
              <q-card v-bind="$theme.card" class="bg-primary full-width full-height">
                <q-card-section>
                  <q-item>
                    <q-item-section avatar>
                      <q-avatar
                        v-bind="$theme.avatar"
                        color="secondary"
                        text-color="primary"
                        icon="sym_o_attach_money"
                      ></q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption class="text-secondary">
                        Costo total
                      </q-item-label>
                      <q-item-label class="text-bold text-secondary">
                        {{ $filters.currency(verificationStore.total) }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
        <div class="col-12">
          <q-card v-bind="$theme.card" class="q-pa-sm">
            <q-tabs
              v-model="verificationStore.tab"
              class="text-primary"
              content-class="q-gutter-md"
              active-color="secondary"
              active-bg-color="primary"
              indicator-color="transparent"
              align="center"
              no-caps
              shrink
            >
              <q-tab
                name="station"
                icon="sym_o_local_gas_station"
                label="Información general"
                class="border-md-radius q-px-md"
                style="width: 220px"
              ></q-tab>
              <q-tab
                name="config"
                icon="sym_o_settings"
                label="Configuración de solicitud"
                class="border-md-radius q-px-md"
                style="width: 220px"
              ></q-tab>
              <q-tab
                name="confirm"
                icon="sym_o_check_circle"
                label="Confirmación"
                class="border-md-radius q-px-md"
                style="width: 220px"
                v-if="verificationStore.verificacion?.estatus === 'Borrador'"
              ></q-tab>
            </q-tabs>
          </q-card>
        </div>
      </div>
      <q-tab-panels
        v-model="verificationStore.tab"
        animated
        class="bg-transparent"
        v-if="verificationStore.verificacion.id"
      >
        <q-tab-panel name="station" class="q-pa-md">
          <VerificacionEstacionComponent />
        </q-tab-panel>
        <q-tab-panel name="config" class="q-pa-md">
          <VerificacionConfiguracionSolicitudComponent />
        </q-tab-panel>
        <q-tab-panel name="confirm" class="q-pa-md">
          <VerificacionConfirmacionComponent />
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { useVerificacion } from "src/stores/verificacion-store";
import VerificacionEstacionComponent from "src/pages/verificaciones/components/VerificacionEstacionComponent.vue";
import VerificacionConfiguracionSolicitudComponent from "src/pages/verificaciones/components/VerificacionConfiguracionSolicitudComponent.vue";
import VerificacionConfirmacionComponent from "src/pages/verificaciones/components/VerificacionConfirmacionComponent.vue";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const verificationStore = useVerificacion();

onMounted(() => {
  if (router.currentRoute.value.params.verificationId) {
    void verificationStore.get(
      Number(router.currentRoute.value.params.verificationId),
    );
  } else {
    router.back();
  }
});
</script>

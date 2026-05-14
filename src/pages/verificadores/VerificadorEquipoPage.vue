<template>
  <q-page padding class="extended">
    <div style="max-width: 1440px; margin: auto">
      <div class="full-width flex justify-between q-mb-md">
        <q-btn v-bind="$theme.btn" color="white" text-color="primary" to="/verificadores" icon="sym_o_arrow_back"
          label="Regresar"></q-btn>
        <q-btn v-bind="$theme.btn" icon="sym_o_save" color="primary" text-color="secondary" label="Guardar cambios"
          @click="handleStore"></q-btn>
      </div>
      <div class="summary-container q-mb-md">
        <div>
          <q-card v-bind="$theme.card">
            <q-card-section>
              <q-item>
                <q-item-section avatar>
                  <q-avatar v-bind="$theme.avatar" size="40px" color="dark" class="q-mr-sm" round>
                    <q-icon name="sym_o_engineering" color="secondary" size="1.2em"></q-icon>
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-h5">{{ verificadorStore.user?.fullname }}</q-item-label>
                  <q-item-label caption class="text-dark">Verificador</q-item-label>
                </q-item-section>
              </q-item>
            </q-card-section>
          </q-card>
        </div>
        <div v-if="verificadorStore.config.medida?.fecha_vencimiento">
          <q-card v-bind="$theme.card" :class="verificadorStore.config.medida.cardClass()">
            <q-card-section>
              <q-item>
                <q-item-section avatar>
                  <q-avatar v-bind="$theme.avatar" size="40px" class="q-mr-sm" round>
                    <q-icon name="sym_o_science" size="1.2em"></q-icon>
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-h5">{{ verificadorStore.config.medida.diasRestantes() < 0 ? 'Vencio hace '
                      : 'Vence en ' }} en {{ Math.abs(verificadorStore.config.medida.diasRestantes()) }}
                      dias</q-item-label>
                      <q-item-label caption class="text-dark">Calibracion de Medida Volumetrica</q-item-label>
                </q-item-section>
              </q-item>
            </q-card-section>
          </q-card>
        </div>
        <div v-if="verificadorStore.config?.termometro.fecha_vencimiento">
          <q-card v-bind="$theme.card" :class="verificadorStore.config.termometro.cardClass()">
            <q-card-section>
              <q-item>
                <q-item-section avatar>
                  <q-avatar v-bind="$theme.avatar" size="40px" class="q-mr-sm" round>
                    <q-icon name="sym_o_thermostat" size="1.2em"></q-icon>
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-h5">{{ verificadorStore.config.termometro.diasRestantes() < 0
                    ? 'Vencio hace ' : 'Vence en ' }}{{ Math.abs(verificadorStore.config.termometro.diasRestantes())
                      }} dias</q-item-label>
                      <q-item-label caption class="text-dark">Calibracion de Termómetro</q-item-label>
                </q-item-section>
              </q-item>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <div class="row q-col-gutter-md ">
        <div class="col-12 col-md-6">
          <q-card v-bind="$theme.card">
            <q-item class="bg-primary text-secondary">
              <q-item-section>
                <q-item-label class="text-h5">Lecturas de instrumentos</q-item-label>
                <q-item-label caption class="text-grey-2">
                  Configura las lecturas de los instrumentos
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-card-section>
              <div class="row q-col-gutter-md">
                <q-input v-bind="$theme.input" class="col-6" label="v20" v-model="verificadorStore.config.v20"
                  type="number"></q-input>
                <q-input v-bind="$theme.input" class="col-6" label="K.C." v-model="verificadorStore.config.kc"
                  type="number"></q-input>
                <q-field v-bind="$theme.input" disable class="col-12" label="Valor de &alpha;"
                  v-model="verificadorStore.config.alpha" type="number">
                  <template v-slot:control>
                    {{ verificadorStore.config.alpha }}
                  </template>
                </q-field>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-6">
          <q-card v-bind="$theme.card">
            <q-item class="bg-primary text-secondary">
              <q-item-section>
                <q-item-label class="text-h5">Mesa niveladora y embudo</q-item-label>
                <q-item-label caption class="text-grey-2">
                  Configura la mesa niveladora y embudo
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-card-section>
              <div class="row q-col-gutter-md">
                <q-input v-bind="$theme.input" class="col-12" label="Mesa niveladora"
                  v-model="verificadorStore.config.mesa_niveladora.nombre"></q-input>
                <q-input v-bind="$theme.input" class="col-12" label="Embudo"
                  v-model="verificadorStore.config.embudo.nombre"></q-input>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-sm-6 col-md-4">
          <q-card v-bind="$theme.card">
            <q-item class="bg-primary text-secondary">
              <q-item-section>
                <q-item-label class="text-h5">Medida volumetrica</q-item-label>
                <q-item-label caption class="text-grey-2">
                  Configura el instrumento de medida volumetrica
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-card-section>
              <div class="row q-col-gutter-md">
                <q-input v-bind="$theme.input" v-model="verificadorStore.config.medida.nombre" class="col-12"
                  label="Nombre"></q-input>
                <q-input v-bind="$theme.input" v-model="verificadorStore.config.medida.informe" class="col-12"
                  label="Informe medida volumetrica"></q-input>
                <q-input v-bind="$theme.input" v-model="verificadorStore.config.medida.fecha_calibracion" class="col-12"
                  label="Fecha ultima calibración (dd/mm/aaaa)">
                  <template v-slot:append>
                    <q-icon name="sym_o_calendar_month">
                      <q-popup-proxy cover>
                        <q-date v-model="verificadorStore.config.medida.fecha_calibracion" mask="DD/MM/YYYY">
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <q-input v-bind="$theme.input" v-model="verificadorStore.config.medida.calibrado_por" class="col-12"
                  label="Calibrado por"></q-input>
                <q-select v-bind="$theme.input" @update:model-value="handleSelectAlpha"
                  v-model="verificadorStore.config.medida.marca" :options="volBrands" class="col-12"
                  label="Marca"></q-select>
                <q-input v-bind="$theme.input" v-model="verificadorStore.config.medida.modelo" class="col-12"
                  label="Modelo"></q-input>
                <q-input v-bind="$theme.input" v-model="verificadorStore.config.medida.no_serie" class="col-12"
                  label="No. de serie"></q-input>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-sm-6 col-md-4">
          <q-card v-bind="$theme.card">
            <q-item class="bg-primary text-secondary">
              <q-item-section>
                <q-item-label class="text-h5">Termómetro</q-item-label>
                <q-item-label caption class="text-grey-2">
                  Configura el termómetro
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-card-section>
              <div class="row q-col-gutter-md">
                <q-input v-bind="$theme.input" v-model="verificadorStore.config.termometro.nombre" class="col-12"
                  label="Nombre"></q-input>
                <q-input v-bind="$theme.input" v-model="verificadorStore.config.termometro.informe" class="col-12"
                  label="Informe medida volumetrica"></q-input>
                <q-input v-bind="$theme.input" mask="##/##/####"
                  v-model="verificadorStore.config.termometro.fecha_calibracion" class="col-12"
                  label="Fecha ultima calibración (dd/mm/aaaa)">
                  <template v-slot:append>
                    <q-icon name="sym_o_calendar_month">
                      <q-popup-proxy cover>
                        <q-date v-model="verificadorStore.config.termometro.fecha_calibracion" mask="DD/MM/YYYY">
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <q-input v-bind="$theme.input" v-model="verificadorStore.config.termometro.calibrado_por" class="col-12"
                  label="Calibrado por"></q-input>
                <q-input v-bind="$theme.input" v-model="(verificadorStore.config.termometro.marca as string)" class="col-12"
                  label="Marca"></q-input>
                <q-input v-bind="$theme.input" v-model="verificadorStore.config.termometro.modelo" class="col-12"
                  label="Modelo"></q-input>
                <q-input v-bind="$theme.input" v-model="verificadorStore.config.termometro.no_serie" class="col-12"
                  label="No. de serie"></q-input>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-sm-6 col-md-4">
          <q-card v-bind="$theme.card">
            <q-item class="bg-primary text-secondary">
              <q-item-section>
                <q-item-label class="text-h5">Cronometro</q-item-label>
                <q-item-label caption class="text-grey-2">
                  Configura el cronometro
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-card-section>
              <div class="row q-col-gutter-md">
                <q-input v-bind="$theme.input" v-model="verificadorStore.config.cronometro.nombre" class="col-12"
                  label="Nombre"></q-input>
                <q-input v-bind="$theme.input" v-model="(verificadorStore.config.cronometro.marca as string)" class="col-12"
                  label="Marca"></q-input>
                <q-input v-bind="$theme.input" v-model="verificadorStore.config.cronometro.modelo" class="col-12"
                  label="Modelo"></q-input>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

  </q-page>
</template>


<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { useVerificador } from 'src/stores/verificador-store';
import { onMounted } from 'vue';
import { alert, question } from 'src/config/dialog';
import { volBrands } from 'src/types/IVerifier';

const router = useRouter();
const verificadorStore = useVerificador();

function handleSelectAlpha(opt: { alpha_value: number }) {
  console.log(opt)
  verificadorStore.config.alpha = opt.alpha_value
}

async function handleStore() {
  const answer = await question('Guardar', '<p class="text-bold q-ma-none q-mb-xs">¿Seguro que desea continuar?</p>El verificador se guardará con los datos ingresados', { type: 'info' })
  if (!answer) return
  const { error, message } = await verificadorStore.storeVerifierConfig(router.currentRoute.value.params.id as string, verificadorStore.config.prepare());
  await alert(error ? 'Error' : 'Operación exitosa', message, { type: error ? 'negative' : 'positive' })
}

onMounted(() => {
  if (router.currentRoute.value.params.id) {
    void Promise.all([
      verificadorStore.getUser(router.currentRoute.value.params.id as string),
      verificadorStore.getVerifierConfig(router.currentRoute.value.params.id as string)
    ])
  }
})
</script>


<style scoped lang="scss">
.summary-container {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  height: 100%;
  gap: 16px;
}
</style>

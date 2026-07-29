<template>
  <q-page padding style="max-width: 580px; margin: auto;">
    <div class="row q-col-gutter-md justify-center">
      <div class="col-12 flex justify-between">
        <q-btn v-bind="$theme.btn" color="grey-3" text-color="primary" to="/verificadores" icon="sym_o_arrow_back"
          label="Regresar"></q-btn>
        <q-btn v-bind="$theme.btn" type="submit" form="verificador-form" color="primary" text-color="secondary" icon="sym_o_save"
          label="Guardar"></q-btn>
      </div>
      <div class="col-12">
        <q-card v-bind="$theme.card">
          <q-item class="bg-primary text-secondary">
            <q-item-section>
              <q-item-label class="text-h4">Información personal</q-item-label>
            </q-item-section>
          </q-item>
          <q-card-section>
            <q-form id="verificador-form" class="row q-col-gutter-md" @submit.prevent="onSubmit">
              <q-input v-bind="$theme.input" v-if="state.user.verifier_data" v-model="state.user.verifier_data.no_interno"
                label="No. interno" class="col-12" mask="###" unmasked-value ></q-input>
              <q-input v-bind="$theme.input" v-model="state.user.name" :rules="[$rules.required('Campo requerido')]"
                label="Nombre" class="col-12"></q-input>
              <q-input v-bind="$theme.input" v-model="state.user.lastname" :rules="[$rules.required('Campo requerido')]"
                label="Primer apellido" class="col-12"></q-input>
              <q-input v-bind="$theme.input" v-model="state.user.second_lastname" label="Segundo apellido (Opcional)"
                class="col-12"></q-input>
              <q-input v-bind="$theme.input" v-model="state.user.email"
                :rules="[$rules.required('Campo requerido'), $rules.email('Correo invalido')]" label="Email"
                class="col-12"></q-input>
              <q-input v-bind="$theme.input" v-model="state.user.phone" mask="(###) ###-##-##" unmasked-value
                label="Teléfono (Opcional)" class="col-12"></q-input>
              <q-input v-bind="$theme.input" v-model="state.user.username" :rules="[$rules.required('Campo requerido')]"
                label="Nombre de usuario" class="col-12"></q-input>
              <q-toggle v-model="state.user.change_password" color="primary" text-color="secondary"
                label="Actualizar contraseña"></q-toggle>
              <template v-if="state.user.change_password">
                <q-input v-bind="$theme.input" v-model="state.user.password"
                  :type="state.user.show_password ? 'text' : 'password'" :rules="[
                    $rules.required('Campo requerido'),
                    $rules.minLength(8, 'La contraseña debe tener al menos 8 caracteres')
                  ]" label="Contraseña" class="col-12">
                  <template #append>
                    <q-icon :name="state.user.show_password ? 'sym_o_visibility_off' : 'sym_o_visibility'"
                      @click="state.user.show_password = !state.user.show_password"></q-icon>
                  </template>
                </q-input>
                <q-input v-bind="$theme.input" v-model="state.user.password_confirmation"
                  :type="state.user.show_password_confirmation ? 'text' : 'password'" :rules="[
                    $rules.required('Campo requerido'),
                    $rules.minLength(8, 'La contraseña debe tener al menos 8 caracteres'),
                    $rules.sameAs(state.user.password, 'Las contraseñas no coinciden')
                  ]" label="Confirmar contraseña" class="col-12">
                  <template #append>
                    <q-icon :name="state.user.show_password_confirmation ? 'sym_o_visibility_off' : 'sym_o_visibility'"
                      @click="
                        state.user.show_password_confirmation = !state.user.show_password_confirmation
                        "></q-icon>
                  </template>
                </q-input>
              </template>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { make } from 'src/boot/axios';
import { alert, question } from 'src/config/dialog';
import { type IUser, User } from 'src/types/IUser';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const state = ref({
  user: new User,
});


async function getUser(id: string) {
  try {
    const {
      data: {
        error,
        message,
        data
      }
    } = await make<IUser>(`/verifier/users/${id}`, 'GET', {}, 'Obteniendo verificador...');
    if (!error) {
      state.value.user = new User(data)
    } else {
      await alert('Error', message, { type: 'negative' })
      void router.push('/verificadores')
    }
  } catch (error) {
    await alert('Error', 'Error al obtener el verificador', { type: 'negative' })
    void router.push('/verificadores')
    console.log(error)
  }
}

async function onSubmit() {
  const answer = await question('Guardar', '<p class="text-bold q-ma-none q-mb-xs">¿Seguro que desea continuar?</p>El usuario se guardará con los datos ingresados', { type: 'info' })
  if (!answer) return
  const {
    data: {
      error,
      message
    }
  } = await make(`verifier/users/${state.value.user.id}`, 'PUT', {
    ...state.value.user,
  }, 'Guardando verificador...')

  await alert(error ? 'Error' : 'Operación exitosa', message, { type: error ? 'negative' : 'positive' })
  if (!error) {
    void router.push('/verificadores')
  }
}

onMounted(() => {
  if (router.currentRoute.value.params.id) {
    void getUser(router.currentRoute.value.params.id as string);
  }
})
</script>

<template>
  <q-page padding style="max-width: 480px; margin: auto;">
    <div class="row q-col-gutter-md">
      <div class="col-12 flex justify-between">
        <q-btn v-bind="$theme.btn" color="white" text-color="primary" to="/usuarios" icon="bi-arrow-left-short"
          label="Regresar"></q-btn>
        <q-btn v-bind="$theme.btn" type="submit" form="user-form" icon="bi-check-lg" color="primary"
          text-color="secondary" label="Guardar"></q-btn>
      </div>
      <div class="col-12">
        <q-form class="row q-col-gutter-md" id="user-form" @submit.prevent="onSubmit">
          <div class="col-12">
            <q-card v-bind="$theme.card">
              <q-card-section>
                <p class="text-h4 text-primary q-my-none">Información personal</p>
                <q-input v-bind="$theme.input" :rules="[$rules.required('Campo requerido')]" label="Nombre"
                  class="q-mb-md" v-model="state.name"></q-input>
                <q-input v-bind="$theme.input" rows="6" :rules="[$rules.required('Campo requerido')]" label="Apellidos"
                  class="q-mb-md" v-model="state.last_name"></q-input>
                <q-input v-bind="$theme.input" :rules="[$rules.required('Campo requerido')]" label="Email"
                  class="q-mb-md" v-model="state.email"></q-input>
                <q-toggle color="primary" text-color="secondary" label="Actualizar contraseña"
                  v-model="state.change_password" v-if="state.id"></q-toggle>
                <template v-if="!state.id || state.change_password">
                  <q-input v-bind="$theme.input" :type=" state.show_password ? 'text' : 'password'" :rules="[$rules.required('Campo requerido'), $rules.minLength(8, 'La contraseña debe tener al menos 8 caracteres')]" label="Contraseña"
                    class="q-mb-md" v-model="state.password">
                    <template #append>
                      <q-icon :name="state.show_password ? 'bi-eye-slash' : 'bi-eye'" @click="state.show_password = !state.show_password"></q-icon>
                    </template>
                  </q-input>
                  <q-input v-bind="$theme.input" :type="state.show_password_confirmation ? 'text' : 'password'" :rules="[$rules.required('Campo requerido'), $rules.minLength(8, 'La contraseña debe tener al menos 8 caracteres'), $rules.sameAs(state.password, 'Las contraseñas no coinciden')]" label="Confirmar contraseña"
                    class="q-mb-md" v-model="state.password_confirmation">
                    <template #append>
                      <q-icon :name="state.show_password_confirmation ? 'bi-eye-slash' : 'bi-eye'" @click="state.show_password_confirmation = !state.show_password_confirmation"></q-icon>
                    </template>
                  </q-input>
                </template>
              </q-card-section>
            </q-card>
          </div>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { make } from 'src/boot/axios';
import { theme } from 'src/boot/helpers';
import { alert, question } from 'src/config/dialog';
import { type IUser, User } from 'src/types/IUser';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter()
const state = ref<User>(new User)
async function onSubmit() {
  const answer = await question('Guardar', 'El usuario se guardará con los datos ingresados', { type: 'info', ok: { ...theme.btn, label: 'Guardar', color: 'primary', textColor: 'secondary' } })
  if (!answer) return
  const {
    data: {
      error,
      message
    }
  } = await make(`admin/users${state.value.id ? '/' + state.value.id : ''}`, state.value.id ? 'PUT' : 'POST', {
    ...state.value,
  })

  if (error) {
    await alert('Error', message, { type: 'negative' })
  } else {
    await router.push('/usuarios')
  }

}

async function getUser(id: string) {
  try {
    const {
      data: {
        error,
        message,
        data
      }
    } = await make<IUser>(`/admin/users/${id}`, 'GET');

    if (!error) {
      state.value = new User(data)
    } else {
      await alert('Error', message, { type: 'negative' })
      void router.push('/usuarios')
    }
  } catch (error) {
    await alert('Error', 'Error al obtener el usuario', { type: 'negative' })
    void router.push('/usuarios')
    console.log(error)
  }
}


onMounted(() => {
  if (router.currentRoute.value.params.id) {
    void getUser(router.currentRoute.value.params.id as string)
  }
})
</script>

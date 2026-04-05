<template>
  <q-page padding style="max-width: 580px; margin: auto;">
    <div class="row q-col-gutter-md">
      <div class="col-12 flex justify-between">
        <q-btn v-bind="$theme.btn" color="grey-3" text-color="primary" to="/administradores" icon="sym_o_arrow_back"
          label="Regresar"></q-btn>
        <q-btn v-bind="$theme.btn" type="submit" form="user-form" icon="sym_o_save" color="primary"
          label="Guardar"></q-btn>
      </div>
      <div class="col-12">
        <q-form class="row q-col-gutter-md" id="user-form" @submit.prevent="onSubmit">
          <div class="col-12">
            <q-card v-bind="$theme.card">
              <q-item class="bg-grey-3">
                <q-item-section>
                  <q-item-label class="text-h4 text-primary">
                    Información personal
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-card-section>
                <q-input v-bind="$theme.input" :rules="[$rules.required('Campo requerido')]" label="Nombre"
                  class="q-mb-md" v-model="state.name"></q-input>
                <q-input v-bind="$theme.input" :rules="[$rules.required('Campo requerido')]" label="Primer apellido"
                  class="q-mb-md" v-model="state.lastname"></q-input>
                <q-input v-bind="$theme.input" label="Segundo apellido (Opcional)"
                  class="q-mb-md" v-model="state.second_lastname"></q-input>
                <q-input v-bind="$theme.input" :rules="[$rules.required('Campo requerido'), $rules.email('Correo invalido')]" label="Email"
                  class="q-mb-md" v-model="state.email"></q-input>
                <q-input v-bind="$theme.input" mask="(###) ###-##-##" unmasked-value  label="Teléfono (Opcional)"
                  class="q-mb-md" v-model="state.phone"></q-input>
                <q-input v-bind="$theme.input"  :rules="[$rules.required('Campo requerido')]" label="Nombre de usuario"
                  class="q-mb-md" v-model="state.username"></q-input>
                <q-toggle color="primary" text-color="secondary" label="Actualizar contraseña"
                  v-model="state.change_password" v-if="state.id"></q-toggle>
                <template v-if="!state.id || state.change_password">
                  <q-input v-bind="$theme.input" :type="state.show_password ? 'text' : 'password'"
                    :rules="[$rules.required('Campo requerido'), $rules.minLength(8, 'La contraseña debe tener al menos 8 caracteres')]"
                    label="Contraseña" class="q-mb-md" v-model="state.password">
                    <template #append>
                      <q-icon :name="state.show_password ? 'sym_o_visibility_off' : 'sym_o_visibility'"
                        @click="state.show_password = !state.show_password"></q-icon>
                    </template>
                  </q-input>
                  <q-input v-bind="$theme.input" :type="state.show_password_confirmation ? 'text' : 'password'"
                    :rules="[$rules.required('Campo requerido'), $rules.minLength(8, 'La contraseña debe tener al menos 8 caracteres'), $rules.sameAs(state.password, 'Las contraseñas no coinciden')]"
                    label="Confirmar contraseña" class="q-mb-md" v-model="state.password_confirmation">
                    <template #append>
                      <q-icon :name="state.show_password_confirmation ? 'sym_o_visibility_off' : 'sym_o_visibility'"
                        @click="state.show_password_confirmation = !state.show_password_confirmation"></q-icon>
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
import { alert, question } from 'src/config/dialog';
import { type IUser, User } from 'src/types/IUser';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter()
const state = ref<User>(new User)
async function onSubmit() {
  const answer = await question('Guardar', '<p class="text-bold q-ma-none q-mb-xs">¿Seguro que desea continuar?</p>El administrador se guardará con los datos ingresados', { type: 'info' })
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
    await router.push('/administradores')
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
    } = await make<IUser>(`/admin/users/${id}`, 'GET', {}, 'Obteniendo administrador...');
    if (!error) {
      state.value = new User(data)
    } else {
      await alert('Error', message, { type: 'negative' })
      void router.push('/administradores')
    }
  } catch (error) {
    await alert('Error', 'Error al obtener el administrador', { type: 'negative' })
    void router.push('/administradores')
    console.log(error)
  }
}


onMounted(() => {
  if (router.currentRoute.value.params.id) {
    void getUser(router.currentRoute.value.params.id as string)
  }
})
</script>

<template>
  <q-card v-bind="$theme.card" class="full-width" style="max-width: 420px;">
    <q-card-section>
      <div class="text-h2 text-primary text-center">¡Bienvenido!</div>
      <div class="q-pa-md">
        <q-form @submit="handleLogin" class="q-gutter-md">
          <q-input v-bind="$theme.input" lazy-rules :rules="[$rules.required('Campo requerido'), $rules.email('Email inválido')]" v-model="state.email"
            type="text" label="Email" />
          <q-input v-bind="$theme.input" lazy-rules class="text-primary" :rules="[$rules.required('Campo requerido')]" v-model="state.password"
            :type="state.show ? 'text' : 'password'" label="Contraseña" >
            <template #append>
              <q-icon :name="state.show ? 'bi-eye-slash' : 'bi-eye'" @click="state.show = !state.show"></q-icon>
            </template>
          </q-input>
          <div>
            <q-btn v-bind="$theme.btn" type="submit" text-color="secondary" color="primary" class="full-width"
              label="Iniciar Sesión" />
            <q-btn v-bind="$theme.btn" to="/auth/recuperar" flat color="primary" class="full-width q-mt-md"
              label="¿Olvidaste tu contraseña? Recuperala aqui" />
          </div>
        </q-form>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { alert } from 'src/config/dialog';
import { useAuth } from 'src/stores/auth-store';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const auth = useAuth();
const state = reactive({
  email: '',
  password: '',
  show: false
});
function handleLogin() {
  auth.login(state.email, state.password).then(({error, message}) => {
    if (error) {
      void alert('Error', message, { type: 'negative' });
    } else {
      void router.push('/')
    }
  }).catch((e) => {
    console.log(e)
  });
}
</script>

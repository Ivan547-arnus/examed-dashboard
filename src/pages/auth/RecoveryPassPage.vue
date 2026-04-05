<template>
  <q-card v-bind="$theme.card" class="full-width" style="max-width: 420px;">
    <q-card-section>
      <div class="text-h2 text-primary text-center">Recuperar contraseña</div>
      <div class="q-pa-md">
        <p class="text-normal q-mb-md">Te enviaremos un correo para restablecer tu contraseña</p>
        <q-form @submit="handleRecovery" class="q-gutter-md">
          <q-input v-bind="$theme.input" :rules="[$rules.required('Campo requerido')]" v-model="state.email"
            type="email" label="Correo Electrónico" />
          <div>
            <q-btn v-bind="$theme.btn" type="submit" text-color="secondary" color="primary" class="full-width"
              label="Recuperar Contraseña" />
            <q-btn v-bind="$theme.btn" to="/auth" icon="sym_o_arrow_left" flat color="primary" class="full-width q-mt-md"
              label="Volver a Iniciar Sesión" />
          </div>
        </q-form>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { make } from 'src/boot/axios';
import { alert } from 'src/config/dialog';
import { reactive } from 'vue';

const state = reactive({
  email: '',
})
async function handleRecovery() {
  try {
    const { data: {
      error,
      message
    } } = await make('auth/request-token', 'POST', {
      email: state.email
    })

    void alert(error ? 'Error': 'Correo enviado', message, { type: error ? 'negative' : 'positive' })
  } catch (e) {
    console.log(e);
    void alert('Error', 'Error al enviar el correo', { type: 'negative' })
  }
}
</script>

<template>
  <section class="login-shell full-width">
    <div class="login-panel">
      <div class="login-panel__brand">

        <div class="login-panel__copy">
          <div class="login-panel__logo">
            <q-img no-spinner src="~assets/logo.png" fit="contain" class="full-width"></q-img>
          </div>
          <p class="login-panel__eyebrow">Panel administrativo</p>
          <h1 class="text-h2 q-ma-none">Bienvenido</h1>
          <p class="text-normal q-mb-none">
            Ingresa con tu cuenta para continuar con la plataforma.
          </p>
        </div>

        <div class="login-panel__help" v-if="$q.screen.gt.sm">
          <div class="text-h5">¿Necesitas ayuda para entrar?</div>
          <p class="text-normal q-mb-md">
            Si no recuerdas tu contraseña, comunicate administración.
          </p>
        </div>
      </div>

      <div class="login-panel__form-wrap">
        <div class="login-panel__form">
          <div class="login-panel__form-copy">
            <p class="login-panel__eyebrow text-dark">Iniciar sesion</p>
            <h2 class="text-h3 q-my-none text-dark">Accede a tu cuenta</h2>
            <p class="text-normal text-grey-7 q-mb-xl">
              Usa tu correo y contraseña registrados para entrar a la plataforma.
            </p>
          </div>

          <q-form ref="formRef" class="q-gutter-md" @submit.prevent="handleLogin">
            <q-input
              v-bind="$theme.input"
              v-model="state.email"
              label="Correo electronico"
              autocomplete="username"
              lazy-rules
              :rules="[$rules.required('Campo requerido')]"
            >
              <template #prepend>
                <q-icon name="sym_o_email" color="primary" />
              </template>
            </q-input>

            <q-input
              v-bind="$theme.input"
              v-model="state.password"
              label="Contraseña"
              :type="state.show ? 'text' : 'password'"
              autocomplete="current-password"
              lazy-rules
              :rules="[$rules.required('Campo requerido')]"
            >
              <template #prepend>
                <q-icon name="sym_o_lock" color="primary" />
              </template>
              <template #append>
                <q-icon
                  :name="state.show ? 'sym_o_visibility_off' : 'sym_o_visibility'"
                  class="cursor-pointer"
                  color="primary"
                  @click="state.show = !state.show"
                />
              </template>
            </q-input>

            <div class="login-panel__actions">
              <q-btn
                v-bind="$theme.btn"
                type="submit"
                color="dark"
                class="full-width login-panel__submit"
                :loading="state.loading"
                label="Iniciar Sesión"
              />
            </div>
          </q-form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useQuasar, type QForm } from 'quasar';
import { alert } from 'src/config/dialog';
import { useAuth } from 'src/stores/auth-store';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const auth = useAuth();
const formRef = ref<QForm | null>(null);
const $q = useQuasar();
const state = reactive({
  email: '',
  password: '',
  show: false,
  loading: false,
});

async function handleLogin() {
  const isValid = await formRef.value?.validate();

  if (!isValid || state.loading) {
    return;
  }

  state.loading = true;

  try {
    const { error, message } = await auth.login(state.email, state.password);

    if (error) {
      void alert('Error', message, { type: 'negative' });
      return;
    }

    await router.push('/');
  } catch (e) {
    console.log(e);
  } finally {
    state.loading = false;
  }
}
</script>

<style scoped lang="scss">
.login-shell {
  display: flex;
  justify-content: center;
  padding: 24px;
}

.login-panel {
  display: grid;
  grid-template-columns: minmax(320px, 0.95fr) minmax(420px, 1.2fr);
  width: min(1120px, 100%);
  min-height: 680px;
  border-radius: 12px;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0 30px 80px rgba(16, 16, 16, 0.18);
}

.login-panel__brand {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 32px;
  padding: 42px 36px;
  color: #fff;
  background:
    linear-gradient(180deg, rgba(44, 46, 41, 0.18) 0%, rgba(208, 255, 113, 0) 28%),
    linear-gradient(160deg, var(--q-dark) 0%, var(--q-dark) 54%, #02211d 100%);
}

.login-panel__brand::after {
  content: "";
  position: absolute;
  top: -6%;
  right: -56px;
  width: 120px;
  height: 112%;
  background: #ffffff;
  transform: skewX(-8deg);
}

.login-panel__logo {
  width: 100px;
  max-width: 100%;
  height: auto;
  background-color: $grey-3;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 12px;
}

.login-panel__copy,
.login-panel__help {
  position: relative;
  z-index: 1;
  max-width: 320px;
}

.login-panel__eyebrow {
  margin: 0;
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.login-panel__ghost {
  border: 1px solid rgba(208, 255, 113, 0.45);
  padding-inline: 18px;
}

.login-panel__form-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 56px;
}

.login-panel__form {
  position: relative;
  z-index: 1;
  width: min(420px, 100%);
}

.login-panel__submit {
  min-height: 48px;
}

.login-panel__actions {
  padding-top: 8px;
}

@media (max-width: 1023px) {
  .login-panel {
    grid-template-columns: 1fr;
    min-height: unset;
  }

  .login-panel__brand::after {
    display: none;
  }

  .login-panel__brand {
    .login-panel__copy {
      width: 100%;
      max-width: unset;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
  }

  .login-panel__brand,
  .login-panel__form-wrap {
    padding: 32px 24px;
  }
}

@media (max-width: 599px) {
  .login-shell {
    padding: 12px 0;
  }

  .login-panel {
    border-radius: 12px;
  }


  .login-panel__brand {
    .login-panel__copy {
      width: 100%;
      max-width: unset;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
  }

  .login-panel__brand,
  .login-panel__form-wrap {
    padding: 28px 20px;
  }
}
</style>

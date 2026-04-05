<template>
  <q-dialog v-model="model">
    <q-card v-bind="$theme.card" class="full-width verificador-dialog">
      <q-item class="bg-primary text-white">
        <q-item-section>
          <q-item-label class="text-h5">Nuevo verificador</q-item-label>
          <q-item-label caption class="text-grey-2">
            Complete la información personal del verificador una vez guardada se podran asignar folios
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn v-bind="$theme.btnIcon" flat round color="white" icon="sym_o_close" @click="model = false"></q-btn>
        </q-item-section>
      </q-item>
      <q-card v-bind="$theme.card">
        <q-card-section>
          <q-form id="verificador-form" class="row q-col-gutter-md" @submit.prevent="onSubmit">
            <q-input v-bind="$theme.input" v-model="state.name" :rules="[$rules.required('Campo requerido')]"
              label="Nombre" class="col-12"></q-input>
            <q-input v-bind="$theme.input" v-model="state.lastname" :rules="[$rules.required('Campo requerido')]"
              label="Primer apellido" class="col-12"></q-input>
            <q-input v-bind="$theme.input" v-model="state.second_lastname" label="Segundo apellido (Opcional)"
              class="col-12"></q-input>
            <q-input v-bind="$theme.input" v-model="state.email"
              :rules="[$rules.required('Campo requerido'), $rules.email('Correo invalido')]" label="Email"
              class="col-12"></q-input>
            <q-input v-bind="$theme.input" v-model="state.phone" mask="(###) ###-##-##" unmasked-value
              label="Teléfono (Opcional)" class="col-12"></q-input>
            <q-input v-bind="$theme.input" v-model="state.username" :rules="[$rules.required('Campo requerido')]"
              label="Nombre de usuario" class="col-12"></q-input>
            <q-toggle v-if="state.id" v-model="state.change_password" color="primary" text-color="secondary"
              label="Actualizar contraseña"></q-toggle>
            <template v-if="!state.id || state.change_password">
              <q-input v-bind="$theme.input" v-model="state.password" :type="state.show_password ? 'text' : 'password'"
                :rules="[
                  $rules.required('Campo requerido'),
                  $rules.minLength(8, 'La contraseña debe tener al menos 8 caracteres')
                ]" label="Contraseña" class="col-12">
                <template #append>
                  <q-icon :name="state.show_password ? 'sym_o_visibility_off' : 'sym_o_visibility'"
                    @click="state.show_password = !state.show_password"></q-icon>
                </template>
              </q-input>
              <q-input v-bind="$theme.input" v-model="state.password_confirmation"
                :type="state.show_password_confirmation ? 'text' : 'password'" :rules="[
                  $rules.required('Campo requerido'),
                  $rules.minLength(8, 'La contraseña debe tener al menos 8 caracteres'),
                  $rules.sameAs(state.password, 'Las contraseñas no coinciden')
                ]" label="Confirmar contraseña" class="col-12">
                <template #append>
                  <q-icon :name="state.show_password_confirmation ? 'sym_o_visibility_off' : 'sym_o_visibility'" @click="
                    state.show_password_confirmation = !state.show_password_confirmation
                    "></q-icon>
                </template>
              </q-input>
            </template>
          </q-form>
        </q-card-section>
        <q-separator></q-separator>
        <q-card-actions align="right" class="bg-white q-pa-md">
          <q-btn v-bind="$theme.btn" color="grey-3" text-color="primary" label="Cancelar" v-close-popup></q-btn>
          <q-btn v-bind="$theme.btn" type="submit" form="verificador-form" color="primary" icon="sym_o_save"
            :loading="saving" label="Guardar"></q-btn>
        </q-card-actions>
      </q-card>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { make } from 'src/boot/axios';
import { alert, question } from 'src/config/dialog';
import { type IUser, User } from 'src/types/IUser';
import { ref } from 'vue';

const model = defineModel<boolean>({ default: false });
const emit = defineEmits<{
  saved: [IUser];
}>();

const state = ref<User>(new User());
const saving = ref(false);

async function onSubmit() {
  const answer = await question(
    'Guardar',
    `<p class="text-bold q-ma-none q-mb-xs">¿Seguro que desea continuar?</p>El verificador será creado con los datos ingresados`,
    { type: 'info' },
  );

  if (!answer) return;
  try {
    const method = 'POST';
    const endpoint = `/verifier/users`;
    const {
      data: { error, message, data },
    } = await make<IUser>(endpoint, method, state.value, 'Guardando verificador...');

    if (error) {
      console.log(error);
      await alert('Error', message, { type: 'negative' });
      return;
    }

    emit('saved', data);
    model.value = false;
  } catch (e) {
    console.log(e);
  }
}

defineExpose({
  open: () => {
    state.value = new User();
    model.value = true;
  }
})
</script>

<style scoped lang="scss">
.verificador-dialog {
  width: 100%;
  max-width: 560px;
}
</style>

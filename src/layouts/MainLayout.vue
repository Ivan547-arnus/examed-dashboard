<template>
  <q-layout view="lHh LpR lFf" class="grey-3">
    <q-header class="bg-grey-3" height-hint="98" bordered>
      <q-toolbar style="height: 60px;">
        <q-btn v-bind="$theme.btnIcon" flat color="dark" @click="menuDrawer = !menuDrawer">
          <q-icon name="sym_o_menu"></q-icon>
        </q-btn>
        <q-toolbar-title v-if="$q.screen.gt.xs">
          <p class="text-dark text-h5 q-ma-none">{{ $router.currentRoute.value.meta.title }}</p>
          <p class="text-dark text-caption q-ma-none" v-if="$router.currentRoute.value.meta.subtitle">{{ $router.currentRoute.value.meta.subtitle }}</p>
        </q-toolbar-title>
        <q-space></q-space>
        <q-btn padding="xs sm" v-bind="$theme.btn" no-caps flat color="white">
          <q-avatar v-bind="$theme.avatar" size="40px" color="dark" class="q-mr-sm" round>
            <q-icon name="sym_o_person" color="white" size="1.2em"></q-icon>
          </q-avatar>
          <q-item class="text-dark">
            <q-item-section class="q-mr-sm">
              <q-item-label class="text-dark text-left" caption>Bienvenido</q-item-label>
              <q-item-label>{{ auth.user?.name }} {{ auth.user?.lastname }} {{ auth.user?.second_lastname }} </q-item-label>
            </q-item-section>
          </q-item>
          <q-icon color="dark" name="sym_o_expand_more"></q-icon>
          <q-menu v-bind="$theme.menu">
            <q-list style="min-width: 180px;" class="border-xs-radius">
              <q-item clickable v-ripple @click="handleLogout" class="text-negative">
                <q-item-section avatar>
                  <q-avatar v-bind="$theme.avatar" color="negative">
                    <q-icon name="sym_o_logout" color="white"></q-icon>
                  </q-avatar>
                </q-item-section>
                <q-item-section>Cerrar sesión</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="menuDrawer"  class="bg-dark" side="left" :width="320">
      <div class="menu-container">
        <div class="menu-icon">
          <q-img no-spinner src="~assets/logo-horizontal.png" fit="contain" class="full-width" style="max-height: 120px;"></q-img>
        </div>
        <q-scroll-area>
          <q-list class="q-pa-md">
            <essential-link v-for="item in menu" :key="item.title" v-bind="item" />
          </q-list>
        </q-scroll-area>
        <div class="q-pa-md menu-footer">
          <p class="text-caption text-center q-my-none text-white">Hecho con ❤️ y ☕.</p>
        </div>
      </div>
    </q-drawer>

    <q-page-container class="border-xs-radius" style="max-width: 1440px; margin: auto">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import { useMeta, useQuasar } from 'quasar';
import { theme } from 'src/boot/helpers';
import EssentialLink from 'src/components/EssentialLink.vue';
import { question } from 'src/config/dialog';
import { useAuth } from 'src/stores/auth-store';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
const $q = useQuasar();
const router = useRouter()
const title = computed(() => 'Examed | Dashboard | ' + (router.currentRoute.value.meta.title as string))
useMeta(() => ({
  title: title.value,
}))
const auth = useAuth()
const menuDrawer = ref(false)
const menu = [
  {
    title: 'Inicio',
    icon: 'sym_o_home',
    to: '/'
  },
  {
    title: 'Administradores',
    icon: 'sym_o_people',
    to: '/administradores'
  },
  {
    title: 'Verificadores',
    icon: 'sym_o_engineering',
    to: '/verificadores'
  }
]

async function handleLogout() {
  const answer = await question('Sesión', '<span class="text-bold">¿Desea cerrar sesión?</span>', { type: 'negative', ok: { ...theme.btn, label: 'Cerrar sesión', color: 'negative' } });
  if (!answer) return;
  auth.logout();
  void router.push('/auth');
}
</script>


<style scoped lang="scss">
.menu-icon {
  display: flex;
  justify-content: space-between;
  align-items: start;
  width: 100%;
  background-color: $dark;
  padding: 12px;
  height: 60px;
  .q-img {
    height: 100%;
    border-radius: 12px;
  }
}

.menu-container {
  width: 100%;
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100%;
  gap: 24px;
}

</style>

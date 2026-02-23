<template>
  <q-layout view="lHh LpR lFf" class="bg-grey-1">
    <q-header class="bg-accent" height-hint="98">
      <q-toolbar style="height: 60px;">
        <q-btn v-bind="$theme.btnIcon" color="primary" text-color="accent" @click="menuDrawer = !menuDrawer">
          <q-icon name="bi-list"></q-icon>
        </q-btn>
        <q-toolbar-title>
          <span class="text-primary text-h3 ml-2">{{ $router.currentRoute.value.meta.title }}</span>
        </q-toolbar-title>
        <q-space></q-space>
        <q-btn padding="xs sm" v-bind="$theme.btn" no-caps flat color="primary">
          <q-item-section class="q-mr-sm">
            <q-item-label>¡Hola {{ auth.user?.name }}!</q-item-label>
          </q-item-section>
          <q-avatar v-bind="$theme.avatar">
            <q-img no-spinner src="~assets/logo.webp" fit="contain"></q-img>
          </q-avatar>
          <q-menu v-bind="$theme.menu">
            <q-list style="min-width: 180px;" class="border-md-radius">
              <q-item :to="`/usuarios/editar/${auth.user?.id}`" clickable v-ripple>
                <q-item-section avatar>
                  <q-avatar v-bind="$theme.avatar" color="accent">
                    <q-icon name="person" color="primary"></q-icon>
                  </q-avatar>
                </q-item-section>
                <q-item-section>Mi cuenta</q-item-section>
              </q-item>
              <q-item clickable v-ripple @click="handleLogout">
                <q-item-section avatar>
                  <q-avatar v-bind="$theme.avatar" color="red-1">
                    <q-icon name="logout" color="negative"></q-icon>
                  </q-avatar>
                </q-item-section>
                <q-item-section>Cerrar sesión</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>

        <q-btn v-bind="$theme.btnIcon" color="accent" text-color="primary" icon="bi-bell" class="q-ml-sm">
          <q-badge floating color="red" text-color="white" rounded></q-badge>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="menuDrawer" class="bg-accent" side="left" :width="320">
      <div class="menu-container">
        <div class="menu-icon">
          <q-img no-spinner src="~assets/logo.webp" fit="contain"></q-img>
          <span class="comfortaa-bold">v 0.0.1</span>
        </div>
        <q-scroll-area>
          <q-list>
            <essential-link v-for="item in menu" :key="item.title" v-bind="item" />
          </q-list>
        </q-scroll-area>
        <p class="text-caption text-center q-my-none be-vietnam-pro-thin">Hecho con ❤️ y ☕.</p>
      </div>
    </q-drawer>

    <q-page-container class="bg-grey-11 border-md-radius">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import { useMeta } from 'quasar';
import { theme } from 'src/boot/helpers';
import EssentialLink from 'src/components/EssentialLink.vue';
import { question } from 'src/config/dialog';
import { useAuth } from 'src/stores/auth-store';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter()
const title = computed(() => 'Kaptari | Dashboard | ' + (router.currentRoute.value.meta.title as string))
useMeta(() => ({
  title: title.value,
}))
const auth = useAuth()
const menuDrawer = ref(false)
const menu = [
  {
    title: 'Inicio',
    icon: 'bi-house',
    to: '/'
  },
  {
    title: 'Usuarios',
    icon: 'bi-people',
    to: '/usuarios'
  },
  {
    title: 'Kapties',
    icon: 'bi-gear',
    to: '/kapties'
  },
]

async function handleLogout() {
  const answer = await question('Sesión', '¿Desea cerrar sesión?', { type: 'negative', ok: { ...theme.btn, label: 'Cerrar sesión', color: 'negative' } });
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

  .q-img {
    width: 60px;
    border-radius: 12px;
  }
}

.menu-container {
  padding: 24px;
  width: 100%;
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100%;
  gap: 24px;

  &::before {
    content: "";
    z-index: 0;
    background-image: url(/src/assets/menu-bg.webp);
    width: 125%;
    height: 100%;
    position: absolute;
    bottom: 0;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center bottom;
    opacity: .1;
    left: -25%;
  }
}
</style>

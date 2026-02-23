<template>
  <q-layout view="lHh LpR lFf" class="bg-primary">
    <q-page-container class="bg-primary border-md-radius">
      <q-page class="auth-container">
        <q-img class="auth-logo" no-spinner src="~assets/logo-principal-horizontal.svg" fit="contain"></q-img>
        <div class="auth-form">
          <router-view v-slot="{ Component }">
            <transition enter-active-class="animated fadeInRight" leave-active-class="animated fadeOutLeft" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import { useMeta } from 'quasar';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter()
const title = computed(() => 'Kaptari | Dashboard | ' + (router.currentRoute.value.meta.title as string))
useMeta(() => ({
  title: title.value,
}))
</script>

<style lang="scss">
.auth-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;


  &::before {
    content: "";
    z-index: 0;
    background-image: url(/src/assets/menu-bg.webp);
    width: 210%;
    height: 120%;
    position: fixed;
    bottom: 0;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center bottom;
    opacity: .25;
    bottom: -15%;
    left: -72.5%;
  }
}

.auth-logo {
  width: 100%;
  height: 100%;
  max-width: 320px;
}

.auth-form {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

@media (max-width: 600px) {
  .auth-container {
    padding: 1rem 1.5rem;
  }

  .auth-logo {
    max-width: 100%;
  }
}
</style>

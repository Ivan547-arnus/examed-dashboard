import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    meta: {
      title: "Inicio",
      auth: true,
    },
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/IndexPage.vue") }],
  },
  {
    path: "/kapties",
    meta: {
      title: "Kapties",
      auth: true,
    },
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/kapties/KaptiesListPage.vue"),
      },
      {
        path: "nuevo",
        name: "Nuevo Kaptie",
        meta: {
          title: "Kaptie",
          auth: true,
        },
        component: () => import("pages/kapties/KaptieFormPage.vue"),
      },
      {
        path: "editar/:id",
        name: "Editar Kaptie",
        meta: {
          title: "Kaptie",
          auth: true,
        },
        component: () => import("pages/kapties/KaptieFormPage.vue"),
      },
    ],
  },
   {
    path: "/usuarios",
    meta: {
      title: "Usuarios",
      auth: true,
    },
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        meta: {
          title: "Usuarios",
          auth: true,
        },
        component: () => import("pages/usuarios/UsuariosListPage.vue"),
      },
      {
        path: "nuevo",
        name: "Nuevo Usuario",
        meta: {
          title: "Usuarios",
          auth: true,
        },
        component: () => import("pages/usuarios/UsuarioFormPage.vue"),
      },
      {
        path: "editar/:id",
        name: "Editar Usuario",
        meta: {
          title: "Usuarios",
          auth: true,
        },
        component: () => import("pages/usuarios/UsuarioFormPage.vue"),
      }
    ]
  },
  {
    path: "/auth",
    meta: {
      title: "Autenticación",
    },
    component: () => import("layouts/AuthLayout.vue"),
    children: [
      {
        name: "Iniciar sesión",
        path: "",
        meta: {
          title: "Iniciar sesión",
        },
        component: () => import("pages/auth/LoginPage.vue"),
      },
      {
        name: "Recuperar contraseña",
        path: "recuperar",
        meta: {
          title: "Recuperar contraseña",
        },
        component: () => import("pages/auth/RecoveryPassPage.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;

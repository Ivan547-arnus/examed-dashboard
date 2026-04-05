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
    path: "/administradores",
    meta: {
      title: "Administradores",
      auth: true,
    },
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        meta: {
          title: "Administradores",
          subtitle: "Lista de administradores del sistema",
          auth: true,
        },
        component: () => import("pages/usuarios/UsuariosListPage.vue"),
      },
      {
        path: "nuevo",
        name: "Nuevo Administrador",
        meta: {
          title: "Nuevo Administrador",
          subtitle: "Creá un nuevo administrador para la plataforma",
          auth: true,
        },
        component: () => import("pages/usuarios/UsuarioFormPage.vue"),
      },
      {
        path: "editar/:id",
        name: "Editar Administrador",
        meta: {
          title: "Editar Administrador",
          subtitle: "Edite los datos de un administrador",
          auth: true,
        },
        component: () => import("pages/usuarios/UsuarioFormPage.vue"),
      },
    ],
  },
  {
    path: "/verificadores",
    meta: {
      title: "Verificadores",
      auth: true,
    },
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        meta: {
          title: "Verificadores",
          subtitle: "Lista de verificadores ExaMed",
          auth: true,
        },
        component: () => import("pages/verificadores/VerificadoresListPage.vue"),
      },
      {
        path: "editar/:id",
        name: "Información del Verificador",
        meta: {
          title: "Información del Verificador",
          subtitle: "Visualiza, edita y configura la información del verificador",
          auth: true,
        },
        component: () => import("pages/verificadores/VerificadorFormPage.vue"),
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

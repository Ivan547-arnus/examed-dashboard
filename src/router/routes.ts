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
        component: () =>
          import("pages/verificadores/VerificadoresListPage.vue"),
      },
      {
        path: "editar/:id",
        name: "Información del Verificador",
        meta: {
          title: "Información del Verificador",
          subtitle: "Actualice la información personal del verificador",
          auth: true,
        },
        component: () => import("pages/verificadores/VerificadorFormPage.vue"),
      },
      {
        path: "asignacion-folios/:id",
        name: "Asignación de folios",
        meta: {
          title: "Configuración del equipo de trabajo",
          subtitle: "Asignanación y configuración del equipo de trabajo",
          auth: true,
        },
        component: () =>
          import("pages/verificadores/VerificadorFoliosPage.vue"),
      },
      {
        path: "configuracion-equipo/:id",
        name: "Configuración del equipo de trabajo",
        meta: {
          title: "Configuración del equipo de trabajo",
          subtitle: "Asignanación y configuración del equipo de trabajo",
          auth: true,
        },
        component: () =>
          import("pages/verificadores/VerificadorEquipoPage.vue"),
      },
    ],
  },
  {
    path: "/estaciones",
    meta: {
      title: "Estaciones",
      auth: true,
    },
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        meta: {
          title: "Estaciones",
          subtitle: "Lista de estaciones ExaMed",
          auth: true,
        },
        component: () => import("pages/estaciones/EstacionesListPage.vue"),
      },
      {
        path: "editar/:id",
        meta: {
          title: "Editar estación",
          subtitle: "Edita la información general de la estación",
          auth: true,
        },
        component: () => import("pages/estaciones/EstacionFormPage.vue"),
      },
      {
        path: "dispensarios/:id",
        meta: {
          title: "Estación / Dispensarios",
          subtitle: "Configura los dispensarios de la estación",
          auth: true,
        },
        component: () =>
          import("pages/estaciones/EstacionDispensariosPage.vue"),
      },
    ],
  },
  {
    path: "/tipos-combustible",
    meta: {
      title: "Tipos de combustible",
    },
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        name: "Tipos de combustible",
        path: "",
        meta: {
          title: "Tipos de combustible",
          auth: true,
        },
        component: () => import("pages/tipos-combustible/TiposCombustiblePage.vue"),
      },
    ],
  },
  {
    path: "/verificaciones",
    meta: {
      title: "Verificaciones",
    },
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        name: "Historial de verificaciones",
        path: "",
        meta: {
          title: "Historial de verificaciones",
          auth: true,
        },
        component: () => import("pages/verificaciones/HistorialVerificacionesPage.vue"),
      },
      {
        name: "Nueva verificación",
        path: "nueva",
        meta: {
          title: "Nueva verificación",
          auth: true,
        },
        component: () => import("pages/verificaciones/NuevaVerificacionPage.vue"),
      },
      {
        name: "Verificación",
        path: ":verificationId",
        meta: {
          title: "Verificación",
          auth: true,
        },
        component: () => import("pages/verificaciones/VerificacionPage.vue"),
      },
    ],
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

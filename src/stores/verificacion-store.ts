import { defineStore } from "pinia";
import { file, make } from "src/boot/axios";
import { utils } from "src/boot/helpers";
import { alert } from "src/config/dialog";
import { type IVerification, Verification } from "src/types/IVerification";

export const useVerificacion = defineStore('useVerificacion', {
  state: () => ({
    tab: 'station',
    verificacion: new Verification(),
  }),
  getters: {
    folio: (state) => {
      if (state.verificacion.id == null) return null
      else if (state.verificacion.estatus == 'Borrador') {
        return  `${state.verificacion.ano}-${(state.verificacion.verifiers[0].verifier?.verifier_data?.no_interno_formatted ?? '00')}-${String(state.verificacion.consecutivo).padStart(3, "0")}`
      } else {
        return state.verificacion.folio
      }
    },
    dispensersCount: (state) => state.verificacion.dispensers.length,
    hosesCount: (state) => state.verificacion.dispensers.reduce((acc, el) => acc += el.dispenser?.hoses_count ?? 0, 0),
    total: (state) => {
        const price = Number(state.verificacion.precio_x_manguera ?? 0);
        const iva = Number(state.verificacion.iva_x_manguera ?? 0);
        const hoses = state.verificacion.dispensers.reduce((acc, el) => acc += el.dispenser?.hoses_count ?? 0, 0);
        return ((price + iva) * hoses).toFixed(2);
    }
  },
  actions: {
    async get(id: number) {
      try {
        const { data: { error, message, data } } = await make<IVerification>("/verifications/" + id, "GET", {}, "Obteniendo verificación...")
        if (error) {
          return {
            error: true,
            message,
          }
        }
        this.verificacion = new Verification(data)
        return {
          error: false,
          message: "Verificación obtenida correctamente",
        }
      } catch (error) {
        return {
          error: true,
          message: error instanceof Error ? error.message : String(error),
        }
      }
    },
    async update() {
      try {
        const { data: { error, message, data } } = await make<IVerification>(
          `/verifications/${this.verificacion.id}`,
          "PUT",
          this.verificacion.prepareSave(),
          "Guardando verificación...",
        );

        return {
          error,
          message,
          data,
        };
      } catch (error) {
        return {
          error: true,
          message: error instanceof Error ? error.message : String(error),
          data: null,
        };
      }
    },
    async approve() {
      try {
        const { data: { error, message, data } } = await make<IVerification>(
          `/verifications/${this.verificacion.id}/approve`,
          "PUT",
          this.verificacion.prepareSave(),
          "Confirmando verificación...",
        );

        return {
          error,
          message,
          data,
        };
      } catch (error) {
        return {
          error: true,
          message: error instanceof Error ? error.message : String(error),
          data: null,
        };
      }
    },
    async generateServiceRequestPDF() {
      const data = await file('/verifications/'+this.verificacion.id+'/service-request-pdf', 'GET', null, 'Generando PDF...');
      if (data.type == 'application/json') {
        void alert('Error al exportar', 'Ha ocurrido un error al exportar las asignaciones', { type: 'negative' })
      } else {
        utils.downloadBlob(data.data, 'solicitud-'+this.verificacion.folio, 'pdf')
      }
    }
  }
});

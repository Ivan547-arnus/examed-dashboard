import { defineStore } from "pinia";
import { hereApi, make } from "src/boot/axios";
import type { IState, IMunicipality } from "src/types/IState";
import { type IStation, Station } from "src/types/IStation";
import { type IVerification, Verification } from "src/types/IVerification";

export const useStation = defineStore("useStationStore", {
  state: () => ({
    search: "",
    state: null as IState | null,
    municipality: null as IMunicipality | null,
    grid: true,
    station: new Station(),
  }),
  actions: {
    async get(id: number, withDispensaries: boolean = false) {
      try {
        let url = "/stations/" + id;
        if (withDispensaries) {
          url += "/with-dispensers";
        }
        const {
          data: { error, data, message },
        } = await make<IStation>(url, "GET", {}, "Obteniendo estación...");
        if (error) {
          return {
            error: true,
            message: message,
          };
        }
        this.station = new Station(data);
        return {
          error: false,
          message: "Estación cargada correctamente",
        };
      } catch (error) {
        console.error(error);
        return {
          error: true,
          message: "Ocurrio un error inesperado",
        };
      }
    },
    async geocoding() {
      const normalizedAddress = [
        this.station.razon_social,
        this.station.calle,
        this.station.colonia,
        this.station.cp,
        this.station.municipality?.nombre,
        this.station.state?.nombre,
        "MX",
      ]
        .filter(Boolean)
        .join(",");
      try {
        const { data } = await hereApi.get("/geocode", {
          params: {
            q: normalizedAddress,
            apikey: process.env.HERE_API_KEY,
          },
        });
        console.log(data.items);
        if (!data || !data.items || data.items.length <= 0) {
          return {
            error: true,
            message:
              "Lo sentimos, no se logro obtener unas ubicacion valida para los datos ingresados",
            data: null,
          };
        }
        console.log("llegue aqui");
        const [result] = data.items;
        if (!result || !result.position) {
          return {
            error: true,
            message:
              "Lo sentimos, no se logro obtener unas ubicacion valida para los datos ingresados",
            data: null,
          };
        }

        return {
          error: false,
          message: "Resultados encontrados",
          data: [result.position.lat, result.position.lng],
        };
      } catch (error) {
        console.error(error);
        return {
          error: true,
          message:
            "Lo sentimos, ocurrio un error al intentar obtener la ubicación",
          data: null,
        };
      }
    },
    async update(id: number) {
      try {
        const {
          data: { message, error, data },
        } = await make(`/stations/${id}`, "PUT", this.station.normalize());
        return {
          error: error,
          message: message,
          data: data,
        };
      } catch (error) {
        console.error(error);
        return {
          error: true,
          message: "Ha ocurrido un error al actualizar la estación",
          data: null,
        };
      }
    },
    async deleteDispenser(dispenserId: number) {
      try {
        const {
          data: { message, error, data },
        } = await make(
          `stations/${this.station.id}/dispensers/${dispenserId}`,
          "DELETE",
          {},
          "Eliminando dispensador...",
        );
        return {
          error: error,
          message: message,
          data: data,
        };
      } catch (error) {
        console.error(error);
        return {
          error: true,
          message: "Ha ocurrido un error al eliminar el dispensador",
          data: null,
        };
      }
    },
    async creteVerification(stationId: number) {
      try {
        const {
          data: { message, error, data },
        } = await make<IVerification>(`stations/${stationId}/create-verification`, 'POST', {})
        return {
          error: error,
          message: message,
          data: new Verification(data),
        };
      } catch (error) {
        console.error(error);
        return {
          error: true,
          message: "Ha ocurrido un error al crear la verificación",
          data: null,
        };
      }
    }
  },
});

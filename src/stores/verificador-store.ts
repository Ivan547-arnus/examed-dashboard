import { defineStore } from "pinia";
import { make } from "src/boot/axios";
import { type IUser, User } from "src/types/IUser";
import { VerifierConfig, type IVerifierConfig } from "src/types/IVerifier";

export const useVerificador = defineStore("useVerificador", {
  state: () => ({
    user: null as User | null,
    config: new VerifierConfig()
  }),
  actions: {
    async getUser(id: string) {
      try {
        const {
          data: { error, message, data },
        } = await make<IUser>(
          `/verifier/users/${id}`,
          "GET",
          {},
          "Obteniendo verificador...",
        );
        if (!error) {
          this.user = new User(data);
        } else {
          this.user = null;
        }

        return {
          error,
          message,
          data,
        };
      } catch (error) {
        this.user = null;
        return {
          error: true,
          message: "Error al obtener el verificador",
          exception: error,
        }
      }
    },
    async getVerifierConfig(id: string) {
      try {
        const {
          data: {
            error,
            message,
            data
          }
        } = await make<IVerifierConfig | null>(`/verifier/users/${id}/get-config`, 'GET', {}, false);
        if (!error && data) {
          this.config = new VerifierConfig(data);
        } else {
          this.config = new VerifierConfig();
        }
        return {
          error,
          message
        }
      } catch (error) {
        this.config = new VerifierConfig();
        return {
          error: true,
          message: 'Error al obtener la configuracion del material',
          exception: error
        }
      }
    },
    async storeVerifierConfig(id: string, config: IVerifierConfig) {
      try {
        const {
          data: {
            error,
            message,
            data
          }
        } = await make<IVerifierConfig | null>(`/verifier/users/${id}/store-config`, 'POST', config, false);
        if(!error && data) {
          this.config = new VerifierConfig(data);
        }
        return {
          error,
          message
        }
      } catch (error) {
        return {
          error: true,
          message: 'Error al guardar la configuracion del material',
          exception: error
        }
      }
    }
  },
});

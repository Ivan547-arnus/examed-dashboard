import { defineBoot } from "#q-app/wrappers";
import axios from "axios";
import { LocalStorage } from "quasar";
import type { IResponse } from "src/types/IResponse";

const api = axios.create({ baseURL: process.env.API_URL });

export default defineBoot(() => {
  const token = LocalStorage.getItem("token");
  if (token) {
    api.defaults.headers.common["Authorization"] = "Bearer " + (token as string);
  } else {
    api.defaults.headers.common["Authorization"] = "";
  }
});

const make = async <T, R = unknown>(
  endpoint: string,
  method: "POST" | "GET" | "PUT" | "DELETE",
  params?: R,
) => {
  try {
    const methods = {
      POST: async () => {
        return await api.post(endpoint, params);
      },
      PUT: async () => {
        return await api.put(endpoint, params);
      },
      DELETE: async () => {
        return await api.delete(endpoint);
      },
      GET: async () => {
        return await api.get(endpoint, { params: params });
      },
    };
    const request = await methods[method]();
    const response = {
      data: { ...request?.data } as IResponse<T>,
      status: request?.status,
    };

    if (response.data.reauth) {
      window.location.href = "/auth";
    }

    return response;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      return {
        data: {
          error: true,
          message:
            e.response?.data.message ||
            "Hubo un error al conectarse con el servidor",
          exception: e.message,
        } as IResponse<T>,
      };
    }
    return {
      data: {
        error: true,
        message: "Hubo un error al conectarse con el servidor",
        exception: e,
      } as IResponse<T>,
    };
  }
};

export { api, make };

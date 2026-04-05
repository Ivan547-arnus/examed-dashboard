import { defineBoot } from "#q-app/wrappers";
import axios from "axios";
import { Loading, LocalStorage, QSpinnerClock } from "quasar";
import type { IResponse } from "src/types/IResponse";

const api = axios.create({ baseURL: process.env.API_URL , headers: {
  "Content-Type": "application/json",
}});

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
  loading?: boolean | string
) => {
  try {

    if (loading) {
      Loading.show({
        spinner: QSpinnerClock,
        spinnerSize: 38,
        message: typeof loading === "string" ? loading : "Cargando...",
      })
    }

    const methods = {
      POST: async () => {
        return await api.post(endpoint, params);
      },
      PUT: async () => {
        return await api.put(endpoint, params);
      },
      DELETE: async () => {
        return await api.delete(endpoint, {
          params: params,
        });
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
    Loading.hide();
    if (response.data.reauth) {
      window.location.href = "/auth";
    }

    return response;
  } catch (e) {
    Loading.hide();
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

const file = async <R = unknown>(
    endpoint: string,
    method: 'POST' | 'GET',
    params?: R,
    loadingMessage:boolean|string = false
) => {
    if(loadingMessage) {
        Loading.show({
            message: typeof loadingMessage === 'string' ? loadingMessage : 'Cargando...',
            spinner:QSpinnerClock,
            spinnerSize: 38
        })
    }
    try {
        const methods = {
            POST: async () => {
                return await api.post(endpoint, params, {
                    responseType: 'blob',
                });
            },
            GET: async () => {
                return await api.get(endpoint, {
                    responseType: 'blob',
                });
            },
        };
        const request = await methods[method]();

        if (loadingMessage) {
            Loading.hide();
        }

        // En caso de que devuelva un json
        const contentType = request.headers['content-type'];
        if(contentType && contentType === 'application/json') {
            const text = await request.data.text();
            const json = JSON.parse(text);
            return {
                data: json,
                type: 'application/json',
            };
        }

        return {
            data: request?.data,
            type: 'blob',
        };
    } catch (err) {
        console.log(err);
        if (loadingMessage) {
            Loading.hide();
        }
        return {
            data: err,
            error: true,
            type: 'application/json',
        };
    }
};


export { api, make, file };

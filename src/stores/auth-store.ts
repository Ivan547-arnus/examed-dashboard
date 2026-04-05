import { defineStore } from "pinia";
import { LocalStorage } from "quasar";
import { api, make } from "src/boot/axios";
import { type IUser, User } from "src/types/IUser";

export const useAuth = defineStore("auth", {
  state: () => ({
    token: null as string | null,
    user: new User
  }),
  actions: {
    async login(login: string, password: string) {
      try {
        const {
          data :{
            error,
            message,
            data,
            token
          }
        } = await make<IUser>('auth/login', 'POST', { login, password });
        if (!error) {
          this.user = new User(data);
          this.setToken(token as string);
        } else {
          this.user = new User();
          this.setToken();
        }
        return {
          error,
          message,
          data
        }
      } catch (e) {
        this.user = new User();
        this.setToken();
        return {
          error: true,
          message: 'Error al iniciar sesion',
          exception: e
        }
      }
    },
    async validateToken(token?: string) {
      try {
        const {
          data: {
            error,
            user: data
          }
        } = await make('auth/validate', 'POST', {
          token
        });

        if (!error) {
          this.user = new User(data as IUser);
        } else {
          this.user = new User();
          this.setToken();
        }

        return {
          error,
          data
        }
      } catch {
        this.user = new User();
        this.setToken();
        return {
          error: true,
          data: null
        }
      }
    },
    logout() {
      this.user = new User();
      this.setToken();
    },
    setToken(token?: string) {
      if (token) {
        LocalStorage.set('token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        this.token = token;
      } else {
        LocalStorage.remove('token');
        delete api.defaults.headers.common['Authorization'];
        this.token = null;
      }
    }
  }
});

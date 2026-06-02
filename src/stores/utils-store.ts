import { defineStore } from "pinia";
import { make } from "src/boot/axios";
import type { IMunicipality, IState } from "src/types/IState";
import type { IFuelType } from "src/types/IStation";

export const useUtilsStore = defineStore("useUtilsStore", {
  state: () => ({
    states: [] as IState[],
    municipalities: [] as IMunicipality[],
    fuelTypes: [] as IFuelType[],
  }),
  actions: {
    async fetchFuelTypes() {
      try {
        const { data: { error, data, message } } = await make<IFuelType[]>("/utils/fuel-types", "GET");
        if (!error && data) this.fuelTypes = data;
        else console.error(message);
      } catch (error) {
        this.fuelTypes = [];
        console.error(error);
      }
    },
  },
});

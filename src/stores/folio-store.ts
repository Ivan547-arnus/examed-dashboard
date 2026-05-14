import { defineStore } from "pinia";
import dayjs from "src/plugins/dayjs";
export const useFolio = defineStore('useFolio', {
  state: () => ({
    today: dayjs(),
  }),
  getters: {
    year: (state) => state.today.year(),

    period: (state) => {
      if(state.today.month() < 6) {
        return 'Enero - Junio';
      }
      return 'Julio - Diciembre';
    },
    periodNumber: (state) => {
      if(state.today.month() < 6) {
        return 1;
      }
      return 2;
    }
  },
});

import { defineBoot } from "@quasar/app-vite/wrappers";
import proj4 from "proj4";
import { Loading, QSpinnerClock } from "quasar";
import { CreateNotify } from "src/config/notify";
import dayjs from "src/plugins/dayjs";
const theme = {
  btnIcon: {
    class: "border-md-radius",
    round: true,
    noCaps: true,
  },
  btn: {
    class: "border-md-radius",
    noCaps: true,
  },
  avatar: {
    rounded: true,
    class: "border-md-radius",
    size: "40px",
  },
  menu: {
    class: "border-md-radius",
    offset: [0, 0],
  },
  input: {
    outlined: true,
    color: "dark",
    bgColor: "white",
    class: "text-dark border-md-radius",
    clearIcon:"sym_o_close"
  },
  card: {
    class: "border-md-radius shadow-1",
  },
  loading: {
    spinner: QSpinnerClock,
    spinnerSize: 38,
  },
};

const filters = {
  imageUrl(uuid: string) {
    return process.env.API_URL + "/uploads/" + uuid;
  },
  dateTime(value: string) {
    return dayjs(value).format("DD/MMMM/YYYY HH:mm:ss");
  },
  date(value: string) {
    return dayjs(value).format("DD/MMMM/YYYY");
  },
  currency(value: number | string | null | undefined) {
    if (!value) return "";
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(Number(value));
  },

  buildDate: (val: Date | string | undefined | null) => {
    if (val instanceof Date) {
      return val;
    }
    if (!val || typeof val !== "string") return null;
    let date = val;
    let time = null;
    let hours = 0,
      minutes = 0,
      seconds = 0;
    if (date.includes(" ")) {
      const splitted = date.split(" ") as [string, string];
      date = splitted[0];
      time = splitted[1];
      if (time)
        [hours, minutes, seconds] = time.split(":").map(Number) as [
          number,
          number,
          number,
        ];
    }

    if (date.includes("/")) {
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
        const [day, month, year] = date.split("/").map(Number) as [
          number,
          number,
          number,
        ];
        return new Date(year, month - 1, day, hours, minutes, seconds);
      } else if (/^\d{4}\/\d{2}\/\d{2}$/.test(date)) {
        const [year, month, day] = date.split("/").map(Number) as [
          number,
          number,
          number,
        ];
        return new Date(year, month - 1, day, hours, minutes, seconds);
      }
      return null;
    } else if (date.includes("-")) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return null;
      }
      const [year, month, day] = date.split("-").map(Number) as [
        number,
        number,
        number,
      ];
      return new Date(year, month - 1, day, hours, minutes, seconds);
    }
    return null;
  },
};

const utils = {
  downloadBlob: (data: Blob, name = "file", ext = "pdf") => {
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(data);
    link.download = `${name}.${ext}`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
  copyToClipboard: (text: string) => {
    const input = document.createElement("input");
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
    CreateNotify("positive", "Copiado al portapapeles");
  },
  showLoading: (message: string) => {
    Loading.show({
      ...theme.loading,
      message,
    });
  },
  hideLoading: () => {
    Loading.hide();
  },
  gpsToUTM: (coords: [number, number]) => {
    const [lat, lng] = coords;
    const zone = Math.floor((lng + 180) / 6) + 1;
    const hemisphere = lat >= 0 ? "N" : "S";

    const wgs84 = "+proj=longlat +datum=WGS84 +no_defs";
    const utmProj = `+proj=utm +zone=${zone} +${
      hemisphere === "N" ? "north" : "south"
    } +ellps=WGS84 +datum=WGS84 +units=m +no_defs`;

    const [easting, northing] = proj4(wgs84, utmProj, [lng, lat]);

    return `${zone}${hemisphere} ${Math.round(easting)} ${Math.round(northing)}`;
  },
  formatRemainingDays:(fechaVencimiento: null | string, type?:'termometro' | 'medida') => {
    let prefix = '';
    if(type) {
      const types = {
        'termometro': 'Cal. ter. - ',
        'medida': 'Cal. med. vol. - '
      }

      prefix = types[type] ?? '';
    }

    if (!fechaVencimiento) {
      return {
        color: 'grey-3',
        textColor: 'grey-9',
        dense: true,
        label: prefix + 'Sin calibraciones'
      }
    }

    const today = dayjs();
    const remainingDays = dayjs(fechaVencimiento).diff(today, 'days');

    if (remainingDays < 30) {
      return {
        color: 'red-1',
        textColor: 'red-9',
        dense: true,
        label: remainingDays < 0 ? `${prefix}Vencio hace ${Math.abs(remainingDays)} dias` : `${prefix}Vence en ${Math.abs(remainingDays)} dias`
      }
    }

    if (remainingDays < 90) {
      return {
        remainingDays,
        color: 'yellow-1',
        textColor: 'yellow-9',
        dense: true,
        label: `${prefix}Vence en ${Math.abs(remainingDays)} dias`
      }
    }

    return {
      remainingDays,
      color: 'green-1',
      textColor: 'green-9',
      dense: true,
      label: `${prefix}Vence en ${Math.abs(remainingDays)} dias`
    }
  }
};

export default defineBoot(({ app }) => {
  app.config.globalProperties.$filters = filters;
  app.config.globalProperties.$theme = theme;
  app.config.globalProperties.$utils = utils;
  app.config.globalProperties.$dayjs = dayjs;
});

export { theme, filters, utils };

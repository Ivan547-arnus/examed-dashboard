import { defineBoot } from "@quasar/app-vite/wrappers";
import { date } from "quasar";
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
    size: "40px",
  },
  menu: {
    class: "border-md-radius",
    offset: [0, 0],
  },
  input: {
    outlined: true,
    color: "primary",
    bgColor: "grey-3",
    class: "text-dark border-md-radius",
  },
  card: {
    class: "border-md-radius",
  },
};

const filters = {
  imageUrl(uuid: string) {
    return process.env.API_URL + "/uploads/" + uuid;
  },
  dateTime(value: string) {
    return date.formatDate(new Date(value), "DD/MM/YYYY HH:mm:ss");
  },
  date(value: string) {
    if (!value) return "";
    return date.formatDate(new Date(value), "DD/MM/YYYY");
  },
  currency(value: number | string | null | undefined) {
    if (!value) return "";
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(Number(value));
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
};

export default defineBoot(({ app }) => {
  app.config.globalProperties.$filters = filters;
  app.config.globalProperties.$theme = theme;
  app.config.globalProperties.$utils = utils;
});

export { theme, filters, utils };

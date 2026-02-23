import { defineBoot } from "@quasar/app-vite/wrappers";
import { date } from "quasar";
const theme = {
  btnIcon: {
    class: "border-md-radius",
    round: true,
    push: true,
    noCaps: true,
  },
  btn: {
    class: "border-md-radius",
    push: true,
    noCaps: true,
  },
  avatar: {
    class: "border-md-radius",
    size: "40px",
  },
  menu: {
    class: "border-md-radius",
    offset: [0, 12],
    transitionShow: "flip-right",
    transitionHide: "flip-left",
  },
  input: {
    class: "text-primary",
    inputClass: "text-primary",
    standout: "bg-grey-3 text-primary",
  },
  card: {
    class: "border-md-radius no-shadow",
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
  }
};
export default defineBoot(({ app }) => {
  app.config.globalProperties.$filters = filters;
  app.config.globalProperties.$theme = theme;
});

export { theme, filters };

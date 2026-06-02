import { Notify, type QNotifyCreateOptions } from "quasar";

/**
 * Create a notification with the specified type and message.
 *
 * @param {'positive' | 'negative' | boolean} type - The type of the notification, can be 'positive', 'negative', or a boolean if true show negative and false show positive
 * @param {string} message - The message to be displayed in the notification
 */
export const CreateNotify = (
  type: "positive" | "negative" | "primary" | boolean,
  message: string,
) => {
  const selectedType =
    typeof type === "boolean" ? (type ? "negative" : "positive") : type;
  const types: { [propName: string]: QNotifyCreateOptions } = {
    positive: {
      icon: "check_circle",
      color: "green-1",
      message,
      textColor: "positive",
      position: "top",
      classes: "border-md-radius",
    },
    negative: {
      icon: "error",
      color: "red-1",
      message,
      textColor: "negative",
      position: "top",
      classes: "border-md-radius",
    },
    primary: {
      icon: "info",
      color: "primary",
      message,
      textColor: "secondary",
      position: "top",
      classes: "border-md-radius",
    },
  };
  if (!types[selectedType]) return;
  Notify.create(types[selectedType]);
};

export const DebugNotify = (
  type: "positive" | "negative" | boolean,
  message: string,
) => {
  if (process.env.ENVIRONMENT === "production") return;
  CreateNotify(type, message);
};

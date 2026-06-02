import type { QDialogOptions, QInputProps } from "quasar";

export interface IQuestionProps extends QDialogOptions {
  title?: string;
  message?: string;
  type?: "positive" | "negative" | "info";
  reverseActions?: boolean;
  icon?: string | boolean;
  maxWidth?: number;
}

export interface IQuestionWithAnswerProps extends QDialogOptions {
  title?: string;
  message?: string;
  type?: "positive" | "negative" | "info";
  reverseActions?: boolean;
  icon?: string;
  input?: Omit<QInputProps, "modelValue">;
  value?: string | null;
}

import type { Router } from "vue-router";
import type { IRules } from "./types/IRules";
import type { QBtnProps, QChipProps } from "quasar";
declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $filters: {
      imageUrl: (uuid: string) => string;
      date: (date: string) => string;
      dateTime: (date: string) => string;
      currency:(value: number | string | null | undefined) => string
    };
    $theme: {
      btnIcon: QBtnProps;
      btn: QBtnProps;
      avatar: Record<string, unknown>;
      menu: Record<string, unknown>;
      input: Record<string, unknown>;
      card: Record<string, unknown>;
      loading: Record<string, unknown>;
    };
    $utils: {
      copyToClipboard: (text: string) => void;
      formatRemainingDays: (fechaVencimiento: string | null, type?: 'termometro' | 'medida') => QChipProps;
    };
    $rules: IRules;
    $router: Router;
  }
}

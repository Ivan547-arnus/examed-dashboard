import dayjs from "src/plugins/dayjs"
import { type IDispenser, Station, type IStation } from "./IStation";
import { User, type IUser } from "./IUser";

export type VerificationType = "Inicial" | "Periodica" | "Extraodinaria";

const VERIFICATION_STATUS_CHIPS: Record<
  string,
  { color: string; textColor: string; icon: string, label:string, class?:string }
> = {
  Borrador: {
    color: "grey-3",
    textColor: "grey-9",
    icon: "sym_o_edit_note",
    label: "Borrador",
    class: "border-md-radius"
  },
  Pendiente: {
    color: "orange-1",
    textColor: "orange-9",
    icon: "sym_o_timer",
    label: "Pendiente",
    class: "border-md-radius"
  },
  Aprobada: {
    color: "blue-1",
    textColor: "blue-9",
    icon: "sym_o_check_circle" ,
    label: "Aprobada",
    class: "border-md-radius"
  },
  Finalizada: {
    color: "green-1",
    textColor: "green-9",
    icon: "sym_o_verified",
    label: "Finalizada",
    class: "border-md-radius"
  },
};

export function verificationStatusChip(estatus?: string | null) {
  return (
    VERIFICATION_STATUS_CHIPS[estatus ?? ""] ?? {
      color: "grey-3",
      textColor: "grey-9",
      icon: "sym_o_help",
    }
  );
}

export interface IPolicy {
  id: number | null;
  nombre: string | null;
}

export interface IStationVerificationDispenser {
  id: number | null;
  id_station_verification: number | null;
  id_station_dispenser: number | null;
  id_policy: number | null;
  policy: IPolicy | null;
  "9_2_1": number | null;
  desperfectos_9_2: number | null;
  "7_2_4_y_7_2_4_2": number | null;
  "9_2_2_y_5_3_2_3": number | null;
  "9_2_3_y_5_3_3": number | null;
  leyendas_9_2: number | null;
  tipo_producto_9_2: number | null;
  mangueras_9_2_4_1: number | null;
  "8_1": number | null;
  "9_3_2": number | null;
  temperatura_general?: number | null;
  limpieza_equipo_patron?: number | null;
  litros_minimos: string | null;
  litros_maximos: string | null;
  dispenser: IDispenser | null;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
}

export interface IStationVerificationVerifierMaterial {
  id: number | null;
  id_station_verification: number | null;
  id_station_verification_verifier: number | null;
  tipo: "medida" | "termometro" | "cronometro" | "mesa-niveladora" | "embudo";
  nombre: string | null;
  informe: string | null;
  marca: string | null;
  modelo: string | null;
  no_serie: string | null;
  calibrado_por: string | null;
  fecha_calibracion: string | null;
  fecha_vencimiento: string | null;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
}

export interface IStationVerificationVerifier {
  id: number | null;
  id_station_verification: number | null;
  id_verifier: number | null;
  v20: string | null;
  kc: string | null;
  alpha: string | null;
  mesa_niveladora?: IStationVerificationVerifierMaterial | null;
  medida?: IStationVerificationVerifierMaterial | null;
  termometro?: IStationVerificationVerifierMaterial | null;
  cronometro?: IStationVerificationVerifierMaterial | null;
  embudo?: IStationVerificationVerifierMaterial | null;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
  verifier?: IUser | null;
}

export class StationVerificationVerifier implements IStationVerificationVerifier {
  id: number | null = null;
  id_station_verification: number | null = null;
  id_verifier: number | null = null;
  v20: string | null = null;
  kc: string | null = null;
  alpha: string | null = null;
  mesa_niveladora?: IStationVerificationVerifierMaterial | null = null;
  medida?: IStationVerificationVerifierMaterial | null = null;
  termometro?: IStationVerificationVerifierMaterial | null = null;
  cronometro?: IStationVerificationVerifierMaterial | null = null;
  embudo?: IStationVerificationVerifierMaterial | null = null;
  created_at?: string | null = null;
  updated_at?: string | null = null;
  deleted_at?: string | null = null;
  verifier?: IUser | null = null;

  constructor(data?: IStationVerificationVerifier) {
    if (data) {
      Object.assign(this, {
        ...data,
        verifier: data.verifier ? new User(data.verifier) : null
      });
    }
  }
}

export class StationVerificationDispenser implements IStationVerificationDispenser {
  id: number | null = null;
  id_station_verification: number | null = null;
  id_station_dispenser: number | null = null;
  id_policy: number | null = null;
  policy: IPolicy | null = null;
  "9_2_1": number | null = 0;
  desperfectos_9_2: number | null = 0;
  "7_2_4_y_7_2_4_2": number | null = 0;
  "9_2_2_y_5_3_2_3": number | null = 0;
  "9_2_3_y_5_3_3": number | null = 0;
  leyendas_9_2: number | null = 0;
  tipo_producto_9_2: number | null = 0;
  mangueras_9_2_4_1: number | null = 0;
  "8_1": number | null = 0;
  "9_3_2": number | null = 0;
  temperatura_general: number | null = 0;
  limpieza_equipo_patron: number | null = 0;
  litros_minimos: string | null = "0.00";
  litros_maximos: string | null = "0.00";
  dispenser: IDispenser | null = null;
  created_at: string | null = null;
  updated_at: string | null = null;
  deleted_at: string | null = null;

  constructor(data?: Partial<IStationVerificationDispenser>) {
    if (data) {
      Object.assign(this, {
        ...data
      });
    }
  }
}

export interface IVerification {
  id: number | null;
  id_station: number | null;
  ano: number;
  no_verificador: string | null;
  consecutivo: number | null;
  folio: string | null;
  tipo: VerificationType | null;
  fecha_solicitud: string | null;
  fecha_inicio_inspeccion: string | null;
  hora_inicio_inspeccion: string | null;
  fecha_termino_inspeccion: string | null;
  hora_termino_inspeccion: string | null;
  hora_termino_sugerida: string | null;
  nombre_solicitante: string | null;
  primer_apellido_solicitante: string | null;
  segundo_apellido_solicitante: string | null;
  telefono_solicitante: string | null;
  correo_solicitante: string | null;
  estatus: string | null;
  observaciones: string | null;
  precio_x_manguera: string | null;
  iva_x_manguera: string | null;
  total: string | null;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
  station: IStation | null;
  dispensers: IStationVerificationDispenser[];
  verifiers: IStationVerificationVerifier[];
}

export class Verification implements IVerification {
  id: number | null = null;
  id_station: number | null = null;
  ano: number = 0;
  no_verificador: string | null = null;
  consecutivo: number | null = null;
  folio: string | null = null;
  tipo: VerificationType | null = null;
  fecha_solicitud: string | null = null;
  fecha_inicio_inspeccion: string | null = null;
  hora_inicio_inspeccion: string | null = null;
  fecha_termino_inspeccion: string | null = null;
  hora_termino_inspeccion: string | null = null;
  hora_termino_sugerida: string | null = null;
  nombre_solicitante: string | null = null;
  primer_apellido_solicitante: string | null = null;
  segundo_apellido_solicitante: string | null = null;
  telefono_solicitante: string | null = null;
  correo_solicitante: string | null = null;
  estatus: 'Borrador' | 'Pendiente' | 'Aprobada' | 'Finalizada' | null = null;
  observaciones: string | null = null;
  precio_x_manguera: string | null = null;
  iva_x_manguera: string | null = null;
  total: string | null = null;
  created_at: string | null = null;
  updated_at: string | null = null;
  deleted_at: string | null = null;
  station: IStation | null = null;
  dispensers: IStationVerificationDispenser[] = [];
  verifiers: [IStationVerificationVerifier, IStationVerificationVerifier] = [new StationVerificationVerifier, new StationVerificationVerifier];

  constructor(data?: IVerification) {
    if (data) {
      Object.assign(this, {
        ...data,
        fecha_solicitud: data.fecha_solicitud ? dayjs(data.fecha_solicitud).format("DD/MM/YYYY") : null,
        fecha_inicio_inspeccion: data.fecha_inicio_inspeccion ? dayjs(data.fecha_inicio_inspeccion).format("DD/MM/YYYY") : null,
        hora_inicio_inspeccion: data.hora_inicio_inspeccion ? data.hora_inicio_inspeccion : null,
        fecha_termino_inspeccion: data.fecha_termino_inspeccion ? dayjs(data.fecha_termino_inspeccion).format("DD/MM/YYYY") : null,
        hora_termino_inspeccion: data.hora_termino_inspeccion ? data.hora_termino_inspeccion : null,
        station: data.station ? new Station(data.station) : null,
        dispensers: data.dispensers?.map(
          (dispenser) => new StationVerificationDispenser(dispenser),
        ) ?? [],
        verifiers: data.verifiers ? [new StationVerificationVerifier(data.verifiers[0] ?? undefined), new StationVerificationVerifier(data.verifiers[1] ?? undefined)] : [new StationVerificationVerifier(), new StationVerificationVerifier() ],
      });
    }
  }

  prepareSave() {
    return {
      ...this,
      no_verificador: this.verifiers[0].verifier ? this.verifiers[0].verifier.verifier_data?.no_interno : 0,
      fecha_solicitud: this.fecha_solicitud ? dayjs(this.fecha_solicitud, 'DD/MM/YYYY').format("YYYY-MM-DD") : null,
      fecha_inicio_inspeccion: this.fecha_inicio_inspeccion ? dayjs(this.fecha_inicio_inspeccion, 'DD/MM/YYYY').format("YYYY-MM-DD") : null,
      hora_inicio_inspeccion: this.hora_inicio_inspeccion ? this.hora_inicio_inspeccion : null,
      fecha_termino_inspeccion: this.fecha_termino_inspeccion ? dayjs(this.fecha_termino_inspeccion, 'DD/MM/YYYY').format("YYYY-MM-DD") : null,
      hora_termino_inspeccion: this.hora_termino_inspeccion ? this.hora_termino_inspeccion : null,
      verifiers: this.verifiers.filter(el => el.verifier)
    }
  }
}

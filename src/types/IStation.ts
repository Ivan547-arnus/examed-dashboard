import type { IState, IMunicipality } from "./IState";

export const fuelOptions = ["Magna", "Premium", "Diesel"];
export const hoseOptions = ["A", "B", "C", "D", "E", "F"];

export interface IFuelType {
  id: number;
  nombre: string;
}

export interface IDispenserHose {
  id?: number;
  manguera: string;
  fuel_type: IFuelType | null;
  id_dispenser?: number;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
}

export interface IDispenser {
  id?: number;
  marca: string;
  modelo: string;
  no_serie: string;
  no_aprobacion: string;
  ano_aprobacion: string;
  id_station?: number;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
  hoses: IDispenserHose[];
}

export interface IStation {
  id: number;
  razon_social: string;
  cre: string;
  rfc: string;
  calle: string;
  no_exterior: string | null;
  no_interior: string | null;
  colonia: string | null;
  cp: string | null;
  correo: string | null;
  telefono: string | null;
  cordenadas: string | null;
  cordenadas_gps: string | null;
  formatted_address: string | null;
  id_state: number | null;
  state: IState | null;
  id_municipality: number | null;
  municipality: IMunicipality | null;
  dispensers: IDispenser[];
  created_at: string | null;
  updated_at: string | null;
}

export class Station implements IStation {
  id: number = 0;
  razon_social: string = "";
  cre: string = "";
  rfc: string = "";
  calle: string = "";
  no_exterior: string | null = null;
  no_interior: string | null = null;
  colonia: string | null = null;
  cp: string | null = null;
  correo: string | null = null;
  telefono: string | null = null;
  cordenadas: string | null = null;
  cordenadas_gps: string | null = null;
  formatted_address: string | null = null;
  id_state: number | null = null;
  state: IState | null = null;
  id_municipality: number | null = null;
  municipality: IMunicipality | null = null;
  dispensers: IDispenser[] = [];
  created_at: string | null = null;
  updated_at: string | null = null;

  constructor(data?: IStation) {
    if (data) {
      Object.assign(this, data);
    }
  }

  normalize() {
    return {
      ...this,
      id_state: this.state?.id,
      id_municipality: this.municipality?.id,
    };
  }
}

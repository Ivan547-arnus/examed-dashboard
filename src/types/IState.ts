export interface IState {
  id: number;
  nombre: string;
  created_at: string;
  updated_at: string;
}

export interface IMunicipality {
  id: number;
  nombre: string;
  id_state: number;
  created_at: string;
  updated_at: string;
}

import dayjs from "dayjs";

export const volBrands = [
  {
    label: 'VOLUMEX',
    value: 'VOLUMEX',
    alpha_value: 0.0000477
  },
  {
    label: 'VOLAIMEX',
    value: 'VOLAIMEX',
    alpha_value: 0.0000477
  },
  {
    label: 'BRAUNKER',
    value: 'BRAUNKER',
    alpha_value: 0.0000677
  },
  {
    label: 'HEFESTO',
    value: 'HEFESTO',
    alpha_value: 0.0000477
  },
  {
    label: 'TECNOCOR',
    value: 'TECNOCOR',
    alpha_value: 0.0000477
  },
]

export interface IVerifierConfig {
  id: number | null;
  v20: number | null;
  kc: number | null;
  alpha: number | null;
  mesa_niveladora: IVerifierMaterial,
  medida: IVerifierMaterial,
  termometro: IVerifierMaterial,
  cronometro: IVerifierMaterial,
  embudo: IVerifierMaterial,
}

export interface IVerifierMaterial {
  id?: number;
  nombre: string;
  informe: string | null;
  marca: string | null | { value: string, label: string };
  modelo: string | null;
  no_serie: string | null;
  calibrado_por: string | null;
  fecha_calibracion: string | null;
  fecha_vencimiento: string | null;
  tipo: 'medida' | 'termometro' | 'cronometro' | 'mesa-niveladora' | 'embudo';
  id_verifier: number | null;
}

export class VerifierConfig implements IVerifierConfig {
  id: number | null = null;
  v20: number | null = null;
  kc: number | null = null;
  alpha: number | null = null;
  mesa_niveladora: VerifierMaterial = new VerifierMaterial;
  medida: VerifierMaterial = new VerifierMaterial;
  termometro: VerifierMaterial = new VerifierMaterial;
  cronometro: VerifierMaterial = new VerifierMaterial;
  embudo: VerifierMaterial = new VerifierMaterial;

  constructor(data?: IVerifierConfig) {
    if (data) {
      Object.assign(this, {
        ...data,
        mesa_niveladora: new VerifierMaterial(data.mesa_niveladora),
        medida: new VerifierMaterial(data.medida),
        termometro: new VerifierMaterial(data.termometro),
        cronometro: new VerifierMaterial(data.cronometro),
        embudo: new VerifierMaterial(data.embudo),
      });
    }
  }

  prepare() {
    return {
      ...this,
      mesa_niveladora: this.mesa_niveladora.prepare(),
      medida: this.medida.prepare(),
      termometro: this.termometro.prepare(),
      cronometro: this.cronometro.prepare(),
      embudo: this.embudo.prepare(),
    }
  }
}

export class VerifierMaterial implements IVerifierMaterial {
  id?: number;
  nombre: string = '';
  informe: string | null = null;
  marca: string | null | { value: string, label: string }  = null;
  modelo: string | null= null;
  no_serie: string | null = null;
  calibrado_por: string | null = null;
  fecha_calibracion: string | null = null;
  fecha_vencimiento: string | null = null;
  tipo: 'medida' | 'termometro' | 'cronometro' | 'mesa-niveladora' | 'embudo' = 'medida';
  id_verifier: number | null = null;
  private dias_restantes: number | null = null;

  constructor(data?: IVerifierMaterial) {
    if (data) {
      Object.assign(this, {
        ...data,
        fecha_calibracion: data.fecha_calibracion ? dayjs(data.fecha_calibracion, 'YYYY-MM-DD').format('DD/MM/YYYY') : null,
      });
    }
  }

  diasRestantes(): number {
    if (this.dias_restantes) return this.dias_restantes;
    if (this.fecha_vencimiento) {
      const today = dayjs();
      const expirationDate = dayjs(this.fecha_vencimiento);
      this.dias_restantes = expirationDate.diff(today, 'day');
      return this.dias_restantes;
    }
    return 0;
  }

  cardClass(): string {
    const diasRestantes = this.diasRestantes();
    if (diasRestantes >= 90) return 'bg-green-1 text-green-9';
    if (diasRestantes < 30) return 'bg-red-1 text-red-9';
    if (diasRestantes < 90) return 'bg-yellow-1 text-yellow-9';
    return 'bg-green-1 text-green-9';
  }

  prepare() {
    return {
      ...this,
      marca: this.marca && typeof this.marca === 'object' ? this.marca.value : this.marca,
      fecha_calibracion: this.fecha_calibracion ? dayjs(this.fecha_calibracion, 'DD/MM/YYYY').format('YYYY-MM-DD') : null,
      fecha_vencimiento: this.fecha_calibracion ? dayjs(this.fecha_calibracion, 'DD/MM/YYYY').add(1, 'year').format('YYYY-MM-DD') : null
    }
  }
}


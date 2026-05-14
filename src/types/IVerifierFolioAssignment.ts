export const folioTypes = [
  {
    label: "Hologramas iniciales",
    value: "Holograma inicial",
    description: "Para dispensarios nuevos con prefijo UAAAA02[3]",
  },
  {
    label: "Hologramas semestrales",
    value: "Holograma semestral",
    description: "Para revisiones semestrales con prefijo UAAAA02[1,2]",
  },
  {
    label: "Distintivos",
    value: "Distintivo",
    description: "Número consecutivo"
  },
  {
    label: "Precintos",
    value: "Precinto",
    description: "Numero consecutivo con prefijo UI"
  },
];

export interface IVerifierFolioAssignment {
  id?: number;
  tipo: "Holograma semestral" | "Distintivo" | "Precinto" | "Holograma inicial" | null;
  prefijo: string | null;
  folio_inicial: number | null;
  folio_final: number | null;
  observaciones: string | null;
  excepciones: number[];
  tieneExepciones?: boolean;
  opciones?: {
    label: string;
    value: number;
  }[];
}

export function formatFolio(assigment: IVerifierFolioAssignment, folio: number) {
  if (assigment.tipo == 'Holograma semestral' || assigment.tipo == 'Holograma inicial') {
    return `${assigment.prefijo}${String(folio).padStart(7, '0')}`
  } else if (assigment.tipo == 'Precinto') {
    return `${assigment.prefijo}${folio}`
  }
  return `${folio}`;
}


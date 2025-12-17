export const ADMINISTRADORAS = [
  'Canopus',
  'Rodobens'
] as const;

export type Administradora = typeof ADMINISTRADORAS[number];

export const isValidAdministradora = (value: string): value is Administradora => {
  return ADMINISTRADORAS.includes(value as Administradora);
};

export const ADMINISTRADORA_LABELS: Record<Administradora, string> = {
  Canopus: 'Canopus',
  Rodobens: 'Rodobens'
};

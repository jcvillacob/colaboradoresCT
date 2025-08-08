export const CUENTAS = {
  coorditanques: {
    davivienda: '39269998934',
    bancolombia: '00313934411',
  },
  codiesel: {
    davivienda: '39269998645',
    bancolombia: '00700001424',
  },
} as const;

export type Empresa = keyof typeof CUENTAS;

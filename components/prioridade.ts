// ============================================================================
// TIPOS E CONSTANTES DE PRIORIDADE DOS LOCAIS DE VOTAÇÃO
// Arquivo isolado (sem Leaflet) para poder ser importado no SSR pelo page.tsx
// e também pelo MapaVotacao.tsx (client-only).
// ============================================================================

export type Prioridade = 'alta' | 'media' | 'baixa';

/** Local de votação com a granularidade completa vinda do ETL */
export interface LocalVotacao {
  id: string;
  municipio: string;
  bairro: string;
  nome_local: string;
  endereco: string;
  latitude: number;
  longitude: number;
  abstencoes: number;
  votos_branco: number;
  votos_nulos: number;
  votos_candidatos: Record<string, number>;
  total_votos_candidatos_alvo: number;
  total_potencial_conversao: number;
  eleitores_aptos: number;
  /** Quantidade de seções eleitorais (versão enxuta gerada por scripts/gerar-dados-publicos.mjs) */
  qtd_secoes?: number;
}

/** Local já processado (ranking dentro do bairro + faixa de prioridade) */
export interface LocalRanqueado extends LocalVotacao {
  ranking: number;
  prioridade: Prioridade;
}

/** Cores/rótulos de prioridade compartilhados entre mapa e sidebar */
export const CORES_PRIORIDADE: Record<Prioridade, { cor: string; borda: string; rotulo: string }> = {
  alta: { cor: '#dc2626', borda: '#7f1d1d', rotulo: 'Prioridade Alta' },
  media: { cor: '#f97316', borda: '#9a3412', rotulo: 'Prioridade Média' },
  baixa: { cor: '#facc15', borda: '#854d0e', rotulo: 'Prioridade Baixa' },
};

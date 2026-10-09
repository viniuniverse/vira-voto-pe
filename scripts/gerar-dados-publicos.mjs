// ============================================================================
// SCRIPT: GERAR DADOS PÚBLICOS (VERSÃO ENXUTA DOS LOCAIS DE VOTAÇÃO)
// O arquivo original (dados_locais_votacao_pe.json) tem ~10MB porque guarda o
// detalhamento de cada seção eleitoral. A interface só usa a QUANTIDADE de seções,
// então geramos public/dados/locais.json sem esse detalhe. O site baixa esse
// arquivo apenas quando o usuário pesquisa um bairro (rápido em 4G).
//
// Roda automaticamente antes do build (script "prebuild" no package.json)
// ou manualmente: npm run dados
// ============================================================================
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const origem = resolve(raiz, 'dados_locais_votacao_pe.json');
const destino = resolve(raiz, 'public', 'dados', 'locais.json');

const locais = JSON.parse(readFileSync(origem, 'utf-8'));

// Troca o array "secoes" pelo contador "qtd_secoes"
const enxutos = locais.map(({ secoes, ...resto }) => ({
  ...resto,
  qtd_secoes: Array.isArray(secoes) ? secoes.length : 0,
}));

mkdirSync(dirname(destino), { recursive: true });
writeFileSync(destino, JSON.stringify(enxutos));

console.log(`[dados] ${enxutos.length} locais gerados em public/dados/locais.json`);

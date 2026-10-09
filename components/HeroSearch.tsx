'use client';

// ============================================================================
// COMPONENTE: HERO SEARCH (TELA INICIAL DE BUSCA E MÉTRICAS REGIONAIS)
// Ajustado com 'h-full overflow-y-auto' para garantir a barra de rolagem na aba Painel.
// ============================================================================

import React, { useMemo, useRef, useEffect } from 'react';
import { BairroData } from '../app/page';

interface HeroSearchProps {
  termoBusca: string;
  setTermoBusca: (termo: string) => void;
  onSelecionarBairro: (bairroNome: string) => void;
  dadosBairros: BairroData[];
}

const MUNICIPOS_RMR = new Set([
  'RECIFE', 'JABOATAO DOS GUARARAPES', 'OLINDA', 'PAULISTA', 'CABO DE SANTO AGOSTINHO',
  'IGARASSU', 'CAMARAGIBE', 'ABREU E LIMA', 'IPOJUCA', 'SAO LOURENCO DA MATA',
  'MORENO', 'ILHA DE ITAMARACA', 'ITAPISSUMA', 'ARACOIABA'
]);

const MUNICIPOS_AGRESTE = new Set([
  'CARUARU', 'GARANHUNS', 'GRAVATA', 'VITÓRIA DE SANTO ANTÃO', 'BELO JARDIM',
  'ARCOVERDE', 'SANTA CRUZ DO CAPIBARIBE', 'SURUBIM', 'LIMOEIRO', 'AGUAS BELAS',
  'BEZERROS', 'PESQUEIRA', 'BOM CONSELHO', 'TORITAMA', 'LAJEDO', 'BUIQUE', 'SANHARO'
]);

const MUNICIPOS_SERTÃO = new Set([
  'PETROLINA', 'SERRA TALHADA', 'SALGUEIRO', 'OURICURI', 'ARARIPINA',
  'AFOGADOS DA INGAZEIRA', 'FLORESTA', 'CABROBO', 'SERTANIA', 'SAO JOSE DO BELMONTE',
  'EXU', 'TABIRA'
]);

export default function HeroSearch({
  termoBusca,
  setTermoBusca,
  onSelecionarBairro,
  dadosBairros,
}: HeroSearchProps) {

  // Foco automático só em desktop (dispositivos com mouse). No celular o teclado
  // abriria sozinho e cobriria o conteúdo da tela inicial.
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      inputRef.current?.focus();
    }
  }, []);

  const normalizar = (texto: string) =>
    texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();

  const metricasRegionais = useMemo(() => {
    let rmrTotal = 0;
    let agresteTotal = 0;
    let sertaoTotal = 0;
    let zonaMataTotal = 0;
    let geralTotal = 0;

    dadosBairros.forEach((b) => {
      const muniNorm = normalizar(b.municipio).toUpperCase();
      const potencial = b.total_potencial_conversao || 0;

      geralTotal += potencial;

      if (MUNICIPOS_RMR.has(muniNorm)) {
        rmrTotal += potencial;
      } else if (MUNICIPOS_AGRESTE.has(muniNorm)) {
        agresteTotal += potencial;
      } else if (MUNICIPOS_SERTÃO.has(muniNorm)) {
        sertaoTotal += potencial;
      } else {
        zonaMataTotal += potencial;
      }
    });

    return { rmrTotal, agresteTotal, sertaoTotal, zonaMataTotal, geralTotal };
  }, [dadosBairros]);

  const sugestoes = useMemo(() => {
    if (!termoBusca.trim() || termoBusca.length < 2) return [];
    const termo = normalizar(termoBusca);
    return dadosBairros
      .filter(
        (b) =>
          normalizar(b.bairro).includes(termo) ||
          normalizar(b.municipio).includes(termo)
      )
      .slice(0, 6);
  }, [termoBusca, dadosBairros]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (termoBusca.trim()) {
      onSelecionarBairro(termoBusca);
    }
  };

  return (
    // 'h-full overflow-y-auto' garante que a barra de rolagem apareça se o conteúdo exceder a tela
    <div className="w-full h-full bg-gradient-to-b from-red-900 via-red-800 to-gray-950 text-white flex flex-col justify-between p-4 sm:p-8 overflow-y-auto">
      
      {/* CONTEÚDO PRINCIPAL HERO */}
      <div className="max-w-4xl mx-auto w-full py-6 sm:py-10 text-center space-y-8">
        
        <div className="space-y-3">
          <span className="inline-block px-4 py-1.5 rounded-full bg-red-600/40 text-red-200 border border-red-500/50 text-xs font-bold uppercase tracking-wider">
            VÁ PARA A RUA COLAR LAMBES, ENTREGAR PANFLETOS, CONVERSAR COM A POPULAÇÃO
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Vamos ocupar cada bairro desse estado e <span className="text-red-400">Garantir a virada do Presidente Lula!</span>
          </h2>
          <p className="text-sm sm:text-base text-red-100 max-w-2xl mx-auto font-medium">
            Localize seu bairro para visualizar os locais estratégicos para ações.
          </p>
        </div>

        {/* BARRA DE PESQUISA COM O MARCADOR (📍) */}
        <div className="max-w-2xl mx-auto relative z-20">
          <form onSubmit={handleSubmit} className="relative shadow-2xl rounded-2xl overflow-hidden border-2 border-red-400/30">
            <div className="flex items-center bg-white text-gray-900 p-2 sm:p-3">
              <span className="text-xl sm:text-2xl px-3 text-red-600 shrink-0">📍</span>
              
              <input
                ref={inputRef}
                type="text"
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                placeholder="Digite o bairro (ex: Boa Viagem)"
                className="w-full min-w-0 text-base sm:text-lg px-2 py-2 focus:outline-none text-gray-900 placeholder-gray-400 font-medium"
                autoComplete="off"
                enterKeyHint="search"
              />
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-5 sm:px-8 py-3 rounded-xl font-extrabold text-sm sm:text-base transition-all shadow-md shrink-0"
              >
                Pesquisar
              </button>
            </div>
          </form>

          {/* SUGESTÕES DE DROPDOWN */}
          {sugestoes.length > 0 && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white text-gray-900 rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-30 text-left">
              <div className="px-4 py-2 bg-red-50 text-[11px] font-bold text-red-700 uppercase tracking-wider border-b border-red-100">
                Sugestões de Bairros Encontrados:
              </div>
              {sugestoes.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setTermoBusca(item.bairro);
                    onSelecionarBairro(item.bairro);
                  }}
                  className="w-full px-4 py-3 hover:bg-red-600 hover:text-white flex flex-col items-start gap-0.5 sm:flex-row sm:justify-between sm:items-center transition border-b border-gray-100 last:border-0 text-sm font-semibold text-left"
                >
                  <span>{item.bairro}</span>
                  <span className="text-xs opacity-75 font-normal">
                    {item.municipio} • {(item.total_potencial_conversao || 0).toLocaleString('pt-BR')} votos
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* CHIPS DE BAIRROS */}
          <div className="mt-4 flex flex-wrap justify-center items-center gap-2 text-xs text-red-200">
            <span className="font-bold text-white">Bairros sugeridos:</span>
            {['BOA VIAGEM', 'CASA AMARELA', 'PIEDADE', 'RIO DOCE', 'CARUARU', 'GARANHUNS'].map((bairro) => (
              <button
                key={bairro}
                onClick={() => {
                  setTermoBusca(bairro);
                  onSelecionarBairro(bairro);
                }}
                className="bg-red-800/80 hover:bg-red-600 text-white px-3 py-1 rounded-full border border-red-500/40 transition text-xs font-semibold shadow-sm"
              >
                {bairro}
              </button>
            ))}
          </div>
        </div>

        {/* CARDS REGIONAIS */}
        <div className="pt-6 border-t border-red-700/50 space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-extrabold text-white tracking-wide">
              Potencial Total de Conversão por Região em Pernambuco
            </h3>
            <p className="text-xs text-red-200">
              Soma total de Abstenções + Votos Brancos + Votos Nulos + Candidatos Alvo a converter.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            <div className="bg-gradient-to-br from-red-800 to-red-900 p-5 rounded-2xl border border-red-600/60 shadow-xl relative overflow-hidden">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-200 block">
                Região Metropolitana
              </span>
              <h4 className="text-xl font-black text-white mt-1">RMR</h4>
              <span className="text-2xl sm:text-3xl font-black text-amber-300 block mt-2">
                {metricasRegionais.rmrTotal.toLocaleString('pt-BR')}
              </span>
              <p className="text-[11px] text-red-200 mt-1 font-medium">
                Recife, Jaboatão, Olinda, Paulista, Cabo e Região.
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-800 to-red-900 p-5 rounded-2xl border border-red-600/60 shadow-xl relative overflow-hidden">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-200 block">
                Pólo do Agreste
              </span>
              <h4 className="text-xl font-black text-white mt-1">Agreste</h4>
              <span className="text-2xl sm:text-3xl font-black text-amber-300 block mt-2">
                {metricasRegionais.agresteTotal.toLocaleString('pt-BR')}
              </span>
              <p className="text-[11px] text-red-200 mt-1 font-medium">
                Caruaru, Garanhuns, Gravatá, Arcoverde e cidades do interior.
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-800 to-red-900 p-5 rounded-2xl border border-red-600/60 shadow-xl relative overflow-hidden">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-200 block">
                Vale & Sertão
              </span>
              <h4 className="text-xl font-black text-white mt-1">Sertão</h4>
              <span className="text-2xl sm:text-3xl font-black text-amber-300 block mt-2">
                {metricasRegionais.sertaoTotal.toLocaleString('pt-BR')}
              </span>
              <p className="text-[11px] text-red-200 mt-1 font-medium">
                Petrolina, Serra Talhada, Salgueiro, Ouricuri e Vale do São Francisco.
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-800 to-red-900 p-5 rounded-2xl border border-red-600/60 shadow-xl relative overflow-hidden">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-200 block">
                Zonas Norte & Sul
              </span>
              <h4 className="text-xl font-black text-white mt-1">Zona da Mata</h4>
              <span className="text-2xl sm:text-3xl font-black text-amber-300 block mt-2">
                {metricasRegionais.zonaMataTotal.toLocaleString('pt-BR')}
              </span>
              <p className="text-[11px] text-red-200 mt-1 font-medium">
                Goiana, Timbaúba, Carpina, Palmares, Escada e litoral norte/sul.
              </p>
            </div>
          </div>
        </div>

      </div>

      <div className="text-center py-4 text-xs text-red-300 font-medium border-t border-red-800/40 shrink-0">
        VIRA VOTO PE
      </div>

    </div>
  );
}

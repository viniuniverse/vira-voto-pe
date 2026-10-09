'use client';

// ============================================================================
// PÁGINA PRINCIPAL - PAINEL ELEITORAL & PLATAFORMA VIRA VOTO PE
// Adaptada para responsividade total em diferentes tamanhos de tela (mobile/desktop).
// Removidos ícones excedentes, mantida apenas a funcionalidade limpa e fluida.
// ============================================================================

import React, { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';

import Header, { TabType } from '../components/Header';
import HeroSearch from '../components/HeroSearch';
import ConteudosView from '../components/ConteudosView';
import SobreView from '../components/SobreView';
// Apenas tipos/constantes do mapa (o componente em si é carregado dinamicamente abaixo)
import { CORES_PRIORIDADE, type LocalVotacao, type LocalRanqueado, type Prioridade } from '../components/prioridade';

// Carregamento dinâmico do mapa Leaflet sem SSR
const MapaVotacao = dynamic(() => import('../components/MapaVotacao'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-900 text-white flex items-center justify-center flex-col gap-3">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500"></div>
      <p className="text-sm font-medium text-gray-300">Carregando mapa interativo...</p>
    </div>
  ),
});

import dadosBairros from '../dados_bairros_pe.json';
// Obs.: os locais de votação (dados_locais_votacao_pe.json) NÃO são importados aqui;
// são carregados via fetch de /dados/locais.json (ver useEffect no componente).

export interface BairroData {
  id: string;
  bairro: string;
  municipio: string;
  abstencoes: number;
  votos_branco: number;
  votos_nulos: number;
  total_votos_candidatos_alvo: number;
  total_potencial_conversao: number;
  latitude: number;
  longitude: number;
}

// Tipo dos locais de votação com granularidade completa (definido junto ao mapa)
export type LocalVotacaoData = LocalVotacao;

export default function HomePage() {
  const [abaAtiva, setAbaAtiva] = useState<TabType>('painel');
  const [conteudoAbaAtual, setConteudoAbaAtual] = useState<'drivers' | 'sites'>('drivers');
  const [termoBusca, setTermoBusca] = useState<string>('');
  const [modoPesquisado, setModoPesquisado] = useState<boolean>(false);
  // Local de votação em foco (sincroniza sidebar <-> mapa)
  const [localSelecionadoId, setLocalSelecionadoId] = useState<string | null>(null);

  // --------------------------------------------------------------------------
  // LOCAIS DE VOTAÇÃO: arquivo estático (public/dados/locais.json) baixado em
  // segundo plano ao abrir o site. Evita embutir ~10MB no JavaScript (crítico no celular).
  // --------------------------------------------------------------------------
  const [todosLocais, setTodosLocais] = useState<LocalVotacaoData[] | null>(null);
  const [erroLocais, setErroLocais] = useState<boolean>(false);
  const carregandoLocais = !todosLocais && !erroLocais;

  useEffect(() => {
    let cancelado = false;
    fetch('/dados/locais.json')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<LocalVotacaoData[]>;
      })
      .then((dados) => {
        if (!cancelado) setTodosLocais(dados);
      })
      .catch(() => {
        if (!cancelado) setErroLocais(true);
      });
    return () => {
      cancelado = true;
    };
  }, []);

  const normalizar = (texto: string) =>
    texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();

  const handleSelecionarBairro = (bairroNome: string) => {
    setTermoBusca(bairroNome);
    setModoPesquisado(true);
    setLocalSelecionadoId(null);
    setAbaAtiva('painel');
  };

  const handleResetBusca = () => {
    setTermoBusca('');
    setModoPesquisado(false);
    setLocalSelecionadoId(null);
  };

  const bairroSelecionado = useMemo(() => {
    if (!termoBusca.trim()) return null;
    const termo = normalizar(termoBusca);
    const listaBairros = dadosBairros as BairroData[];

    return (
      listaBairros.find(
        (b) => normalizar(b.bairro) === termo || normalizar(`${b.bairro} ${b.municipio}`) === termo
      ) ||
      listaBairros.find(
        (b) => normalizar(b.bairro).includes(termo) || normalizar(b.municipio).includes(termo)
      ) ||
      null
    );
  }, [termoBusca]);

  // --------------------------------------------------------------------------
  // LOCAIS DO BAIRRO RANQUEADOS POR POTENCIAL + FAIXA DE PRIORIDADE
  // Terço superior = Alta, terço do meio = Média, terço inferior = Baixa.
  // --------------------------------------------------------------------------
  const locaisRanqueados = useMemo<LocalRanqueado[]>(() => {
    if (!bairroSelecionado || !todosLocais) return [];

    const bairroNomeNorm = normalizar(bairroSelecionado.bairro);
    const municipioNomeNorm = normalizar(bairroSelecionado.municipio);

    const filtrados = todosLocais
      .filter(
        (local) =>
          normalizar(local.bairro) === bairroNomeNorm &&
          normalizar(local.municipio) === municipioNomeNorm
      )
      .sort((a, b) => b.total_potencial_conversao - a.total_potencial_conversao);

    const n = filtrados.length;
    return filtrados.map((local, i) => {
      const prioridade: Prioridade = i < Math.ceil(n / 3) ? 'alta' : i < Math.ceil((2 * n) / 3) ? 'media' : 'baixa';
      return { ...local, ranking: i + 1, prioridade };
    });
  }, [bairroSelecionado, todosLocais]);

  const centroMapa: [number, number] = bairroSelecionado
    ? [bairroSelecionado.latitude, bairroSelecionado.longitude]
    : [-8.0476, -34.8770];

  return (
    <div className="flex flex-col w-full h-dvh overflow-hidden font-sans bg-gray-900">
      
      {/* HEADER FIXO SUPERIOR */}
      <Header
        abaAtiva={abaAtiva}
        setAbaAtiva={setAbaAtiva}
        onResetBusca={handleResetBusca}
      />

      {/* ÁREA DE CONTEÚDO PRINCIPAL ADAPTÁVEL (ocupa todo o espaço abaixo do header) */}
      <div className="flex-1 min-h-0 w-full overflow-hidden relative">
        
        {abaAtiva === 'painel' && (
          <>
            {!modoPesquisado ? (
              <HeroSearch
                termoBusca={termoBusca}
                setTermoBusca={setTermoBusca}
                onSelecionarBairro={handleSelecionarBairro}
                dadosBairros={dadosBairros as BairroData[]}
              />
            ) : (
              /* LAYOUT DIVIDIDO RESPONSIVO (SIDEBAR 30% + MAPA 70% EM MD+, OU EMPILHADO EM TELAS PEQUENAS) */
              <div className="flex flex-col md:flex-row w-full h-full overflow-hidden">
                
                {/* SIDEBAR LATERAL DA ESQUERDA */}
                <aside className="order-2 md:order-1 w-full md:w-[30%] md:min-w-[320px] flex-1 min-h-0 md:flex-none md:h-full bg-red-600 text-white p-4 sm:p-6 overflow-y-auto flex flex-col justify-between shadow-2xl z-10 border-t md:border-t-0 md:border-r border-red-700 shrink-0">
                  <div className="space-y-4 sm:space-y-6">
                    
                    <div className="flex justify-between items-center pb-2 border-b border-red-500/60">
                      <span className="text-[11px] uppercase tracking-widest font-semibold text-red-200 block">
                        VIRA VOTO PE
                      </span>
                      <button
                        onClick={handleResetBusca}
                        className="text-xs font-bold text-white bg-red-700 hover:bg-red-800 px-3 py-1 rounded-lg border border-red-500 transition shadow-sm"
                      >
                        Nova Busca
                      </button>
                    </div>

                    <div className="flex justify-between items-center gap-2">
                      <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                        Painel de Votação
                      </h2>
                      <button
                        onClick={() => {
                          setAbaAtiva('sobre');
                          setTimeout(() => {
                            const el = document.getElementById('o-que-fazer');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }, 100);
                        }}
                        className="bg-yellow-400 text-gray-900 font-extrabold px-3 py-1.5 rounded-lg text-[10px] sm:text-xs hover:bg-yellow-300 transition-all shadow-md uppercase tracking-wider shrink-0 border border-yellow-500 flex items-center gap-1"
                      >
                        <span>O que fazer?</span>
                        <span>👉</span>
                      </button>
                    </div>

                    <div className="relative">
                      <label htmlFor="input-bairro-lateral" className="block text-xs font-bold uppercase text-red-100 mb-1">
                        Alterar Bairro
                      </label>
                      <input
                        id="input-bairro-lateral"
                        type="text"
                        value={termoBusca}
                        onChange={(e) => setTermoBusca(e.target.value)}
                        placeholder="Digite o nome do bairro..."
                        className="w-full px-4 py-2.5 rounded-lg bg-red-700 text-white placeholder-red-300 border border-red-500 focus:outline-none focus:ring-2 focus:ring-white focus:bg-red-800 transition font-medium text-base md:text-sm shadow-inner"
                      />
                      <div className="mt-1 text-[11px] text-red-200">
                        {bairroSelecionado ? (
                          <span>
                            Exibindo: <strong className="text-white">{bairroSelecionado.bairro}</strong> ({bairroSelecionado.municipio})
                          </span>
                        ) : (
                          <span className="text-red-200 opacity-80">Nenhum bairro encontrado para &quot;{termoBusca}&quot;.</span>
                        )}
                      </div>
                    </div>

                    {bairroSelecionado ? (
                      <div className="space-y-3 sm:space-y-4">
                        <div className="bg-white text-gray-900 p-4 rounded-xl shadow-lg border border-red-200">
                          <span className="text-xs font-bold text-red-600 uppercase tracking-wider block">
                            Total de Votos a Virar
                          </span>
                          <span className="text-2xl sm:text-3xl font-black text-red-600 block mt-0.5">
                            {bairroSelecionado.total_potencial_conversao.toLocaleString('pt-BR')}
                          </span>
                          <p className="text-[11px] text-gray-500 mt-1">
                            Potencial total de conversão do bairro (Abstenções + Nulos + Brancos + Alvos).
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                          <div className="bg-red-700/80 p-3 rounded-lg border border-red-500">
                            <span className="text-[11px] text-red-200 block font-medium">Abstenções</span>
                            <span className="text-lg font-bold text-white block mt-0.5">
                              {bairroSelecionado.abstencoes.toLocaleString('pt-BR')}
                            </span>
                          </div>

                          <div className="bg-red-700/80 p-3 rounded-lg border border-red-500">
                            <span className="text-[11px] text-red-200 block font-medium">Votos em Branco</span>
                            <span className="text-lg font-bold text-white block mt-0.5">
                              {bairroSelecionado.votos_branco.toLocaleString('pt-BR')}
                            </span>
                          </div>

                          <div className="bg-red-700/80 p-3 rounded-lg border border-red-500">
                            <span className="text-[11px] text-red-200 block font-medium">Votos Nulos</span>
                            <span className="text-lg font-bold text-white block mt-0.5">
                              {bairroSelecionado.votos_nulos.toLocaleString('pt-BR')}
                            </span>
                          </div>

                          <div className="bg-red-700/80 p-3 rounded-lg border border-red-500">
                            <span className="text-[11px] text-red-200 block font-medium">Votos Alvo</span>
                            <span className="text-lg font-bold text-white block mt-0.5">
                              {bairroSelecionado.total_votos_candidatos_alvo.toLocaleString('pt-BR')}
                            </span>
                          </div>
                        </div>

                        {/* ===========================================================
                            ONDE AGIR PRIMEIRO: LOCAIS RANQUEADOS POR POTENCIAL
                            Clique em um local para focar no mapa e ver a granularidade.
                            =========================================================== */}
                        <div className="bg-red-800/80 rounded-lg border border-red-600 overflow-hidden">
                          <div className="px-3 py-2 flex justify-between items-center border-b border-red-600">
                            <span className="text-xs font-black uppercase tracking-wider text-white">
                              Onde agir primeiro
                            </span>
                            <span className="font-bold text-white text-[11px] bg-red-600 px-2 py-0.5 rounded-md">
                              {locaisRanqueados.length} locais
                            </span>
                          </div>

                          {carregandoLocais ? (
                            <p className="p-3 text-[11px] text-red-200">Carregando locais de votação...</p>
                          ) : erroLocais ? (
                            <p className="p-3 text-[11px] text-yellow-200">
                              Não foi possível carregar os locais. Verifique a conexão e recarregue a página.
                            </p>
                          ) : locaisRanqueados.length === 0 ? (
                            <p className="p-3 text-[11px] text-red-200">
                              Nenhum local de votação georreferenciado para este bairro.
                            </p>
                          ) : (
                            <ul className="divide-y divide-red-700/70">
                              {locaisRanqueados.map((local) => {
                                const estilo = CORES_PRIORIDADE[local.prioridade];
                                const ativo = local.id === localSelecionadoId;
                                return (
                                  <li key={local.id}>
                                    <button
                                      onClick={() => setLocalSelecionadoId(local.id)}
                                      className={`w-full text-left px-3 py-2 flex items-center gap-2 transition ${
                                        ativo ? 'bg-white text-gray-900' : 'hover:bg-red-700 text-white'
                                      }`}
                                    >
                                      {/* Posição no ranking com a cor da prioridade */}
                                      <span
                                        className="w-6 h-6 shrink-0 rounded-full text-[10px] font-black flex items-center justify-center text-white border"
                                        style={{ backgroundColor: estilo.cor, borderColor: estilo.borda }}
                                      >
                                        {local.ranking}
                                      </span>
                                      <span className="flex-1 min-w-0">
                                        <span className="block text-xs font-bold truncate">{local.nome_local}</span>
                                        <span className={`block text-[10px] ${ativo ? 'text-gray-500' : 'text-red-200'}`}>
                                          Abst. {local.abstencoes.toLocaleString('pt-BR')} · B/N{' '}
                                          {(local.votos_branco + local.votos_nulos).toLocaleString('pt-BR')} · Alvo{' '}
                                          {local.total_votos_candidatos_alvo.toLocaleString('pt-BR')}
                                        </span>
                                      </span>
                                      <span className="text-xs font-black shrink-0">
                                        {local.total_potencial_conversao.toLocaleString('pt-BR')}
                                      </span>
                                    </button>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-red-700/60 p-4 rounded-lg text-center text-red-100 text-xs">
                        Digite o nome de um bairro no campo acima para carregar os dados.
                      </div>
                    )}
                  </div>

                  <div className="pt-3 mt-4 border-t border-red-500 text-[11px] text-red-200 text-center">
                    VIRA VOTO PE
                  </div>
                </aside>

                {/* MAPA LEAFLET: TAMANHO/COR POR PRIORIDADE + GRANULARIDADE NO POPUP
                    Mobile: aparece ACIMA do painel (order-1) com altura fixa em dvh.
                    Desktop: ocupa os 70% à direita. */}
                <main className="order-1 md:order-2 w-full md:w-[70%] h-[42dvh] shrink-0 md:h-full md:flex-1 bg-gray-100 relative">
                  <MapaVotacao
                    centro={centroMapa}
                    locais={locaisRanqueados}
                    localSelecionadoId={localSelecionadoId}
                    onSelecionarLocal={setLocalSelecionadoId}
                  />
                </main>
              </div>
            )}
          </>
        )}

        {abaAtiva === 'conteudos' && (
          <ConteudosView
            abaAtiva={conteudoAbaAtual}
            setAbaAtiva={setConteudoAbaAtual}
          />
        )}
        {abaAtiva === 'sobre' && (
          <SobreView
            setAbaAtiva={setAbaAtiva}
            setConteudoAbaAtual={setConteudoAbaAtual}
          />
        )}

      </div>
    </div>
  );
}

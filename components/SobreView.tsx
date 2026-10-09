'use client';

// ============================================================================
// COMPONENTE: SOBRE A VIRA VOTO PE
// Apresentação institucional do projeto, visão estratégica e canal de contato
// com a liderança (@viniciusgdlh).
// Organizado em seções claras com comentários estratégicos para manutenção.
// ============================================================================

import React from 'react';
import { TabType } from './Header';

interface SobreViewProps {
  setAbaAtiva: (aba: TabType) => void;
  setConteudoAbaAtual?: (aba: 'drivers' | 'sites') => void;
}

export default function SobreView({ setAbaAtiva, setConteudoAbaAtual }: SobreViewProps) {
  return (
    <div className="w-full h-full bg-gray-50 text-gray-900 p-4 sm:p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-8 pb-12">
        
        {/* ===================================================================
            SEÇÃO 1: CABEÇALHO DA PÁGINA SOBRE
            =================================================================== */}
        <div className="bg-gradient-to-r from-red-800 to-red-600 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-red-700 space-y-3">
          <span className="text-xs uppercase tracking-widest text-red-200 font-extrabold block">
            Plataforma Estratégica de Mobilização
          </span>
          <h2 className="text-2xl sm:text-4xl font-black">
            Sobre a plataforma
          </h2>
          <p className="text-sm sm:text-base text-red-100 max-w-2xl">
            Não somos nenhuma organização política. Apenas um trabalho de análise dos dados eleitorais que, inspirado no <a href="https://www.ondedapraconversar.com.br/#/perto" target="_blank" rel="noopener noreferrer" className="font-bold underline text-yellow-300 hover:text-yellow-400 transition-colors">ondedapraconversar</a>, resolveu fazer algo voltado para o estado de Pernambuco para tomada estratégica de ações dentro da lei, visando apresentar um verdadeiro projeto de defesa do Brasil, que é o do Presidente Lula!
          </p>
        </div>

        {/* ===================================================================
            NOVA SEÇÃO: O QUE FAZER?
            =================================================================== */}
        <div id="o-que-fazer" className="bg-gradient-to-r from-red-800 to-red-600 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-red-700 space-y-3 scroll-mt-24">
          <span className="text-xs uppercase tracking-widest text-red-200 font-extrabold block">
            Instrução Prática
          </span>
          <h2 className="text-2xl sm:text-4xl font-black">
            O que fazer?
          </h2>
          <p className="text-sm sm:text-base text-red-100 leading-relaxed font-medium">
            Após pesquisar seu bairro e <button onClick={() => setAbaAtiva('painel')} className="font-bold underline text-yellow-300 hover:text-yellow-400">localizar</button> os lugares estratégicos, conhecendo seu bairro, atue em lugares estratégicos como grandes comércios, integrações, feiras, ruas e avenidas que dão acesso ao colégio eleitoral escolhido no mapa. Entregue panfletos, cole lambes de alerta, converse com a população. Olhe os sites em nossa <button onClick={() => { setAbaAtiva('conteudos'); if(setConteudoAbaAtual) setConteudoAbaAtual('sites'); }} className="font-bold underline text-yellow-300 hover:text-yellow-400">área de conteúdo</button>, veja as argumentações para virar voto, acesse os <button onClick={() => { setAbaAtiva('conteudos'); if(setConteudoAbaAtual) setConteudoAbaAtual('drivers'); }} className="font-bold underline text-yellow-300 hover:text-yellow-400">drives</button>, veja conteúdos para panfletagem.
          </p>
        </div>

        {/* ===================================================================
            SEÇÃO 2: NOSSA VISÃO E PROPÓSITO
            =================================================================== */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-md space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
            <div className="w-3 h-8 bg-red-600 rounded-full"></div>
            <h3 className="text-xl sm:text-2xl font-black text-gray-900">
              Objetivo
            </h3>
          </div>

          <div className="text-sm sm:text-base text-gray-700 space-y-4 leading-relaxed font-medium">
            <p>
             Fortalecer a militância pró-Lula de Pernambuco disponibilizando repositórios de links, entre outras ferramentas, e uma análise eleitoral focada no estado. Os dados foram coletados diretamente do TSE e trazem análises objetivas de votos que podem e vão ser convertidos para o Presidente Lula.
            </p>
          </div>
        </div>

        {/* ===================================================================
            SEÇÃO 4: CANAL DE CONTATO E SUGESTÕES (INSTAGRAM @viniciusgdlh)
            =================================================================== */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-md space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
            <div className="w-3 h-8 bg-red-600 rounded-full"></div>
            <h3 className="text-xl sm:text-2xl font-black text-gray-900">
             Envie Sugestões
            </h3>
          </div>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-medium">
            Caso tenha ideias para fortalecer o projeto ou queira relatar bugs e erros, por favor, envie uma mensagem no direct.
          </p>

          {/* CARD DE DESTAQUE INSTAGRAM */}
          <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-6 rounded-2xl shadow-lg border border-red-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-red-200 block">
                Instagram Oficial
              </span>
              <span className="text-2xl sm:text-3xl font-black block text-white">
                @viniciusgdlh
              </span>
              <p className="text-xs text-red-100">
                Clique no botão ao lado para enviar uma mensagem via direct.
              </p>
            </div>

            <a
              href="https://instagram.com/viniciusgdlh"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-black text-sm px-6 py-3 rounded-xl shadow-md transition-transform hover:scale-105 shrink-0 uppercase tracking-wide"
            >
              <span>Enviar Mensagem</span>
              <span className="text-base">↗</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

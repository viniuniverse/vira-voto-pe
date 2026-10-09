'use client';

// ============================================================================
// COMPONENTE: HEADER DE NAVEGAÇÃO PRINCIPAL (ATUALIZADO)
// Navegação limpa por abas: Painel & Mapa, Conteúdos e Sobre.
// ============================================================================

import React from 'react';

// Definição dos tipos de abas ativas disponíveis no sistema
export type TabType = 'painel' | 'conteudos' | 'sobre';

interface HeaderProps {
  abaAtiva: TabType;
  setAbaAtiva: (aba: TabType) => void;
  onResetBusca?: () => void;
}

export default function Header({ abaAtiva, setAbaAtiva, onResetBusca }: HeaderProps) {
  return (
    <header className="w-full bg-red-700 text-white shadow-md border-b border-red-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        
        {/* LOGO E TÍTULO PRINCIPAL (no celular mostra só o selo "PE" para sobrar espaço às abas) */}
        <button
          onClick={() => {
            setAbaAtiva('painel');
            if (onResetBusca) onResetBusca();
          }}
          className="flex items-center gap-2 sm:gap-3 group text-left focus:outline-none shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-white text-red-700 flex items-center justify-center font-black text-xl shadow-md group-hover:scale-105 transition-transform">
            PE
          </div>
          <h1 className="hidden sm:block text-base sm:text-lg font-black tracking-tight text-white group-hover:text-red-100 transition-colors">
            VIRA VOTO PE
          </h1>
        </button>

        {/* NAVEGAÇÃO DE ABAS DA PLATAFORMA */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1 min-w-0">
          {/* Aba 1: Painel Eleitoral / Mapa */}
          <button
            onClick={() => setAbaAtiva('painel')}
            className={`px-2.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              abaAtiva === 'painel'
                ? 'bg-white text-red-700 shadow-md'
                : 'text-red-100 hover:bg-red-600 hover:text-white'
            }`}
          >
            Painel & Mapa
          </button>

          {/* Aba 2: Conteúdos */}
          <button
            onClick={() => setAbaAtiva('conteudos')}
            className={`px-2.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              abaAtiva === 'conteudos'
                ? 'bg-white text-red-700 shadow-md'
                : 'text-red-100 hover:bg-red-600 hover:text-white'
            }`}
          >
            Conteúdos
          </button>

          {/* Aba 3: Sobre */}
          <button
            onClick={() => setAbaAtiva('sobre')}
            className={`px-2.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              abaAtiva === 'sobre'
                ? 'bg-white text-red-700 shadow-md'
                : 'text-red-100 hover:bg-red-600 hover:text-white'
            }`}
          >
            Sobre
          </button>
        </nav>
      </div>
    </header>
  );
}

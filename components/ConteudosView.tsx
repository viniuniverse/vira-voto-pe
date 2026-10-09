'use client';

// ============================================================================
// COMPONENTE: CONTEÚDOS & MATERIAIS PARA DOWNLOAD
// Exibe 3 abas principais de materiais:
// 1. Panfletos & Impressos
// 2. Material Redes Sociais
// 3. Drivers Militância
// Inclui comentários estratégicos para organização e manutenção futura.
// ============================================================================

import React, { useState } from 'react';

// Interface para representação dos itens de material
export interface MaterialItem {
  id: string;
  titulo: string;
  categoria: 'drivers' | 'sites';
  formato: string;
  tamanho: string;
  descricao: string;
  corTag: string;
  linkDownload?: string;
  isDestaque?: boolean;
}

// Lista de materiais cadastrados dividida nas abas solicitadas
const LISTA_MATERIAIS: MaterialItem[] = [
  // --------------------------------------------------------------------------
  // ABA 1: DRIVERS MILITÂNCIA
  // --------------------------------------------------------------------------
    {
    id: 'mat-9',
    titulo: 'Drive Diverso - Público',
    categoria: 'drivers',
    formato: 'Link do Drive',
    tamanho: 'Nuvem (Online)',
    descricao: 'Drive diverso, com vídeos e imagens direcionados por público. Ideal para lambes e vídeos rápidos!',
    corTag: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    linkDownload: 'https://drive.google.com/drive/u/0/folders/1LbYfXCnnI7-APqRltwTfp7GbAxsdbCnz?fbclid=PAb21jcAU07ahleHRuA2FlbQIxMQBwZG9mAnNydGMGYXBwX2lkDzU2NzA2NzM0MzM1MjQyNwABp0Wol5RMhUw6cfkCXjU0owyocuCfR-VVz1rfz6i801dIH98l3vD1BiZs_2xR_aem_r8zjBo25xx8O_UINaKQ9Nw',
    isDestaque: true,
  },
  {
    id: 'mat-7',
    titulo: 'Comunidade TI - Imagens',
    categoria: 'drivers',
    formato: 'Link do Drive',
    tamanho: 'Nuvem (Online)',
    descricao: 'Drive criado pela comunidade de TI contra o miliciano. Aqui você irá encontrar mais imagens!',
    corTag: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    linkDownload: 'https://drive.google.com/drive/folders/1qO60snO0Ws_bJCHQvq5399LXMRVpI3-r',
  },
  {
    id: 'mat-8',
    titulo: 'Comunidade TI - Vídeos',
    categoria: 'drivers',
    formato: 'Link do Drive',
    tamanho: 'Nuvem (Online)',
    descricao: 'Drive criado pela comunidade de TI contra o miliciano. Aqui você irá encontrar mais vídeos!',
    corTag: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    linkDownload: 'https://drive.google.com/drive/folders/1qVQe40ykmlBZfHfgkTlEGjVA4n9rQ_2j',
  },


  // --------------------------------------------------------------------------
  // ABA 2: SITES PARA FICAR LIGADO
  // --------------------------------------------------------------------------
  {
    id: 'mat-10',
    titulo: 'Jones Manoel 2026 - Vídeos',
    categoria: 'sites',
    formato: 'Link Web',
    tamanho: 'Online',
    descricao: 'O Jones Manoel disponibilizou em seu site a aba de vídeos para baixar diversos conteúdos para compartilhar. Fure sua bolha, compartilhe no status do WhatsApp, no Facebook, compartilhe com aquela pessoa que irá votar no Lula, mas não está em sua bolha do dia a dia, peça para ela compartilhar ao menos uma vez nos grupos de que faz parte.',
    corTag: 'bg-blue-100 text-blue-800 border-blue-200',
    linkDownload: 'https://www.jonesmanoel2026.com.br/videos',
  },
  {
    id: 'mat-11',
    titulo: 'Onde Dá Pra Conversar',
    categoria: 'sites',
    formato: 'Link Web',
    tamanho: 'Online',
    descricao: 'Site que faz leitura dos votos do TSE de uma forma nacional, indicado para você que não é de Pernambuco e quer saber locais estratégicos para agir. Também contém bastante informação didática sobre convencimento para a troca de voto.',
    corTag: 'bg-blue-100 text-blue-800 border-blue-200',
    linkDownload: 'https://www.ondedapraconversar.com.br/#/perto/@-7.985,-34.880',
  },
  {
    id: 'mat-12',
    titulo: 'Mapa Segundo Turno - Corrupção',
    categoria: 'sites',
    formato: 'Link Web',
    tamanho: 'Online',
    descricao: 'Site que traz alguns escândalos do miliciano, coisas que você pode argumentar com aquela pessoa que repete que "Lula é ladrão". Mostre fatos, não fique só no site, pegue a informação e vá pesquisar matérias em sites confiáveis para enviar para a pessoa.',
    corTag: 'bg-blue-100 text-blue-800 border-blue-200',
    linkDownload: 'https://mapasegundoturno.com.br/corrupcao',
  },
];

interface ConteudosViewProps {
  abaAtiva?: 'drivers' | 'sites';
  setAbaAtiva?: (aba: 'drivers' | 'sites') => void;
}

export default function ConteudosView({ abaAtiva = 'drivers', setAbaAtiva }: ConteudosViewProps) {
  const [downloadConcluido, setDownloadConcluido] = useState<string | null>(null);

  // Filtragem dos materiais de acordo com a aba selecionada
  const materiaisFiltrados = LISTA_MATERIAIS.filter((item) => item.categoria === abaAtiva);

  // Função para simular ou realizar o download do material
  const handleDownload = (material: MaterialItem) => {
    setDownloadConcluido(material.id);
    
    if (material.linkDownload) {
      window.open(material.linkDownload, '_blank');
    } else {
      const blob = new Blob([`VIRA VOTO PE - Material: ${material.titulo}\nFormato: ${material.formato}`], {
        type: 'text/plain;charset=utf-8',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${material.id}-${material.categoria}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    setTimeout(() => {
      setDownloadConcluido(null);
    }, 3000);
  };

  return (
    <div className="w-full h-full bg-gray-50 text-gray-900 p-4 sm:p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        
        {/* ===================================================================
            CABEÇALHO DA CENTRAL DE CONTEÚDOS
            =================================================================== */}
        <div className="bg-red-700 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-red-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-red-200 font-extrabold block">
              Central de Mobilização & Propaganda
            </span>
            <h2 className="text-2xl sm:text-4xl font-black mt-1">
              Materiais Oficiais da Campanha
            </h2>
            <p className="text-sm text-red-100 mt-1 max-w-xl">
              Navegue pelas abas abaixo para baixar panfletos, materiais para redes sociais ou acessar os drives em nuvem da militância.
            </p>
          </div>
        </div>

        {/* ===================================================================
            NAVEGAÇÃO DAS 3 ABAS SOLICITADAS
            =================================================================== */}
        <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-4">
          <button
            onClick={() => setAbaAtiva && setAbaAtiva('drivers')}
            className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
              abaAtiva === 'drivers'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Drives
          </button>

          <button
            onClick={() => setAbaAtiva && setAbaAtiva('sites')}
            className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
              abaAtiva === 'sites'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            SITES PARA FICAR LIGADO
          </button>
        </div>

        {/* ===================================================================
            GRID DE EXIBIÇÃO DOS MATERIAIS DA ABA ATIVA
            =================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materiaisFiltrados.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-2xl p-6 border ${
                item.isDestaque ? 'border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.4)] relative' : 'border-gray-200 shadow-md'
              } hover:shadow-xl transition-all flex flex-col justify-between`}
            >
              {item.isDestaque && (
                <div className="absolute -top-3 right-3 sm:-right-3 bg-yellow-400 text-gray-900 text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-md">
                  Destaque
                </div>
              )}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase border ${item.corTag}`}>
                    {item.formato}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-extrabold text-gray-900 leading-snug">
                    {item.titulo}
                  </h3>
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                    {item.descricao}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-semibold text-gray-400">
                  {item.categoria === 'drivers' ? 'Status: ' : 'Tamanho: '}
                  <strong className="text-gray-700">{item.tamanho}</strong>
                </span>

                <button
                  onClick={() => handleDownload(item)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
                    downloadConcluido === item.id
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-red-600 hover:bg-red-700 text-white shadow-md'
                  }`}
                >
                  {downloadConcluido === item.id
                    ? 'Acessado!'
                    : item.categoria === 'drivers'
                    ? 'Abrir Drive'
                    : 'Acessar link'}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

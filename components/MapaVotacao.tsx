'use client';

// ============================================================================
// COMPONENTE DO MAPA INTERATIVO (LEAFLET) - DIRECIONAMENTO DE AÇÕES
// Carregado dinamicamente no page.tsx com { ssr: false } para evitar 'window is not defined'.
//
// O que este mapa entrega:
// 1. Marcadores com TAMANHO proporcional ao potencial de conversão do local.
// 2. Marcadores com COR por faixa de prioridade (Alta / Média / Baixa) dentro do bairro.
// 3. Popup com a GRANULARIDADE dos votos (abstenções, brancos, nulos, candidatos-alvo).
// 4. Enquadramento automático em todos os locais do bairro e foco no local selecionado.
// ============================================================================

import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import type { CircleMarker as LeafletCircleMarker } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CORES_PRIORIDADE, type LocalRanqueado, type Prioridade } from './prioridade';

// ----------------------------------------------------------------------------
// PROPS DO MAPA (tipos de dados ficam em ./prioridade.ts)
// ----------------------------------------------------------------------------
interface MapaVotacaoProps {
  centro: [number, number];
  locais: LocalRanqueado[];
  localSelecionadoId: string | null;
  onSelecionarLocal: (id: string) => void;
}

// Nomes legíveis dos candidatos-alvo (chaves vindas do ETL)
const NOMES_CANDIDATOS: Record<string, string> = {
  augusto_cury: 'Augusto Cury',
  renan_santos: 'Renan Santos',
  ronaldo_caiado: 'Ronaldo Caiado',
  zema: 'Zema',
  clariana_barao: 'Clariana Barão',
  wilson_grassi: 'Wilson Grassi',
};

const fmt = (n: number) => (n || 0).toLocaleString('pt-BR');

// ----------------------------------------------------------------------------
// CONTROLLER: enquadra o bairro inteiro e voa até o local selecionado
// ----------------------------------------------------------------------------
function ControllerMapa({
  centro,
  locais,
  localSelecionadoId,
  marcadores,
}: {
  centro: [number, number];
  locais: LocalRanqueado[];
  localSelecionadoId: string | null;
  marcadores: React.MutableRefObject<Record<string, LeafletCircleMarker | null>>;
}) {
  const map = useMap();

  // Ao trocar de bairro: enquadra todos os locais (ou centraliza no bairro)
  useEffect(() => {
    if (locais.length > 0) {
      const bounds = locais.map((l) => [l.latitude, l.longitude] as [number, number]);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
    } else if (centro[0] !== 0 && centro[1] !== 0) {
      map.setView(centro, 14, { animate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [centro[0], centro[1], locais.length, map]);

  // Ao selecionar um local (pela sidebar ou clique): foca e abre o popup
  useEffect(() => {
    if (!localSelecionadoId) return;
    const local = locais.find((l) => l.id === localSelecionadoId);
    if (!local) return;
    map.flyTo([local.latitude, local.longitude], Math.max(map.getZoom(), 16), { duration: 0.6 });
    marcadores.current[localSelecionadoId]?.openPopup();
  }, [localSelecionadoId, locais, map, marcadores]);

  return null;
}

// ----------------------------------------------------------------------------
// COMPONENTE PRINCIPAL DO MAPA
// ----------------------------------------------------------------------------
export default function MapaVotacao({
  centro,
  locais,
  localSelecionadoId,
  onSelecionarLocal,
}: MapaVotacaoProps) {
  const posicaoInicial: [number, number] = centro[0] !== 0 ? centro : [-8.0476, -34.877];
  const marcadores = useRef<Record<string, LeafletCircleMarker | null>>({});

  // Escala do raio: proporcional à raiz do potencial (área do círculo ~ votos)
  const maxPotencial = Math.max(1, ...locais.map((l) => l.total_potencial_conversao));
  const raio = (potencial: number) => 7 + Math.sqrt(potencial / maxPotencial) * 18;

  // Desenha os menores por último? Não: desenha os MAIORES primeiro para os pequenos ficarem clicáveis
  const locaisOrdenados = [...locais].sort(
    (a, b) => b.total_potencial_conversao - a.total_potencial_conversao
  );

  return (
    <div className="w-full h-full relative">
      <MapContainer center={posicaoInicial} zoom={13} scrollWheelZoom className="w-full h-full z-0">
        <ControllerMapa
          centro={centro}
          locais={locais}
          localSelecionadoId={localSelecionadoId}
          marcadores={marcadores}
        />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {locaisOrdenados.map((local) => {
          const estilo = CORES_PRIORIDADE[local.prioridade];
          const selecionado = local.id === localSelecionadoId;
          const aptos = local.eleitores_aptos || 0;
          const taxaAbstencao = aptos > 0 ? (local.abstencoes / aptos) * 100 : 0;
          const candidatos = Object.entries(local.votos_candidatos || {})
            .filter(([, v]) => v > 0)
            .sort((a, b) => b[1] - a[1]);

          return (
            <CircleMarker
              key={local.id}
              ref={(ref) => {
                marcadores.current[local.id] = ref;
              }}
              center={[local.latitude, local.longitude]}
              radius={raio(local.total_potencial_conversao)}
              eventHandlers={{ click: () => onSelecionarLocal(local.id) }}
              pathOptions={{
                color: selecionado ? '#111827' : estilo.borda,
                fillColor: estilo.cor,
                fillOpacity: selecionado ? 0.95 : 0.7,
                weight: selecionado ? 4 : 2,
              }}
            >
              {/* POPUP COM A GRANULARIDADE DOS VOTOS DO LOCAL */}
              <Popup minWidth={220} maxWidth={280} maxHeight={260} autoPanPadding={[16, 16]}>
                <div className="font-sans text-gray-800 space-y-2">
                  <div>
                    <span
                      className="inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded text-white"
                      style={{ backgroundColor: estilo.cor }}
                    >
                      #{local.ranking} · {estilo.rotulo}
                    </span>
                    <h3 className="font-bold text-sm text-gray-900 mt-1 leading-snug">{local.nome_local}</h3>
                    <p className="text-[11px] text-gray-500 leading-tight">📍 {local.endereco}</p>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded p-2 text-center">
                    <span className="block text-[10px] uppercase tracking-wider text-red-600 font-semibold">
                      Potencial de Conversão
                    </span>
                    <span className="text-lg font-extrabold text-red-700">
                      {fmt(local.total_potencial_conversao)} votos
                    </span>
                    <span className="block text-[10px] text-gray-500">
                      de {fmt(aptos)} eleitores aptos
                    </span>
                  </div>

                  {/* Quebra do potencial */}
                  <div className="grid grid-cols-2 gap-1 text-[11px]">
                    <div className="bg-gray-100 rounded px-2 py-1">
                      Abstenções: <strong>{fmt(local.abstencoes)}</strong>
                      <span className="text-gray-500"> ({taxaAbstencao.toFixed(1)}%)</span>
                    </div>
                    <div className="bg-gray-100 rounded px-2 py-1">
                      Brancos: <strong>{fmt(local.votos_branco)}</strong>
                    </div>
                    <div className="bg-gray-100 rounded px-2 py-1">
                      Nulos: <strong>{fmt(local.votos_nulos)}</strong>
                    </div>
                    <div className="bg-gray-100 rounded px-2 py-1">
                      Alvo: <strong>{fmt(local.total_votos_candidatos_alvo)}</strong>
                    </div>
                  </div>

                  {/* Votos por candidato-alvo */}
                  {candidatos.length > 0 && (
                    <div className="text-[11px] border-t border-gray-200 pt-1">
                      <span className="block font-semibold text-gray-700 mb-0.5">Votos em candidatos-alvo:</span>
                      {candidatos.map(([chave, votos]) => (
                        <div key={chave} className="flex justify-between">
                          <span>{NOMES_CANDIDATOS[chave] || chave}</span>
                          <strong>{fmt(votos)}</strong>
                        </div>
                      ))}
                    </div>
                  )}

                  {typeof local.qtd_secoes === 'number' && (
                    <p className="text-[10px] text-gray-500 text-right">{local.qtd_secoes} seções eleitorais</p>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* LEGENDA FIXA DO MAPA */}
      <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 z-[400] bg-white/95 rounded-lg md:rounded-xl shadow-lg border border-gray-200 p-2 md:p-3 text-[10px] md:text-[11px] text-gray-800 space-y-0.5 md:space-y-1">
        <span className="block font-black uppercase tracking-wider text-gray-900 text-[10px]">Onde agir</span>
        {(Object.keys(CORES_PRIORIDADE) as Prioridade[]).map((p) => (
          <div key={p} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full border"
              style={{ backgroundColor: CORES_PRIORIDADE[p].cor, borderColor: CORES_PRIORIDADE[p].borda }}
            />
            {CORES_PRIORIDADE[p].rotulo}
          </div>
        ))}
        <span className="block text-gray-500 pt-1">Tamanho = votos a conquistar</span>
      </div>
    </div>
  );
}

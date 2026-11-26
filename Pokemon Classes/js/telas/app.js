// Partes comuns aos 3 modelos: cabeçalho, barra de filtros e estados (carregando, erro, vazio).
import { html } from '../lib.js'
import { pokebola, carregando, icone, campoBusca, seletorGeracao } from '../ui.js'

export function cabecalho(v) {
    return html`
        <header style="position:sticky;top:0;z-index:30;background:#144376;color:#fff;">
            <div style="max-width:1280px;margin:0 auto;padding:10px 24px;min-height:64px;display:flex;flex-wrap:wrap;align-items:center;gap:12px 20px;">
                <button onClick=${v.editModel} title="Escolher outro modelo de Pokédex" class="hv-chip" style="display:flex;align-items:center;gap:10px;height:40px;padding:0 10px 0 6px;margin-left:-6px;border-radius:10px;border:0;background:transparent;color:#fff;cursor:pointer;">
                    ${pokebola({ tamanho: 26, borda: 2, faixa: 2, botao: 9 })}
                    <span style="font-size:18px;font-weight:600;letter-spacing:-.01em;">Pokédex</span>
                    <span style="display:inline-flex;color:#DBE5F0;">${icone.trocar()}</span>
                </button>
                <div style="display:flex;gap:4px;padding:4px;background:rgba(255,255,255,.08);border-radius:10px;">
                    ${v.models.map(m => html`
                        <button key=${m.k} onClick=${m.pick} style="height:32px;padding:0 12px;border-radius:8px;border:0;font-size:13px;font-weight:500;cursor:pointer;background:${m.tabBg};color:${m.tabFg};transition:background .15s,color .15s;">${m.label}</button>`)}
                </div>
                <div style="flex:1;"></div>
                <button onClick=${v.openBag} title="Abrir a mochila" class="hv-chip" style="display:flex;align-items:center;gap:10px;height:44px;padding:0 12px 0 6px;border-radius:10px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.06);color:#fff;cursor:pointer;">
                    <span style="width:32px;height:32px;border-radius:8px;background:rgba(255,255,255,.12);display:grid;place-items:center;">${icone.mochila(18, '#fff')}</span>
                    <span style="display:flex;flex-direction:column;align-items:flex-start;line-height:1.2;">
                        <span style="font-size:10px;font-weight:700;letter-spacing:.06em;color:#DBE5F0;">MOCHILA</span>
                        <span style="font-size:14px;font-weight:600;">${v.bagCount} de ${v.bagMax}</span>
                    </span>
                    ${v.bagMini.length > 0 && html`
                        <span style="display:flex;align-items:center;">
                            ${v.bagMini.map((p, i) => html`<img key=${p.id} src=${p.src} alt="" style="width:28px;height:28px;margin-left:${i ? -8 : 0}px;image-rendering:pixelated;animation:pdPop .35s both;" />`)}
                        </span>`}
                </button>
                ${v.hasFav && html`
                    <div style="display:flex;align-items:center;gap:6px;">
                        <button onClick=${v.goFav} title="Ir para o favorito" class="hv-chip" style="display:flex;align-items:center;gap:10px;height:44px;padding:0 12px 0 4px;border-radius:10px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.06);color:#fff;cursor:pointer;">
                            <img src=${v.favSrc} data-fb=${v.favFb} alt="" style="width:40px;height:40px;object-fit:contain;image-rendering:pixelated;animation:pdBob 1.8s ease-in-out infinite;" />
                            <span style="display:flex;flex-direction:column;align-items:flex-start;line-height:1.2;">
                                <span style="font-size:10px;font-weight:700;letter-spacing:.06em;color:#DBE5F0;">FAVORITO</span>
                                <span style="font-size:14px;font-weight:600;">${v.favName}</span>
                            </span>
                        </button>
                        <button onClick=${v.changeFav} class="hv-fantasma-escuro" style="height:32px;padding:0 12px;border-radius:8px;border:0;background:transparent;color:#DBE5F0;font-size:12px;font-weight:500;cursor:pointer;">Trocar</button>
                    </div>`}
            </div>
        </header>`
}

export function barraDeFiltros(v) {
    return html`
        <div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-bottom:12px;">
            ${campoBusca(v.query, v.onQuery)}
            ${seletorGeracao(v.gens, v.gen, v.onGen)}
            <button onClick=${v.toggleShiny} class="btn" style="padding:0 14px;border:1px solid ${v.shinyBorder};background:${v.shinyBg};color:${v.shinyFg};transition:background .15s,color .15s;">
                ${icone.brilho()}Shiny
            </button>
            <span style="margin-left:auto;font-size:13px;color:#586675;">${v.countLabel}</span>
        </div>
        <div style="display:flex;gap:6px;overflow-x:auto;padding-bottom:6px;margin-bottom:18px;">
            ${v.typeChips.map(t => html`
                <button key=${t.k} onClick=${t.go} style="flex:none;height:30px;padding:0 10px;border-radius:8px;border:1px solid ${t.border};background:${t.bg};color:${t.fg};font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:6px;cursor:pointer;transition:background .15s,color .15s;">
                    <span style="width:8px;height:8px;border-radius:50%;background:${t.dot};"></span>${t.label}
                </button>`)}
        </div>`
}

export function estadosDaLista(v) {
    return html`
        ${v.loading && carregando()}
        ${v.hasError && html`
            <div class="cartao" style="padding:48px 24px;display:flex;flex-direction:column;align-items:center;gap:10px;text-align:center;">
                <div style="font-size:15px;font-weight:600;">${v.error}</div>
                <div style="font-size:13px;color:#586675;">Verifique a conexão e tente de novo.</div>
                <button class="btn btn-outline" onClick=${v.retry}>Tentar de novo</button>
            </div>`}
        ${v.isEmpty && html`
            <div class="cartao" style="padding:48px 24px;display:flex;flex-direction:column;align-items:center;gap:10px;text-align:center;">
                <div style="width:56px;height:56px;border-radius:50%;background:#EAF0F6;display:grid;place-items:center;">${icone.buscaGrande()}</div>
                <div style="font-size:15px;font-weight:600;">Nenhum Pokémon encontrado</div>
                <div style="font-size:13px;color:#586675;">Tente outro nome, tipo ou geração.</div>
                <button class="btn btn-sm btn-outline" onClick=${v.clearFilters}>Limpar filtros</button>
            </div>`}`
}

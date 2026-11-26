// Peças de interface usadas em várias telas: Pokébola, carregamento, selos de tipo e ícones.
import { html } from './lib.js'

// Pokébola feita só com CSS (logo, spinner e bola da captura).
export function pokebola({ tamanho, borda, faixa, botao, animacao = 'none', animacaoBotao = 'none' }) {
    return html`
        <div style="position:relative;width:${tamanho}px;height:${tamanho}px;border-radius:50%;overflow:hidden;border:${borda}px solid #1B2733;background:#fff;flex:none;animation:${animacao};">
            <div style="position:absolute;left:0;right:0;top:0;height:50%;background:#C0392B;"></div>
            <div style="position:absolute;left:0;right:0;top:50%;height:${faixa}px;margin-top:${-faixa / 2}px;background:#1B2733;"></div>
            <div style="position:absolute;left:50%;top:50%;width:${botao}px;height:${botao}px;margin:${-botao / 2}px 0 0 ${-botao / 2}px;border-radius:50%;background:#fff;border:${borda}px solid #1B2733;animation:${animacaoBotao};"></div>
        </div>`
}

// "Carregando dados da PokéAPI…" com a Pokébola girando.
export function carregando({ tamanho = 48, botao = 14, espaco = '100px 0', gap = 14 } = {}) {
    return html`
        <div style="padding:${espaco};display:flex;flex-direction:column;align-items:center;gap:${gap}px;font-size:13px;color:#586675;">
            ${pokebola({ tamanho, borda: 3, faixa: 3, botao, animacao: 'pdSpin .9s linear infinite' })}
            Carregando dados da PokéAPI…
        </div>`
}

export function selosTipo(tipos, estiloExtra = '') {
    return tipos.map(t => html`<span class="badge" style="background:${t.bg};color:${t.fg};${estiloExtra}">${t.label}</span>`)
}

export function fato(rotulo, valor) {
    return html`<div class="fato"><div class="fato-rotulo">${rotulo}</div><div class="fato-valor">${valor}</div></div>`
}

// Ícones no estilo lucide (viewBox 24).
export const icone = {
    busca: () => html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8893A2" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path></svg>`,
    buscaGrande: () => html`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1B5BA0" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path></svg>`,
    som: () => html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5Z"></path><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"></path></svg>`,
    somClassico: () => html`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5Z"></path><path d="M15.5 8.5a5 5 0 0 1 0 7"></path></svg>`,
    brilho: () => html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"></path></svg>`,
    setaDireita: () => html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>`,
    anterior: (cor = 'currentColor') => html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke=${cor} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 6-6 6 6 6"></path></svg>`,
    proximo: (cor = 'currentColor') => html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke=${cor} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"></path></svg>`,
    fechar: (tamanho = 16) => html`<svg width=${tamanho} height=${tamanho} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"></path></svg>`,
    mochila: (tamanho = 16, cor = 'currentColor', estilo = '') => html`<svg width=${tamanho} height=${tamanho} viewBox="0 0 24 24" fill="none" stroke=${cor} stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style=${estilo}><path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"></path><path d="M8 10h8"></path><path d="M8 18h8"></path><path d="M8 22v-6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6"></path><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"></path></svg>`,
    check: (tamanho = 16, cor = 'currentColor') => html`<svg width=${tamanho} height=${tamanho} viewBox="0 0 24 24" fill="none" stroke=${cor} stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>`,
    trocar: () => html`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"></path></svg>`,
    estrela: (tamanho = 16, cor = 'currentColor', estilo = '') => html`<svg width=${tamanho} height=${tamanho} viewBox="0 0 24 24" fill=${cor} style=${estilo}><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z"></path></svg>`,
    coracao: () => html`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1B5BA0" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-4.4-9.3-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.3 6c-2.3 4.6-9.3 9-9.3 9Z"></path></svg>`,
    triangulo: d => html`<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d=${d}></path></svg>`,
}

export function campoBusca(valor, aoDigitar, estilo = 'flex:1 1 240px;max-width:360px;') {
    return html`
        <div class="campo-busca" style=${estilo}>
            ${icone.busca()}
            <input class="input" value=${valor} onInput=${aoDigitar} placeholder="Buscar por nome ou número" />
        </div>`
}

// Bolinhas de cor do aparelho Clássica.
export function seletorCor(cores, tamanho = 30) {
    return html`
        <div role="radiogroup" aria-label="Cor do aparelho" style="display:flex;gap:10px;flex-wrap:wrap;">
            ${cores.map(c => html`
                <button key=${c.k} role="radio" aria-checked=${c.ativo} title=${c.nome} onClick=${c.pick} class="cor-bolinha"
                    style="width:${tamanho}px;height:${tamanho}px;border-radius:50%;background:${c.casco};border:2px solid ${c.borda};box-shadow:${c.ativo ? `0 0 0 3px #fff,0 0 0 5px ${c.casco}` : 'none'};">
                    ${c.ativo && icone.check(tamanho * 0.5, '#fff')}
                </button>`)}
        </div>`
}

// Botão "Pôr na mochila" / "Na mochila" / "Mochila cheia" usado no Catálogo e no Scanner.
export function botaoMochila(v) {
    const estilo = v.inBag
        ? 'border:1px solid #1B5BA0;background:#EAF0F6;color:#1B5BA0;'
        : 'border:1px solid #C3CCD8;background:#fff;color:#586675;'
    return html`
        <button class="btn" onClick=${v.toggleBagSel} title=${v.inBag ? 'Tirar da mochila' : v.bagFull ? 'Abrir a mochila para liberar espaço' : 'Pôr na mochila'}
            style="${estilo}transition:background .15s,color .15s,border-color .15s;">
            ${v.inBag ? icone.check(16) : icone.mochila(16)}${v.bagBtnLabel}
        </button>`
}

export function seletorGeracao(gens, valor, aoMudar) {
    return html`
        <select class="select" value=${valor} onChange=${aoMudar}>
            ${gens.map(g => html`<option key=${g.k} value=${g.k}>${g.label}</option>`)}
        </select>`
}

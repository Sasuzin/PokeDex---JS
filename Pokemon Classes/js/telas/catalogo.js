// Modelo 02, Catálogo: grade com busca e filtros; cada Pokémon abre uma ficha lateral completa.
import { html } from '../lib.js'
import { selosTipo, icone, fato, botaoMochila } from '../ui.js'

function cartao(p) {
    return html`
        <button key=${p.id} onClick=${p.open} class="hv-sobe-borda" style="text-align:left;background:#fff;border:1px solid ${p.border};border-radius:10px;padding:12px;cursor:pointer;display:flex;flex-direction:column;gap:10px;color:#1B2733;transition:transform .18s,border-color .18s;animation:pdFadeUp .45s ease both;animation-delay:${p.delay};">
            <div style="position:relative;height:118px;display:grid;place-items:center;background:${p.tint};border-radius:8px;overflow:hidden;">
                <span style="position:absolute;right:-22px;bottom:-22px;width:96px;height:96px;border-radius:50%;border:14px solid rgba(255,255,255,.55);"></span>
                <span class="mono" style="position:absolute;top:8px;left:10px;font-weight:700;font-size:11px;color:#1B2733;opacity:.7;">${p.num}</span>
                <span style="position:absolute;top:8px;right:8px;display:flex;gap:4px;">
                    ${p.inBag && html`<span title="Na mochila" style="display:inline-flex;">${icone.mochila(16, '#1B5BA0')}</span>`}
                    ${p.isFav && icone.estrela(16, '#B7791A')}
                </span>
                <img src=${p.src} data-fb=${p.fb} alt="" loading="lazy" style="position:relative;width:96px;height:96px;image-rendering:pixelated;" />
            </div>
            <div style="display:flex;flex-direction:column;gap:6px;padding:0 2px 2px;">
                <span style="font-size:14px;font-weight:600;">${p.label}</span>
                <div style="display:flex;gap:4px;flex-wrap:wrap;">${selosTipo(p.types)}</div>
            </div>
        </button>`
}

function gaveta(v) {
    return html`
        <div onClick=${v.closeDrawer} style="position:fixed;inset:0;z-index:40;background:rgba(27,39,51,.45);animation:pdFade .2s ease both;"></div>
        <aside style="position:fixed;top:0;right:0;bottom:0;z-index:41;width:460px;max-width:100vw;background:#fff;border-left:1px solid #D6DDE6;box-shadow:0 12px 30px rgba(16,24,40,.13);overflow-y:auto;animation:pdSlide .32s cubic-bezier(.2,.9,.3,1) both;display:flex;flex-direction:column;">
            <div style="display:flex;align-items:center;gap:8px;padding:14px 16px 14px 20px;border-bottom:1px solid #D6DDE6;">
                <span class="badge" style="border:1px solid #D6DDE6;color:#586675;">${v.selNum}</span>
                <div style="flex:1;"></div>
                <button onClick=${v.prev} title="Anterior (←)" class="btn-icon outline">${icone.anterior()}</button>
                <button onClick=${v.next} title="Próximo (→)" class="btn-icon outline">${icone.proximo()}</button>
                <button onClick=${v.closeDrawer} title="Fechar (Esc)" class="btn-icon ghost">${icone.fechar()}</button>
            </div>
            <div style="position:relative;height:260px;flex:none;background:${v.tint};display:grid;place-items:center;overflow:hidden;">
                <div style="position:absolute;width:250px;height:250px;border-radius:50%;border:22px solid rgba(255,255,255,.5);animation:pdSpin 18s linear infinite;"><div style="position:absolute;left:-22px;right:-22px;top:50%;height:22px;margin-top:-11px;background:rgba(255,255,255,.5);"></div></div>
                <div style="position:relative;animation:pdFloat 3s ease-in-out infinite;">${v.drawerHero}</div>
            </div>
            <div style="padding:20px 24px 28px;display:flex;flex-direction:column;gap:18px;">
                <div>
                    <div style="font-size:24px;font-weight:700;letter-spacing:-.02em;">${v.selName}</div>
                    <div style="font-size:13px;color:#586675;margin-top:2px;">${v.selGenus}</div>
                </div>
                <div style="display:flex;gap:6px;flex-wrap:wrap;">${selosTipo(v.selTypes)}</div>
                <div style="display:flex;gap:10px;flex-wrap:wrap;">
                    <button class="btn btn-outline" onClick=${v.playCry}>${icone.som()}Ouvir grito</button>
                    <button class="btn" onClick=${v.setFavSel} style="border:0;background:${v.favBtnBg};color:#fff;transition:background .15s;">${icone.estrela()}${v.favLabel}</button>
                    ${botaoMochila(v)}
                </div>
                <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;">
                    ${fato('ALTURA', v.selH)}
                    ${fato('PESO', v.selW)}
                    ${fato('CAPTURA', v.captureRate)}
                </div>
                <div style="font-size:13px;color:#586675;"><b style="color:#1B2733;font-weight:600;">Habilidades:</b> ${v.selAbilities}</div>
                <div style="display:flex;flex-direction:column;gap:9px;">
                    <div class="fato-rotulo" style="display:flex;justify-content:space-between;"><span>ATRIBUTOS BASE</span><span>TOTAL ${v.total}</span></div>
                    ${v.stats.map(st => html`
                        <div style="display:grid;grid-template-columns:84px 32px minmax(0,1fr);gap:10px;align-items:center;">
                            <span style="font-size:12px;color:#586675;">${st.label}</span>
                            <span style="font-size:13px;font-weight:600;text-align:right;">${st.v}</span>
                            <div style="height:8px;background:#EDF0F4;border-radius:4px;overflow:hidden;"><div style="height:100%;width:${st.w};background:${st.color};border-radius:4px;transition:width .7s cubic-bezier(.2,.9,.3,1);"></div></div>
                        </div>`)}
                </div>
                <p style="margin:0;font-size:14px;line-height:1.55;color:#586675;text-wrap:pretty;">${v.flavor}</p>
                ${v.hasEvo && html`
                    <div style="display:flex;flex-direction:column;gap:9px;">
                        <div class="fato-rotulo">LINHA EVOLUTIVA</div>
                        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                            ${v.evo.map(stg => html`
                                ${stg.notFirst && icone.proximo('#C3CCD8')}
                                ${stg.items.map(e => html`
                                    <button key=${e.id} onClick=${e.go} class="hv-borda" style="width:84px;border:1px solid ${e.border};background:#fff;border-radius:8px;padding:6px 4px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:2px;color:#1B2733;transition:border-color .15s;">
                                        <img src=${e.src} alt="" style="width:56px;height:56px;image-rendering:pixelated;" />
                                        <span style="font-size:11px;font-weight:600;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${e.label}</span>
                                    </button>`)}`)}
                        </div>
                    </div>`}
            </div>
        </aside>`
}

export function telaCatalogo(v) {
    return html`
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(168px,1fr));gap:14px;animation:pdFadeUp .4s ease both;">
            ${v.gridItems.map(cartao)}
        </div>
        ${v.hasMoreGrid && html`
            <div style="display:flex;justify-content:center;margin-top:20px;">
                <button class="btn btn-outline" onClick=${v.loadMoreGrid}>Carregar mais</button>
            </div>`}
        ${v.drawerOpen && gaveta(v)}`
}

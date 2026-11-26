// Mochila: o usuário monta a equipe com até 6 Pokémon favoritos.
import { html } from '../lib.js'
import { selosTipo, icone, campoBusca, seletorGeracao } from '../ui.js'

const ALTURA_ESPACO = 150

function espacoVazio(e) {
    return html`
        <div key=${'vazio' + e.n} style="height:${ALTURA_ESPACO}px;border:2px dashed #C3CCD8;border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;color:#8893A2;">
            <span style="position:relative;width:28px;height:28px;border-radius:50%;border:2px solid #C3CCD8;background:#fff;">
                <span style="position:absolute;left:0;right:0;top:50%;height:2px;margin-top:-1px;background:#C3CCD8;"></span>
                <span style="position:absolute;left:50%;top:50%;width:10px;height:10px;margin:-5px 0 0 -5px;border-radius:50%;background:#fff;border:2px solid #C3CCD8;"></span>
            </span>
            <span style="font-size:11px;font-weight:600;">Espaço ${e.n}</span>
        </div>`
}

function espacoOcupado(p) {
    return html`
        <div key=${p.id} class="hv-borda" style="position:relative;height:${ALTURA_ESPACO}px;border:1px solid ${p.isFav ? '#B7791A' : '#D6DDE6'};border-radius:10px;background:#fff;overflow:hidden;transition:border-color .15s;animation:pdPop .35s cubic-bezier(.2,1.4,.4,1) both;">
            <button onClick=${p.go} title=${`Ver ${p.label} na Pokédex`} style="width:100%;height:100%;border:0;background:transparent;padding:8px;cursor:pointer;display:flex;flex-direction:column;gap:6px;text-align:left;color:#1B2733;">
                <span style="position:relative;height:78px;width:100%;flex:none;border-radius:8px;background:${p.tint};display:grid;place-items:center;overflow:hidden;">
                    <span class="mono" style="position:absolute;top:5px;left:7px;font-weight:700;font-size:10px;opacity:.7;">${p.num}</span>
                    ${p.isFav && icone.estrela(13, '#B7791A', 'position:absolute;bottom:5px;left:6px;')}
                    <img src=${p.src} data-fb=${p.fb} alt="" style="width:64px;height:64px;image-rendering:pixelated;" />
                </span>
                <span style="font-size:12px;font-weight:600;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${p.label}</span>
                <span style="display:flex;gap:3px;flex-wrap:wrap;">${selosTipo(p.types, 'font-size:9px;padding:1px 5px;')}</span>
            </button>
            <button onClick=${p.remove} title=${`Tirar ${p.label} da mochila`} aria-label=${`Tirar ${p.label} da mochila`} class="btn-icon outline" style="position:absolute;top:6px;right:6px;width:24px;height:24px;border-radius:50%;">
                ${icone.fechar(12)}
            </button>
        </div>`
}

export function painelMochila(v) {
    return html`
        <div onClick=${v.closeBag} style="position:fixed;inset:0;z-index:40;background:rgba(27,39,51,.45);animation:pdFade .2s ease both;"></div>
        <aside aria-label="Mochila" style="position:fixed;top:0;right:0;bottom:0;z-index:41;width:460px;max-width:100vw;background:#fff;border-left:1px solid #D6DDE6;box-shadow:0 12px 30px rgba(16,24,40,.13);overflow-y:auto;animation:pdSlide .32s cubic-bezier(.2,.9,.3,1) both;display:flex;flex-direction:column;">
            <div style="position:sticky;top:0;z-index:2;background:#fff;display:flex;align-items:center;gap:10px;padding:14px 16px 14px 20px;border-bottom:1px solid #D6DDE6;">
                <span style="width:32px;height:32px;border-radius:8px;background:#EAF0F6;display:grid;place-items:center;">${icone.mochila(18, '#1B5BA0')}</span>
                <span style="font-size:18px;font-weight:600;letter-spacing:-.01em;">Mochila</span>
                <span class="badge" style="background:${v.bagFull ? '#E8F2EC' : '#EAF0F6'};color:${v.bagFull ? '#247A48' : '#1B5BA0'};">${v.bagCount}/${v.bagMax}</span>
                <div style="flex:1;"></div>
                <button onClick=${v.closeBag} title="Fechar (Esc)" class="btn-icon ghost">${icone.fechar()}</button>
            </div>

            <div style="padding:20px 24px 28px;display:flex;flex-direction:column;gap:18px;">
                <p style="margin:0;font-size:13px;line-height:1.5;color:#586675;">Monte a sua equipe com até 6 Pokémon. Toque em um Pokémon da mochila para vê-lo na Pokédex.</p>

                <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;">
                    ${v.bagSlots.map(e => e.vazio ? espacoVazio(e) : espacoOcupado(e))}
                </div>

                ${v.bagTypes.length > 0 && html`
                    <div style="display:flex;flex-direction:column;gap:8px;">
                        <div class="fato-rotulo">TIPOS DA EQUIPE</div>
                        <div style="display:flex;gap:6px;flex-wrap:wrap;">${selosTipo(v.bagTypes)}</div>
                    </div>`}

                <div style="height:1px;background:#D6DDE6;"></div>

                <div style="display:flex;flex-direction:column;gap:12px;">
                    <div class="fato-rotulo">ADICIONAR POKÉMON</div>
                    <div style="display:flex;flex-wrap:wrap;gap:10px;">
                        ${campoBusca(v.bagQuery, v.onBagQuery, 'flex:1 1 200px;')}
                        ${seletorGeracao(v.gens, v.bagGen, v.onBagGen)}
                    </div>
                    ${v.bagMsg && html`
                        <div role="status" style="padding:10px 12px;border-radius:8px;background:#FFF3DC;color:#B7791A;font-size:13px;font-weight:500;animation:pdFadeUp .25s ease both;">${v.bagMsg}</div>`}
                    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(88px,1fr));gap:8px;max-height:380px;overflow-y:auto;padding:2px;">
                        ${v.bagPick.map(p => html`
                            <button key=${p.id} onClick=${p.go} title=${p.on ? `Tirar ${p.label} da mochila` : `Pôr ${p.label} na mochila`} class="hv-sobe2-borda"
                                style="position:relative;height:100px;border:1px solid ${p.on ? '#1B5BA0' : '#D6DDE6'};background:${p.on ? '#EAF0F6' : '#fff'};border-radius:8px;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;padding:6px;color:#1B2733;transition:border-color .15s,background .15s,transform .15s;">
                                ${p.on && html`<span style="position:absolute;top:5px;right:5px;width:18px;height:18px;border-radius:50%;background:#1B5BA0;display:grid;place-items:center;animation:pdPop .25s both;">${icone.check(11, '#fff')}</span>`}
                                <img src=${p.src} data-fb=${p.fb} alt="" loading="lazy" style="width:56px;height:56px;image-rendering:pixelated;" />
                                <span style="font-size:11px;font-weight:600;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${p.label}</span>
                                <span class="mono" style="font-size:10px;color:#8893A2;">${p.num}</span>
                            </button>`)}
                    </div>
                    ${v.hasMoreBagPick && html`<button class="btn btn-sm btn-outline" style="align-self:center;" onClick=${v.loadMoreBagPick}>Mostrar mais</button>`}
                </div>
            </div>
        </aside>`
}

// Modelo 01, Clássica: aparelho de bolso com tela, d-pad, LEDs e descrição digitada letra a letra.
// As cores do aparelho vêm das variáveis CSS --casco, --borda, --claro, --clarissimo e --rotulo (escolhidas pelo usuário).
import { html } from '../lib.js'
import { selosTipo, icone, seletorCor } from '../ui.js'

const tecla = 'background:#1B2733;border:0;color:#8893A2;cursor:pointer;display:grid;place-items:center;padding:0;'
const telaEscura = 'background:#1B2733;border-radius:6px;border:2px solid var(--borda);'
const pilula = 'flex:1;height:14px;border-radius:7px;border:2px solid var(--borda);cursor:pointer;padding:0;transition:transform .1s;'

function metadeEsquerda(v) {
    return html`
        <div class="classica-casco" style="flex:1 1 440px;min-width:0;background:var(--casco);border:2px solid var(--borda);border-radius:22px 8px 8px 22px;padding:22px 22px 26px;display:flex;flex-direction:column;gap:18px;">
            <div style="display:flex;align-items:flex-start;gap:14px;">
                <div style="width:66px;height:66px;border-radius:50%;background:#fff;display:grid;place-items:center;flex:none;border:2px solid var(--borda);">
                    <div style="width:50px;height:50px;border-radius:50%;background:${v.lensBg};border:3px solid var(--borda);animation:${v.lensAnim};transition:background .2s;"></div>
                </div>
                <div style="display:flex;gap:8px;padding-top:6px;">
                    <span style="width:14px;height:14px;border-radius:50%;background:#C0392B;border:2px solid var(--borda);animation:pdBlink 1.6s infinite;"></span>
                    <span style="width:14px;height:14px;border-radius:50%;background:#B7791A;border:2px solid var(--borda);animation:pdBlink 1.6s .4s infinite;"></span>
                    <span style="width:14px;height:14px;border-radius:50%;background:#2E8B57;border:2px solid var(--borda);animation:pdBlink 1.6s .8s infinite;"></span>
                </div>
                <span class="mono" style="margin-left:auto;padding-top:6px;font-weight:700;font-size:11px;letter-spacing:.12em;color:var(--rotulo);">MOD. 01</span>
            </div>

            <div style="background:var(--clarissimo);border-radius:8px 8px 8px 44px;padding:14px 22px 16px;border:2px solid var(--borda);transition:background .3s;">
                <div style="display:flex;justify-content:center;gap:10px;margin-bottom:10px;">
                    <span style="width:7px;height:7px;border-radius:50%;background:#C0392B;"></span>
                    <span style="width:7px;height:7px;border-radius:50%;background:#C0392B;"></span>
                </div>
                <div style="position:relative;height:240px;background:#1B2733;border-radius:6px;overflow:hidden;display:grid;place-items:center;">
                    <div style="position:absolute;inset:0;background-image:linear-gradient(rgba(234,240,246,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(234,240,246,.06) 1px,transparent 1px);background-size:16px 16px;"></div>
                    <div style="position:absolute;width:190px;height:190px;border-radius:50%;border:2px dashed rgba(234,240,246,.16);animation:pdSpin 24s linear infinite;"></div>
                    <div style="position:relative;z-index:2;animation:pdBob 2.2s ease-in-out infinite;">${v.classicHero}</div>
                    ${v.scanFx}
                    <div style="position:absolute;inset:0;z-index:4;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(0,0,0,.2) 0 1px,transparent 1px 3px);"></div>
                    <span class="mono" style="position:absolute;top:10px;left:12px;z-index:5;font-weight:700;font-size:12px;color:#EAF0F6;letter-spacing:.06em;">${v.selNum}</span>
                    ${v.shiny && html`<span class="mono" style="position:absolute;top:10px;right:12px;z-index:5;font-weight:700;font-size:11px;color:#B7791A;letter-spacing:.08em;animation:pdBlink 1.2s infinite;">SHINY</span>`}
                    ${v.detailLoading && html`<span class="mono" style="position:absolute;bottom:10px;right:12px;z-index:5;font-weight:700;font-size:11px;color:#8893A2;animation:pdBlink .8s infinite;">LENDO…</span>`}
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px;">
                    <span style="width:20px;height:20px;border-radius:50%;background:#C0392B;border:2px solid var(--borda);"></span>
                    <div style="display:flex;flex-direction:column;gap:4px;">
                        ${[0, 1, 2, 3].map(() => html`<span style="width:34px;height:3px;background:var(--borda);border-radius:2px;"></span>`)}
                    </div>
                </div>
            </div>

            <div style="display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:18px;align-items:center;">
                <button onClick=${v.playCry} title="Ouvir grito" class="at-aperta92" style="width:56px;height:56px;border-radius:50%;background:#1B2733;border:3px solid var(--borda);display:grid;place-items:center;cursor:pointer;color:#fff;transition:transform .1s;">
                    ${icone.somClassico()}
                </button>
                <div style="display:flex;flex-direction:column;gap:10px;min-width:0;">
                    <div style="display:flex;gap:10px;">
                        <button onClick=${v.toggleShiny} title="Shiny" class="at-aperta94" style="${pilula}background:#C0392B;"></button>
                        <button onClick=${v.setFavSel} title="Favoritar" class="at-aperta94" style="${pilula}background:#B7791A;"></button>
                        <button onClick=${v.toggleBagSel} title=${v.inBag ? 'Tirar da mochila' : 'Pôr na mochila'} class="at-aperta94" style="${pilula}background:#2E8B57;"></button>
                    </div>
                    <div class="mono" style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));font-weight:700;font-size:9px;letter-spacing:.1em;color:var(--rotulo);">
                        <span>SHINY</span><span style="text-align:center;">FAVORITO</span><span style="text-align:right;">MOCHILA</span>
                    </div>
                    <div class="mono" style="background:#247A48;border:2px solid var(--borda);border-radius:6px;padding:9px 12px;font-weight:700;font-size:15px;letter-spacing:.06em;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${v.selNameUp}</div>
                </div>
                <div style="display:grid;grid-template-columns:32px 32px 32px;grid-template-rows:32px 32px 32px;">
                    <span></span>
                    <button onClick=${v.up} title="-10" class="at-branco" style="${tecla}border-radius:5px 5px 0 0;">${icone.triangulo('M12 6 20 18H4Z')}</button>
                    <span></span>
                    <button onClick=${v.prev} title="Anterior" class="at-branco" style="${tecla}border-radius:5px 0 0 5px;">${icone.triangulo('M6 12 18 4v16Z')}</button>
                    <span style="background:#1B2733;display:grid;place-items:center;"><span style="width:10px;height:10px;border-radius:50%;background:#2A3744;"></span></span>
                    <button onClick=${v.next} title="Próximo" class="at-branco" style="${tecla}border-radius:0 5px 5px 0;">${icone.triangulo('M18 12 6 20V4Z')}</button>
                    <span></span>
                    <button onClick=${v.down} title="+10" class="at-branco" style="${tecla}border-radius:0 0 5px 5px;">${icone.triangulo('M12 18 4 6h16Z')}</button>
                    <span></span>
                </div>
            </div>
        </div>`
}

function dobradica() {
    return html`
        <div class="classica-casco" style="flex:0 0 22px;background:var(--borda);display:flex;flex-direction:column;justify-content:space-between;padding:34px 4px;">
            ${[0, 1, 2].map(() => html`<span class="classica-casco" style="height:70px;border-radius:4px;background:var(--casco);"></span>`)}
        </div>`
}

function metadeDireita(v) {
    return html`
        <div class="classica-casco" style="flex:1 1 400px;min-width:0;background:var(--casco);border:2px solid var(--borda);border-radius:8px 22px 22px 8px;padding:22px;display:flex;flex-direction:column;gap:14px;">
            <div class="mono" style="${telaEscura}padding:16px;color:#EAF0F6;display:flex;flex-direction:column;gap:9px;">
                <div style="display:flex;align-items:center;gap:8px;">
                    <span style="font-size:13px;font-weight:700;letter-spacing:.06em;">${v.selNum} ${v.selNameUp}</span>
                    ${v.isFavSel && icone.estrela(14, '#B7791A', 'animation:pdPop .4s both;')}
                    ${v.inBag && html`<span title="Na mochila" style="display:inline-flex;animation:pdPop .4s both;">${icone.mochila(14, '#2E8B57')}</span>`}
                </div>
                <div style="font-size:12px;color:#8893A2;">${v.selGenus}</div>
                <div style="display:flex;gap:6px;flex-wrap:wrap;">${selosTipo(v.selTypes, 'font-family:Inter,system-ui,sans-serif;')}</div>
                <div style="display:flex;gap:18px;font-size:12px;color:#8893A2;">
                    <span>ALT <b style="color:#EAF0F6;">${v.selH}</b></span>
                    <span>PESO <b style="color:#EAF0F6;">${v.selW}</b></span>
                </div>
                <div style="font-size:12.5px;line-height:1.6;min-height:60px;color:#DBE5F0;">${v.flavorTyped}<span style="animation:pdCaret 1s steps(1) infinite;color:#2E8B57;">▌</span></div>
            </div>

            <div style="${telaEscura}padding:14px 16px;display:flex;flex-direction:column;gap:7px;">
                ${v.stats.map(st => html`
                    <div class="mono" style="display:grid;grid-template-columns:80px 30px minmax(0,1fr);gap:10px;align-items:center;font-weight:600;font-size:11px;color:#8893A2;">
                        <span>${st.labelUp}</span><span style="color:#EAF0F6;text-align:right;">${st.v}</span>
                        <div style="display:grid;grid-template-columns:repeat(15,minmax(0,1fr));gap:3px;">
                            ${st.segs.map(sg => html`<span style="height:10px;border-radius:2px;background:${sg.bg};transition:background .15s;transition-delay:${sg.delay};"></span>`)}
                        </div>
                    </div>`)}
            </div>

            <div style="display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px;">
                ${v.keys.map(k => html`
                    <button key=${k.id} onClick=${k.go} style="height:66px;border:2px solid var(--borda);border-radius:6px;background:${k.bg};box-shadow:${k.shadow};transform:${k.ty};display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;padding:2px;transition:transform .1s,box-shadow .1s,background .15s;">
                        <img src=${k.src} data-fb=${k.fb} alt="" style="width:42px;height:42px;image-rendering:pixelated;" />
                        <span class="mono" style="font-weight:700;font-size:10px;color:var(--borda);">${k.num}</span>
                    </button>`)}
            </div>

            ${v.hasEvo && html`
                <div style="${telaEscura}padding:10px 12px;display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                    <span class="mono" style="font-weight:700;font-size:10px;letter-spacing:.1em;color:#8893A2;margin-right:4px;">EVOLUÇÃO</span>
                    ${v.evo.map(stg => html`
                        ${stg.notFirst && html`<span style="color:#586675;font-size:12px;">›</span>`}
                        ${stg.items.map(e => html`
                            <button key=${e.id} onClick=${e.go} title=${e.label} class="hv-evo-escuro" style="width:40px;height:40px;border-radius:6px;border:1px solid ${e.darkBorder};background:#2A3744;cursor:pointer;padding:0;display:grid;place-items:center;">
                                <img src=${e.src} alt="" style="width:36px;height:36px;image-rendering:pixelated;" />
                            </button>`)}`)}
                </div>`}
        </div>`
}

export function telaClassica(v) {
    return html`
        <div style="${v.temaVars}display:flex;flex-wrap:wrap;justify-content:center;max-width:1020px;margin:0 auto;animation:pdFadeUp .4s ease both;">
            ${metadeEsquerda(v)}
            ${dobradica()}
            ${metadeDireita(v)}
        </div>
        <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:10px 14px;margin-top:18px;">
            <span class="fato-rotulo">COR DO APARELHO</span>
            ${seletorCor(v.cores, 26)}
            <span style="font-size:13px;color:#586675;min-width:64px;">${v.corNome}</span>
        </div>
        <p style="text-align:center;font-size:12px;color:#586675;margin:14px 0 0;">← → navegam · ↑ ↓ pulam 10 · botão redondo toca o grito · botões finos ativam Shiny, Favorito e Mochila</p>`
}

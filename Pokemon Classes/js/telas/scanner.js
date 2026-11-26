// Modelo 03, Scanner: um Pokémon por vez em destaque, com varredura e radar de atributos.
import { html } from '../lib.js'
import { selosTipo, icone, fato, botaoMochila } from '../ui.js'

const cantoBase = 'position:absolute;width:30px;height:30px;'
const setaScan = 'position:absolute;top:50%;margin-top:-20px;z-index:6;width:40px;height:40px;border-radius:50%;border:1px solid #C3CCD8;background:#fff;color:#586675;cursor:pointer;display:grid;place-items:center;transition:color .15s,border-color .15s;'

function palco(v) {
    return html`
        <div style="position:relative;min-height:500px;border:1px solid #D6DDE6;border-radius:10px;background:${v.tint};overflow:hidden;display:grid;place-items:center;transition:background .4s;">
            <span style="position:absolute;top:16px;left:16px;z-index:6;display:inline-flex;align-items:center;gap:6px;padding:3px 8px;border-radius:8px;background:${v.scanStatusBg};color:${v.scanStatusFg};font-size:11px;font-weight:700;line-height:1.15;letter-spacing:.03em;">
                <span style="width:6px;height:6px;border-radius:50%;background:currentColor;animation:pdBlink 1s infinite;"></span>${v.scanStatus}
            </span>
            <span class="mono" style="position:absolute;top:18px;right:18px;z-index:6;font-weight:700;font-size:13px;color:#1B2733;">${v.selNum}</span>
            <span style="${cantoBase}top:12px;left:12px;border-top:3px solid #1B5BA0;border-left:3px solid #1B5BA0;border-radius:6px 0 0 0;"></span>
            <span style="${cantoBase}top:12px;right:12px;border-top:3px solid #1B5BA0;border-right:3px solid #1B5BA0;border-radius:0 6px 0 0;"></span>
            <span style="${cantoBase}bottom:12px;left:12px;border-bottom:3px solid #1B5BA0;border-left:3px solid #1B5BA0;border-radius:0 0 0 6px;"></span>
            <span style="${cantoBase}bottom:12px;right:12px;border-bottom:3px solid #1B5BA0;border-right:3px solid #1B5BA0;border-radius:0 0 6px 0;"></span>
            <div style="position:absolute;width:400px;height:400px;border-radius:50%;border:2px dashed rgba(255,255,255,.9);animation:pdSpin 40s linear infinite;"></div>
            <div style="position:absolute;width:320px;height:320px;border-radius:50%;border:26px solid rgba(255,255,255,.45);animation:pdSpinR 30s linear infinite;"><div style="position:absolute;left:-26px;right:-26px;top:50%;height:26px;margin-top:-13px;background:rgba(255,255,255,.45);"></div></div>
            <div style="position:relative;z-index:2;animation:pdFloat 3.2s ease-in-out infinite;">${v.scanHero}</div>
            ${v.scanFx}
            <button onClick=${v.prev} title="Anterior (←)" class="hv-seta-scan" style="${setaScan}left:16px;">${icone.anterior()}</button>
            <button onClick=${v.next} title="Próximo (→)" class="hv-seta-scan" style="${setaScan}right:16px;">${icone.proximo()}</button>
        </div>`
}

function ficha(v) {
    return html`
        <div class="cartao" style="padding:24px;display:flex;flex-direction:column;gap:16px;">
            <div style="display:flex;align-items:flex-start;gap:12px;">
                <div style="flex:1;min-width:0;">
                    <div style="font-size:34px;font-weight:700;letter-spacing:-.02em;line-height:1.1;">${v.selName}</div>
                    <div style="font-size:14px;color:#586675;margin-top:4px;">${v.selGenus}</div>
                </div>
                <div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end;">
                    ${v.inBag && html`<span class="badge" style="background:#EAF0F6;color:#1B5BA0;animation:pdPop .4s both;">NA MOCHILA</span>`}
                    ${v.isFavSel && html`<span class="badge" style="background:#FFF3DC;color:#B7791A;animation:pdPop .4s both;">FAVORITO</span>`}
                </div>
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">${selosTipo(v.selTypes)}</div>
            <div style="display:flex;justify-content:center;padding:4px 0;min-height:240px;align-items:center;">${v.radar}</div>
            <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;">
                ${fato('ALTURA', v.selH)}
                ${fato('PESO', v.selW)}
                ${fato('TOTAL', v.total)}
            </div>
            <p style="margin:0;font-size:14px;line-height:1.55;color:#586675;text-wrap:pretty;">${v.flavor}</p>
            <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:auto;">
                <button class="btn btn-outline" onClick=${v.playCry}>${icone.som()}Ouvir grito</button>
                <button class="btn" onClick=${v.setFavSel} style="border:0;background:${v.favBtnBg};color:#fff;transition:background .15s;">${icone.estrela()}${v.favLabel}</button>
                ${botaoMochila(v)}
            </div>
        </div>`
}

function filme(v) {
    return html`
        <div style="display:flex;gap:8px;overflow-x:auto;padding:6px 2px 8px;justify-content:center;">
            ${v.film.map(f => html`
                <button key=${f.id} onClick=${f.go} class="hv-opaco" style="flex:none;width:72px;height:86px;border-radius:8px;border:${f.border};background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;transform:${f.tf};opacity:${f.op};transition:transform .25s,opacity .25s,border-color .25s;padding:0;">
                    <img src=${f.src} data-fb=${f.fb} alt="" style="width:54px;height:54px;image-rendering:pixelated;" />
                    <span class="mono" style="font-weight:700;font-size:10px;color:#8893A2;">${f.num}</span>
                </button>`)}
        </div>`
}

export function telaScanner(v) {
    return html`
        <div style="display:flex;flex-direction:column;gap:16px;animation:pdFadeUp .4s ease both;">
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));gap:16px;">
                ${palco(v)}
                ${ficha(v)}
            </div>
            ${filme(v)}
        </div>`
}

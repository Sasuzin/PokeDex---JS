// Primeira visita: passo 1 escolhe o modelo, passo 2 escolhe o Pokémon favorito.
import { html } from '../lib.js'
import { pokebola, carregando, selosTipo, icone, campoBusca, seletorGeracao, seletorCor } from '../ui.js'

const teclaClara = 'height:12px;background:var(--claro);border-radius:2px;'

function miniaturaClassica() {
    return html`
        <div style="display:flex;gap:4px;">
            <div style="width:96px;height:120px;background:var(--casco);border:2px solid var(--borda);border-radius:12px 4px 4px 12px;padding:8px;display:flex;flex-direction:column;gap:6px;">
                <div style="display:flex;gap:4px;align-items:center;">
                    <span style="width:16px;height:16px;border-radius:50%;background:var(--claro);border:2px solid #fff;"></span>
                    <span style="width:6px;height:6px;border-radius:50%;background:#C0392B;animation:pdBlink 1.2s infinite;"></span>
                    <span style="width:6px;height:6px;border-radius:50%;background:#B7791A;animation:pdBlink 1.2s .3s infinite;"></span>
                    <span style="width:6px;height:6px;border-radius:50%;background:#2E8B57;animation:pdBlink 1.2s .6s infinite;"></span>
                </div>
                <div style="flex:1;background:var(--clarissimo);border-radius:3px 3px 3px 12px;padding:5px;"><div style="height:100%;background:#1B2733;border-radius:2px;"></div></div>
                <div style="height:10px;background:#247A48;border-radius:2px;"></div>
            </div>
            <div style="width:90px;height:120px;background:var(--casco);border:2px solid var(--borda);border-radius:4px 12px 12px 4px;padding:8px;display:flex;flex-direction:column;gap:6px;">
                <div style="height:46px;background:#1B2733;border-radius:2px;"></div>
                <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:3px;">
                    ${Array.from({ length: 8 }, () => html`<span style=${teclaClara}></span>`)}
                </div>
            </div>
        </div>`
}

function miniaturaCatalogo() {
    return html`
        <div style="display:grid;grid-template-columns:repeat(4,44px);gap:6px;">
            ${Array.from({ length: 8 }, (_, i) => html`<span style="height:52px;background:#fff;border:1px solid ${i === 2 ? '#1B5BA0' : '#D6DDE6'};border-radius:5px;animation:pdFadeUp .5s ${i * 0.08}s both;"></span>`)}
        </div>`
}

function miniaturaScanner() {
    return html`
        <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
            <div style="display:flex;gap:8px;">
                <div style="position:relative;width:100px;height:100px;background:#fff;border:1px solid #D6DDE6;border-radius:6px;display:grid;place-items:center;overflow:hidden;">
                    <span style="width:72px;height:72px;border-radius:50%;border:2px dashed #1B5BA0;animation:pdSpin 8s linear infinite;"></span>
                    <span style="position:absolute;left:0;right:0;top:0;height:100%;background:linear-gradient(180deg,transparent 45%,rgba(27,91,160,.35) 50%,transparent 52%);animation:pdScan 1.8s linear infinite;"></span>
                </div>
                <div style="width:84px;height:100px;background:#fff;border:1px solid #D6DDE6;border-radius:6px;padding:10px;display:flex;flex-direction:column;gap:6px;">
                    <span style="height:8px;width:70%;background:#1B2733;border-radius:2px;"></span>
                    <span style="height:6px;width:45%;background:#C3CCD8;border-radius:2px;"></span>
                    <span style="flex:1;border:1px solid #DBE5F0;border-radius:50%;"></span>
                </div>
            </div>
            <div style="display:flex;gap:4px;">
                ${Array.from({ length: 5 }, (_, i) => html`<span style="width:18px;height:18px;background:#fff;border:1px solid ${i === 2 ? '#1B5BA0' : '#D6DDE6'};border-radius:3px;"></span>`)}
            </div>
        </div>`
}

function cartaoModelo(m, v) {
    return html`
        <button key=${m.k} onClick=${m.pick} class="hv-sobe" style="text-align:left;background:#fff;border:2px solid ${m.border};border-radius:10px;padding:0;cursor:pointer;overflow:hidden;display:flex;flex-direction:column;transition:border-color .15s,transform .2s;color:#1B2733;">
            <div style="${v.temaVars}position:relative;height:170px;background:#EDF0F4;display:grid;place-items:center;border-bottom:1px solid #D6DDE6;overflow:hidden;">
                ${m.isClassic && miniaturaClassica()}
                ${m.isGrid && miniaturaCatalogo()}
                ${m.isScan && miniaturaScanner()}
                ${m.active && html`<span style="position:absolute;top:12px;right:12px;display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:8px;background:#1B5BA0;color:#fff;font-size:11px;font-weight:700;line-height:1.15;animation:pdPop .3s both;">SELECIONADO</span>`}
            </div>
            <div style="padding:16px 18px 18px;display:flex;flex-direction:column;gap:6px;">
                <span style="font-size:11px;font-weight:700;letter-spacing:.045em;color:#8893A2;">${m.tag}</span>
                <span style="font-size:18px;font-weight:600;letter-spacing:-.01em;">${m.label}</span>
                <span style="font-size:13px;line-height:1.45;color:#586675;">${m.desc}</span>
            </div>
        </button>`
}

const botaoCancelar = v => v.isEditing && html`<button class="btn btn-outline" onClick=${v.setupCancel}>Cancelar</button>`

function escolhaDeCor(v) {
    return html`
        <div class="cartao" style="padding:16px 18px;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:14px 24px;animation:pdFadeUp .3s ease both;">
            <div>
                <div class="fato-rotulo">COR DA CLÁSSICA</div>
                <div style="font-size:13px;color:#586675;margin-top:2px;">Escolha a cor do seu aparelho: <b style="color:#1B2733;font-weight:600;">${v.corNome}</b></div>
            </div>
            ${seletorCor(v.cores, 32)}
        </div>`
}

function passoModelo(v) {
    return html`
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:14px;">
            ${v.models.map(m => cartaoModelo(m, v))}
        </div>
        ${v.showCores && escolhaDeCor(v)}
        <div style="display:flex;justify-content:flex-end;gap:10px;">
            ${botaoCancelar(v)}
            ${v.isEditModel
                ? html`<button class="btn btn-primary" onClick=${v.applyModel}>Abrir Pokédex${icone.setaDireita()}</button>`
                : html`<button class="btn btn-primary" onClick=${v.setupNext}>Continuar${icone.setaDireita()}</button>`}
        </div>`
}

function passoFavorito(v) {
    return html`
        <div style="display:flex;flex-wrap:wrap;gap:16px;align-items:flex-start;">
            <div class="cartao" style="flex:1 1 520px;min-width:0;padding:20px;display:flex;flex-direction:column;gap:14px;">
                <div style="display:flex;flex-wrap:wrap;gap:10px;">
                    ${campoBusca(v.pickQuery, v.onPickQuery, 'flex:1 1 220px;')}
                    ${seletorGeracao(v.gens, v.pickGen, v.onPickGen)}
                </div>
                ${v.loading && carregando({ tamanho: 40, botao: 12, espaco: '60px 0', gap: 12 })}
                <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(104px,1fr));gap:10px;max-height:540px;overflow-y:auto;padding:2px;">
                    ${v.pickItems.map(p => html`
                        <button key=${p.id} onClick=${p.go} class="hv-sobe2-borda" style="height:118px;border:1px solid ${p.border};background:${p.bg};border-radius:8px;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;padding:6px;color:#1B2733;transition:border-color .15s,background .15s,transform .15s;">
                            <img src=${p.src} data-fb=${p.fb} alt="" loading="lazy" style="width:72px;height:72px;image-rendering:pixelated;animation:${p.anim};" />
                            <span style="font-size:12px;font-weight:600;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${p.label}</span>
                            <span class="mono" style="font-size:10px;color:#8893A2;">${p.num}</span>
                        </button>`)}
                </div>
                ${v.hasMorePick && html`<button class="btn btn-sm btn-outline" style="align-self:center;" onClick=${v.loadMorePick}>Mostrar mais</button>`}
            </div>

            <div class="cartao" style="flex:1 1 300px;max-width:380px;min-width:260px;position:sticky;top:24px;overflow:hidden;">
                ${v.hasDraft && html`
                    <div style="position:relative;height:230px;background:${v.draftTint};display:grid;place-items:center;overflow:hidden;">
                        <div style="position:absolute;width:250px;height:250px;border-radius:50%;border:22px solid rgba(255,255,255,.5);animation:pdSpin 20s linear infinite;"><div style="position:absolute;left:-22px;right:-22px;top:50%;height:22px;margin-top:-11px;background:rgba(255,255,255,.5);"></div></div>
                        <div style="animation:pdFloat 3s ease-in-out infinite;">${v.draftHero}</div>
                    </div>
                    <div style="padding:18px 20px 20px;display:flex;flex-direction:column;gap:10px;">
                        <div>
                            <div class="mono" style="font-size:12px;color:#8893A2;">${v.draftNum}</div>
                            <div style="font-size:22px;font-weight:700;letter-spacing:-.02em;">${v.draftName}</div>
                            <div style="font-size:13px;color:#586675;">${v.draftGenus}</div>
                        </div>
                        <div style="display:flex;gap:6px;flex-wrap:wrap;">${selosTipo(v.draftTypes)}</div>
                        <button class="btn btn-sm btn-outline" style="align-self:flex-start;" onClick=${v.draftCry}>${icone.som()}Ouvir grito</button>
                    </div>`}
                ${v.noDraft && html`
                    <div style="padding:48px 24px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:10px;">
                        <div style="width:56px;height:56px;border-radius:50%;background:#EAF0F6;display:grid;place-items:center;">${icone.coracao()}</div>
                        <div style="font-size:15px;font-weight:600;">Escolha seu parceiro</div>
                        <div style="font-size:13px;color:#586675;line-height:1.45;">Toque em um Pokémon da lista para ver e ouvir antes de capturar.</div>
                    </div>`}
            </div>
        </div>
        <div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;">
            <button class="btn btn-outline" onClick=${v.setupBack}>Voltar</button>
            <div style="display:flex;gap:10px;">
                ${botaoCancelar(v)}
                <button class="btn btn-primary" style="opacity:${v.finishOpacity};" onClick=${v.finishSetup}>Capturar e abrir Pokédex</button>
            </div>
        </div>`
}

export function telaSetup(v) {
    return html`
        <div style="min-height:100vh;padding:40px 24px 64px;">
            <div style="max-width:1120px;margin:0 auto;display:flex;flex-direction:column;gap:24px;">
                <div style="display:flex;align-items:center;gap:10px;">
                    ${pokebola({ tamanho: 28, borda: 2, faixa: 2, botao: 10, animacao: 'pdSpin 6s linear infinite' })}
                    <span style="font-size:18px;font-weight:600;letter-spacing:-.01em;">Pokédex</span>
                </div>

                <div style="display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:16px;">
                    ${v.isEditModel
                        ? html`<div>
                            <h1 style="margin:0;font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.15;">Escolha o modelo</h1>
                            <p style="margin:6px 0 0;font-size:14px;color:#586675;">Troque o aparelho quando quiser. Seu favorito e sua mochila continuam salvos.</p>
                        </div>`
                        : html`<div>
                            <h1 style="margin:0;font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.15;">Monte a sua Pokédex</h1>
                            <p style="margin:6px 0 0;font-size:14px;color:#586675;">Escolha o modelo do aparelho e o seu Pokémon favorito. Dá para trocar os dois depois.</p>
                        </div>`}
                    ${!v.isEditModel && html`<div style="display:flex;align-items:center;gap:10px;font-size:13px;font-weight:500;">
                        <span style="display:inline-flex;align-items:center;gap:8px;color:${v.step0Color};"><span style="width:24px;height:24px;border-radius:50%;display:grid;place-items:center;font-size:12px;font-weight:700;background:${v.step0Dot};color:#fff;">1</span>Modelo</span>
                        <span style="width:32px;height:1px;background:#C3CCD8;"></span>
                        <span style="display:inline-flex;align-items:center;gap:8px;color:${v.step1Color};"><span style="width:24px;height:24px;border-radius:50%;display:grid;place-items:center;font-size:12px;font-weight:700;background:${v.step1Dot};color:#fff;">2</span>Favorito</span>
                    </div>`}
                </div>

                ${v.isStep0 && passoModelo(v)}
                ${v.isStep1 && passoFavorito(v)}
            </div>
        </div>`
}

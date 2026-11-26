// Sequência de captura ao escolher um favorito: Pokébola arremessada, balança 3 vezes e "Capturado!".
import { html } from '../lib.js'
import { pokebola } from '../ui.js'

const brilho = (posicao, tamanho, cor, atraso) =>
    html`<span style="position:absolute;${posicao}width:${tamanho}px;height:${tamanho}px;border-radius:50%;border:3px solid ${cor};opacity:0;animation:pdBurst .7s ease-out ${atraso}s both;"></span>`

export function telaCaptura(v) {
    return html`
        <div key=${v.captureKey} onClick=${v.closeCapture} style="position:fixed;inset:0;z-index:100;background:rgba(27,39,51,.78);display:grid;place-items:center;animation:pdFade .25s ease both;cursor:pointer;">
            <div style="display:flex;flex-direction:column;align-items:center;gap:20px;padding:24px;">
                <div style="position:relative;width:240px;height:240px;display:grid;place-items:center;">
                    <img src=${v.captureArt} alt="" style="position:absolute;width:200px;height:200px;object-fit:contain;animation:pdPop .5s cubic-bezier(.2,1.4,.4,1) both,pdSuck .4s ease-in 1.15s forwards;" />
                    <div style="position:relative;animation:pdThrow .55s cubic-bezier(.2,.8,.3,1) .6s both;">
                        <div style="animation:pdShake .55s ease-in-out 1.7s 3;transform-origin:50% 90%;">
                            ${pokebola({ tamanho: 84, borda: 4, faixa: 6, botao: 26, animacaoBotao: 'pdGlow .6s ease 3.4s 2' })}
                        </div>
                    </div>
                    ${brilho('left:30px;top:40px;', 22, '#fff', 3.4)}
                    ${brilho('right:30px;top:52px;', 16, '#B7791A', 3.5)}
                    ${brilho('left:60px;bottom:40px;', 14, '#DBE5F0', 3.6)}
                    ${brilho('right:56px;bottom:50px;', 20, '#fff', 3.45)}
                </div>
                <div style="display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center;animation:pdFadeUp .45s ease 3.4s both;">
                    <div style="font-size:30px;font-weight:700;letter-spacing:-.02em;color:#fff;">Capturado!</div>
                    <div style="font-size:14px;color:#DBE5F0;">${v.captureName} agora é o seu Pokémon favorito.</div>
                    <span style="margin-top:12px;font-size:12px;color:#8893A2;">Clique em qualquer lugar para continuar</span>
                </div>
            </div>
        </div>`
}

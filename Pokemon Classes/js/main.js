// Ponto de entrada: monta a Pokédex dentro de <div id="app">.
import { html, render } from './lib.js'
import { CONFIG } from './dados.js'
import { Pokedex } from './pokedex.js'

render(html`<${Pokedex} motion=${CONFIG.motion} startGen=${CONFIG.startGen} />`, document.getElementById('app'))

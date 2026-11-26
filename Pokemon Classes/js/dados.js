// Constantes e funções auxiliares da Pokédex: endpoints, tipos, gerações e formatação.

export const API = 'https://pokeapi.co/api/v2'
export const SPR = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon'

// [rótulo, cor, texto escuro?]
export const TYPES = {
    normal: ['Normal', '#A3A27F', 1], fire: ['Fogo', '#E0703A', 0], water: ['Água', '#4A87D8', 0],
    electric: ['Elétrico', '#E8BE30', 1], grass: ['Planta', '#4F9A45', 0], ice: ['Gelo', '#79C9CE', 1],
    fighting: ['Lutador', '#B8433A', 0], poison: ['Venenoso', '#9A4FA0', 0], ground: ['Terrestre', '#CDAA5C', 1],
    flying: ['Voador', '#93A6EC', 1], psychic: ['Psíquico', '#D9507A', 0], bug: ['Inseto', '#9DAE2E', 1],
    rock: ['Pedra', '#B3A04E', 1], ghost: ['Fantasma', '#6B5A96', 0], dragon: ['Dragão', '#6A4BD8', 0],
    dark: ['Sombrio', '#5E5047', 0], steel: ['Aço', '#8E9CB2', 1], fairy: ['Fada', '#D98AAE', 1],
}

// [chave, rótulo, primeiro id, último id]
export const GENS = [
    ['1', 'Gen I · Kanto', 1, 151], ['2', 'Gen II · Johto', 152, 251], ['3', 'Gen III · Hoenn', 252, 386],
    ['4', 'Gen IV · Sinnoh', 387, 493], ['5', 'Gen V · Unova', 494, 649], ['6', 'Gen VI · Kalos', 650, 721],
    ['7', 'Gen VII · Alola', 722, 809], ['8', 'Gen VIII · Galar', 810, 905], ['9', 'Gen IX · Paldea', 906, 1025],
    ['all', 'Todas as gerações', 1, 1025],
]

export const STATS = { hp: 'HP', attack: 'Ataque', defense: 'Defesa', 'special-attack': 'At. Especial', 'special-defense': 'Def. Especial', speed: 'Velocidade' }
export const SHORT = { hp: 'HP', attack: 'ATQ', defense: 'DEF', 'special-attack': 'AT.E', 'special-defense': 'DF.E', speed: 'VEL' }

export const MODELS = [
    { k: 'classic', tag: 'MODELO 01', label: 'Clássica', desc: 'Aparelho de bolso com tela, d-pad, LEDs e descrição digitada letra a letra.' },
    { k: 'grid', tag: 'MODELO 02', label: 'Catálogo', desc: 'Grade com busca e filtros; cada Pokémon abre uma ficha lateral completa.' },
    { k: 'scan', tag: 'MODELO 03', label: 'Scanner', desc: 'Um Pokémon por vez em destaque, com varredura e radar de atributos.' },
]

// Cores do aparelho no modelo Clássica.
// casco = corpo do aparelho, borda = contornos e dobradiça, claro/clarissimo = teclas e moldura da tela,
// rotulo = textos pequenos impressos no casco (escuro nas cores claras, para dar contraste).
export const CORES_CLASSICA = [
    { k: 'azul', nome: 'Azul', casco: '#1B5BA0', borda: '#144376', claro: '#DBE5F0', clarissimo: '#EAF0F6', rotulo: '#DBE5F0' },
    { k: 'vermelho', nome: 'Vermelho', casco: '#C0392B', borda: '#8A261C', claro: '#F4D9D5', clarissimo: '#FAECEA', rotulo: '#F4D9D5' },
    { k: 'verde', nome: 'Verde', casco: '#2E8B57', borda: '#1D5F3A', claro: '#D5EBDD', clarissimo: '#EAF5EE', rotulo: '#D5EBDD' },
    { k: 'amarelo', nome: 'Amarelo', casco: '#E8B530', borda: '#9A6B0F', claro: '#FBEFC9', clarissimo: '#FDF7E4', rotulo: '#5C3F06' },
    { k: 'roxo', nome: 'Roxo', casco: '#6A4BD8', borda: '#46309A', claro: '#E2DBF8', clarissimo: '#F1EDFC', rotulo: '#E2DBF8' },
    { k: 'rosa', nome: 'Rosa', casco: '#D9507A', borda: '#A33558', claro: '#F8DCE5', clarissimo: '#FCEEF2', rotulo: '#F8DCE5' },
    { k: 'grafite', nome: 'Grafite', casco: '#3A4756', borda: '#1B2733', claro: '#D6DDE6', clarissimo: '#EDF0F4', rotulo: '#D6DDE6' },
]
export const corClassica = k => CORES_CLASSICA.find(c => c.k === k) || CORES_CLASSICA[0]
// Variáveis CSS usadas pelo aparelho Clássica (var(--casco), var(--borda)…).
export const varsCor = c => `--casco:${c.casco};--borda:${c.borda};--claro:${c.claro};--clarissimo:${c.clarissimo};--rotulo:${c.rotulo};`

// Quantos Pokémon cabem na mochila.
export const BAG_MAX = 6

// Chaves do localStorage
export const PREF = 'hktc-pokedex-prefs-v1'
export const IDX = 'hktc-pokedex-index-v1'

const SPECIAL = {
    'nidoran-f': 'Nidoran♀', 'nidoran-m': 'Nidoran♂', 'mr-mime': 'Mr. Mime', 'mime-jr': 'Mime Jr.', 'mr-rime': 'Mr. Rime',
    farfetchd: "Farfetch'd", sirfetchd: "Sirfetch'd", 'type-null': 'Type: Null', 'ho-oh': 'Ho-Oh', 'porygon-z': 'Porygon-Z',
    'jangmo-o': 'Jangmo-o', 'hakamo-o': 'Hakamo-o', 'kommo-o': 'Kommo-o', flabebe: 'Flabébé',
}

export const nice = n => SPECIAL[n] || String(n || '').split('-').map(w => w ? w[0].toUpperCase() + w.slice(1) : w).join(' ')
export const num = id => '#' + String(id).padStart(3, '0')
export const idOf = u => +u.split('/').filter(Boolean).pop()
export const spr = (id, sh) => `${SPR}/${sh ? 'shiny/' : ''}${id}.png`
export const art = (id, sh) => `${SPR}/other/official-artwork/${sh ? 'shiny/' : ''}${id}.png`
export const gif = (id, sh) => `${SPR}/other/showdown/${sh ? 'shiny/' : ''}${id}.gif`
export const badge = t => ({ label: TYPES[t][0].toUpperCase(), bg: TYPES[t][1], fg: TYPES[t][2] ? '#1B2733' : '#fff' })
export const genOf = id => (GENS.find(g => g[0] !== 'all' && id >= g[2] && id <= g[3]) || GENS[0])[0]

// Ajustes da Pokédex. As animações ficam desligadas para quem pediu "reduzir movimento" no sistema.
export const CONFIG = {
    motion: !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches),
    startGen: '1',
}

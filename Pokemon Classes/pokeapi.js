// Busca os dados dos Pokémon na PokéAPI (https://pokeapi.co) e devolve
// instâncias das classes do script.js com vida e velocidade reais.

const POKEAPI_URL = 'https://pokeapi.co/api/v2/pokemon'

// O nome da classe é o mesmo nome usado na API (em minúsculas).
const POKEDEX = [
    Bulbasaur, Ivysaur, Venusaur,
    Charmander, Charmeleon, Charizard,
    Squirtle, Wartortle, Blastoise,
]

function lerStatus(dados, nomeDoStatus) {
    return dados.stats.find(s => s.stat.name === nomeDoStatus).base_stat
}

async function buscarPokemon(Classe) {
    const resposta = await fetch(`${POKEAPI_URL}/${Classe.name.toLowerCase()}`)

    if (!resposta.ok) {
        throw new Error(`PokéAPI respondeu ${resposta.status} para ${Classe.name}`)
    }

    const dados = await resposta.json()

    const pokemon = new Classe(lerStatus(dados, 'hp'), lerStatus(dados, 'speed'))
    pokemon.nome = Classe.name
    pokemon.numero = dados.id
    pokemon.imagem = dados.sprites.other['official-artwork'].front_default
        ?? dados.sprites.front_default

    return pokemon
}

function buscarPokedex() {
    return Promise.all(POKEDEX.map(buscarPokemon))
}

// Mostra na página os Pokémon vindos da PokéAPI.
// Visual provisório: troque por um layout próprio quando quiser.

const lista = document.getElementById('pokedex')
const aviso = document.getElementById('status')

function criarCard(pokemon) {
    const card = document.createElement('li')
    card.className = `card ${pokemon.tipo.toLowerCase()}`

    const imagem = document.createElement('img')
    imagem.src = pokemon.imagem
    imagem.alt = pokemon.nome
    imagem.loading = 'lazy'

    const numero = document.createElement('span')
    numero.className = 'numero'
    numero.textContent = `#${String(pokemon.numero).padStart(3, '0')}`

    const nome = document.createElement('h2')
    nome.textContent = pokemon.nome

    const detalhes = document.createElement('p')
    detalhes.textContent = `${pokemon.tipo} · Vida ${pokemon.vida} · Velocidade ${pokemon.velocidade}`

    card.append(imagem, numero, nome, detalhes)
    return card
}

async function iniciar() {
    aviso.textContent = 'Carregando Pokémon…'

    try {
        const pokemons = await buscarPokedex()
        lista.replaceChildren(...pokemons.map(criarCard))
        aviso.textContent = ''
    } catch (erro) {
        console.error(erro)
        aviso.textContent = 'Não foi possível carregar os Pokémon. Verifique sua conexão e recarregue a página.'
    }
}

iniciar()

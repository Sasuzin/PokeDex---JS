class Pokemon {
    constructor(vida, velocidade) {
        this.vida = vida
        this.velocidade = velocidade
    }
}

class Agua extends Pokemon {
    constructor(vida, velocidade) {
        super(vida, velocidade)
    }

    RecebeDano(quantidade, tipo) {
        if (tipo === 'Planta') {
            quantidade = (quantidade * 150/100)
        }

        return quantidade
    }
}

class Fogo extends Pokemon {
    constructor(vida, velocidade) {
        super(vida, velocidade)
    }

    RecebeDano(quantidade, tipo) {
        if (tipo === 'Agua') {
            quantidade = (quantidade * 150/100 )
        }

        return quantidade
    }
}

class Planta extends Pokemon {
    constructor(vida, velocidade) {
        super(vida, velocidade)
    }

    RecebeDano(quantidade, tipo) {
        if (tipo === 'Fogo') {
            quantidade = (quantidade * 150/100 )
        }

        return quantidade
    }
}

class Bulbasaur extends Planta {
    constructor(vida, velocidade) {
        super(vida, velocidade)
    }

    Fala() {
        console.log('Bulbasaur')
    }
}

class Ivysaur extends Planta {
    constructor(vida, velocidade) {
        super(vida, velocidade)
    }

    Fala() {
        console.log('Ivysaur')
    }
}

class Venusaur extends Planta {
    constructor(vida, velocidade) {
        super(vida, velocidade)
    }

    Fala() {
        console.log('Venusaur')
    }
}

class Charmander extends Fogo {
    constructor(vida, velocidade) {
        super(vida, velocidade)
    }

    Fala() {
        console.log('Charmander')
    }
}

class Charmeleon extends Fogo {
    constructor(vida, velocidade) {
        super(vida, velocidade)
    }

    Fala() {
        console.log('Charmeleon')
    }
}

class Charizard extends Fogo {
    constructor(vida, velocidade) {
        super(vida, velocidade)
    }

    Fala() {
        console.log('Charizard')
    }
}

class Squirtle extends Agua {
    constructor(vida, velocidade) {
        super(vida, velocidade)
    }

    Fala() {
        console.log('Squirtle')
    }
}

class Wartortle extends Agua {
    constructor(vida, velocidade) {
        super(vida, velocidade)
    }

    Fala() {
        console.log('Wartortle')
    }
}

class Blastoise extends Agua {
    constructor(vida, velocidade) {
        super(vida, velocidade)
    }

    Fala() {
        console.log('Blastoise')
    }
}


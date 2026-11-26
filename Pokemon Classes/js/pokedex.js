// Componente principal: guarda o estado, busca os dados na PokéAPI e monta a tela.
// A lógica segue 1:1 o protótipo do design (Pokedex.dc.html).
import { html, Component } from './lib.js'
import { API, TYPES, GENS, STATS, SHORT, MODELS, PREF, IDX, CORES_CLASSICA, BAG_MAX, corClassica, varsCor, nice, num, idOf, spr, art, gif, badge, genOf } from './dados.js'
import { telaSetup } from './telas/setup.js'
import { cabecalho, barraDeFiltros, estadosDaLista, rodape } from './telas/app.js'
import { telaClassica } from './telas/classica.js'
import { telaCatalogo } from './telas/catalogo.js'
import { telaScanner } from './telas/scanner.js'
import { telaCaptura } from './telas/captura.js'
import { painelMochila } from './telas/mochila.js'

// Deixa o nome e o texto buscado no mesmo formato, para "Nidoran♀", "Farfetch'd", "Type: Null",
// "Mr. Mime" e "Flabébé" serem achados do jeito que aparecem na tela:
// minúsculas, sem acento, ♀/♂ viram f/m, apóstrofo e ponto somem, e o resto que não é letra ou número vira espaço.
export const chaveDeBusca = t => String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/♀/g, ' f').replace(/♂/g, ' m').replace(/['’.]/g, '').replace(/[^a-z0-9]+/g, ' ').trim()

// Filtra a lista por geração, tipo e texto (nome ou número).
// Com texto digitado, a busca vale para todas as gerações: quem procura "Lucario" quer achá-lo mesmo com a Gen I selecionada.
function filtrar(list, genKey, query, type) {
    const q = chaveDeBusca(query)
    const qn = /^\d+$/.test(q) ? String(+q) : null
    const g = q ? GENS.find(x => x[0] === 'all') : (GENS.find(x => x[0] === genKey) || GENS[0])
    return list.filter(p => p.id >= g[2] && p.id <= g[3]
        && (!type || p.types.includes(type))
        && (!q || chaveDeBusca(p.name).includes(q) || (qn && String(p.id) === qn)))
}

export class Pokedex extends Component {
    constructor(props) {
        super(props)
        this.cache = {}
        this.state = this.init()
    }

    init() {
        let pr = {}
        try { pr = JSON.parse(localStorage.getItem(PREF)) || {} } catch (e) {}
        const start = (this.props && this.props.startGen) || '1'
        return {
            // editing: false | 'fav' (trocando o favorito) | 'model' (trocando o modelo pelo "Pokédex" do topo)
            phase: pr.model && pr.favId ? 'app' : 'setup', step: 0, editing: false, prevModel: null, prevCor: null,
            model: pr.model || 'classic', favId: pr.favId || null, draftFav: pr.favId || null,
            cor: corClassica(pr.cor).k,
            bag: Array.isArray(pr.bag) ? pr.bag.filter(Number.isInteger).slice(0, BAG_MAX) : [],
            bagOpen: false, bagQuery: '', bagGen: 'all', bagLimit: 120, bagMsg: null,
            list: [], loading: true, error: null,
            // A lista abre com todas as gerações; o seletor de geração serve para afunilar.
            gen: 'all', query: '', type: null,
            selId: pr.favId || 1, shiny: false, drawer: false, statsOn: false, typed: 0, crying: false,
            pickQuery: '', pickGen: pr.favId ? genOf(pr.favId) : start, pickLimit: 120, gridLimit: 96, capture: null,
        }
    }

    componentDidMount() {
        this.loadIndex()
        this.select(this.state.selId)
        if (this.state.draftFav) this.loadDetail(this.state.draftFav)

        this.onKey = e => {
            if (e.target && /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return
            const s = this.state
            if (e.key === 'Escape') {
                if (s.capture) this.setState({ capture: null })
                else if (s.bagOpen) this.setState({ bagOpen: false, bagMsg: null })
                else if (s.drawer) this.setState({ drawer: false })
                return
            }
            if (s.phase !== 'app' || s.capture || s.bagOpen) return
            if (s.model === 'grid' && !s.drawer) return
            const map = { ArrowRight: 1, ArrowLeft: -1 }
            if (s.model === 'classic') { map.ArrowDown = 10; map.ArrowUp = -10 }
            if (map[e.key]) { e.preventDefault(); this.step(map[e.key]) }
        }
        window.addEventListener('keydown', this.onKey)

        // Se uma imagem falhar, tenta o sprite estático (data-fb). Se ele também falhar, esconde a imagem.
        this.onImgErr = e => {
            const t = e.target
            if (!t || t.tagName !== 'IMG') return
            const fb = t.getAttribute('data-fb')
            if (!fb) return
            if (t.getAttribute('src') !== fb) t.setAttribute('src', fb)
            else t.style.visibility = 'hidden'
        }
        document.addEventListener('error', this.onImgErr, true)
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.onKey)
        document.removeEventListener('error', this.onImgErr, true)
        clearInterval(this.typer); clearTimeout(this.kt); clearTimeout(this.ct); clearTimeout(this.capT)
        if (this.audio) this.audio.pause()
    }

    // Índice com os 1.025 Pokémon (id, nome e tipos), guardado no localStorage.
    async loadIndex() {
        this.setState({ loading: true, error: null })
        try {
            let cached = null
            try { cached = JSON.parse(localStorage.getItem(IDX)) } catch (e) {}
            if (cached && cached.length > 1000) { this.setState({ list: cached, loading: false }); return }
            const sp = await fetch(API + '/pokemon-species?limit=1025').then(r => r.json())
            const tmap = {}
            await Promise.all(Object.keys(TYPES).map(async t => {
                const d = await fetch(API + '/type/' + t).then(r => r.json())
                d.pokemon.forEach(e => {
                    const id = idOf(e.pokemon.url)
                    if (id <= 1025) (tmap[id] = tmap[id] || []).push([e.slot, t])
                })
            }))
            const list = sp.results
                .map(r => { const id = idOf(r.url); return { id, name: r.name, types: (tmap[id] || []).sort((a, b) => a[0] - b[0]).map(x => x[1]) } })
                .sort((a, b) => a.id - b.id)
            try { localStorage.setItem(IDX, JSON.stringify(list)) } catch (e) {}
            this.setState({ list, loading: false })
        } catch (e) {
            this.setState({ loading: false, error: 'Não foi possível falar com a PokéAPI.' })
        }
    }

    // Detalhes de um Pokémon (status, espécie, evolução), guardados em memória por id.
    loadDetail(id) {
        if (!id) return Promise.resolve()
        if (this.cache[id]) return this.cache[id].p || Promise.resolve()
        const entry = {}
        this.cache[id] = entry
        entry.p = (async () => {
            try {
                const [p, s] = await Promise.all([
                    fetch(API + '/pokemon/' + id).then(r => r.json()),
                    fetch(API + '/pokemon-species/' + id).then(r => r.json()),
                ])
                const ft = s.flavor_text_entries || []
                const f = ft.find(x => x.language.name === 'pt-br') || ft.slice().reverse().find(x => x.language.name === 'en')
                const g = (s.genera || []).find(x => x.language.name === 'en')
                const evo = []
                try {
                    const c = await fetch(s.evolution_chain.url).then(r => r.json())
                    const walk = (n, d) => {
                        const eid = idOf(n.species.url)
                        if (eid <= 1025) (evo[d] = evo[d] || []).push(eid)
                        n.evolves_to.forEach(x => walk(x, d + 1))
                    }
                    walk(c.chain, 0)
                } catch (e) {}
                Object.assign(entry, {
                    ok: true,
                    stats: p.stats.map(x => ({ k: x.stat.name, v: x.base_stat })),
                    h: (p.height / 10).toFixed(1).replace('.', ',') + ' m',
                    w: (p.weight / 10).toFixed(1).replace('.', ',') + ' kg',
                    abilities: p.abilities.map(a => nice(a.ability.name)).join(' · '),
                    cry: p.cries && (p.cries.latest || p.cries.legacy),
                    flavor: f ? f.flavor_text.replace(/[\n\f\r­]+/g, ' ').replace(/\s+/g, ' ') : '',
                    genus: g ? g.genus : '',
                    evo: evo.filter(Boolean),
                    capture: s.capture_rate,
                })
            } catch (e) { entry.error = true }
            this.forceUpdate()
            if (id === this.state.selId) this.kick()
        })()
        return entry.p
    }

    filtered(s) {
        s = s || this.state
        return filtrar(s.list, s.gen, s.query, s.type)
    }

    step(n) {
        const f = this.filtered()
        if (!f.length) return
        let i = f.findIndex(p => p.id === this.state.selId)
        i = i < 0 ? 0 : ((i + n) % f.length + f.length) % f.length
        this.select(f[i].id)
    }

    select(id) {
        clearInterval(this.typer)
        this.setState({ selId: id, statsOn: false, typed: 0 })
        this.loadDetail(id)
        this.kick()
    }

    // 90 ms depois de escolher: acende os atributos e começa a "digitar" a descrição.
    kick() {
        clearTimeout(this.kt); clearInterval(this.typer)
        this.kt = setTimeout(() => {
            this.setState({ statsOn: true })
            const d = this.cache[this.state.selId]
            if (!d || !d.ok) return
            const L = d.flavor.length
            if (this.state.model !== 'classic' || this.props.motion === false) { this.setState({ typed: L }); return }
            this.typer = setInterval(() => {
                this.setState(s => {
                    const t = Math.min(L, s.typed + 2)
                    if (t >= L) clearInterval(this.typer)
                    return { typed: t }
                })
            }, 22)
        }, 90)
    }

    playCry(id) {
        const d = this.cache[id]
        if (!d || !d.cry) return
        try {
            if (this.audio) this.audio.pause()
            this.audio = new Audio(d.cry)
            this.audio.volume = 0.35
            this.audio.play().catch(() => {})
        } catch (e) {}
        this.setState({ crying: true })
        clearTimeout(this.ct)
        this.ct = setTimeout(() => this.setState({ crying: false }), 1400)
    }

    save() {
        const { model, favId, cor, bag } = this.state
        try { localStorage.setItem(PREF, JSON.stringify({ model, favId, cor, bag })) } catch (e) {}
    }

    capture(id, fromSetup) {
        const patch = { favId: id, draftFav: id, capture: { id, t: Date.now() }, phase: 'app', editing: false, step: 0 }
        if (fromSetup) Object.assign(patch, { gen: 'all', query: '', type: null })
        // O favorito entra na mochila automaticamente, se ainda houver espaço.
        const bag = this.state.bag
        if (!bag.includes(id) && bag.length < BAG_MAX) patch.bag = bag.concat(id)
        this.setState(patch, () => { this.save(); if (fromSetup) this.select(id) })
        clearTimeout(this.capT)
        this.loadDetail(id).then(() => { this.capT = setTimeout(() => this.playCry(id), 3400) })
    }

    // Põe ou tira um Pokémon da mochila. Com a mochila cheia, abre o painel para o usuário liberar espaço.
    toggleBag(id) {
        const bag = this.state.bag
        if (bag.includes(id)) {
            this.setState({ bag: bag.filter(x => x !== id), bagMsg: null }, () => this.save())
            return
        }
        if (bag.length >= BAG_MAX) {
            this.setState({ bagOpen: true, drawer: false, bagMsg: 'A mochila está cheia. Remova um Pokémon para abrir espaço.' })
            return
        }
        this.setState({ bag: bag.concat(id), bagMsg: null }, () => this.save())
        this.loadDetail(id).then(() => this.playCry(id))
    }

    // Leva a Pokédex até um Pokémon. Só mexe nos filtros se ele não estiver na lista atual.
    goTo(id, resetFilters) {
        const visible = this.filtered().some(p => p.id === id)
        const patch = { bagOpen: false, bagMsg: null }
        if (resetFilters || !visible) Object.assign(patch, { gen: 'all', query: '', type: null })
        this.setState(patch, () => {
            this.select(id)
            if (this.state.model === 'grid') this.setState({ drawer: true })
        })
    }

    // Clique no "Pokédex" do topo: volta para a escolha do modelo, guardando o atual caso o usuário cancele.
    editModel() {
        const s = this.state
        this.setState({ phase: 'setup', step: 0, editing: 'model', prevModel: s.model, prevCor: s.cor, drawer: false, bagOpen: false }, () => window.scrollTo(0, 0))
    }

    applyModel() {
        this.setState({ phase: 'app', editing: false, step: 0 }, () => { this.save(); this.kick() })
    }

    cancelSetup() {
        const s = this.state
        const patch = { phase: 'app', editing: false, step: 0 }
        if (s.editing === 'model') Object.assign(patch, { model: s.prevModel, cor: s.prevCor })
        this.setState(patch, () => this.kick())
    }

    setCor(k) {
        this.setState({ cor: k }, () => { if (this.state.phase === 'app') this.save() })
    }

    setFilter(patch) {
        this.setState(Object.assign({ gridLimit: 96 }, patch), () => {
            const f = this.filtered()
            if (f.length && !f.some(p => p.id === this.state.selId) && this.state.model !== 'grid') this.select(f[0].id)
        })
    }

    // Calcula tudo o que as telas precisam mostrar (equivale ao renderVals do protótipo).
    renderVals() {
        const s = this.state, motion = this.props.motion !== false
        const sh = s.shiny
        const filt = this.filtered()
        const byId = id => s.list.find(p => p.id === id)
        const sel = byId(s.selId) || { id: s.selId, name: '', types: [] }
        const d = this.cache[s.selId] || {}
        const fav = s.favId ? byId(s.favId) : null
        const t0 = sel.types[0] || 'normal', tc = TYPES[t0][1]
        const idx = filt.findIndex(p => p.id === s.selId)
        const pop = motion ? 'pdPop .55s cubic-bezier(.2,1.4,.4,1) both' : 'none'
        // A chave muda junto com o Pokémon/shiny, então a imagem é recriada e a animação de entrada toca de novo.
        const heroImg = (key, src, fb, size, pixel) => html`<img key=${key} src=${src} alt="" data-fb=${fb} style=${`display:block;width:${size}px;height:${size}px;object-fit:contain;image-rendering:${pixel ? 'pixelated' : 'auto'};animation:${pop};`} />`
        const card = p => ({ id: p.id, label: nice(p.name), num: num(p.id), src: spr(p.id, sh), fb: spr(p.id, false), tint: TYPES[p.types[0] || 'normal'][1] + '2E', types: p.types.map(badge), isFav: p.id === s.favId })
        const isFavSel = s.favId === s.selId
        const tema = corClassica(s.cor)
        const bagSet = new Set(s.bag)
        const inBag = bagSet.has(s.selId)
        const bagFull = s.bag.length >= BAG_MAX

        const stats = (d.stats || []).map(x => {
            const segN = Math.round(Math.min(1, x.v / 180) * 15)
            return {
                label: STATS[x.k] || x.k, labelUp: (STATS[x.k] || x.k).toUpperCase(), v: x.v,
                w: (s.statsOn ? Math.min(100, x.v / 1.8) : 0) + '%',
                color: x.v >= 100 ? '#247A48' : x.v >= 60 ? '#1B5BA0' : '#B7791A',
                segs: Array.from({ length: 15 }, (_, i) => ({ bg: s.statsOn && i < segN ? '#2E8B57' : '#2A3744', delay: (i * 30) + 'ms' })),
            }
        })
        const evo = (d.evo || []).map((stage, i) => ({
            notFirst: i > 0,
            items: stage.map(id => {
                const p = byId(id)
                return { id, label: p ? nice(p.name) : num(id), src: spr(id, sh), border: id === s.selId ? '#1B5BA0' : '#D6DDE6', darkBorder: id === s.selId ? '#2E8B57' : '#2A3744', go: () => this.select(id) }
            }),
        }))

        const radar = () => {
            if (!d.stats) return null
            const R = 92, cx = 150, cy = 125
            const pt = (i, r) => { const a = -Math.PI / 2 + i * Math.PI / 3; return [cx + r * Math.cos(a), cy + r * Math.sin(a)] }
            const poly = r => [0, 1, 2, 3, 4, 5].map(i => pt(i, r).join(',')).join(' ')
            const aneis = [.25, .5, .75, 1].map(f => html`<polygon key=${'g' + f} points=${poly(R * f)} fill=${f === 1 ? '#F6F8FA' : 'none'} stroke="#D6DDE6" stroke-width="1" />`)
            const eixos = [0, 1, 2, 3, 4, 5].map(i => { const [x, y] = pt(i, R); return html`<line key=${'a' + i} x1=${cx} y1=${cy} x2=${x} y2=${y} stroke="#D6DDE6" />` })
            const forma = html`<polygon key=${'p' + s.selId} points=${d.stats.map((x, i) => pt(i, R * Math.max(.06, Math.min(1, x.v / 160))).join(',')).join(' ')} fill=${tc + '59'} stroke=${tc} stroke-width="2.5" stroke-linejoin="round" style=${`transform-origin:${cx}px ${cy}px;animation:${motion ? 'pdGrow .7s cubic-bezier(.2,1.3,.4,1) both' : 'none'};`} />`
            const rotulos = d.stats.map((x, i) => { const [lx, ly] = pt(i, R + 22); return html`<text key=${'l' + i} x=${lx} y=${ly} text-anchor="middle" dominant-baseline="middle" font-size="11" font-weight="700" fill="#586675" font-family="Inter, system-ui, sans-serif">${SHORT[x.k] + ' ' + x.v}</text>` })
            return html`<svg viewBox="0 0 300 250" style="width:100%;max-width:340px;height:auto;overflow:visible;">${aneis}${eixos}${forma}${rotulos}</svg>`
        }

        const kStart = Math.max(0, Math.min(idx - 4, filt.length - 10))
        const keys = filt.slice(kStart, kStart + 10).map(p => {
            const on = p.id === s.selId
            return { id: p.id, num: num(p.id), src: spr(p.id, sh), fb: spr(p.id, false), bg: on ? 'var(--clarissimo)' : 'var(--claro)', shadow: on ? 'inset 0 2px 0 color-mix(in srgb, var(--borda) 35%, transparent)' : '0 3px 0 var(--borda)', ty: on ? 'translateY(3px)' : 'none', go: () => this.select(p.id) }
        })
        const film = filt.slice(Math.max(0, idx - 6), Math.max(0, idx) + 7).map(p => {
            const on = p.id === s.selId
            return { id: p.id, num: num(p.id), src: spr(p.id, sh), fb: spr(p.id, false), border: on ? '2px solid #1B5BA0' : '1px solid #D6DDE6', tf: on ? 'scale(1.1)' : 'scale(.94)', op: on ? 1 : .7, go: () => this.select(p.id) }
        })

        const pf = filtrar(s.list, s.pickGen, s.pickQuery, null)
        const pickItems = pf.slice(0, s.pickLimit).map(p => {
            const on = p.id === s.draftFav
            return Object.assign(card(p), {
                src: spr(p.id, false), border: on ? '#1B5BA0' : '#D6DDE6', bg: on ? '#EAF0F6' : '#fff',
                anim: on && motion ? 'pdBob 1.2s ease-in-out infinite' : 'none',
                go: () => { this.setState({ draftFav: p.id }); this.loadDetail(p.id).then(() => this.playCry(p.id)) },
            })
        })
        // Mochila: 6 espaços (ocupados ou vazios) e a lista para adicionar Pokémon.
        const bagSlots = Array.from({ length: BAG_MAX }, (_, i) => {
            const id = s.bag[i]
            if (!id) return { vazio: true, n: i + 1 }
            const p = byId(id) || { id, name: '', types: [] }
            return Object.assign(card(p), { n: i + 1, label: nice(p.name) || num(id), remove: () => this.toggleBag(id), go: () => this.goTo(id) })
        })
        const bagTypes = [...new Set(s.bag.flatMap(id => (byId(id) || { types: [] }).types))].map(badge)
        const bf = filtrar(s.list, s.bagGen, s.bagQuery, null)
        const bagPick = bf.slice(0, s.bagLimit).map(p => Object.assign(card(p), { src: spr(p.id, false), on: bagSet.has(p.id), go: () => this.toggleBag(p.id) }))

        const draft = s.draftFav ? byId(s.draftFav) : null
        const dd = (s.draftFav && this.cache[s.draftFav]) || {}

        const typeChips = [{ k: 'all', label: 'Todos os tipos', dot: '#8893A2', bg: !s.type ? '#1B2733' : '#fff', fg: !s.type ? '#fff' : '#586675', border: !s.type ? '#1B2733' : '#D6DDE6', go: () => this.setFilter({ type: null }) }]
            .concat(Object.keys(TYPES).map(t => {
                const on = s.type === t
                return { k: t, label: TYPES[t][0], dot: on ? (TYPES[t][2] ? '#1B2733' : '#fff') : TYPES[t][1], bg: on ? TYPES[t][1] : '#fff', fg: on ? (TYPES[t][2] ? '#1B2733' : '#fff') : '#586675', border: on ? TYPES[t][1] : '#D6DDE6', go: () => this.setFilter({ type: on ? null : t }) }
            }))

        const ready = !s.loading && !s.error
        const cp = s.capture ? byId(s.capture.id) : null
        const scanFx = motion ? html`<div key=${'fx' + s.selId + sh} class="varredura"></div>` : null

        return {
            motionStyle: motion ? null : html`<style>*,*::before,*::after{animation:none!important;transition:none!important}</style>`,
            isSetup: s.phase === 'setup', isApp: s.phase === 'app', isStep0: s.step === 0, isStep1: s.step === 1, isEditing: !!s.editing,
            isEditModel: s.editing === 'model', editModel: () => this.editModel(), applyModel: () => this.applyModel(),

            // Cor do aparelho (modelo Clássica)
            temaVars: varsCor(tema), corNome: tema.nome, showCores: s.model === 'classic',
            cores: CORES_CLASSICA.map(c => ({ k: c.k, nome: c.nome, casco: c.casco, borda: c.borda, ativo: c.k === s.cor, pick: () => this.setCor(c.k) })),

            // Mochila
            bagOpen: s.bagOpen, bagCount: s.bag.length, bagMax: BAG_MAX, bagFull, bagSlots, bagTypes, bagPick, bagMsg: s.bagMsg,
            bagMini: s.bag.map(id => ({ id, src: spr(id, false) })),
            openBag: () => this.setState({ bagOpen: true, drawer: false, bagMsg: null }),
            closeBag: () => this.setState({ bagOpen: false, bagMsg: null }),
            bagQuery: s.bagQuery, bagGen: s.bagGen,
            onBagQuery: e => this.setState({ bagQuery: e.target.value, bagLimit: 120 }),
            onBagGen: e => this.setState({ bagGen: e.target.value, bagLimit: 120 }),
            hasMoreBagPick: bf.length > s.bagLimit, loadMoreBagPick: () => this.setState({ bagLimit: s.bagLimit + 120 }),
            inBag, toggleBagSel: () => this.toggleBag(s.selId),
            bagBtnLabel: inBag ? 'Na mochila' : bagFull ? 'Mochila cheia' : 'Pôr na mochila',

            step0Color: s.step === 0 ? '#1B2733' : '#586675', step1Color: s.step === 1 ? '#1B2733' : '#8893A2',
            step0Dot: '#1B5BA0', step1Dot: s.step === 1 ? '#1B5BA0' : '#C3CCD8',
            models: MODELS.map(m => ({
                ...m, active: s.model === m.k, isClassic: m.k === 'classic', isGrid: m.k === 'grid', isScan: m.k === 'scan',
                border: s.model === m.k ? '#1B5BA0' : '#D6DDE6', tabBg: s.model === m.k ? '#fff' : 'transparent', tabFg: s.model === m.k ? '#144376' : '#DBE5F0',
                pick: () => this.setState({ model: m.k, drawer: false }, () => { if (s.phase === 'app') this.save(); this.kick() }),
            })),
            setupNext: () => this.setState({ step: 1 }),
            setupBack: () => this.setState({ step: 0 }),
            setupCancel: () => this.cancelSetup(),
            finishSetup: () => { if (s.draftFav) this.capture(s.draftFav, true) },
            finishOpacity: s.draftFav ? 1 : .5,
            gens: GENS.map(g => ({ k: g[0], label: g[1] })),
            pickQuery: s.pickQuery, pickGen: s.pickGen,
            onPickQuery: e => this.setState({ pickQuery: e.target.value, pickLimit: 120 }),
            onPickGen: e => this.setState({ pickGen: e.target.value, pickLimit: 120 }),
            pickItems, hasMorePick: pf.length > s.pickLimit, loadMorePick: () => this.setState({ pickLimit: s.pickLimit + 120 }),
            hasDraft: !!draft, noDraft: !draft,
            draftName: draft ? nice(draft.name) : '', draftNum: draft ? num(draft.id) : '', draftGenus: dd.genus || '',
            draftTypes: draft ? draft.types.map(badge) : [], draftTint: draft ? TYPES[draft.types[0] || 'normal'][1] + '33' : '#EDF0F4',
            draftHero: draft ? heroImg('dr' + draft.id, art(draft.id, false), spr(draft.id, false), 190, false) : null,
            draftCry: () => s.draftFav && this.playCry(s.draftFav),

            loading: s.loading, hasError: !!s.error, error: s.error,
            retry: () => { try { localStorage.removeItem(IDX) } catch (e) {} this.loadIndex() },
            hasFav: !!fav, favName: fav ? nice(fav.name) : '', favSrc: fav ? gif(fav.id, false) : '', favFb: fav ? spr(fav.id, false) : '',
            goFav: () => { if (s.favId) this.goTo(s.favId) },
            changeFav: () => this.setState({ phase: 'setup', step: 1, editing: 'fav', draftFav: s.favId, pickGen: s.favId ? genOf(s.favId) : s.pickGen, drawer: false, bagOpen: false }, () => window.scrollTo(0, 0)),

            query: s.query, gen: s.gen,
            onQuery: e => this.setFilter({ query: e.target.value }),
            onGen: e => this.setFilter({ gen: e.target.value }),
            toggleShiny: () => this.setState({ shiny: !sh }),
            shinyBg: sh ? '#FFF3DC' : '#fff', shinyFg: sh ? '#B7791A' : '#586675', shinyBorder: sh ? '#B7791A' : '#C3CCD8',
            countLabel: ready ? filt.length + ' Pokémon' + (chaveDeBusca(s.query) ? ' em todas as gerações' : '') : '', typeChips,
            isEmpty: ready && !filt.length, clearFilters: () => this.setFilter({ query: '', type: null }),

            isClassic: ready && filt.length > 0 && s.model === 'classic',
            isGrid: ready && filt.length > 0 && s.model === 'grid',
            isScan: ready && filt.length > 0 && s.model === 'scan',
            shiny: sh,
            selNum: num(sel.id), selName: nice(sel.name), selNameUp: nice(sel.name).toUpperCase() || '—',
            selTypes: sel.types.map(badge), selGenus: d.genus || '', selH: d.h || '—', selW: d.w || '—', selAbilities: d.abilities || '—',
            flavor: d.flavor || '', flavorTyped: (d.flavor || '').slice(0, s.typed), captureRate: d.capture != null ? d.capture + '/255' : '—',
            stats, total: (d.stats || []).reduce((a, x) => a + x.v, 0) || '—', evo, hasEvo: evo.length > 1 || (evo[0] && evo[0].items.length > 1),
            detailLoading: !d.ok && !d.error,
            isFavSel, favLabel: isFavSel ? 'Seu favorito' : 'Tornar favorito', favBtnBg: isFavSel ? '#247A48' : '#1B5BA0',
            setFavSel: () => { if (!isFavSel) this.capture(s.selId, false) },
            playCry: () => this.playCry(s.selId),
            prev: () => this.step(-1), next: () => this.step(1), up: () => this.step(-10), down: () => this.step(10),
            lensBg: s.crying ? '#fff' : d.ok ? 'var(--claro)' : '#8893A2',
            lensAnim: s.crying ? 'pdPulse .5s ease-in-out infinite' : d.ok ? 'none' : 'pdBlink .6s infinite',
            classicHero: heroImg('c' + sel.id + sh, gif(sel.id, sh), spr(sel.id, sh), 170, true),
            scanFx, keys, tint: tc + '2E',
            gridItems: filt.slice(0, s.gridLimit).map((p, i) => Object.assign(card(p), {
                border: p.id === s.favId ? '#B7791A' : '#D6DDE6', delay: Math.min(i, 24) * 25 + 'ms', inBag: bagSet.has(p.id),
                open: () => { this.select(p.id); this.setState({ drawer: true }) },
            })),
            hasMoreGrid: filt.length > s.gridLimit, loadMoreGrid: () => this.setState({ gridLimit: s.gridLimit + 96 }),
            drawerOpen: s.drawer, closeDrawer: () => this.setState({ drawer: false }),
            drawerHero: heroImg('d' + sel.id + sh, art(sel.id, sh), spr(sel.id, sh), 210, false),
            isScanReady: d.ok,
            scanHero: heroImg('s' + sel.id + sh, art(sel.id, sh), spr(sel.id, sh), 300, false),
            radar: radar(), film,
            scanStatus: d.ok ? 'IDENTIFICADO' : 'ESCANEANDO…', scanStatusBg: d.ok ? '#E8F2EC' : '#EAF0F6', scanStatusFg: d.ok ? '#247A48' : '#1B5BA0',

            showCapture: !!cp, captureKey: s.capture ? s.capture.t : 0, captureArt: cp ? art(cp.id, false) : '', captureName: cp ? nice(cp.name) : '',
            closeCapture: () => this.setState({ capture: null }),
        }
    }

    render() {
        const v = this.renderVals()
        // Coluna com altura mínima da tela, para o rodapé ficar sempre no fim da página.
        return html`
            ${v.motionStyle}
            <div style="min-height:100vh;display:flex;flex-direction:column;">
                ${v.isSetup && telaSetup(v)}
                ${v.isApp && html`
                    ${cabecalho(v)}
                    <div style="flex:1;">
                        <main style="max-width:1280px;margin:0 auto;padding:20px 24px 56px;">
                            ${barraDeFiltros(v)}
                            ${estadosDaLista(v)}
                            ${v.isClassic && telaClassica(v)}
                            ${v.isGrid && telaCatalogo(v)}
                            ${v.isScan && telaScanner(v)}
                        </main>
                    </div>
                `}
                ${rodape()}
            </div>
            ${v.isApp && v.bagOpen && painelMochila(v)}
            ${v.showCapture && telaCaptura(v)}
        `
    }
}

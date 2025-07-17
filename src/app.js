import nodoj from './nodoj.min.js'

const dom = document.getElementById('app')
const bt = (innerHTML, on_click, ...attrs) => ({
	tag: 'button', innerHTML, on_click, attrs
})

const defaultTime = 30 * 60
let time
let mainInterval = null
let pause = false

const home = () => {
	dom.innerHTML = ''
	document.title = 'Tridek'
	nodoj.start([
		{children: [
			{tag: 'h1', textContent: `Tridek`},
			{_class: 'info', innerHTML: `Basée sur la technique <strong>Pomodoro</strong>, Tridek propose une session de <strong>30&nbsp;minutes</strong>, à suivre d’une pause bien méritée.`}
		]},
		{children: [
			bt(`Lancer la session`, () => {
				time = defaultTime
				running()
			})
		]}
	], dom)
}

const running = () => {
	dom.innerHTML = ''
	nodoj.start([
		{k: 'counter', _class: 'counter'},
		{_class: 'bts', children: [
			{...bt(`Pause`, () => {
				if (pause) {
					// REPRENDRE
					pause = false
					nodoj.k.toggle.textContent = `Pause`
					nodoj.k.counter.textContent = counterVal(time)
					mainInterval = setInterval(tick, 1000)
				} else {
					// PAUSE
					pause = true
					nodoj.k.toggle.textContent = `Reprendre`
					nodoj.k.counter.textContent = `(${counterVal(time)})`
					clearInterval(mainInterval)
				}
			}), k: 'toggle'},
			bt(`Annuler`, () => {
				clearInterval(mainInterval)
				time = defaultTime
				home()
			})
		]}
	], dom)

	nodoj.k.counter.textContent = counterVal(time)
	mainInterval = setInterval(tick, 1000)
}

const counterVal = time => `${Math.floor(time / 60)}:${String(time % 60).padStart(2, '0')}`

const tick = () => {
	if (pause) return
	time--
	nodoj.k.counter.textContent = counterVal(time)
	document.title = counterVal(time)

	if (time === 120) {
		new Notification("Tridek", {
			body: "Plus que 2 minutes.",
			icon: 'favicon.svg'
		})
	}
	if (time === 0) {
		clearInterval(mainInterval)
		new Notification("Tridek", {
			body: "Session terminée.",
			icon: 'favicon.svg'
		})
		const audio = new Audio('./bell.mp3')
		audio.play()
		home()
	}
}

home()

const framesPerSecond = 30
const fontSize = 30
const fontFamily = 'Noto Sans SC'
const lang = 'zh-CN'

let phrases = []
let nextPhrase = 0
let lives = 3
let score = 0
let loops = 0
let isGamePlaying = false

const lavaHeight = 60
const boxHeight = 50

function addNewPhrase() {
  phrases.unshift(data[nextPhrase])
  nextPhrase++
}

const canvas = document.querySelector('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
/* canvas.addEventListener('click', () => {
  if (!isGamePlaying) {
    
  }
}) */

const dataPhrases = ['我喜欢吃苹果', '他很慢', '他很忙', '我很聪明']

function getXCoordinates() {
  const x = getRndInteger(2, 4)
  return canvas.width / x
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const data = dataPhrases.map(p => ({
  text: p,
  posY: 0,
  posX: getXCoordinates(),
}))

const ctx = canvas.getContext('2d')

ctx.fillStyle = 'lightblue'
ctx.fillRect(0, 0, canvas.width, canvas.height)

ctx.font = `${fontSize}px ${fontFamily}`
ctx.fillStyle = 'black'
ctx.textAlign = 'center'
ctx.fillText('Say 开始 to start the game', canvas.width / 2, 80)

function drawPhrase({ text, posX, posY }) {
  const textLength = ctx.measureText(text).width

  ctx.fillStyle = 'white'
  ctx.fillRect(posX, posY, textLength + 20, boxHeight)
  ctx.fillStyle = 'black'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.font = `${fontSize}px ${fontFamily}`
  ctx.fillText(text, posX + 10, posY + boxHeight / 2)
}

function drawUtterance(utterance) {
  ctx.fillStyle = 'red'
  ctx.fillRect(0, canvas.height - lavaHeight, canvas.width, lavaHeight)
  ctx.fillStyle = 'white'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(utterance, canvas.width / 2, canvas.height - lavaHeight / 2)
}

function startGame() {
  isGamePlaying = true

  ctx.fillStyle = 'red'
  ctx.fillRect(0, canvas.height - lavaHeight, canvas.width, lavaHeight)

  let interval = setInterval(() => {
    ctx.fillStyle = 'lightblue'
    ctx.fillRect(0, 0, canvas.width, canvas.height - lavaHeight)

    ctx.fillStyle = 'black'
    ctx.fillText('Lives: ' + lives, canvas.width - 120, 40)
    ctx.fillStyle = 'black'
    ctx.fillText('Score: ' + score, canvas.width - 120, 80)

    phrases = phrases.map((p, i) => {
      return {
        ...p,
        posY: p.posY + 2,
      }
    })

    phrases.forEach((p, i) => {
      return drawPhrase(p)
    })

    if (!(loops % 50)) {
      if (data.length > nextPhrase) {
        addNewPhrase()
      }
    }

    // If a phrase touches the lava
    if (phrases.some(p => p.posY >= canvas.height - boxHeight - lavaHeight)) {
      let index = phrases.findIndex(
        p => p.posY >= canvas.height - boxHeight - lavaHeight
      )
      clearInterval(interval)
      speakOut(phrases[index].text)
      phrases.splice(index, 1)
      lives--
    }

    if (phrases.length > 0 && lives > 0) {
      loops++
    } else {
      isGamePlaying = false
      clearInterval(interval)
      console.log('end')
      recognition.stop()

      ctx.fillStyle = 'lightblue'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = 'black'
      ctx.fillText(lives, canvas.width - 100, 40)
      ctx.fillText('GAME OVER', 50, 50)
      return
    }
  }, 1000 / framesPerSecond)
}

let voices = []

const recognition = new webkitSpeechRecognition()
recognition.lang = lang
recognition.continuous = false

recognition.onresult = event => {
  const phrase = event.results[0][0].transcript
  console.log(phrase)
  if (!isGamePlaying && phrase === '开始') {
    startGame()
    return
  }

  drawUtterance(phrase)

  const index = phrases.findIndex(s => s.text === phrase)
  if (index >= 0) {
    phrases.splice(index, 1)
    score++
  }
}

recognition.onend = function() {
  if (isGamePlaying) {
    recognition.start()
  }
}

let utterance = new SpeechSynthesisUtterance()
utterance.onend = function() {
  //TODO: check side effects
  //startGame()
}

// ja-JP
function speakOut(phrase) {
  utterance.text = phrase
  speechSynthesis.cancel()
  speechSynthesis.speak(utterance)
}

speechSynthesis.addEventListener('voiceschanged', function() {
  voices = this.getVoices()
  utterance.voice = voices.find(voice => voice.lang === lang)
})

//recognition.start()

startGame()

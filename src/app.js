const lang = 'ja-JP' // Japanese: ja-JP ; Chinese: zh-CN
//const dataPhrases = ['我喜欢吃苹果', '他很慢', '他很忙', '我很聪明']

const dataPhrases = [
  'こんにちは',
  '善悪を見極めることは難しい',
  '彼は一筋縄ではいかない',
  '彼はその光景にはっと息をのんだ',
]

const framesPerSecond = 60
const speed = 1
const fontSize = 25
const fontFamily = 'Noto Sans SC'

let phrases = []
let nextPhrase = 0
let lives = 3
let score = 0
let loops = 0
let isGamePlaying = false

let failedPhrases = []
let passedPhrases = []

const lavaHeight = 60
const lavaColor = '#CC1F1A'
const boxHeight = 50

function addNewPhrase() {
  phrases.unshift(data[nextPhrase])
  nextPhrase++
}

const canvas = document.querySelector('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

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
  ctx.fillStyle = lavaColor
  ctx.fillRect(0, canvas.height - lavaHeight, canvas.width, lavaHeight)
  ctx.fillStyle = 'white'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(utterance, canvas.width / 2, canvas.height - lavaHeight / 2)
}

function startGame() {
  isGamePlaying = true

  ctx.fillStyle = lavaColor
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
        posY: p.posY + speed,
      }
    })

    phrases.forEach((p, i) => {
      return drawPhrase(p)
    })

    if (!(loops % 200)) {
      if (data.length > nextPhrase) {
        addNewPhrase()
      }
    }

    // If a phrase touches the lava
    if (phrases.some(p => p.posY >= canvas.height - boxHeight - lavaHeight)) {
      let index = phrases.findIndex(
        p => p.posY >= canvas.height - boxHeight - lavaHeight
      )
      isGamePlaying = false
      clearInterval(interval)
      speakOut(phrases[index].text)
      failedPhrases.push(phrases[index].text)
      phrases.splice(index, 1)
      lives--
    }

    if (
      failedPhrases.length + passedPhrases.length >= dataPhrases.length ||
      lives <= 0
    ) {
      isGamePlaying = false
      clearInterval(interval)
      console.log('end')
      recognition.stop()

      ctx.fillStyle = 'lightblue'
      ctx.fillRect(0, 0, canvas.width, canvas.height - lavaHeight)
      ctx.fillStyle = 'black'
      ctx.fillText('Lives: ' + lives, canvas.width - 120, 40)
      ctx.fillStyle = 'black'
      ctx.fillText('Score: ' + score, canvas.width - 120, 80)

      ctx.fillText('refresh to replay', 50, 100)

      if (lives > 0) {
        ctx.fillText('SUCCESS', 50, 50)
      } else {
        ctx.fillText('GAME OVER', 50, 50)
      }
      return
    } else {
      loops++
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
    passedPhrases.push(phrases[index])
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
  startGame()
}

utterance.onerror = function(e) {
  //TODO: if user has not yet interacted with the page, error is fired
  console.log(e)
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

recognition.start()

startGame()

<template>
  <div>
    <main>
      <!--  <Invader v-for="sentence in sentences"
               class="max-w-sm mx-auto"
               :key="sentence.sentence"
               :sentence="sentence" /> -->

      <canvas height="500"
              width="500"></canvas>
    </main>
  </div>
</template>

<script>
//import Invader from '@/components/Invader'

export default {
  name: 'home',
  mounted() {
    const data = [
      { text: '我喜欢吃苹果', posY: 0 },
      { text: '他很慢', posY: 0 },
      { text: '他很忙', posY: 0 },
    ]

    const framesPerSecond = 30
    let nextPhrase = 0
    let lives = 3
    let score = 0
    const fontSize = 30
    const fontFamily = 'Noto Sans SC'

    const recognition = new webkitSpeechRecognition()
    recognition.lang = 'zh-CN'
    recognition.continuous = false

    recognition.onresult = event => {
      console.log(event)
      const phrase = event.results[0][0].transcript
      console.log(phrase)

      const index = phrases.findIndex(s => s.text === phrase)
      if (index >= 0) {
        phrases.splice(index, 1)
        score++
      }
    }

    /*  recognition.onend = function() {
      recognition.start()
    }

    recognition.start() */

    function addNewPhrase() {
      phrases.unshift(data[nextPhrase])
      nextPhrase++
    }

    let phrases = []

    let canvas = document.querySelector('canvas')
    canvas.width = window.innerWidth - 50
    canvas.height = window.innerHeight - 50
    let ctx = canvas.getContext('2d')
    const lavaHeight = 40

    ctx.fillStyle = 'lightblue'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    let loops = 0

    function drawPhrase({ text, posY }) {
      const textLength = ctx.measureText(text).width

      ctx.fillStyle = 'white'
      ctx.fillRect(10, posY, textLength + 20, 50)
      ctx.fillStyle = 'black'
      ctx.font = `${fontSize}px ${fontFamily}`
      //TODO:
      // ctx.textAlign = 'center'
      ctx.fillText(text, 20, posY + 35)
    }

    let interval = setInterval(() => {
      ctx.fillStyle = 'lightblue'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = 'red'
      ctx.fillRect(0, canvas.height - lavaHeight, canvas.width, lavaHeight)
      ctx.fillStyle = 'black'
      ctx.fillText('Lives: ' + lives, canvas.width - 120, 40)
      ctx.fillStyle = 'black'
      ctx.fillText('Score: ' + score, canvas.width - 120, 80)

      phrases = phrases.map((p, i) => {
        return {
          text: p.text,
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

      if (phrases.some(p => p.posY > canvas.height - 50 - lavaHeight)) {
        let index = phrases.findIndex(p => p.posY > canvas.height - 50)
        phrases.splice(index, 1)
        lives--
      }

      if (phrases.length > 0) {
        loops++
      } else {
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
  },
}
</script>

<style scoped>
</style>


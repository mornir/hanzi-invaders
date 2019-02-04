<template>
  <div class="bg-blue-light min-h-screen flex items-center">
    <main class="container mx-auto p-4">
      <Invader v-for="sentence in sentences"
               class="max-w-sm mx-auto"
               :key="sentence.sentence"
               :sentence="sentence" />
    </main>
  </div>
</template>

<script>
import { sentences } from '@/data/sentences'
/* import annyang from 'annyang'
annyang.setLanguage('zh-CN') */

import Invader from '@/components/Invader'

export default {
  name: 'home',
  data() {
    return {
      sentences,
    }
  },
  components: {
    Invader,
  },
  mounted() {
    /*    if (annyang) {
         const mark = sentence => {
        console.log(this.sentences)
        const index = this.sentences.findIndex(s => s.sentence === sentence)
        this.sentences[index].mark = true
      }

      const commands = {
        我喜欢吃苹果() {
          mark('我喜欢吃苹果')
          console.log('我喜欢吃苹果')
        },
        他很慢() {
          mark('他很慢')
          console.log('他很慢!')
        },
        他很忙() {
          mark('他很忙')
          console.log('他很忙!')
        },
      } 
    
       annyang.addCommands(commands)

       annyang.start({ continuous: false })
    } else {
      console.error('❌❌❌❌')
    } */

    const recognition = new webkitSpeechRecognition()
    recognition.lang = 'zh-CN'
    recognition.continuous = false

    recognition.onresult = event => {
      console.log(event)
      const sentence = event.results[0][0].transcript
      console.log(sentence)

      const index = this.sentences.findIndex(s => s.sentence === sentence)
      if (index >= 0) {
        this.sentences[index].mark = true
      }
    }

    recognition.onend = function() {
      recognition.start()
    }

    recognition.start()
  },
}
</script>

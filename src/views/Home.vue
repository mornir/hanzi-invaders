<template>
  <div class="bg-blue-light min-h-screen">
    <main class="container mx-auto p-4">
      <Invader v-for="sentence in sentences"
               :key="sentence"
               :sentence="sentence" />
    </main>
  </div>
</template>

<script>
import annyang from 'annyang'
annyang.setLanguage('zh-CN')


import Invader from '@/components/Invader'

const sentences = ['我喜欢吃苹果', '他很慢', '他很忙']
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
    if (annyang) {
      // Let's define a command.
      const commands = {
        我喜欢吃苹果() {
          console.log('我喜欢吃苹果!')
        },
        他很慢() {
          console.log('他很慢!')
        },
       他很慢() {
          console.log('他很慢!')
        },
        '他很忙': function() {
          console.log('他很忙!')
        },
   
      }

      

      // Add our commands to annyang
      annyang.addCommands(commands)

      // Start listening.
      annyang.start({ continuous: false });
    } else {
      console.error('❌❌❌❌')
    }
  },
}
</script>

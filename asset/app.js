
new Vue({
  el: '#app',
  data: {
    greenActive: false,
    redActive: false,
    yellowActive: false,
    blueActive: false,
    strictMode: false,
    starting: false,
    switchOn: false,
    locking: true,
    maxLevel: 20,
    count: '',
    colorsDict: {
      0: 'green',
      1: 'red',
      2: 'yellow',
      3: 'blue'
    },
    audios: [
      new Audio('asset/audios/simonSound1.mp3'),
      new Audio('asset/audios/simonSound2.mp3'),
      new Audio('asset/audios/simonSound3.mp3'),
      new Audio('asset/audios/simonSound4.mp3')
    ],
    steps: [],
    playerSteps: []
  },
  methods: {
    toggleSwitch() {
      this.switchOn = !this.switchOn
      if (this.switchOn) {
        this.count = '- -'
      } else {
        this.strictMode = false
        this.steps = []
        this.playerSteps = []
        this.count = ''
        this.locking = true
      }
    },
    strictOn() {
      if (this.switchOn) {
        this.strictMode = !this.strictMode  
      }
    },
    start: _.debounce(function() {
      if (!this.switchOn) {
        return
      }
      this.count = '- -'
      this.steps = []
      this.playerSteps = []
      setTimeout(() => {
        this.addStep()
        this.count = this.steps.length
        this.replaySteps()
      }, 1000)
    }, 1000),
    addAndReplaySteps() {
        this.addStep()
        this.replaySteps()
    },
    addStep() {
      const index = Math.floor(Math.random() * 4)
      this.steps.push(index)
    },
    justPlayAudio(index){
      this.audios[index].play()
      const color = this.colorsDict[index]
      const activeClass = `${color}Active`
      this[activeClass] = true
      setTimeout(() => {
        this[activeClass] = false
      }, 700)
    },
    playAudio(index) {
      if (this.locking || !this.switchOn || this.steps.length == this.playerSteps.length) {
        return
      }
      this.audios[index].play()
      this.playerSteps.push(index)
      const latestStep = this.steps[this.steps.length - 1]
      const latestIndex = this.playerSteps.length - 1
      // press wrong steps
      if (this.steps[latestIndex] != index) {
        this.playWrongAudio()
        this.playWrongAudio()
        this.count = '! !'
        if (this.strictMode) {
          setTimeout(this.start, 1000)
        } else {
          setTimeout(this.replaySteps, 1000)
        }
        return
      }
      
      // press correct steps
      if (this.steps.length == this.playerSteps.length) {
        if (this.count == this.maxLevel) {
          this.count = 'END'
          setTimeout(this.start, 2000)
          return
        }
        setTimeout(() => {
          this.count++
          this.addAndReplaySteps()
        }, 1000)
      }
    },
    replaySteps() {
      this.playerSteps = []
      this.count = this.steps.length
      this.locking = true
      this.steps.forEach((value, index) => {
        setTimeout(() => {
          this.justPlayAudio(value)
          if (index == this.steps.length - 1) {
              setTimeout(() => {
                this.locking = false
              }, 1000) 
          }
        }, 1000 * (index+1))
      })
    },
    playWrongAudio() {
      this.audios[0].play()
      this.audios[1].play()
      this.audios[2].play()
      this.audios[3].play()      
    }
  }
})
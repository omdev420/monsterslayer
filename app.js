function getRandomValue(max, min) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
  data() {
    return {
      monsterHP: 100,
      playerHP: 100,
      currentRound: 1,
      specialAttackUsed: true,
      winner: null,
      logMessages:[],
    }
  },
  computed: {
    monsterBarStyles() {
      if (this.monsterHP < 0) {
        return { width: '0%' };
      }
      return { width: this.monsterHP + '%' };
    },
    playerBarStyles() {
      if (this.playerHP < 0) {
        return { width: '0%' };
      }
      return { width: this.playerHP + '%' };
    },
  },
  watch: {
    currentRound(value) {
      if (value % 3 === 0) {
        this.specialAttackUsed = false;
      }
    },
    playerHP(value) {
      if (value <= 0 && this.monsterHP <= 0) {
        // A draw
        this.winner = 'draw';
      } else if (value <= 0) {
        //Player lost
        this.winner = 'monster';
      }
    },
    monsterHP(value) {
      if (value <= 0 && this.playerHP <= 0) {
        //A draw
        this.winner = 'draw';
      } else if (value <= 0) {
        //Monster lost
        this.winner = 'player';
      }
    }
  },
  methods: {
    attackMonster() {
      this.currentRound++;
      const attackValue = getRandomValue(12,5);
      this.monsterHP -= attackValue;
      this.addLogMessage('Player', 'attacks', attackValue);
      this.attackPlayer();
    },
    attackPlayer() {
      const attackValue = getRandomValue(15, 8);
      this.playerHP -= attackValue;
      this.addLogMessage('Monster', 'attacks', attackValue);
    },
    specialAttackMonster() {
      this.currentRound++;
      this.specialAttackUsed = true;
      const attackValue = getRandomValue(25, 10);
      this.monsterHP -= attackValue;
      this.addLogMessage('Player', 'attacks', attackValue);
      this.attackPlayer();
    },
    healPlayer() {
      this.currentRound++;
      const healValue = getRandomValue(20, 8);
      this.addLogMessage('Player', 'heals', healValue);
      if (this.playerHP + healValue > 100) {
        this.playerHP = 100;
      } else {
        this.playerHP += healValue;
      }
      this.attackPlayer();
    },
    startGame() {
      this.playerHP = 100;
      this.monsterHP = 100;
      this.winner = null;
      this.currentRound = 1;
      this.logMessages = [];
    },
    surrender() {
      this.winner = 'monster';
    },
    addLogMessage(who, what, value) {
      this.logMessages.unshift({
        actionBy: who,
        actionType: what,
        actionValue: value
      })
    }
  },

});

app.mount('#game');
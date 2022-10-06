import { Spaceship } from "./Spaceship.js";
import { Enemy } from "./Enemy.js";

class Game {
  #htmlElements = {
    spaceship: document.querySelector("[data-spaceship]"),
    conteiner: document.querySelector("[data-conteiner]"),
    score: document.querySelector("[data-score]"),
    lives: document.querySelector("[data-lives]"),
    modal: document.querySelector("[data-modal]"),
    scoreModal: document.querySelector("[data-score-modal]"),
    button: document.querySelector("[data-button]"),
  };

  #ship = new Spaceship(
    this.#htmlElements.spaceship,
    this.#htmlElements.conteiner
  );
  #lives = null;
  #score = null;
  #enemies = [];
  #enemiesInterval = null;
  #checkPosInterval = null;
  #createEnemyInterval = null;

  init() {
    this.#ship.init();
    this.#newGame();
    this.#htmlElements.button.addEventListener("click", () => this.#newGame());
  }

  #newGame() {
    this.#htmlElements.modal.classList.add("hide");
    this.#enemiesInterval = 15;
    this.#createEnemyInterval = setInterval(() => {
      this.#randomNewEnemy();
    }, 1000);
    this.#lives = 3;
    this.#score = 0;

    (this.#checkPosInterval = setInterval(() => this.#checkPosition())), 1;
  }

  #endGame() {
    this.#htmlElements.modal.classList.remove("hide");
    this.#htmlElements.scoreModal.textContent = `You Lose! Score: ${
      this.#score
    }`;
    this.#enemies.forEach((enemy) => enemy.explode());
    this.#enemies.lenght = 0;
    clearInterval(this.#createEnemyInterval);
    clearInterval(this.#checkPosInterval);
  }

  #randomNewEnemy() {
    const randomNumber = Math.floor(Math.random() * 5) + 1;
    randomNumber % 5
      ? this.#createNewEnemy(
          this.#htmlElements.conteiner,
          "enemy",
          this.#enemiesInterval,
          1,
          "explode"
        )
      : this.#createNewEnemy(
          this.#htmlElements.conteiner,
          "enemyBig",
          this.#enemiesInterval * 2,
          4,
          "explodeBig"
        );
  }

  #createNewEnemy(...params) {
    {
      const enemy = new Enemy(...params);
      enemy.init();
      this.#enemies.push(enemy);
    }
  }
  #checkPosition() {
    this.#ship.missiles.forEach((missile, index, missileArr) => {
      const missilePos = {
        top: missile.element.offsetTop,
        right: missile.element.offsetLeft + missile.element.offsetWidth,
        bottom: missile.element.offsetTop + missile.element.offsetHeight,
        left: missile.element.offsetLeft,
      };
      if (missilePos.bottom < 0) {
        missile.remove();
        missileArr.splice(index, 1);
        console.log(missileArr);
      }

      this.#enemies.forEach((enemy, index, enemyArr) => {
        const enemyPos = {
          top: enemy.element.offsetTop,
          right: enemy.element.offsetLeft + enemy.element.offsetWidth,
          bottom: enemy.element.offsetTop + enemy.element.offsetHeight,
          left: enemy.element.offsetLeft,
        };
        if (
          enemyPos.bottom >= missilePos.top &&
          enemyPos.top <= missilePos.bottom &&
          missilePos.right >= enemyPos.left &&
          missilePos.left <= enemyPos.right
        ) {
          missile.remove();
          missileArr.splice(index, 1);
          this.#updateScore();
          enemy.hit();
          if (enemy.lives === 0) {
            enemyArr.splice(index, 1);
          }
        }

        if (enemyPos.top > window.innerHeight) {
          enemy.remove();
          enemyArr.splice(index, 1);
          this.#updateLives();
        }
      });
    });
  }
  #updateLives() {
    this.#lives--;
    this.#updateLivesText();
    this.#htmlElements.conteiner.classList.add("hit");
    setTimeout(() => this.#htmlElements.conteiner.classList.remove("hit"), 500);
    if (this.#lives === 0) this.#endGame();
  }

  #updateScore() {
    this.#score++;
    if (this.#score % 5) {
      this.#enemiesInterval--;
    }

    this.#updateScoreText();
  }
  #updateScoreText() {
    this.#htmlElements.score.textContent = `Score: ${this.#score}`;
  }
  #updateLivesText() {
    this.#htmlElements.lives.textContent = `Lives: ${this.#lives}`;
  }
}
window.onload = function () {
  const game = new Game();
  game.init();
};

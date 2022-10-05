import { Spaceship } from "./Spaceship.js";
import { Enemy } from "./Enemy.js";

class Game {
  #htmlElements = {
    spaceship: document.querySelector("[data-spaceship]"),
    conteiner: document.querySelector("[data-conteiner]"),
  };

  #ship = new Spaceship(
    this.#htmlElements.spaceship,
    this.#htmlElements.conteiner
  );
  #enemies = [];
  #enemiesInterval = null;
  #checkPosInterval = null;
  #createEnemyInterval = null;

  init() {
    this.#ship.init();
    this.#newGame();
  }

  #newGame() {
    this.#enemiesInterval = 5;
    this.#createEnemyInterval = setInterval(() => {
      this.#randomNewEnemy();
    }, 1000);

    (this.#checkPosInterval = setInterval(() => this.#checkPosition())), 1;
  }

  #randomNewEnemy() {
    const randomNumber = Math.floor(Math.random() * 2) + 1;
    randomNumber % 2
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
          enemy.hit();
          if (enemy.lives === 0) {
            enemyArr.splice(index, 1);
            // enemy.remove();
          }
        }
        if (enemyPos.top > window.innerHeight) {
          enemy.remove();
          enemyArr.splice(index, 1);
        }
      });
    });
  }
}
window.onload = function () {
  const game = new Game();
  game.init();
};

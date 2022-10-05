export class Enemy {
  constructor(container, enemyClass, intervalTime, lives = 0, explodeClass) {
    this.container = container;
    this.element = document.createElement("div");
    this.enemyClass = enemyClass;
    this.setInterval = null;
    this.intervalTime = intervalTime;
    this.lives = lives;
    this.explodeClass = explodeClass;
  }
  init() {
    this.#setEnemy();
    this.#updatePosition();
  }
  #setEnemy() {
    this.element.classList.add(this.enemyClass);
    this.container.appendChild(this.element);
    this.element.style.top = "0px";
    this.element.style.left = `${this.#randomposition()}px`;
  }

  #randomposition() {
    return Math.floor(
      Math.random() * window.innerWidth - this.element.offsetWidth
    );
  }

  #updatePosition() {
    this.setInterval = setInterval(() => {
      this.#setNewPosition();
    }, this.intervalTime);
  }
  #setNewPosition() {
    this.element.style.top = `${this.element.offsetTop + 1}px`;
  }

  remove() {
    clearInterval(this.intervalTime);
    this.element.remove();
  }
  hit() {
    console.log(this.lives);
    this.lives--;
    if (!this.lives) {
      this.explode();
      console.log(this.lives);
    }
  }
  explode() {
    this.element.classList.remove(this.enemyClass);
    this.element.classList.add(this.explodeClass);
    clearInterval(this.intervalTime);
    setTimeout(() => {
      this.element.remove();
    }, 700);
  }
}

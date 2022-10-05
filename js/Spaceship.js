import { Missile } from "./Missile.js";

export class Spaceship {
  #modifier = 10;
  #leftArrow = false;
  #rightArrow = false;
  missiles = [];

  constructor(element, conteiner) {
    this.element = element;
    this.conteiner = conteiner;
  }
  init() {
    this.#setPosition();
    this.#eventListeners();
    this.#gameLoop();
  }
  #setPosition() {
    this.element.style.bottom = "0px";
    this.element.style.left = `${
      window.innerWidth / 2 - this.#getPosition()
    }px`;
  }
  #getPosition() {
    return this.element.offsetLeft + this.element.offsetWidth / 2;
  }
  #eventListeners() {
    window.addEventListener("keydown", ({ keyCode }) => {
      switch (keyCode) {
        case 37:
          this.#leftArrow = true;

          break;
        case 39:
          this.#rightArrow = true;

          break;
      }
    });
    window.addEventListener("keyup", ({ keyCode }) => {
      switch (keyCode) {
        case 37:
          this.#leftArrow = false;

          break;
        case 39:
          this.#rightArrow = false;

          break;
        case 32:
          this.#fire();

          break;
      }
    });
  }

  #gameLoop = () => {
    this.#whatKey();
    requestAnimationFrame(this.#gameLoop);
  };
  #whatKey() {
    if (this.#leftArrow && this.#getPosition() > 12) {
      this.element.style.left = `${
        parseInt(this.element.style.left, 10) - this.#modifier
      }px`;
    }
    if (this.#rightArrow && this.#getPosition() + 12 < window.innerWidth) {
      this.element.style.left = `${
        parseInt(this.element.style.left, 10) + this.#modifier
      }px`;
    }
  }

  #fire() {
    const missile = new Missile(
      this.#getPosition(),
      this.element.offsetTop,
      this.conteiner
    );
    missile.init();
    this.missiles.push(missile);
    console.log(this.missiles);
  }
}

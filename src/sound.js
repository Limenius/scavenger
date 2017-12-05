import Howler from "howler";
const { Howl } = Howler;

export default class Sound {
  load() {
    return new Promise((resolve, reject) => {
      this.sounds = {
        music: new Howl({
          src: ["./sounds/scavenger.mp3"],
          autoplay: true,
          loop: true,
          volume: 0.5,
          onload: function() {
            resolve();
          }
        }),
        blub: new Howl({
          src: ["./sounds/blub.wav"],
          loop: false,
          volume: 1,
          onload: function() {
            resolve();
          }
        }),
        lvlup: new Howl({
          src: ["./sounds/lvlup.wav"],
          loop: false,
          volume: 1,
          onload: function() {
            resolve();
          }
        }),
        ping: new Howl({
          src: ["./sounds/ping.wav"],
          loop: false,
          volume: 1,
          onload: function() {
            resolve();
          }
        }),
        pong: new Howl({
          src: ["./sounds/pong.aiff"],
          loop: false,
          volume: 1,
          onload: function() {
            resolve();
          }
        }),
        bad: new Howl({
          src: ["./sounds/bad.wav"],
          loop: false,
          volume: 1,
          onload: function() {
            resolve();
          }
        }),
        gameover: new Howl({
          src: ["./sounds/gameover.wav"],
          loop: false,
          volume: 1,
          onload: function() {
            resolve();
          }
        }),
        coins: new Howl({
          src: ["./sounds/coins.wav"],
          loop: false,
          volume: 1,
          onload: function() {
            resolve();
          }
        }),
      };
    });
  }

  play(soundName) {
    return this.sounds[soundName].play();
  }

  stop(soundName, id) {
    this.sounds[soundName].stop(id);
  }
}

import Howler from "howler";
const { Howl } = Howler;

export default class Sound {
  load() {
    return new Promise((resolve, reject) => {
      this.sounds = {
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

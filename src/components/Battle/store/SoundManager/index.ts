import { Howl } from "howler";
import { Sound } from "./types";

export class SoundManager {
  protected _sounds: Record<Sound, Howl> = {
    moveSelf: new Howl({
      src: this._getAssetFromPublic('sounds/move_self.mp3')
    }),
    moveEnemy: new Howl({
      src: this._getAssetFromPublic('sounds/move_enemy.mp3')
    }),
    capture: new Howl({
      src: this._getAssetFromPublic('sounds/capture.mp3')
    }),
    win: new Howl({
      src: this._getAssetFromPublic('sounds/win.mp3')
    }),
    lose: new Howl({
      src: this._getAssetFromPublic('sounds/lose.mp3')
    }),
    draw: new Howl({
      src: this._getAssetFromPublic('sounds/draw.mp3')
    }),
  }

  protected get _baseUrl() {
    return import.meta.env.BASE_URL;
  }

  protected _getAssetFromPublic(path: string) {
    return `${location.origin}${this._baseUrl}/${path}`;
  };

  public play(sound: Sound) {
    this._sounds[sound].play()
  }
}

import { Fade } from "src/components/Fade/store/Fade";
import { Clicker } from "src/shared/classes/Clicker";

export class Main {
  fade = new Fade({ hasUnmount: true });

  public readonly play = {
    clicker: new Clicker(),
  };

  public readonly theory = {
    clicker: new Clicker(),
  };

  public readonly statistics = {
    clicker: new Clicker(),
  };
}

import Listenable from "./Listenable";
import DPRListener from "./DPR";
import isPrettyMuchAnInteger from "../isPrettyMuchAnInteger";
import { CSSPixels, DisplayPixels } from "../pixels";

type FPR = {
   readonly dpx: DisplayPixels,
   readonly cpx: CSSPixels,
};

const CSS_PIXELS_LIMIT = 100;

const defaultFPR: FPR = {
   dpx: 1 as DisplayPixels,
   cpx: 1 as CSSPixels,
};

var currentFPR: FPR;

const FPRListener = new class FPRListener extends Listenable<FPR> {
   constructor () {
      super();
      DPRListener.addChangeListener(this.external.bind(this));
      this.fetch();
   }

   fetch() {
      const dpr = DPRListener.value;
      for (let co = 1; co < CSS_PIXELS_LIMIT; co++) {
         if (isPrettyMuchAnInteger(dpr * co)) {
            currentFPR = {
               dpx: Math.round(dpr * co) as DisplayPixels,
               cpx: co as CSSPixels,
            };
            return;
         }
      }
      currentFPR = defaultFPR;
   };

   external() {
      this.fetch();
      super.callListeners();
   }

   /**
    * @name FractionalPixelRatio
    * @name FPR
    * @see dpx / cpx
    * @see dppx / cppx
    */
   get value() { return currentFPR }
}

export default FPRListener;
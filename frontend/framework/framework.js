import { createRouter } from "./routing.js";
import * as elements from "./elements.js";
import { binding } from "./binding.js";

elements.addListenerFunctions(window)
elements.addListenerFunctions(document)

const frame = {
  createRouter,
  ...elements,
  binding,
};

export default frame;

import { createRouter } from "./routing.js";
import * as elements from "./elements.js";
import { binding } from "./binding.js";

const frame = {
  createRouter,
  ...elements,
  binding,
};

export default frame;

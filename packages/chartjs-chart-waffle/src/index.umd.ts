import { registry } from "chart.js";
import { WaffleController } from "./waffle.controller";
import { WaffleElement } from "./waffle.element";
import { Tooltip } from "./waffle.tooltip";

export * from ".";
registry.addControllers(WaffleController);
registry.addElements(WaffleElement);
registry.addPlugins(Tooltip);

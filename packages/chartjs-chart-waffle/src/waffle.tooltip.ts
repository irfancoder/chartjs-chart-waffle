import { Tooltip } from "chart.js";

/**
 * Position: "cursor".
 * Tooltip follows the cursor. Default position behavior for waffle chart.
 * @function Tooltip.positioners.myCustomPositioner
 * @param elements {Chart.Element[]} the tooltip elements
 * @param eventPosition {Point} the position of the event in canvas coordinates
 * @returns {TooltipPosition} the tooltip position
 */
Tooltip.positioners.cursor = function (elements, eventPosition) {
  return {
    x: eventPosition.x,
    y: eventPosition.y,
  };
};

export { Tooltip };

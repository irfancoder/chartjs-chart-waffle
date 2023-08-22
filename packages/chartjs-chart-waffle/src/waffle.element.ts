import {
  Element,
  FontSpec,
  VisualElement,
  ScriptableAndArrayOptions,
  ScriptableContext,
  ChartArea,
} from "chart.js";

export class WaffleElement
  extends Element<WaffleElementProps, WaffleElementOptions>
  implements VisualElement
{
  static readonly id = "block";

  static readonly defaults: any = /* #__PURE__ */ {
    // rotate: 0,
    backgroundColor: undefined,
    minRotation: -90,
    maxRotation: 0,
    rotationSteps: 2,
    padding: 1,
    strokeStyle: undefined,
    size: (ctx) => {
      const v = (ctx.parsed as unknown as { y: number }).y;
      return v;
    },
    hoverColor: "#ababab",
    anchorX: "left",
    anchorY: "center",
  } as Partial<
    ScriptableAndArrayOptions<WaffleElementOptions, ScriptableContext<"waffle">>
  >;

  static readonly defaultRoutes = {
    color: "color",
    family: "font.family",
    style: "font.style",
    weight: "font.weight",
    lineHeight: "font.lineHeight",
  };

  constructor(props: WaffleElementProps, options?: WaffleElementOptions) {
    super();
    Object.assign(this, { options, props });
  }

  get increment(): { row: number; column: number } {
    const { height, width, gap } = this.getProps(["height", "width", "gap"]);
    return {
      row: height + gap,
      column: width + gap,
    };
  }

  inRange(mouseX: number, mouseY: number): boolean {
    let { x, y, index, column, grid, width, height } = this.getProps([
      "x",
      "y",
      "width",
      "height",
      "index",
      "grid",
      "column",
    ]);

    const start = {
      left: x,
      right: x + width,
      top: y,
      bottom: y + height,
    };

    const [mouse_x, mouse_y] = [
      Number.isNaN(mouseX) ? x : mouseX,
      Number.isNaN(mouseY) ? y : mouseY,
    ];

    const end = { ...start };

    let row_counter = Math.floor(index % column) || 0;
    while (grid > 0) {
      end.left += this.increment.column;
      end.right += width;
      grid--;
      row_counter++;

      if (row_counter >= column) {
        row_counter = 0;
        end.left = 0;
        end.right = width;
        end.top -= this.increment.row;
        end.bottom -= this.increment.row;
      }
    }

    switch (true) {
      case mouse_y > end.bottom && mouse_y < start.top:
      case mouse_x > start.left && mouse_y > start.top:
      case mouse_x < end.right && mouse_y > end.top:
        return true;

      default:
        return false;
    }
  }

  inXRange(mouseX: number): boolean {
    return this.inRange(mouseX, Number.NaN);
  }

  inYRange(mouseY: number): boolean {
    return this.inRange(Number.NaN, mouseY);
  }

  getCenterPoint(): { x: number; y: number } {
    return this.getProps(["x", "y"]);
  }

  tooltipPosition(): { x: number; y: number } {
    return this.getCenterPoint();
  }

  draw(ctx: CanvasRenderingContext2D, chartArea: ChartArea): void {
    let { x, y, index, column, grid, width, height, radius } = this.getProps([
      "x",
      "y",
      "width",
      "height",
      "index",
      "grid",
      "column",
      "radius",
    ]);
    const options = this.options;
    ctx.beginPath();

    let row_counter = Math.floor(index % column) || 0;
    ctx.beginPath();
    while (grid > 0) {
      ctx.fillStyle = options.backgroundColor;
      ctx.roundRect(x, y, width, height, radius);

      x += this.increment.column;
      grid--;
      row_counter++;

      if (row_counter >= column) {
        row_counter = 0;
        x = 0;
        y -= this.increment.row;
      }
    }
    ctx.closePath();
    ctx.fill();
    ctx.save();
    ctx.restore();
  }
}

/************************************************************************************************************ */

declare module "chart.js" {
  export interface ElementOptionsByType<TType extends ChartType> {
    waffle: ScriptableAndArrayOptions<
      WaffleElementOptions & WaffleElementHoverOptions,
      ScriptableContext<"waffle">
    >;
  }
}

export interface WaffleElementOptions
  extends FontSpec,
    Record<string, unknown> {
  backgroundColor: string | CanvasGradient | CanvasPattern;

  // /**
  //  * Number of rows in waffle.
  //  * @default 8
  //  */
  // row: number;

  // /**
  //  * Number of columns in waffle.
  //  * @default 8
  //  */
  // column: number;

  // /**
  //  * Gap between cells.
  //  * @default 5
  //  */
  // gap: number;

  // /**
  //  * Override the maximum sum of dataset.
  //  * @default dataset_sum
  //  */
  // total: number;

  color: string;
  /**
   * CanvasContext2D.strokeStyle config for rendering a stroke around the text
   * @default undefined
   */
  strokeStyle: string;
  /**
   * rotation of the word
   * @default undefined then it will be randomly derived given the other constraints
   */
  rotate: number;
  /**
   * number of rotation steps between min and max rotation
   * @default 2
   */
  rotationSteps: number;
  /**
   * angle in degree for the min rotation
   * @default -90
   */
  minRotation: number;
  /**
   * angle in degree for the max rotation
   * @default 0
   */
  maxRotation: number;
  /**
   * padding around each word while doing the layout
   * @default 1
   */
  padding: number;
}

export interface WaffleElementHoverOptions {
  /**
   * hover variant of color
   */
  hoverColor: string;
  /**
   * hover variant of size
   */
  hoverSize: FontSpec["size"];
  /**
   * hover variant of style
   */
  hoverStyle: FontSpec["style"];
  /**
   * hover variant of weight
   */
  hoverWeight: FontSpec["weight"];
  /**
   * hover variant of stroke style
   * @default undefined
   */
  hoverStrokeStyle: string;
}

export interface WaffleElementProps {
  x: number;
  y: number;
  width: number;
  height: number;
  grid: number;
  index: number;
  gap: number;
  column: number;
  row: number;
  total: number;
  radius: number;
}

// export interface WafflePoint {
//     x: number
//     y: number
//     size: number
//     blocks: number[]
// }

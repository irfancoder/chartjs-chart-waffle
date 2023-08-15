import {
  AnimationOptions,
  Chart,
  DatasetController,
  UpdateMode,
  ChartItem,
  ScriptableAndArrayOptions,
  ControllerDatasetOptions,
  CommonHoverOptions,
  ChartConfiguration,
  ScriptableContext,
  ChartDataset,
  TooltipItem,
} from "chart.js";
import { WaffleElement, WaffleElementOptions } from "./waffle.element";
import patch from "./patch";
import { AnyObject } from "chart.js/types/basic";
import { _DeepPartialArray } from "chart.js/types/utils";

export class WaffleController extends DatasetController<
  "waffle",
  WaffleElement
> {
  static readonly id = "waffle";
  options: Chart<"waffle">["options"];

  static readonly defaults = {
    datasets: {
      fit: true,
      animation: {
        colors: {
          properties: ["color", "strokeStyle"],
        },
        numbers: {
          properties: ["x", "y", "size", "rotate"],
        },
      },
    },
    maintainAspectRatio: false,
    dataElementType: WaffleElement.id,
  };

  static readonly overrides = {
    plugins: {
      tooltip: {
        enabled: true,
        mode: "index",
        // callbacks: {
        //   title() {
        //     // Title doesn't make sense for scatter since we format the data as a point
        //     return "";
        //   },
        //   label(item: TooltipItem<"waffle">) {
        //     if (item.formattedValue == null) {
        //       return item.chart.data?.labels?.[item.dataIndex];
        //     }
        //     return `${item.chart.data?.labels?.[item.dataIndex]}: ${
        //       item.formattedValue
        //     }`;
        //   },
        // },
      },
      colors: {
        enabled: false,
      },
    },
    scales: {
      x: {
        type: "category",
        min: 0,
        max: 5,
        display: false,
      },
      y: {
        type: "linear",
        min: 0,
        max: 100,
        display: false,
      },
    },
  };

  constructor(chart: Chart, datasetIndex: number) {
    super(chart, datasetIndex);
    this.options = chart.options;
  }

  initialize(): void {
    super.initialize();
  }

  // Override to resolve scriptable options
  resolveDatasetElementOptions(mode: UpdateMode): AnyObject {
    const resolved: AnyObject = super.resolveDatasetElementOptions(mode);

    // Resolve backgroundColor option if it's a scriptable
    if (resolved.backgroundColor !== undefined) {
      resolved.backgroundColor = this.resolveDataElementOptions(0, mode);
    }

    return resolved;
  }

  update(mode: UpdateMode): void {
    super.update(mode);
    const meta = this.getMeta();

    this.updateElements(meta.data, 0, meta.data.length, mode);
  }

  updateElements(
    elements: WaffleElement[],
    start: number,
    count: number,
    mode: "resize" | "reset" | "none" | "hide" | "show" | "normal" | "active"
  ): void {
    super.updateElements(elements, start, count, mode);
    if (mode === "reset") return;
    const { column = 5, row = 5, gap = 5 } = this.options;

    for (let i = start; i < start + count; i++) {
      const properties = {
        x: this.getPosition(i).x,
        y: this.getPosition(i).y,
        width: this.cell_size.width,
        height: this.cell_size.height,
        index: this.cumulative_index[i],
        grid: this.normalized_data[i],
        options: this.resolveDataElementOptions(
          i,
          elements[i]?.active ? "active" : mode
        ),
        row,
        column,
        gap,
      };

      this.updateElement(elements[i], i, properties, mode);
    }
  }

  generateGrid(row: number, column: number, gap: number) {
    const ctx = this.chart.ctx;
    const cell = {
      width: (this.chart.chartArea.width - gap * (column - 1)) / column,
      height: (this.chart.chartArea.height - gap * (row - 1)) / row,
    };
    ctx.save();
    ctx.beginPath();
    for (let i = 0; i < column; i++) {
      for (let j = 0; j < row; j++) {
        const x = i * (cell.width + gap);
        const y = j * (cell.height + gap);
        ctx.fillStyle = "rgb(0,0,0, 0.05)";
        ctx.roundRect(x, y, cell.width, cell.height, 4);
      }
    }

    ctx.closePath();
    ctx.fill();
    ctx.save();
    ctx.restore();
  }

  get normalized_data(): number[] {
    const { data } = this.getDataset() as ChartDataset<"waffle">;

    const { total, column = 5, row = 5 } = this.options;
    const max_grid = column * row;
    const max_sum = total || data.reduce((prev, curr) => prev + curr, 0);

    return data.map((datum) => Math.round((datum / max_sum) * max_grid));
  }

  get cell_size(): { width: number; height: number } {
    const { column = 5, gap = 5, row = 5 } = this.options;
    return {
      width: (this.chart.chartArea.width - gap * (column - 1)) / column,
      height: (this.chart.chartArea.height - gap * (row - 1)) / row,
    };
  }

  get cumulative_index(): number[] {
    return this.normalized_data.slice(0, -1).reduce(
      (acc: number[], current: number, index: number) => {
        acc.push(acc[index] + current);
        return acc;
      },
      [0]
    );
  }

  getPosition(index: number): { x: number; y: number } {
    const { column = 5, gap = 5 } = this.options;

    const start_y = Math.floor(this.cumulative_index[index] / column);
    const increment = {
      column: this.cell_size.width + gap,
      row: this.cell_size.height + gap,
    };

    return {
      x:
        this.cumulative_index[index] > 0
          ? Math.floor(this.cumulative_index[index] % column) * increment.column
          : 0,
      y:
        this.cumulative_index[index] > 0
          ? this.chart.chartArea.height -
            (start_y + 1) * this.cell_size.height -
            start_y * gap
          : this.chart.chartArea.height - this.cell_size.height,
    };
  }

  draw(): void {
    const meta = this.getMeta();
    if (!meta.data || meta.data.length === 0) {
      return;
    }

    const { column, row, fill, gap } = this.options;
    if (column && row && fill && gap) {
      this.generateGrid(row, column, gap);
    }

    super.draw();
    // meta.data.forEach((point) => {
    //   point.draw.call(point, this.chart.ctx, this.chart.chartArea);
    // });
  }
}

export interface WaffleChartOptions {
  fill: boolean;
  row: number;
  column: number;
  gap: number;
  total: number;
}

export interface WaffleControllerDatasetOptions
  extends ControllerDatasetOptions,
    ScriptableAndArrayOptions<
      WaffleElementOptions,
      ScriptableContext<"waffle">
    >,
    ScriptableAndArrayOptions<CommonHoverOptions, ScriptableContext<"waffle">>,
    AnimationOptions<"waffle"> {}

declare module "chart.js" {
  interface ChartTypeRegistry {
    waffle: {
      chartOptions: WaffleChartOptions;
      datasetOptions: WaffleControllerDatasetOptions;
      defaultDataPoint: number;
      metaExtensions: Record<string, never>;
      parsedDataType: {
        x: number;
        y: number;
      };
      scales: keyof CartesianScaleTypeRegistry;
    };
  }
}

export class WaffleChart<
  DATA extends unknown[] = number[],
  LABEL = string
> extends Chart<"waffle", DATA, LABEL> {
  static id = WaffleController.id;

  constructor(
    item: ChartItem,
    config: Omit<ChartConfiguration<"waffle", DATA, LABEL>, "type">
  ) {
    super(item, patch("waffle", config, WaffleController, WaffleElement));
  }
}

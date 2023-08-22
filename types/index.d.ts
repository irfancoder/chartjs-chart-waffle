import {
  ControllerDatasetOptions,
  ScriptableAndArrayOptions,
  ScriptableContext,
  CommonHoverOptions,
  AnimationOptions,
  Chart,
  ChartItem,
  ChartConfiguration,
} from "chart.js";

export { WaffleController } from "../src/waffle.controller";
export { WaffleElement, WaffleElementOptions } from "../src/waffle.element";
export { Tooltip } from "../src/waffle.tooltip";

import { WaffleElementOptions } from "../src/waffle.element";

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
  interface TooltipPositionerMap {
    cursor: TooltipPositionerFunction<"waffle">;
  }
}
export interface WaffleChartOptions {
  fill: boolean;
  fillColor: string;
  row: number;
  column: number;
  gap: number;
  total: number;
  radius: number;
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
  interface TooltipPositionerMap {
    cursor: TooltipPositionerFunction<"waffle">;
  }
}
export declare class WaffleChart<
  DATA extends unknown[] = number[],
  LABEL = string
> extends Chart<"waffle", DATA, LABEL> {
  static id: string;
  constructor(
    item: ChartItem,
    config: Omit<ChartConfiguration<"waffle", DATA, LABEL>, "type">
  );
}

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
import { WaffleController, WaffleElement } from ".";
import patch from "./patch";
import { WaffleElementOptions } from "./waffle.element";

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

  interface TooltipPositionerMap {
    cursor: TooltipPositionerFunction<"waffle">;
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

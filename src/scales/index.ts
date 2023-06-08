import { Scale, CoreScaleOptions, ScaleChartOptions, LinearScale } from 'chart.js';



export interface WaffleScaleOptions extends CoreScaleOptions  {
  /**
   * projection method used
   * @default albersUsa
   */
  rows: number,
  columns: number
  /**
   * extra offset applied after projection
   */
  offset: [number, number];
  /**
   * padding applied during auto scaling of the map in pixels
   * i.e. the chart size is reduce by the padding before fitting the map
   */
  padding: number | { top: number; left: number; right: number; bottom: number };
}

export class WaffleScale extends LinearScale {
  
  static readonly id = 'waffle';

  static readonly defaults: Partial<WaffleScaleOptions> = {
    rows: 10,
    columns: 10
  };

  
//   get prop(key: "rows" | "columns") {
//     return this.def[key]
//   }

    // // Determines the data limits. Should set this.min and this.max to be the data max/min
    

    // // Generate tick marks. this.chart is the chart instance. The data object can be accessed as this.chart.data
    // // buildTicks() should create a ticks array on the axis instance, if you intend to use any of the implementations from the base class
    // buildTicks() {}

    // // Get the label to show for the given value
    // getLabelForValue(value) {}

    // // Get the pixel (x coordinate for horizontal axis, y coordinate for vertical axis) for a given value
    // // @param index: index into the ticks array
    // getPixelForTick(index) {}

    // // Get the pixel (x coordinate for horizontal axis, y coordinate for vertical axis) for a given value
    // // @param value : the value to get the pixel for
    // // @param [index] : index into the data array of the value
    // getPixelForValue(value, index) {}

    // // Get the value for a given pixel (x coordinate for horizontal axis, y coordinate for vertical axis)
    // // @param pixel : pixel value
    // getValueForPixel(pixel) {}

}

declare module 'chart.js' {
  export interface WaffleScaleTypeRegistry {
    waffle: {
      options: WaffleScaleOptions;
    };
  }

  export interface ScaleTypeRegistry extends WaffleScaleTypeRegistry {}
}

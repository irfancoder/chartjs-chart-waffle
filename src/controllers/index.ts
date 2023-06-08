import { AnimationOptions, Chart, DatasetController, UpdateMode, ChartItem, ScriptableAndArrayOptions, ControllerDatasetOptions, CommonHoverOptions, ChartConfiguration, ScriptableContext, ChartDataset } from 'chart.js'
import { WaffleElement, WaffleElementOptions } from '../elements'
import patch from './patch';
import {AnyObject} from 'chart.js/types/basic'


export class WaffleController extends DatasetController<'waffle', WaffleElement> {
    static readonly id = 'waffle'

    static readonly defaults = {
        datasets: {
            fit: true,
            animation: {
                colors: {
                    properties: ['color', 'strokeStyle']
                },
                numbers: {
                    properties: ['x', 'y', 'size', 'rotate']
                }
            }
        },
        maintainAspectRatio: false,
        dataElementType: WaffleElement.id
    }

    static readonly overrides = {
        scales: {
            waffle: {
                type: "waffle",
                rows: 5,
                columns: 5
            },
            x: {
                type: 'linear',
                min: 0,
                max: 100,
                display: true
            },
            y: {
                type: 'linear',
                min: 0,
                max: 100,
                display: true
            }
        }
    }

    linkScales() {}


    constructor(chart: Chart, datasetIndex: number) {
        super(chart, datasetIndex)
    } 

    initialize(): void {
        super.initialize();
    }

      // Override to resolve scriptable options
  resolveDatasetElementOptions(mode: UpdateMode ): AnyObject {
    const resolved: AnyObject = super.resolveDatasetElementOptions(mode);

    // Resolve backgroundColor option if it's a scriptable
    if (resolved.backgroundColor !== undefined) {
      resolved.backgroundColor = this.resolveDataElementOptions(0, mode);
    }

    return resolved;
  }

    update(mode: UpdateMode): void {
        const meta = this.getMeta();  

        this.updateElements(meta.data, 0, meta.data.length, mode);
      }

    updateElements (elements: WaffleElement[], start: number, count: number, mode: 'resize' | 'reset' | 'none' | 'hide' | 'show' | 'normal' | 'active'): void {
        const { xScale, yScale } = this._cachedMeta
        const {data: _, ...opts}  = this.getDataset() as ChartDataset<"waffle">
        const firstOpts = this.resolveDataElementOptions(start, mode);
        const sharedOptions = this.getSharedOptions(firstOpts);

        // const { column, row } = opts
        console.log(opts)


        // for (let i = 0; i < col; i++) {
        //     for (let j = 0; j < row; j++) {
        //     counter++
        //     if (counter < set_acc[acc_ctr]) ctx.fillStyle = color[acc_ctr]
        //     else if (acc_ctr >= set.length) ctx.fillStyle = "#eee"
        //     else acc_ctr++

        //     ctx.beginPath()        
        //     ctx.fillRect(start_x + j*22, start_y - i*22, 20, 20)
           
        //     }
        // }


        for (let i = start; i < start + count; i++) {
            const parsed = mode !== "reset" && this.getParsed(i);
            const x = xScale?.getBasePixel() 
            const y = mode !== "reset" ? yScale?.getBasePixel() : yScale?.getPixelForValue(parsed.y);

            const options = this.resolveDataElementOptions(i, mode);
            
            const {width, height, anchorX, anchorY} = options;
            
            
            const properties = {
              x: resolveX(anchorX as unknown as string, x as number, width as number),
              y: resolveY(anchorY as unknown as string, y as number, height as number),
              width,
              height,
              options: this.resolveDataElementOptions(i, elements[i].active ? 'active' : mode)
            };

            this.updateElement(elements[i], i, properties, mode);
        }
    }
    
    draw(): void {
        const meta = this.getMeta();
    
        // if (!meta.data || meta.data.length === 0) {
        //   return;
        // }

        meta.data.forEach((point) => point.draw.call(point, this.chart.ctx, this.chart.chartArea))
        //(elem.draw.call as any)(elem, chart.ctx, chart.chartArea)
        // meta.data.forEach((point) => {
        //   point.pivot();
        //   point.transition(this.getScope().chart.options.animation).draw();
        // });
    }
}

function resolveX(anchorX: string, x: number, width: number) {
    if (anchorX === 'left' || anchorX === 'start') {
      return x;
    }
    if (anchorX === 'right' || anchorX === 'end') {
      return x - width;
    }
    return x - width / 2;
  }
  
  function resolveY(anchorY: string, y: number, height: number) {
    if (anchorY === 'top' || anchorY === 'start') {
      return y;
    }
    if (anchorY === 'bottom' || anchorY === 'end') {
      return y - height;
    }
    return y - height / 2;
  }
  

export interface WaffleControllerDatasetOptions extends ControllerDatasetOptions, ScriptableAndArrayOptions<WaffleElementOptions, ScriptableContext<'waffle'>>, ScriptableAndArrayOptions<CommonHoverOptions, ScriptableContext<'waffle'>>, AnimationOptions<'waffle'> {
    /**
     * whether to fit the word cloud to the map, by scaling to the actual bounds
     * @default true
     */
    fit: boolean
}

declare module 'chart.js' {
    interface ChartTypeRegistry {
        waffle: {
            chartOptions: CoreChartOptions<"waffle">
            datasetOptions: WaffleControllerDatasetOptions
            defaultDataPoint: number
            metaExtensions: Record<string, never>
            parsedDataType: {
                x: number,
                y: number, 
            }
            scales: WaffleScaleTypeRegistry
        }
    }
}

export class WaffleChart<DATA extends unknown[] = number[], LABEL = string> extends Chart<'waffle', DATA, LABEL> {
    static id = WaffleController.id

    constructor(item: ChartItem, config: Omit<ChartConfiguration<'waffle', DATA, LABEL>, 'type'>) {
        super(item, patch('waffle', config, WaffleController, WaffleElement))
    }
}

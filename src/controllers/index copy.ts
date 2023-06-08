import { AnimationOptions, Chart, DatasetController, UpdateMode, ChartItem, ScriptableAndArrayOptions, ControllerDatasetOptions, CommonHoverOptions, ChartConfiguration, ScriptableContext, VisualElement, CartesianScaleTypeRegistry, CoreChartOptions, BarController, ChartDataset, Element } from 'chart.js'
import { WaffleElement, IWaffleElementOptions, IWaffleElementProps } from '../elements'
import patch from './patch';
import {AnyObject} from 'chart.js/types/basic'

interface IWaffle extends IWaffleElementProps {
    options: IWaffleElementOptions
    index: number
}

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
                rows: 5,
                columns: 5,
                
            },
            
        }
    }

    constructor(chart: Chart, datasetIndex: number) {
        super(chart, datasetIndex)
    }


    update(mode: UpdateMode): void {
        const cellWidth = 10;
        const cellHeight = 10;

        const meta = this._cachedMeta
        console.log(meta, 'update meta')
        this.updateElements(meta.data, 0, meta.data.length, mode);
    }




    getDataset(): ChartDataset<'waffle'> & IWaffleControllerDatasetOptions {
        return super.getDataset() as unknown as ChartDataset<'waffle'> & IWaffleControllerDatasetOptions;
      }
    

  
    draw(): void {
        const meta = this._cachedMeta
        const data = meta.data

        console.log(data, 'draw data')


        // const ctx = this.chart.ctx

        const elements = this._cachedMeta.data as unknown as VisualElement[];
        const { ctx } = this.chart;
        elements.forEach((elem) => {
            console.log(elem, 'draw elem')
            elem.draw(ctx)});
        // const start_x = 10
        // const start_y = 100
        // const set: number[] = [30, 40, 20, 10]
        // const set_acc: number[] = set.reduce((acc, val, i) => {
        //     if (i === 0) {
        //       acc.push(val);
        //     } else {
        //       acc.push(val + acc[i-1]);
        //     }
        //     return acc;
        // }, []);
        // const col = 10; const row = 10
        // let counter = 0
        // const color = [
        //     "#D84B20",
        //     "#75151E",
        //     "#A98307",
        //     "#755C48"
        // ]
        // ctx.save()
        
        // let acc_ctr = 0
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

        // var dataset = {
        //     data: [30, 40, 20, 10]
        // }
        // var layout = {
        //     rows: 10,
        //     columns: 10
        // };
        // var squareSize = 10;
        // var spacing = 2;

        // // loop over the data and draw squares for each value
        // for (var i = 0; i < dataset.data.length; i++) {
        //   var count = dataset.data[i];
        //   var x = i % layout.columns;
        //   var y = Math.floor(i / layout.columns);
        //   var xOffset = x * (squareSize + spacing);
        //   var yOffset = y * (squareSize + spacing);
          
        //   // draw the square
        //   this.chart.ctx.fillStyle = '#eee';
        //   this.chart.ctx.fillRect(xOffset, yOffset, squareSize, squareSize);
          
        //   // fill the square based on the count value
        //   if (count > 0) {
        //     this.chart.ctx.fillStyle = '#f00';
        //     this.chart.ctx.fillRect(xOffset, yOffset, squareSize, squareSize * count / layout.rows);
        //   }
        // }
        // const elements = this._cachedMeta.data as unknown as VisualElement[]

        // console.log(elements)
        // const { ctx } = this.chart
        // elements.forEach((elem) => elem.draw(ctx))
    }

}

export interface IWaffleControllerDatasetOptions extends ControllerDatasetOptions, ScriptableAndArrayOptions<IWaffleElementOptions, ScriptableContext<'waffle'>>, ScriptableAndArrayOptions<CommonHoverOptions, ScriptableContext<'waffle'>>, AnimationOptions<'waffle'> {
    /**
     * whether to fit the word cloud to the map, by scaling to the actual bounds
     * @default true
     */
    fit: boolean
}

declare module 'chart.js' {
    interface ChartTypeRegistry {
        waffle: {
            chartOptions: {}
            datasetOptions: IWaffleControllerDatasetOptions
            defaultDataPoint: number
            metaExtensions: Record<string, never>
            parsedDataType: { x: number }
            scales: keyof CartesianScaleTypeRegistry
        }
    }
}

export class WaffleChart<DATA extends unknown[] = number[], LABEL = string> extends Chart<'waffle', DATA, LABEL> {
    static id = WaffleController.id

    constructor(item: ChartItem, config: Omit<ChartConfiguration<'waffle', DATA, LABEL>, 'type'>) {
        super(item, patch('waffle', config, WaffleController, WaffleElement))
    }
}

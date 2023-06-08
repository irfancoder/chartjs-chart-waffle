import { Element, FontSpec, VisualElement, ScriptableAndArrayOptions, ScriptableContext, ChartType, ChartArea, } from 'chart.js'
import {isObject, addRoundedRectPath, toTRBLCorners} from 'chart.js/helpers';
import {AnyObject} from 'chart.js/types/basic'
import type { WaffleScale } from '../scales';


function getBounds(rect: WaffleElement, useFinalPosition?: boolean) {
    const {x, y, width, height} = rect.getProps(['x', 'y', 'width', 'height'], useFinalPosition);
    return {left: x, top: y, right: x + width, bottom: y + height};
  }


function limit(value: number, min: number, max: number) {
    return Math.max(Math.min(value, max), min);
  }

  function parseBorderWidth(rect: WaffleElement, maxW: number, maxH: number) {
    const value = rect.options.borderWidth as unknown as AnyObject;
    let t, r, b, l;
  
    if (isObject(value)) {
      t = +(value.top as string)|| 0;
      r = +(value.right as string) || 0;
      b = +(value.bottom as string) || 0;
      l = +(value.left as string) || 0;
    } else {
      t = r = b = l = +value || 0;
    }
  
    return {
      t: limit(t, 0, maxH),
      r: limit(r, 0, maxW),
      b: limit(b, 0, maxH),
      l: limit(l, 0, maxW)
    };
  }
  

function boundingRects(rect: WaffleElement) {
    const bounds = getBounds(rect);
    const width = bounds.right - bounds.left;
    const height = bounds.bottom - bounds.top;
    const border = parseBorderWidth(rect, width / 2, height / 2);
  
    return {
      outer: {
        x: bounds.left,
        y: bounds.top,
        w: width,
        h: height
      },
      inner: {
        x: bounds.left + border.l,
        y: bounds.top + border.t,
        w: width - border.l - border.r,
        h: height - border.t - border.b
      }
    } as const;
  }


export class WaffleElement extends Element<WaffleElementProps, WaffleElementOptions> implements VisualElement {
    static readonly id = 'block'

    static readonly defaults: any = /* #__PURE__ */ {
        // rotate: 0,
        backgroundColor: undefined,
        minRotation: -90,
        maxRotation: 0,
        rotationSteps: 2,
        padding: 1,
        strokeStyle: undefined,
        size: (ctx) => {
            const v = (ctx.parsed as unknown as { y: number }).y
            return v
        },
        hoverColor: '#ababab',
        anchorX: 'left',
        anchorY: 'center',
        width: 10,
        height: 10,
    } as Partial<ScriptableAndArrayOptions<WaffleElementOptions, ScriptableContext<'waffle'>>>

    static readonly defaultRoutes = {
        color: 'color',
        family: 'font.family',
        style: 'font.style',
        weight: 'font.weight',
        lineHeight: 'font.lineHeight'
    }

    scale!: WaffleScale

    
    constructor(props: WaffleElementProps, options?: WaffleElementOptions) {
        super();
        Object.assign(this, { options, props });
    }
    

    inRange(mouseX: number, mouseY: number): boolean {
        return false
        // const p = this.getProps(['x', 'y', 'width', 'height', 'scale'])
        // if (p.scale <= 0) {
        //     return false
        // }
        // const x = Number.isNaN(mouseX) ? p.x : mouseX
        // const y = Number.isNaN(mouseY) ? p.y : mouseY
        // return x >= p.x - p.width / 2 && x <= p.x + p.width / 2 && y >= p.y - p.height / 2 && y <= p.y + p.height / 2
    }

    inXRange(mouseX: number): boolean {

        return this.inRange(mouseX, Number.NaN)
    }

    inYRange(mouseY: number): boolean {
        return this.inRange(Number.NaN, mouseY)
    }

    getCenterPoint(): { x: number; y: number } {
        
        return this.getProps(['x', 'y'])
    }

    tooltipPosition(): { x: number; y: number } {
        return this.getCenterPoint()
    }

    draw(ctx: CanvasRenderingContext2D, chartArea: ChartArea): void {
        const props = this.getProps<Array<keyof WaffleElementProps>>(['x', 'y', 'options']);
        const options = this.options
        const {inner, outer} = boundingRects(this);

        // console.log(options)

        // if (outer.w !== inner.w || outer.h !== inner.h) {

        //     console.log("A")
        //     ctx.beginPath();
        //     addRoundedRectPath(ctx, {x: outer.x, y: outer.y, w: outer.w, h: outer.h, radius: 0});
        //     addRoundedRectPath(ctx, {x: inner.x, y: inner.y, w: inner.w, h: inner.h, radius: 0});
        //     ctx.fillStyle = options.backgroundColor;
        //     ctx.fill();
        //     ctx.fill('evenodd');
        //   } else {
        console.log("B")
        ctx.beginPath();
        addRoundedRectPath(ctx, {x: inner.x, y: inner.y, w: inner.w, h: inner.h, radius: 1});
        ctx.fillRect(props.x, props.y, inner.w, inner.h)
        ctx.fillStyle = options.backgroundColor;
        ctx.fill();
        //   }
        //   ctx.restore();


        ctx.save()
        // ctx.beginPath()
        // ctx.fillStyle = options.backgroundColor
        // ctx.fillRect(props.x, props.y, chartArea.width, 10)
        // const { points, options } = props;
    
        // if (!points || points.length === 0) {
        //   return;
        // }
    
        // ctx.save();
    
        // for (const point of points) {
        //   ctx.fillStyle = options.color;
    
        //   for (const block of point.blocks) {
        //     ctx.beginPath();
        //     ctx.rect(point.x, point.y, point.size, point.size);
        //     ctx.fill();
        //     ctx.closePath();
    
        //     point.x += point.size;
    
        //     if (point.x >= this._chart.width) {
        //       point.x = 0;
        //       point.y += point.size;
        //     }
        //   }
        // }

        // console.log(props, 'props')
    
        ctx.restore();
    }
}

/************************************************************************************************************ */

declare module 'chart.js' {
    export interface ElementOptionsByType<TType extends ChartType> {
        waffle: ScriptableAndArrayOptions<WaffleElementOptions & WaffleElementHoverOptions, ScriptableContext<"waffle">>
    }
}


export interface WaffleElementOptions extends FontSpec, Record<string, unknown> {
    backgroundColor: string | CanvasGradient | CanvasPattern
    row: number
    column: number
    total?: number

    color: string
    /**
     * CanvasContext2D.strokeStyle config for rendering a stroke around the text
     * @default undefined
     */
    strokeStyle: string
    /**
     * rotation of the word
     * @default undefined then it will be randomly derived given the other constraints
     */
    rotate: number
    /**
     * number of rotation steps between min and max rotation
     * @default 2
     */
    rotationSteps: number
    /**
     * angle in degree for the min rotation
     * @default -90
     */
    minRotation: number
    /**
     * angle in degree for the max rotation
     * @default 0
     */
    maxRotation: number
    /**
     * padding around each word while doing the layout
     * @default 1
     */
    padding: number
}

export interface WaffleElementHoverOptions {
    /**
     * hover variant of color
     */
    hoverColor: string
    /**
     * hover variant of size
     */
    hoverSize: FontSpec['size']
    /**
     * hover variant of style
     */
    hoverStyle: FontSpec['style']
    /**
     * hover variant of weight
     */
    hoverWeight: FontSpec['weight']
    /**
     * hover variant of stroke style
     * @default undefined
     */
    hoverStrokeStyle: string
}

export interface WaffleElementProps {
    x: number
    y: number
    width: number
    height: number
    options: WaffleElementOptions;
  }

// export interface WafflePoint {
//     x: number
//     y: number
//     size: number
//     blocks: number[]
// }


import { Chart, ChartConfiguration, ChartData, ChartItem, LinearScale} from 'chart.js'
import {WaffleController} from './controllers'
import {WaffleElement} from './elements'
import {WaffleScale} from './scales'

const data: ChartData<"waffle"> = {
  labels: ["A", "B", "C", "D"],
  datasets: [{
    data: [30, 10, 40, 20],
    backgroundColor: [
        'rgba(255, 26, 104, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
    ],
    // backgroundColor(ctx){
    //     return ['#FFC312', '#C4E538', '#12CBC4', '#FDA7DF'][ctx.dataIndex]
    // },
    row: 5,
    column: 5   
  }]
};

Chart.register(WaffleController, WaffleElement, WaffleScale, LinearScale)

// config 
const config: ChartConfiguration<"waffle"> = {
    type: "waffle",
    data,
    options: {
        scales: {
         
        }
    }
}
  

// const waffle = {
//     id: 'waffle',
//     afterDatasetsDraw(chart, args, pluginOptions) {
//         const { ctx, data } = chart

//         const start_x = 55
//         const start_y = 250
//         const set = data.datasets[0].data
//         const set_acc = set.reduce((acc, val, i) => {
//             if (i === 0) {
//               acc.push(val);
//             } else {
//               acc.push(val + acc[i-1]);
//             }
//             return acc;
//         }, []);
//         const col = 10; const row = 10
//         let counter = 0
//         const color = [
//             "#D84B20",
//             "#75151E",
//             "#A98307",
//             "#755C48"
//         ]
//         ctx.save()
        
//         let acc_ctr = 0
//         for (let i = 0; i < col; i++) {
//             for (let j = 0; j < row; j++) {
//             counter++
//             if (counter < set_acc[acc_ctr]) ctx.fillStyle = color[acc_ctr]
//             else if (acc_ctr >= set.length) ctx.fillStyle = "#eee"
//             else acc_ctr++

//             ctx.beginPath()        
//             ctx.fillRect(start_x + j*22, start_y - i*22, 20, 20)
           
//             }
//         }
//     }
// }




const chart = new Chart(document.getElementById('myChart') as ChartItem, config);



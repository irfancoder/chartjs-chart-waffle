import { Chart } from "react-chartjs-2";
import { WaffleController, WaffleElement } from ".";

import "./App.css";
import {
  ChartData,
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  ChartOptions,
  Tooltip,
} from "chart.js";

function App() {
  const data: ChartData<"waffle"> = {
    labels: ["A", "B", "C"],
    datasets: [
      {
        label: "hehehhe",
        data: [10, 3, 5],
        backgroundColor: [
          "rgba(255, 26, 104, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
      },
    ],
  };
  const options: ChartOptions<"waffle"> = {
    row: 8,
    column: 8,
    gap: 16,
    total: 50,
    fill: true,
    fillColor: "#eee",
    radius: 8,
  };

  ChartJS.register(
    WaffleController,
    WaffleElement,
    LinearScale,
    CategoryScale,
    Tooltip
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <p>Waffle ChartJS Example</p>
      <div
        style={{
          height: 500,
          width: 500,
        }}
      >
        <Chart type="waffle" data={data} options={options} />
      </div>
    </div>
  );
}

export default App;

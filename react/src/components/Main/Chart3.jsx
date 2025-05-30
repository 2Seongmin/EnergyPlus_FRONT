import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import axios from "axios";
import global from "../../../conf";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

const Chart3 = () => {
  const [chartData, setChartData] = useState(null);
  const apiUrl = global.API_URL;

  useEffect(() => {
    axios
      .get(`${apiUrl}/apis/carbon`)
      .then((response) => {
        const data = response.data;
        const datas = {};

        for (let i = 0; i < data.length; i++) {
          const item = data[i];
          const date = new Date(item.timestamp).toLocaleDateString();

          if (!datas[date]) {
            datas[date] = 0;
          }
          datas[date] += item.coppm;
        }

        const labels = Object.keys(datas);
        const coppmValues = Object.values(datas);

        setChartData({
          labels,
          datasets: [
            {
              label: "Coppm (날짜별 합산)",
              data: coppmValues,
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              fill: true,
            },
          ],
        });
      })
      .catch((error) => {
        console.error("데이터를 가져오는 데 실패했습니다: ", error);
      });
  }, []);

  if (!chartData) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      <h2>날짜별 차트</h2>
      <Line data={chartData} />
    </div>
  );
};

export default Chart3;

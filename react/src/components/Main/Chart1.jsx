import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import global from "../../../conf";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Chart1 = () => {
  const [chartData, setChartData] = useState(null);
  const apiUrl = global.API_URL;

  useEffect(() => {
    const datas = [];

    function callPage(page) {
      if (page > 10) {
        const grouped = {};

        for (let i = 0; i < datas.length; i++) {
          const item = datas[i];
          const energy = item.ENGSRC_NM;
          const co2 = parseFloat(item.USEMS_QNTY);

          if (grouped[energy] === undefined) {
            grouped[energy] = 0;
          }
          grouped[energy] += co2;
        }
        const labels = Object.keys(grouped);
        const values = [];
        for (let j = 0; j < labels.length; j++) {
          const key = labels[j];
          values.push(grouped[key]);
        }

        setChartData({
          labels,
          datasets: [
            {
              label: "상업부문-업종별 에너지 사용량",
              data: values,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
          ],
        });

        return;
      }
      axios
        .get(`${apiUrl}/apis/energyUsage1?pageNo=${page}`)
        .then((response) => {
          const items = response.data.opentable?.field || [];
          datas.push(...items);
          callPage(page + 1);
        })
        .catch((error) => {
          console.error(`${page} 호출 실패`, error);
        });
    }

    callPage(1);
  }, [apiUrl]);

  if (!chartData) return <div>로딩 중...</div>;

  return (
    <div style={{ height: "300px", width: "600px" }}>
      <Bar data={chartData} />
    </div>
  );
};

export default Chart1;

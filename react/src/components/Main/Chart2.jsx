import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import global from "../../../conf";

ChartJS.register(ArcElement, Tooltip, Legend);

const Chart2 = () => {
  const [pieChartData, setPieChartData] = useState(null);
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

        const colors = labels.map(
          (_, idx) => `hsl(${(idx * 360) / labels.length}, 70%, 60%)`
        );

        setPieChartData({
          labels,
          datasets: [
            {
              label: "상업부문-용도별 에너지 사용량",
              data: values,
              backgroundColor: colors,
            },
          ],
        });
        return;
      }
      axios
        .get(`${apiUrl}/apis/energyUsage2?pageNo=${page}`)
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

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: 0,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 12,
          font: { size: 10 },
        },
      },
    },
  };

  return (
    <div style={{ height: "300px", width: "400px" }}>
      {pieChartData ? (
        <Pie data={pieChartData} options={options} />
      ) : (
        <p>로딩 중...</p>
      )}
    </div>
  );
};

export default Chart2;

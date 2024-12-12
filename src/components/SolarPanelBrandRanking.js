import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { BarChart } from "@mui/x-charts/BarChart";

function SolarPanelBrandRanking() {
  const [brandRankingData, setBrandRankingData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3300/api/solar-panel-brand-ranking"
        );
        const data = response.data;

        // 檢查資料格式，必要時進行轉換
        const formattedData = data.map((item) => ({
          ...item,
          percentage: parseFloat(item.percentage) / 100, 
          
        }));

        setBrandRankingData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const columns = [
    { field: "brand", headerName: "廠牌", width: 130 },
    { field: "totalEnergy", headerName: "總發電量", width: 130 },
    { field: "percentage", headerName: "佔比 (%)", width: 100 },
    { field: "rank", headerName: "排名", width: 70 },
  ];

  return (
    <div>
      <h2>Solar Panel 廠牌發電量貢獻度排名</h2>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={brandRankingData}
          columns={columns}
          getRowId={(row) => row.brand}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
        />
      </div>
      <div>
        <BarChart
          dataset={brandRankingData}
          xAxis={[
            {
              scaleType: "band",
              dataKey: "brand",
              colorMap: {
                type: "ordinal",
                colors: [
                  "#ccebc5",
                  "#a8ddb5",
                  "#7bccc4",
                  "#4eb3d3",
                  "#2b8cbe",
                  "#08589e",
                ],
              },
            },
          ]}
          borderRadius={9}
          series={[
            {
              dataKey: "totalEnergy",
            },
          ]}
          width={600}
          height={350}
        />
      </div>
    </div>
  );
}

export default SolarPanelBrandRanking;

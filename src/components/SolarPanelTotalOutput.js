import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { BarChart } from '@mui/x-charts/BarChart'; // 引入 BarChart

function SolarPanelTotalOutput() { // 修改元件名稱
  const [solarPanelData, setSolarPanelData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3300/api/solar-panel-total-output'); // 使用新的 API endpoint
        setSolarPanelData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const columns = [
    { field: 'PanelID', headerName: 'Panel ID', width: 130 },
    { field: 'Model', headerName: 'Model', width: 130 },
    { field: 'Location', headerName: 'Location', width: 130 },
    { field: 'totalEnergy', headerName: '總發電量', width: 130 },
    // ... 其他欄位
  ];

  return (
    <div>
      <h2>Solar Panel 總發電量</h2> {/* 修改標題 */}
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid 
          rows={solarPanelData} 
          columns={columns}
          getRowId={(row) => row.PanelID} 
          pageSize={5} 
          rowsPerPageOptions={[5, 10, 20]} 
        />
        <BarChart
          dataset={solarPanelData}
          xAxis={[
            {
              scaleType: 'band', 
              dataKey: 'PanelID', // 使用 PanelID 作為 X 軸
              colorMap: {
                type: 'ordinal',
                colors: ['#ccebc5', '#a8ddb5', '#7bccc4', '#4eb3d3', '#2b8cbe', '#08589e']
                
              }
            },
          ]}
          borderRadius={9}
          series={[
            {
              dataKey: 'totalEnergy',
            },
          ]}
          width={800}
          height={400}
        />
      </div>
    </div>
  );
}

export default SolarPanelTotalOutput;
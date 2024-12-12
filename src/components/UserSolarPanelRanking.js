import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { BarChart } from '@mui/x-charts/BarChart'; // 引入 BarChart

function UserSolarPanelRanking() {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3300/api/user-solar-panel-ranking');
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // 移除所有依賴

  const columns = [
    { field: 'userId', headerName: 'User ID', width: 100 },
    { field: 'username', headerName: 'Username', width: 130 },
    { field: 'role', headerName: 'Role', width: 130 },
    { field: 'totalEnergy', headerName: '總發電量', width: 130 },
    // ... 其他欄位
  ];

  return (
    <div>
      <h2>User Solar Panel Ranking</h2>
      {/* 移除所有篩選條件 */}
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid 
          rows={userData} 
          columns={columns} 
          getRowId={(row) => row.userId} 
          pageSize={5} 
          rowsPerPageOptions={[5, 10, 20]} 
        />

      <BarChart
          dataset={userData}
          xAxis={[
            {
              scaleType: 'band', 
              dataKey: 'userId', // 使用 userId 作為 X 軸
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
          width={500}
          height={400}
        />
      </div>
      
    </div>
  );
}

export default UserSolarPanelRanking;
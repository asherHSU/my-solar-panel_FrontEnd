import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function TroubleShooting() {
  const [solarPanels, setSolarPanels] = useState([]);
  const [selectedPanelId, setSelectedPanelId] = useState(null); // 新增狀態變數
  const [failures, setFailures] = useState([]); // 新增狀態變數

  // ... (其他程式碼)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 發送 GET 請求到後端 API
        const response = await axios.get('http://localhost:3300/api/solarpanels'); 
        // 更新狀態，儲存 API 回應的資料
        setSolarPanels(response.data); 
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      if (selectedPanelId) { // 只有在 selectedPanelId 有值時才發送請求
        try {
          const response = await axios.get(`http://localhost:3300/api/solar-panel-failures/${selectedPanelId}`);
          setFailures(response.data);
        } catch (error) {
          console.error('Error fetching failures:', error);
        }
      }
    };

    fetchData();
  }, [selectedPanelId]);

  // ...

  return (
    <div>
      <h2>故障追蹤</h2>

      {/* 顯示故障紀錄 */}
      
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid 
          rows={failures} 
          columns={[
            { field: 'panelId', headerName: 'Panel ID', width: 130 },
            { field: 'alarmId', headerName: 'Alarm ID', width: 130 },
            { field: 'alarmTime', headerName: 'Alarm Time', width: 200 },
            { field: 'alarmType', headerName: 'Alarm Type', width: 130 },
          ]}
          getRowId={(row) => row.alarmId}  
          pageSize={5} 
          rowsPerPageOptions={[5, 10, 20]} 
        />
      </div>

      <div style={{width: 200}}>
        <p></p>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Panel ID</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedPanelId}
              label="Panel ID"
              onChange={e => setSelectedPanelId(parseInt(e.target.value))}
            >
              {solarPanels.map(panel => (
                <MenuItem value={panel.panelId} key={panel.panelId}>
                  {panel.panelId} - {panel.model}
                </MenuItem>
              ))}
              
            </Select>
        </FormControl>
      </div>

    </div>
  );
}

export default TroubleShooting;
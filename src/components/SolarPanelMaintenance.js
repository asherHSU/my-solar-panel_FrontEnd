import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function SolarPanelMaintenanceRecords() {  // 修改元件名稱
  const [solarPanels, setSolarPanels] = useState([]);
  const [selectedPanelId, setSelectedPanelId] = useState(null);
  const [maintenanceRecords, setMaintenanceRecords] = useState([]); // 修改狀態變數名稱

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3300/api/solarpanels');
        setSolarPanels(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }

      if (selectedPanelId) {
        try {
          const response = await axios.get(`http://localhost:3300/api/solar-panel-maintenance/${selectedPanelId}`); // 修改 API endpoint
          setMaintenanceRecords(response.data); // 更新狀態變數名稱
        } catch (error) {
          console.error('Error fetching maintenance records:', error);
        }
      }
    };

    fetchData();
  }, [selectedPanelId]);

  return (
    <div>
      <h2>Solar Panel 維護記錄</h2> {/* 修改標題 */}
      <p></p>
      {/* 顯示維護記錄 */}
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid 
          rows={maintenanceRecords} // 修改變數名稱
          columns={[
            { field: 'recordId', headerName: 'Record ID', width: 130 },
            { field: 'panelId', headerName: 'Panel ID', width: 130 },
            { field: 'maintenanceDate', headerName: 'Maintenance Date', width: 200 },
            { field: 'maintainer', headerName: 'Maintainer', width: 130 },
            { field: 'description', headerName: 'Description', width: 130 },
            { field: 'result', headerName: 'Result', width: 130 },
          ]}
          getRowId={(row) => row.recordId} 
          pageSize={5} 
          rowsPerPageOptions={[5, 10, 20]} 
        />
      </div>
      {/* 下拉式選單 */}
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

export default SolarPanelMaintenanceRecords; // 修改元件名稱
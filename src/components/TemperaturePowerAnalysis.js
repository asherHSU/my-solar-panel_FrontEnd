import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { DateTime } from 'luxon'; 
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

function TemperaturePowerAnalysis() {
  const [data, setData] = useState([]);
  const [location, setLocation] = useState('');
  const [locations, setLocations] = useState([]);
  const [startDate, setStartDate] = useState(DateTime.local(2022, 12, 6));
  const [endDate, setEndDate] = useState(DateTime.now());

  useEffect(() => {
    const fetchData = async () => {

      try {
        const response = await axios.get('http://localhost:3300/api/locations');
        setLocations(response.data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
        
      
      try {
        const response = await axios.get('http://localhost:3300/api/solar-panel-temperature-power', {
          params: {
            location: location,
            start_date: startDate,
            end_date: endDate,
          }
        }); 
        const dataWithId = response.data.map((item, index) => ({
          ...item,
          id: index + 1, // id 從 1 開始
        }));
        setData(dataWithId);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [location, startDate, endDate]);

  const columns = [
    { field: 'id', headerName: 'ID', width: 70, sortable: true },
    { field: 'panelId', headerName: 'Panel ID', width: 100 },
    { field: 'location', headerName: 'Location', width: 130 },
    { field: 'date', headerName: '日期', width: 100 },
    { field: 'time', headerName: '時間', width: 100 },
    { field: 'temperature', headerName: '溫度', width: 80 },
    { field: 'power', headerName: '發電量', width: 100 },
  ];

  return (
    <div>
      <h2>特定地點的 Solar Panel 溫度與發電量關聯性分析</h2>
      <div>
        <FormControl>
          <InputLabel id="location">Location</InputLabel>
            <Select
              labelId="location"
              id="location"
              value={location}
              label="Location"
              onChange={e => setLocation(e.target.value)}
            >
              {locations.map(location => (
                <MenuItem value={location} key={location}>
                  {location}
                </MenuItem>
              ))}
            </Select>
        <LocalizationProvider dateAdapter={AdapterLuxon}> 
          <DemoContainer components={['DatePicker', 'DatePicker']}>
            <DatePicker 
              label="Start Date"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)} 
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
            />
          </DemoContainer>
        </LocalizationProvider>
        </FormControl>
      </div>
      <div style={{ height: 400, width: '100%' }} id='chart-container'>
        <DataGrid 
          rows={data} 
          columns={columns} 
          getRowId={row => row.id}
          pageSize={5} 
          rowsPerPageOptions={[5, 10, 20]} 
        />

        {/* 散佈圖 */}
        <ScatterChart 
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }} 
          width={800}
          height={300}
          id='SCATTERCHART'
          >
          <CartesianGrid />
          <XAxis type="number" dataKey="temperature" name="Temperature" label={{ value: 'Temperature', position: 'insideBottom', offset: -5 }} />
          <YAxis type="number" dataKey="power" name="Power" label={{ value: 'Power', angle: -90, position: 'insideLeft' }} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter 
            data={data} 
            fill="#8884d8"
            shape={(props) => {
              const { cx, cy, payload } = props;
              const color = payload.temperature > 50 ? '#ff6347' : '#87ceeb'; // 高溫顯示紅色，低溫顯示藍色
              return <circle cx={cx} cy={cy} r={5} fill={color} />;
            }}
          />
                
        </ScatterChart>
      </div>
    </div>
  );
}

export default TemperaturePowerAnalysis;
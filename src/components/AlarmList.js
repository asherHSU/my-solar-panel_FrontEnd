import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

function AlarmList() {
  // 元件名稱
  // 狀態：儲存 Alarm 資料
  const [alarms, setAlarms] = useState([]);
  // 狀態：控制新增/編輯表單是否顯示
  const [showForm, setShowForm] = useState(false);
  // 狀態：儲存表單資料
  const [formData, setFormData] = useState({
    panelId: null,
    alarmTime: "",
    alarmType: "",
    status: "",
    handler: "",
    handleTime: "",
    handleResult: "",
  });

  const [selectedAlarmId, setSelectedAlarmId] = useState(""); // 儲存選中的 AlarmId

  // useEffect hook：在元件載入時獲取 Alarm 資料
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3300/api/alarm"); // API endpoint
        setAlarms(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // 函式：處理 "編輯" 按鈕點擊事件
  const handleEdit = async (alarmId) => {
    const alarmToEdit = alarms.find((alarm) => alarm.alarmId === alarmId);
    if (alarmToEdit) {
      setFormData(alarmToEdit);
      setShowForm(true); // 顯示表單
    }
  };

  // 函式：處理 "刪除" 按鈕點擊事件
  const handleDelete = async (alarmId) => {
    // 注意：這裡是 alarmId
    // eslint-disable-next-line no-template-curly-in-string
    if (window.confirm(`確定要刪除 Alarm ID 為 ${alarmId} 的 Alarm 嗎？`)) {
      // 注意：這裡是 alarmId
      try {
        await axios
          .delete(`http://localhost:3300/api/alarm/${alarmId}`) // API endpoint
          .then((response) => {
            alert(response.data.message);
          });
        setAlarms(alarms.filter((alarm) => alarm.alarmId !== alarmId)); // 注意：這裡是 alarmId
      } catch (error) {
        console.error("Error deleting data:", error);
      }
    }
  };

  const handleSelectChange = (event) => {
    setSelectedAlarmId(event.target.value); // 更新選中的 panelId
  };

  // 過濾資料顯示
  const filteredAlarms = selectedAlarmId
    ? alarms.filter((alarm) => alarm.alarmId === parseInt(selectedAlarmId))
    : alarms;

  // 函式：處理表單提交事件
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      if (formData.alarmId) {
        // 更新 Alarm
        await axios
          .put(`http://localhost:3300/api/alarm/${formData.alarmId}`, formData)
          .then((response) => {
            alert(response.data.message);
          });
      } else {
        // 新增 Alarm
        await axios
          .post("http://localhost:3300/api/alarm", formData)
          .then((response) => {
            alert(response.data.message);
          });
      }

      // 重新獲取資料
      const response = await axios.get("http://localhost:3300/api/alarm");
      setAlarms(response.data);

      // 清空表單並隱藏
      setFormData({
        panelId: null,
        alarmTime: "",
        alarmType: "",
        status: "",
        handler: "",
        handleTime: "",
        handleResult: "",
      });
      setShowForm(false);
    } catch (error) {
      console.error("Error adding/updating data:", error);
    }
  };

  // 函式：處理表單欄位改變事件
  const handleFormChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  // DataGrid 的 columns 設定
  const columns = [
    { field: "alarmId", headerName: "Alarm ID", width: 130 }, // 注意：這裡是 alarmId
    { field: "panelId", headerName: "Panel ID", width: 130 },
    { field: "alarmTime", headerName: "Alarm Time", width: 200 },
    { field: "alarmType", headerName: "Alarm Type", width: 130 },
    { field: "status", headerName: "Status", width: 130 },
    { field: "handler", headerName: "Handler", width: 130 },
    { field: "handleTime", headerName: "Handle Time", width: 200 },
    { field: "handleResult", headerName: "Handle Result", width: 130 },
    // ... 其他欄位
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <div>
          <Button onClick={() => handleEdit(params.row.alarmId)}>Edit</Button>{" "}
          {/* 注意：這裡是 alarmId */}
          <Button onClick={() => handleDelete(params.row.alarmId)}>
            Delete
          </Button>{" "}
          {/* 注意：這裡是 alarmId */}
        </div>
      ),
    },
  ];

  const handleAdd = () => {
    setFormData({
      panelId: null,
      alarmTime: "",
      alarmType: "",
      status: "",
      handler: "",
      handleTime: "",
      handleResult: "",
    });
    setShowForm(true); // 開啟 Dialog
  };



  return (
    <div>
      <meta name="viewport" content="initial-scale=1, width=device-width" />
      <div>
        <h1>Alarm List</h1> {/*  修改標題 */}
      </div>
      <FormControl variant="outlined" sx={{ m: 1, minWidth: 170 }}>
        <InputLabel id="panelIdSelect">Filter by Alarm ID:</InputLabel>
        <Select
          labelId="alarmIdSelect"
          id="alarmIdSelect"
          variant="standard"
          value={selectedAlarmId}
          onChange={handleSelectChange}
        >
          <MenuItem value="">All</MenuItem>
          {alarms.map((alarm) => (
            <MenuItem key={alarm.alarmId} value={alarm.alarmId}>
              {alarm.alarmId}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div style={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={filteredAlarms} //  修改變數名稱
          columns={columns}
          getRowId={(row) => row.alarmId} //* 注意：這裡是 alarmId
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
        />
      </div>
      {/* 顯示新增/編輯表單 */}
      <p></p>
      <Button onClick={handleAdd}>新增 Alarm</Button> {/* 新增按鈕 */}
      {showForm && (
        <Dialog open={showForm} onClose={() => setShowForm(false)}>
          <DialogTitle>
            {formData.alarmId ? "編輯 Alarm" : "新增 Alarm"}
          </DialogTitle>
          <DialogContent>
            <form onSubmit={handleFormSubmit}>
              <div>
                <TextField
                  type="number"
                  id="panelId"
                  name="panelId"
                  label="Panel ID"
                  variant="outlined"
                  margin="dense"
                  value={formData.panelId}
                  onChange={handleFormChange}
                />

                <TextField
                  type="text"
                  id="alarmTime"
                  name="alarmTime"
                  label="AlarmTime"
                  variant="outlined"
                  margin="dense"
                  value={formData.alarmTime}
                  onChange={handleFormChange}
                />

                <TextField
                  type="text"
                  id="alarmType"
                  name="alarmType"
                  label="AlarmType"
                  variant="outlined"
                  margin="dense"
                  value={formData.alarmType}
                  onChange={handleFormChange}
                />

                <TextField
                  type="text"
                  id="status"
                  name="status"
                  label="Status"
                  variant="outlined"
                  margin="dense"
                  value={formData.status}
                  onChange={handleFormChange}
                />

                <TextField
                  type="text"
                  id="handler"
                  name="handler"
                  label="Handler"
                  variant="outlined"
                  margin="dense"
                  value={formData.handler}
                  onChange={handleFormChange}
                />

                <TextField
                  type="text"
                  id="handleTime"
                  name="handleTime"
                  label="HandleTime"
                  variant="outlined"
                  margin="dense"
                  value={formData.handleTime}
                  onChange={handleFormChange}
                />

                <TextField
                  type="text"
                  id="handleResult"
                  name="handleResult"
                  label="HandleResult"
                  variant="outlined"
                  margin="dense"
                  value={formData.handleResult}
                  onChange={handleFormChange}
                />
              </div>
            </form>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              type="submit"
              onClick={handleFormSubmit}
            >
              {formData.alarmId ? "儲存" : "新增"}
            </Button>
            <Button onClick={() => setShowForm(false)}>取消</Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}

export default AlarmList;

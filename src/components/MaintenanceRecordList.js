import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

function MaintenanceRecordList() {
  // 狀態：儲存 Maintenance Record 資料
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  // 狀態：控制新增/編輯表單是否顯示

  const [openDialog, setOpenDialog] = useState(false);

  const [selectedRecordId, setSelectedRecordId] = useState(""); // 儲存選中的 RecordId
  // 狀態：儲存表單資料
  const [formData, setFormData] = useState({
    panelId: null,
    maintenanceDate: "",
    maintainer: "",
    description: "",
    result: "",
  });

  // useEffect hook：在元件載入時獲取 Maintenance Record 資料
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3300/api/maintenance"
        );
        setMaintenanceRecords(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // 函式：處理 "編輯" 按鈕點擊事件
  const handleEdit = (recordId) => {
    const recordToEdit = maintenanceRecords.find(
      (record) => record.recordId === recordId
    );
    if (recordToEdit) {
      setFormData(recordToEdit); // 設定表單資料
      setOpenDialog(true); // 開啟對話框
    }
  };

  // 處理 select 的變化
  const handleSelectChange = (event) => {
    setSelectedRecordId(event.target.value); // 更新選中的 panelId
  };

  // 過濾資料顯示
  const filteredRecord = selectedRecordId
    ? maintenanceRecords.filter(
        (record) => record.recordId === parseInt(selectedRecordId)
      )
    : maintenanceRecords;

  // 函式：處理 "刪除" 按鈕點擊事件
  const handleDelete = async (recordId) => {
    // eslint-disable-next-line no-template-curly-in-string
    if (
      window.confirm(
        `確定要刪除 Record ID 為 ${recordId} 的 Maintenance Record 嗎？`
      )
    ) {
      try {
        const response = await axios.delete(
          `http://localhost:3300/api/maintenance/${recordId}`
        );
        setMaintenanceRecords(
          maintenanceRecords.filter((record) => record.recordId !== recordId)
        );
        alert(response.data.message);
      } catch (error) {
        console.error("Error deleting data:", error);
      }
    }
  };

  // 函式：處理表單提交事件
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      if (formData.recordId) {
        // 更新 Maintenance Record
        await axios.put(
          `http://localhost:3300/api/maintenance/${formData.recordId}`,
          formData
        );
        alert("記錄更新成功");
      } else {
        // 新增 Maintenance Record
        await axios.post("http://localhost:3300/api/maintenance", formData);
        alert("記錄新增成功");
      }

      const response = await axios.get("http://localhost:3300/api/maintenance");
      setMaintenanceRecords(response.data); // 更新資料

      // 重置表單並關閉對話框
      setFormData({
        panelId: null,
        maintenanceDate: "",
        maintainer: "",
        description: "",
        result: "",
      });
      setOpenDialog(false);
    } catch (error) {
      console.error("Error submitting form:", error);
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
    { field: "recordId", headerName: "Record ID", width: 130 },
    { field: "panelId", headerName: "Panel ID", width: 130 },
    { field: "maintenanceDate", headerName: "Maintenance Date", width: 200 },
    { field: "maintainer", headerName: "Maintainer", width: 130 },
    { field: "description", headerName: "Description", width: 130 },
    { field: "result", headerName: "Result", width: 130 },
    // ... 其他欄位
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <div>
          <Button onClick={() => handleEdit(params.row.recordId)}>Edit</Button>
          <Button onClick={() => handleDelete(params.row.recordId)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const handleAdd = () => {
    setFormData({
      panelId: null,
      maintenanceDate: "",
      maintainer: "",
      description: "",
      result: "",
    });
    setOpenDialog(true); // 開啟 Dialog
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); // 關閉 Dialog
  };

  return (
    <div>
      <div>
        <h1>Maintenance Record List</h1>
      </div>
      <FormControl variant="outlined" sx={{ m: 1, minWidth: 170 }}>
        <InputLabel id="recordIdSelect">Filter by Record ID:</InputLabel>
        <Select
          labelId="recordIdSelect"
          id="recordIdSelect"
          variant="standard"
          value={selectedRecordId}
          onChange={handleSelectChange}
        >
          <MenuItem value="">All</MenuItem>
          {maintenanceRecords.map((record) => (
            <MenuItem key={record.recordId} value={record.recordId}>
              {record.recordId}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div style={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={filteredRecord}
          columns={columns}
          getRowId={(row) => row.recordId}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
        />
      </div>

      <Button onClick={handleAdd}>新增 Maintenance Record</Button>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {formData.recordId
            ? "編輯 Maintenance Record"
            : "新增 Maintenance Record"}
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
                id="maintenanceDate"
                name="maintenanceDate"
                label="Maintenance Date"
                variant="outlined"
                margin="dense"
                value={formData.maintenanceDate}
                onChange={handleFormChange}
              />
              <TextField
                type="text"
                id="maintainer"
                name="maintainer"
                label="Maintainer"
                variant="outlined"
                margin="dense"
                value={formData.maintainer}
                onChange={handleFormChange}
              />
              <TextField
                type="text"
                id="description"
                name="description"
                label="Description"
                variant="outlined"
                margin="dense"
                value={formData.description}
                onChange={handleFormChange}
              />
              <TextField
                type="text"
                id="result"
                name="result"
                label="Result"
                variant="outlined"
                margin="dense"
                value={formData.result}
                onChange={handleFormChange}
              />
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" type="submit" onClick={handleFormSubmit}>
            {formData.recordId ? "編輯" : "新增"}
          </Button>
          <Button onClick={handleCloseDialog}>取消</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default MaintenanceRecordList;

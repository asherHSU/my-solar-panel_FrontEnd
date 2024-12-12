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

function SolarPanels() {
  // 狀態：儲存 Solar Panel 資料
  const [solarPanels, setSolarPanels] = useState([]);
  // 狀態：控制新增/編輯表單是否顯示
  const [showForm, setShowForm] = useState(false);

  const [selectedPanelId, setSelectedPanelId] = useState(""); // 儲存選中的 panelId


  // 狀態：儲存表單資料
  const [formData, setFormData] = useState({
    model: "",
    location: "",
    installationDate: "", // 注意：日期格式需要符合 API 的要求
    status: "",
    area: 0,
    ratedPower: 0,
    userId: null,
  });

  // useEffect hook：在元件載入時獲取 Solar Panel 資料
  useEffect(() => {
    // 非同步函式：獲取資料
    const fetchData = async () => {
      try {
        // 發送 GET 請求到後端 API
        const response = await axios.get(
          "http://localhost:3300/api/solarpanels"
        );
        // 更新狀態，儲存 API 回應的資料
        setSolarPanels(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // 呼叫 fetchData 函式
  }, []); // 空的依赖数组表示只在元件載入時執行一次

  // 函式：處理 "編輯" 按鈕點擊事件
  const handleEdit = async (panelId) => {
    const panelToEdit = solarPanels.find((panel) => panel.panelId === panelId);
    if (panelToEdit) {
      setFormData(panelToEdit);
      setShowForm(true); // 顯示表單
    }
  };

  // 處理 select 的變化
  const handleSelectChange = (event) => {
    setSelectedPanelId(event.target.value); // 更新選中的 panelId
  };

  // 過濾資料顯示
  const filteredPanels = selectedPanelId
    ? solarPanels.filter((panel) => panel.panelId === parseInt(selectedPanelId))
    : solarPanels;

  // 函式：處理 "刪除" 按鈕點擊事件
  const handleDelete = async (panelId) => {
    if (
      window.confirm(`確定要刪除 Panel ID 為 ${panelId} 的 Solar Panel 嗎？`)
    ) {
      try {
        // 發送 DELETE 請求到後端 API
        await axios
          .delete(`http://localhost:3300/api/solarpanels/${panelId}`)
          .then((response) => {
            alert(response.data.message);
          });
        // 更新表格資料，移除被刪除的 Solar Panel
        setSolarPanels(
          solarPanels.filter((panel) => panel.panelId !== panelId)
        );
      } catch (error) {
        console.error("Error deleting data:", error);
      }
    }
  };

  // 函式：處理表單提交事件
  const handleFormSubmit = async (event) => {
    event.preventDefault(); // 阻止預設的表單提交行為

    try {
      // 判斷是新增還是更新
      if (formData.panelId) {
        //const { id, ...updatedPanelData } = formData;
        // 更新 Solar Panel，發送 PUT 請求
        await axios
          .put(
            `http://localhost:3300/api/solarpanels/${formData.panelId}`,
            formData
          )
          .then((response) => {
            alert(response.data.message);
          });
      } else {
        // 新增 Solar Panel，發送 POST 請求
        await axios
          .post("http://localhost:3300/api/solarpanels", formData)
          .then((response) => {
            alert(response.data.message);
          });
      }

      // 重新獲取資料
      const response = await axios.get("http://localhost:3300/api/solarpanels");
      setSolarPanels(response.data); // 更新表格資料

      // 清空表單並隱藏
      setFormData({
        model: "",
        location: "",
        installationDate: "",
        status: "",
        area: 0,
        ratedPower: 0,
        userId: null,
      });
      setShowForm(false);
    } catch (error) {
      console.error("Error adding/updating data:", error);
    }
  };

  // 函式：處理表單欄位改變事件
  const handleFormChange = (event) => {
    // 更新 formData 狀態
    setFormData({
      ...formData, // 保留原來的 formData
      [event.target.name]: event.target.value, // 更新改變的欄位
    });
  };

  // DataGrid 的 columns 設定
  const columns = [
    { field: "panelId", headerName: "Panel ID", width: 130 },
    { field: "model", headerName: "Model", width: 130 },
    { field: "location", headerName: "Location", width: 130 },
    { field: "installationDate", headerName: "Installation Date", width: 200 },
    { field: "status", headerName: "Status", width: 130 },
    { field: "area", headerName: "Area", width: 130 },
    { field: "ratedPower", headerName: "Rated Power", width: 130 },
    { field: "userId", headerName: "UserID", width: 70 },
    // ... 其他欄位
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <div>
          <Button onClick={() => handleEdit(params.row.panelId)}>Edit</Button>
          <Button onClick={() => handleDelete(params.row.panelId)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  // 函式：處理 "新增" 按鈕點擊事件
  const handleAdd = () => {
    setFormData({
      model: "",
      location: "",
      installationDate: "",
      status: "",
      area: 0,
      ratedPower: 0,
      userId: null,
    });
    setShowForm(true); // 開啟 Dialog
  };

  // 函式：處理 Dialog 關閉事件


  return (
    <div>
      <div>
        <h1>Solar Panel List</h1>
      </div>
      <FormControl variant="outlined" sx={{ m: 1, minWidth: 170 }}>
        <InputLabel id="panelIdSelect">Filter by Panel ID:</InputLabel>
        <Select
          labelId="panelIdSelect"
          id="panelIdSelect"
          variant="standard"
          value={selectedPanelId}
          onChange={handleSelectChange}
        >
          <MenuItem value="">All</MenuItem>
          {solarPanels.map((panel) => (
            <MenuItem key={panel.panelId} value={panel.panelId}>
              {panel.panelId}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div style={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={filteredPanels}
          columns={columns}
          getRowId={(row) => row.panelId}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
        />
      </div>

      {/* 新增按鈕 */}
      <Button onClick={handleAdd}>新增 Solar Panel</Button>
      {showForm && (
        <Dialog open={showForm} onClose={() => setShowForm(false)}>
          <DialogTitle>
            {formData.panelId ? "編輯 Solar Panel" : "新增 Solar Panel"}
          </DialogTitle>
          <DialogContent>
            <form onSubmit={handleFormSubmit}>
              <div>
                <TextField
                  type="text"
                  id="model"
                  name="model"
                  label="Model"
                  variant="outlined"
                  margin="dense"
                  value={formData.model}
                  onChange={handleFormChange}
                />

                <TextField
                  type="text"
                  id="location"
                  name="location"
                  label="Location"
                  variant="outlined"
                  margin="dense"
                  value={formData.location}
                  onChange={handleFormChange}
                />

                <TextField
                  type="text"
                  id="installationDate"
                  name="installationDate"
                  label="Installation Date"
                  variant="outlined"
                  margin="dense"
                  value={formData.installationDate}
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
                  type="number"
                  id="area"
                  name="area"
                  label="Area"
                  margin="dense"
                  variant="outlined"
                  value={formData.area}
                  onChange={handleFormChange}
                />

                <TextField
                  type="number"
                  id="ratedPower"
                  name="ratedPower"
                  label="Rated Power"
                  variant="outlined"
                  margin="dense"
                  value={formData.ratedPower}
                  onChange={handleFormChange}
                />

                <TextField
                  type="number"
                  id="userId"
                  name="userId"
                  label="UserID"
                  variant="outlined"
                  margin="dense"
                  value={formData.userId}
                  onChange={handleFormChange}
                />
              </div>
            </form>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" type="submit" onClick={handleFormSubmit}>
                {formData.panelId ? "儲存" : "新增"}
            </Button>
            <Button onClick={() => setShowForm(false)}>取消</Button>
        </DialogActions>
        </Dialog>
      )}
    </div>
  );
}

export default SolarPanels;

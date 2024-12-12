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
import "@fontsource/roboto/400.css";

function PowerGenerationDataList() {
  const [powerGenerationData, setPowerGenerationData] = useState([]);
  const [formData, setFormData] = useState({
    panelId: "",
    timestamp: "",
    voltage: 0,
    current: 0,
    power: 0,
    energy: 0,
    temperature: 0,
    irradiance: 0,
  });
  const [selectedDataId, setSelectedDataId] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3300/api/powergenerationdata");
        setPowerGenerationData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (dataId) => {
    const dataToEdit = powerGenerationData.find((data) => data.dataId === dataId);
    if (dataToEdit) {
      setFormData(dataToEdit);
      setDialogOpen(true);
    }
  };

  const handleDelete = async (dataId) => {
    if (window.confirm(`確定要刪除 Data ID 為 ${dataId} 的資料嗎？`)) {
      try {
        await axios.delete(`http://localhost:3300/api/powergenerationdata/${dataId}`);
        setPowerGenerationData((prevData) => prevData.filter((data) => data.dataId !== dataId));
      } catch (error) {
        console.error("Error deleting data:", error);
      }
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      if (formData.dataId) {
        await axios.put(`http://localhost:3300/api/powergenerationdata/${formData.dataId}`, formData);
      } else {
        await axios.post("http://localhost:3300/api/powergenerationdata", formData);
      }

      const response = await axios.get("http://localhost:3300/api/powergenerationdata");
      setPowerGenerationData(response.data);
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      panelId: "",
      timestamp: "",
      voltage: 0,
      current: 0,
      power: 0,
      energy: 0,
      temperature: 0,
      irradiance: 0,
    });
  };

  const filteredData = selectedDataId
    ? powerGenerationData.filter((data) => data.dataId === parseInt(selectedDataId))
    : powerGenerationData;

  const columns = [
    { field: "dataId", headerName: "Data ID", width: 130 },
    { field: "panelId", headerName: "Panel ID", width: 130 },
    { field: "timestamp", headerName: "Timestamp", width: 200 },
    { field: "voltage", headerName: "Voltage", width: 130 },
    { field: "current", headerName: "Current", width: 130 },
    { field: "power", headerName: "Power", width: 130 },
    { field: "energy", headerName: "Energy", width: 130 },
    { field: "temperature", headerName: "Temperature", width: 130 },
    { field: "irradiance", headerName: "Irradiance", width: 130 },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      renderCell: (params) => (
        <>
          <Button onClick={() => handleEdit(params.row.dataId)}>Edit</Button>
          <Button color="error" onClick={() => handleDelete(params.row.dataId)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h1>Power Generation Data List</h1>
      <FormControl variant="outlined" sx={{ m: 1, minWidth: 200 }}>
        <InputLabel id="dataIdSelect">Filter by Data ID</InputLabel>
        <Select
          labelId="dataIdSelect"
          value={selectedDataId}
          onChange={(e) => setSelectedDataId(e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          {powerGenerationData.map((data) => (
            <MenuItem key={data.dataId} value={data.dataId}>
              {data.dataId}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div style={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={filteredData}
          columns={columns}
          getRowId={(row) => row.dataId}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
        />
      </div>
      <Button variant="contained" onClick={() => setDialogOpen(true)}>
        新增資料
      </Button>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{formData.dataId ? "編輯資料" : "新增資料"}</DialogTitle>
        <DialogContent>
          <form>
            {Object.keys(formData).map((key) => (
              <TextField
                key={key}
                type={key === "timestamp" ? "text" : "number"}
                id={key}
                name={key}
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                fullWidth
                margin="dense"
                variant="outlined"
                value={formData[key] || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, [key]: e.target.value }))
                }
              />
            ))}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFormSubmit} variant="contained">
            {formData.dataId ? "更新" : "新增"}
          </Button>
          <Button onClick={() => setDialogOpen(false)} color="error">
            取消
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default PowerGenerationDataList;

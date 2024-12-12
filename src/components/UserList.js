import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
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

function UserList() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false); 

  const [selectedUserId, setSelectedUserId] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "",
    name: "",
    contact: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const apiRef = useGridApiRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3300/api/user");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleEdit = async (userId) => {
    const userToEdit = users.find((user) => user.userId === userId);
    if (userToEdit) {
      setFormData(userToEdit);
      setShowForm(true); // 顯示表單
    }
  };

  const handleSelectChange = (event) => {
    setSelectedUserId(event.target.value);
  };

  const filteredUsers = selectedUserId
    ? users.filter((user) => user.userId === parseInt(selectedUserId))
    : users;

  const handleDelete = async (userId) => {
    if (window.confirm(`確定要刪除 User ID 為 ${userId} 的 User 嗎？`)) {
      try {
        await axios
          .delete(`http://localhost:3300/api/user/${userId}`)
          .then((response) => {
            alert(response.data.message);
          });
        setUsers(users.filter((user) => user.userId !== userId));
      } catch (error) {
        console.error("Error deleting data:", error);
      }
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      if (formData.userId) {
        await axios
          .put(`http://localhost:3300/api/user/${formData.userId}`, formData)
          .then((response) => {
            alert(response.data.message);
          });
      } else {
        await axios
          .post("http://localhost:3300/api/user", formData)
          .then((response) => {
            alert(response.data.message);
          });
      }

      const response = await axios.get("http://localhost:3300/api/user");
      setUsers(response.data);

      setFormData({
        username: "",
        password: "",
        role: "",
        name: "",
        contact: "",
      });
      setShowForm(false); 
    } catch (error) {
      console.error("Error adding/updating data:", error);
    }
  };

  const handleFormChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const columns = [
    { field: "userId", headerName: "User ID", width: 130 },
    { field: "username", headerName: "Username", width: 130 },
    {
      field: "password",
      headerName: "Password",
      width: 130,
      valueFormatter: (params) => {
        if (showPassword) {
          return params.value;
        } else {
          return "*".repeat(8);
        }
      },
    },
    { field: "role", headerName: "Role", width: 130 },
    { field: "name", headerName: "Name", width: 130 },
    { field: "contact", headerName: "Contact", width: 200 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <div>
          <Button onClick={() => handleEdit(params.row.userId)}>Edit</Button>
          <Button onClick={() => handleDelete(params.row.userId)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const handleAdd = () => {
    setFormData({
      username: "",
      password: "",
      role: "",
      name: "",
      contact: "",
    });
    setShowForm(true);;
  };

 

  return (
    <div>
      <meta name="viewport" content="initial-scale=1, width=device-width" />
      <div>
        <h1>User List</h1>
      </div>
      <FormControl variant="outlined" sx={{ m: 1, minWidth: 170 }}>
        <InputLabel id="panelIdSelect">Filter by User ID:</InputLabel>
        <Select
          labelId="userIdSelect"
          id="userIdSelect"
          variant="standard"
          value={selectedUserId}
          onChange={handleSelectChange}
        >
          <MenuItem value="">All</MenuItem>
          {users.map((user) => (
            <MenuItem key={user.userId} value={user.userId}>
              {user.userId}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div style={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={filteredUsers}
          columns={columns}
          getRowId={(row) => row.userId}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          apiRef={apiRef}
        />
      </div>
      <Button onClick={handleAdd}>新增 User</Button>
      <Button
        variant="contained"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? "隱藏密碼" : "顯示密碼"}
      </Button>

      {/* 新增/編輯表單 */}
      {showForm && ( 
        <Dialog open={showForm} onClose={() => setShowForm(false)}> 
          <DialogTitle>{formData.userId ? "編輯 User" : "新增 User"}</DialogTitle> 
          <DialogContent>
            <form onSubmit={handleFormSubmit}>
              <div>
                <TextField
                  type="text"
                  id="username"
                  name="username"
                  label="Username"
                  variant="outlined"
                  margin="dense"
                  value={formData.username}
                  onChange={handleFormChange}
                />
                <TextField
                  type="text"
                  id="password"
                  name="password"
                  label="Password"
                  variant="outlined"
                  margin="dense"
                  value={formData.password}
                  onChange={handleFormChange}
                />
                <TextField
                  type="text"
                  id="role"
                  name="role"
                  label="Role"
                  variant="outlined"
                  margin="dense"
                  value={formData.role}
                  onChange={handleFormChange}
                />
                <TextField
                  type="text"
                  id="name"
                  name="name"
                  label="Name"
                  variant="outlined"
                  margin="dense"
                  value={formData.name}
                  onChange={handleFormChange}
                />

                <TextField
                  type="text"
                  id="contact"
                  name="contact"
                  label="Contact"
                  variant="outlined"
                  margin="dense"
                  value={formData.contact}
                  onChange={handleFormChange}
                />
              </div>
            </form>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" type="submit" onClick={handleFormSubmit}>
              {formData.userId ? "儲存" : "新增"} 
            </Button>
            <Button onClick={() => setShowForm(false)}>取消</Button> 
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}

export default UserList;
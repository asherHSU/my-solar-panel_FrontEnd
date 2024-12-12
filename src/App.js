import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Drawer, CssBaseline, Box, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomePage from './components/HomePage'; // 引入 HomePage 元件
import SolarPanelList from './components/SolarPanelList';
import MaintenanceRecordList from './components/MaintenanceRecordList';
import UserList from './components/UserList';
import AlarmList from './components/AlarmList';
import SolarPanelDailyOutput from './components/SolarPanelTotalOutput';
import UserSolarPanelRanking from './components/UserSolarPanelRanking';
import PowerGenerationDataList from './components/powerGenerationDataList';
import TroubleShooting from './components/TroubleShooting';
import SolarPanelMaintenance from './components/SolarPanelMaintenance';
import SolarPanelBrandRanking from './components/SolarPanelBrandRanking';
import TemperaturePowerAnalysis from './components/TemperaturePowerAnalysis';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListSubheader from '@mui/material/ListSubheader';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

// Icon import
import HomeIcon from '@mui/icons-material/Home';
import SolarPowerIcon from '@mui/icons-material/SolarPower';
import ConstructionIcon from '@mui/icons-material/Construction';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import BoltIcon from '@mui/icons-material/Bolt';
import QueryStatsIcon from '@mui/icons-material/QueryStats';



function Navigation({ onPageChange }) {
  const navigate = useNavigate(); // 使用 useNavigate

  const handleNavigation = (path, label) => {
    onPageChange(label);
    navigate(path); // 使用 navigate 更新 URL
  };

  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
  <div>
    <List sx={{ marginTop: '64px', width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                  <ListSubheader component="div" id="nested-list-subheader">
                    Tables
                  </ListSubheader>
                }>

      <ListItemButton onClick={() => handleNavigation('/', 'Home')}>
          <ListItemIcon>
              <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
      </ListItemButton>

      <ListItemButton onClick={() => handleNavigation('/solar-panels', 'Solar Panel 列表')}>
          <ListItemIcon>
              <SolarPowerIcon />
          </ListItemIcon>
          <ListItemText primary="Solar Panel 列表" />
      </ListItemButton>

      <ListItemButton onClick={() => handleNavigation('/users', 'User 列表')}>
          <ListItemIcon>
              <AccountCircleIcon />
          </ListItemIcon>
          <ListItemText primary="User 列表" />
      </ListItemButton>

      <ListItemButton onClick={() => handleNavigation('/maintenancerecord', 'Maintenance 列表')}>
          <ListItemIcon>
              <ConstructionIcon />
          </ListItemIcon>
          <ListItemText primary="Maintenance 列表" />
      </ListItemButton>

      <ListItemButton onClick={() => handleNavigation('/alarm', 'Alarm 列表')}>
          <ListItemIcon>
              <NotificationsIcon />
          </ListItemIcon>
          <ListItemText primary="Alarm 列表" />
      </ListItemButton>

      <ListItemButton onClick={() => handleNavigation('/powergenerationdata', 'PowerGeneration Data 列表')}>
          <ListItemIcon>
              <BoltIcon />
          </ListItemIcon>
          <ListItemText primary="PowerGeneration Data 列表" />
      </ListItemButton>

      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <QueryStatsIcon />
        </ListItemIcon>
        <ListItemText primary="Cross query" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
        <ListItemButton onClick={() => handleNavigation('/solarpaneldailyoutput', 'Solar Panel 發電量統計')}>
          <ListItemText primary="Solar Panel 發電量統計" />
        </ListItemButton>

        <ListItemButton onClick={() => handleNavigation('/UserSolarPanelRanking', 'User 發電量排名')}>
            <ListItemText primary="User 發電量排名" />
        </ListItemButton>

        <ListItemButton onClick={() => handleNavigation('/TroubleShooting', 'Solar Panel 故障查詢')}>
            <ListItemText primary="Solar Panel 故障查詢" />
        </ListItemButton>

        <ListItemButton onClick={() => handleNavigation('/solarpanelmaintenance', 'Solar Panel 維護記錄統計')}>
            <ListItemText primary="Solar Panel 維護記錄統計" />
        </ListItemButton>

        <ListItemButton onClick={() => handleNavigation('/SolarPanelBrandRanking', 'Model 統計數據')}>
            <ListItemText primary="Model 統計數據" />
        </ListItemButton>

        <ListItemButton onClick={() => handleNavigation('/temperaturepoweranalysis', 'Solar Panel 溫度及地點發電量統計')}>
            <ListItemText primary="Solar Panel 溫度及地點發電量統計" />
        </ListItemButton>
        </List>
      </Collapse>
    </List>
    </div>
  );
}

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('Home');

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleHomeClick = () => {
    window.location.href = '/';
  };

  return (
    <BrowserRouter>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>

          <Button variant="text" color='white' onClick={handleHomeClick} size='large'>
            Solar Panel management system
          </Button>
          {/* <Typography variant="h6" noWrap>
            {currentPage}
          </Typography> */}
        </Toolbar>
      </AppBar>
      <Drawer variant="persistent" open={isDrawerOpen} sx={{ width: 240, flexShrink: 0}}>
        <Box sx={{ width: 240 }}>
          <Navigation onPageChange={setCurrentPage} />
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: isDrawerOpen ? '240px' : '0px',
          transition: 'margin 0.3s',
        }}
      >
        <Toolbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/solar-panels" element={<SolarPanelList />} />
          <Route path="/maintenancerecord" element={<MaintenanceRecordList />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/alarm" element={<AlarmList />} />
          <Route path="/SolarPanelDailyOutput" element={<SolarPanelDailyOutput />} />
          <Route path="/UserSolarPanelRanking" element={<UserSolarPanelRanking />} />
          <Route path="/powergenerationdata" element={<PowerGenerationDataList />} />
          <Route path="/TroubleShooting" element={<TroubleShooting />} />
          <Route path="/SolarPanelMaintenance" element={<SolarPanelMaintenance />} />
          <Route path="/SolarPanelBrandRanking" element={<SolarPanelBrandRanking />} />
          <Route path="/TemperaturePowerAnalysis" element={<TemperaturePowerAnalysis />} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
}

export default App;

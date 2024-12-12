# 太陽能監控系統 (前端)

## 專案概述

這個專案是太陽能監控系統的前端應用程式，使用 React 框架開發，提供使用者介面來顯示和管理太陽能板的數據、警報和維護記錄等資訊。

## 功能

* 顯示 Solar Panel 列表，包含 Panel ID、型號、位置、安裝日期、狀態、面積、額定功率和負責維護的使用者等資訊。
* 顯示 Maintenance Record 列表，包含 Record ID、Panel ID、維護日期、維護人員、描述和結果等資訊。
* 顯示 Power Generation Data 列表，包含 Data ID、Panel ID、時間戳、電壓、電流、功率、能量、溫度和照度等資訊。
* 顯示 User 列表，包含 User ID、使用者名稱、角色、姓名和聯絡方式等資訊。
* 顯示 Alarm 列表，包含 Alarm ID、Panel ID、警報時間、警報類型、狀態、處理人員、處理時間和處理結果等資訊。
* 顯示 Alarm Handling 列表，包含 Alarm Handling ID、Alarm ID 和 User ID 等資訊。
* 交叉查詢表格：
    * Solar Panel 發電量統計
    * 使用者 Solar Panel 發電量排名
    * Solar Panel 故障統計
    * Solar Panel 維護記錄統計
    * 警報統計
    * 使用者警報處理統計

## 技術

* React
* TypeScript
* Axios
* Material UI
* Recharts
* React Router

## 安裝

1.  複製此 repository。
2.  在專案目錄下執行 `npm install` 安裝所有依赖项。

## 執行

在專案目錄下執行 `npm start` 啟動開發伺服器。

## 建置

在專案目錄下執行 `npm run build` 建置 production 版本的應用程式。

## 測試

在專案目錄下執行 `npm test` 執行測試。

## 作者

B11209032 許良宏

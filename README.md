# Employee Attendance System

A web-based Employee Attendance System that allows **Admins, Managers, and Employees** to manage and track attendance efficiently.  
This project includes **frontend (React)** and **backend (Node.js + Express + MongoDB)** with separate dashboards for each user role.

---

## Features

### Manager
- Login using manager credentials  
- View employee list  
- View each employee’s attendance  
- Today’s attendance summary  
- Late employees list  
- Weekly attendance trend (chart)  
- Department-wise attendance (chart)

### Employee
- Login with employee account  
- Mark attendance (Check‑in & Check‑out)  
- View attendance history  
- See monthly summary (Present / Absent / Late / Hours worked)  
- Dashboard showing personal stats  

---

## ⚙️ Technologies Used

### Backend
- Node.js  
- Express.js  
- MongoDB (Mongoose)  
- JWT Authentication  
- bcrypt.js  

### Frontend
- React  
- React Router  
- Axios  
- Chart.js (for graphs)

---

## Installation & Setup

### Clone the repository
```sh
git clone https://github.com/YourUsername/EMPLOYEE-ATTENDENCE-SYSTEM.git
cd EMPLOYEE-ATTENDENCE-SYSTEM

### Backend Setup
cd server
npm install

###Create .env file
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key

###Start backend
npm start

###Frontend Setup
cd client
npm install
npm run dev

Frontend will run at:
 http://localhost:5173

Backend will run at:
 http://localhost:5000







// eas/client/src/pages/MarkAttendance.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkIn, checkOut } from '../features/attendanceSlice';

export default function MarkAttendance(){
  const dispatch = useDispatch();
  const today = useSelector(s=>s.attendance.today);

  return (
    <div className="container">
      <h2>Mark Attendance</h2>
      <div>
        <p>Today's status: {today?.status || 'Not checked in'}</p>
        <p>Check In: {today?.checkInTime ? new Date(today.checkInTime).toLocaleString() : '-'}</p>
        <p>Check Out: {today?.checkOutTime ? new Date(today.checkOutTime).toLocaleString() : '-'}</p>
      </div>
      <button onClick={()=>dispatch(checkIn())}>Check In</button>
      <button onClick={()=>dispatch(checkOut())}>Check Out</button>
    </div>
  );
}

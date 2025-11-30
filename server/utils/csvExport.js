// server/utils/csvExport.js
import { createObjectCsvStringifier } from 'csv-writer';

export const exportAttendanceToCSV = async (items) => {
  // items: array of Attendance populated with userId
  const csvStringifier = createObjectCsvStringifier({
    header: [
      { id: 'employeeId', title: 'Employee ID' },
      { id: 'name', title: 'Name' },
      { id: 'email', title: 'Email' },
      { id: 'department', title: 'Department' },
      { id: 'date', title: 'Date' },
      { id: 'checkIn', title: 'Check In' },
      { id: 'checkOut', title: 'Check Out' },
      { id: 'status', title: 'Status' },
      { id: 'hours', title: 'Total Hours' }
    ]
  });

  const records = items.map(it => ({
    employeeId: it.userId?.employeeId || '',
    name: it.userId?.name || '',
    email: it.userId?.email || '',
    department: it.userId?.department || '',
    date: it.date,
    checkIn: it.checkInTime || '',
    checkOut: it.checkOutTime || '',
    status: it.status,
    hours: it.totalHours || 0
  }));

  return csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);
};
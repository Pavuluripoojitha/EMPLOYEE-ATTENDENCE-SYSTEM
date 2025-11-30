// eas/client/src/features/attendanceSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../services/api';

export const checkIn = createAsyncThunk('attendance/checkIn', async () => {
  const res = await API.post('/attendance/checkin');
  return res.data;
});

export const checkOut = createAsyncThunk('attendance/checkOut', async () => {
  const res = await API.post('/attendance/checkout');
  return res.data;
});

export const fetchMyHistory = createAsyncThunk('attendance/myHistory', async (params) => {
  const res = await API.get('/attendance/my-history', { params });
  return res.data;
});

const slice = createSlice({
  name: 'attendance',
  initialState: { today: null, history: [], status: 'idle' },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(checkIn.fulfilled, (s, a) => { s.today = a.payload; });
    b.addCase(checkOut.fulfilled, (s, a) => { s.today = a.payload; });
    b.addCase(fetchMyHistory.fulfilled, (s, a) => { s.history = a.payload; });
  }
});

export default slice.reducer;

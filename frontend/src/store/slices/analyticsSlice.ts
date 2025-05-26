// src/store/slices/analyticsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface AnalyticsData {
  linkId: string;
  shortCode: string;
  originalUrl: string;
  createdAt: string;
  totalClicks: number;
  clicksByDate: Record<string, number>;
  clicksByReferrer: Record<string, number>;
  clicksByLocation: Record<string, number>;
}

interface AnalyticsState {
  analyticsData: AnalyticsData[];
  currentAnalytics: AnalyticsData | null;
  loading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  analyticsData: [],
  currentAnalytics: null,
  loading: false,
  error: null,
};

// Get guest ID from localStorage
const getGuestId = (): string => {
  return localStorage.getItem('guestId') || '';
};

export const getUserAnalytics = createAsyncThunk(
  'analytics/getUserAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/analytics/user', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch analytics');
    }
  }
);

export const getGuestAnalytics = createAsyncThunk(
  'analytics/getGuestAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const guestId = getGuestId();
      if (!guestId) {
        return rejectWithValue('No guest ID found');
      }
      const response = await axios.get(`/api/analytics/guest?guestId=${guestId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch guest analytics');
    }
  }
);

export const getLinkAnalyticsSummary = createAsyncThunk(
  'analytics/getLinkAnalyticsSummary',
  async (linkId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/analytics/summary/${linkId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch analytics summary');
    }
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentAnalytics: (state, action: PayloadAction<AnalyticsData>) => {
      state.currentAnalytics = action.payload;
    },
    clearCurrentAnalytics: (state) => {
      state.currentAnalytics = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserAnalytics.fulfilled, (state, action: PayloadAction<AnalyticsData[]>) => {
        state.loading = false;
        state.analyticsData = action.payload;
      })
      .addCase(getUserAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getGuestAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGuestAnalytics.fulfilled, (state, action: PayloadAction<AnalyticsData[]>) => {
        state.loading = false;
        state.analyticsData = action.payload;
      })
      .addCase(getGuestAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getLinkAnalyticsSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLinkAnalyticsSummary.fulfilled, (state, action: PayloadAction<AnalyticsData>) => {
        state.loading = false;
        state.currentAnalytics = action.payload;
      })
      .addCase(getLinkAnalyticsSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCurrentAnalytics, clearCurrentAnalytics } = analyticsSlice.actions;
export default analyticsSlice.reducer;

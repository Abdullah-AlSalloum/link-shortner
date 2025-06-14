// src/store/slices/linkSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Link {
  id: string;
  originalUrl: string;
  shortCode: string;
  createdAt: string;
  expiresAt?: string;
  userId?: string;
}

interface LinkState {
  links: Link[];
  guestLinks: Link[];
  currentLink: Link | null;
  loading: boolean;
  error: string | null;
}

const initialState: LinkState = {
  links: [],
  guestLinks: [],
  currentLink: null,
  loading: false,
  error: null,
};

// Get guest ID from localStorage or create a new one
const getGuestId = (): string => {
  let guestId = localStorage.getItem('guestId');
  if (!guestId) {
    guestId = `guest_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem('guestId', guestId);
  }
  return guestId;
};

export const shortenUrl = createAsyncThunk(
  'links/shortenUrl',
  async (originalUrl: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { isAuthenticated: boolean; user: { id: string } } };
      const isAuthenticated = state.auth.isAuthenticated;
      
      const payload = {
        originalUrl,
        ...(isAuthenticated 
          ? { userId: state.auth.user.id } 
          : { guestId: getGuestId() })
      };
      
      const response = await axios.post('/api/url/shorten', payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to shorten URL');
    }
  }
);

export const getUserLinks = createAsyncThunk(
  'links/getUserLinks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/links', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch links');
    }
  }
);

export const getGuestLinks = createAsyncThunk(
  'links/getGuestLinks',
  async (_, { rejectWithValue }) => {
    try {
      const guestId = getGuestId();
      const response = await axios.get(`/api/url/guest/links?guestId=${guestId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch guest links');
    }
  }
);

export const updateLink = createAsyncThunk(
  'links/updateLink',
  async ({ id, data }: { id: string; data: Partial<Link> }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/links/${id}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update link');
    }
  }
);

export const deleteLink = createAsyncThunk(
  'links/deleteLink',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/links/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete link');
    }
  }
);

const linkSlice = createSlice({
  name: 'links',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentLink: (state, action: PayloadAction<Link>) => {
      state.currentLink = action.payload;
    },
    clearCurrentLink: (state) => {
      state.currentLink = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(shortenUrl.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(shortenUrl.fulfilled, (state, action: PayloadAction<Link>) => {
        state.loading = false;
        state.currentLink = action.payload;
        // Add to appropriate list based on authentication status
        if (action.payload.userId) {
          state.links = [action.payload, ...state.links];
        } else {
          state.guestLinks = [action.payload, ...state.guestLinks];
        }
      })
      .addCase(shortenUrl.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getUserLinks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserLinks.fulfilled, (state, action: PayloadAction<Link[]>) => {
        state.loading = false;
        state.links = action.payload;
      })
      .addCase(getUserLinks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getGuestLinks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGuestLinks.fulfilled, (state, action: PayloadAction<Link[]>) => {
        state.loading = false;
        state.guestLinks = action.payload;
      })
      .addCase(getGuestLinks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateLink.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLink.fulfilled, (state, action: PayloadAction<Link>) => {
        state.loading = false;
        state.links = state.links.map((link) =>
          link.id === action.payload.id ? action.payload : link
        );
        if (state.currentLink?.id === action.payload.id) {
          state.currentLink = action.payload;
        }
      })
      .addCase(updateLink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteLink.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLink.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.links = state.links.filter((link) => link.id !== action.payload);
        if (state.currentLink?.id === action.payload) {
          state.currentLink = null;
        }
      })
      .addCase(deleteLink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCurrentLink, clearCurrentLink } = linkSlice.actions;
export default linkSlice.reducer;

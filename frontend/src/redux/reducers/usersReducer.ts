import {
  PayloadAction,
  createAction,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';

import { NewUser, User } from '../../types/User';
import { UserUpdate } from '../../types/UserUpdate';
import { IUpdatePassword, UserCredential } from '../../types/UserCredential';

const baseAuthUrl = `${process.env.REACT_APP_PROXY}/api/v1/auth`;
const baseUserUrl = `${process.env.REACT_APP_PROXY}/api/v1/users`;

interface UserReducer {
  users: User[];
  currentUser?: User;
  loading: boolean;
  error: string;
}

const initialState: UserReducer = {
  users: [],
  loading: false,
  error: '',
};

export const fetchAllUsers = createAsyncThunk('fetchAllUsers', async () => {
  try {
    const token = localStorage.getItem('token');
    const result = await axios.get<User[]>(baseUserUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return result.data;
  } catch (e) {
    const error = e as AxiosError;
    return error;
  }
});

export const authenticate = createAsyncThunk(
  'authenticate',
  async (access_token: string) => {
    try {
      const authentication = await axios.get<User>(`${baseUserUrl}/profile`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      return authentication.data;
    } catch (e) {
      const error = e as AxiosError;
      return error;
    }
  }
);

export const login = createAsyncThunk(
  'login',
  async ({ email, password }: UserCredential, { dispatch }) => {
    try {
      const result = await axios.post(baseAuthUrl, { email, password });
      localStorage.setItem('token', result.data);
      localStorage.setItem(
        'userCredential',
        JSON.stringify({ email: email, password: password })
      );
        // alert('token: ' + result.data);
      const authentication = await dispatch(authenticate(result.data));
      return authentication.payload as User;
    } catch (e) {
      const error = e as AxiosError;
      alert('Wrong email or password. Please login again:');
      return error;
    }
  }
);

export const logout = createAction('logout');

export const createNewUser = createAsyncThunk(
  'createNewUser',
  async (user: NewUser) => {
    try {
      const createUserResponse = await axios.post(baseUserUrl, user);
      return createUserResponse.data;
    } catch (e) {
      const error = e as AxiosError;
      return error;
    }
  }
);

export const updateUser = createAsyncThunk(
  'updateUser',
  async (updatedUser: UserUpdate) => {
    try {
      const token = localStorage.getItem('token');
      const updateUserResponse = await axios.patch(
        `${baseUserUrl}/${updatedUser.id}`,
        updatedUser.update,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return updateUserResponse.data;
    } catch (e) {
      const error = e as AxiosError;
      return error;
    }
  }
);

export const updatePassword = createAsyncThunk(
  'updatePassword',
  async (updatedPassword: IUpdatePassword) => {
    try {
      const requestBody = { password: updatedPassword.password };

      const token = localStorage.getItem('token');
      const updateUserResponse = await axios.patch(
        `${baseUserUrl}/${updatedPassword.userId}/change-password`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return updateUserResponse.data;
    } catch (e) {
      const error = e as AxiosError;
      return error;
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    createUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },
    emptyUsersReducer: (state) => {
      state.users = [];
    },
    sortByEmail: (state, action: PayloadAction<'asc' | 'desc'>) => {
      if (action.payload === 'asc') {
        state.users.sort((a, b) => a.email.localeCompare(b.email));
      } else {
        state.users.sort((a, b) => b.email.localeCompare(a.email));
      }
    },
  },
  extraReducers: (build) => {
    build
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        if (action.payload instanceof AxiosError) {
          state.error = action.payload.message;
        } else {
          state.users = action.payload;
        }
        state.loading = false;
      })
      .addCase(fetchAllUsers.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.error = 'Cannot fetch data';
      })
      .addCase(createNewUser.fulfilled, (state, action) => {
        if (action.payload instanceof AxiosError) {
          state.error = action.payload.message;
        } else {
          state.users.push(action.payload);
        }
        state.loading = false;
      })
      .addCase(createNewUser.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(createNewUser.rejected, (state, action) => {
        state.error = 'Cannot create new user';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        if (action.payload instanceof AxiosError) {
          state.error = action.payload.message;
        } else {
          const users = state.users.map((user) => {
            if (user.id === action.payload.id) {
              return { ...user, ...action.payload };
            }
            return user;
          });
          state.currentUser = action.payload;
          state.users = users;
        }
        state.loading = false;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.rejected, (state) => {
        state.error = 'Cannot update user';
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        if (action.payload instanceof AxiosError) {
          state.error = action.payload.message;
        } else {
          const users = state.users.map((user) => {
            if (user.id === action.payload.id) {
              return { ...user, ...action.payload };
            }
            return user;
          });
          state.currentUser = action.payload;
          state.users = users;
        }
        state.loading = false;
      })
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePassword.rejected, (state) => {
        state.error = 'Cannot update user';
      })
      .addCase(login.fulfilled, (state, action) => {
        if (action.payload instanceof AxiosError) {
          state.error = action.payload.message;
        } else {
          state.currentUser = action.payload;
        }
        state.loading = false;
      })
      .addCase(authenticate.fulfilled, (state, action) => {
        if (action.payload instanceof AxiosError) {
          state.error = action.payload.message;
        } else {
          state.currentUser = action.payload;
        }
        state.loading = false;
      })
      .addCase(logout, (state) => {
        state.currentUser = undefined;
        localStorage.removeItem('token');
      });
  },
});

const usersReducer = usersSlice.reducer;
export const { createUser, emptyUsersReducer, sortByEmail } =
  usersSlice.actions;
export default usersReducer;

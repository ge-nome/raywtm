import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import bcrypt from 'bcryptjs'
import { collection, getDocs, addDoc, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../firebase-config';  // Import the Firestore instance


// Define the interface for the Auth state
interface AuthState {
  token: string | null;
  user: string | null;
  department: number | null;
  departname: number | null;
  level: number | null;
  pf: string | null;
  phone: string | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  token: null,
  user: null,
  department: null,
  departname: null,
  level: null,
  pf: null,
  phone: null,
  loading: false,
  error: null,
};

// Async thunk for handling login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { userId: string; password: string }, { rejectWithValue }) => {
    
    //   const response = await axios.post('/api/login', credentials);
    // algo
    // fetch the email match from the db
    // Pick the password
    // compare it with the password
    // if true then pass data and token
    // else keep data and token empty
    const colRef = collection(db, 'users'); // Reference to your collection
    const departmentref = collection(db, "department");

    const q = query(colRef, where('pf', "==", credentials.userId));
    

    try {
      const querySnapshot = await getDocs(q); // Execute query
      if (querySnapshot.empty) {
        return rejectWithValue('Incorrect sign in details');
      }
      const result = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      const isMatch = bcrypt.compareSync(credentials.password, result[0].password)
      
      console.log(result[0]);
      
      if (isMatch) {
        const v = query(departmentref, where('id', "==", result[0].department));
        const qs = await getDocs(v);
        const results = qs.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        const response = {
          data:{
              token:'fdhkyufgvccvnvmkkjkl'+Math.floor(Math.random() * 100),
              user:result[0].name,
              department:result[0].department,
              departname:results[0].name,
              level:result[0].level,
              pf:result[0].pf,
              phone:result[0].phone,
          }
        };
        console.log(response.data);
        
        return response.data; // Assume the response contains { token, user }
      }
      else{
        return rejectWithValue('Incorrect sign in details');
      }
      

      
    } 
    catch (error: any) {
        return rejectWithValue(error.response.data);
      }
      
    //   console.log(response.data)
      
    
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ token: string; user: string; department: string;  departname: string; level: string; pf: string; phone: string }>) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.department = action.payload.department;
        state.level = action.payload.level;
        state.departname = action.payload.departname;
        state.pf = action.payload.pf;
        state.phone = action.payload.phone;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import { collection, getDocs, addDoc, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../firebase-config';  // Import the Firestore instance
import { createAsyncThunk } from '@reduxjs/toolkit'; 

const departref = collection(db, "users");
const departmentref = collection(db, "department");
const roleref = collection(db, "rassignments");

// Define the initial state
const initialState = {
    depart:[],
    roles:[],
    depName:[],
    allRoles:[],
    loading: false,
    error: null
};

    // Async thunk to fetch documents from Firestore
    export const fetchDocuments = createAsyncThunk('departSlice/fetchDocuments', async (department:any, { rejectWithValue }) => {
        const q = query(departref, where('department', '==', department));      
        try {
            const querySnapshot = await getDocs(q); // Execute query
            if (querySnapshot.empty) {
                return rejectWithValue('No department found');
            }
            const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            const sortedValues = documents.sort((a, b) => a.level - b.level);
            return sortedValues;  // Return the documents array to be dispatched
        }
        catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    });
    // Async thunk to fetch documents from Firestore
    export const fetchRoles = createAsyncThunk('departSlice/fetchRoles', async (cred: {pf:string; mod:number}, { rejectWithValue }) => {
        
        
        const q = query(roleref, where('pf', '==', cred.pf), where('resource', '==', cred.mod));      
        try {
            const querySnapshot = await getDocs(q); // Execute query
            if (querySnapshot.empty) {
                return [];
            }
            const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            const sortedValues = documents.sort((a, b) => a.id - b.id);
            console.log(sortedValues);
            
            return sortedValues[0];  // Return the documents array to be dispatched
        }
        catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    });
    export const fetchAllRoles = createAsyncThunk('departSlice/fetchAllRoles', async (cred: {pf:string}, { rejectWithValue }) => {
        
        
        const q = query(roleref, where('pf', '==', cred.pf));      
        try {
            const querySnapshot = await getDocs(q); // Execute query
            if (querySnapshot.empty) {
                return [];
            }
            const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            const sortedValues = documents.sort((a, b) => a.id - b.id);
            console.log(sortedValues);
            
            return sortedValues;  // Return the documents array to be dispatched
        }
        catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    });
    export const fetchdepName = createAsyncThunk('departSlice/fetchdepName', async (department:any, { rejectWithValue }) => {
 
        const q = query(departmentref, where('id', '==', department));      
        try {
            const querySnapshot = await getDocs(q); // Execute query
            if (querySnapshot.empty) {
                console.log('empty');
                
                return rejectWithValue('No department found');
            }
            const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            const sortedValues = documents.sort((a, b) => a.level - b.level);
            console.log(sortedValues);
            
            return sortedValues;  // Return the documents array to be dispatched

        }
        catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    });

// Create a slice
const departSlice = createSlice({
    name: 'depart',
    initialState,
    reducers: {
        addDocument: (state, action) => {
            state.depart.push(action.payload);
            console.log(action)
            const addItem = async () => {
                await addDoc(departref, action.payload);
            }
            addItem()
        },
        removeDocument: (state, action) => {
            state.depart = state.depart.filter(doc => doc.id !== action.payload);
        },
        updateDocument: (state, action) => {
            const { id, updatedData } = action.payload;
            const index = state.depart.findIndex(doc => doc.id === id);
            if (index !== -1) {
                state.depart[index] = { ...state.depart[index], ...updatedData };
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDocuments.pending, (state) => {
            state.loading = true; // Set loading to true when fetch starts
            })
            .addCase(fetchDocuments.fulfilled, (state, action) => {
            state.loading = false; // Stop loading when fetch is successful
            state.depart = action.payload; // Set the fetched documents
            })
            .addCase(fetchDocuments.rejected, (state, action) => {
            state.loading = false; // Stop loading if fetch fails
            state.error = action.error.message; // Capture the error message
            })

            .addCase(fetchRoles.pending, (state) => {
            state.loading = true; // Set loading to true when fetch starts
            })
            .addCase(fetchRoles.fulfilled, (state, action) => {
            state.loading = false; // Stop loading when fetch is successful
            state.roles = action.payload; // Set the fetched documents
            })
            .addCase(fetchRoles.rejected, (state, action) => {
            state.loading = false; // Stop loading if fetch fails
            state.error = action.error.message; // Capture the error message
            })
            .addCase(fetchAllRoles.pending, (state) => {
            state.loading = true; // Set loading to true when fetch starts
            })
            .addCase(fetchAllRoles.fulfilled, (state, action) => {
            state.loading = false; // Stop loading when fetch is successful
            state.allRoles = action.payload; // Set the fetched documents
            })
            .addCase(fetchAllRoles.rejected, (state, action) => {
            state.loading = false; // Stop loading if fetch fails
            state.error = action.error.message; // Capture the error message
            })
            .addCase(fetchdepName.pending, (state) => {
            state.loading = true; // Set loading to true when fetch starts
            })
            .addCase(fetchdepName.fulfilled, (state, action) => {
            state.loading = false; // Stop loading when fetch is successful
            state.depName = action.payload; // Set the fetched documents
            })
            .addCase(fetchdepName.rejected, (state, action) => {
            state.loading = false; // Stop loading if fetch fails
            state.error = action.error.message; // Capture the error message
            });
        },
    
});

// Export actions and reducer
export const { addDocument, removeDocument, updateDocument } = departSlice.actions;
export default departSlice.reducer;

// Link it such that that the HR can have access to all the file 
import { createSlice } from '@reduxjs/toolkit';
import { collection, getDocs, addDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../firebase-config';  // Import the Firestore instance
import { createAsyncThunk } from '@reduxjs/toolkit';

const outgoingref = collection(db, "outgoing");
const departref = collection(db, "department");

// Define the initial state
const initialState = {
    outgoing:[],
    depart:[],
    loading: false,
    error: null
}; 

    export const fetchDocuments = createAsyncThunk('outgoingSlice/fetchDocuments', async (department:any, { rejectWithValue }) => {
        const q = query(outgoingref, where('department', '==', department));
        console.log(department);
        
        try {
            const querySnapshot = await getDocs(q); // Execute query
            if (querySnapshot.empty) {
                return rejectWithValue('No department found');
            }
            const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

            const sortedValues = documents.sort((a, b) => b.index - a.index);
            console.log(sortedValues);
            
            return sortedValues;  // Return the documents array to be dispatched
        }
        catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    });
    export const fetchDeparts = createAsyncThunk('outgoingSlice/fetchDeparts', async (department:any, { rejectWithValue }) => {
        const q = query(departref);
        
        try {
            const querySnapshot = await getDocs(q); // Execute query
            if (querySnapshot.empty) {
                return [];
            }
            const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            const sortedValues = documents.sort((a, b) => b.index - a.index);
            const values = sortedValues.filter((item) =>
                item.id !== department
            );
            console.log(values);
            return values;  // Return the documents array to be dispatched
        }
        catch (error: any) {
            return error.response.data;
        }
    });

// Create a slice
const outgoingSlice = createSlice({
    name: 'outgoing',
    initialState,
    reducers: {
        addDocument: (state, action) => {
            state.outgoing.push(action.payload);
            console.log(action)
        },
        removeDocument: (state, action) => {
            state.outgoing = state.outgoing.filter(doc => doc.id !== action.payload);
        },
        updateDocument: (state, action) => {
            const { id, updatedData } = action.payload;
            const index = state.outgoing.findIndex(doc => doc.id === id);
            if (index !== -1) {
                state.outgoing[index] = { ...state.outgoing[index], ...updatedData };
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
            state.outgoing = action.payload; // Set the fetched documents
            })
            .addCase(fetchDocuments.rejected, (state, action) => {
            state.loading = false; // Stop loading if fetch fails
            state.error = action.error.message; // Capture the error message
            })
            .addCase(fetchDeparts.pending, (state) => {
            state.loading = true; // Set loading to true when fetch starts
            })
            .addCase(fetchDeparts.fulfilled, (state, action) => {
            state.loading = false; // Stop loading when fetch is successful
            state.depart = action.payload; // Set the fetched documents
            })
            .addCase(fetchDeparts.rejected, (state, action) => {
            state.loading = false; // Stop loading if fetch fails
            state.error = action.error.message; // Capture the error message
            });
        },
    
});

// Export actions and reducer
export const { addDocument, removeDocument, updateDocument } = outgoingSlice.actions;
export default outgoingSlice.reducer;

// Link it such that that the HR can have access to all the file 
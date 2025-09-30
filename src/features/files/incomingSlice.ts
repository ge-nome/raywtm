import { createSlice } from '@reduxjs/toolkit';
import { collection, getDocs, addDoc, orderBy,where, query } from 'firebase/firestore';
import { db } from '../../firebase-config';  // Import the Firestore instance
import { createAsyncThunk } from '@reduxjs/toolkit';

const incomingref = collection(db, "incoming");
const outgoingref = collection(db, "outgoing");

// Define the initial state
const initialState = {
    incoming:[],
    pending:[],
    loading: false,
    error: null
};

    export const fetchDocuments = createAsyncThunk('incomingSlice/fetchDocuments', async (department:any, { rejectWithValue }) => {
        const q = query(incomingref, where('department', '==', department));
        try {
            const querySnapshot = await getDocs(q); // Execute query
            if (querySnapshot.empty) {
                return rejectWithValue('No department found');
            }
            else{
                const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                const sortedValues = documents.sort((a, b) => b.index - a.index);
                console.log(sortedValues);
                return sortedValues; 
            }
        }
        catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    });
    export const pendingIncoming = createAsyncThunk('incomingSlice/pendingIncoming', async (department:any, { rejectWithValue }) => {
        console.log(department);
        
        const q = query(outgoingref, where('destination', '==', department));
        try {
            const querySnapshot = await getDocs(q); // Execute query
            if (querySnapshot.empty) {
                console.log('empty');
                return [];
            }
            else{
                const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                const sortedValues = documents.sort((a, b) => b.index - a.index);
                console.log(sortedValues);
                return sortedValues;  // Return the documents array to be dispatched
            }
            
        }
        catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    });
// Create a slice
const incomingSlice = createSlice({
    name: 'incoming',
    initialState,
    reducers: {
        addDocument: (state, action) => {
            state.incoming.push(action.payload);
            console.log(action)
        },
        removeDocument: (state, action) => {
            state.incoming = state.incoming.filter(doc => doc.id !== action.payload);
        },
        updateDocument: (state, action) => {
            const { id, updatedData } = action.payload;
            const index = state.incoming.findIndex(doc => doc.id === id);
            if (index !== -1) {
                state.incoming[index] = { ...state.incoming[index], ...updatedData };
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
            state.incoming = action.payload; // Set the fetched documents
            })
            .addCase(fetchDocuments.rejected, (state, action) => {
            state.loading = false; // Stop loading if fetch fails
            state.error = action.error.message; // Capture the error message
            })
            .addCase(pendingIncoming.pending, (state) => {
            state.loading = true; // Set loading to true when fetch starts
            })
            .addCase(pendingIncoming.fulfilled, (state, action) => {
            state.loading = false; // Stop loading when fetch is successful
            state.pending = action.payload; // Set the fetched documents
            })
            .addCase(pendingIncoming.rejected, (state, action) => {
            state.loading = false; // Stop loading if fetch fails
            state.error = action.error.message; // Capture the error message
            });
        },
    
});

// Export actions and reducer
export const { addDocument, removeDocument, updateDocument } = incomingSlice.actions;
export default incomingSlice.reducer;

// Link it such that that the HR can have access to all the file 
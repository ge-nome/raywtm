import { createSlice } from '@reduxjs/toolkit';
import { collection, getDocs, addDoc, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../firebase-config';  // Import the Firestore instance
import { createAsyncThunk } from '@reduxjs/toolkit'; 

const finindexrref = collection(db, "fileindex");

// Define the initial state
const initialState = {
    fileIndex:[],
    loading: false,
    error: null
};

    // Async thunk to fetch documents from Firestore
    
    export const fetchDocuments = createAsyncThunk('fileSlice/fetchDocuments', async (department:any, { rejectWithValue }) => {
        
        const q = query(finindexrref, where('department', '==', department));
        try {
            const querySnapshot = await getDocs(q); // Execute query
            if (querySnapshot.empty) {
                return rejectWithValue('No department found');
            }
            const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

            const sortedValues = documents.sort((a, b) => b.index - a.index);
            return sortedValues;  // Return the documents array to be dispatched
        }
        catch (error: any) {
            return rejectWithValue(error.response.data);
        }

    });

// Create a slice
const fileIndexSlice = createSlice({
    name: 'fileIndex',
    initialState,
    reducers: {
        addDocument: (state, action) => {
            state.fileIndex.push(action.payload);
            console.log(action)
            const addItem = async () => {
                await addDoc(finindexrref, action.payload);
            }
            addItem()
        },
        removeDocument: (state, action) => {
            state.fileIndex = state.fileIndex.filter(doc => doc.id !== action.payload);
        },
        updateDocument: (state, action) => {
            const { id, updatedData } = action.payload;
            const index = state.fileIndex.findIndex(doc => doc.id === id);
            if (index !== -1) {
                state.fileIndex[index] = { ...state.fileIndex[index], ...updatedData };
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
            state.fileIndex = action.payload; // Set the fetched documents
            })
            .addCase(fetchDocuments.rejected, (state, action) => {
            state.loading = false; // Stop loading if fetch fails
            state.error = action.error.message; // Capture the error message
            });
        },
    
});

// Export actions and reducer
export const { addDocument, removeDocument, updateDocument } = fileIndexSlice.actions;
export default fileIndexSlice.reducer;

// Link it such that that the HR can have access to all the file 
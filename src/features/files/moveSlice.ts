import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { collection, getDocs, addDoc, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase-config';  // Import the Firestore instance

const incomingref = collection(db, "incoming");

// Define the initial state
const initialState = {
    documents: [],
    loading:false,
    error:null
};

export const fetchDocuments = createAsyncThunk('data/fetchCombinedData',
  async (_, { rejectWithValue }) => {
    // const querySnapshot = await getDocs(query(incomingref, orderBy('id', 'desc')));  // Fetch from Firestore
    // const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Map docs
    // return documents;  // Return the documents array to be dispatched
    try {
        // Define the collections you want to fetch from
        const collectionNames = ['incoming', 'outgoing'];
  
        // Map through each collection and fetch documents
        const queries = collectionNames.map(async (name) => {
          const querySnapshot = await getDocs(query(collection(db, name), orderBy('id', 'desc')));
          return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        });
  
        // Wait for all queries to resolve
        const results = await Promise.all(queries);
  
        // Flatten results into a single array
        const combinedData = results.flat();
  
        console.log('jkjkhjgfgdfsdsffghg');
        
        return combinedData;
      } catch (error) {
        return rejectWithValue(error.message);
      }
   
});

// Create a slice
const documentSlice = createSlice({
    name: 'documents',
    initialState,
    reducers: {
        addDocument: (state, action) => {
            state.documents.push(action.payload);
        },
        removeDocument: (state, action) => {
            state.documents = state.documents.filter(doc => doc.id !== action.payload);
        },
        updateDocument: (state, action) => {
            const { id, updatedData } = action.payload;
            const index = state.documents.findIndex(doc => doc.id === id);
            if (index !== -1) {
                state.documents[index] = { ...state.documents[index], ...updatedData };
            }
        }
    },
    extraReducers: (builder) => {
        builder
          .addCase(fetchDocuments.pending, (state) => {
            state.loading = true;
          })
          .addCase(fetchDocuments.fulfilled, (state, action) => {
            state.loading = false;
            state.documents = action.payload;
          })
          .addCase(fetchDocuments.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          });
      },
});

// Export actions and reducer
export const { addDocument, removeDocument, updateDocument } = documentSlice.actions;
export default documentSlice.reducer;

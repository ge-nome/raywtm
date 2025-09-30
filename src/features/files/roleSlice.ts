import { createSlice } from '@reduxjs/toolkit';
import { collection, getDocs, addDoc, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../firebase-config';  // Import the Firestore instance
import { createAsyncThunk } from '@reduxjs/toolkit'; 

const usersref = collection(db, 'users')
const rolesref = collection(db, "roles");
const resourcesref = collection(db, "resources");
const rolesassref = collection(db, "rassignments");
// Define the initial state
const initialState = {
    staff:[],
    resources:[],
    assignment:[],
    loading: false,
    error: null
};

    // Async thunk to fetch documents from Firestore
    
    export const fetchDocuments = createAsyncThunk('roleSlice/fetchDocuments', async (department:any, { rejectWithValue }) => {
        // const querySnapshot = await getDocs(query(departref, orderBy('id', 'desc')));  // Fetch from Firestore
        // const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Map docs
        // return documents;  // Return the documents array to be dispatched
        // console.log(department);
        const q = query(usersref, where('department', '==', department));
        try {
            const querySnapshot = await getDocs(q); // Execute query
            
            if (querySnapshot.empty) {
                return rejectWithValue('No registered staff');
            }
            const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            const sortedValues = documents.sort((a, b) => a.level - b.level);

            return sortedValues;  // Return the documents array to be dispatched
        }
        catch (error: any) {
            return rejectWithValue(error.response.data);
        }

    });
    export const getResources = createAsyncThunk('roleSlice/getResources', async () => {
        const q = query(resourcesref, orderBy('name', 'asc'));
        try {
            const querySnapshot = await getDocs(q); // Execute query
            if (querySnapshot.empty) {
                return [];
            }
            const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            const sortedValues = documents.sort((a, b) => a.id - b.id);
            console.log(documents);
            
            return documents;  // Return the documents array to be dispatched
        }
        catch (error: any) {
            return [];
        }

    });
    export const getAssignments = createAsyncThunk('roleSlice/getAssignments', async (vals: { pfs: string; resource:string }, { rejectWithValue }) => {

        console.log(vals);
        
        const q = query(rolesassref, where('pf', '==', vals.pfs), where('resource', '==', vals.resource)); 

        try {
            const querySnapshot = await getDocs(q); // Execute query=
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

// Create a slice
const roleSlice = createSlice({
    name: 'roles',
    initialState,
    reducers: {
        addDocument: (state, action) => {
            state.staff.push(action.payload);
            console.log(action)
        },
        removeDocument: (state, action) => {
            state.staff = state.staff.filter(doc => doc.id !== action.payload);
        },
        updateDocument: (state, action) => {
            const { id, updatedData } = action.payload;
            const index = state.staff.findIndex(doc => doc.id === id);
            if (index !== -1) {
                state.staff[index] = { ...state.staff[index], ...updatedData };
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
            state.staff = action.payload; // Set the fetched documents
            })
            .addCase(fetchDocuments.rejected, (state, action) => {
            state.loading = false; // Stop loading if fetch fails
            state.error = action.error.message; // Capture the error message
            })

            .addCase(getResources.pending, (state) => {
            state.loading = true; // Set loading to true when fetch starts
            })
            .addCase(getResources.fulfilled, (state, action) => {
            state.loading = false; // Stop loading when fetch is successful
            state.resources = action.payload; // Set the fetched documents
            })
            .addCase(getResources.rejected, (state, action) => {
            state.loading = false; // Stop loading if fetch fails
            state.error = action.error.message; // Capture the error message
            })

            .addCase(getAssignments.pending, (state) => {
            state.loading = true; // Set loading to true when fetch starts
            })
            .addCase(getAssignments.fulfilled, (state, action) => {
            state.loading = false; // Stop loading when fetch is successful
            state.assignment = action.payload; // Set the fetched documents
            })
            .addCase(getAssignments.rejected, (state, action) => {
            state.loading = false; // Stop loading if fetch fails
            state.error = action.error.message; // Capture the error message
            });
        },
    
});

// Export actions and reducer
export const { addDocument, removeDocument, updateDocument } = roleSlice.actions;
export default roleSlice.reducer;

// Link it such that that the HR can have access to all the file 
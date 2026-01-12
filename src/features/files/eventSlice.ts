import { createSlice } from '@reduxjs/toolkit';
import { collection, getDoc, doc, getDocs, addDoc, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../firebase-config';  // Import the Firestore instance
import { createAsyncThunk } from '@reduxjs/toolkit'; 
import { getRelatedDocuments } from '../../helpers/fetchevents';

const event = collection(db, "events");
const organizers = collection(db, "organizers");
const speakers = collection(db, "speakers");
const partners = collection(db, "partners");

// Define the initial state
const initialState = {
    event:{},
    loading: false,
    error: null
};



    // Async thunk to fetch documents from Firestore
    export const fetchDocuments = createAsyncThunk(
  'documents/fetchDocuments',
  async ({ collectionPath, eventId }, { rejectWithValue }) => {   
    
    try {
      // 1. Get the event document
          const eventRef = doc(db, collectionPath, eventId);
          const eventSnap = await getDoc(eventRef);
          
          if (!eventSnap.exists()) {
            throw new Error('Event not found');
          }
          
          const eventData = eventSnap.data();
          
          // 2. Get organizers related to this event
          const organizers = await getRelatedDocuments('organizers', 'eventId', eventId);
          
          // 3. Get speakers related to this event
          const speakers = await getRelatedDocuments('speakers', 'eventId', eventId);
          
          // 4. Get partners related to this event
          const partners = await getRelatedDocuments('partners', 'eventId', eventId);

          const rsvp = await getRelatedDocuments('rsvp', 'eventId', eventId);
          console.log(rsvp);
          
          // 5. Format the data as requested
          const formattedData = {
            id: eventId,
            img: eventData.img || eventData.image || eventData.photo || '',
            title: eventData.title || eventData.name || '',
            date: eventData.date,
            venue: eventData.venue || eventData.location || eventData.place || '',
            rsvp: rsvp.length || 0,
            about: eventData.about || eventData.description || eventData.details || '',
            organizers: organizers.map((org, index) => ({
              id: index + 1,
              name: org.name || ''
            })),
            speakers: speakers.map((speaker, index) => ({
              id: index + 1,
              name: speaker.name || ''
            })),
            partners: partners.map((partner, index) => ({
              id: index + 1,
              name: partner.name ||  ''
            }))
          };
          console.log(formattedData);
          
          return formattedData;
      }
      catch (error) {
        console.log("Check your rules!");
      return rejectWithValue({
        message: error.message,
        code: error.code
      });
    }
  }
);

// Create a slice
const eventSlice = createSlice({
    name: 'event',
    initialState,
    reducers: {
        addDocument: (state, action) => {
            state.event.push(action.payload);
            console.log(action)
            const addItem = async () => {
                await addDoc(departref, action.payload);
            }
            addItem()
        },
        removeDocument: (state, action) => {
            state.event = state.event.filter(doc => doc.id !== action.payload);
        },
        updateDocument: (state, action) => {
            const { id, updatedData } = action.payload;
            const index = state.event.findIndex(doc => doc.id === id);
            if (index !== -1) {
                state.event[index] = { ...state.event[index], ...updatedData };
            }
        }
    },
    extraReducers: (builder) => {
  builder
    .addCase(fetchDocuments.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchDocuments.fulfilled, (state, action) => {
      state.loading = false;
      state.event = action.payload; // The returned data
    })
    .addCase(fetchDocuments.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message; // The error from rejectWithValue
    });
}
    
});


// Export actions and reducer
export const { addDocument, removeDocument, updateDocument } = departSlice.actions;
export default departSlice.reducer;

// Link it such that that the HR can have access to all the file 
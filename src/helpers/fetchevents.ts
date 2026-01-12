import { getFirestore, doc, collection, getDoc, query, where, getDocs } from 'firebase/firestore';

// Function to get event details with related data
async function getEventWithRelatedData(eventId) {
  const db = getFirestore();
  
  try {
    // 1. Get the event document
    const eventRef = doc(db, 'events', eventId);
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
    
    // 5. Format the data as requested
    const formattedData = {
      id: eventId,
      img: eventData.img || eventData.image || eventData.photo || '',
      title: eventData.title || eventData.name || '',
      date: formatDate(eventData.date || eventData.eventDate || eventData.startDate),
      venue: eventData.venue || eventData.location || eventData.place || '',
      rsvp: eventData.rsvp || eventData.registrationLink || '',
      about: eventData.about || eventData.description || eventData.details || '',
      organizers: organizers.map((org, index) => ({
        id: index + 1,
        name: org.name || org.organizerName || '',
        date: org.date ? formatDate(org.date) : formatDate(eventData.date)
      })),
      speakers: speakers.map((speaker, index) => ({
        id: index + 1,
        name: speaker.name || speaker.speakerName || '',
        date: speaker.date ? formatDate(speaker.date) : formatDate(eventData.date)
      })),
      partners: partners.map((partner, index) => ({
        id: index + 1,
        name: partner.name || partner.partnerName || '',
        date: partner.date ? formatDate(partner.date) : formatDate(eventData.date)
      }))
    };
    
    return formattedData;
    
  } catch (error) {
    console.error('Error fetching event data:', error);
    throw error;
  }
}

// Helper function to get documents related to an event
export const getRelatedDocuments = async (collectionName, fieldName, eventId) => {
  const db = getFirestore();
  
  try {
    const q = query(
      collection(db, collectionName),
      where(fieldName, '==', eventId)
    );
    
    const querySnapshot = await getDocs(q);
    const documents = [];
    
    querySnapshot.forEach((doc) => {
      documents.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return documents;
  } catch (error) {
    console.error(`Error fetching ${collectionName}:`, error);
    return [];
  }
}

// Helper function to format date as "9th Dec. 2024"
function formatDate(dateInput) {
  if (!dateInput) return '';
  
  let date;
  
  if (dateInput instanceof Date) {
    date = dateInput;
  } else if (typeof dateInput === 'string' || typeof dateInput === 'number') {
    date = new Date(dateInput);
  } else if (dateInput.toDate) {
    // Handle Firestore Timestamp
    date = dateInput.toDate();
  } else {
    return '';
  }
  
  if (isNaN(date.getTime())) return '';
  
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();
  
  // Add ordinal suffix to day
  const suffix = getOrdinalSuffix(day);
  
  return `${day}${suffix} ${month}. ${year}`;
}

// Helper function to get ordinal suffix (st, nd, rd, th)
function getOrdinalSuffix(day) {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

// Usage example
async function fetchEventData() {
  const eventId = 'your-event-id-here'; // Replace with actual event ID
  
  try {
    const eventData = await getEventWithRelatedData(eventId);
    console.log('Formatted event data:', eventData);
    return eventData;
  } catch (error) {
    console.error('Failed to fetch event data:', error);
  }
}

// Alternative: If your collections store document IDs in an array field
async function getEventWithRelatedDataByArray(eventId) {
  const db = getFirestore();
  
  try {
    // Get event document
    const eventRef = doc(db, 'events', eventId);
    const eventSnap = await getDoc(eventRef);
    
    if (!eventSnap.exists()) {
      throw new Error('Event not found');
    }
    
    const eventData = eventSnap.data();
    
    // If you store references in arrays (e.g., eventData.organizerIds = ['org1', 'org2'])
    const organizers = await getDocumentsByIds('organizers', eventData.organizerIds || []);
    const speakers = await getDocumentsByIds('speakers', eventData.speakerIds || []);
    const partners = await getDocumentsByIds('partners', eventData.partnerIds || []);
    
    // Format the data (same as above)
    // ... rest of the formatting code
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Helper function to get multiple documents by their IDs
async function getDocumentsByIds(collectionName, ids) {
  if (!ids || ids.length === 0) return [];
  
  const db = getFirestore();
  const documents = [];
  
  try {
    // Get documents one by one (or use Promise.all for parallel fetching)
    const promises = ids.map(async (id) => {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    });
    
    const results = await Promise.all(promises);
    return results.filter(doc => doc !== null);
  } catch (error) {
    console.error(`Error fetching ${collectionName} by IDs:`, error);
    return [];
  }
}

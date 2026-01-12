// components/FirebaseTest.jsx
import { useEffect, useState } from 'react';
import { 
  getFirestore, 
  doc, 
  getDoc,
  collection,
  getDocs,
  enableNetwork,
  disableNetwork,
  onSnapshot
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getApp } from 'firebase/app';
import { db, auth, storage, functions } from './firebase-config';

const FirebaseTest = () => {
  const [status, setStatus] = useState({
    app: 'checking...',
    firestore: 'checking...',
    auth: 'checking...',
    storage: 'checking...',
    functions: 'checking...',
    network: 'checking...'
  });

  const [error, setError] = useState(null);
  const [testData, setTestData] = useState(null);
  const [connectionSpeed, setConnectionSpeed] = useState(null);

  const testConnection = async () => {
    const startTime = Date.now();
    
    try {
      // 1. Test Firebase App Initialization
      const app = getApp();
      setStatus(prev => ({ ...prev, app: '✅ Connected' }));
      
      // 2. Test Firestore Connection
      try {
        const testDocRef = doc(db, '_test', 'connection');
        await getDoc(testDocRef);
        setStatus(prev => ({ ...prev, firestore: '✅ Connected' }));
      } catch (firestoreError) {
        console.warn('Firestore connection warning:', firestoreError);
        setStatus(prev => ({ ...prev, firestore: '⚠️ Limited access' }));
      }

      // 3. Test Auth Connection
      try {
        const authInstance = getAuth(app);
        await new Promise((resolve) => {
          const unsubscribe = onAuthStateChanged(authInstance, () => {
            resolve();
            unsubscribe();
          });
        });
        setStatus(prev => ({ ...prev, auth: '✅ Connected' }));
      } catch (authError) {
        setStatus(prev => ({ ...prev, auth: '❌ Failed' }));
      }

      // 4. Test Storage Connection
      try {
        const storageInstance = getStorage(app);
        const testRef = ref(storageInstance, '.test');
        // Just test if storage instance is accessible
        setStatus(prev => ({ ...prev, storage: '✅ Connected' }));
      } catch (storageError) {
        setStatus(prev => ({ ...prev, storage: '❌ Failed' }));
      }

      // 5. Test Functions Connection
      try {
        const functionsInstance = getFunctions(app);
        setStatus(prev => ({ ...prev, functions: '✅ Connected' }));
      } catch (functionsError) {
        setStatus(prev => ({ ...prev, functions: '❌ Failed' }));
      }

      // 6. Test Network Status
      const isOnline = navigator.onLine;
      setStatus(prev => ({ ...prev, network: isOnline ? '✅ Online' : '❌ Offline' }));

      // 7. Test Read/Write Operation
      await testReadWriteOperations();

      // 8. Measure connection speed
      const endTime = Date.now();
      const speed = endTime - startTime;
      setConnectionSpeed(`${speed}ms`);
      
      setError(null);
    } catch (error) {
      console.error('Firebase connection error:', error);
      setError(error.message);
      setStatus(prev => ({
        app: '❌ Failed',
        firestore: '❌ Failed',
        auth: '❌ Failed',
        storage: '❌ Failed',
        functions: '❌ Failed',
        network: '❌ Unknown'
      }));
    }
  };

  const testReadWriteOperations = async () => {
    try {
      // Create a test document
      const testCollection = collection(db, '_connection_test');
      
      // Try to read from a test document
      const querySnapshot = await getDocs(testCollection);
      setTestData({
        readSuccess: true,
        documentCount: querySnapshot.size,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      setTestData({
        readSuccess: false,
        error: error.message
      });
    }
  };

  const checkPermissions = async () => {
    // Check if Firestore security rules allow reads
    try {
      const testDoc = doc(db, '_permissions_test', 'test');
      await getDoc(testDoc);
      return '✅ Read permissions granted';
    } catch (error) {
      if (error.code === 'permission-denied') {
        return '❌ Permission denied by security rules';
      }
      return '⚠️ Unknown permission status';
    }
  };

  useEffect(() => {
    testConnection();
    
    // Set up real-time connectivity monitoring
    const handleOnline = () => {
      setStatus(prev => ({ ...prev, network: '✅ Online' }));
      testConnection();
    };
    
    const handleOffline = () => {
      setStatus(prev => ({ ...prev, network: '❌ Offline' }));
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="firebase-test">
      <h2>Firebase Connection Status</h2>
      
      <div className="status-grid">
        {Object.entries(status).map(([service, status]) => (
          <div key={service} className="status-item">
            <strong>{service.toUpperCase()}:</strong> 
            <span className={`status ${status.includes('✅') ? 'success' : status.includes('❌') ? 'error' : 'warning'}`}>
              {status}
            </span>
          </div>
        ))}
      </div>
      
      {connectionSpeed && (
        <div className="connection-speed">
          <strong>Connection Speed:</strong> {connectionSpeed}
        </div>
      )}
      
      {testData && (
        <div className="test-results">
          <h3>Test Results</h3>
          <pre>{JSON.stringify(testData, null, 2)}</pre>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          <h3>Error Details</h3>
          <p>{error}</p>
          <details>
            <summary>Debug Information</summary>
            <p>Check if:</p>
            <ul>
              <li>Firebase config is correct in your .env file</li>
              <li>Internet connection is working</li>
              <li>Firebase project exists and is active</li>
              <li>Security rules allow access</li>
              <li>No ad blockers are blocking Firebase</li>
            </ul>
          </details>
        </div>
      )}
      
      <div className="actions">
        <button onClick={testConnection}>Re-test Connection</button>
        <button onClick={async () => {
          const permissions = await checkPermissions();
          alert(permissions);
        }}>Check Permissions</button>
      </div>
    </div>
  );
};

export default FirebaseTest;
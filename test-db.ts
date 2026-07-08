import { initializeApp } from 'firebase/app';
import { initializeFirestore, collection, getDocs } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const databaseId = (firebaseConfig as any).firestoreDatabaseId || '(default)';
const db = initializeFirestore(app, {}, databaseId);

async function run() {
  const querySnapshot = await getDocs(collection(db, 'products'));
  console.log(`There are currently ${querySnapshot.size} products in the database.`);
  querySnapshot.docs.forEach(doc => {
    console.log(`- ${doc.id}: ${doc.data().name}`);
  });
}

run();

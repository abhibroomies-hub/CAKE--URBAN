import { initializeApp } from 'firebase/app';
import { initializeFirestore, collection, getDocs, deleteDoc, doc, setDoc } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const databaseId = (firebaseConfig as any).firestoreDatabaseId || '(default)';
const db = initializeFirestore(app, {}, databaseId);

async function run() {
  console.log("Emptying products collection from Firestore...");
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    let count = 0;
    for (const d of querySnapshot.docs) {
      await deleteDoc(doc(db, 'products', d.id));
      count++;
    }
    console.log(`Deleted ${count} products.`);

    // Persist disabling of auto-seeding
    await setDoc(doc(db, 'settings', 'autoseed'), { disabled: true }, { merge: true });
    console.log("Auto-seeding successfully disabled in Firestore settings.");
    process.exit(0);
  } catch (err) {
    console.error("Error clearing database:", err);
    process.exit(1);
  }
}

run();

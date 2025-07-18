import { Client, Databases, ID, Query } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client()
  .setEndpoint('https://syd.cloud.appwrite.io/v1')
  .setProject(PROJECT_ID)

const database = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
const normalizedTerm = searchTerm.trim().toLowerCase();
//   1. Use Appwrite SDK to check if the search term exists in the database
 try {
  const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
    Query.equal('searchTerm', normalizedTerm),
  ])

// 2. If it does, update the count
  if(result.documents.length > 0) {
   const doc = result.documents[0];

   await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
    count: doc.count + 1,
   })
  // 3. If it doesn't, create a new document with the search term and count as 1
  } else {
   await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
    searchTerm: normalizedTerm,
    count: 1,
    movie_id: movie.id,
    poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
   })
  }
 } catch (error) {
  console.error('Error updating search count:', error);
 }


 //TEST SECTION FOR API FETCH FIXES

//   try {
//     const res = await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
//       searchTerm: "test",
//       count: 1,
//       movie_id: 999,
//       poster_url: "https://image.tmdb.org/t/p/w500/test.jpg"
//     });
//     console.log("Manually created doc:", res);
//   } catch (err) {
//     console.error("Manual create error:", err.message || err);
//     alert("Create failed: " + err.message);
//   }


 //TEST SECTION FOR API FETCH FIXES

//   try {
//     const res = await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
//       searchTerm: "batman",
//       count: 1,
//       movie_id: 12345,
//       poster_url: "https://image.tmdb.org/t/p/w500/test.jpg"
//     });
//     alert('✅ Static doc created: ' + res.$id);
//   } catch (err) {
//     alert('❌ Failed: ' + err.message);
//     console.error(err);
//   }

};
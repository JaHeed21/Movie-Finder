// netlify/functions/updateSearchCount.js

import { Client, Databases, ID, Query } from 'appwrite';

const client = new Client()
  .setEndpoint('https://syd.cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID); // from env

const database = new Databases(client);

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  try {
    const { searchTerm, movie } = JSON.parse(event.body);
    const normalizedTerm = searchTerm.trim().toLowerCase();

    const result = await database.listDocuments(
      process.env.VITE_APPWRITE_DATABASE_ID,
      process.env.VITE_APPWRITE_COLLECTION_ID,
      [Query.equal('searchTerm', normalizedTerm)]
    );

    if (result.documents.length > 0) {
      const doc = result.documents[0];
      await database.updateDocument(
        process.env.VITE_APPWRITE_DATABASE_ID,
        process.env.VITE_APPWRITE_COLLECTION_ID,
        doc.$id,
        { count: doc.count + 1 }
      );
    } else {
      await database.createDocument(
        process.env.VITE_APPWRITE_DATABASE_ID,
        process.env.VITE_APPWRITE_COLLECTION_ID,
        ID.unique(),
        {
          searchTerm: normalizedTerm,
          count: 1,
          movie_id: movie.id,
          poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        }
      );
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Search count updated' }),
    };
  } catch (error) {
    console.error('Serverless Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
}

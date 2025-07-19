export const updateSearchCount = async (searchTerm, movie) => {
  try {
    const response = await fetch('/.netlify/functions/updateSearchCount', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ searchTerm, movie }),
    });

    const result = await response.json();
    console.log('Serverless result:', result);
  } catch (error) {
    console.error('Serverless update error:', error);
  }
};

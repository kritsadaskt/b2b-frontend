const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': 'https://asw-partners.netlify.app',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Credentials': 'true',
      },
      body: '',
    };
  }

  try {
    // Get the endpoint from the URL path
    const path = event.path.replace('/.netlify/functions/api-proxy/', '');
    const apiUrl = `https://api.assetwise.co.th/${path}`;

    // Prepare headers
    const headers = {
      'Content-Type': event.headers['content-type'] || 'application/json',
      'Authorization': event.headers.authorization || 'Basic c3VwbGllcjpzdXBsaWVyQDIwMjU=',
    };

    // Prepare request options
    const requestOptions = {
      method: event.httpMethod,
      headers,
    };

    // Add body for POST/PUT requests
    if (event.body && ['POST', 'PUT', 'PATCH'].includes(event.httpMethod)) {
      requestOptions.body = event.body;
    }

    // Make the request to the actual API
    const response = await fetch(apiUrl, requestOptions);
    const data = await response.text();

    // Return the response with CORS headers
    return {
      statusCode: response.status,
      headers: {
        'Access-Control-Allow-Origin': 'https://asw-partners.netlify.app',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': response.headers.get('content-type') || 'application/json',
      },
      body: data,
    };
  } catch (error) {
    console.error('Proxy error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': 'https://asw-partners.netlify.app',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

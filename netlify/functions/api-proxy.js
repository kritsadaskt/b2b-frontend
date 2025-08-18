const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  console.log('Function called with:', {
    method: event.httpMethod,
    path: event.path,
    headers: event.headers,
    body: event.body
  });

  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Credentials': 'true',
      },
      body: '',
    };
  }

  try {
    // Get the endpoint from the URL path
    let path = event.path;
    
    // Remove the function path prefix
    if (path.startsWith('/.netlify/functions/api-proxy/')) {
      path = path.replace('/.netlify/functions/api-proxy/', '');
    } else if (path.startsWith('/api-proxy/')) {
      path = path.replace('/api-proxy/', '');
    }
    
    // Remove leading slash if present
    path = path.replace(/^\//, '');
    
    const apiUrl = `https://api.assetwise.co.th/${path}`;
    console.log('Proxying to:', apiUrl);

    // Prepare headers
    const headers = {
      'Content-Type': event.headers['content-type'] || 'application/json',
      'Authorization': event.headers.authorization || 'Basic c3VwbGllcjpzdXBsaWVyQDIwMjU=',
      'User-Agent': 'Netlify-Function-Proxy/1.0',
    };

    // Prepare request options
    const requestOptions = {
      method: event.httpMethod,
      headers,
      timeout: 10000, // 10 second timeout
    };

    // Add body for POST/PUT requests
    if (event.body && ['POST', 'PUT', 'PATCH'].includes(event.httpMethod)) {
      requestOptions.body = event.body;
      console.log('Request body:', event.body);
    }

    console.log('Making request with options:', {
      url: apiUrl,
      method: requestOptions.method,
      headers: requestOptions.headers
    });

    // Make the request to the actual API
    const response = await fetch(apiUrl, requestOptions);
    const data = await response.text();
    
    console.log('API response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      dataLength: data.length
    });

    // Return the response with CORS headers
    return {
      statusCode: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': response.headers.get('content-type') || 'application/json',
        'Cache-Control': 'no-cache',
      },
      body: data,
    };
  } catch (error) {
    console.error('Proxy error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message,
        timestamp: new Date().toISOString()
      }),
    };
  }
};

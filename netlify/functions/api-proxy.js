// Use Node 18+ global fetch

exports.handler = async (event, _context) => {
	try {
		// Handle CORS preflight
		if (event.httpMethod === 'OPTIONS') {
			return {
				statusCode: 200,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
					'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
					'Access-Control-Allow-Credentials': 'true',
				},
				body: '',
			};
		}

		// Derive API path (strip function prefix)
		let path = event.path || '';
		if (path.startsWith('/.netlify/functions/api-proxy/')) {
			path = path.replace('/.netlify/functions/api-proxy/', '');
		} else if (path.startsWith('/api-proxy/')) {
			path = path.replace('/api-proxy/', '');
		}
		path = path.replace(/^\//, '');

		// Append query string if present
		const qsObj = event.queryStringParameters || {};
		const qs = Object.keys(qsObj).length
			? '?' + new URLSearchParams(qsObj).toString()
			: '';

		const apiUrl = `https://api.assetwise.co.th/${path}${qs}`;

		// Prepare headers: forward most incoming headers
		const incoming = event.headers || {};
		const headers = new Headers();
		// Preserve content-type if present
		if (incoming['content-type']) headers.set('Content-Type', incoming['content-type']);
		// Forward Authorization or fallback to Basic
		headers.set(
			'Authorization',
			incoming['authorization'] || 'Basic c3VwbGllcjpzdXBsaWVyQDIwMjU='
		);
		// Optional: forward user-agent
		headers.set('User-Agent', incoming['user-agent'] || 'Netlify-Function-Proxy/1.0');

		// Body handling (supports base64-encoded bodies)
		let body = undefined;
		const method = event.httpMethod || 'GET';
		if (event.body && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
			body = event.isBase64Encoded
				? Buffer.from(event.body, 'base64')
				: event.body;
		}

		const response = await fetch(apiUrl, {
			method,
			headers,
			body,
		});

		const text = await response.text();
		const contentType = response.headers.get('content-type') || 'application/json';

		return {
			statusCode: response.status,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
				'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
				'Access-Control-Allow-Credentials': 'true',
				'Content-Type': contentType,
				'Cache-Control': 'no-cache',
			},
			body: text,
		};
	} catch (error) {
		return {
			statusCode: 500,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				error: 'Internal server error',
				message: error?.message || String(error),
				timestamp: new Date().toISOString(),
			}),
		};
	}
};

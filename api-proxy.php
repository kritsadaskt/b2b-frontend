<?php
/**
 * API Proxy - Forwards requests to api.assetwise.co.th to avoid CORS issues.
 * Place this file in the same origin as your frontend (e.g. web root).
 *
 * Usage: api-proxy.php?path=Suplier/GetSuplier
 * Or:    api-proxy.php?path=Suplier/SaveSuplier (POST with JSON body)
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Configuration
$API_BASE = 'https://api.assetwise.co.th/api/';
$AUTH_HEADER = 'Basic c3VwbGllcjpzdXBsaWVyQDIwMjU=';

// Allowed path prefix - restrict to Suplier endpoints
$ALLOWED_PREFIX = 'Suplier/';

// Get path from query parameter
$path = isset($_GET['path']) ? trim($_GET['path'], '/') : '';

if (empty($path)) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing path parameter. Use ?path=Suplier/GetSuplier']);
    exit;
}

// Validate path: must start with allowed prefix and use only safe characters
if (strpos($path, $ALLOWED_PREFIX) !== 0) {
    http_response_code(403);
    echo json_encode(['error' => 'Path not allowed']);
    exit;
}

if (!preg_match('/^[a-zA-Z0-9\/_\-]+$/', $path)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid path characters']);
    exit;
}

$targetUrl = rtrim($API_BASE, '/') . '/' . $path;

// Build headers to forward
$headers = [
    'Authorization: ' . $AUTH_HEADER,
    'Content-Type: ' . ($_SERVER['CONTENT_TYPE'] ?? 'application/json'),
];

// Forward request
$ch = curl_init($targetUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $_SERVER['REQUEST_METHOD']);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

$method = $_SERVER['REQUEST_METHOD'];
if (in_array($method, ['POST', 'PUT', 'PATCH'])) {
    $body = file_get_contents('php://input');
    curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
}

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($response === false) {
    http_response_code(502);
    echo json_encode([
        'error' => 'Proxy request failed',
        'detail' => $curlError ?: 'Unknown error',
    ]);
    exit;
}

http_response_code((int) $httpCode);
echo $response;

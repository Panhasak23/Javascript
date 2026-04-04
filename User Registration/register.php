<?php
header('Content-Type: application/json');

require_once 'db.php';

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Read and decode JSON body
$data = json_decode(file_get_contents('php://input'), true);

$username = isset($data['username']) ? trim($data['username']) : '';
$email    = isset($data['email'])    ? trim($data['email'])    : '';
$password = isset($data['password']) ? $data['password'] : ''; // intentionally not trimmed – spaces are valid in passwords

// Server-side validation
if ($username === '' || $email === '' || $password === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

if (strlen($username) < 3) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Username must be at least 3 characters']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit;
}

if (strlen($password) < 6) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters']);
    exit;
}

$conn = getConnection();

// Check for duplicate username or email
$stmt = $conn->prepare('SELECT id FROM users WHERE username = ? OR email = ?');
$stmt->bind_param('ss', $username, $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    $stmt->close();
    $conn->close();
    http_response_code(409);
    echo json_encode(['success' => false, 'message' => 'Username or email already exists']);
    exit;
}
$stmt->close();

// Hash the password before storing
$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

// Insert the new user
$stmt = $conn->prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)');
$stmt->bind_param('sss', $username, $email, $hashedPassword);

if ($stmt->execute()) {
    $stmt->close();
    $conn->close();
    echo json_encode(['success' => true, 'message' => 'Account created successfully!']);
} else {
    $errorDetail = $stmt->error;
    $stmt->close();
    $conn->close();
    error_log('Registration INSERT failed: ' . $errorDetail);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to create account. Please try again.']);
}

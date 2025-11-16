<?php
include 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $confirmPassword = $_POST['confirmPassword'];
    $gender = $_POST['gender'];
    $dobMonth = $_POST['dobMonth'];
    $dobDay = $_POST['dobDay'];
    $dobYear = $_POST['dobYear'];

    if ($password !== $confirmPassword) {
        die("Passwords do not match.");
    }

    // Hash the password before saving (security)
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Combine DOB fields into one date
    $dob = "$dobYear-$dobMonth-$dobDay";

    $sql = "INSERT INTO users (name, email, password, gender, dob) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssss", $name, $email, $hashedPassword, $gender, $dob);

    if ($stmt->execute()) {
        echo "Signup successful! <a href='login.html'>Go to Login</a>";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}
?>
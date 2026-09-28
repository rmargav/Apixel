<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // 🛑 1. PUT YOUR CLIENT'S EMAIL HERE (Where you want to receive messages)
    $to = "davies@gmail.com"; 

    // 🛑 2. PUT A DOMAIN EMAIL HERE TO AVOID SPAM FILTERS (e.g., info@yourwebsite.com)
    $from_email = "info@yourdomain.com";

    // Collect form data (Matching the 'name' attributes in your HTML)
    $name = strip_tags(trim($_POST["name"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $interest = isset($_POST["interest"]) ? strip_tags(trim($_POST["interest"])) : "Not specified";
    $budget = isset($_POST["budget"]) ? strip_tags(trim($_POST["budget"])) : "Not specified";
    $details = strip_tags(trim($_POST["details"]));

    $subject = "New Project Inquiry from " . $name;

    // Email content (HTML Format)
    $body = "
    <h2>New Website Inquiry</h2>
    <p><strong>Name:</strong> $name</p>
    <p><strong>Email:</strong> $email</p>
    <p><strong>Interested In:</strong> $interest</p>
    <p><strong>Budget:</strong> $budget</p>
    <p><strong>Project Details:</strong><br>" . nl2br($details) . "</p>
    ";

    // Headers
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8\r\n";
    
    // Using a domain email prevents hosting providers from blocking the message
    $headers .= "From: Website Form <$from_email>\r\n";
    
    // This allows you to hit 'Reply' and email the user directly
    $headers .= "Reply-To: $email\r\n";

    // Send mail and redirect
    if(mail($to, $subject, $body, $headers)) {
        header("Location: index.html?status=success");
        exit();
    } else {
        header("Location: index.html?status=error");
        exit();
    }
}
?>

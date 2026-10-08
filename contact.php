<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Replace this with your business email address
    $to = "info@apixelfilm.com"; 
    
    // Sanitize and capture form inputs
    $name = strip_tags(trim($_POST["name"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $interest = isset($_POST["interest"]) ? trim($_POST["interest"]) : "Not specified";
    $budget = isset($_POST["budget"]) ? trim($_POST["budget"]) : "Not specified";
    $details = strip_tags(trim($_POST["details"]));

    // Validation
    if (empty($name) || empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo "Please complete the form and try again.";
        exit;
    }

    // Email Subject
    $subject = "New Project Inquiry from $name";

    // Email Content
    $email_content = "Name: $name\n";
    $email_content .= "Email: $email\n\n";
    $email_content .= "Interested In: $interest\n";
    $email_content .= "Budget: $budget\n\n";
    $email_content .= "Project Details:\n$details\n";

    // Email Headers
    $headers = "From: $name <$email>\r\n";
    $headers .= "Reply-To: $email\r\n";

    // Send the email
    if (mail($to, $subject, $email_content, $headers)) {
        // Success: Redirect back to the website with a success query parameter
        header("Location: index.html?status=success");
        exit;
    } else {
        http_response_code(500);
        echo "Oops! Something went wrong and we couldn't send your message.";
    }
} else {
    // Reject direct access to the PHP file
    http_response_code(403);
    echo "There was a problem with your submission, please try again.";
}
?>
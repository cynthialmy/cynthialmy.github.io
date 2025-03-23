// JavaScript for handling download form submission
document.addEventListener("DOMContentLoaded", function () {
	const contactForm = document.getElementById("contact-form");

	if (contactForm) {
		contactForm.addEventListener("submit", function (e) {
			e.preventDefault();

			const nameField = document.getElementById("name");
			const emailField = document.getElementById("email");

			// Validate inputs
			if (!nameField.value || !emailField.value) {
				alert("Please fill in all required fields");
				return;
			}

			// Send form data to email service
			const formData = new FormData();
			formData.append("name", nameField.value);
			formData.append("email", emailField.value);
			formData.append("subject", "Resume Download Notification");
			formData.append(
				"message",
				`${nameField.value} (${emailField.value}) has downloaded your resume/reference materials.`
			);

			// Use EmailJS to send notification
			// Replace the following with your actual EmailJS ids:
			// YOUR_SERVICE_ID - The EmailJS service ID (e.g., 'gmail')
			// YOUR_TEMPLATE_ID - The EmailJS template ID
			// YOUR_USER_ID - Your EmailJS user ID (same as in emailjs.html)
			emailjs
				.sendForm(
					"service_pfi5g28",
					"template_xpqunbs",
					contactForm,
					"kn0PEkA1mPOac3eLj"
				)
				.then(
					function () {
						// Show download links
						document.getElementById(
							"download-links"
						).style.display = "block";

						// Optionally hide the form
						contactForm.style.display = "none";

						// Store in localStorage to remember this user
						localStorage.setItem("downloadFormSubmitted", "true");
						localStorage.setItem("visitorName", nameField.value);
						localStorage.setItem("visitorEmail", emailField.value);
					},
					function (error) {
						console.error("Error sending email:", error);

						// Show download links anyway in case of email error
						document.getElementById(
							"download-links"
						).style.display = "block";
					}
				);
		});
	}

	// Check if user has already filled out the form
	if (localStorage.getItem("downloadFormSubmitted") === "true") {
		if (contactForm) contactForm.style.display = "none";
		const downloadLinks = document.getElementById("download-links");
		if (downloadLinks) downloadLinks.style.display = "block";
	}
});

---
layout: page
title: Cynthia Mengyuan Li
subtitle: Product Manager & more
---

I am a Product Manager with a passion for leveraging data to drive business growth.

I specialize in delivering **scalable data platforms**, **AI-enhanced solutions**, and **developer tools** that drive operational efficiency, improve data integrity, and enable real-time insights.

With experience spanning Electric Vehicles, Smart City Infrastructures, FinTech, and E-commerce, I have led teams to develop robust platforms, streamline data pipelines, and enhance analytics capabilities.

---

### Education

#### Georgia Institute of Technology
- *MSc. in Computer Science* & *MSc. in Structural Engineering*, GPA: 3.8/4.0
>  Atlanta, GA

#### Hong Kong University of Science and Technology
- *Bachelor of Engineering (B.Eng.), Structural Engineering and Computer Science*, Honors
> Hong Kong

#### Waseda University
- Exchange Student
> Tokyo, Japan

#### University of New South Wales
- Exchange Student
> Sydney, Australia

#### Awards & Honors
- Gold Award of 2014-2015 President's Cup of Hong Kong University of Science and Technology
- HKSAR Government Scholarship Fund - Reaching Out Award
- Ranked 78th out of 250,000 students in Province (top 0.03%) in the Gaokao (China's Nationwide Unified Exam for Universities)
- Awarded the 2nd Prize in the Chinese Physics Olympiad (CPhO)
- Received the 3rd Prize in the National High School Biology Competition

---

### Certifications
- AWIT Product Management Professional Specialization (2024)
- MBA Essentials @UofGlasgow (2024)
- IIBA Certified Product Manager (2023)
- Develop GenAI Solutions with Azure OpenAI (2023)
- SAP BTP Certified Developer (2022)

---

## Download My Resume & References

Please fill out this quick form to download my resume and reference letters:

<div class="form-container">
  <form id="download-form" action="https://formspree.io/f/mvgkaebd" method="POST">
    <div class="form-group">
      <label for="name">Name:</label>
      <input type="text" name="name" id="name" required>
    </div>
    <div class="form-group">
      <label for="email">Email:</label>
      <input type="email" name="email" id="email" required>
    </div>
    <div class="form-group">
      <label for="company">Company/Organization (optional):</label>
      <input type="text" name="company" id="company">
    </div>
    <div class="form-group">
      <label for="purpose">Purpose of Download:</label>
      <select name="purpose" id="purpose" required>
        <option value="" disabled selected>Select a reason</option>
        <option value="job_opportunity">Job Opportunity</option>
        <option value="networking">Professional Networking</option>
        <option value="collaboration">Potential Collaboration</option>
        <option value="other">Other</option>
      </select>
    </div>
    <div class="form-group">
      <input type="hidden" name="_subject" value="New Resume Download Request">
      <input type="hidden" name="_next" value="thank-you-page-url-if-you-have-one">
      <button type="submit" id="submit-form">Submit</button>
    </div>
  </form>
</div>

<div id="download-links" style="display:none;">
  <p>Thank you for your interest! You can now download the following documents:</p>
  <ul>
    <li><a href="resources/Cynthia_Li_resume.pdf" target="_blank">Cynthia's Resume</a></li>
    <li><a href="resources/reference_letters.pdf" target="_blank">Reference Letters</a></li>
  </ul>
</div>

<style>
.form-container {
  max-width: 500px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 5px;
  margin-bottom: 20px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}
.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}
.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: white;
}
button {
  background-color: #4a89dc;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}
button:hover {
  background-color: #3a7bd5;
}
</style>

<script>
  document.getElementById('download-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const form = this;
    const formData = new FormData(form);

    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        // Show the download links
        document.getElementById('download-form').style.display = 'none';
        document.getElementById('download-links').style.display = 'block';
        return response.json();
      }
      throw new Error('Network response was not ok.');
    })
    .catch(error => {
      console.error('Error:', error);
      alert('There was a problem with your submission. Please try again.');
    });
  });
</script>

## Chat?

Interested in discussing data platform strategies, scalable pipelines, or just curious about tech? Let's connect!

- **Calendly:** [Book a Chat](https://calendly.com/cynthiali/30min)
- **LinkedIn:** [Connect with Me](https://www.linkedin.com/in/mengyuan-li-cynthia/)

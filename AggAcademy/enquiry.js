document.addEventListener('DOMContentLoaded', () => {
    const db = firebase.database();
    const submitEnquiryBtn = document.getElementById('submitEnquiryBtn');
    const courseSelect = document.getElementById('enquiryCourse');

    // Load Courses
    db.ref('courses').on('value', (snapshot) => {
        courseSelect.innerHTML = '<option value="">Select Course</option>';
        snapshot.forEach(child => {
            const course = child.val();
            const option = document.createElement('option');
            option.value = child.key;
            option.textContent = course.name;
            courseSelect.appendChild(option);
        });
    });

    // Submit Enquiry
    submitEnquiryBtn.addEventListener('click', () => {
        const enquiry = {
            name: document.getElementById('enquiryName').value.trim(),
            email: document.getElementById('enquiryEmail').value.trim(),
            phone: document.getElementById('enquiryPhone').value.trim(),
            courseId: document.getElementById('enquiryCourse').value,
            courseName: document.getElementById('enquiryCourse').selectedOptions[0].text,
            message: document.getElementById('enquiryMessage').value.trim(),
            createdAt: new Date().toISOString()
        };

        if (!enquiry.name || !enquiry.email) {
            showError('Name and Email are required');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiry.email)) {
            showError('Invalid email format');
            return;
        }

        db.ref('enquiries/' + Date.now()).set(enquiry, (error) => {
            if (error) {
                showError('Failed to submit enquiry');
            } else {
                showSuccess('Enquiry submitted successfully');
                document.querySelectorAll('input, select, textarea').forEach(input => input.value = '');
            }
        });
    });
});
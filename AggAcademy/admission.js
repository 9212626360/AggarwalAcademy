document.addEventListener('DOMContentLoaded', () => {
    // Check if required utilities are available
    if (typeof showError !== 'function' || typeof showSuccess !== 'function') {
        console.error('Utility functions (showError, showSuccess) are not defined. Ensure utils.js is loaded.');
        showError('System error: Utility functions not loaded.');
        return;
    }

    // Check Firebase initialization
    if (!firebase.apps.length) {
        console.error('Firebase not initialized.');
        showError('Firebase not initialized. Please check configuration.');
        return;
    }

    const db = firebase.database();
    const submitAdmissionBtn = document.getElementById('submitAdmissionBtn');
    const courseSelect = document.getElementById('admissionCourse');

    // Load Courses into Dropdown
    db.ref('courses').on('value', (snapshot) => {
        courseSelect.innerHTML = '<option value="">Select Course</option>';
        snapshot.forEach(child => {
            const course = child.val();
            const option = document.createElement('option');
            option.value = child.key;
            option.textContent = course.name;
            courseSelect.appendChild(option);
        });
    }, (error) => {
        console.error('Failed to load courses for dropdown:', error);
        showError('Failed to load courses for dropdown.');
    });

    // Submit Admission
    submitAdmissionBtn.addEventListener('click', () => {
        const admission = {
            name: document.getElementById('admissionName').value.trim(),
            email: document.getElementById('admissionEmail').value.trim(),
            phone: document.getElementById('admissionPhone').value.trim(),
            courseId: document.getElementById('admissionCourse').value,
            courseName: document.getElementById('admissionCourse').selectedOptions[0].text,
            religion: document.getElementById('admissionReligion').value.trim(),
            qualification: document.getElementById('admissionQualification').value.trim(),
            createdAt: new Date().toISOString(),
            status: 'active'
        };

        if (!admission.name || !admission.email || !admission.courseId) {
            showError('Name, Email, and Course are required');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(admission.email)) {
            showError('Invalid email format');
            return;
        }

        db.ref('students/' + Date.now()).set(admission, (error) => {
            if (error) {
                console.error('Failed to submit admission:', error);
                showError('Failed to submit admission');
            } else {
                showSuccess('Admission submitted successfully');
                document.querySelectorAll('input, select').forEach(input => input.value = '');
                db.ref(`courses/${admission.courseId}/studentCount`).transaction(count => (count || 0) + 1);
            }
        });
    });
});
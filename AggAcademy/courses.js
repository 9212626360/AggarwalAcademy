document.addEventListener('DOMContentLoaded', () => {
    // Check if required utilities are available
    if (typeof formatCurrency !== 'function' || typeof showSuccess !== 'function' || typeof showError !== 'function') {
        console.error('Utility functions (formatCurrency, showSuccess, showError) are not defined. Ensure utils.js is loaded.');
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
    const courseTable = document.getElementById('courseTable');
    const addCourseBtn = document.getElementById('addCourseBtn');

    // Demo Courses
    const demoCourses = [
        { name: "Basic Typing", duration: 3, fees: 3000, studentCount: 0 },
        { name: "Advanced Typing", duration: 6, fees: 5000, studentCount: 0 },
        { name: "Speed Typing", duration: 4, fees: 4000, studentCount: 0 }
    ];

    demoCourses.forEach((course, index) => {
        db.ref('courses/course' + index).set(course, (error) => {
            if (error) console.error('Failed to add demo course:', error);
        });
    });

    // Load Courses
    function loadCourses() {
        db.ref('courses').on('value', (snapshot) => {
            courseTable.innerHTML = '';
            snapshot.forEach((child) => {
                const course = child.val();
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="p-3">${course.name}</td>
                    <td class="p-3">${course.duration || '-'} months</td>
                    <td class="p-3">${formatCurrency(course.fees)}</td>
                    <td class="p-3">
                        <button class="text-red-600 hover:text-red-800" onclick="deleteCourse('${child.key}')"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                courseTable.appendChild(row);
            });
        }, (error) => {
            console.error('Failed to load courses:', error);
            showError('Failed to load courses.');
        });
    }

    // Add Course
    addCourseBtn.addEventListener('click', () => {
        const course = {
            name: document.getElementById('courseName').value.trim(),
            duration: parseInt(document.getElementById('courseDuration').value) || 0,
            fees: parseInt(document.getElementById('courseFees').value) || 0,
            studentCount: 0
        };

        if (!course.name || !course.fees) {
            showError('Course Name and Fees are required');
            return;
        }

        db.ref('courses/' + Date.now()).set(course, (error) => {
            if (error) {
                console.error('Failed to add course:', error);
                showError('Failed to add course');
            } else {
                showSuccess('Course added successfully');
                document.querySelectorAll('input').forEach(input => input.value = '');
            }
        });
    });

    // Delete Course
    window.deleteCourse = function(key) {
        db.ref('courses/' + key).remove((error) => {
            if (error) {
                console.error('Failed to delete course:', error);
                showError('Failed to delete course');
            } else {
                showSuccess('Course deleted successfully');
            }
        });
    };

    loadCourses();
});
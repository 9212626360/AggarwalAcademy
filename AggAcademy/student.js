document.addEventListener('DOMContentLoaded', () => {
    const db = firebase.database();
    const studentTable = document.getElementById('studentTable');
    const addStudentBtn = document.getElementById('addStudentBtn');
    const courseSelect = document.getElementById('studentCourse');

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

    // Demo Student
    const demoStudent = {
        name: "Rahul Sharma",
        course: "Advanced Typing",
        fees: 5000,
        religion: "Hindu",
        qualification: "12th Pass",
        status: "active",
        createdAt: new Date().toISOString()
    };
    db.ref('students/demo').set(demoStudent);

    // Load Students
    function loadStudents() {
        db.ref('students').on('value', (snapshot) => {
            studentTable.innerHTML = '';
            snapshot.forEach((child) => {
                const student = child.val();
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="p-3">${student.name}</td>
                    <td class="p-3">${student.course}</td>
                    <td class="p-3">${formatCurrency(student.fees)}</td>
                    <td class="p-3">${student.religion || '-'}</td>
                    <td class="p-3">${student.qualification || '-'}</td>
                    <td class="p-3">${student.status}</td>
                    <td class="p-3">
                        <button class="text-red-600 hover:text-red-800" onclick="deleteStudent('${child.key}')"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                studentTable.appendChild(row);
            });
        });
    }

    // Add Student
    addStudentBtn.addEventListener('click', () => {
        const student = {
            name: document.getElementById('studentName').value.trim(),
            course: document.getElementById('studentCourse').selectedOptions[0].text,
            courseId: document.getElementById('studentCourse').value,
            fees: parseInt(document.getElementById('studentFees').value) || 0,
            religion: document.getElementById('studentReligion').value.trim(),
            qualification: document.getElementById('studentQualification').value.trim(),
            status: document.getElementById('studentStatus').value,
            createdAt: new Date().toISOString()
        };

        if (!student.name || !student.courseId) {
            showError('Name and Course are required');
            return;
        }

        db.ref('students/' + Date.now()).set(student, (error) => {
            if (error) {
                showError('Failed to add student');
            } else {
                showSuccess('Student added successfully');
                document.querySelectorAll('input, select').forEach(input => input.value = '');
            }
        });

        // Update course student count
        db.ref(`courses/${student.courseId}/studentCount`).transaction(count => (count || 0) + 1);
    });

    // Delete Student
    window.deleteStudent = function(key) {
        db.ref('students/' + key).remove((error) => {
            if (error) {
                showError('Failed to delete student');
            } else {
                showSuccess('Student deleted successfully');
            }
        });
    };

    loadStudents();
});
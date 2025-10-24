document.addEventListener('DOMContentLoaded', () => {
    const db = firebase.database();
    const attendanceTable = document.getElementById('attendanceTable');
    const addAttendanceBtn = document.getElementById('addAttendanceBtn');
    const studentSelect = document.getElementById('attendanceStudent');

    // Load Students
    db.ref('students').on('value', (snapshot) => {
        studentSelect.innerHTML = '<option value="">Select Student</option>';
        snapshot.forEach(child => {
            const student = child.val();
            const option = document.createElement('option');
            option.value = child.key;
            option.textContent = student.name;
            studentSelect.appendChild(option);
        });
    });

    // Add Attendance
    addAttendanceBtn.addEventListener('click', () => {
        const attendance = {
            date: document.getElementById('attendanceDate').value,
            studentId: document.getElementById('attendanceStudent').value,
            studentName: document.getElementById('attendanceStudent').selectedOptions[0].text,
            status: document.getElementById('attendanceStatus').value
        };

        if (!attendance.date || !attendance.studentId) {
            showError('Date and Student are required');
            return;
        }

        db.ref('attendance/' + Date.now()).set(attendance, (error) => {
            if (error) {
                showError('Failed to mark attendance');
            } else {
                showSuccess('Attendance marked successfully');
                document.querySelectorAll('input, select').forEach(input => input.value = '');
            }
        });
    });

    // Load Attendance
    db.ref('attendance').on('value', (snapshot) => {
        attendanceTable.innerHTML = '';
        snapshot.forEach((child) => {
            const record = child.val();
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="p-3">${formatDate(record.date)}</td>
                <td class="p-3">${record.studentName}</td>
                <td class="p-3">${record.status}</td>
            `;
            attendanceTable.appendChild(row);
        });
    });
});
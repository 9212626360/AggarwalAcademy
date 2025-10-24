document.addEventListener('DOMContentLoaded', () => {
    const db = firebase.database();
    const feeTable = document.getElementById('feeTable');
    const addFeeBtn = document.getElementById('addFeeBtn');
    const studentSelect = document.getElementById('feeStudent');

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

    // Add Fee
    addFeeBtn.addEventListener('click', () => {
        const fee = {
            studentId: document.getElementById('feeStudent').value,
            studentName: document.getElementById('feeStudent').selectedOptions[0].text,
            amount: parseInt(document.getElementById('feeAmount').value) || 0,
            date: document.getElementById('feeDate').value
        };

        if (!fee.studentId || !fee.amount || !fee.date) {
            showError('Student, Amount, and Date are required');
            return;
        }

        db.ref('fees/' + Date.now()).set(fee, (error) => {
            if (error) {
                showError('Failed to record payment');
            } else {
                showSuccess('Payment recorded successfully');
                document.querySelectorAll('input, select').forEach(input => input.value = '');
            }
        });
    });

    // Load Fees
    db.ref('fees').on('value', (snapshot) => {
        feeTable.innerHTML = '';
        snapshot.forEach((child) => {
            const record = child.val();
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="p-3">${record.studentName}</td>
                <td class="p-3">${formatCurrency(record.amount)}</td>
                <td class="p-3">${formatDate(record.date)}</td>
            `;
            feeTable.appendChild(row);
        });
    });
});
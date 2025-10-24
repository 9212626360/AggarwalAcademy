document.addEventListener('DOMContentLoaded', () => {
    const db = firebase.database();
    const totalStudents = document.getElementById('totalStudents');
    const totalCourses = document.getElementById('totalCourses');
    const totalFees = document.getElementById('totalFees');
    const courseChart = document.getElementById('courseChart').getContext('2d');

    db.ref('students').once('value', (snapshot) => {
        totalStudents.textContent = snapshot.numChildren();
    });

    db.ref('courses').once('value', (snapshot) => {
        totalCourses.textContent = snapshot.numChildren();
        const courses = snapshot.val();
        const labels = [];
        const data = [];
        snapshot.forEach(child => {
            labels.push(child.val().name);
            data.push(child.val().studentCount || 0);
        });

        new Chart(courseChart, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Students Enrolled',
                    data,
                    backgroundColor: '#6366f1',
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    });

    db.ref('fees').once('value', (snapshot) => {
        let total = 0;
        snapshot.forEach(child => {
            total += child.val().amount;
        });
        totalFees.textContent = formatCurrency(total);
    });
});
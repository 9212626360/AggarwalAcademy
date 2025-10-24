document.addEventListener('DOMContentLoaded', () => {
    // Check if showError is defined
    if (typeof showError !== 'function') {
        console.error('showError function not defined. Ensure utils.js is loaded.');
        alert('System error: Utility functions not loaded.');
        return;
    }

    // Check Firebase initialization
    if (!firebase.apps.length) {
        console.error('Firebase not initialized.');
        showError('Firebase not initialized. Please check configuration.');
        return;
    }

    const ENCRYPTED_PIN = 'e764bf67b75ee42e6411c66b8282e0455baec3209725d0182abd72a6c027cd08'; // SHA256 hash of '0535'
    const adminPinInput = document.getElementById('adminPin');
    const loginBtn = document.getElementById('loginBtn');

    if (!adminPinInput || !loginBtn) {
        console.error('Login elements not found: adminPin or loginBtn missing.');
        showError('Login elements not found on page.');
        return;
    }

    adminPinInput.addEventListener('input', () => {
        adminPinInput.value = adminPinInput.value.replace(/[^0-9]/g, '').slice(0, 4);
    });

    loginBtn.addEventListener('click', () => {
        const pin = adminPinInput.value.trim();
        if (pin.length !== 4) {
            showError('Please enter a 4-digit PIN');
            return;
        }

        try {
            const hashedPin = CryptoJS.SHA256(pin).toString();
            if (hashedPin === ENCRYPTED_PIN) {
                window.location.href = 'dashboard.html';
            } else {
                showError('Invalid PIN');
            }
        } catch (error) {
            console.error('Login error:', error);
            showError('Error processing login: ' + error.message);
        }
    });
});
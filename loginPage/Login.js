const { createApp } = Vue;

createApp({
    data() {
        return {
            email: '',
            password: '',
            passwordVisible: false,
            showMessage: false,
            message: '',
            messageTimeout: null
        };
    },
    methods: {
        togglePasswordVisibility() {
            this.passwordVisible = !this.passwordVisible;
        },
        showMessage(message, duration = 3000) {
            this.message = message;
            this.showMessage = true;
            if (this.messageTimeout) {
                clearTimeout(this.messageTimeout);
            }
            this.messageTimeout = setTimeout(() => {
                this.showMessage = false;
            }, duration);
        },
        login() {
            if (this.email && this.password) {
                this.showMessage(`Attempting login with email: ${this.email}`, 5000);
                // In a real app, you would send this to a backend API.
            } else {
                this.showMessage('Please fill in both email and password.', 4000);
            }
        }
    }
}).mount('#app');
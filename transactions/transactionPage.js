// Destructure Vue functions from the global object
const { createApp, ref, computed, onMounted } = Vue;

createApp({
    setup() {

        // Sidebar Navigation
        const activeNav = ref('Transactions');
        const navItems = ref([
            { name: 'Dashboard', icon: 'home' },
            { name: 'Transactions', icon: 'credit-card' },
            { name: 'Records', icon: 'file-text' },
            { name: 'Settings', icon: 'settings' },
        ]);

        
        // --- Data Properties ---
        const activeTab = ref('Expense');
        const currentInput = ref('0');
        
        // "From" account
        const selectedAccount = ref(null);
        // "To" account (New)
        const transferToAccount = ref(null);

        const currentDateTime = ref('');
        const keypadKeys = ref(['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '<']);
        
        const accounts = ref([
            {
                platform: 'Cash',
                availableAssets: 5000.00
            },
            {
                platform: 'Bank - BDO',
                availableAssets: 100000.00
            },
            {
                platform: 'GCash',
                availableAssets: 2500.50
            }
        ]);

        const saveAccountsToStorage = () => {
            localStorage.setItem('myMoneyAccounts', JSON.stringify(accounts.value));
        };

        const loadAccountsFromStorage = () => {
            const stored = localStorage.getItem('myMoneyAccounts');
            if (stored) {
                accounts.value = JSON.parse(stored);
            }
        };

        // --- Computed Properties ---
        const formattedAmount = computed(() => {
            let [integer, decimal] = currentInput.value.split('.');
            integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            
            if (decimal === undefined) return `${integer}.00`;
            else if (decimal.length === 1) return `${integer}.${decimal}0`;
            else return `${integer}.${decimal.substring(0, 2)}`;
        });

        // --- Methods ---
        const setTab = (tabName) => {
            activeTab.value = tabName;
            // Reset inputs when switching tabs
            currentInput.value = '0';
        };

        const executeExpense = () => {
            const amount = parseFloat(currentInput.value);

            // 1. Validation
            if (amount <= 0) {
                alert("Please enter an amount greater than 0.");
                return;
            }
            if (!selectedAccount.value) {
                alert("Please select an account.");
                return;
            }

            // 2. Find Account Object
            const account = accounts.value.find(acc => acc.platformNumber === selectedAccount.value);

            // 3. Check Funds
            if (account.availableAssets < amount) {
                alert("Insufficient funds in " + account.platform);
                return;
            }

            // 4. Execute Math
            account.availableAssets -= amount;

            // 5. Save to localStorage
            saveAccountsToStorage();

            // 6. Success Message & Reset
            alert(`Successfully recorded expense of ₱${formatCurrency(amount)} from ${account.platform}`);
            currentInput.value = '0';
        };

        const executeIncome = () => {
            const amount = parseFloat(currentInput.value);

            // 1. Validation
            if (amount <= 0) {
                alert("Please enter an amount greater than 0.");
                return;
            }
            if (!selectedAccount.value) {
                alert("Please select an account.");
                return;
            }

            // 2. Find Account Object
            const account = accounts.value.find(acc => acc.platformNumber === selectedAccount.value);

            // 3. Execute Math
            account.availableAssets += amount;

            // 4. Save to localStorage
            saveAccountsToStorage();

            // 5. Success Message & Reset
            alert(`Successfully recorded income of ₱${formatCurrency(amount)} to ${account.platform}`);
            currentInput.value = '0';
        };

        const executeTransfer = () => {
            const amount = parseFloat(currentInput.value);

            // 1. Validation
            if (amount <= 0) {
                alert("Please enter an amount greater than 0.");
                return;
            }
            if (!selectedAccount.value || !transferToAccount.value) {
                alert("Please select both a FROM and TO account.");
                return;
            }
            if (selectedAccount.value === transferToAccount.value) {
                alert("Cannot transfer to the same account.");
                return;
            }

            // 2. Find Account Objects
            const sourceAccount = accounts.value.find(acc => acc.platformNumber === selectedAccount.value);
            const destAccount = accounts.value.find(acc => acc.platformNumber === transferToAccount.value);

            // 3. Check Funds
            if (sourceAccount.availableAssets < amount) {
                alert("Insufficient funds in " + sourceAccount.platform);
                return;
            }

            // 4. Execute Math
            sourceAccount.availableAssets -= amount;
            destAccount.availableAssets += amount;

            // 5. Save to localStorage
            saveAccountsToStorage();

            // 6. Success Message & Reset
            alert(`Successfully transferred ₱${formatCurrency(amount)} from ${sourceAccount.platform} to ${destAccount.platform}`);
            currentInput.value = '0';
            transferToAccount.value = null; // Reset destination
        };

        const pressKey = (key) => {
            if (key === '<') {
                currentInput.value = currentInput.value.slice(0, -1);
                if (currentInput.value === '') currentInput.value = '0';
            } else if (key === '.') {
                if (!currentInput.value.includes('.')) currentInput.value += '.';
            } else {
                if (currentInput.value === '0' && key !== '.') currentInput.value = key;
                else {
                    const parts = currentInput.value.split('.');
                    if (parts.length < 2 || parts[1].length < 2) currentInput.value += key;
                }
            }
        };
        
        const setActiveNav = (item) => {
            activeNav.value = item;
            if (item === 'Dashboard') {
                window.location.href = '../homePage/homePage.html';
            }
            // Add other navigation logic if needed
        };

        const formatCurrency = (value) => {
            return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        };

        onMounted(() => {
            // Load accounts from localStorage
            loadAccountsFromStorage();

            currentDateTime.value = 'Today, 10:02AM';
            // Render all lucide icons
            lucide.createIcons();
        });

        return {
            activeNav,
            navItems,
            activeTab,
            currentInput,
            selectedAccount,
            transferToAccount, // Export this so HTML can see it
            currentDateTime,
            keypadKeys,
            accounts,
            formattedAmount,
            setTab,
            pressKey,
            formatCurrency,
            executeExpense,
            executeIncome,
            executeTransfer, // Export the function
            setActiveNav
        };
    }
}).mount('#app');
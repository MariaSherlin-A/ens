// ==================== TESTNET ENS SIMULATOR ====================
// Simulates ENS resolution and text records for testing without real wallet connection

class TestENSProvider {
    constructor() {
        // Simulated ENS configurations for testing
        this.ensConfigs = {
            'payments.company.eth': {
                address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
                textRecords: {
                    'split.wallet1': '0x1234567890123456789012345678901234567890',
                    'split.wallet1.percent': '40',
                    'split.wallet2': '0x2345678901234567890123456789012345678901',
                    'split.wallet2.percent': '35',
                    'split.wallet3': '0x3456789012345678901234567890123456789012',
                    'split.wallet3.percent': '20',
                    'split.treasury': '0x4567890123456789012345678901234567890123',
                    'split.treasury.percent': '5'
                }
            },
            'team.dao.eth': {
                address: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
                textRecords: {
                    'split.dev1': '0x5678901234567890123456789012345678901234',
                    'split.dev1.percent': '30',
                    'split.dev2': '0x6789012345678901234567890123456789012345',
                    'split.dev2.percent': '30',
                    'split.marketing': '0x7890123456789012345678901234567890123456',
                    'split.marketing.percent': '25',
                    'split.operations': '0x8901234567890123456789012345678901234567',
                    'split.operations.percent': '15'
                }
            },
            'freelance.eth': {
                address: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
                textRecords: {
                    'split.contractor': '0x9012345678901234567890123456789012345678',
                    'split.contractor.percent': '70',
                    'split.platform': '0x0123456789012345678901234567890123456789',
                    'split.platform.percent': '20',
                    'split.tax': '0x1234567890123456789012345678901234567891',
                    'split.tax.percent': '10'
                }
            }
        };

        // Transaction history for demo
        this.transactionHistory = [
            {
                id: '0x1a2b3c4d5e6f...',
                ensName: 'payments.company.eth',
                amount: '5.0',
                timestamp: Date.now() - 86400000,
                status: 'completed',
                splits: 4
            },
            {
                id: '0x2b3c4d5e6f7a...',
                ensName: 'team.dao.eth',
                amount: '10.0',
                timestamp: Date.now() - 172800000,
                status: 'completed',
                splits: 4
            },
            {
                id: '0x3c4d5e6f7a8b...',
                ensName: 'freelance.eth',
                amount: '2.5',
                timestamp: Date.now() - 259200000,
                status: 'completed',
                splits: 3
            }
        ];
    }

    // Simulate ENS name resolution
    async resolveENS(ensName) {
        await this.simulateDelay();
        const config = this.ensConfigs[ensName];
        if (!config) {
            throw new Error(`ENS name "${ensName}" not found in testnet`);
        }
        return config.address;
    }

    // Simulate reading ENS text records
    async getTextRecord(ensName, key) {
        await this.simulateDelay();
        const config = this.ensConfigs[ensName];
        if (!config) {
            throw new Error(`ENS name "${ensName}" not found`);
        }
        return config.textRecords[key] || null;
    }

    // Parse split configuration from ENS text records
    async getSplitConfig(ensName) {
        await this.simulateDelay();
        const config = this.ensConfigs[ensName];
        if (!config) {
            throw new Error(`ENS name "${ensName}" not found`);
        }

        const splits = [];
        const records = config.textRecords;

        // Extract unique wallet names
        const walletNames = new Set();
        Object.keys(records).forEach(key => {
            if (key.startsWith('split.') && !key.endsWith('.percent')) {
                const walletName = key.replace('split.', '');
                walletNames.add(walletName);
            }
        });

        // Build split configuration
        walletNames.forEach(name => {
            const address = records[`split.${name}`];
            const percent = records[`split.${name}.percent`];
            if (address && percent) {
                splits.push({
                    name: name,
                    address: address,
                    percent: parseFloat(percent)
                });
            }
        });

        // Validate total is 100%
        const total = splits.reduce((sum, split) => sum + split.percent, 0);
        if (Math.abs(total - 100) > 0.01) {
            throw new Error(`Split percentages must total 100% (currently ${total}%)`);
        }

        return {
            ensName,
            mainAddress: config.address,
            splits,
            totalPercent: total
        };
    }

    // Simulate payment execution
    async executePayment(ensName, amount) {
        await this.simulateDelay(1500);

        const splitConfig = await this.getSplitConfig(ensName);
        const amountNum = parseFloat(amount);

        // Calculate individual payments
        const payments = splitConfig.splits.map(split => ({
            ...split,
            amount: (amountNum * split.percent / 100).toFixed(4)
        }));

        // Create transaction record
        const txHash = '0x' + Array.from({ length: 64 }, () =>
            Math.floor(Math.random() * 16).toString(16)).join('');

        const transaction = {
            id: txHash,
            ensName,
            amount: amount.toString(),
            timestamp: Date.now(),
            status: 'completed',
            splits: payments.length,
            payments
        };

        // Add to history
        this.transactionHistory.unshift(transaction);

        return transaction;
    }

    // Get all available ENS names for testing
    getAvailableENSNames() {
        return Object.keys(this.ensConfigs);
    }

    // Get transaction history
    getTransactionHistory() {
        return [...this.transactionHistory];
    }

    // Simulate network delay
    simulateDelay(ms = 500) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Update ENS configuration (for configure page)
    async updateENSConfig(ensName, splits) {
        await this.simulateDelay();

        if (!this.ensConfigs[ensName]) {
            this.ensConfigs[ensName] = {
                address: '0x' + Array.from({ length: 40 }, () =>
                    Math.floor(Math.random() * 16).toString(16)).join(''),
                textRecords: {}
            };
        }

        const textRecords = {};
        splits.forEach(split => {
            textRecords[`split.${split.name}`] = split.address;
            textRecords[`split.${split.name}.percent`] = split.percent.toString();
        });

        this.ensConfigs[ensName].textRecords = textRecords;
        return true;
    }
}

// ==================== APPLICATION STATE ====================
class ENSplitApp {
    constructor() {
        this.ensProvider = new TestENSProvider();
        this.currentPage = 'home';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.loadPage('home');
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.loadPage(page);

                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });

        // Make logo clickable
        const brandLogo = document.querySelector('.nav-brand');
        if (brandLogo) {
            brandLogo.addEventListener('click', (e) => {
                e.preventDefault();
                this.loadPage('home');

                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                const homeLink = document.querySelector('.nav-link[data-page="home"]');
                if (homeLink) homeLink.classList.add('active');
            });
        }
    }

    async loadPage(pageName) {
        console.log('Loading page:', pageName);
        this.currentPage = pageName;
        const mainContent = document.getElementById('main-content');

        switch (pageName) {
            case 'home':
                mainContent.innerHTML = this.renderHomePage();
                break;
            case 'configure':
                mainContent.innerHTML = this.renderConfigurePage();
                this.setupConfigureHandlers();
                break;
            case 'send':
                mainContent.innerHTML = this.renderSendPage();
                this.setupSendHandlers();
                break;
            case 'history':
                mainContent.innerHTML = await this.renderHistoryPage();
                break;
            default:
                mainContent.innerHTML = this.renderHomePage();
        }
    }

    renderHomePage() {
        return `
            <div class="hero-section">
                <h1 class="hero-title">Dynamic Payment Splitting<br/>Powered by ENS</h1>
                <p class="hero-subtitle">
                    Send one payment to one ENS name. Funds automatically split across multiple recipients 
                    based on live ENS records. No contract redeployments. No hard-coded wallets.
                </p>
                <div class="hero-cta">
                    <button class="btn btn-primary" onclick="app.loadPage('send')">
                        <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                        </svg>
                        Send Payment
                    </button>
                    <button class="btn btn-secondary" onclick="app.loadPage('configure')">
                        <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        Configure Splits
                    </button>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-label">Total Payments</div>
                    <div class="stat-value">${this.ensProvider.transactionHistory.length}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Total Volume</div>
                    <div class="stat-value">${this.calculateTotalVolume()} ETH</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Active ENS Names</div>
                    <div class="stat-value">${this.ensProvider.getAvailableENSNames().length}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Network</div>
                    <div class="stat-value">Sepolia</div>
                </div>
            </div>

            <div class="card-grid">
                <div class="card">
                    <div class="card-icon">
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                        </svg>
                    </div>
                    <h3 class="card-title">Live ENS Resolution</h3>
                    <p class="card-description">
                        Every payment reads ENS records in real-time. Update your split configuration 
                        and the next transaction uses the new logic instantly.
                    </p>
                </div>

                <div class="card">
                    <div class="card-icon">
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                        </svg>
                    </div>
                    <h3 class="card-title">Trustless Execution</h3>
                    <p class="card-description">
                        All splits execute on-chain in a single transaction. No intermediaries, 
                        no custody, no trust required.
                    </p>
                </div>

                <div class="card">
                    <div class="card-icon">
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                        </svg>
                    </div>
                    <h3 class="card-title">Zero Contract Updates</h3>
                    <p class="card-description">
                        Change team members, adjust percentages, or modify treasury allocations 
                        without redeploying contracts or updating frontend code.
                    </p>
                </div>
            </div>
        `;
    }

    renderConfigurePage() {
        return `
            <div class="page-header">
                <h1 class="page-title">Configure Payment Splits</h1>
                <p class="page-description">
                    Define how payments should be split by configuring ENS text records. 
                    Changes take effect immediately for the next payment.
                </p>
            </div>

            <div class="card">
                <form id="configure-form">
                    <div class="form-group">
                        <label class="form-label">ENS Name</label>
                        <select id="ens-name-select" class="form-select">
                            ${this.ensProvider.getAvailableENSNames().map(name =>
            `<option value="${name}">${name}</option>`
        ).join('')}
                            <option value="custom">+ Create New ENS Configuration</option>
                        </select>
                        <span class="form-hint">Select an existing ENS name or create a new configuration</span>
                    </div>

                    <div id="custom-ens-input" style="display: none;">
                        <div class="form-group">
                            <label class="form-label">Custom ENS Name</label>
                            <input type="text" id="custom-ens-name" class="form-input" placeholder="myproject.eth">
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Split Configuration</label>
                        <div id="splits-container"></div>
                        <button type="button" class="btn btn-secondary" id="add-split-btn" style="margin-top: 1rem;">
                            <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                            </svg>
                            Add Recipient
                        </button>
                    </div>

                    <div id="split-preview-container"></div>

                    <button type="submit" class="btn btn-primary">
                        <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        Save Configuration
                    </button>
                </form>
            </div>
        `;
    }

    renderSendPage() {
        return `
            <div class="page-header">
                <h1 class="page-title">Send Payment</h1>
                <p class="page-description">
                    Send a payment to an ENS name. Funds will be automatically split according to 
                    the ENS text records configured for that name.
                </p>
            </div>

            <div class="card">
                <form id="send-payment-form">
                    <div class="form-group">
                        <label class="form-label">Recipient ENS Name</label>
                        <select id="recipient-ens" class="form-select">
                            <option value="">Select ENS name...</option>
                            ${this.ensProvider.getAvailableENSNames().map(name =>
            `<option value="${name}">${name}</option>`
        ).join('')}
                        </select>
                        <span class="form-hint">The payment will be split according to this ENS name's configuration</span>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Amount (ETH)</label>
                        <input type="number" id="payment-amount" class="form-input" 
                               placeholder="0.00" step="0.01" min="0.01">
                        <span class="form-hint">Amount in ETH to send (Sepolia testnet)</span>
                    </div>

                    <div id="payment-preview"></div>

                    <button type="submit" class="btn btn-primary">
                        <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                        </svg>
                        Execute Payment
                    </button>
                </form>

                <div id="transaction-result"></div>
            </div>
        `;
    }

    async renderHistoryPage() {
        const history = this.ensProvider.getTransactionHistory();

        return `
            <div class="page-header">
                <h1 class="page-title">Transaction History</h1>
                <p class="page-description">
                    View all past payment splits executed through ENSplit on Sepolia testnet.
                </p>
            </div>

            ${history.length === 0 ? `
                <div class="card">
                    <p style="text-align: center; color: var(--color-text-secondary);">
                        No transactions yet. Send your first payment to get started!
                    </p>
                </div>
            ` : `
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Transaction Hash</th>
                                <th>ENS Name</th>
                                <th>Amount</th>
                                <th>Recipients</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${history.map(tx => `
                                <tr>
                                    <td>
                                        <code style="font-size: 0.875rem; color: var(--color-primary);">
                                            ${tx.id.substring(0, 20)}...
                                        </code>
                                    </td>
                                    <td>${tx.ensName}</td>
                                    <td><strong>${tx.amount} ETH</strong></td>
                                    <td>${tx.splits} recipients</td>
                                    <td>${new Date(tx.timestamp).toLocaleDateString()}</td>
                                    <td>
                                        <span class="badge badge-success">
                                            ✓ ${tx.status}
                                        </span>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `}
        `;
    }

    setupConfigureHandlers() {
        const ensSelect = document.getElementById('ens-name-select');
        const customInput = document.getElementById('custom-ens-input');
        const addSplitBtn = document.getElementById('add-split-btn');
        const form = document.getElementById('configure-form');

        ensSelect.addEventListener('change', async (e) => {
            if (e.target.value === 'custom') {
                customInput.style.display = 'block';
                this.renderSplitInputs([]);
            } else {
                customInput.style.display = 'none';
                const config = await this.ensProvider.getSplitConfig(e.target.value);
                this.renderSplitInputs(config.splits);
            }
        });

        addSplitBtn.addEventListener('click', () => {
            this.addSplitInput();
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleConfigureSubmit();
        });

        // Load initial configuration
        if (ensSelect.value) {
            ensSelect.dispatchEvent(new Event('change'));
        }
    }

    renderSplitInputs(splits) {
        const container = document.getElementById('splits-container');
        container.innerHTML = '';

        if (splits.length === 0) {
            this.addSplitInput();
        } else {
            splits.forEach(split => this.addSplitInput(split));
        }

        this.updateSplitPreview();
    }

    addSplitInput(split = null) {
        const container = document.getElementById('splits-container');
        const index = container.children.length;

        const splitDiv = document.createElement('div');
        splitDiv.className = 'split-item';
        splitDiv.innerHTML = `
            <div style="flex: 1; display: grid; grid-template-columns: 2fr 3fr 1fr auto; gap: 1rem; align-items: center;">
                <input type="text" class="form-input split-name" placeholder="Name (e.g., dev1)" 
                       value="${split ? split.name : ''}" data-index="${index}">
                <input type="text" class="form-input split-address" placeholder="0x..." 
                       value="${split ? split.address : ''}" data-index="${index}">
                <input type="number" class="form-input split-percent" placeholder="%" 
                       min="0" max="100" step="0.1" value="${split ? split.percent : ''}" data-index="${index}">
                <button type="button" class="btn btn-secondary" onclick="this.parentElement.parentElement.remove(); app.updateSplitPreview();">
                    <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
        `;

        container.appendChild(splitDiv);

        // Add event listeners for live preview
        splitDiv.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', () => this.updateSplitPreview());
        });
    }

    updateSplitPreview() {
        const splits = this.getSplitInputValues();
        const total = splits.reduce((sum, s) => sum + (parseFloat(s.percent) || 0), 0);

        const previewContainer = document.getElementById('split-preview-container');
        if (splits.length === 0) {
            previewContainer.innerHTML = '';
            return;
        }

        previewContainer.innerHTML = `
            <div class="split-preview">
                <h4 style="margin-bottom: 1rem; color: var(--color-text-primary);">Split Preview</h4>
                ${splits.map(split => `
                    <div class="split-item">
                        <div>
                            <div style="font-weight: 600;">${split.name || 'Unnamed'}</div>
                            <div style="font-size: 0.875rem; color: var(--color-text-secondary); font-family: monospace;">
                                ${split.address || 'No address'}
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-weight: 700; color: var(--color-primary);">${split.percent || 0}%</div>
                        </div>
                    </div>
                `).join('')}
                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--color-border);">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <strong>Total:</strong>
                        <strong class="${total === 100 ? 'text-gradient' : ''}" style="color: ${total === 100 ? '' : 'var(--color-error)'};">
                            ${total.toFixed(1)}%
                        </strong>
                    </div>
                    ${total !== 100 ? `
                        <div class="alert alert-warning" style="margin-top: 1rem;">
                            ⚠️ Total must equal 100% (currently ${total.toFixed(1)}%)
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    getSplitInputValues() {
        const splits = [];
        document.querySelectorAll('.split-name').forEach((nameInput, index) => {
            const addressInput = document.querySelector(`.split-address[data-index="${index}"]`);
            const percentInput = document.querySelector(`.split-percent[data-index="${index}"]`);

            if (nameInput.value || addressInput.value || percentInput.value) {
                splits.push({
                    name: nameInput.value,
                    address: addressInput.value,
                    percent: parseFloat(percentInput.value) || 0
                });
            }
        });
        return splits;
    }

    async handleConfigureSubmit() {
        const ensSelect = document.getElementById('ens-name-select');
        const customNameInput = document.getElementById('custom-ens-name');

        let ensName = ensSelect.value;
        if (ensName === 'custom') {
            ensName = customNameInput.value;
            if (!ensName || !ensName.endsWith('.eth')) {
                alert('Please enter a valid ENS name ending with .eth');
                return;
            }
        }

        const splits = this.getSplitInputValues();
        const total = splits.reduce((sum, s) => sum + s.percent, 0);

        if (Math.abs(total - 100) > 0.01) {
            alert(`Split percentages must total 100% (currently ${total.toFixed(1)}%)`);
            return;
        }

        if (splits.some(s => !s.name || !s.address)) {
            alert('All splits must have a name and address');
            return;
        }

        try {
            await this.ensProvider.updateENSConfig(ensName, splits);

            const previewContainer = document.getElementById('split-preview-container');
            previewContainer.innerHTML = `
                <div class="alert alert-success">
                    ✓ Configuration saved successfully for ${ensName}!
                </div>
            `;

            setTimeout(() => {
                this.loadPage('send');
            }, 2000);
        } catch (error) {
            alert('Error saving configuration: ' + error.message);
        }
    }

    setupSendHandlers() {
        const ensSelect = document.getElementById('recipient-ens');
        const amountInput = document.getElementById('payment-amount');
        const form = document.getElementById('send-payment-form');

        const updatePreview = async () => {
            const ensName = ensSelect.value;
            const amount = amountInput.value;

            if (!ensName || !amount) {
                document.getElementById('payment-preview').innerHTML = '';
                return;
            }

            try {
                const config = await this.ensProvider.getSplitConfig(ensName);
                const amountNum = parseFloat(amount);

                document.getElementById('payment-preview').innerHTML = `
                    <div class="split-preview">
                        <h4 style="margin-bottom: 1rem; color: var(--color-text-primary);">Payment Breakdown</h4>
                        ${config.splits.map(split => {
                    const splitAmount = (amountNum * split.percent / 100).toFixed(4);
                    return `
                                <div class="split-item">
                                    <div>
                                        <div style="font-weight: 600;">${split.name}</div>
                                        <div style="font-size: 0.875rem; color: var(--color-text-secondary); font-family: monospace;">
                                            ${split.address}
                                        </div>
                                    </div>
                                    <div style="text-align: right;">
                                        <div style="font-weight: 700; color: var(--color-primary);">${splitAmount} ETH</div>
                                        <div style="font-size: 0.875rem; color: var(--color-text-secondary);">${split.percent}%</div>
                                    </div>
                                </div>
                            `;
                }).join('')}
                        <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--color-border);">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <strong>Total:</strong>
                                <strong class="text-gradient">${amount} ETH</strong>
                            </div>
                        </div>
                    </div>
                `;
            } catch (error) {
                document.getElementById('payment-preview').innerHTML = `
                    <div class="alert alert-error">
                        ⚠️ ${error.message}
                    </div>
                `;
            }
        };

        ensSelect.addEventListener('change', updatePreview);
        amountInput.addEventListener('input', updatePreview);

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleSendPayment();
        });
    }

    async handleSendPayment() {
        const ensName = document.getElementById('recipient-ens').value;
        const amount = document.getElementById('payment-amount').value;
        const resultDiv = document.getElementById('transaction-result');

        if (!ensName || !amount) {
            alert('Please fill in all fields');
            return;
        }

        try {
            resultDiv.innerHTML = `
                <div class="alert alert-warning" style="margin-top: 2rem;">
                    <div class="loading-spinner"></div>
                    <div>Processing payment...</div>
                </div>
            `;

            const transaction = await this.ensProvider.executePayment(ensName, amount);

            resultDiv.innerHTML = `
                <div class="alert alert-success" style="margin-top: 2rem;">
                    <div>
                        <h4 style="margin-bottom: 0.5rem;">✓ Payment Successful!</h4>
                        <p style="margin-bottom: 0.5rem;">Transaction Hash: <code>${transaction.id}</code></p>
                        <p style="margin-bottom: 0;">Split across ${transaction.payments.length} recipients</p>
                        <div style="margin-top: 1rem;">
                            ${transaction.payments.map(p => `
                                <div style="font-size: 0.875rem; margin: 0.25rem 0;">
                                    ${p.name}: ${p.amount} ETH (${p.percent}%)
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;

            // Reset form
            document.getElementById('send-payment-form').reset();
            document.getElementById('payment-preview').innerHTML = '';

        } catch (error) {
            resultDiv.innerHTML = `
                <div class="alert alert-error" style="margin-top: 2rem;">
                    ⚠️ Payment failed: ${error.message}
                </div>
            `;
        }
    }

    calculateTotalVolume() {
        return this.ensProvider.transactionHistory
            .reduce((sum, tx) => sum + parseFloat(tx.amount), 0)
            .toFixed(2);
    }
}

// ==================== INITIALIZE APP ====================
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new ENSplitApp();
    window.app = app; // Make app globally available for inline onclick handlers
});

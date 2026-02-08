# ENSplit

**A DeFi payment-splitting protocol where ENS names dynamically define how funds are split across multiple wallets at transaction time.**

![ENSplit Banner](https://img.shields.io/badge/ENS-Powered-5f4dee?style=for-the-badge)
![Testnet](https://img.shields.io/badge/Network-Sepolia-orange?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Demo-success?style=for-the-badge)

---

## What Is ENSplit?

ENSplit allows organizations to **send one payment to one ENS name**, and the funds are **automatically split across multiple recipients** based on live ENS records.
Payout logic should be as easy to edit as a website DNS record, but as secure as a blockchain transaction.
**No smart contract redeployments**  
**No changing frontend logic**  
**No hard-coded wallet lists**  

**ENS controls where the money flows.**

---

## The Problem It Solves

Organizations today face constant payment routing headaches:

- **Changing contributor wallets**
- **Treasury + ops + tax splits**
- **Regional payout differences**
- **Vendor + platform fee deductions**

Current solutions require:
- Custom scripts
- Manual calculations
- Multiple transactions
- Frequent contract updates

This causes:
- Errors
- Overpayments
- Delays
- Accounting nightmares

---

## How ENSplit Solves This

Instead of hard-coding payout logic into contracts, **organizations define payout rules inside ENS records**.

### Example ENS Configuration

For `payments.company.eth`, set these text records:

```
split.wallet1 = 0x1234...
split.wallet1.percent = 40

split.wallet2 = 0x2345...
split.wallet2.percent = 35

split.wallet3 = 0x3456...
split.wallet3.percent = 20

split.treasury = 0x4567...
split.treasury.percent = 5
```

### When Funds Are Sent:

1. ENS is resolved live
2. Records are read on-chain
3. Funds are split automatically
4. Payments execute in one transaction

**Change the team? Update ENS. That's it.**

---

## Core Innovation

> **ENSplit turns ENS into a programmable payment router**, allowing organizations to update fund distribution logic without touching contracts or frontends, while still executing trustless DeFi transactions.

---

##  Features

### Dashboard
- Real-time statistics
- Total payment volume
- Active ENS configurations
- Network status

###  Configure Splits
- Visual split configuration editor
- Live preview of payment distribution
- Percentage validation
- Support for multiple recipients

###  Send Payments
- ENS name selection
- Amount input with live conversion
- Payment breakdown preview
- One-click execution

### Transaction History
- Complete payment records
- Transaction hashes
- Split details
- Timestamp tracking

---

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd C:\Users\Sherlla\.gemini\antigravity\scratch\ensplit
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   The app will automatically open at `http://localhost:3000`

---

## Testnet Configuration

This demo uses **Sepolia Testnet** with simulated ENS data. No real wallet connection or real ETH required.

### Pre-configured ENS Names:

1. **payments.company.eth**
   - 4 recipients
   - Corporate payment structure

2. **team.dao.eth**
   - 4 recipients
   - DAO treasury distribution

3. **freelance.eth**
   - 3 recipients
   - Freelancer + platform + tax split

---

##  How to Use

### 1. Configure a Split

1. Navigate to **Configure** page
2. Select an ENS name or create new
3. Add recipients with:
   - Name (identifier)
   - Wallet address
   - Percentage (must total 100%)
4. Preview the configuration
5. Save

### 2. Send a Payment

1. Navigate to **Send Payment** page
2. Select recipient ENS name
3. Enter amount in ETH
4. Review payment breakdown
5. Execute payment
6. View transaction confirmation

### 3. View History

1. Navigate to **History** page
2. See all past transactions
3. View split details
4. Check transaction hashes

---

##  Technical Architecture

### ENS Integration

The application demonstrates proper ENS integration using:

- **ENS Resolution**: Converting ENS names to addresses
- **Text Record Reading**: Parsing split configurations from ENS
- **Live Updates**: Reading ENS data at transaction time
- **Validation**: Ensuring split percentages total 100%

### Payment Flow

```
User Input (ENS + Amount)
    ↓
Resolve ENS Name → Address
    ↓
Read ENS Text Records
    ↓
Parse Split Configuration
    ↓
Validate Percentages
    ↓
Calculate Individual Amounts
    ↓
Execute Split Payment
    ↓
Record Transaction
```

### Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+)
- **Styling**: Custom CSS with design tokens
- **Build Tool**: Vite
- **ENS Simulation**: Custom TestENSProvider class
- **Network**: Sepolia Testnet (simulated)

---

## Design Philosophy

ENSplit features a **premium dark mode interface** with:

- Rich color gradients
- Smooth micro-animations
- Glassmorphism effects
- Responsive design
- Fast, intuitive interactions

---

## Project Structure

```
ensplit/
├── index.html          # Main HTML entry point
├── styles.css          # Complete design system
├── app.js              # Application logic & ENS integration
├── vite.config.js      # Vite configuration
├── package.json        # Dependencies
└── README.md           # Documentation
```

---

## Security Considerations

For production deployment, consider:

- Real ENS integration with wagmi/viem
- Wallet connection (MetaMask, WalletConnect)
- Smart contract audits
- Gas optimization
- Error handling for malformed ENS data
- Rate limiting
- Transaction confirmation UI

---

## Why This Matters

### For Organizations:
- Fewer transactions
- Fewer mistakes
- Cleaner accounting
- Faster payouts

### For DeFi:
- Novel use of ENS infrastructure
- Programmable payment routing
- Trustless execution
- Zero custody

### For Users:
- Human-readable addresses
- Transparent splits
- One-click payments
- Instant updates

---

##  Future Enhancements

- [ ] Real mainnet deployment
- [ ] Multi-token support (ERC20)
- [ ] Scheduled payments
- [ ] Conditional splits
- [ ] Mobile app
- [ ] Analytics dashboard
- [ ] CSV export
- [ ] Webhook notifications

---

##  License

This project is a demonstration built for educational purposes.

---

##  Contributing

This is a demo project. For production use, consider:

1. Implementing real ENS integration
2. Adding comprehensive error handling
3. Writing unit tests
4. Conducting security audits
5. Optimizing gas costs

---

##  Support

For questions or issues, please refer to:

- [ENS Documentation](https://docs.ens.domains/)
- [Viem Documentation](https://viem.sh/)
- [Wagmi Documentation](https://wagmi.sh/)

---

##  Acknowledgments

Built with:
- **ENS** - Ethereum Name Service
- **Vite** - Next Generation Frontend Tooling
- **Sepolia** - Ethereum Testnet




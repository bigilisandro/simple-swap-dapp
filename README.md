# SimpleSwap DApp

A decentralized application for token swapping built with Next.js and Hardhat, designed to interact with the SimpleSwap contract on Sepolia testnet.

## 🚀 Features

- **Wallet Integration**: Connect MetaMask and other Web3 wallets
- **Token Swapping**: Seamless swapping between Token A and Token B
- **Real-time Prices**: Live price feeds from the smart contract
- **Balance Tracking**: Monitor your token balances
- **Responsive Design**: Works perfectly on desktop and mobile
- **Comprehensive Testing**: Full test suite with >50% coverage

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- MetaMask or compatible Web3 wallet
- Sepolia testnet ETH for gas fees

## 🛠 Installation

1. **Clone the repository:**
   \`\`\`bash
   git clone <your-repo-url>
   cd simple-swap-frontend
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables:**
   \`\`\`bash
   cp .env.example .env
   \`\`\`
   
   Fill in your environment variables:
   - `SEPOLIA_URL`: Your Infura/Alchemy Sepolia RPC URL
   - `PRIVATE_KEY`: Your wallet private key (for deployment)
   - `ETHERSCAN_API_KEY`: For contract verification

## 🧪 Testing

Run the comprehensive test suite:

\`\`\`bash
# Compile contracts
npm run hardhat:compile

# Run tests
npm run hardhat:test

# Check test coverage
npm run hardhat:coverage
\`\`\`

The test suite covers:
- Contract deployment and initialization
- Token swapping functionality
- Price management
- Balance queries
- Admin functions
- Edge cases and error handling

## 🚀 Development

1. **Start the development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

2. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

3. **Connect your wallet:**
   - Make sure you're on Sepolia testnet
   - Connect your MetaMask wallet
   - Get some Sepolia ETH from a faucet

## 📦 Deployment

### Frontend Deployment (Vercel)

1. **Build the application:**
   \`\`\`bash
   npm run build
   \`\`\`

2. **Deploy to Vercel:**
   \`\`\`bash
   npx vercel --prod
   \`\`\`

### Contract Deployment (Sepolia)

1. **Deploy contracts:**
   \`\`\`bash
   npm run deploy:sepolia
   \`\`\`

2. **Verify on Etherscan:**
   \`\`\`bash
   npx hardhat verify --network sepolia <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
   \`\`\`

## 🏗 Architecture

### Frontend Stack
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + shadcn/ui components
- **Web3**: ethers.js for blockchain interaction
- **TypeScript**: Full type safety

### Smart Contracts
- **Language**: Solidity 0.8.19
- **Framework**: Hardhat
- **Testing**: Chai + Hardhat Network
- **Network**: Sepolia Testnet

### Key Components
- `useWallet`: Wallet connection and network management
- `useContract`: Smart contract interaction
- `SwapForm`: Token swapping interface
- `TokenBalance`: Balance display
- `PriceDisplay`: Real-time price information

## 📊 Contract Interface

The SimpleSwap contract provides:

\`\`\`solidity
// Swap functions
function swapAForB(uint256 amountA) external
function swapBForA(uint256 amountB) external

// Price queries
function getPrice() external view returns (uint256)
function getPriceAForB(uint256 amountA) external view returns (uint256)
function getPriceBForA(uint256 amountB) external view returns (uint256)

// Balance queries
function balanceOfA(address account) external view returns (uint256)
function balanceOfB(address account) external view returns (uint256)
\`\`\`

## 🔧 Configuration

### Supported Networks
- **Sepolia Testnet** (Primary)
- **Hardhat Local** (Development)

### Environment Variables
- `SEPOLIA_URL`: RPC endpoint for Sepolia
- `PRIVATE_KEY`: Deployment wallet private key
- `ETHERSCAN_API_KEY`: For contract verification
- `REPORT_GAS`: Enable gas reporting in tests

## 🧪 Test Coverage

The test suite achieves >50% coverage with tests for:

- ✅ Contract deployment and initialization
- ✅ Token swapping (A→B and B→A)
- ✅ Price management and updates
- ✅ Balance queries and tracking
- ✅ Admin functions (withdraw, price updates)
- ✅ Error handling and edge cases
- ✅ Event emissions
- ✅ Access control

## 🚨 Security Considerations

- All user inputs are validated
- Smart contract interactions use proper error handling
- Private keys are never exposed in frontend code
- Contract includes access control for admin functions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Ensure tests pass: `npm run hardhat:test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo**: [Your Vercel URL]
- **Contract on Sepolia**: [0x49F6fBbf46405536EB6a05fc4B21b874B9a879dE](https://sepolia.etherscan.io/address/0x49F6fBbf46405536EB6a05fc4B21b874B9a879dE)
- **GitHub Repository**: [Your GitHub URL]

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

---

Built with ❤️ using Next.js, Hardhat, and ethers.js
\`\`\`
\`\`\`

Finally, let's create a GitHub Actions workflow for CI/CD:

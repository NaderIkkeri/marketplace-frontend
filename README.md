# Project Name: [Enter Your Project Name Here]

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Tech Stack](https://img.shields.io/badge/tech-Next.js%20%7C%20Django%20%7C%20Solidity-brightgreen)

This project is a full-stack decentralized application (dApp) for a data marketplace. It allows users to publish, own, and purchase datasets using blockchain technology for verifiable ownership and IPFS for decentralized storage.

---

## Architecture Overview

The project is structured as a monorepo containing two main modules:

1.  **`/frontend`**: A Next.js/React application that serves as the user interface and primary client for interacting with the blockchain.
2.  **`/blockchain`**: A Hardhat project containing the Solidity smart contracts that act as the on-chain "source of truth".
3.  **`/backend`**: (Optional) A Django API that can be used as a secure bridge for advanced features like gasless transactions.

---

## Getting Started

Follow these instructions to set up and run the entire project locally.

### Prerequisites

* [**Node.js**](https://nodejs.org/) (v18 or later)
* [**Python**](https://www.python.org/downloads/) (v3.8 or later) & `pip`
* [**MetaMask**](https://metamask.io/download/) browser extension

### 1. Backend & Smart Contract Setup

First, set up and deploy the smart contract.

1.  **Navigate to the blockchain directory:**
    ```bash
    cd blockchain
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the `/blockchain` directory and add the following, filling in your own keys:
    ```
    SEPOLIA_RPC_URL="<your_alchemy_sepolia_rpc_url>"
    SEPOLIA_PRIVATE_KEY="<your_metamask_private_key>"
    ```

4.  **Deploy the contract to Sepolia:**
    ```bash
    npx hardhat run scripts/deploy.ts --network sepolia
    ```
    After running, **copy the deployed contract address** that is printed in the terminal. You will need it for the frontend setup.

### 2. Frontend Setup

Next, set up the user-facing application.

1.  **Navigate to the frontend directory:**
    ```bash
    # From the root directory
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    This project includes a helpful setup script. Run the following command:
    ```bash
    npm run setup
    ```
    The script will interactively prompt you for the following keys:
    * **Alchemy RPC URL** (for the Sepolia testnet)
    * **The Deployed Contract Address** (which you copied from the backend step)
    * **Pinata JWT** (for IPFS uploads)

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Your frontend will be available at [http://localhost:3000](http://localhost:3000).

---

## Troubleshooting

* **`MetaMask not detected`**: Make sure you are using a compatible browser (Chrome, Firefox, Brave) and that the MetaMask extension is installed and enabled.
* **`HardhatError: SEPOLIA_RPC_URL not found`**: Ensure the `.env` file exists in your `/blockchain` directory and is correctly named and populated. You may need to restart your terminal.
* **`Git Merge Conflicts`**: Always run `git pull origin main` on your `main` branch before creating a new feature branch to ensure you are working from the most up-to-date code.

---

## Contributing

We follow the standard feature-branch workflow.

1.  Create a new branch from `main`: `git checkout -b feature/my-new-feature`
2.  Make your changes and commit them.
3.  Push your branch to the repository: `git push origin feature/my-new-feature`
4.  Open a **Pull Request** on GitHub for review.

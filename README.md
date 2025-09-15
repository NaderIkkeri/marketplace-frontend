# Project Name: OnChainMarketplace - Frontend

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Tech Stack](https://img.shields.io/badge/tech-Next.js%20%7C%20Ethers.js%20%7C%20Solidity-brightgreen)

This is the frontend for a decentralized data marketplace. It's a Next.js application that allows users to connect their crypto wallets, browse datasets registered on the blockchain, and publish new datasets via IPFS.

This repository contains the user interface. The smart contracts and backend logic are located in a separate repository.

---

## Architecture Overview

This project is built using a **polyrepo** structure, with the backend and frontend in separate repositories to maintain a clean separation of concerns.

* **Backend Repository**: [**Link to your Backend Repository Here**]
    * Contains the Solidity smart contracts.
    * Managed with the Hardhat development environment.
    * Responsible for contract compilation, testing, and deployment.

* **Frontend Repository** (This one):
    * Contains the Next.js user interface.
    * Connects to users' wallets (e.g., MetaMask).
    * Interacts with the deployed smart contract via an RPC provider.
    * Handles file uploads to IPFS via a pinning service.

---

## Getting Started: A Complete "Zero-to-Running" Guide

Follow these instructions to set up and run the entire project locally.

### Prerequisites

Before you begin, ensure you have the following installed:

* [**Node.js**](https://nodejs.org/) (v18 or later)
* [**npm**](https://www.npmjs.com/) (comes with Node.js)
* A **MetaMask** browser extension ([download here](https://metamask.io/download/))
* Free accounts with [**Alchemy**](https://alchemy.com) and [**Pinata**](https://pinata.cloud).

### Part 1: Backend & Smart Contract Setup (Required First)

You must deploy the smart contract before the frontend can run properly.

1.  **Clone the Backend Repository:**
    ```bash
    git clone [URL_OF_YOUR_BACKEND_REPO]
    cd [backend-repo-name]
    ```

2.  **Install Backend Dependencies:**
    ```bash
    npm install
    ```

3.  **Set Up Backend Environment Variables:**
    Create a file named `.env` in the root of the backend project folder. Add your secrets:
    ```
    SEPOLIA_RPC_URL="<your_alchemy_sepolia_rpc_url>"
    SEPOLIA_PRIVATE_KEY="<your_metamask_private_key>"
    ```

4.  **Get Testnet ETH:**
    Make sure the wallet associated with your `SEPOLIA_PRIVATE_KEY` has some Sepolia ETH for gas fees. You can get some from a [Proof-of-Work Faucet](https://sepolia-faucet.pk910.de/).

5.  **Deploy the Contract:**
    Run the deployment script. This will compile and deploy your contract to the Sepolia testnet.
    ```bash
    npx hardhat run scripts/deploy.ts --network sepolia
    ```
    After a successful deployment, the terminal will print a message like `Contract deployed to: 0x...`. **Copy this deployed contract address.** You will need it in the next part.

### Part 2: Frontend Setup (This Repository)

Now, let's set up the user-facing application.

1.  **Clone This Frontend Repository (in a new terminal window):**
    ```bash
    git clone [URL_OF_YOUR_FRONTEND_REPO]
    cd [frontend-repo-name]
    ```

2.  **Install Frontend Dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Frontend Environment Variables:**
    This project includes a helpful setup script. Run the following command:
    ```bash
    npm run setup
    ```
    The script will interactively prompt you for your personal API keys. You will also need the contract address from the backend setup.

4.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    Your frontend will now be available at [**http://localhost:3000**](http://localhost:3000).

---

## Contributing

We follow the standard feature-branch Git workflow.

1.  Ensure your `main` branch is up-to-date: `git checkout main && git pull origin main`
2.  Create a new branch for your feature: `git checkout -b feature/my-new-feature`
3.  Make your changes and commit them with a clear message.
4.  Push your branch to the repository: `git push origin feature/my-new-feature`
5.  Open a **Pull Request** on GitHub for review and merging.

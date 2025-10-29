# Project Name: ChainMarket - Frontend

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Tech Stack](https://img.shields.io/badge/tech-Next.js%20%7C%20Ethers.js%20%7C%20TypeScript-brightgreen)

This is the frontend for a decentralized data marketplace. It allows users to connect their crypto wallets, browse datasets registered on the blockchain, and publish new datasets via IPFS.

This repository contains the user interface. The smart contracts are located in a separate repository here: **[Link to your Backend Repository]**

---

## Getting Started

To run the full application, you must set up the backend (smart contract) first, and then the frontend.

### Prerequisites

* [**Node.js**](https://nodejs.org/) (v18 or later)
* A **MetaMask** browser extension ([download here](https://metamask.io/download/))
* Free accounts with [**Alchemy**](https://alchemy.com) and [**Pinata**](https://pinata.cloud).

### Part 1: Backend & Smart Contract Setup (Required First)

1.  Clone and set up the backend repository by following the instructions in its `README.md` file.
2.  Deploy the smart contract to the Sepolia testnet.
3.  **Copy the deployed contract address**. You will need to add this to the frontend code.

### Part 2: Frontend Setup (This Repository)

1.  **Clone this repository:**
    ```bash
    git clone [URL_OF_YOUR_FRONTEND_REPO]
    cd [frontend-repo-name]
    ```

2.  **Add the Contract Address:**
    Open the file at `src/config.ts` and paste the deployed contract address you copied from the backend setup.

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Set up your environment variables:**
    Run the setup script. It will interactively prompt you for your personal API keys.
    ```bash
    npm run setup
    ```

5.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The frontend will now be available at [**http://localhost:3000**](http://localhost:3000).

---

## Contributing

1.  Ensure your `main` branch is up-to-date: `git checkout main && git pull origin main`
2.  Create a new branch for your feature: `git checkout -b feature/my-new-feature`
3.  Make your changes and commit them with a clear message.
4.  Push your branch to the repository.
5.  Open a **Pull Request** on GitHub for review and merging.

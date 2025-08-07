
## 📑 Table of Contents

- [Description](#description)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [Local Setup](#local-setup)
- [How to Contribute](#how-to-contribute)

---

# 📘 Description

**React + Vite Expense Tracker**

A simple and user-friendly expense tracking application built with **React.js**, powered by **Vite** for fast builds and development. It includes functionality for managing transactions, tracking expenses and EMIs, managing beneficiaries, and viewing dashboard analytics — all backed by a mock API using **JSON Server**.

---

# 🧰 Tech Stack

- **React.js** – for the user interface
- **Vite** – build tool for faster development
- **MUI (Material UI)** – for modern, responsive UI components
- **Axios** – for HTTP requests
- **dayjs** – for date formatting and manipulation
- **JSON Server** – mock backend for storing and managing data

---

# 🖼️ Screenshots

### 📊 Dashboard

<img src="public/assets/images/dashboard0.png" alt="dashboard" width="100%" />

---

### 🧾 List of Transactions

<img src="public/assets/images/list.png" alt="transactions" width="100%" />

---

### 📈 Status Overview

<img src="public/assets/images/status.png" alt="status" width="100%" />

---

### 👥 Beneficiaries

<img src="public/assets/images/beneficeries.png" alt="beneficiaries" width="100%" />

---

### 🏦 Loan Section

<img src="public/assets/images/loan.png" alt="loan" width="100%" />

---

# 🛠️ Local Setup

Follow these steps to run the project locally:

1. **Install dependencies**

   ```bash
   npm i
   ```

2. **Create the mock database**

   - Create a `users.json` file in the root directory.
   - Add the following arrays to it:
     ```json
     {
       "users": [],
       "transactions": [],
       "beneficiaries": [],
       "loan": []
     }
     ```

3. **Start JSON Server**

   ```bash
   json-server --watch users.json --port 8000
   ```

4. **Create environment variables**

   Create a `.env` file and add:

   ```env
   VITE_REGISTERED_USER=http://localhost:8000/users
   VITE_USER_TRANSACTIONS=http://localhost:8000/transactions
   VITE_USER_LOAN=http://localhost:8000/loan
   VITE_USER_BENEFICIARIES=http://localhost:8000/beneficiaries
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

   The app will run at: [http://localhost:5000](http://localhost:5000)

---

# 🤝 How to Contribute

Contributions are welcome! To contribute:

1. **Clone the repository**

   ```bash
   git clone https://github.com/Pankaj17git/Expense-Tracker.git
   ```

2. **Create a new branch**

   ```bash
   git checkout -b your-feature-name
   ```

3. **Make your changes and test locally**

4. **Submit a Pull Request**  
   - Describe your changes clearly.  
   - If you suggest improvements, feel free to include them as well.

---

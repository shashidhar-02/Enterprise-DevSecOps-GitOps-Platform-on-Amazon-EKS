

```markdown
<div align="center">

# 🍔 CraveDrop

**A Gen-Z vibe food delivery platform built with a modern 3-tier architecture.** *React Frontend • Node.js API • PostgreSQL Database*

<br />

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)
![AWS EC2](https://img.shields.io/badge/AWS_EC2-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)

<br />

<img src="https://via.placeholder.com/800x400/1a1a1a/ffffff?text=📸+Drop+Your+App+Screenshot+Here" alt="CraveDrop UI Screenshot" style="border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">

</div>

---

> [!IMPORTANT]
> **Looking for the full DevSecOps implementation?**
> Switch to the [`devops`](../../tree/devops) branch for Docker, Kubernetes (EKS Auto Mode), Terraform, CI/CD with GitHub Actions, container security scanning, and more.
>
> ```bash
> git checkout devops
> ```

---

## ✨ Features

- 🍕 **Browse Restaurants:** Explore full menus, categories, and vibrant UI cards.
- 🛒 **Place Orders:** Seamless checkout experience and delivery tracking.
- ⭐ **Leave Reviews:** Rate your favorite meals and share your foodie opinions.
- 🗑️ **Manage Platform:** Cancel active orders or remove restaurants dynamically.
- 🎨 **Cinematic UI:** Gen-Z dark mode with glassmorphism, smooth gradients, and clean aesthetics.

## 🏗️ Architecture

```text
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend   │────▶│   Backend    │────▶│  PostgreSQL   │
│   (React +   │◀────│  (Node.js +  │◀────│              │
│    Nginx)    │     │   Express)   │     │              │
│   Port 80    │     │  Port 5000   │     │  Port 5432   │
└──────────────┘     └──────────────┘     └──────────────┘

```

## 📁 Project Structure

```text
CraveDrop/
├── .github/workflows/       # CI/CD & AI Security Pipelines
├── frontend/                # React (Vite) frontend
│   ├── src/                 # React components & pages
│   ├── Dockerfile           # Production containerization
│   ├── nginx.conf           # Secure Nginx config for Docker
│   └── package.json
├── backend/                 # Node.js Express API
│   ├── src/                 # API Routes (Orders, Restaurants, Reviews)
│   ├── Dockerfile           # Secure multi-stage build
│   └── package.json
├── deploy/                  # EC2 bare-metal deployment scripts
│   ├── setup.sh             # One-click Ubuntu EC2 setup script
│   └── cravedrop-nginx.conf # Nginx reverse proxy config
└── README.md

```

---

## 🚀 Deploy on AWS EC2

### Prerequisites

* An AWS EC2 instance running **Ubuntu 22.04+**
* Security Group allowing inbound traffic on ports **22** (SSH) and **80** (HTTP)
* SSH access to the instance

### Step 1: Transfer the Code to EC2

```bash
# From your local machine
scp -r -i your-key.pem ./CraveDrop ubuntu@<EC2_PUBLIC_IP>:~/CraveDrop

```

### Step 2: SSH into the Instance

```bash
ssh -i your-key.pem ubuntu@<EC2_PUBLIC_IP>

```

### Step 3: Run the Setup Script

The `deploy/setup.sh` script installs everything and configures the app automatically:

```bash
cd ~/CraveDrop
chmod +x deploy/setup.sh
./deploy/setup.sh

```

**This script will automatically:**

1. Update system packages.
2. Install **Node.js 20.x**, **PostgreSQL 16**, **Nginx**, and **PM2**.
3. Create the database (`cravedrop_db`) and secure user profile.
4. Install backend dependencies & generate the `.env` file.
5. Build the optimized React frontend.
6. Configure Nginx as a secure reverse proxy.
7. Start the backend with PM2 (ensuring it auto-restarts on crash/reboot).

### Step 4: Access the App

Open your browser and navigate to your public IP:

```text
http://<EC2_PUBLIC_IP>

```

### Useful Server Commands

```bash
pm2 status                            # Check backend status
pm2 logs                              # View live backend logs
pm2 restart all                       # Restart backend
sudo systemctl restart nginx          # Restart Nginx server
sudo -u postgres psql -d cravedrop_db # Connect to production database

```

---

## 🧑‍💻 Local Development (Without Docker)

### Prerequisites

* Node.js 20+
* PostgreSQL 16+

### 1. Backend Setup

```bash
cd backend
npm install

# Create a .env file (or export these variables)
export DB_HOST=localhost
export DB_PORT=5432
export DB_USER=cravedrop_user
export DB_PASSWORD=cravedrop_pass_2026
export DB_NAME=cravedrop_db
export PORT=5000

npm start

```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev

```

> **Note:** The Vite dev server starts on `http://localhost:3000` and automatically proxies all `/api` requests to the backend at `http://localhost:5000`.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Health check |
| `GET` | `/api/restaurants` | Get all restaurants with review counts |
| `GET` | `/api/restaurants/:id` | Get single restaurant with its reviews |
| `POST` | `/api/restaurants` | Add a new restaurant |
| `PUT` | `/api/restaurants/:id` | Update restaurant details |
| `DELETE` | `/api/restaurants/:id` | Remove a restaurant |
| `POST` | `/api/orders` | Place a new food order |
| `GET` | `/api/orders/user/:userId` | Get order history for a specific user |
| `DELETE` | `/api/orders/:id` | Cancel an order |
| `GET` | `/api/reviews/restaurant/:id` | Get reviews for a specific restaurant |
| `POST` | `/api/reviews` | Leave a review and rating |
| `DELETE` | `/api/reviews/:id` | Delete a review |

---

## 🌿 Branch Strategy

| Branch | Purpose |
| --- | --- |
| **`main`** | Source code + EC2 bare-metal deployment |
| **`devops`** | Full DevSecOps — Docker, Kubernetes (EKS), Terraform, CI/CD pipeline, security scanning |

---

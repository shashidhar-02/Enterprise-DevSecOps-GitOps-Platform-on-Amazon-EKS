It looks like you might have accidentally copied the rendered rich text instead of the raw code!

Here is the exact raw Markdown code block for you to copy and paste directly into your `README.md` file so all the formatting, tables, code blocks, and emojis render perfectly on GitHub.

```markdown
# 🍔 CraveDrop — Food Delivery Platform

A Gen-Z vibe food delivery platform built with a 3-tier architecture — React frontend, Node.js backend, and PostgreSQL database.

![Tech Stack](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Tech Stack](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=node.js)
![Tech Stack](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql)

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

- 🍕 **Browse Restaurants** with full menus and categories
- 🛒 **Place Orders** and track delivery status
- ⭐ **Leave Reviews** and rate your favorite meals
- 🗑️ **Cancel Orders** or remove restaurants from the platform
- 🎨 **Gen-Z dark UI** with glassmorphism and smooth gradients

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

This script will:

1. Update system packages
2. Install **Node.js 20.x**, **PostgreSQL 16**, **Nginx**, and **PM2**
3. Create the database (`cravedrop_db`) and user
4. Install backend dependencies & auto-generate `.env`
5. Build the React frontend
6. Configure Nginx as a reverse proxy
7. Start the backend with PM2 (auto-restarts on crash/reboot)

### Step 4: Access the App

Open your browser and go to:

```text
http://<EC2_PUBLIC_IP>

```

### Useful Commands

```bash
pm2 status                            # Check backend status
pm2 logs                              # View backend logs
pm2 restart all                       # Restart backend
sudo systemctl restart nginx          # Restart Nginx
sudo -u postgres psql -d cravedrop_db # Connect to database

```

---

## 🧑‍💻 Local Development (Without Docker)

### Prerequisites

* Node.js 20+
* PostgreSQL 16+

### Backend

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

### Frontend

```bash
cd frontend
npm install
npm run dev

```

The Vite dev server starts on `http://localhost:3000` and proxies `/api` requests to the backend at `http://localhost:5000`.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/health` | Health check |
| GET | `/api/restaurants` | Get all restaurants with review counts |
| GET | `/api/restaurants/:id` | Get single restaurant with its reviews |
| POST | `/api/restaurants` | Add a new restaurant |
| PUT | `/api/restaurants/:id` | Update restaurant details |
| DELETE | `/api/restaurants/:id` | Remove a restaurant |
| POST | `/api/orders` | Place a new food order |
| GET | `/api/orders/user/:userId` | Get order history for a specific user |
| DELETE | `/api/orders/:id` | Cancel an order |
| GET | `/api/reviews/restaurant/:id` | Get reviews for a specific restaurant |
| POST | `/api/reviews` | Leave a review and rating |
| DELETE | `/api/reviews/:id` | Delete a review |

---

## 🌿 Branch Strategy

| Branch | Purpose |
| --- | --- |
| `main` | Source code + EC2 bare-metal deployment |
| `devops` | Full DevSecOps — Docker, Kubernetes (EKS), Terraform, CI/CD pipeline, security scanning |

---

Built with 🍕 by the CraveDrop team. No cap, this delivery app hits different. 🛵

```

```

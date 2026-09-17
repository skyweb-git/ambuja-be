# constru-backed

# 🏰 Maytri Ambhuja Real Estate CRM Backend API (Node.js + Express + MongoDB)

Production-ready backend API service for **Maytri Ambhuja Luxury Villa Township Landing Page** and **Admin CRM Dashboard**.

---

## ⚡ Quick Specs

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB Atlas Cloud
- **ORM**: Mongoose
- **Default Port**: `5000`

---

## 🗄️ Database & Environment Configuration

Create or verify `.env` in the `server` directory:

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://inchinchwebsupport_db_user:iZIrMrk5CTcJ8pTo@cluster0.hvqw3yu.mongodb.net/maytri_crm?retryWrites=true&w=majority&appName=Cluster0
CORS_ORIGIN=*
```

---

## 🚀 Local Development

```bash
# 1. Navigate to the server directory
cd server

# 2. Install dependencies
npm install

# 3. Seed initial data (optional, server auto-seeds if empty)
npm run seed

# 4. Start the server in watch mode
npm run dev

# 5. Or run production start
npm start
```

---

## 🌐 API Endpoints Reference

### 1. Health & Server Status
- `GET /api/health` — Checks database and server uptime.
- `GET /` — API root and documentation links.

### 2. Leads Management
- `GET /api/leads` — List all leads (supports query params: `?status=New`, `?search=verma`, `?limit=50`).
- `GET /api/leads/:id` — Get single lead details.
- `POST /api/leads` — Create a new enquiry (used by landing page forms & modals).
- `PUT /api/leads/:id` — Update lead status, notes, assignment, or follow-up date.
- `DELETE /api/leads/:id` — Delete a lead.

### 3. Employees & Staff
- `GET /api/employees` — Fetch all marketing & sales staff.
- `POST /api/employees` — Add a new employee.
- `PUT /api/employees/:id` — Edit employee details / status (Active/Inactive).
- `DELETE /api/employees/:id` — Remove employee account.

### 4. Telecalling & Email Outreach Activity
- `GET /api/activity/calls` — Fetch call history logs (`?employeeId=...`, `?leadId=...`).
- `POST /api/activity/calls` — Log a telecalling conversation and outcome.
- `GET /api/activity/emails` — Fetch dispatched email logs.
- `POST /api/activity/emails` — Log dispatched email template to lead.

### 5. Authentication & Analytics
- `POST /api/auth/login` — Login for Master Admin (`admin@maytri.com` / `admin123`) or Staff Accounts.
- `GET /api/auth/analytics` — Real-time metrics (Total Leads, Status distribution, Calls logged, Emails sent).

---

## ☁️ How to Host Online (Free & Fast Deployment Options)

### Option 1: Deploy on Render.com (Recommended Free / Low-Cost)
1. Push this project to your GitHub repository.
2. Go to [Render.com](https://render.com) and click **New + Web Service**.
3. Select your repository and configure:
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. In **Environment Variables**, add:
   - `MONGODB_URI` = `mongodb+srv://inchinchwebsupport_db_user:iZIrMrk5CTcJ8pTo@cluster0.hvqw3yu.mongodb.net/maytri_crm?retryWrites=true&w=majority&appName=Cluster0`
   - `NODE_ENV` = `production`
   - `CORS_ORIGIN` = `*`
5. Click **Create Web Service**. Your live backend URL will be e.g. `https://maytri-api.onrender.com`.

### Option 2: Deploy on Railway.app
1. Go to [Railway.app](https://railway.app) and create a New Project from GitHub.
2. Point the service to the `/server` subfolder.
3. Add the `MONGODB_URI` variable under **Variables**.
4. Railway will automatically deploy and generate a public HTTPS URL.

### Option 3: Deploy on VPS (Ubuntu / DigitalOcean / AWS EC2)
```bash
git clone <your-repo-url>
cd server
npm install --production
npm install -g pm2
pm2 start server.js --name "maytri-api"
pm2 save
pm2 startup
```

---

## 🔐 Default Master Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| **Main Admin** | `admin@maytri.com` | `admin123` |
| **Marketing Lead** | `kavitha.marketing@maytri.com` | `emp123` |
| **Telecalling Specialist** | `rahul.sales@maytri.com` | `emp123` |
| **NRI & Luxury Sales** | `pooja.outreach@maytri.com` | `emp123` |

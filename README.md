# 🚀 BeyondChats Blog Scraper & AI Enhancer

A full-stack web application that **scrapes legacy blog articles from BeyondChats**, enhances them using **AI-driven content rewriting** based on top-ranking Google articles, and presents both **original and enhanced versions** in a modern, responsive UI.

This project was developed as part of the **Full Stack Web Developer Intern assignment at BeyondChats** and is structured into **three distinct phases** to ensure scalability, maintainability, and clean separation of concerns.

---

## 🔗 Live Links

- **Frontend (React + Tailwind CSS)**  
  👉 https://beyondchats-frontend.onrender.com

- **Backend API (Node.js + Express)**  
  👉 https://beyondchats-blog-scraper-ai-enhancer.onrender.com

- **Sample API Endpoint**  
  👉 https://beyondchats-blog-scraper-ai-enhancer.onrender.com/api/articles

---

## 📌 Project Overview

The system follows a **three-phase architecture**:

### 🟢 Phase 1 – Backend & Scraping
- Scraped the **oldest blog articles** from BeyondChats.
- Extracted:
  - Article title
  - Slug
  - Full content
- Stored data in **MongoDB Atlas**.
- Built complete **CRUD REST APIs** using Express.js.

---

### 🟡 Phase 2 – AI Enhancement Pipeline
- Built a **standalone Node.js pipeline** (fully decoupled from backend).
- For each original article:
  - Searches Google for **top-ranking related articles**.
  - Scrapes reference article content.
  - Uses **Google Gemini LLM** to rewrite and enhance content.
  - Publishes enhanced articles via backend APIs.
  - Adds proper **reference citations**.
- 🚫 **Not deployed intentionally** — executed manually for controlled batch processing.

---

### 🔵 Phase 3 – Frontend
- Built using **React + Vite + Tailwind CSS**.
- Displays:
  - Original articles
  - AI-enhanced articles
- Fully responsive and **production-deployed**.

---

## 🧱 Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Axios
- Cheerio

### AI / Automation
- Google Search scraping
- Google Gemini API (LLM)

### Frontend
- React (Vite)
- Tailwind CSS
- Fetch API

### Deployment
- Render (Backend & Frontend)
- MongoDB Atlas

---

## 🗂️ Project Structure

```shell
BeyondChats-Blog-Scraper-AI-Enhancer/
│
├── server/ # Backend (Phase 1)
│ ├── src/
│ │ ├── routes/
│ │ ├── controllers/
│ │ ├── models/
│ │ └── server.js
│ └── package.json
│
├── ai-pipeline/ # AI Enhancement Pipeline (Phase 2 - Local only)
│ ├── scripts/
│ └── index.js
│
├── client/ # Frontend (Phase 3)
│ ├── src/
│ ├── public/
│ └── package.json
│
└── README.md
```

---

## 🔁 Data Flow & Architecture

1. **Scraper (Phase 1)**  
   Scrapes legacy BeyondChats blog articles and stores them in MongoDB.

2. **Backend APIs (Phase 1)**  
   Exposes CRUD endpoints for article management.

3. **AI Pipeline (Phase 2)**  
   Fetches original articles → scrapes Google reference articles → rewrites using Gemini → publishes enhanced content.

4. **Frontend (Phase 3)**  
   Fetches articles from backend APIs and displays original & enhanced versions.

---

## ⚙️ Local Setup Instructions


### 1. Clone the repository

```shell
git clone https://github.com/Akhilvarma12/BeyondChats-Blog-Scraper-AI-Enhancer.git
cd BeyondChats-Blog-Scraper-AI-Enhancer
```

### 2️. Backend Setup

```shell
cd server
npm install
```


### 3. Create a .env file inside server/

```js
MONGODB_URI=...
```

### 4. Start backend 

```shell
node src/server.js

```

### 5. Frontend Setup

```shell
cd client
npm install
```


### 6. Create a .env file inside server/

```js
VITE_SERVER_BASE_URL=...
```

### 7. Start backend 

```shell
npm run dev

```

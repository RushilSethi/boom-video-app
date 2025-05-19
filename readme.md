# BOOM Short Video App 🎬

A basic short-video platform built for BOOM Entertainment's Full Stack Mobile App Developer assignment — built with React, Node.js, and MongoDB.

---

## 🚀 Features

- 🔐 User Registration & Login (JWT-based)
- 📹 Upload short videos with a title
- 🧾 Video feed with preview player, title, and like button
- ❤️ Like videos (visual + backend update)
- 📁 Videos stored locally and served statically
- ✨ Clean UI with breadcrumb navigation and minimal layout

---

## 🧑‍💻 Tech Stack

- **Frontend:** React (Vite), Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB (with Mongoose)
- **Storage:** Local disk via Multer
- **Auth:** JWT-based (simple, no bcrypt)

---

## 🔧 Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/RushilSethi/boom-video-app
cd boom-video-app
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start the server:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

The app will run at `http://localhost:5173` and connect to `http://localhost:5000`.

---

## 🎥 Demo

📺 [Watch the demo video here](https://drive.google.com/file/d/1NM5i1Bx46NqBTsIa8914PWdLA2qnva5N/view?usp=sharing)


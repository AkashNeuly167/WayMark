# WayMark

WayMark is a full-stack MERN travel community app where users can share travel memories, upload images, discover travelers, like and comment on memories, manage bucket-list destinations, view notifications, and track personal travel stats.

## Live Links

**Frontend:** https://way-mark-xi.vercel.app

**Backend:** https://waymark-5a5v.onrender.com

## Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* React Router
* Axios
* Lucide React
* Vercel

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication
* bcryptjs
* Cloudinary
* Swagger
* Render

## Features

* User registration and login with JWT authentication
* Protected routes for logged-in users
* Create travel memories with image upload
* View feed of memories
* Like and unlike memories
* Add and delete comments
* Search travelers and memories
* Explore page with quick search chips and tabs
* Public traveler profiles
* Edit own profile
* Follow and unfollow users
* Notification system for follows, likes, and comments
* Mark notifications as read
* Bucket list page
* Add, edit, delete, and mark bucket-list destinations as visited
* Journey page grouped by country and city
* Travel Wrapped page with yearly travel stats
* Settings page with logout
* Mobile responsive UI
* Custom toast notifications
* Custom confirmation dialogs
* Skeleton loading states
* Production deployment on Vercel and Render

## Environment Variables

### Frontend

Create a `.env` file inside `waymark-client`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

For production on Vercel:

```env
VITE_API_BASE_URL=https://waymark-5a5v.onrender.com/api
```

### Backend

Create a `.env` file inside `waymark-server`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

For production on Render:

```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=https://way-mark-xi.vercel.app

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## How to Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/AkashNeuly167/WayMark.git
cd WayMark
```

### 2. Install backend dependencies

```bash
cd waymark-server
npm install
```

Create `.env` inside `waymark-server` and add the backend environment variables.

Start backend:

```bash
npm run dev
```

Backend will run on:

```txt
http://localhost:5000
```

Swagger API docs:

```txt
http://localhost:5000/api-docs
```

### 3. Install frontend dependencies

Open a new terminal:

```bash
cd waymark-client
npm install
```

Create `.env` inside `waymark-client` and add:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start frontend:

```bash
npm run dev
```

Frontend will run on:

```txt
http://localhost:5173
```

## Build Frontend

```bash
cd waymark-client
npm run build
```

## Run Backend in Production Mode

```bash
cd waymark-server
npm start
```

## Deployment

### Frontend

The frontend is deployed on Vercel.

Important production environment variable:

```env
VITE_API_BASE_URL=https://waymark-5a5v.onrender.com/api
```

The project includes a `vercel.json` file to support React Router refresh on deployed routes.

### Backend

The backend is deployed on Render.

Important production environment variable:

```env
CLIENT_URL=https://way-mark-xi.vercel.app
```

The backend allows requests from the deployed Vercel frontend using CORS.

## Project Structure

```txt
WayMark
├── waymark-client
│   ├── src
│   │   ├── api
│   │   ├── components
│   │   ├── context
│   │   ├── pages
│   │   ├── routes
│   │   ├── services
│   │   └── utils
│   └── package.json
│
└── waymark-server
    ├── src
    │   ├── config
    │   ├── controllers
    │   ├── middlewares
    │   ├── models
    │   ├── routes
    │   └── utils
    └── package.json
```

## Author

Built by Akash Neuly.

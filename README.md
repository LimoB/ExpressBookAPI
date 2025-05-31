📚 Book API Backend with Drizzle ORM & PostgreSQL
A robust, RESTful API for managing a Book platform with secure user authentication and role-based authorization, built using Node.js, Express, Drizzle ORM, and PostgreSQL.

🚀 Features
✅ User Authentication (Register, Login with JWT)

✅ Role-based Authorization (Admin & Member)

✅ CRUD Operations for:

📚 Books

🏷️ Genres (optional)

✍️ Authors (optional)

✅ Secure Password Hashing (bcrypt)

✅ Middleware Logger

✅ Drizzle ORM with PostgreSQL

✅ Postman Collection Available

📦 Tech Stack
Layer	Tech
Backend Framework	Node.js + Express
ORM	Drizzle ORM
Database	PostgreSQL
Authentication	JWT + bcrypt
Validation	TypeScript + express
Documentation	Postman Collection

📚 API Endpoints
🔑 Authentication
POST /api/auth/register - Register a new user
POST /api/auth/login - Login user and receive JWT token

👤 Users (Requires Bearer Token)
GET /api/users - Get all users
GET /api/users/:id - Get user by ID
POST /api/users - Create user
PUT /api/users/:id - Update user
DELETE /api/users/:id - Delete user

📚 Books (Requires Bearer Token)
GET /api/books - Get all books
GET /api/books/:id - Get book by ID
POST /api/books - Create book
PUT /api/books/:id - Update book
DELETE /api/books/:id - Delete book

Genres & Authors (Optional Routes Available)

🔒 Authentication Flow
Register a user (POST /api/auth/register)

Login and receive a JWT token (POST /api/auth/login)

Include the token in Authorization: Bearer {token} for protected routes

🗂 Database Tables (ER Diagram)
users: userId, fullName, email, password (hashed), userType

books: bookId, title, description, userId (FK)
(Genres & Authors optional)

⚙️ Setup Instructions
1️⃣ Clone the Repository



git clone https://github.com/your-username/book-api-backend.git
cd book-api-backend
2️⃣ Install Dependencies


npm install
3️⃣ Configure .env


PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/bookapidb
JWT_SECRET=yourSecretKey
4️⃣ Run Database Migrations


npx drizzle-kit push
5️⃣ Start the Server


npm run dev
6️⃣ Test with Postman
✅ Import the provided Postman Collection
✅ Use Bearer Token for Authorization

🌟 Author & License
👤 Boaz Limo
📧 boazlimo07@example.com
📜 MIT License


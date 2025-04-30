StudyNotion - README
Overview
EdTech is a comprehensive online learning platform built with the MERN stack (MongoDB, Express.js, React, Node.js) that enables instructors to create and manage courses while allowing students to discover, purchase, and learn from these courses. The platform features complete authentication and authorization systems, course management tools, payment integration, and a rich learning interface.

Key Features
For Students:
User registration and profile management

Course browsing and searching

Course purchasing with payment integration

Interactive learning dashboard

Progress tracking

Course reviews and ratings

For Instructors:
Instructor registration and verification

Course creation and management

Section and lesson organization

Multimedia content upload

Student enrollment tracking

Revenue dashboard

Technical Features:
JWT-based authentication

Role-based authorization (Student/Instructor/Admin)

Redux for state management

Responsive UI with Tailwind CSS

Secure payment processing

File upload capabilities

RESTful API architecture

Technologies Used
Frontend:
React.js

Redux (State Management)

React Router (Routing)

Tailwind CSS (Styling)

Axios (HTTP Client)

Formik & Yup (Form Handling)

Various React Icons

Backend:
Node.js

Express.js

MongoDB (Database)

Mongoose (ODM)

JSON Web Tokens (Authentication)

Bcrypt (Password Hashing)

Multer (File Uploads)

Nodemailer (Email Services)

Payment Integration:
Razorpay API

Installation
Prerequisites:
Node.js (v14 or later)

MongoDB (v4.4 or later)

npm or yarn

Backend Setup:
Clone the repository

Navigate to the backend directory: cd backend

Install dependencies: npm install

Create a .env file based on .env.example

Start the server: npm run dev

Frontend Setup:
Navigate to the frontend directory: cd frontend

Install dependencies: npm install

Create a .env file based on .env.example

Start the development server: npm start
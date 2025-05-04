# 🎓 StudyNotion

**StudyNotion** is a full-featured EdTech platform that enables users to register as **students** or **instructors**. Students can browse and purchase courses, while instructors can create and publish their own. The platform includes secure authentication, payment integration, and robust state management.

---

## 🚀 Features

### 👨‍🏫 Instructor
- Create, edit, and manage courses
- Upload course content (videos, descriptions, prices)
- Publish courses to the platform

### 🎓 Student
- Browse available courses
- Purchase courses via Razorpay (test mode)
- View enrolled courses and track progress

### 🔐 Authentication
- JWT-based login and registration
- Role-based access for students and instructors
- Password hashing and security best practices

### 💳 Payments
- Integrated with **Razorpay** for handling payments (currently in **test mode**)

### 🧠 State Management
- Implemented using **Redux Toolkit** for seamless state updates and global state sharing

---

## 🛠 Tech Stack

| Tech             | Description                                  |
|------------------|----------------------------------------------|
| **Frontend**     | React.js, TailwindCSS, Redux Toolkit         |
| **Backend**      | Node.js, Express.js                          |
| **Database**     | MongoDB + Mongoose                           |
| **Authentication** | JWT, Bcrypt                                |
| **Payments**     | Razorpay (test mode)                         |
| **State Mgmt.**  | Redux                                        |
| **Others**       | Cloudinary (for media), dotenv, cors         |

---

## 📸 Screenshots

> _Include here if you have any screenshots or demo gifs of your app._

---

## 🧑‍💻 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/studyNotion.git
cd studyNotion

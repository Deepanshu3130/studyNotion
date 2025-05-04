# 🎓 StudyNotion

**StudyNotion** is a full-featured EdTech platform that enables users to register as **students** or **instructors**. Students can browse and purchase courses, while instructors can create and publish their own. The platform includes secure authentication, payment integration, and robust state management.<br/>
📧 Email Notice:
If you don't see the verification or notification email in your inbox, please check your Spam or Junk folder.
To avoid this in the future, mark the email as "Not Spam."



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


## 🧑‍💻 Getting Started

### 1. Clone the repository

```
git clone https://github.com/your-username/studyNotion.git
cd studyNotion
```

### 2. Install dependencies
For both client and server:
```
 cd frontend
  npm install
cd server
 npm install
```
### 3. Set up environment variables
Create a .env file in the server folder with the following:
```
MAIL_HOST=smtp.gmail.com
MAIL_USER=Your email id
MAIL_PASS=find it form google
CORS_ORIGIN = ["http://localhost:3000"]


JWT_SECRET="your secret"
FOLDER_NAME="your cloudinary folder name"

RAZORPAY_KEY=""
RAZORPAY_SECRET=""


PORT = 4000
database_url= your db url

CLOUD_NAME="your cloudinary name "
API_KEY="cloudinary =api key"
API_SECRET="cloudinary secret key"
```
### 4. Run the application
```
# start backend
cd server
node index.js
#start frontend
cd frontend 
npm start
```

📢 Notes
Razorpay is currently in test mode, use test card details provided by Razorpay documentation.

Only authenticated users can access dashboards.

Role-based components ensure students and instructors have separate views and controls.

🤝 Contributing
Feel free to fork this repository and contribute. Pull requests are welcome!



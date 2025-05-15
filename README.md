Markdown

# 🧾 POS System – Backend API for Inventory & Billing

This project is a backend-only Point of Sale (POS) system designed to manage product inventory and billing operations through secure role-based access control (RBAC). Developed using Node.js, Express, and MongoDB, it provides a reliable backend for retail environments or small businesses needing structured inventory control and billing logic.

## 🚀 Features

* **Role-Based Access Control**
    * **Admin:** Add/edit/delete products, view stock and billing data.
    * **Employee:** Handle billing, update stock, raise inventory issues.
* **Real-Time Inventory Management**
    * Track product quantities in MongoDB.
    * Automatically update stock on transactions.
    * Low-stock alert system.
* **Bulk Product Upload**
    * Upload products via Excel sheet for fast inventory setup.
* **Email Notifications (Nodemailer)**
    * Password recovery via secure email reset codes.
    * Low stock notifications to admins.
* **Billing Reports**
    * Access to detailed, downloadable billing records.

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Email Service:** Nodemailer
* **Utilities:** Excel file parsing, dotenv for config

## ⚙️ Setup & Installation

**Prerequisites:**

* Node.js and npm installed
* MongoDB running locally or remotely

**Installation Steps:**

```bash
git clone [https://github.com/kartikeya-datta/POS-system.git](https://github.com/kartikeya-datta/POS-system.git)
cd POS-system
npm install
```

Environment Variables (.env):

```bash
PORT=3000
MONGO_URI=mongodb://localhost:27017/pos_system
EMAIL_SERVICE=your_email_service
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

Start Server:

Bash
```bash
npm start
```

🤝 Contributing
Contributions are welcome! Open issues or submit pull requests for new features or improvements.

📄 License
This project is licensed under the MIT License.

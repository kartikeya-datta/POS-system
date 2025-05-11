# POS System

This project is a **Point of Sale (POS) System** designed to provide comprehensive role-based access control (RBAC), efficient inventory management, and an enhanced user experience. The system is built using **Node.js** for the backend and **JavaScript**, **HTML**, and **CSS** for the frontend. The system is aimed at improving operational efficiency in retail environments by offering real-time inventory tracking and streamlined management features.

## Features

### 1. Role-Based Access Control (RBAC)
- **Admin Role**:
  - Manages inventory by adding, editing, and deleting products.
  - Can view detailed reports and data visualizations of stock and billing information.
- **Employee Role**:
  - Handles billing and product management.
  - Can update billing information and report stock issues.

### 2. Real-Time Inventory Management
- **MongoDB** is used to manage inventory data, providing real-time tracking and updates.
- Admins can monitor product levels in real-time and receive low-stock notifications.
- Employees can update inventory during transactions, ensuring up-to-date stock information.

### 3. Email Notifications with Nodemailer
- The system integrates **Nodemailer** to send real-time email alerts and notifications for:
  - **Low stock warnings**.
  - **Password recovery** with reset codes sent to registered email addresses.

### 4. Enhanced User Experience
- Built with **JavaScript**, **HTML**, and **CSS** for a responsive, intuitive user interface.
- Features include:
  - **Data visualizations** for admins to oversee inventory trends.
  - **Interactive UI** for a seamless user experience.
  - **Streamlined task management** for faster processing at the point of sale.

### 5. Bulk Product Addition
- Admins can upload a large number of products using an **Excel sheet**.
- This feature allows for faster product management and reduces the likelihood of manual entry errors.

### 6. Password Recovery
- Implemented a **password recovery** feature with Nodemailer.
  - Users can request a reset code, which is sent to their registered email.
  - The system ensures secure and convenient password recovery.

### 7. Billing Access and Reporting
- The system allows admins and employees to download detailed billing information for all transactions.
- Enhanced reporting capabilities improve business insights and financial oversight.

## Technologies Used

- **Backend**: 
  - **Node.js**
  - **Express.js** framework
  - **MongoDB** (for database management)
  - **Nodemailer** (for sending emails)

- **Frontend**:
  - **JavaScript**, **HTML5**, **CSS3** for building responsive UI

- **Other Tools**:
  - **NPM** for managing project dependencies
  - **Excel Upload** for bulk product management

## Installation

### Prerequisites
- **Node.js** and **npm** installed.
- **MongoDB** database.

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/pos-system.git
   cd pos-system
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the project root with the following configuration:
     ```bash
     PORT=3000
     MONGO_URI=mongodb://localhost:27017/pos_system
     EMAIL_SERVICE=your_email_service
     EMAIL_USER=your_email@example.com
     EMAIL_PASS=your_password
     ```

4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup

The frontend is built using **HTML5**, **CSS3**, and **JavaScript**, so no additional setup is required apart from hosting the static files on a server.

1. Open `index.html` from the frontend folder in your browser or host it on a local server.

## Usage

- **Admins**: Use admin credentials to access inventory management and data visualization tools.
- **Employees**: Log in with employee credentials to manage sales and update billing.
- **Customers**: Use the point of sale interface for efficient and accurate transactions.

## Features in Development

- **Payment Gateway Integration**: In the future, we plan to add support for online payment processing.
- **Mobile App**: A mobile-friendly version of the POS system for use on tablets and smartphones.

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/new-feature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Open a pull request.

## License

This project is licensed under the MIT License.

---

This `README.md` provides an overview of the **POS System** project, its features, installation instructions, and technologies used. Feel free to update it with additional details specific to your implementation.

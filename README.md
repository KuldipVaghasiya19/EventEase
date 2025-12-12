# EventEase - Modern Event Booking Platform

An elegant and feature-rich event ticketing and management system built with a modular structure, featuring a modern React frontend and a robust Spring Boot backend. The focus is on a seamless user experience and powerful administration capabilities.

## ✨ Features

### User Experience (Frontend: React)
* **Browse Events:** View all upcoming events with seat availability.
* **Secure Authentication:** Separate sign-in and sign-up flows for users.
* **Easy Booking (FREE):** Book any number of available seats instantly (all events are free of charge).
* **Booking Management:** View and manage past and upcoming bookings.
* **Cancellation:** Cancel bookings, automatically restoring seats to the event pool.
* **PDF Ticket Download:** Instantly download a professionally formatted PDF ticket for any confirmed booking using client-side generation.

### Administrator Controls (Backend & Frontend)
* **Secure Authentication:** Separate sign-in and sign-up flows for administrators.
* **Dashboard:** View key statistics (Total Events, Total Bookings, Total Users).
* **Event Management (CRUD):** Full control to create, read, update, and delete event details, total seats, and available seats.

### Design & Architecture
* **Responsive UI:** Professional and responsive design using Tailwind CSS.
* **Themed Color Palette:** Cohesive design centered around a vibrant blue theme (`primary-400`).
* **Secure Backend:** JWT-based authentication for all protected resources.

## 🛠️ Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | `React 18` / `Vite` / `Tailwind CSS` | Modern, component-based UI and blazing-fast development environment. |
| **PDF Generation** | `jspdf` / `html2canvas` | Client-side conversion of ticket details to PDF format. |
| **Backend** | `Spring Boot 3` (Java 17) | Robust and secure REST API for application logic. |
| **Database** | `PostgreSQL` | Reliable and scalable relational data store. |
| **Security** | `Spring Security` / `JWT` | Token-based security and password hashing (`BCryptPasswordEncoder`). |

## 🚀 Getting Started

### Prerequisites (For Full-Stack Operation)

* Java Development Kit (JDK) 17+
* Apache Maven
* PostgreSQL Database instance

### 1. Backend Setup (`EventEase/`)

1.  **Configure Database:** Ensure your PostgreSQL instance is running. Update `EventEase/src/main/resources/application.properties` with your database details:

    ```properties
    spring.datasource.url=jdbc:postgresql://localhost:5432/eventdb
    spring.datasource.username=postgres
    spring.datasource.password=postgres
    ```
2.  **Build and Run:**

    ```bash
    cd EventEase/
    ./mvnw spring-boot:run
    # The API will run on http://localhost:8080
    ```

### 2. Frontend Setup (`project/`)

**NOTE:** The frontend currently runs in a **database-free mock mode** using in-memory data for quick development and testing.

1.  **Install Dependencies:**

    ```bash
    cd project/
    npm install
    # Install PDF generation dependencies
    npm install jspdf html2canvas
    ```

2.  **Start Development Server:**

    ```bash
    npm run dev
    # The application will be available at http://localhost:5173/
    ```

---

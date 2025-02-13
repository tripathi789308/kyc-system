# KYC System

A comprehensive KYC (Know Your Customer) system built to manage user registration, identity verification, and role-based access control. This system features a Super Admin, regular users (USER role), and administrators (ADMIN role) with varying levels of access.

## Features

-   **User Registration:** Anyone can register on the platform and will be assigned the `USER` role by default.
-   **KYC Completion:** Users with the `USER` role must complete the KYC (Know Your Customer) process by filling out a form and submitting it for approval.
-   **KYC Status Tracking:** Users can view their KYC request status in their Profile section.
-   **Role-Based Access Control:**
    -   **Super Admin:** There is a single, pre-defined Super Admin account (`superadmin@example.com` / `superadmin`) who has complete access to the platform. The Super Admin can grant `ADMIN` role access to other users.
    -   **Admin (`ADMIN` role):** Users with `ADMIN` access can:
        -   View KYC requests in Pending, Approved, and Rejected tables.
        -   Approve or reject KYC requests.
        -   View user profiles.
    -   **User (`USER` role):** Regular users can:
        -   Complete their KYC profile.
        -   Request `ADMIN` role access (after completing KYC).
        -   View their profile and KYC status.
-   **Request Admin Access:** Users can request admin access from the administrator.

## User Flows

1.  **User Registration and KYC:**
    -   A new user registers on the platform.
    -   The user is prompted to complete the KYC form, providing necessary identification details.
    -   The submitted KYC request is sent to the administrator for review.
2.  **Admin Review and Action:**
    -   The administrator reviews the KYC requests in the Pending table.
    -   The administrator can either approve or reject the KYC submission.
    -   The user is notified of the decision.
3.  **Requesting Admin Role:**
    -   After completing KYC, users can request the `ADMIN` role.
    -   The Super Admin reviews these requests.
    -   The Super Admin grants or denies the `ADMIN` role to the user.
    -   The user is notified of the decision.

## Default Super Admin Account

-   **Email:** `superadmin@example.com`
-   **Password:** `superadmin`

## Running the Project

1.  **Clone the repository:**

    ```bash
    git clone git@github.com:tripathi789308/kyc-system.git
    cd kyc-system
    ```
    - Create `.env` file 
      ```
      POSTGRES_USER=superuser
      POSTGRES_PASSWORD=test123
      POSTGRES_DB=kyc_database
      DATABASE_PORT=5432
      BACKEND_PORT=3001
      FRONTEND_PORT=3000
      ```

2.  **Start the services using Docker Compose:**

    ```bash
    docker compose -f 'docker-compose.yml' up -d --build 'db'
    ```

    Open a new terminal and run

    ```bash
    docker compose -f 'docker-compose.yml' up -d --build 'pgadmin'
    ```

    Open a new terminal and run

    ```bash
    docker compose -f 'docker-compose.yml' up -d --build 'backend' 
    ```

3.  **Setup Prisma:**
    ```bash
     cd backend
     npm install -g prisma
     npx prisma generate
     npx prisma migrate dev --name init
     npm run prisma:seed
     cd ..
    ```
4.  **Start Frontend:**

    ```bash
    cd frontend
    yarn
    yarn dev
    ```

5.  **Access the application:**
    Open your web browser and go to `http://localhost:3000` (or the port that your frontend is running on).

## Technologies Used

-   [React](https://reactjs.org/): Frontend framework
-   [Express.js](https://expressjs.com/): Backend framework
-   [Node.js](https://nodejs.org/): JavaScript runtime environment
-   [Prisma](https://www.prisma.io/): ORM
-   [PostgreSQL](https://www.postgresql.org/): Database
-   [Docker](https://www.docker.com/): Containerization
-   [Tailwind CSS](https://tailwindcss.com/): CSS Framework
-   [Passport](http://www.passportjs.org/): Authentication



## 👨‍💻 Author

Developed to bridgeHere is a comprehensive and professional README for **Eco Shield Grid**. It is tailored for an IoT-focused web project, highlighting the edge-node authentication and real-time data aspects.

***

# Eco Shield Grid 🌱

**Eco Shield Grid** is a real-time IoT dashboard and management platform designed for Smart Farming systems. It serves as the central hub for receiving, visualizing, and managing environmental sensor data from field nodes while providing a secure, automated way to provision hardware devices.

## 🚀 Features

*   **Live Data Visualization:** Real-time monitoring of environmental sensor data (e.g., temperature, humidity, soil moisture) sent from deployed IoT edge nodes.
*   **Secure Edge Node Management:** Automated generation of unique API keys and secrets for secure node authentication.
*   **Dynamic PDF Provisioning:** Automatically generates downloadable PDF documents containing API credentials, making it easy to deploy and configure hardware nodes in the field.
*   **Cloud-Native Architecture:** Highly available database backend managed on NeonDB and lightning-fast frontend delivery via Vercel.

## 🛠️ Technology Stack

*   **Frontend & API:** Next.js (React)
*   **Database:** PostgreSQL
*   **Database Hosting:** NeonDB
*   **Deployment:** Vercel
*   **IoT Integration:** REST API endpoints for secure telemetry ingestion from microcontrollers (e.g., ESP32, STM32).

## 📊 System Architecture

1.  **Edge Nodes:** Hardware sensors collect agricultural data and authenticate via custom API keys.
2.  **Ingestion API:** Next.js API routes verify the node's API Secret/Key and securely write the telemetry data to the database.
3.  **NeonDB (PostgreSQL):** Stores node configurations, API credentials, and historical sensor data.
4.  **Next.js Dashboard:** Fetches live data for user visualization and handles the generation/PDF exporting of new node credentials.

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18 or higher)
*   A PostgreSQL database (or a free tier account on [Neon](https://neon.tech/))

### Local Installation

1.  Clone the repository:
    ```bash
    git clone [https://github.com/yourusername/eco-shield-grid.git](https://github.com/yourusername/eco-shield-grid.git)
    cd eco-shield-grid
    ```

2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  Environment Setup:
    Create a `.env.local` file in the root directory and add your NeonDB connection string and any other required variables:
    ```env
    DATABASE_URL="postgresql://user:password@endpoint.neon.tech/neondb?sslmode=require"
    # Add other necessary env variables (e.g., JWT secrets, API base URLs)
    ```

4.  Database Setup:
    Push your database schema to NeonDB (Assuming you are using an ORM like Prisma or Drizzle, adjust the command as needed):
    ```bash
    # If using Prisma:
    npx prisma db push
    ```

5.  Run the development server:
    ```bash
    npm run dev
    ```
6.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the dashboard.

## 📡 IoT Node API Usage (Example)

To send telemetry data from a hardware node (like an ESP32), make a POST request to the ingestion endpoint using the generated credentials:
```http
POST /api/telemetry
Headers:
  x-api-key: your_generated_api_key
  x-api-secret: your_generated_api_secret
  Content-Type: application/json

Body:
{
  "nodeId": "node_01",
  "temperature": 24.5,
  "humidity": 60.2,
  "soilMoisture": 45.0
}

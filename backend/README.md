# SkillLink Backend

> This is the backend for SkillLink, a platform for skill exchange and collaboration.

## Features

- User Authentication and Authorization (JWT-based)
- Secure and scalable RESTful API
- MongoDB for database management
- Input validation using Zod
- Real-time notifications
- ntegration with third-party APIs like Google Meet

## Technologies

- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB
- **Validation**: Zod
- **Authentication**: JWT

## Directory Structure

- **src/**: Contains the source code.
  - **controllers/**: Contains route handlers and business logic for API endpoints.
  - **routes/**: Defines the application's RESTful API endpoints and their configurations.
  - **models/**: MongoDB schemas and models for data storage and retrieval.
  - **middlewares/**: Custom middlewares for authentication, error handling, and request processing.
  - **utils/**: Utility functions and helpers for reusable functionality (e.g., token generation, validations).
  - **config/**: Configuration files, such as database connection and environment setup.
- **tests/**: Unit and integration tests to ensure code reliability.
- **index.ts**: The main entry point of the backend application.

## Development Notes

- TypeScript: All backend code is written in TypeScript for type safety and maintainability.
- Database: Ensure MongoDB is installed and running locally or remotely.
- Error Handling: Comprehensive error handling is implemented using middlewares.
  Environment Variables: Keep sensitive data secure using .env files.

## Installation

```bash
# Clone the repository
git clone git clone https://github.com/MoSalem149/skill-link-exchange-tracker.git

# Navigate to the frontend directory
cd backend

# Install dependencies
npm install

# Starts the development server
npm start
```

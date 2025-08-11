# OnlineShop

A Node.js-based e-commerce application built with Express.js and EJS template engine, following an MVC architecture.

## Project Structure

```
OnlineShop/
├── app.js            # Application entry point
├── controllers/      # Business logic and route handlers
├── model/            # Database models (e.g., Mongoose schemas)
├── routes/           # Express route definitions
├── views/            # EJS templates for rendering the UI
├── assets/           # Static files (CSS, JS, images)
├── image/            # Image assets used in the project
├── .gitignore
├── package.json
├── package-lock.js
```

## Prerequisites

- Node.js (v16 or higher recommended)
- npm (Node package manager)

## Installation

```bash
# Clone the repository
git clone https://github.com/AhmedDula/OnlineShop.git

# Navigate to the project directory
cd OnlineShop

# Install dependencies
npm install
```

## Running the Application

```bash
# Start the server
npm start

# Or run with nodemon (if configured)
npm run dev
```

Once the server is running, open your browser and go to:

```
http://localhost:3000
```

*(Or the port specified in your environment configuration)*

## Features

- MVC architecture for clean and maintainable code
- Dynamic rendering using EJS templates
- Organized routing with Express
- Static file serving from the `assets/` directory
- Modular controller structure
- Ready-to-use structure for adding features like authentication, product management, and order handling

## License

This project is licensed under **All Rights Reserved**.  
The source code is publicly visible but cannot be used, copied, or modified without explicit permission from the author.

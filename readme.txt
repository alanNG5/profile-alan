# Alan's Portfolio Web App

## Overview
This project serves as a portfolio and personal practice for web development. It showcases a demo online store for watches, providing users with a seamless shopping experience.

## Features
- ** Home Page **: Displays best-selling products and new arrivals.
- ** Product Page **: Catalogue listing all goods available for sale; Product page provides detailed information for each product.
- ** User Authentication **: Features login functionality using session cookies. Password hashing is conducted.
- ** Admin Account **: Accessible after login, allowing management of inventory and sales reports.
- ** Client Account **: Users can view their personal sales records.
- ** Resume Page **: An online version of my resume is also included in index.html.

## Tech Stack
- ** Frontend **: JavaScript, HTML, CSS
- ** Backend **: Node.js, Express
- ** Database **: PostgreSQL (with Knex for query building)

## APIs
The application connects to a server with an SQL database via various APIs, ensuring smooth data transactions.

## Installation
1.  Clone the repository:
    git clone https://github.com/alanNG5/profile-alan.git

2.  Navigate to the project directory:
    cd your-folder

3.  Install dependencies:
    npm install

4.  Set up your database and environment variables as needed.
        - setup "env" file and assign port number
        - Knex migration and seed

5.  Usage
    Start the server:
    npm start
    Open your browser and navigate to specified port of localhost

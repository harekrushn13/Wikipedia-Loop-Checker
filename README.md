# Wikipedia Loop Checker

## Overview

Wikipedia Loop Checker is a web application that allows users to explore the Wikipedia Loop phenomenon. The application navigates through Wikipedia articles, following the first link in the main body text, until it reaches the "Philosophy" page. The user can input a Wikipedia URL, and the application will display the number of requests required to reach the "Philosophy" page and the path of visited pages along the way.

## Features

- **Check Loop:** Input a Wikipedia URL and check the number of requests to reach the "Philosophy" page.
- **Display Results:** View the number of requests and the list of visited Wikipedia pages in chronological order.
- **Handle Edge Cases:** Gracefully handle scenarios such as loops and pages without valid links.

## Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Parsing:** Cheerio library for HTML parsing
- **HTTP Requests:** Fetch API on the frontend, Axios on the backend

## Getting Started

### Prerequisites

- Node.js and npm installed

### Installation

1. Clone the repository:

```bash
git clone https://github.com/harekrushn13/Wikipedia-Loop-Checker
cd wikipedia-loop-checker
```
2. Install dependencies for both frontend and backend:
   
    - Install backend dependencies
    ```bash
    npm install 
    ```
    - Install frontend dependencies
    ```bash
    cd client
    npm install
    ```

3. Start the development servers:
    - Start frontend server
   ```bash
    cd client
    npm start
   ```

    - Start backend server
    ```bash
    cd ../server
    npm start
    ```

4. Open your browser and go to http://localhost:3000 to use the application.

## Usage
Enter a Wikipedia URL in the input field.
Click the "Check Loop" button to see the results.
Explore the number of requests and the list of visited pages.

## Screenshots

### Home Page
![Home Page](https://github.com/harekrushn13/Wikipedia-Loop-Checker/assets/115085962/ae0a3fa5-9b34-429a-9d31-f7311e06aead)

### Results Page
![Result Page](https://github.com/harekrushn13/Wikipedia-Loop-Checker/assets/115085962/c72d57a8-6c70-40f3-8aed-7b5a93ad0b8a)

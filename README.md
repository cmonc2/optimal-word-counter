# ⭐ Optimal Word Counter

A high-performance full-stack application that processes large text files (up to 1GB) to compute the top N most frequent words efficiently.

---

## 💡 The Story Behind This Project

This project holds a very special place in my career. It was originally built as a take-home coding challenge for a job application. 

Not only did it demonstrate my technical skills, but **this exact challenge landed me the best job I have had so far**. 

It opened the door to an incredible, 100% remote working environment with a fantastic team and excellent compensation. Although I was hired as an independent contractor, the company made me feel incredibly valued and supported. In fact, they eventually offered to hire me as a full-time employee. Sadly, due to external geopolitical sanctions affecting my home country (Venezuela), we were unable to finalize the hiring process. I will always be deeply grateful to the team at City for that offer and their support.

---

**Note to recruiters:** If you are interested in hiring me, please consider giving me this type of take-home challenge! For some reason, live coding tests make me extremely nervous 😰.

---

## 📋 Summary

This app computes the top N most frequent (case-insensitive) words in a text file. The API meets the following specifications:

* **Inputs:** Accepts a text file (up to 1GB, UTF-8) and an arbitrary integer N.
* **Constraints:** N can be any positive integer in the range `[1, K]`, where K is the number of unique words in the file.
* **Outputs:** Returns the top N most frequent words in the text file as a JSON array.

### Tech Stack
* **Frontend:** React 18, Vite, TypeScript.
* **Backend:** Node.js 22, Express, TypeScript, Multer, Line-Reader, Timsort.
* **Testing:** Vitest, Supertest, Testing Library.
* **Containerization:** Docker Compose & VS Code Dev Containers (Rootless `su-exec node`).

---

## 🛠️ How to Install and Run the App

### Requirements
* Node.js (v22 or newer)
* [pnpm](https://pnpm.io/) (v11 or newer) / Docker

### Installation
In the root folder, run the following command to install dependencies:
```bash
pnpm install
```

### Configuration (Environment Variables)
If you want to customize the port, copy `.env.example` to `.env` and set your desired port (defaults to `3000` if no `.env` is present):
```bash
cp .env.example .env
```

### Running the App

* **Development Mode (with Hot Reloading):**
  Starts both the Express backend and the Vite dev server concurrently.
  ```bash
  pnpm dev
  ```
  Open your browser and navigate to `http://localhost:5173` (or the port shown by Vite). The frontend will proxy API requests to the backend port.

* **Production Mode:**
  Builds the React client assets and runs the Express server to serve both the API and the static frontend assets on the same port:
  ```bash
  pnpm build
  pnpm start
  ```
  Open your browser and navigate to `http://localhost:3000` (or your configured `PORT`).

### Running Tests
Runs the full test suite (backend integration tests followed by client-side tests with Vitest):
```bash
pnpm test
```

---

## 🐳 Docker & Dev Containers

Run the full-stack app in an isolated container:
```bash
docker compose up -d
```

---

## 🖥️ How to Use the Project

### Using the UI
Depending on the mode you started the app:
* **In Development:** Navigate to `http://localhost:5173`.
* **In Production / Server Mode:** Navigate to `http://localhost:3000` (or your configured `PORT`).
1. Click on the **Choose File** button to select your text file.
2. Insert a number (N) in the input field next to the Submit button.
3. Click on the **Submit** button.
4. View the calculated word frequencies displayed in the results area below.

### Using the API
You can also send a `POST` request directly to the API endpoint (`/api/v1/upload/{top}`) using any HTTP client (like Postman or cURL) sending the file as `multipart/form-data`.

### API Documentation (Swagger)
The project includes interactive API documentation generated via Swagger. Depending on the mode you started the app:
* **In Development:** Navigate to `http://localhost:5173/api-docs` (Vite's server automatically proxies this to the backend).
* **In Production / Server Mode:** Navigate to `http://localhost:3000/api-docs` (or your configured `PORT`).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

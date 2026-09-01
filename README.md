# ⭐ Optimal Word Counter

<div align="center">

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Click_here_to_try_the_app-23c45e?style=for-the-badge&logo=vercel&logoColor=white)](https://optimal-word-counter.vercel.app/)

</div>

---

## 💡 The Story Behind This Project

This project holds a very special place in my career. It was originally built as a take-home coding challenge for a job application. 

Not only did it demonstrate my technical skills, but **this exact challenge landed me the best job I have had so far**. 

It opened the door to an incredible, 100% remote working environment with a fantastic team and excellent compensation. Although I was hired as an independent contractor, the company made me feel incredibly valued and supported. In fact, they eventually offered to hire me as a full-time employee. Sadly, due to external geopolitical sanctions affecting my home country (Venezuela), we were unable to finalize the hiring process. I will always be deeply grateful to the team for that offer and their support.

---

**Note to recruiters:** If you are interested in hiring me, please consider giving me this type of take-home challenge! For some reason, live coding tests make me extremely nervous 😰.

---

## 📋 Summary

This app computes the top N most frequent (case-insensitive) words in a text file. The API meets the following specifications:

* **Inputs:** Accepts a text file (up to 1GB, UTF-8) and an arbitrary integer N.
* **Constraints:** N can be any positive integer in the range `[1, K]`, where K is the number of unique words in the file.
* **Outputs:** Returns the top N most frequent words in the text file as a JSON array.

### Tech Stack
* **Frontend:** React 18, Vite 6, TypeScript, Vitest, Testing Library.
* **Backend:** Node.js 22 (ESM), Express, TypeScript (NodeNext), Multer, Line-Reader, TimSort, Zod.
* **Testing:** Vitest, Supertest, Testing Library.
* **Containerization:** Docker Compose & VS Code Dev Containers (Rootless `su-exec node`).

---

## 🛠️ How to Install and Run the App

### Requirements
* Node.js (v22 or newer)
* [pnpm](https://pnpm.io/) (v11 or newer) / Docker

### Installation
In the root folder, run:
```bash
pnpm install
```

### Configuration (Environment Variables)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

| Variable | Default | Description |
| :--- | :--- | :--- |
| `SERVER_PORT` | `3103` | Port for the Express backend server (validated via Zod). |
| `CLIENT_PORT` | `5103` | Port for the Vite React development server. |

### Running the App

* **Development Mode (Unified Terminal with `concurrently`):**
  Starts both the Express backend and Vite client concurrently:
  ```bash
  pnpm dev
  ```
  Open `http://localhost:5103` in your browser.

* **Separate Terminal Flow:**
  * **Backend**: `pnpm start:server` (`http://localhost:3103`)
  * **Frontend**: `pnpm --filter client dev` (`http://localhost:5103`)

### Running Tests
Runs the full Vitest suite (both backend integration and client UI tests):
```bash
pnpm test
```

### Building for Production
```bash
pnpm build
```

---

## 🐳 Docker & Dev Containers

Run the fullstack app in an isolated container:
```bash
docker compose up -d
```

---

## 📡 API Reference & Swagger

Interactive Swagger documentation is available at:
* **Local**: `http://localhost:3103/api-docs`
* **Production**: `https://optimal-word-counter.vercel.app/api-docs`

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

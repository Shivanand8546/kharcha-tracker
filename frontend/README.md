# 💰 Kharcha Tracker — Frontend

This is the frontend (client) of **Kharcha Tracker**, a full-stack expense tracking application built with React.js.

For the complete project overview, features, and setup instructions, see the [main README](../README.md).

---

## 🚀 Getting Started

### Install dependencies

```bash
npm install
```

If using receipt scanning (OCR), also install:

```bash
npm install tesseract.js
```

### Run the development server

```bash
npm start
```

Runs the app at [http://localhost:3000](http://localhost:3000). The page reloads automatically on code changes.

> **Note:** Make sure the backend server is running at `http://localhost:5000` (see backend setup in the main README) — the frontend depends on it for authentication and transaction data.

### Build for production

```bash
npm run build
```

Builds the app for production to the `build` folder, optimized and minified for best performance.

### Run tests

```bash
npm test
```

---

## 📂 Key Folders

```text
src/
├── assets/         # Images and static assets
├── components/     # Reusable UI components (Header, Skeleton, etc.)
├── Pages/
│   ├── Auth/       # Login & Register pages
│   ├── Avatar/     # Avatar selection page
│   └── Home/       # Dashboard, transactions, analytics
├── utils/          # API endpoints, parsers (voice/receipt), helpers
├── App.js
└── index.js
```

---

## 🛠 Built With

- [React](https://reactjs.org/)
- [React Router DOM](https://reactrouter.com/)
- [Axios](https://axios-http.com/)
- [React Bootstrap](https://react-bootstrap.github.io/)
- [Material UI Icons](https://mui.com/material-ui/material-icons/)
- [React Datepicker](https://reactdatepicker.com/)
- [React Toastify](https://fkhadra.github.io/react-toastify/)
- [Tesseract.js](https://tesseract.projectnaptha.com/) — OCR for receipt scanning
- Web Speech API — voice input for transactions

---

## 📄 License

This project is part of Kharcha Tracker, licensed under the MIT License.

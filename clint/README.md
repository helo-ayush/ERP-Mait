# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Environment Variables

Create a `.env` file in the `clint` directory with the following keys (Vite requires the `VITE_` prefix):

```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_PAYMENT_URL=https://payments.example.com/checkout
VITE_FILES_BASE_URL=http://localhost:3000/files
VITE_REPORTS_BASE_URL=http://localhost:3000/reports
VITE_AUTH_LOGOUT_URL=https://auth.example.com/logout
```

Restart the dev server after changing env values.

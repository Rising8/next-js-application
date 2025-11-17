// app/lib/api.js

import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        "Workspaces-Identifier": process.env.NEXT_PUBLIC_WORKSPACE_ID,
        "X-Integration-Name": process.env.NEXT_PUBLIC_INTEGRATION_NAME,
    },
});

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default api;
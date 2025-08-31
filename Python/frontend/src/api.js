// Python/frontend/src/api.js
import axios from "axios";

export const getUsers = async () => {
    const res = await axios.get("/api/users"); // proxied to Flask in dev
    return res.data;
};

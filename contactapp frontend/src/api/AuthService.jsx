import axios from "axios";

const AUTH_URL = 'http://localhost:8080/auth';

export async function register(username, email, password) {
    return await axios.post(`${AUTH_URL}/register`, { username, email, password });
}

export async function login(username, password) {
    const response = await axios.post(`${AUTH_URL}/login`, { username, password });
    if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", response.data.username);
    }
    return response.data;
}

export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
}

export function getToken() {
    return localStorage.getItem("token");
}

export function getUsername() {
    return localStorage.getItem("username");
}

export function isAuthenticated() {
    return !!getToken();
}

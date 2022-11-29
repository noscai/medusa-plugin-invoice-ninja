/* axios custom config by medusajs */

import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.INVOICE_NINJA_API_URL,
});

instance.interceptors.request.use(
    async config => {
        config.headers = {
            'X-Api-Token': process.env.INVOICE_NINJA_API_TOKEN,
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };

        return config;
    },
    error => {
        Promise.reject(error);
    }
);

instance.interceptors.response.use(
    response => response,
    error => {
        // whatever you want to do with the error
        if (error.response?.status === 401) {
            auth.clearAppStorage();
            window.location.reload();
        }

        throw error;
    }
);

export default function invoiceNinjaRequest(method, path = "", body = {}) {
    const config = {
        method,
        url: path,
        data: body
    }
    return instance(config)
}

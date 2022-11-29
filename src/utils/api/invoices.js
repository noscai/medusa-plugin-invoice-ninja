const invoiceNinjaRequest = require('../request').default

module.exports = {
    async list(query = {}) {
        const params = Object.keys(query)
        .map((k) => `${k}=${query[k]}`)
        .join("&")
        const path = `/api/v1/invoices${params && `?${params}`}`
        return await invoiceNinjaRequest(path);
    },

    async retrieve(invoiceId) {
        const path = `/api/v1/invoices/${invoiceId}`
        return await invoiceNinjaRequest(path);
    },

    async create(create) {
        const path = `/api/v1/invoices`
        return await invoiceNinjaRequest("POST", path, create);
    },

    async update(invoiceId, update) {
        const path = `/api/v1/invoices/${invoiceId}`
        return await invoiceNinjaRequest("PUT", path, update);
    },

    async delete(invoiceId) {
        const path = `/api/v1/invoices/${invoiceId}`
        return await invoiceNinjaRequest("DELETE", path);
    }
}
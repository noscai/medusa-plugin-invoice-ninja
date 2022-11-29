const invoiceNinjaRequest = require('../request').default

module.exports = {
    async list(query = {}) {
        const params = Object.keys(query)
        .map((k) => `${k}=${query[k]}`)
        .join("&")
        const path = `/api/v1/clients${params && `?${params}`}`
        return await invoiceNinjaRequest(path);
    },

    async retrieve(clientId) {
        const path = `/api/v1/clients/${clientId}`
        return await invoiceNinjaRequest(path);
    },

    async create(create) {
        const path = `/api/v1/clients`
        return await invoiceNinjaRequest("POST", path, create);
    },

    async update(clientId, update) {
        const path = `/api/v1/clients/${clientId}`
        return await invoiceNinjaRequest("PUT", path, update);
    },

    async delete(clientId) {
        const path = `/api/v1/clients/${clientId}`
        return await invoiceNinjaRequest("DELETE", path);
    }
}
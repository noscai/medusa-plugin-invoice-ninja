class InvoiceNinjaSubscriber {
    constructor({ eventBusService, invoiceNinjaService }) {
      this.invoiceNinja_ = invoiceNinjaService
      this.eventBus_ = eventBusService

      this.eventBus_.subscribe("order.placed", async (order) => {
        await this.invoiceNinja_.createDraftOrder(order)
      });
    }
}
  
export default InvoiceNinjaSubscriber;
import { BaseService } from "medusa-interfaces"
import { clients, invoices } from "../utils/api"
import { MedusaError } from "medusa-core-utils"
import { format as doFormatDate } from "date-fns"
import { beautyInvoiceNumber } from "../utils/beauty-invoice-number"

class InvoiceNinjaService extends BaseService {
    constructor({ orderService, totalsService }, options) {
      super();
      this.orderService_ = orderService
      this.totalsService_ = totalsService
    }

    async createClient(orderData) {
      try {
        const shipping_address = orderData.shipping_address
        const billing_address = orderData.billing_address
        return await clients.create({
          "name": `${orderData.customer.first_name} ${orderData.customer.last_name}`,
          "address1": billing_address.address_1,
          "address2": billing_address.address_2,
          "phone": billing_address.phone,
          "city": billing_address.city,
          "postal_code": billing_address.postal_code,
          "state": billing_address.state,
          "country_code": billing_address.country_code,
          "shipping_address1": shipping_address.address_1,
          "shipping_address2": shipping_address.address_2,
          "shipping_city": shipping_address.city,
          "shipping_state": shipping_address.state,
          "shipping_postal_code": shipping_address.postal_code,
          "shipping_country_code": shipping_address.country_code
        })
      } catch (error) {
        throw error
      }
    }

    async createLineItems(orderData) {
      let line_items = []
      
      orderData.items.forEach((item) => {
        let unit_price = item.unit_price/100
        line_items.push({
          "item": item.title,
          "description": item.description,
          "unit_cost": unit_price,
          "quantity": item.quantity,
          "cost": unit_price, // invoice ninja using this one
          "product_cost": unit_price
        })
      })

      return line_items
    }

    // async getOrderDiscount(orderData) {
    //   let discount = 0
    //   let discount_items = []

    //   const discount_data = orderData.discounts

    //   const isDiscount = discount_data.find(
    //     (x) => x.rule.type != "free_shipping"
    //   )
      
    //   if (isDiscount) {
    //     discount_items = await this.totalsService_.getAllocationItemDiscounts(
    //       isDiscount,
    //       orderData
    //     )
    //   }

    //   console.log(discount_items)
    //   return discount
    // }

    async createInvoice(clientId, orderData) {
      try {
        const line_items = await this.createLineItems(orderData)
        const invoice_num = beautyInvoiceNumber(orderData.display_id)
        //const discount = this.getOrderDiscount(orderData)

        return await invoices.create({
          "client_id": clientId,
          "number": `INV_${invoice_num}`,
          "terms": "", //payment terms
          "public_notes": "",
          "private_notes": "",
          "footer": "",
          "line_items": line_items,
          //"discount": discount,
          "date": doFormatDate(new Date(), "yyyy-MM-dd"),
          "due_date": doFormatDate(new Date(), "yyyy-MM-dd")
        })
      } catch (error) {
        throw error
      }
    }

    // Todo when order placed we should create Client and Invoice and put in metadata
    async createDraftOrder(order) {
      const { id } = order
      const orderData = await this.orderService_.retrieve(id, { 
          relations: [
            "customer",
            "billing_address",
            "shipping_address",
            "region",
            "items",
            "discounts",
            "shipping_address.country",
            "billing_address.country"
          ]
        })
      try {
        const dataClient = await this.createClient(orderData)
        const dataInvoice = await this.createInvoice(dataClient.data.data.id, orderData)
        const updateOrder = await this.orderService_.update(
          id,
          {
            metadata: {
              invoice_ninja_client_id: dataClient.data.data.id,
              invoice_ninja_invoice_id: dataInvoice.data.data.id
            }
          }
        )

      } catch (error) {
        throw error
      }
    }
}

export default InvoiceNinjaService;
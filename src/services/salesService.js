import axios from "./axiosConnection";
import { getUser, executeError } from "../utils";

export async function getCompanySales(offset, salesPerPage, startDate, endDate, onSuccess = null, onError = null) {
    try{
        const response = await axios.get(`/companySales?offset=${offset}&pageSize=${salesPerPage}&startDate=${startDate}&endDate=${endDate}`);
        onSuccess && onSuccess(response);
    } catch (error) {
        executeError(onError, error);
    }
}

export async function getProductSalesByProduct(startDate, endDate, onSuccess = null, onError = null) {
    try{
        const response = await axios.get(`/productSales?startDate=${startDate}&endDate=${endDate}`);
        onSuccess && onSuccess(response);
    } catch (error) {
        executeError(onError, error);
    }
}
export async function createSale(data, productsAdded, totalCost, dateSelected, onSuccess = null, onError = null) {
    console.log(totalCost);
    const sale = {
      companyId: getUser().companyId,
      clientName: data.clientName,
      date: dateSelected,
      totalCost: totalCost,
      productsSold: productsAdded
  }
  console.log(sale);

  
    try {
        const response = await axios.post(`/sales`, sale);
        onSuccess && onSuccess(response);
    } catch (error) {
        const message = error.response.data.error ?? error.message ?? error;
        onError && onError(message);
    }
  }
import axios from "./axiosConnection";
import { getUser, executeError } from '../utils';

export async function getPurchases(data, onSuccess = null, onError = null) {
    try{
        const response = await axios.get(`/purchases`);
        return response;
    } catch (error) {
        const message = error.response.data.error ?? error.message ?? error;
        onError && onError(message);
    }
}

export async function getPurchase(purchaseId) {
  try{
      const response = await axios.get(`/purchases/${purchaseId}`);
      return response;
  } catch (error) {
      console.log(error);
  }
}


export async function createPurchase(data,productsAdded, totalCost, dateSelected, onSuccess = null, onError = null) {
  const purchase = {
    companyId: getUser().companyId,
    providerId: data.providerId,
    date: dateSelected,
    totalcost: totalCost,
    productsPurchased: productsAdded
}

  try {
      const response = await axios.post(`/purchases`, purchase);
      onSuccess && onSuccess(response);
  } catch (error) {
      const message = error.response.data.error ?? error.message ?? error;
      onError && onError(message);
  }
}

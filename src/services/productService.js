import axios from "./axiosConnection";
import { getUser, executeError } from '../utils';

export async function getProducts(data, onSuccess = null, onError = null) {
    try{
        const response = await axios.get(`/products?isActive=true`);
        return response;
    } catch (error) {
        executeError(onError, error);
    }
}

export async function getProduct(productId, onSuccess = null, onError = null) {
  try{
      const response = await axios.get(`/products/${productId}`);
      onSuccess && onSuccess(response)
  } catch (error) {
      executeError(onError, error);
  }
}

export async function deleteProduct(productId, onSuccess = null, onError = null) {
  try{
      const response = await axios.delete(`/products/${productId}`);
      onSuccess && onSuccess();
  } catch (error) {
      executeError(onError, error);
  }
}

export async function createProduct(data, fileName, onSuccess = null, onError = null) {
  const product = {
    name: data.name,
    image: fileName,
    price: data.price,
    stock: data.stock,
    description: data.description,
    companyId: getUser()?.companyId
  }

  try {
      const response = await axios.post(`/products`, product);
      onSuccess && onSuccess(response);
  } catch (error) {
    executeError(onError, error);
  }
}

export async function editProduct(data, fileName, onSuccess = null, onError = null) {
  const product = {
    name: data.name,
    image: fileName,
    price: data.price,
    stock: data.stock,
    description: data.description,
    companyId: getUser()?.companyId
  }

  try {
      const response = await axios.put(`/products/${data.productId}`, product);
      onSuccess && onSuccess(response);
  } catch (error) {
      executeError(onError, error);
  }
}
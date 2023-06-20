import axios from "./axiosConnection";
import { getUser, executeError, setLocalStorage } from "../utils";

export async function createUser(data, onSuccess = null, onError = null) {
    const user = {
        userName: data.name,
        email: data.email,
        companyName: data.companyName,
        password: data.password,
        role: "ADMIN"
    }
    try{
        const response = await axios.post(`/users`, user);
        onSuccess && onSuccess(response);
    } catch (error) {
        executeError(onError, error);
    }
}

export async function logIn(data, onSuccess = null, onError = null) {
    const user = {
        email: data.email,
        password: data.password,
    }
    try{
        const response = await axios.post(`/login`, user);
        setLocalStorage(response.data.user, response.data.token);
        onSuccess && onSuccess(response);
    } catch (error) {
        executeError(onError, error);
    }
}

export async function getUsersCompany(onError = null) {
    const userCompanyId = getUser()?.companyId
    try{
        const response = await axios.get(`/companies/${userCompanyId}`);
        return response.data;
    } catch (error) {
        executeError(onError, error);
    }
}

export async function sendRegisterLink(data, onSuccess = null, onError = null) {
    const userCompanyId = getUser()?.companyId
    let dataSendRegisterLink = {
        email: data.email,
        companyId: userCompanyId,
        role: data.role
    }
    try{
        const response = await axios.post(`/sendRegisterLink`, dataSendRegisterLink);
        onSuccess && onSuccess(response.data);
    } catch (error) {
        executeError(onError, error);
    }
}

export async function registerViaLink(data, token, onSuccess = null, onError = null) {
    let dataSendRegisterLink = {
        userName: data.name,
        email: data.email,
        password: data.password,
        token: token
    }
    try{
        const response = await axios.post(`/register`, dataSendRegisterLink);
        onSuccess && onSuccess(response.data);
    } catch (error) {
        executeError(onError, error);
    }
}

export async function isATokenValid() {
    try{
        const response = await axios.get(`/users/validToken`);
        return response.status === 204
    } catch (error) {
        return false;
    }
}

export async function sendReport(companyId, token, onSuccess = null, onError = null) {
    try{
        const companyId = getUser()?.companyId
        const response = await axios.post(`/reports/${companyId}`);
        onSuccess && onSuccess(response.data);
    } catch (error) {
        executeError(onError, error);
    }
}
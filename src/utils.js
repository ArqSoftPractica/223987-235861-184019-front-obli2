export function isUserLogged(){
    return !!localStorage.getItem('token');
}

export function getUser() {
    return JSON.parse(localStorage.getItem('user'))
}

export function executeError(onError, error) {
    const message = error?.response?.data?.error ?? error.message ?? error;
    onError && onError(message);
}

export function setLocalStorage(user, token){
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    window.dispatchEvent(new Event("storage"));
}

export function removeLocalStorage(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event("storage"));
}



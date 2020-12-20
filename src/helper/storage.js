const saveInLocalStorage = (key, item) => {
    const itemStr = JSON.stringify(item);
    localStorage.setItem(key, itemStr)
};

const getFromLocalStorage = key => {
    const itemStr = localStorage.getItem(key);
    return JSON.parse(itemStr)
};
const saveInSessionStorage = (key, item) => {
    const itemStr = JSON.stringify(item);
    sessionStorage.setItem(key, itemStr)
};

const getFromSessionStorage = key => {
    const itemStr = sessionStorage.getItem(key);
    return JSON.parse(itemStr)
};

export { saveInLocalStorage, getFromLocalStorage, saveInSessionStorage, getFromSessionStorage }

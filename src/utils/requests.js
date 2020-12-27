// all backend requests
import axios from './API';
import {getFromLocalStorage, saveInLocalStorage, saveInSessionStorage} from "../helper/storage";
import catchError from "../helper/catchError";

const login = (user, setLoader, setBackendError, goLink) => {
    axios.post('auth/login', user)
        .then(res => {
            setBackendError(null);
            setLoader(false);
            if(res.data.token){
                saveInLocalStorage('userData', res.data);
                axios.defaults.headers['Authorization'] =
                    'Bearer' + ' ' + JSON.parse(localStorage.getItem('userData'))?.token;
                goLink('/auth/dashboard');
            }else{
                saveInSessionStorage('user', res.data);
                goLink('/verify-code');
            }

        })
        .catch(err => {
            setBackendError(catchError(err.response));
            setLoader(false);
        });
};
const loginGoogle = (token, setLoader, setBackendError, goHome) => {
    setLoader(true);
    axios.post('auth/login/google', token)
        .then(res => {
            setBackendError(null);
            setLoader(false);
            saveInLocalStorage('userData', res.data);
            axios.defaults.headers['Authorization'] =
                'Bearer' + ' ' + JSON.parse(localStorage.getItem('userData'))?.token;
            goHome();

        })
        .catch(err => {
            setBackendError(catchError(err.response));
            setLoader(false);
        });
};
const loginFacebook = (data, setLoader, setBackendError, goHome) => {
    setLoader(true);
    axios.post('auth/login/facebook', data)
        .then(res => {
            setBackendError(null);
            setLoader(false);
            saveInLocalStorage('userData', res.data);
            axios.defaults.headers['Authorization'] =
                'Bearer' + ' ' + JSON.parse(localStorage.getItem('userData'))?.token;
            goHome();

        })
        .catch(err => {
            setBackendError(catchError(err.response));
            setLoader(false);
        });
};
const verifyAccount = (user, setLoader, setBackendError, goHome) => {
    axios.post('auth/verify-account', user)
        .then(res => {
            setBackendError(null);
            setLoader(false);
            if(res.data.token){
                saveInLocalStorage('userData', res.data);
                axios.defaults.headers['Authorization'] =
                    'Bearer' + ' ' + JSON.parse(localStorage.getItem('userData'))?.token;
                goHome();
                sessionStorage.clear();
            }

        })
        .catch(err => {
            setBackendError(catchError(err.response));
            setLoader(false);
        });
};
const resendVerifyCode = (user, setLoader, setBackendError, showToast) => {
    setBackendError(null);
    setLoader(true);
    axios.post(`auth/${user.email ? 'resend-verification-email' : 'resend-verification-mobile'}`, user)
        .then(res => {
            setLoader(false);
            showToast()
        })
        .catch(err => {
            setBackendError(catchError(err.response));
            setLoader(false);
        });
};
const sendForgetCode = (user, setLoader, setBackendError, goReset) => {
    axios.post('auth/forget-password', user)
        .then(res => {
            setBackendError(null);
            setLoader(false);
            goReset();
        })
        .catch(err => {
            setBackendError(catchError(err.response));
            setLoader(false);
        });
};
const resetPassword = (user, setLoader, setBackendError, goHome) => {
    axios.post('auth/reset-password', user)
        .then(res => {
            setBackendError(null);
            setLoader(false);
            goHome();
            sessionStorage.clear();
        })
        .catch(err => {
            setBackendError(catchError(err.response));
            setLoader(false);
        });
};
const register = (user, setLoader, setBackendError, goVerify) => {
    axios.post('auth/register', user)
        .then(res => {
            setBackendError(null);
            setLoader(false);
            saveInSessionStorage('user', res.data);
            goVerify();
        })
        .catch(err => {
            setBackendError(catchError(err.response));
            setLoader(false);
        });
};
const getInfoData = (id,setUser, setLoader, setBackendError) => {
    axios.get( `profile/view/${id}`)
        .then(res => {
            setBackendError(null);
            setLoader(false);
            setUser(res.data);
        })
        .catch(err => {
            setBackendError(catchError(err.response));
            setLoader(false);
            setUser(null);
        });
};
const updateProfile = (user, setLoader, setBackendError, showToast) => {
    axios.put('profile/edit', user)
        .then(res => {
            setBackendError(null);
            setLoader(false);
            saveInLocalStorage('userData', {...getFromLocalStorage('userData'), ...res.data});
            showToast();
        })
        .catch(err => {
            setBackendError(catchError(err.response));
            setLoader(false);
        });
};
const getYourFriends = (id, page,setPage, setFriends, setLoader, setBackendError, setPages) => {
    axios.get( `/friendship/friends/${id}?limit=5&page=${page}`)
        .then(res => {
            setBackendError(null);
            setLoader(false);
            if(page > 1){
               setFriends([...setPages, ...res.data.docs]);
            }else{
                setFriends(res.data.docs);
                setPages(res.data.pages);
            }
            setPage(page++);
        })
        .catch(err => {
            setBackendError(catchError(err.response));
            setLoader(false);
            setFriends(null);
        });
};
const logout = (goHome) => {
    localStorage.clear();
    axios.defaults.headers['Authorization'] = '';
    goHome ? goHome() : window.location.assign("/");
};
const isAuthenticated = () => getFromLocalStorage('userData');
export {login,register,
    isAuthenticated,sendForgetCode,
    verifyAccount, resendVerifyCode,
    resetPassword,
    loginGoogle,
    loginFacebook,
    getInfoData,
    updateProfile,
    getYourFriends,
    logout}
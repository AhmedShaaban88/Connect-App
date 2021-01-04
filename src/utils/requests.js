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
    axios.get( `friendship/friends/${id}?limit=8&page=${page}`)
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
const getYourPosts = (id, page,setPage, setPosts, setLoader, setBackendError, setPages) => {
    axios.get( `profile/view/${id}/posts?limit=8&page=${page}`)
        .then(res => {
            setBackendError(null);
            setLoader(false);
            if(page > 1){
                setPosts([...setPages, ...res.data.docs]);
            }else{
                setPosts(res.data.docs);
                setPages(res.data.pages);
            }
            setPage(page++);
        })
        .catch(err => {
            setBackendError(catchError(err.response));
            setLoader(false);
            setPosts(null);
        });
};
const friendActions = (type,id,setLoader, setBackendError,setStatus, status) =>{
    axios.put( `friendship/${type}`,{recipient: id})
        .then(res => {
            setBackendError(null);
            setLoader(false);
            switch (status) {
                case 0:
                    setStatus({status: 1});
                    break;
                case 'accept':
                    setStatus({status: 3});
                    break;
                default:
                    setStatus({status: 0});
                    break;
            }
        })
        .catch(err => {
            setBackendError(catchError(err.response));
            setLoader(false);
        });
};
const friendAcceptReject = (type,id,_this,callback) =>{
    axios.put( `friendship/${type}`,{recipient: id})
        .then(res => {
            _this.setState({
                backendError: null,
                friendLoadingItem: null,
                skip: --_this.state.skip
            });
            if (type === 'accept') {
                _this.setState({
                    friendAcceptItems: [..._this.state.friendAcceptItems, id]
                });
            } else {
                _this.setState({
                    friendRejectItems: [..._this.state.friendRejectItems, id]
                });
            }
            callback();
        })
        .catch(err => {
            _this.setState({
                backendError: catchError(err.response),
                friendLoadingItem: null,
            });
        });
};
const getYourFriendRequests = (_this, prevThis) => {
    axios.get( `friendship/requests?limit=5&skip=${_this.state.skip}`)
        .then(res => {
            _this.setState({
                loading: false,
                backendError: null
            });
            if(_this.state.page > 1){
                _this.setState({
                    requests: [..._this.state.requests, ...res.data.docs]
                });
            }else{
                _this.setState({
                    total: Math.ceil(res.data.total/5),
                    requests: res.data.docs
                })
            }
            _this.setState({
                page: ++_this.state.page,
                skip: _this.state.skip+=5
            });
            if(prevThis.state.count !== res.data.total){
                prevThis.setState({count: res.data.total})
            }
        }).catch(err => {
            _this.setState({
                loading: false,
                backendError: catchError(err.response),
                requests: null
            });
        });
};
const getYourNotifications = (_this) => {
    axios.get( `notifications?limit=10&page=${_this.state.page}`)
        .then(res => {
            _this.setState({
                loading: false,
                backendError: null
            });
            if(_this.state.page > 1){
                _this.setState({
                    notifications: [..._this.state.notifications, ...res.data.docs]
                });
            }else{
                _this.setState({
                    total: res.data.pages,
                    notifications: res.data.docs
                })
            }
            _this.setState({
                page: ++_this.state.page,
            });
        }).catch(err => {
            _this.setState({
                loading: false,
                backendError: catchError(err.response),
                notifications: null
            });
        });
};
const searchFriend = (_this, value, page) => {
    axios.get( `friendship/search?limit=5&page=${page ? page : _this.state.page}&q=${value}`)
        .then(res => {
            _this.setState({
                backendError: null,
                isLoading: false,
            });
            if(page){
                _this.setState({
                    results: [..._this.state.results, ...res.data.docs],
                    page: page
                });
            }else{
                _this.setState({
                    results: res.data.docs,
                    total: res.data.pages,
                    page: _this.state.page++
                });
            }
        })
        .catch(err => {
            _this.setState({
                backendError: catchError(err.response),
                isLoading: false,
                results: []
            });
        });
};
const postLikes = (id, setLoader, setBackendError,setLikes) => {
    axios.get(`like/${id}`)
        .then(res => {
            setBackendError(null);
            setLoader(false);
            setLikes(res.data)
        })
        .catch(err => {
            setBackendError(catchError(err.response));
            setLoader(false);
        });
};
const likePost = (id,setBackendError) => {
    axios.put(`like/post/${id}`)
        .then(res => {
            setBackendError(null);
        })
        .catch(err => {
            setBackendError(catchError(err.response));
        });
};
const likePostDashboard = (id,_this) => {
    axios.put(`like/post/${id}`)
        .then(res => {
            _this.setState({
                backendError: null
            })
        })
        .catch(err => {
            _this.setState({
                backendError: catchError(err.response)
            })
        });
};
const getPost = (_this) => {
    axios.get(`post/${_this.state.id}`).then(res => {
        if(res.data?.author._id !== getFromLocalStorage('userData')?.userId){
            _this.props.history.push('/');
        }
        else {
            _this.setState({
                backendError: null,
                addPostLoader: false,
                loading: false,
                post: res.data,
                content: res.data.content,
            });
        }
    }).catch(err => {
        _this.setState({
            backendError: catchError(err.response),
            loading: false,
            addPostLoader: false,
            post: null
        });
        _this.props.history.push('/');
    })
};
const updatePost = (_this, post) => {
    axios.put(`post/${_this.state.id}`, post).then(res => {
        _this.setState({
            backendError: null,
            addPostLoader: false,
            content: res.data.content,
            files:[],
            filesPrev: [],
            deletedMedia: [],
            post: res.data
        });
    }).catch(err => {
        _this.setState({
            backendError: catchError(err.response),
            addPostLoader: false,
        });
    })
};
const createPost = (_this, post) => {
    axios.post(`post/create`, post).then(res => {
        const _posts = [res.data.post, ..._this.state.posts];
        _this.setState({
            backendError: null,
            addPostLoader: false,
            content: '',
            files:[],
            filesPrev: [],
            skip: ++_this.state.skip,
            posts: _posts
        });
    }).catch(err => {
        _this.setState({
            backendError: catchError(err.response),
            addPostLoader: false,
        });
    })
};
const deletPost = (id, setBackendError,setPost, posts, setDeleteId) => {
    axios.delete(`post/${id}`, {data:{id: id}})
        .then(res => {
            const _posts = posts.filter(post => post._id !== id);
            setBackendError(null);
            setPost(_posts);
            setDeleteId(null);
        })
        .catch(err => {
            setBackendError(catchError(err.response));
            setDeleteId(null);
        });
};
const getPostComments = (_this) => {
    axios.get(`comment/${_this.state.id}?limit=5&skip=${_this.state.skip}`)
        .then(res => {
            _this.setState({
                loading: false,
                backendError: null
            });
            if(_this.state.page > 1){
                _this.setState({
                    comments: [..._this.state.comments, ...res.data.docs],
                    moreLoader: false,
                });
            }else{
                _this.setState({
                    total: Math.ceil(res.data.total/5),
                    comments: res.data.docs
                })
            }
            _this.setState({
                page: ++_this.state.page,
                skip: _this.state.skip+=5
            });
        }).catch(err => {
        _this.setState({
            loading: false,
            moreLoader: false,
            backendError: catchError(err.response),
            comments: null
        });
    });
};
const deletComment = (_this,commentId) => {
    axios.delete(`comment/${_this.state.id}`, {data:{commentId: commentId}})
        .then(res => {
            const comments = _this.state.comments.filter(comment => comment._id !== commentId);
            _this.setState({
                backendError: null,
                skip: --_this.state.skip,
                deletingCommentId: null,
                comments
            });
        })
        .catch(err => {
            _this.setState({
                backendError: catchError(err.response),
                loading: false,
                deletingCommentId: null,
            });
        });
};
const addComment = (_this, comment) => {
    axios.put(`comment/${_this.state.id}`, comment).then(res => {
        _this.setState({
            backendError: null,
            addCommentLoader: false,
            skip: ++_this.state.skip,
            content: '',
            files:[],
            filesPrev: [],
            comments: [res.data, ..._this.state.comments]
        });
    }).catch(err => {
        _this.setState({
            backendError: catchError(err.response),
            addCommentLoader: false,
        });
    })
};
const getComment = (_this) => {
    axios.get(`comment/${_this.state.postId}/${_this.state.id}`).then(res => {
        if(res.data?.author !== getFromLocalStorage('userData')?.userId){
            _this.props.history.push('/');
        }
        else {
            _this.setState({
                backendError: null,
                addCommentLoader: false,
                loading: false,
                comment: res.data,
                content: res.data.content,
            });
        }
    }).catch(err => {
        _this.setState({
            backendError: catchError(err.response),
            loading: false,
            addCommentLoader: false,
            comment: null
        });
        _this.props.history.push('/');
    })
};
const updateComment = (_this, comment) => {
    axios.put(`comment/edit/${_this.state.postId}/${_this.state.id}`, comment).then(res => {
        _this.setState({
            backendError: null,
            addCommentLoader: false,
            content: res.data.content,
            files:[],
            filesPrev: [],
            deletedMedia: [],
            comment: res.data
        });
    }).catch(err => {
        _this.setState({
            backendError: catchError(err.response),
            addCommentLoader: false,
        });
    })
};
const getDashboard = (_this) => {
    axios.get(`dashboard?limit=10&skip=${_this.state.skip}`).then(res => {
        _this.setState({
            backendError: null,
            loading: false,
        });
        if(_this.state.page > 1){
            _this.setState({
                posts: [..._this.state.posts, ...res.data.docs],
                moreLoader: false,
            });
        }else{
            _this.setState({
                total: res.data.totalPages,
                posts: res.data.docs
            })
        }
        _this.setState({
            page: ++_this.state.page,
            skip: _this.state.skip+=10
        });
    }).catch(err => {
        _this.setState({
            backendError: catchError(err.response),
            loading: false,
            moreLoader: false,
        });
    })
};
const deletPostDashboard = (id, _this) => {
    axios.delete(`post/${id}`, {data:{id: id}})
        .then(res => {
            const _posts = _this.state.posts.filter(post => post._id !== id);
            _this.setState({
                backendError: null,
                deletePostId: null,
                posts: _posts,
                skip: --_this.state.skip,
            });
        })
        .catch(err => {
            _this.setState({
                backendError: catchError(err.response),
                deletePostId: null
            });
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
    friendActions,
    getYourFriendRequests,
    getYourNotifications,
    friendAcceptReject,
    searchFriend,
    getYourPosts,
    postLikes,
    getPostComments,
    deletComment,
    addComment,
    getComment,
    updateComment,
    likePost,
    getPost,
    createPost,
    updatePost,
    deletPost,
    getDashboard,
    likePostDashboard,
    deletPostDashboard,
    logout}
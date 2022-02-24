import axios from 'axios';

let API_URL = process.env.REACT_APP_API_URL;

const token = localStorage.getItem("userToken");

export const login = (username, hra, url?) => {
    if (url) {
        API_URL = url;
    }
    return axios
        .post(API_URL + 'users/auth', {
            Username: username,
            HRA: hra
        })
        .then(res => {
            axios
                .get(API_URL + "users/hra/" + hra,{
                    headers: {
                        'Authorization': `Bearer ${res.data}`
                    }
                })
                .then(result => {
                    localStorage.setItem("user", JSON.stringify(result.data));
                });
            localStorage.setItem("userHRA", hra);
            return res.data;
        }).catch(error => {
            if (error.response) {
                /*
                 * The request was made and the server responded with a
                 * status code that falls out of the range of 2xx
                 */
                /*console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);*/
                return {
                    response : {
                        status: error.response.status,
                        message: "Erreur de connexion",
                        badUserError : true,
                    }
                };
            } else if (error.request) {
                /*
                 * The request was made but no response was received, `error.request`
                 * is an instance of XMLHttpRequest in the browser and an instance
                 * of http.ClientRequest in Node.js
                 */
                return {
                    response : {
                        status: 503,
                        message: "Serveur Inaccessible"
                    }
                };
            } else {
                // Something happened in setting up the request and triggered an Error
                return {
                    response : {
                        status: 503,
                        message: "Service Unavailable"
                    }
                };
            }
            // console.log(error.config);
        });
}


/*const register = (username, email, password) => {
    return axios.post(API_URL + "users/signup", {
        username,
        email,
        password
    });
}*/

const getCurrentUser = (intel) => {
    // return JSON.parse(localStorage.getItem('userToken'));
    return axios
        .get(API_URL + "users/hra/" + intel, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })
        .then(res => {
            return res.data;
        })
        .catch(error => {
            if (error.response) {
                /*
                 * The request was made and the server responded with a
                 * status code that falls out of the range of 2xx
                 */
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
                /*return {
                    response : {
                        status: error.response.status,
                        message: "Erreur de connexion",
                        badUserError : true,
                    }
                };*/
            } else if (error.request) {
                /*
                 * The request was made but no response was received, `error.request`
                 * is an instance of XMLHttpRequest in the browser and an instance
                 * of http.ClientRequest in Node.js
                 */
                return {
                    response : {
                        status: 503,
                        message: "Serveur Inaccessible"
                    }
                };
            } else {
                // Something happened in setting up the request and triggered an Error
                return {
                    response : {
                        status: 503,
                        message: "Service Unavailable"
                    }
                };
            }
            // console.log(error.config);
        });
}

const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userHRA');
    localStorage.removeItem('user');
}

const authService = {
    login,
    logout,
    getCurrentUser,
}

export default authService;

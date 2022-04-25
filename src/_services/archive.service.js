import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;
const token = localStorage.getItem("userToken");

    /*const getAllArchives = () => {

    }*/

    const getArchive = (archiveId) => {
        return axios
            .get(API_URL + 'archives/' + archiveId, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(res => {
                return res.data;
            })
            .catch(error => {
                if (error.response) {
                    return {
                        response : {
                            status: error.response.status,
                            message: "Erreur de connexion",
                            badUserError : true,
                        }
                    };
                } else if (error.request) {
                    return {
                        response: {
                            status: 503,
                            message: "Serveur Inaccessible"
                        }
                    };
                } else {
                    // Something happened in setting up the request and triggered an Error
                    return {
                        response: {
                            status: 503,
                            message: "Service Unavailable"
                        }
                    };
                }
            })
    }

    const postArchive = (archive) => {
        return axios
            .post(API_URL + 'archives/', archive, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(res => {
                return res.data;
            }).catch(error => {
                if (error.response) {
                    return {
                        response : {
                            status: error.response.status,
                            message: "Erreur de connexion",
                            badUserError : true,
                        }
                    };
                } else if (error.request) {
                    return {
                        response: {
                            status: 503,
                            message: "Serveur Inaccessible"
                        }
                    };
                } else {
                    // Something happened in setting up the request and triggered an Error
                    return {
                        response: {
                            status: 503,
                            message: "Service Unavailable"
                        }
                    };
                }
            })
    }

    const putArchive = (archive) => {
        return axios
            .put(API_URL + 'archives/cote/' + archive.cote, archive, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(res => {
                console.log(res.data);
                return res.data;
            })
            .catch(error => {
                if (error.response) {
                    return {
                        response: {
                            status: error.response.status,
                            message: "Erreur de connexion",
                            badUserError: true,
                        }
                    };
                } else if (error.request) {
                    return {
                        response: {
                            status: 503,
                            message: "Serveur Inaccessible"
                        }
                    };
                } else {
                    // Something happened in setting up the request and triggered an Error
                    return {
                        response: {
                            status: 503,
                            message: "Service Unavailable"
                        }
                    };
                }
            })
    }

    /**
     * @param archive
     * @returns {Promise<* | {response: {badUserError: boolean, message: string, status: *}} | {response: {message: string, status: number}} | {response: {message: string, status: number}}>}
     * @desc Permet de mettre à jour plusieurs entrées appartenant au même groupe avec la même valeur
     * @example putArchiveMany(archive) va récupérer le groupe d'archives liées à l'archive envoyée, et modifier le Status et le StatusCode (uniquement ces deux valeurs pour le moment)
     */
    const putArchiveMany = (archive) => {
        return axios
            .put(API_URL + 'archives/group/' + archive.group, archive, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(res => {
                console.log(res.data);
                return res.data;
            })
            .catch(error => {
                if (error.response) {
                    return {
                        response: {
                            status: error.response.status,
                            message: "Erreur de connexion",
                            badUserError: true,
                        }
                    };
                } else if (error.request) {
                    return {
                        response: {
                            status: 503,
                            message: "Serveur Inaccessible"
                        }
                    };
                } else {
                    // Something happened in setting up the request and triggered an Error
                    return {
                        response: {
                            status: 503,
                            message: "Service Unavailable"
                        }
                    };
                }
            })
        }

    /**
     * @param archives
     * @returns {Promise<* | {response: {badUserError: boolean, message: string, status: *}} | {response: {message: string, status: number}} | {response: {message: string, status: number}}>}
     * @desc Permet de mettre à jour plusieurs entrées appartenant au même groupe avec la même valeur
     * @example putArchiveMany(archive) va récupérer le groupe d'archives liées à l'archive envoyée, et modifier le Status et le StatusCode (uniquement ces deux valeurs pour le moment)
     */
    const putUpdateManyStatuses = (archives) => {
        return axios
            .put(API_URL + 'archives/status/', archives, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(res => {
                return res.data;
            })
            .catch(error => {
                if (error.response) {
                    return {
                        response: {
                            status: error.response.status,
                            message: "Erreur de connexion",
                            badUserError: true,
                        }
                    };
                } else if (error.request) {
                    return {
                        response: {
                            status: 503,
                            message: "Serveur Inaccessible"
                        }
                    };
                } else {
                    // Something happened in setting up the request and triggered an Error
                    return {
                        response: {
                            status: 503,
                            message: "Service Unavailable"
                        }
                    };
                }
            })
    }

    const deleteArchive = (archiveId) => {
        return axios
            .delete(API_URL + 'archives/' + archiveId,{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(res => {
                return res.data;
            })
            .catch(error => {
                if (error.response) {
                    return {
                        response : {
                            status: error.response.status,
                            message: "Erreur de connexion",
                            badUserError : true,
                        }
                    };
                } else if (error.request) {
                    return {
                        response: {
                            status: 503,
                            message: "Serveur Inaccessible"
                        }
                    };
                } else {
                    // Something happened in setting up the request and triggered an Error
                    return {
                        response: {
                            status: 503,
                            message: "Service Unavailable"
                        }
                    };
                }
            })
    }



// eslint-disable-next-line import/no-anonymous-default-export
export default {
    postArchive,
    putArchive,
    putArchiveMany,
    putUpdateManyStatuses,
    deleteArchive,
    getArchive,
};

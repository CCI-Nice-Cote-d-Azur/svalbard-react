import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;
const token = localStorage.getItem("userToken");


//region Consutation
const getDemandeConsultationArchive = () => {
    return axios
        .get(API_URL + 'mail/demande-archivage', {
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

const getValidationDemandeConsultationArchive = () => {
    return axios
        .get(API_URL + 'mail/demande-archivage/validation', {
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

const getAnnulationDemandeConsultationArchive = () => {
    return axios
        .get(API_URL + 'mail/demande-archivage/annulation', {
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

//endregion
//region Destruction
const getDemandeDestructionArchive = () => {
    return axios
        .get(API_URL + 'mail/destruction-archive', {
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

const getValidationDemandeDestructionArchive = () => {
    return axios
        .get(API_URL + 'mail/destruction-archive/validation', {
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

const getAnnulationDemandeDestructionArchive = () => {
    return axios
        .get(API_URL + 'mail/destruction-archive/annulation', {
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
//endregion
//region Ajout
const getDemandeAjoutArchive = () => {
    return axios
        .get(API_URL + 'mail/ajout-archive', {
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

const getValidationDemandeAjoutArchive = () => {
    return axios
        .get(API_URL + 'mail/ajout-archive/validation', {
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

const getAnnulationDemandeAjoutArchive = () => {
    return axios
        .get(API_URL + 'mail/ajout-archive/annulation', {
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
//endregion

const MailService = {
    //region Consultation
    getDemandeConsultationArchive,
    getValidationDemandeConsultationArchive,
    getAnnulationDemandeConsultationArchive,
    //endregion
    //region Destruction
    getDemandeDestructionArchive,
    getValidationDemandeDestructionArchive,
    getAnnulationDemandeDestructionArchive,
    //endregion
    //region Ajout
    getDemandeAjoutArchive,
    getValidationDemandeAjoutArchive,
    getAnnulationDemandeAjoutArchive,
    //endregion
}

export default MailService;

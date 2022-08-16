import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;
const token = localStorage.getItem("userToken");

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

const getAnnulationDemandeConsultationArchive = () => {
    return axios
        .get(API_URL + 'mail/annulation-demande-consultation-archive', {
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
        .get(API_URL + 'mail/validation-demande-consultation-archive', {
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

const MailService = {
    getDemandeConsultationArchive,
    getAnnulationDemandeConsultationArchive,
    getValidationDemandeConsultationArchive
}

export default MailService;

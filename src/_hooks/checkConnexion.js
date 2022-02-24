export default function checkConnexion() {
    return !!localStorage.getItem('userToken');
}

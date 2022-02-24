const splitDate = (date) => {
    const dateLean = date.replaceAll(/\s/g,'');
    const separator = dateLean.indexOf("-");
    const dateDebut = dateLean.substring(0, separator);
    const dateFin = dateLean.substring(separator + 1, date.length);

    return {
        dateDebut: dateDebut,
        dateFin: dateFin
    }
}

const addTrailingZeroes = (cote) => {
    if (cote !== undefined && cote !== null) {
        let usualLengthAfterW = 4;
        let posOfW = cote.indexOf('W');
        let beforeW = cote.substring(0, posOfW + 1);
        let afterW = cote.substring(posOfW + 1, cote.length);
        let tempAfterW = afterW;
        if (afterW.length < usualLengthAfterW) {
            for (let i = 0; i < usualLengthAfterW - afterW.length; i++) {
                tempAfterW = '0' + tempAfterW;
            }
        }
        return beforeW + tempAfterW;
    }
    return cote;
}

const getDateNow = () => {
    let today = new Date();
    let date = today.getDate() + ' ' + today.toLocaleString('default', { month: 'long' }) + ' ' + today.getFullYear();
    let time = today.getHours() + ":" + today.getMinutes();
    return date + ' ' + time;
}


const MiscService = {
    splitDate,
    addTrailingZeroes,
    getDateNow
}

export default MiscService;

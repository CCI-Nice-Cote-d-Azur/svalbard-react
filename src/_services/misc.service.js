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
    console.log(cote);
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

const addZeroes = (cote) => {
    console.log('AddZeroes : ' + cote);
    if (cote !== undefined && cote !== null) {
        let lengthRequiredBeforeW = 3;
        let posOfW = cote.indexOf('W');
        let beforeW = cote.substring(0, posOfW);
        let afterW = cote.substring(posOfW + 1, cote.length);
        console.log(beforeW, afterW);
        if (beforeW.length < lengthRequiredBeforeW) {
            for (let i = 0; i < lengthRequiredBeforeW - beforeW.length; i++) {
                beforeW = '0' + beforeW;
            }
        }
        return beforeW + 'W' + afterW;
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
    addZeroes,
    getDateNow
}

export default MiscService;

import {Document, Image, Page, PDFDownloadLink, Text, View} from "@react-pdf/renderer";
import React from "react";
import {DataTableCell, Table, TableBody, TableCell, TableHeader} from "@david.kucsai/react-pdf-table";
import ReactDOM from "react-dom";
import Typography from "@material-ui/core/Typography";
import QRCode from "qrcode.react";
import Button from "@material-ui/core/Button";
import MiscService from "./misc.service";
import {makeStyles} from "@material-ui/core/styles";

const GenerateEtiquettes = (archivesArray, fromFront = false) => {
    const useStyles = makeStyles((theme) => ({
        column: { width: '33%', display: 'flex', justifyContent: 'center' },
        h2Center: { display: 'block', textAlign: 'center', fontSize: 30, marginTop: 1, marginBottom: 1, marginLeft: 0, marginRight: 0, padding: 10 },
        qrImages: { margin: '8%', height: '200px', width: '200px' },
        textInfo: { margin: '10%', display: 'flex', lineHeight: '1.3' },
    }));

    const classes = useStyles();
    let renderPage = [];
    let pageNumber = 0;
    let renderItems = [];
    // eslint-disable-next-line array-callback-return
    archivesArray.map((value, index) => {
        let cote = fromFront ? value['cote'] : value.Cote;
        // let matriculeVerseur = fromFront ? value['matriculeVerseur'] : value.MatriculeVerseur;
        let direction = fromFront ? value['direction'] : value.Direction;
        let service = fromFront ? value['service'] : value.Service;
        let versement = fromFront ? value['versement'] : value.Versement;
        let dossiers = fromFront ? value['dossiers'] : value.Dossiers;
        let elimination = fromFront ? value['elimination'] : value.Elimination;
        const nom = fromFront
            ? archivesArray[0].nom === undefined || archivesArray[0].nom === null ? '' : archivesArray[0].nom.toUpperCase()
            : archivesArray[0].Nom === undefined || archivesArray[0].Nom === null ? '' : archivesArray[0].Nom.toUpperCase();
        const prenom = fromFront
            ? archivesArray[0].prenom !== undefined || archivesArray[0].prenom !== null ? '' : archivesArray[0].prenom
            : archivesArray[0].Prenom !== undefined || archivesArray[0].Prenom !== null ? '' : archivesArray[0].Prenom;

        const canvas = document.getElementById(`$QRGenerated` + cote);
        const pngUrl = canvas
            .toDataURL("image/png")
            .replace("image/png", "image/octet-stream");
        if (index === 0 || index % 3 === 0) {
            renderItems.push([]);
            renderPage.push(
                <Page size='A4' orientation="landscape" wrap>
                    <View style={[classes.row, { height: 575 }]}>{renderItems[pageNumber]}</View>
                </Page>
            );
        }
        renderItems[pageNumber].push(
            <View style={classes.column}>
                <Image src={pngUrl} style={classes.qrImages}/>
                <View style={classes.textInfo}>
                    <Text style={classes.h2Center}>{cote}</Text>
                    <Text>Versé par : {nom.toUpperCase() + ' ' + prenom }</Text>
                    <Text>Direction : { direction }</Text>
                    <Text>Service : { service }</Text>
                    <Text>Versé le : {versement}</Text>
                    {/*<Text>Etablissement : {value.Etablissement}</Text>
                        <Text>Direction : {value.Direction}</Text>
                        <Text>Service : {value.Service}</Text>*/}
                    <Text>Contenu : {dossiers}</Text>
                    <Text>Elimination en {elimination}</Text>
                </View>
            </View>
        );
        if(renderItems[pageNumber].length === 3) {
            pageNumber += 1;
        }
    })
    renderPage = <Document>{renderPage}</Document>

    return renderPage;
}

const DownloadOnClick = (doc, hostId, fileName, directDownload = true) => {

    ReactDOM.render(
        <div key={Math.random()}>
            <Button id={"pdfButton"} variant={"contained"} color={'secondary'} style={{  width: "fit-content", color: 'white', textDecoration: 'none' }} type="button" >
                <PDFDownloadLink className={"etiquettesButton"} style={{ color: 'white', textDecoration: 'none' }} document={doc} fileName={fileName + ".pdf"}>
                    Télécharger {fileName}
                </PDFDownloadLink>
            </Button>
        </div>
        , document.getElementById(hostId)
    );

    if (directDownload) {
        setTimeout(function(){
            // Ajout d'un <a> pour télécharger sans cliquer.
            let downloadLink = document.createElement("a");
            // Ajout d'un identifiant pour le cibler
            downloadLink.id = "tempAnchor"
            // Sélection de l'élément dans le PDFDownloadLink
            // Ajout du HREF au <a> qu'on vient de générer
            downloadLink.href = document.getElementsByClassName("etiquettesButton")[0];
            // Ajout d'un nom pour le fichier à télécharger
            downloadLink.download = fileName;
            // Ajout de l'élément <a> dans le DOM
            document.body.appendChild(downloadLink);
            setTimeout(function(){
                // Clic sur cet élément pour déclancher le téléchargement
                downloadLink.click();
            },200);

            setTimeout(function(){
                // Nettoyage du <a>
                document.getElementById("tempAnchor").remove();
            },200)


            // Permet de ne pas démonter le composant avant de l'avoir utilisé.
            setTimeout(function(){
                ReactDOM.unmountComponentAtNode(document.getElementById(hostId));
            }, 500);
        }, 500);


    }

    // Generate download with use canvas and stream
    /*const canvas = document.getElementById(`$QRGenerated` + cote);
    const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    console.log(pngUrl);
    downloadLink.download = `${cote}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);*/
}

    /**
     * Génère une liste de QR Codes, requiert un tableau d'archives et un identifiant de div pour y coller la liste.
     * @param archivesArray - Tableau d'archives
     * @param id - Identifiant de la div qui va recevoir les QR codes
     * @param fromFront - Permet de savoir si on vient de l'interface Archiviste
     */
    const GenerateQrList = (archivesArray, id, fromFront = false) => {
        const useStyles = makeStyles((theme) => ({
            accordionTitle: { fontSize: "1.2rem" },
        }));

        const classes = useStyles();
        ReactDOM.render(
            archivesArray.map((value, index) => {
                const cote = fromFront ? value['cote'] : value.Cote;
                return (
                    <div key={index}
                         style={{
                             display: "flex",
                             alignItems: "center",
                             flexDirection: "column",
                             width: "15vw"
                         }}>
                        <Typography className={classes.accordionTitle}>{cote}</Typography>
                        <QRCode
                            value={JSON.stringify(value)}
                            size={200}
                            id={`$QRGenerated`+ cote } />
                        {/*<Button variant={"contained"} style={{ margin: "1rem", width: "fit-content"}} type="button" onClick={() => onImageDownload(value.Cote)}>
                            Télécharger le QR Code
                        </Button>*/}
                    </div>
                )
            })
            , document.getElementById(id)
        )
    }

    /**
     * Génère un bordereau de versement
     * @param archivesArray
     * @param fromFront
     * @param type (versement-pal, versement-ad, elimination, consultation)
     * @returns {[]}
     */
        // TODO : const generateBordereauVersement = (archivesArray, fromFront = false, type: string = 'versement-pal' ) => {
    const GenerateBordereauVersement = (archivesArray, fromFront = false, type: string) => {
            const useStyles = makeStyles((theme) => ({
                accordionTitle: { fontSize: "1.2rem" },
                bold: { fontWeight: 'bold' },
                column: { width: '33%', display: 'flex', justifyContent: 'center' },
                columnArchive: { display: 'flex',flexDirection: 'row', justifyContent: 'space-between'},
                font_10: {fontSize: 10}, font_11: {fontSize: 11}, font_12: {fontSize: 12}, font_13: {fontSize: 13}, font_14: {fontSize: 14}, font_16: {fontSize: 16}, font_18: {fontSize: 18},
                footer: { position: 'absolute', left: 0, right: 0, bottom: 15},
                footerText: {textAlign: 'center'},
                h2: { display: 'block', fontSize: 30, marginTop: 1, marginBottom: 1, marginLeft: 0, marginRight: 0, padding: 10 },
                h2Center: { display: 'block', textAlign: 'center', fontSize: 30, marginTop: 1, marginBottom: 1, marginLeft: 0, marginRight: 0, padding: 10 },
                mainBlock: { margin: 30 },
                mb_20: {marginBottom: 20}, mb_30: {marginBottom: 30},
                mt_20: {marginTop: 20},
                nota: { marginLeft: 32},
                qrImages: { margin: '8%', height: '200px', width: '200px' },
                ref: {},
                row: { flex: 1, flexDirection: 'row', flexGrow: 1 },
                text: { margin: 10, fontFamily: 'Oswald', textAlign: 'justify'},
                textInfo: { margin: '10%', display: 'flex', lineHeight: '1.3' },
                title: { textAlign: 'center'},
                titleBlock: {},
                page: { padding: 10 },
                w45: {width: '45%'}, w50: {width: '50%'},
            }));

            const classes = useStyles();
        /*// Routage selon si on vient d'un JSON ou du .NET

        const dossiers = !fromFront ? archivesArray[0].Dossiers : archivesArray[0].dossiers;
        const extremes = !fromFront ? archivesArray[0].Extremes : archivesArray[0].extremes;
        const elimination = !fromFront ? archivesArray[0].Elimination : archivesArray[0].elimination;*/

        // const compteVerseur = !fromFront ? archivesArray[0].CompteVerseur : archivesArray[0].compteVerseur;
        // const cote = !fromFront ? archivesArray[0].Cote : archivesArray[0].cote;

        // fromFront = true;
        const direction = !fromFront ? archivesArray[0].Direction : archivesArray[0].direction;
        const etablissement = !fromFront ? archivesArray[0].Etablissement : archivesArray[0].etablissement;
        const service = !fromFront ? archivesArray[0].Service : archivesArray[0].service;
        const versement = !fromFront ? archivesArray[0].Versement : archivesArray[0].versement;
        const nom = !fromFront
            ? archivesArray[0].Nom === undefined || archivesArray[0].Nom === null ? '' : archivesArray[0].Nom.toUpperCase()
            : archivesArray[0].nom === undefined || archivesArray[0].nom === null ? '' : archivesArray[0].nom.toUpperCase();
        const prenom = !fromFront
            ? archivesArray[0].Prenom === undefined || archivesArray[0].Prenom === null ? '' : archivesArray[0].Prenom
            : archivesArray[0].prenom === undefined || archivesArray[0].prenom === null ? '' : archivesArray[0].prenom;
        const nomDemandeur = !fromFront
            ? archivesArray[0].Consultation.NomDemandeur === undefined || archivesArray[0].Consultation.NomDemandeur === null ? '' : archivesArray[0].Consultation.NomDemandeur.toUpperCase()
            : archivesArray[0].consultation.nomDemandeur === undefined || archivesArray[0].consultation.nomDemandeur === null ? '' : archivesArray[0].consultation.nomDemandeur.toUpperCase();
        const prenomDemandeur = !fromFront
            ? archivesArray[0].Consultation.PrenomDemandeur === undefined || archivesArray[0].Consultation.PrenomDemandeur === null ? '' : archivesArray[0].Consultation.PrenomDemandeur
            : archivesArray[0].consultation.prenomDemandeur === undefined || archivesArray[0].consultation.prenomDemandeur === null ? '' : archivesArray[0].consultation.prenomDemandeur;
        const mailDemandeur = !fromFront ? archivesArray[0].Consultation.MailDemandeur : archivesArray[0].consultation.mailDemandeur;
        const phoneDemandeur = !fromFront ? archivesArray[0].Consultation.PhoneDemandeur : archivesArray[0].consultation.phoneDemandeur;
        // const mail = !fromFront ? archivesArray[0].Mail : archivesArray[0].mail;
        // const phone = !fromFront ? archivesArray[0].Phone : archivesArray[0].mail;
        const consultation = !fromFront ? archivesArray[0].Consultation : archivesArray[0].consultation;

        let title, ref, nota1, nota2, nota3, info1, info2, info3, cadre_droit_1, liste_archive, ADS;
        let nom_utilisateur_confie = "{ PAS DE NOM RENSEIGNE }"
        let table_right_1_col1 = 'Cote du versement';
        let table_right_1_col2 = 'Date de la prise en charge';

        switch (type) {
            case 'versement-pal' :
                title = "Bordereau de versement d'archives publiques au PAL";
                // ref = "Réf : Code du patrimoine (L212-4)";
                nota1 = "Nota : 1 article = 1 dossier dans une boîte";
                nota2 = "1 boîte d'archives = 0,10 mètre linéaire";
                nota3 = "numérotation des articles en continu";
                info1 = "Ce bordereau fera l'objet d'un traitement informatique par le service des Archives départementales. Un inventaire sur support papier sera fourni au service versant.";
                info2 = "La consultation pourra également se faire sur les bases informatiques à partir d'internet :";
                info3 = "https://www.departement06.fr/archives-departementales/outils-de-recherche-et-archives-numerisees-2895.html";
                liste_archive = (
                    <View style={[classes.mb_20, classes.mt_20]}>
                        <Table data={archivesArray}>
                            <TableHeader>
                                <TableCell style={[classes.font_11, {padding: 10, textAlign: 'center'}]} weighting={0.1}>Numéro de boite</TableCell>
                                <TableCell style={[classes.font_11, {padding: 10, textAlign: 'center'}]} weighting={0.4}>Contenu</TableCell>
                                <TableCell style={[classes.font_11, {padding: 10, textAlign: 'center'}]} weighting={0.1}>Date début</TableCell>
                                <TableCell style={[classes.font_11, {padding: 10, textAlign: 'center'}]} weighting={0.1}>Date fin</TableCell>
                                <TableCell style={[classes.font_11, {padding: 10, textAlign: 'center'}]} weighting={0.3}>Observations : échantillonage, circuit, documentaire</TableCell>
                            </TableHeader>
                            <TableBody>
                                <DataTableCell style={[classes.font_11, {padding: 10,}]} textAlign={'center'} weighting={0.1} getContent={(r) => r['cote'] || r['Cote']}/>
                                <DataTableCell style={[classes.font_11, {padding: 10,}]} textAlign={'center'} weighting={0.4} getContent={(r) => r['dossiers'] || r['Dossiers']}/>
                                <DataTableCell style={[classes.font_11, {padding: 10,}]} textAlign={'center'} weighting={0.1} getContent={(r) => {let extremes = r['extremes'] !== undefined ? r['extremes'] : r['Extremes']; return extremes.split('-')[0]}}/>
                                <DataTableCell style={[classes.font_11, {padding: 10,}]} textAlign={'center'} weighting={0.1} getContent={(r) => {let extremes = r['extremes'] !== undefined ? r['extremes'] : r['Extremes']; return extremes.split('-')[1]}}/>
                                <DataTableCell style={[classes.font_11, {padding: 10,}]} textAlign={'center'} weighting={0.3} getContent={(r) => r['dossiers'] || r['Dossiers']}/>
                            </TableBody>
                        </Table>
                    </View>
                )
                break;
            case 'versement-ad':
                title = "Bordereau de versement d'archives publiques";
                ref = '';
                let i = 0;
                liste_archive = (
                    <View style={[classes.mb_20, classes.mt_20]}>
                        <Table data={archivesArray}>
                            <TableHeader>
                                <TableCell style={[classes.font_11, {padding: 10, textAlign: 'center'}]} weighting={0.1}>Numéro d'article</TableCell>
                                <TableCell style={[classes.font_11, {padding: 10, textAlign: 'center'}]} weighting={0.4}>Catégories de documents</TableCell>
                                <TableCell style={[classes.font_11, {padding: 10, textAlign: 'center'}]} weighting={0.1}>Date début</TableCell>
                                <TableCell style={[classes.font_11, {padding: 10, textAlign: 'center'}]} weighting={0.1}>Date fin</TableCell>
                                <TableCell style={[classes.font_11, {padding: 10, textAlign: 'center'}]} weighting={0.3}>Observations : DUA, texte de référence, doubles...</TableCell>
                            </TableHeader>
                            <TableBody>
                                <DataTableCell style={[classes.font_11, {padding: 10,}]} textAlign={'center'} weighting={0.1} getContent={() => { i++; return i }}/>
                                <DataTableCell style={[classes.font_11, {padding: 10,}]} textAlign={'center'} weighting={0.4} getContent={(r) => r['dossiers'] || r['Dossiers']}/>
                                <DataTableCell style={[classes.font_11, {padding: 10,}]} textAlign={'center'} weighting={0.1} getContent={(r) => {let extremes = r['extremes'] !== undefined ? r['extremes'] : r['Extremes']; return extremes.split('-')[0]}}/>
                                <DataTableCell style={[classes.font_11, {padding: 10,}]} textAlign={'center'} weighting={0.1} getContent={(r) => {let extremes = r['extremes'] !== undefined ? r['extremes'] : r['Extremes']; return extremes.split('-')[1]}}/>
                                <DataTableCell style={[classes.font_11, {padding: 10,}]} textAlign={'center'} weighting={0.3} getContent={(r) => r['elimination'] || r['Elimination']}/>
                            </TableBody>
                        </Table>
                    </View>
                )
                break;
            case 'elimination' :
                title = "Bordereau d'elimination d'archives publiques";
                ref = "Réf : Code du patrimoine (L212-2 et 3, R212-14 et R212-51) et Code pénal (432-15 et 432-16). \n " +
                    "La destruction devra s'effectuer dans le respect de la confidentialité des documents (dénaturation ou incinération)";
                nota1 = "Nota : 1 boîte d'archives = 0,10 mètre linéaire";
                nota2 = "1 m³ = 12ml = 600 kg";
                nota3 = "1 ml = 50 kg = 0,080 m³";
                table_right_1_col1 = 'Date de la demande';
                table_right_1_col2 = 'Nombre de pages du bordereau';
                liste_archive = (
                    <View style={[classes.mb_20, classes.mt_20, classes.bggray]}>
                        <Table data={archivesArray}>
                            <TableHeader>
                                <TableCell style={[classes.font_11, {padding: 10, textAlign: 'center'}]} weighting={0.1}>Nombre de boîtes</TableCell>
                                <TableCell style={[classes.font_11, {padding: 10, textAlign: 'center'}]} weighting={0.4}>Catégories de documents</TableCell>
                                <TableCell style={[classes.font_11, {padding: 10, textAlign: 'center'}]} weighting={0.1}>Date début</TableCell>
                                <TableCell style={[classes.font_11, {padding: 10, textAlign: 'center'}]} weighting={0.1}>Date fin</TableCell>
                                <TableCell style={[classes.font_11, {padding: 10, textAlign: 'center'}]} weighting={0.3}>Observations : DUA, texte de référence, doubles...</TableCell>
                            </TableHeader>
                            <TableBody>
                                <DataTableCell style={[classes.font_11, {padding: 10,}]} textAlign={'center'} weighting={0.1} getContent={(r) => r['cote'] || r['Cote']}/>
                                <DataTableCell style={[classes.font_11, {padding: 10,}]} textAlign={'center'} weighting={0.4} getContent={(r) => r['dossiers'] || r['Dossiers']}/>
                                <DataTableCell style={[classes.font_11, {padding: 10,}]} textAlign={'center'} weighting={0.1} getContent={(r) => {let extremes = r['extremes'] !== undefined ? r['extremes'] : r['Extremes']; return extremes.split('-')[0]}}/>
                                <DataTableCell style={[classes.font_11, {padding: 10,}]} textAlign={'center'} weighting={0.1} getContent={(r) => {let extremes = r['extremes'] !== undefined ? r['extremes'] : r['Extremes']; return extremes.split('-')[1]}}/>
                                <DataTableCell style={[classes.font_11, {padding: 10,}]} textAlign={'center'} weighting={0.3} getContent={(r) => r['elimination'] || r['Elimination']}/>
                            </TableBody>
                        </Table>
                    </View>
                )
                break;
            case 'consultation' :
                nom_utilisateur_confie = nomDemandeur + ' ' + prenomDemandeur;
                title = "Bordereau de consultation d'archives publiques";
                ref = "Date de la demande : " + MiscService.getDateNow();
                info1 = "Les documents indiqués ci-dessous ont été confiés à " + nom_utilisateur_confie + " et en est responsable à compter de ce jour."

                ADS = (
                    <View style={classes.w45}>
                        <Table data={[
                            { col1: 'Administration', col2: consultation.etablissementDemandeur },
                            { col1: 'Direction', col2: consultation.directionDemandeur },
                            { col1: 'Service', col2: consultation.serviceDemandeur }
                        ]}>
                            <TableHeader />
                            <TableBody>
                                <DataTableCell style={[classes.font_12, {padding: 10,}]} textAlign={'center'} weighting={0.4} getContent={(r) => r.col1}/>
                                <DataTableCell style={[classes.font_12, {padding: 10,}]} textAlign={'center'} getContent={(r) => r.col2}/>
                            </TableBody>
                        </Table>
                    </View>
                );
                cadre_droit_1 = (
                    <View style={{width: '50%'}}>
                        <Table style={{width: '50%'}} data={[
                            {col1: "Nom prénom du demandeur", col2: nomDemandeur + ' ' + prenomDemandeur},
                            {col1: "Mail", col2: mailDemandeur},
                            {col1: "Téléphone", col2: phoneDemandeur},
                        ]}>
                            <TableHeader />
                            <TableBody>
                                <DataTableCell style={[classes.font_12, {padding: 10,}]} textAlign={'center'} weighting={0.3} getContent={(r) => r.col1}/>
                                <DataTableCell style={[classes.font_12, {padding: 10,}]} textAlign={'center'} weighting={0.7} getContent={(r) => r.col2}/>
                            </TableBody>
                        </Table>
                    </View>
                )
                liste_archive = (
                    <View style={[classes.mb_20, classes.mt_20]}>
                        <View style={{width: '60%'}}>
                        <Table data={archivesArray}>
                            <TableHeader>
                                <TableCell style={[classes.font_11, {padding: 10, textAlign: 'center'}]} weighting={0.4}>Cote d'archivage</TableCell>
                                <TableCell style={[classes.font_11, {padding: 10, textAlign: 'center'}]} weighting={0.3}>Date de communication</TableCell>
                                <TableCell style={[classes.font_11, {padding: 10, textAlign: 'center'}]} weighting={0.3}>Date de retour</TableCell>
                            </TableHeader>
                            <TableBody>
                                <DataTableCell style={[classes.font_11, {padding: 10,}]} textAlign={'center'} weighting={0.4} getContent={(r) => r['cote'] || r['Cote']}/>
                                <DataTableCell style={[classes.font_11, {padding: 10,}]} textAlign={'center'} weighting={0.3} getContent={() => {}}/>
                                <DataTableCell style={[classes.font_11, {padding: 10,}]} textAlign={'center'} weighting={0.3} getContent={() => {}}/>
                            </TableBody>
                        </Table>
                        </View>
                    </View>
                )
                break;

            default :
                break;
        }

        /**
         * Contenu du document PDF
         */
        const subtitle = "A remplir et renvoyer en trois exemplaires signés en originaux sous format papier";
        const footer = "Archives départementales, CADAM, 147 bd du Mercantour, 06206 Nice Cedex 3 - 04 97 18 68 62 - dad@departement06.fr";
        const responsableService1 = "Responsable du service ou de l'executif : ";
        const responsableService2 = "Nom, prénom : ";
        const responsableService3 = "Date : ";
        const responsableService4 = "Signature : ";
        const responsableArchive1 = "Le directeur des Archives départementales des Alpes-Maritimes";
        const responsableArchive2 = process.env.REACT_APP_DIRECTEUR_06;
        const responsableArchive3 = "Nice, le : ";
        const responsableArchive4 = "Signature : ";
        const archivisteNomPrenom = process.env.REACT_APP_ARCIHIVISTE_NOM + ' ' + process.env.REACT_APP_ARCIHIVISTE_PRENOM;
        const archivisteMail = process.env.REACT_APP_ARCIHIVISTE_MAIL;
        const archivistePhone = process.env.REACT_APP_ARCIHIVISTE_PHONE;

        let renderPage = [];
        renderPage.push(
            <Document>
                <Page size='A4' orientation="landscape" wrap>
                    <View style={classes.mainBlock}>
                        {/* Bloc Titre */}
                        <View style={classes.titleBlock}>
                            <Text style={[classes.title, classes.font_14, classes.mt_20]}>{title && title.toUpperCase()}</Text>
                            <Text style={[classes.title, classes.font_12, classes.mt_20]}>{subtitle}</Text>
                            <Text style={[classes.ref, classes.font_10, classes.mt_20]}>{ref}</Text>
                        </View>
                        {/* -- Bloc Titre FIN-- */}
                        <View style={classes.mt_20}>
                            <View style={classes.columnArchive}>
                                { type !== "consultation" ?
                                <View style={classes.w45}>
                                    <Table data={[
                                        {col1: 'Administration', col2: etablissement},
                                        {col1: 'Direction', col2: direction},
                                        {col1: 'Service', col2: service}
                                    ]}>
                                        <TableHeader />
                                        <TableBody>
                                            <DataTableCell style={[classes.font_12, {padding: 10,}]} textAlign={'center'} weighting={0.4} getContent={(r) => r.col1}/>
                                            <DataTableCell style={[classes.font_12, {padding: 10,}]} textAlign={'center'} getContent={(r) => r.col2}/>
                                        </TableBody>
                                    </Table>
                                </View>
                                    : ADS
                                }
                                { type === "versement-ad" ?
                                    <View style={{backgroundColor: 'lightgray', width: '50%'}}>
                                        <Table data={[
                                            {col1: table_right_1_col1, col2: ''},
                                            {col1: table_right_1_col2, col2: ''},
                                        ]}>
                                            <TableHeader>
                                                {type !== 'elimination' && <TableCell style={[classes.font_12, {padding: 10,}]} textAlign={'center'}>Archives départementales (partie réservée)</TableCell> }
                                            </TableHeader>
                                            <TableBody>
                                                <DataTableCell style={[classes.font_12, {padding: 10,}]} textAlign={'center'} weighting={0.4} getContent={(r) => r.col1}/>
                                                <DataTableCell style={[classes.font_12, {padding: 10,}]} textAlign={'center'} getContent={(r) => r.col2}/>
                                            </TableBody>
                                        </Table>
                                    </View>
                                    : cadre_droit_1
                                }

                            </View>
                            <View style={[classes.mt_20, classes.columnArchive]}>
                                <View style={classes.w45}>
                                    <Table data={[
                                        {col1: 'Agent en charge du versement (nom, prénom)', col2: archivisteNomPrenom},
                                        {col1: 'Courriel', col2: archivisteMail},
                                        {col1: 'Téléphone', col2: archivistePhone}
                                    ]}>
                                        <TableHeader />
                                        <TableBody>
                                            <DataTableCell style={[classes.font_12, {padding: 10,}]} textAlign={'center'} weighting={0.4} getContent={(r) => r.col1}/>
                                            <DataTableCell style={[classes.font_12, {padding: 10,}]} textAlign={'center'} getContent={(r) => r.col2}/>
                                        </TableBody>
                                    </Table>
                                </View>
                                <View style={classes.w50}>
                                    <Table data={[
                                        {col1: 'Métrage linéaire', col2: archivesArray.length / 10},
                                    ]}>
                                        <TableHeader />
                                        <TableBody>
                                            <DataTableCell style={[classes.font_12, {padding: 10,}]} textAlign={'center'} weighting={0.4} getContent={(r) => r.col1}/>
                                            <DataTableCell style={[classes.font_12, {padding: 10,}]} textAlign={'center'} getContent={(r) => r.col2}/>
                                        </TableBody>
                                    </Table>
                                </View>
                            </View>
                        </View>

                        {/* -- Bloc Nota & Infos-- */}
                        <View style={[classes.mb_30, classes.mt_20]}>
                            <View>
                                <Text style={[classes.font_10]}>{nota1}</Text>
                                <Text style={[classes.nota, classes.font_10]}>{nota2}</Text>
                                <Text style={[classes.nota, classes.font_10]}>{nota3}</Text>
                            </View>
                            <View style={classes.mt_20}>
                                <Text style={[classes.font_10, classes.title]}>{info1}</Text>
                                <Text style={[classes.font_10, classes.title]}>{info2}</Text>
                                <Text style={[classes.font_10, classes.title]}>{info3}</Text>
                            </View>
                        </View>
                        {/* -- Bloc Nota & Infos FIN-- */}
                    </View>
                    {type === "versement-ad" &&
                        <View fixed={true} style={classes.footer}>
                            <Text style={[classes.footerText, classes.font_10]}>{footer}</Text>
                        </View>
                    }
                </Page>
                <Page size='A4' orientation="landscape" wrap>
                    <View style={classes.mainBlock}>
                        {/* Bloc Liste des archives */}

                            { liste_archive }

                        {/* Bloc Liste des archives FIN */}
                        {/* -- Bloc Responsable service & Responsable archive départementale -- */}
                        <View style={[classes.columnArchive ,classes.mt_20, classes.mb_20]}>
                            <View style={[classes.w50 ,classes.mt_20]}>
                                <Text style={classes.font_10}>{responsableService1}</Text>
                                <Text style={[classes.mt_20, classes.font_10]}>{responsableService2} {nom + ' ' + prenom }</Text>
                                <Text style={[classes.mt_20, classes.font_10]}>{responsableService3} {versement}</Text>
                                <Text style={classes.font_10}>{responsableService4}</Text>
                            </View>
                            <View style={[classes.w50 ,classes.mt_20]}>
                                <Text style={classes.font_10}>{responsableArchive1}</Text>
                                <Text style={[classes.mt_20, classes.font_10]}>{responsableArchive2}</Text>
                                <Text style={[classes.mt_20, classes.font_10]}>{responsableArchive3}</Text>
                                <Text style={classes.font_10}>{responsableArchive4}</Text>
                            </View>
                        </View>
                        {/* -- Bloc Responsable service & Responsable archive départementale FIN-- */}
                    </View>
                    { type === "versement-ad" &&
                        <View fixed={true} style={classes.footer}>
                          <Text style={[classes.footerText, classes.font_10]}>{footer}</Text>
                        </View>
                    }
                </Page>
            </Document>
        );

        return renderPage;
    }

const GeneratePdfService = {
    GenerateEtiquettes,
    GenerateBordereauVersement,
    GenerateQrList,
    DownloadOnClick
}

export default GeneratePdfService;

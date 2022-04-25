import React, {useEffect, useMemo, useRef} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {
    Accordion, AccordionDetails, AccordionSummary,
    Box, Collapse, Grid, IconButton,
    Paper,
    Step,
    StepContent,
    StepLabel,
    Stepper,
    TextField,
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CloseIcon from '@material-ui/icons/Close';
import './add-archive.css';
import Alert from "@material-ui/lab/Alert";
import {DataGrid} from "@material-ui/data-grid";
import ArchiveService from '../_services/archive.service'
import GeneratePdfService from "../_services/generatepdf.service";
import { v4 as uuidv4 } from 'uuid';
import MiscService from "../_services/misc.service";

const randomColor = require('randomcolor');

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    button: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    actionsContainer: {
        marginBottom: theme.spacing(2),
    },
    resetContainer: {
        padding: theme.spacing(3),
        display: "flex",
        justifyContent: "space-around"
    },
    fab: {
        marginLeft: theme.spacing(4),
    },
    tooltip: {
        maxWidth: "45vw",
        minWidth: "45vw",
        maxHeight: "50vh",
    },
    accordionTitle: {
        fontSize: "1.2rem"
    },
    accordion: {
        marginTop: theme.spacing(3),
    },
    box: {
        marginBottom: theme.spacing(3)
    },
    accordionDetails: {
        display: "flex",
        flexDirection: "column",
    },
    accordionTypoDetails: {
        marginBottom: theme.spacing(3),
        textDecoration: "underline"
    },
    accordionTypoTips: {
        marginBottom: theme.spacing(3),
    },
    page: {
        display: "flex",
        flexDirection: "row",
        backgroundColor: '#E4E4E4'
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
        width: "33%",
        backgroundColor: "red"
    },
}));

const columns = [
    { field: 'id', headerName: 'ID', width: 90, hide: true },
    {
        field: 'cote',
        headerName: 'Cote',
        width: 120,
    },
    {
        field: 'contenu',
        headerName: 'Contenu',
        width: 400,
        editable: true,
        wordWrapEnabled: true
    },
    {
        field: 'dateDebut',
        headerName: 'Date début',
        width: 150,
        editable: true,
    },
    {
        field: 'dateFin',
        headerName: 'Date fin',
        width: 150,
        editable: true,
    },
    {
        field: 'obs',
        headerName: 'Observations',
        width: 400,
        editable: true,
    },
    {
        field: 'elim',
        headerName: 'Date d\'élimination',
        width: 200,
        editable: true,
    },
    /*{
        field: 'fullName',
        headerName: 'Full name',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 160,
        valueGetter: (params) =>
            `${params.getValue(params.id, 'cote') || ''} ${
                params.getValue(params.id, 'lastName') || ''
            }`,
    },*/
];

let rows = [];

function useApiRef() {
    const apiRef = useRef(null);
    const _columns = useMemo(
        () =>
            columns.concat({
                field: "__HIDDEN__",
                width: 0,
                renderCell: (params) => {
                    apiRef.current = params.api;
                    return null;
                }
            }),
        []
    );

    return { apiRef, columns: _columns };
}

function getSteps() {
    return ["Choisir la cote de l'archive", "Choisir le nombre d'archives à ajouter", 'Remplir les informations requises'];
}

const AddArchive = (props) => {
    const classes = useStyles();
    const API_URL = process.env.REACT_APP_API_URL;
    const { apiRef, columns } = useApiRef();

    const [activeStep, setActiveStep] = React.useState(0);
    const [lastCoteObj, setLastCoteObj] = React.useState('');
    const [inputValue, setInputValue] = React.useState('');
    const [cotesList, setCotesList] = React.useState([]);
    const [errMessage, setErrMessage] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [archiveCount, setArchiveCount] = React.useState();
    const [isDisabled, setIsDisabled] = React.useState(true);
    const [qrGenerated, setQrGenerated] = React.useState(false);

    useEffect(() => {
        fetch(API_URL + "cotes")
            .then(result => result.json())
            .then(value => setCotesList(value));
    }, [API_URL]);

    const generateDataGrid = (value) => {
        let tempArr = [];
        for (let i = 1; i <= value; i++) {

            let temp = (Number(lastCoteObj["cote"].substr(3)) + i).toString();
            temp = MiscService.addTrailingZeroes(temp);
            let cote = lastCoteObj["cote"].substr(0, 3) + temp;

            tempArr.push({
                id: i,
                cote : cote,
                contenu: "",
                dateDebut: "",
                dateFin: "",
                obs: "",
                elim: ""
            })
        }
        rows = tempArr;
    }

    /*const onQRGenerate = (archivesArray) => {
        const doc = GeneratePdfService.generateEtiquettes(archivesArray);
        GeneratePdfService.downloadOnClick(doc, "pdfLinkHolder", "Etiquettes")
    }*/

    const steps = getSteps();

    const endAndSubmit = () => {
        let archivesArray = [];
        const uuidGroup = uuidv4();
        const color = randomColor();

        const gridData = apiRef.current.getRowModels();
        gridData.forEach((data) => {
            const userIntel = JSON.parse(localStorage.getItem('user'));
            console.log(userIntel);
            const archive = {
                N: null,
                Nom: userIntel["nom"],
                Prenom : userIntel["prenom"],
                Group: uuidGroup,
                GroupColor: color,
                Versement: new Date(Date.now()).toLocaleString().split(',')[0],
                MatriculeVerseur: userIntel["matricule"],
                CompteVerseur: userIntel["compte"],
                Etablissement: userIntel["site"],
                Direction: userIntel["direction"],
                Service: userIntel["service"],
                Dossiers: data["contenu"],
                Extremes: data["dateDebut"] + " - " + data["dateFin"],
                Elimination: data["elim"],
                Cote: data["cote"],
                Localisation: null,
                Status: "Archivage demandé",
                StatusCode: 1,
                Logs: [],
                Consultation: {
                    NomDemandeur: userIntel['nom'],
                    PrenomDemandeur: userIntel['prenom'],
                    MailDemandeur: userIntel['adresseMail'],
                    MatriculeDemandeur: userIntel['matricule'],
                    TelephoneDemandeur: null,
                    EtablissementDemandeur: userIntel['site'],
                    DirectionDemandeur: userIntel['direction'],
                    ServiceDemandeur: userIntel['service'],
                }
            };
            archive.Logs.push({
                mouvement: "IN",
                mouvement_desc: "CCI vers PAL",
                usr_id: userIntel["matricule"],
                usr_name: userIntel["compte"],
                date: new Date(Date.now()),
                slug_date: Date.now()
            });
            console.log(archive);
            ArchiveService.postArchive(archive)
                .then(archivesArray.push(archive));
            setQrGenerated(true);
        });
        handleNext();
        GeneratePdfService.generateQrList(archivesArray, "QrList");

        let doc = GeneratePdfService.generateEtiquettes(archivesArray);
        GeneratePdfService.downloadOnClick(doc, "etiquetteBtnHolder", "etiquette(s)", false);
        doc = GeneratePdfService.generateBordereauVersement(archivesArray)
        GeneratePdfService.downloadOnClick(doc, "bordereauBtnHolder", "bordereau", false);
        /*onQRGenerate(archivesArray);*/
        // archivesArray = [];

    }

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        if(activeStep === 1) {
            generateDataGrid(archiveCount);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
        setIsDisabled(true);
        setQrGenerated(false);
    };

    const handleReset = () => {
        // TODO : Trouver un moyen plus élégant de tacler ce problème.
        // Il n'est pas possible de générer les boutons pour télécharger le PDF des étiquettes après un reset.
        window.location.reload(false);
        /*setInputValue('');
        setActiveStep(0);
        setIsDisabled(true);
        setQrGenerated(false);
        if (document.getElementById('QrList').childElementCount > 0
            && document.getElementById('etiquetteBtnHolder').childElementCount > 0
            && document.getElementById('bordereauBtnHolder').childElementCount > 0
    ) {
            document.getElementById('QrList').firstChild.remove();
            document.getElementById('etiquetteBtnHolder').firstChild.remove();
            document.getElementById('bordereauBtnHolder').firstChild.remove();
        }*/
    };

    const onKeyUp = (event) => {
        if (event.keyCode === 8 || event.keyCode === 46) {
            setInputValue('');
        }
    }

    const onChangeCount = (e) => {
        setArchiveCount(e.target.value);
    }

    function getStepContent(step) {
        switch (step) {
            case 0:
                return (
                    <Box className={classes.box}>
                        <Collapse in={open}>
                            <Alert
                                severity="error"
                                variant={"outlined"}
                                style={{
                                    marginTop: "1rem",
                                    marginBottom: "1rem"
                                }}
                                action={
                                    <IconButton
                                        aria-label="close"
                                        color="inherit"
                                        size="small"
                                        onClick={() => {
                                            setOpen(false);
                                        }}
                                    >
                                        <CloseIcon fontSize="inherit" />
                                    </IconButton>
                                }
                            >
                                {errMessage}
                            </Alert>
                        </Collapse>
                        <TextField
                            id="outlined-basic"
                            value={inputValue.length === 3 ? lastCoteObj["cote"] : inputValue}
                            inputProps={{ maxLength: 3 }}
                            variant="outlined"
                            onChange={fetchCote}
                            onKeyUp={onKeyUp}
                            placeholder={"Exemple : 06W"} />
                        <Accordion className={classes.accordion}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                            <Typography className={classes.accordionTitle}>Comment choisir la côte ? (Cliquez moi)</Typography>
                            </AccordionSummary>
                            <AccordionDetails className={classes.accordionDetails}>
                                <Typography variant={"subtitle1"} className={classes.accordionTypoDetails}>Voici la liste des côtes disponibles :</Typography>
                                <Typography variant={"subtitle2"} className={classes.accordionTypoTips}>Astuce : Pour rechercher un mot, sur votre clavier taper Ctrl + F pour effectuer une recherche.</Typography>
                                {/*<Typography variant={"subtitle2"} className={classes.accordionTypoTips}>Astuce : Cliquez sur une valeur pour la sélectionner.</Typography>*/}
                                <Grid container spacing={3}>
                                    {/*Ajouter la logique de génération du Json renvoyé par le fetch*/}
                                    {cotesList.map(cote => (
                                        <Grid
                                            item xs={2}
                                            key={cote['id']}
                                        >
                                            <p>{cote["coteCode"]} - {cote["label"]}</p>
                                        </Grid>
                                    ))}
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    </Box>
                )
            case 1:
                return (
                    <Box className={classes.box}>
                        <TextField id="outlined-basic" variant="outlined" placeholder={"Exemple : 5"} type={'number'} value={archiveCount} onChange={onChangeCount} />
                    </Box>
                );
            case 2:
                return (
                <Box height={"68vh"} width={"100%"}>
                    { !qrGenerated && (
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSize={10}
                            rowsPerPageOptions={[10]}
                            disableSelectionOnClick
                            onSelectionModelChange={(e) => {
                                const selectedRows = e;
                                let selectedRowData = [];
                                selectedRows.forEach(rowId => {
                                    selectedRowData.push(rows.filter((row) => row.id === rowId)[0]);
                                });
                                // setSelectedRowDataState(selectedRowData);
                            }}
                          columnBuffer={2} headerHeight={56} localeText={''} rowHeight={52} sortingOrder={['asc', 'desc', null]}/>
                    )}
                </Box>
                );
            default:
                return 'Unknown step';
        }
    }

    function fetchCote(e) {
        setInputValue(e.target.value);
        if(e.target.value.length === 2) {
            let cote = e.target.value + "W";
            setInputValue(cote);
            fetch(API_URL + "archives/lastCote/" + cote)
                .then((result) => {
                    if(!result.ok) {
                        setErrMessage("Cette cote n'existe pas, merci de ne pas l'utiliser");
                        setOpen(true);
                        setInputValue("");
                        return {};
                    } else {
                        setOpen(false);
                        return result.json();
                    }
                })
                .then(elm => {
                    MiscService.addTrailingZeroes(elm.cote);
                    setLastCoteObj(elm);
                });
        } else {
            // Demander à l'utilsateur de renseigner au moins 2 caractères
        }
    }

    return (
        <div className={classes.root} style={{paddingLeft: props.drawerWidth}}>
            <Stepper activeStep={activeStep} orientation="vertical" style={{ minHeight: '100vh', display: 'block' }}>
                {steps.map((label, index) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                        <StepContent>
                            <Typography>{getStepContent(index)}</Typography>
                            <div className={classes.actionsContainer}>
                                {!qrGenerated && (
                                <div>
                                        <Button
                                            variant={"contained"}
                                            disabled={activeStep === 0}
                                            onClick={handleBack}
                                            className={classes.button}
                                        >
                                            Précédent
                                        </Button>
                                    { activeStep === steps.length - 1 && (
                                        <Button
                                            variant="contained"
                                            style={{
                                            backgroundColor: "#51BB45",
                                            color: "white"
                                        }}
                                            onClick={() => setIsDisabled(false)}
                                            className={classes.button}
                                        >
                                        Valider
                                        </Button>
                                        ) }
                                    { activeStep === steps.length - 1 ? (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={endAndSubmit}
                                            className={classes.button}
                                            disabled={isDisabled}
                                        >
                                        Terminer
                                        </Button>
                                        ) : (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleNext}
                                            className={classes.button}
                                            disabled={inputValue.length < 3}
                                        >
                                        Suivant
                                        </Button>
                                        ) }
                                    </div>
                                    )}
                            </div>
                        </StepContent>
                    </Step>
                ))}
                <Step key="LastStep">
                    <StepLabel>Vos QR Codes et étiquettes</StepLabel>
                    <StepContent>
                        {/*<Typography>{getStepContent(index)}</Typography>*/}

                    </StepContent>
                </Step>
                <div>
                    <Box className={classes.box}>
                        <Paper square className={classes.resetContainer}>
                            <div id={"QrList"} hidden={true} />
                            <div id={"etiquetteBtnHolder"} />
                            <div id={"bordereauBtnHolder"} />
                        </Paper>
                    </Box>
                    <div id={'pdfLinkHolder'}></div>
                    <Button variant="contained" onClick={handleReset} className={classes.button}>
                        Reset
                    </Button>
                </div>
            </Stepper>
        </div>
    );
}

export default AddArchive;


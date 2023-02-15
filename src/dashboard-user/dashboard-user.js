import React, {useState} from "react";
import ActionsRendererDashboardUser from "../dashboard-user/actionsRendererDashboardUser";
import {createStyles, makeStyles} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import {AgGridColumn, AgGridReact} from "ag-grid-react";
import Box from "@material-ui/core/Box";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import ArchiveService from '../_services/archive.service';
import GeneratePdfService from "../_services/generatepdf.service";
import MailService from "../_services/mail.service";

const DashboardUser = (props) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const nullDate = '0001-01-01T00:00:00';
    const [rowData, setRowData] = useState([]);
    const [params, setParams] = useState([]);
    const [errOccured, setErrOccured] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("En cours de chargement");
    const userHRA = localStorage.getItem('userHRA');
    const [open, setOpen] = useState(false);
    const [openRetourPAL, setOpenRetourPAL] = useState(false);
    const [line, setLine] = useState(null);

    let onGridReady = (params) => {
        // setApi(params.api);

        fetch(API_URL + "archives/hra/notArchived/" + userHRA)
            .then(result => result.json())
            .then((rd) => {
                if (rd.length === 0) {
                    document.getElementById('overlayText').innerText = 'Pas de données';
                } else {
                    setRowData(rd);
                }
                GeneratePdfService.GenerateQrList(rd, "QrHiddenHolder", true);
            })
            .catch(() => {
                setErrOccured(true);
                setLoadingMessage("Impossible de se connecter au serveur");
            });
        setTimeout(() => {
            params.api.showLoadingOverlay();
        }, 0);

    };

    const gridOption = {
        overlayLoadingTemplate : '<span class="ag-overlay-loading-center" id="overlayText">' + loadingMessage + '</span>',
    }

    const defaultColDef = {
        flex: 1,
        minWidth: 50,
        resizable: true,
    }

    const columnDefs = [
        {
            field: 'cote',
            floatingFilterComponentParams: {
                suppressFilterButton: true,
            },
        },
        {
            field: "versement",
            floatingFilterComponentParams: {
                suppressFilterButton: true,
            },
        },
        {
            field: "status",
            floatingFilterComponentParams: {
                suppressFilterButton: true,
            },
        },
        {
            field: "consultation.dateDemande",
            headerName: "Date demande de consultation",
            floatingFilterComponentParams: {
                suppressFilterButton: true,
            },
            cellRenderer: (params) => {
                if(params.data.consultation.dateDemande && params.data.consultation.dateDemande !== nullDate) {
                    return params.data.consultation.dateDemande;
                } else {
                    return "n/a";
                }
            }
        },
        {
            field: "actions",
            floatingFilterComponentParams: {
                suppressFilterButton: true,
            },
            cellRenderer: 'actionRenderer'
        }
    ]

    const handleOpen = (params, retourPAL = false) => {
        console.log(params);
        setParams(params);
        setLine(params.data);
        if (retourPAL) {
            setOpenRetourPAL(true);
        } else {
            setOpen(true);
        }
    };

    const handleClose = (retourPAL = false) => {
        setLine(null);
        if (retourPAL) {
            setOpenRetourPAL(false);
        } else {
            setOpen(false);
        }

    };

    /*const handleDelete = () => {
        ArchiveService.deleteArchive(line.id).then(() => {
            let rowToDelete = params.node.data;
            params.api.applyTransaction({remove : [rowToDelete]});
            setLine(null);
            setOpen(false);
        });
    }*/

    const handleCancel = () => {
        let archive = params.data;

        switch (params.data.statusCode) {
            case 1 :
                break;
            case 2 :
                params.data.status = "Archivé";
                params.data.statusCode = 0;
                params.data.consultation = {};
                deleteArchive(archive);
                break;
            case 22 :
                params.data.status = "En cours de versement au PAL";
                params.data.statusCode = 11;
                params.data.consultation = {};
                updateArchive(archive);
                break;
            default: break;
        }
    }

    const updateArchive = (archive) => {
        ArchiveService.putArchive(archive)
            .then((res) => {
                console.log(res);
                let rowToUpdate = params.node.data;
                params.api.applyTransaction({update : [rowToUpdate]});
                handleClose(true);
            });
            // .then(MailService.getAnnulationDemandeConsultationArchive);
    }

    const deleteArchive = (archive) => {
        ArchiveService.putArchive(archive)
            .then(() => {
                let rowToDelete = params.node.data;
                params.api.applyTransaction({remove : [rowToDelete]});
                setLine(null);
                setOpen(false);
            })
            .then(MailService.getAnnulationDemandeConsultationArchive);
    }

    const getAllRows = (params) => {
        let {rowsToDisplay} = params.api.getModel();

        return rowsToDisplay;
    }

    const handleEtiquette = (params) => {
        let archivesLabel = [];
        const fileName = 'Etiquettes';
        let rowsToDisplay = getAllRows(params);
        let linkedArchives = [];

        rowsToDisplay.forEach(row => {
            if(params.data.group === row.data.group) {
                linkedArchives.push(row.data);
            }
        })
        archivesLabel = linkedArchives;
        const doc = GeneratePdfService.GenerateEtiquettes(archivesLabel, true);
        GeneratePdfService.DownloadOnClick(doc, "pdfLabelHolder", fileName);
    }

    const handleBordereau = (params) => {
        let archivesBordereau = [];
        let fileName = `Bordereau`;
        archivesBordereau.push(params.data);
        let rowsToDisplay = getAllRows(params);
        let linkedArchives = [];

        rowsToDisplay.forEach(row => {
            if(params.data.group === row.data.group) {
                linkedArchives.push(row.data);
            }
        });
        archivesBordereau = linkedArchives;

        let doc = GeneratePdfService.GenerateBordereauVersement(archivesBordereau);
        if (params.data.statusCode === 2) {
            doc = GeneratePdfService.GenerateBordereauVersement(archivesBordereau, true, 'consultation');
        }
        GeneratePdfService.DownloadOnClick(doc, "pdfBordereauHolder", fileName);
    }

    const useStyles = makeStyles(theme => {
        createStyles({
            content: {
                padding: theme.spacing(3),
            },
        })
    });

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        padding: 20,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        pt: 2,
        px: 4,
        pb: 3,
        textAlign: 'center'
    };

    const classes = useStyles();

    return (
        <div>
            <div style={{paddingLeft: props.drawerWidth}} className={props.darkModeEnabled ? "ag-theme-alpine-dark" : "ag-theme-alpine"}>
                <div className={classes.content}
                     style={{
                         width: "100%",
                         height: '80vh',
                         margin: '20px'
                     }}>

                    // FIXME : Erreur au niveau de l'affichage, l'alerte se génère alors que le booléen est sur FALSE.
                    {errOccured && (
                        <Alert
                            severity="warning"
                            style={{
                                marginTop: "1rem"
                            }}>
                            {loadingMessage}
                        </Alert>
                    )}
                    <AgGridReact
                        frameworkComponents={{
                            actionRenderer: ActionsRendererDashboardUser
                        }}
                        gridOptions={gridOption}
                        rowStyle={{textAlign: 'left'}}
                        rowData={rowData}
                        defaultColDef={defaultColDef}
                        onGridReady={onGridReady}
                        columnDefs={columnDefs}
                        context={{handleOpen, handleBordereau, handleEtiquette}}
                    >
                        <AgGridColumn field="cote" />
                        <AgGridColumn field="versement" />
                        <AgGridColumn field="status" />
                        <AgGridColumn field="consultation.dateDemande" />
                        <AgGridColumn field="actions" />
                    </AgGridReact>
                </div>
                <div id={"QrHiddenHolder"} hidden={true} />
                <div id={"pdfLabelHolder"} hidden={true} />
                <div id={"pdfBordereauHolder"} hidden={true} />

            </div>
            <Modal
                open={open}
                onClose={() => handleClose(false)}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box style={style}>
                    <h2 id="parent-modal-title">Annuler la demande ?</h2>
                    <p id="parent-modal-description">
                        Attention, vous allez annuler la demande. <br />
                        Ceci aura pour effet d'annuler la requête sur l'élément : <b>{line !== null ? line.cote : ''}.</b> <br />
                        Voulez-vous continuer ?
                    </p>
                    <div style={{
                        display: 'flex',
                        justifyContent: "space-evenly"
                    }}>
                        <Button type={"button"} color={"secondary"} onClick={() => handleClose(false)}>Non</Button>
                        <Button type={"button"} variant="contained" color={"primary"} onClick={() => handleCancel(props.node)}>Oui</Button>
                    </div>
                </Box>
            </Modal>
            <Modal
                open={openRetourPAL}
                onClose={() => handleClose(true)}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box style={style}>
                    <h2 id="parent-modal-title">Demander le retour de l'archive au PAL ?</h2>
                    <p id="parent-modal-description">
                        Attention, vous allez demander le retour de l'archive au PAL. <br />
                        Cette archive sera récupérée par la personne en charge des archives : <b>{line !== null ? line.cote : ''}.</b> <br />
                        Voulez-vous continuer ?
                    </p>
                    <div style={{
                        display: 'flex',
                        justifyContent: "space-evenly"
                    }}>
                        <Button type={"button"} color={"secondary"} onClick={() => handleClose(true)}>Non</Button>
                        <Button type={"button"} variant="contained" color={"primary"} onClick={() => handleCancel(props.node)}>Oui</Button>
                    </div>
                </Box>
            </Modal>
        </div>

    );
};
export default DashboardUser;



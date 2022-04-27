import React, {useState} from "react";
import {createStyles, makeStyles} from "@material-ui/core";
import {AgGridColumn, AgGridReact} from "ag-grid-react";
import ActionRendererArchiviste from './actionsRendererArchiviste.jsx';
import GeneratePdfService from "../_services/generatepdf.service";
import ArchiveService from '../_services/archive.service';
import {Alert} from "@material-ui/lab";
import Snackbar from '@material-ui/core/Snackbar';

const DashboardArchiviste = (props) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const [rowData, setRowData] = useState([]);
    const [message, setMessage] = useState("Pas de données");
    const [open, setOpen] = React.useState(false);

    let onGridReady = (params) => {
        getTableData(params, false);
    };

    const getTableData = (params?, reRender?) => {
        fetch(API_URL + "archives/allButArchived")
            .then(result => result.json())
            .then(rowData => {
                GeneratePdfService.generateQrList(rowData, "QrHiddenHolder", true);
                setRowData(rowData);
            })
            .catch(() => {
                setMessage("Impossible de se connecter au serveur");
                handleClick();
            });
        if (!reRender) {
            setTimeout(() => {
                params.api.showLoadingOverlay();
            }, 0);
        }
    }

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const reRender = () => {
        getTableData(null, true);
    }

    const noLocalisationAlert = () => {
        setMessage('Merci de renseigner une localisation pour l\'archive que vous tentez de valider ')
        handleClick();
    }

    const gridOption = {
        overlayLoadingTemplate : '<span class="ag-overlay-loading-center">' + message + '</span>',
        rowClass: "archiviste-table",
        enableCellChangeFlash: true,
        getRowStyle: params => {
            // TODO : Remettre ça en place après les tests
            /*if (params.data["groupColor"]) {
                return {'background-color': params.data["groupColor"]}
            }*/
        },

        onCellValueChanged: (params) => {
            if (params.oldValue !== params.newValue) {
                let archiveLocalisationUpdate = params.data;
                archiveLocalisationUpdate.localisation = params.newValue;
                ArchiveService.putArchive(archiveLocalisationUpdate).then(() => {});
            }
        }
    }

    const defaultColDef = {
        flex: 1,
        minWidth: 50,
        resizable: true,
    }

    const columnDefs =
        [{field: "versement",floatingFilterComponentParams: {suppressFilterButton: true,},maxWidth: 110},{field: 'cote',floatingFilterComponentParams: {suppressFilterButton: true,},maxWidth: 100},
        {field: 'nom',floatingFilterComponentParams: {suppressFilterButton: true,},minWidth: 100,maxWidth: 140},
        {field: 'prenom',floatingFilterComponentParams: {suppressFilterButton: true,},minWidth: 100,maxWidth: 140},{field: "etablissement",floatingFilterComponentParams: {suppressFilterButton: true,}},
        {field: "direction",floatingFilterComponentParams: {suppressFilterButton: true,},},
        {field: "service",floatingFilterComponentParams: {suppressFilterButton: true,},},
        {field: "status",floatingFilterComponentParams: {suppressFilterButton: true,},minWidth: 250},
        {field: "localisation",floatingFilterComponentParams: {suppressFilterButton: true,},editable: true,/*minWidth: 300*/},
        {field: "actions",/*minWidth: 400,*/floatingFilterComponentParams: {suppressFilterButton: true,}, cellRenderer: 'actionRenderer'}]

    const useStyles = makeStyles(theme => {
        createStyles({
            content: {
                padding: theme.spacing(3),
            },
        })
    });

    const classes = useStyles();

    return (
        <div style={{paddingLeft: props.drawerWidth}} className={props.darkModeEnabled ? "ag-theme-alpine-dark" : "ag-theme-alpine"}>
            <div className={classes.content}
                 style={{
                     width: "100%",
                     height: '80vh',
                     margin: '20px'
                 }}>
                <div>
                    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                        <Alert variant={"filled"} onClose={handleClose} severity="warning">
                            {message}
                        </Alert>
                    </Snackbar>
                </div>
                <AgGridReact
                    frameworkComponents={{
                        actionRenderer: ActionRendererArchiviste,
                    }}
                    gridOptions={gridOption}
                    rowStyle={{textAlign: 'left'}}
                    rowData={rowData}
                    defaultColDef={defaultColDef}
                    onGridReady={onGridReady}
                    columnDefs={columnDefs}
                    context={{reRender, noLocalisationAlert}}
                >
                    <AgGridColumn field="versement" />
                    <AgGridColumn field="cote" />
                    <AgGridColumn field="compteVerseur" />
                    <AgGridColumn field="etablissement" />
                    <AgGridColumn field="direction" />
                    <AgGridColumn field="service" />
                    <AgGridColumn field="status" />
                    <AgGridColumn field="actions" />
                </AgGridReact>
            </div>
            <div id={"pdfLabelHolder"} hidden={true} />
            <div id={"pdfBordereauHolder"} hidden={true} />
            <div id={"QrHiddenHolder"} hidden={true} />
        </div>
    );
};
export default DashboardArchiviste;



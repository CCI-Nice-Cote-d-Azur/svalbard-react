import React, {useState} from "react";
import {Button, createStyles, makeStyles} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import {AgGridColumn, AgGridReact} from "ag-grid-react";
import ActionRendererArchiviste from './actionsRendererArchiviste.jsx';
import GeneratePdfService from "../_services/generatepdf.service";
import ArchiveService from '../_services/archive.service';

const DashboardArchiviste = (props) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const [rowData, setRowData] = useState([]);
    const [paramsApi, setParamsApi] = useState();
    const [errOccured, setErrOccured] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("Pas de données");

    let onGridReady = (params) => {
        setParamsApi(params);
        fetch(API_URL + "archives/allButArchived")
            .then(result => result.json())
            .then(rowData => {
                GeneratePdfService.generateQrList(rowData, "QrHiddenHolder", true);
                setRowData(rowData);
            })
            .catch(() => {
                setErrOccured(true);
                setLoadingMessage("Impossible de se connecter au serveur");
            });
        setTimeout(() => {
            params.api.showLoadingOverlay();
        }, 0);
    };

    let reRender = () => {
        onGridReady(paramsApi);
    }

    const gridOption = {
        overlayLoadingTemplate : '<span class="ag-overlay-loading-center">' + loadingMessage + '</span>',
        rowClass: "archiviste-table",

        getRowStyle: params => {
            if (params.data["groupColor"]) {
                return {'background-color': params.data["groupColor"]}
            }
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
        {field: "status",floatingFilterComponentParams: {suppressFilterButton: true,},cellRenderer: 'statusCodeToText',minWidth: 250},
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
                {errOccured && (
                    <Alert
                        severity="danger"
                        style={{
                            marginTop: "1rem"
                        }}>
                        {loadingMessage}
                    </Alert>
                )}
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
                    context={{reRender}}
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



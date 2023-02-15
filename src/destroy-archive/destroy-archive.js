import React, {useState} from "react";
import PropTypes from "prop-types";
import ArchiveService from "../_services/archive.service";
import {createStyles, makeStyles} from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import {Alert} from "@material-ui/lab";
import {AgGridColumn, AgGridReact} from "ag-grid-react";
import ActionsRendererDestroy from "../destroy-archive/actionsRendererDestroy";
import LogoExcel from "../assets/images/excel_logo.png";
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

const DestroyArchive = (props) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const [gridApi, setGridApi] = useState([]);
    const [rowData, setRowData] = useState([]);
    const [message, setMessage] = useState("Pas de données");
    const [open, setOpen] = useState(false);
    const [destructionCount, setDestructionCount] = useState();
    // const [value, setValue] = React.useState(0);

    /*const handleChange = (event, newValue) => {
        setValue(newValue);
    };*/

    let onGridReady = (params) => {
        setGridApi(params.api);
        getTableData(params, false);
    };

    const getTableData = (params?, reRender?, reRenderParam?) => {
        if (typeof reRenderParam === "undefined") {
            reRenderParam = 'toDestroy';
        }
        fetch(API_URL + "archives/" + reRenderParam)
            .then(result => result.json())
            .then(rowData => {
                setRowData(rowData);
                setDestructionCount(rowData.length);
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

    const reRender = (parameter?) => {
        getTableData(null, true, parameter);
    };

    const noLocalisationAlert = () => {
        setMessage('Merci de renseigner une localisation pour l\'archive que vous tentez de valider ')
        handleClick();
    };

    const onBtnExport = () => {
        gridApi.exportDataAsCsv();
    };

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
        [{field: "elimination",floatingFilterComponentParams: {suppressFilterButton: true,},maxWidth: 110},
        {field: 'cote',floatingFilterComponentParams: {suppressFilterButton: true,},maxWidth: 100},
        {field: 'nom',floatingFilterComponentParams: {suppressFilterButton: true,},minWidth: 100,maxWidth: 140},
        {field: 'prenom',floatingFilterComponentParams: {suppressFilterButton: true,},minWidth: 100,maxWidth: 140},
        {field: "etablissement",floatingFilterComponentParams: {suppressFilterButton: true,}},
        {field: "direction",floatingFilterComponentParams: {suppressFilterButton: true,},},
        {field: "service",floatingFilterComponentParams: {suppressFilterButton: true,},sortable: true},
        {field: "status",floatingFilterComponentParams: {suppressFilterButton: true,},minWidth: 250},
        {field: "localisation",floatingFilterComponentParams: {suppressFilterButton: true,},editable: true, sortable: true/*minWidth: 300*/},
        {field: "actions",floatingFilterComponentParams: {suppressFilterButton: true}, cellRenderer: 'actionRenderer'}]

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
                     height: '90vh',
                     margin: '20px'
                 }}>
                <div>
                    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                        <Alert variant={"filled"} onClose={handleClose} severity="warning">
                            {message}
                        </Alert>
                    </Snackbar>
                </div>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <p>Nombre d'archives à détruire : {destructionCount}</p>
                    <ButtonGroup variant="outlined" aria-label="outlined button group" style={{marginRight: "10px"}}>
                        <Button onClick={() => reRender("toDestroy")}>Versement / Destruction</Button>
                        <Button>Destructions validées par l'AD</Button>
                        <Button onClick={() => reRender("toGiveToAD")}>Pour versement aux AD</Button>
                    </ButtonGroup>
                    <div style={{display: "flex", alignItems: "center"}}>

                        <img src={LogoExcel} alt="Logo Excel" style={{height: '3.5rem', cursor: "pointer"}} onClick={onBtnExport}/>
                    </div>
                </div>
                <AgGridReact
                    frameworkComponents={{
                        actionRenderer: ActionsRendererDestroy,
                    }}
                    gridOptions={gridOption}
                    rowStyle={{textAlign: 'left'}}
                    rowData={rowData}
                    defaultColDef={defaultColDef}
                    onGridReady={onGridReady}
                    columnDefs={columnDefs}
                    context={{reRender, noLocalisationAlert}}
                >
                    <AgGridColumn field="destruction" />
                    <AgGridColumn field="cote" />
                    <AgGridColumn field="nom" />
                    <AgGridColumn field="prenom" />
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
}

export default DestroyArchive;


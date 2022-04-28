import './archive.css';
import React, { useState} from 'react';
import {AgGridColumn, AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    createStyles,
    makeStyles
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import {DataGrid} from "@material-ui/data-grid";
import Button from '@material-ui/core/Button';
import { useHistory } from "react-router-dom";
import ArchiveService from "../_services/archive.service";

const Archives = (props) => {
    let history = useHistory();
    const API_URL = process.env.REACT_APP_API_URL
    const [selectedRows, setSelectedRows] = useState([]);
    // const [expanded, setExpanded] = useState(false);
    const [rowData, setRowData] = useState([]);
    const [gridApi, setGridApi] = useState([]);
    // const [gridColumnApi, setGridColumnApi] = useState(null);
    const [errOccured, setErrOccured] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("En cours de chargement");
    //const {height, width} = useWindowDimensions();

    let selectedNotSelected = true;

    let onGridReady = (params) => {
        setGridApi(params.api);
        // setGridColumnApi(params.columnApi);

        fetch(API_URL + "archives")
            .then(result => result.json())
            .then(rowData => setRowData(rowData))
            .catch(() => {
                setErrOccured(true);
                setLoadingMessage("Impossible de se connecter au serveur");
            });
            setTimeout(() => {
                params.api.showLoadingOverlay();
            }, 0);
    };

    const gridOptions = {
        overlayLoadingTemplate : '<span class="ag-overlay-loading-center">' + loadingMessage + '</span>',
        rowClassRules: {
            "row-fail": params =>
                   params.data.statusCode === 2
                || params.data.statusCode === 3
                || params.data.statusCode === 4
                || params.data.statusCode === 11
                || params.data.statusCode === 12
                || params.data.statusCode === 13
                || params.data.statusCode === 14
                || params.data.statusCode === 21
                || params.data.statusCode === 22
                || params.data.statusCode === 23,
        },
        onCellValueChanged: (params) => {
            // On peut tout éditer, je bloque donc l'édition à la localisation uniquement.
            if (params.oldValue !== params.newValue && params.column.colId === 'localisation') {
                let archiveLocalisationUpdate = params.data;
                archiveLocalisationUpdate.localisation = params.newValue;
                ArchiveService.putArchive(archiveLocalisationUpdate).then(() => {});
            }
        }
    }

    const rowSelected = (event) => {
        let rows = [...selectedRows];
        if (event.node.isSelected()) {
            rows.push(event.data);
        } else {
            rows.forEach((row, i) => {
                if (row.id === event.data.id) {
                    rows.splice(i, 1)
                }
            })
        }
        setSelectedRows(rows);
    }

    const onRowClicked = (params) => {
        let selectedNodes = gridApi.getSelectedNodes();
        selectedNodes.forEach(node => {
            if (node.data.id === params.id) {
                node.setSelected(false);
            }
        })
    }

    const validateButtonClicked = () => {
        const registeredUser = JSON.parse(localStorage.getItem('user'));
        selectedRows.forEach(row => {
            row.status = "Consultation demandée";
            row.statusCode = 2;
            row.matriculeDemandeur = registeredUser.matricule;
            row.consultation = {
                nomDemandeur: registeredUser.nom,
                prenomDemandeur: registeredUser.prenom,
                mailDemandeur: registeredUser.adresseMail,
                telephoneDemandeur: registeredUser.telephone,
                matriculeDemandeur: registeredUser.matricule,
                etablissementDemandeur: registeredUser.site,
                directionDemandeur: registeredUser.direction,
                serviceDemandeur: registeredUser.service
            }
        });

        ArchiveService.putUpdateManyStatuses(selectedRows)
            .then(setTimeout(() => {
                history.push('/mes-demandes');
            } , 200));
    }

    const defaultColDef = {
        flex: 1,
        minWidth: 50,
        resizable: true,
        filter: true,
        floatingFilter: true,
        floatingFilterComponentParams: {
            suppressFilterButton: true,
        },
        sortable: true,
        editable: () => {return props.isArchiviste},
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 90, hide: true },
        { field: 'cote', headerName: 'Cote', width: 140},
        { field: 'versement', headerName: 'Versement', width: 200},
        { field: 'etablissement', headerName: 'Etablissement', width: 100},
        { field: 'direction', headerName: 'Direction', width: 200, },
        { field: 'service', headerName: 'Service', width: 200, },
        { field: 'dossiers', headerName: 'Dossiers', width: 200, },
    ];

    if (props.isArchiviste) {
        columns.splice(2, 0, {
            field: 'localisation',
            headerName: 'Localisation',
            minWidth: columns.length * 6,
            maxWidth: columns.length * 6,
        });
        columns.splice(8, 0, {
            field: 'extremes',
            headerName: 'Extremes',
            width: columns.length * 14,
        });
        columns.splice(9, 0, {
            field: 'elimination',
            headerName: 'Elimination',
            width: columns.length * 14,
        });
    }

    const useStyles = makeStyles(theme => {
        createStyles({
            content: {
                flexGrow: 1,
                padding: theme.spacing(3),
            },
        })
    });

    const classes = useStyles();

    return (
        <div
            style={{
                paddingLeft: props.drawerWidth,
            }}>
            {/*<Button variant="outlined" style={{marginLeft: "2em", marginTop: "1em"}} onClick={getSelectedRows}>{  }</Button>*/}
            <Accordion className={classes.accordion}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography className={classes.accordionTitle}>{ selectedNotSelected ? "Voir les lignes sélectionnées" : "Voir le tableau complet" }</Typography>
                </AccordionSummary>
                <AccordionDetails className={classes.accordionDetails} style={{display: "block"}}>
                    { selectedRows.length > 0 && (
                        <Button
                            id="validateButton"
                            variant="contained"
                            color="primary"
                            onClick={validateButtonClicked}
                        >
                            Demander à consulter</Button>
                    )}
                    <DataGrid
                        rows={selectedRows}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        disableSelectionOnClick
                        style={{height: 640}}
                        columnBuffer={2} headerHeight={56} localeText={''} rowHeight={52} sortingOrder={['asc', 'desc', null]}
                        onRowClick={onRowClicked}
                    />
                </AccordionDetails>
            </Accordion>
            <div className={props.darkModeEnabled ? "ag-theme-alpine-dark" : "ag-theme-alpine"}>
                <div className={classes.content}
                     style={{
                         width: "100%",
                         height: '90vh',
                         overflowY: "auto"
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
                        gridOptions={gridOptions}
                        suppressRowClickSelection={true}
                        rowSelection={'multiple'}
                        onGridReady={onGridReady}
                        rowData={rowData}
                        defaultColDef={defaultColDef}
                        rowStyle={{textAlign: 'left'}}
                        onRowSelected={rowSelected}
                    >
                        <AgGridColumn
                            headerName="Cote"
                            field="cote"
                            minWidth={180}
                            headerCheckboxSelectionFilteredOnly={true}
                            checkboxSelection={true}/>
                        { props.isArchiviste && (
                            <AgGridColumn field="localisation"  />
                        )}
                        <AgGridColumn field="versement" />
                        <AgGridColumn field="etablissement" />
                        <AgGridColumn field="direction" />
                        <AgGridColumn field="service" />
                        <AgGridColumn field="dossiers" />
                        { props.isArchiviste && (
                            <AgGridColumn field="extremes"/>
                        )}
                        { props.isArchiviste && (
                            <AgGridColumn field="elimination" />
                        )}

                    </AgGridReact>
                </div>
            </div>
        </div>

    );
};
export default Archives;



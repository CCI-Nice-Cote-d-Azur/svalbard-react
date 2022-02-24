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
//import useWindowDimensions from "../_hooks/windowDimensions";

const Archives = (props) => {
    const API_URL = process.env.REACT_APP_API_URL
    const [selectedRows, setSelectedRows] = useState([]);
    const [rowData, setRowData] = useState([]);
    // const [gridApi, setGridApi] = useState([]);
    // const [gridColumnApi, setGridColumnApi] = useState(null);
    const [errOccured, setErrOccured] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("En cours de chargement");
    //const {height, width} = useWindowDimensions();

    let selectedNotSelected = true;

    let onGridReady = (params) => {
        // setGridApi(params.api);
        // setGridColumnApi(params.columnApi);

        fetch(API_URL + "archives/archived")
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


    const defaultColDef = {
        flex: 1,
        minWidth: 50,
        resizable: true,
        filter: true,
        floatingFilter: true,
        floatingFilterComponentParams: {
            suppressFilterButton: true,
        },
        sortable: true
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 90, hide: true },
        {
            field: 'cote',
            headerName: 'Cote',
            width: 150
        },
        {
            field: 'localisation',
            headerName: 'Localisation',
            minWidth: 30,
            maxWidth: 30,
        },
        {
            field: 'versement',
            headerName: 'Versement',
            width: 200,
        },
        {
            field: 'etablissement',
            headerName: 'Etablissement',
            width: 200,
        },
        {
            field: 'direction',
            headerName: 'Direction',
            width: 200,
        },
        {
            field: 'service',
            headerName: 'Service',
            width: 200,
        },
        {
            field: 'dossiers',
            headerName: 'Dossiers',
            width: 200,
        },
        {
            field: 'extremes',
            headerName: 'Extremes',
            width: 120,
        },
        {
            field: 'elimination',
            headerName: 'Elimination',
            width: 120,
        },
    ];

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
                <AccordionDetails className={classes.accordionDetails}>
                    <DataGrid
                        rows={selectedRows}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        disableSelectionOnClick
                        style={{height: 640}}
                        columnBuffer={2} headerHeight={56} localeText={''} rowHeight={52} sortingOrder={['asc', 'desc', null]}
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
                        <AgGridColumn field="localisation" />
                        <AgGridColumn field="versement" />
                        <AgGridColumn field="etablissement" />
                        <AgGridColumn field="direction" />
                        <AgGridColumn field="service" />
                        <AgGridColumn field="dossiers" />
                        <AgGridColumn field="extremes" />
                        <AgGridColumn field="elimination" />
                    </AgGridReact>
                </div>
            </div>
        </div>

    );
};
export default Archives;



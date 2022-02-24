import React, {useState} from "react";
import {createStyles, makeStyles} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import {AgGridColumn, AgGridReact} from "ag-grid-react";
import Box from "@material-ui/core/Box";
import Modal from "@material-ui/core/Modal";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import {FcCancel, FiFileText} from "react-icons/all";
import {LocalOffer} from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import ArchiveService from '../_services/archive.service';
import GeneratePdfService from "../_services/generatepdf.service";

const DashboardUser = (props) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const [rowData, setRowData] = useState([]);
    const [params, setParams] = useState([]);
    // const [api, setApi] = useState([]);
    // const [gridApi, setGridApi] = useState([]);
    const [errOccured, setErrOccured] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("En cours de chargement");
    const userHRA = localStorage.getItem('userHRA');
    const [open, setOpen] = useState(false);
    const [line, setLine] = useState(null);

    let onGridReady = (params) => {
        // setApi(params.api);

        fetch(API_URL + "archives/hra/" + userHRA)
            .then(result => result.json())
            .then(rd => setRowData(rd))
            .catch(() => {
                setErrOccured(true);
                setLoadingMessage("Impossible de se connecter au serveur");
            });
        setTimeout(() => {
            params.api.showLoadingOverlay();
        }, 0);
    };

    const gridOption = {
        overlayLoadingTemplate : '<span class="ag-overlay-loading-center">' + loadingMessage + '</span>',
    }

    const defaultColDef = {
        flex: 1,
        minWidth: 50,
        resizable: true,
    }

    const actionRenderer = (params) => {
        return (
        <span style={{display: "flex", alignItems: "center"}}>
            {params.data.status === 'Archivage demandé' &&
            <Tooltip title= {<p style={{ fontSize: '1.4em' }}>Annuler la demande</p>}>
                <IconButton size={"small"} onClick={() => handleOpen(params)} >
                    <FcCancel size={"1.4em"} />
                </IconButton>
            </Tooltip>
            }
            <Tooltip title= {<p style={{ fontSize: '1.4em' }}>Imprimer l'étiquette</p>}>
                <IconButton size={"small"} onClick={() => handleEtiquette(params)} >
                    <LocalOffer size={"1.4em"} />
                </IconButton>
            </Tooltip>
            <Tooltip title= {<p style={{ fontSize: '1.4em' }}>Imprimer le bordereau</p>}>
                <IconButton size={"small"} onClick={() => handleOpen(params)} >
                    <FiFileText size={"1.4em"} />
                </IconButton>
            </Tooltip>
        </span>
        )
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
            cellRenderer: 'statusCodeToText'
        },
        {
            field: "actions",
            floatingFilterComponentParams: {
                suppressFilterButton: true,
            },
            cellRenderer: 'actionRenderer'
        }
    ]

    const handleOpen = (params) => {
        setParams(params);
        setLine(params.data);
        setOpen(true);
    };

    const handleClose = () => {
        setLine(null);
        setOpen(false);
    };

    const handleDelete = () => {
        ArchiveService.deleteArchive(line.id).then(() => {
            let rowToDelete = params.node.data;
            params.api.applyTransaction({remove : [rowToDelete]});
            setLine(null);
            setOpen(false);
        });
    }

    const handleEtiquette = (params) => {
        GeneratePdfService.generateEtiquettes(params.node.data);
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
        boxShadow: 24,
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
                            actionRenderer: actionRenderer
                        }}
                        gridOptions={gridOption}
                        rowStyle={{textAlign: 'left'}}
                        rowData={rowData}
                        defaultColDef={defaultColDef}
                        onGridReady={onGridReady}
                        columnDefs={columnDefs}
                    >
                        <AgGridColumn field="cote" />
                        <AgGridColumn field="versement" />
                        <AgGridColumn field="status" />
                        <AgGridColumn field="actions" />
                    </AgGridReact>
                </div>
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box style={style}>
                    <h2 id="parent-modal-title">Supprimer l'élément ?</h2>
                    <p id="parent-modal-description">
                        Attention, vous allez annuler la demande. <br />
                        Ceci aura pour effet de supprimer la cote : <b>{line !== null ? line.cote : ''}</b> <br />
                        Voulez-vous continuer ?
                    </p>
                    <div style={{
                        display: 'flex',
                        justifyContent: "space-evenly"
                    }}>
                        <Button color={"secondary"} onClick={handleClose}>Non</Button>
                        <Button variant="contained" color={"primary"} onClick={() => handleDelete(props.node)}>Oui, supprimer {line !== null ? line.cote : ''}</Button>
                    </div>
                </Box>
            </Modal>
        </div>

    );
};
export default DashboardUser;



import React from 'react';
import { FcCheckmark, GoFile, GoFileSubmodule, MdInput} from "react-icons/all";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import ArchiveService from '../_services/archive.service';
import GeneratePdfService from "../_services/generatepdf.service";
import {LocalOffer, Style} from "@material-ui/icons";

/*import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';*/


const actionRendererArchiviste =  (params) => {
    let archive = params.data;
    let statusCode = params.data.statusCode;
    // eslint-disable-next-line react-hooks/rules-of-hooks


    // eslint-disable-next-line react-hooks/rules-of-hooks
    /*const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;*/
    //TODO:  singleArchive permet de de définir si on veut valider une ligne ou si on veut valider toutes les lignes en bulk (il faudra ajouter cette fonction plus tard).
    const validerArchivage = (singleArchive?) => {
        switch(archive.statusCode) {
            case 1 :
                archive.statusCode = 11;
                archive.status = 'En cours de versement au PAL';
                break;
            case 2:
                archive.statusCode = 12;
                archive.status = 'En cours de récupération au PAL';
                break;
            case 3:
                archive.statusCode = 13;
                archive.status = 'En cours de destruction';
                break;
            case 4 :
                archive.statusCode = 14;
                archive.status = 'En cours de remise aux AD';
                break;
            case 11 :
                archive.statusCode = 21;
                archive.status = 'Archivé au PAL';
                break;
            case 12:
                archive.statusCode = 22;
                archive.status = 'En consultation';
                break;
            case 13:
                archive.statusCode = 23;
                archive.status = 'Détruit';
                break;
            case 14 :
                archive.statusCode = 24;
                archive.status = 'Archivé aux Archives Départementales';
                break;
            default :
                break;
        }
        if (archive.group) {
            ArchiveService.putArchiveMany(archive).then(() => params.api.redrawRows());
        } else if (singleArchive) {
            ArchiveService.putArchive(archive).then(() => params.api.redrawRows());
        } else {
            // TODO : Faire en sorte que la coche s'enlève pour tous les éléments du groupe.
            //
        }
    }

    const getAllRows = () => {
        let {rowsToDisplay} = params.api.getModel();
        return rowsToDisplay;
    }

    const generateLabel = (several) => {
        let archivesLabel = [];
        let fileName = `Etiquettes` + archive.cote;
        archivesLabel.push(archive);
        if(several) {
            fileName = 'Etiquettes';
            let rowsToDisplay = getAllRows();
            let linkedArchives = [];

            rowsToDisplay.forEach(row => {
                if(archive.group === row.data.group) {
                    linkedArchives.push(row.data);
                }
            })
            archivesLabel = linkedArchives;
        }
        let doc = GeneratePdfService.generateEtiquettes(archivesLabel, true);
        GeneratePdfService.downloadOnClick(doc, "pdfLabelHolder", fileName);
    }

    const generateBordereau = (several) => {
        let archivesBordereau = [];
        let fileName = `Bordereau`;
        archivesBordereau.push(archive);
        if(several) {
            fileName = `Bordereaux`;
            let rowsToDisplay = getAllRows();
            let linkedArchives = [];

            rowsToDisplay.forEach(row => {
                if(archive.group === row.data.group) {
                    linkedArchives.push(row.data);
                }
            });
            archivesBordereau = linkedArchives;
        }
        let doc = GeneratePdfService.generateBordereauVersement(archivesBordereau, true);
        GeneratePdfService.downloadOnClick(doc, "pdfBordereauHolder", fileName);
    }

    const renderSwitch = () => {
        if (statusCode === 1 || statusCode === 2 || statusCode === 3 || statusCode === 4) {
            return (
                <Tooltip title= {<p style={{ fontSize: '1.4em' }}>Valider la demande</p>}>
                    <IconButton size={"small"} onClick={() => {validerArchivage(true)}}>
                        <FcCheckmark size={"1.4em"} />
                    </IconButton>
                </Tooltip>
            )
        } else if (statusCode === 11) {
            return (
                <Tooltip title= {<p style={{ fontSize: '1.4em' }}>Valider le versement au PAL</p>}>
                    <IconButton size={"small"} onClick={() => {validerArchivage(true)}}>
                        <MdInput color={"#43A047"} size={"1.4em"} />
                    </IconButton>
                </Tooltip>
            );
        } else if (statusCode === 12) {
            return (
                <Tooltip title= {<p style={{ fontSize: '1.4em' }}>Valider la récupération depuis le PAL</p>}>
                    <IconButton size={"small"} onClick={() => {validerArchivage(true)}}>
                        <MdInput color={"#43A047"} size={"1.4em"} />
                    </IconButton>
                </Tooltip>
            )
        }
        // FIXME: Le Switch case n'a pas l'air de fonctionner ici.
        /*switch(statusCode) {
            case 1 || 2 || 3 || 4 :

                /!*getAllRows().forEach(row => {
                    if(row.data.id === archive.id) {
                        console.log(row);
                        //document.getElementById().style.property.display = 'none';
                    }
                })*!/

            case 11 || 12 || 13 || 14:
                return (
                    <Tooltip title= {<p style={{ fontSize: '1.4em' }}>Valider le versement au PAL</p>}>
                        <IconButton size={"small"} onClick={() => {validerArchivage(false)}}>
                            <MdInput color={"#43A047"} size={"1.4em"} />
                        </IconButton>
                    </Tooltip>
                )

            default:
                return (
                    <Tooltip title= {<p style={{ fontSize: '1.4em' }}>Valider la demande</p>}>
                        <IconButton size={"small"} onClick={() => {validerArchivage(true)}}>
                            <FcCheckmark size={"1.4em"} />
                        </IconButton>
                    </Tooltip>
                );
        }*/
    }

    return (
        <span style={{display: "flex", alignItems: "center"}}>
            {/*<TextField
                hiddenLabel
                id={archive.id}
                defaultValue=""
                placeholder="Localisation"
                style={{textAlign: "center"}}
                variant="filled"
                size="small"
                inputProps={{min: 0, style: { textAlign: 'center' }}}
                InputProps={{
                    endAdornment:
                    <InputAdornment position="end">
                        <IconButton size={"small"} onClick={() => {validerDemandeArchivage(false)}}>
                            <FcCheckmark size={"1.4em"} />
                        </IconButton>
                    </InputAdornment>,
                }}
            />*/}
            {/*<Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'center',
                    horizontal: 'right',
                }}
            >
                <Typography sx={{ p: 4 }}>Nouvel emplacement : <Input placeholder="emplacement" /></Typography>
            </Popover>*/}
            {renderSwitch()}
            <Tooltip title= {<p style={{ fontSize: '1.4em' }}>Générer l'étiquette</p>}>
                <IconButton size={"small"} onClick={() => generateLabel(false)}>
                    <LocalOffer size={"1.4em"} />
                </IconButton>
            </Tooltip>
            <Tooltip title= {<p style={{ fontSize: '1.4em' }}>Générer les étiquettes du lot</p>}>
                <IconButton size={"small"} onClick={() => generateLabel(true)}>
                    <Style size={"1.4em"} />
                </IconButton>
            </Tooltip>
            <Tooltip title= {<p style={{ fontSize: '1.4em' }}>Générer le bordereau du lot</p>}>
                <IconButton size={"small"} onClick={() => generateBordereau(true)}>
                    <GoFile size={"1.4em"} />
                </IconButton>
            </Tooltip>
            <Tooltip title= {<p style={{ fontSize: '1.4em' }}>Générer le bordereau du lot</p>}>
                <IconButton size={"small"}>
                    <GoFileSubmodule size={"1.4em"} />
                </IconButton>
            </Tooltip>
            {/*<Tooltip title= {<p style={{ fontSize: '1.4em' }}>Annuler ma dernière action</p>}>
                <IconButton size={"small"} >
                    <AiOutlineRollback size={"1.4em"} />
                </IconButton>
            </Tooltip>*/}
        </span>
    );
};

export default actionRendererArchiviste;

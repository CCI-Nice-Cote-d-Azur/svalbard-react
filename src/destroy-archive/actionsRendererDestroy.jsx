import React from 'react';
import { GoFlame, BiArchiveOut} from "react-icons/all";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import ArchiveService from '../_services/archive.service';
import GeneratePdfService from "../_services/generatepdf.service";


const actionsRendererDestroy =  (props) => {
    let destroyActionAllowed = false;
    let versementActionAllowed = true;

    let archive = props.data;
    let statusCode = props.data.statusCode;

    const versementDestruction = (versmentDestructionSelect) => {
        switch(versmentDestructionSelect) {
            case 3:
                archive.statusCode = 3;
                archive.status = 'Destruction demandée';
                break;
            case 4 :
                archive.statusCode = 4;
                archive.status = 'Remise à l\'AD demandée';
                break;
            case 5 :
                archive.statusCode = 5;
                archive.status = 'Remise au PAL demandée';
                break;
            case 6 :
                archive.statusCode = 6;
                archive.status = 'Remise à l\'AD validée par le service versant';
                break;
            case 13:
                archive.statusCode = 13;
                archive.status = 'En cours de destruction';
                break;
            case 14 :
                archive.statusCode = 14;
                archive.status = 'En cours de remise aux AD';
                break;
            default :
                break;
        }
        let isGroupGlobalObject = determineIfGroup();

        if (isGroupGlobalObject.isGroup) {
            ArchiveService.putArchiveMany(archive).then(() => callReRenderFromParent());
        } else {
            ArchiveService.putArchive(archive).then(() => { callReRenderFromParent(); props.api.redrawRows() });
        }
    }

    const callReRenderFromParent = () => {
        props.context.reRender();
    }

    const getAllRows = () => {
        let {rowsToDisplay} = props.api.getModel();
        return rowsToDisplay;
    }

    const determineIfGroup = () =>  {
        let rowsToDisplay = getAllRows();
        let linkedArchives = [];
        let linkedArchivesIndexes = [];

        rowsToDisplay.forEach((row, index) => {
            if(archive.group === row.data.group && archive.group !== null) {
                linkedArchives.push(row.data);
                linkedArchivesIndexes.push(index);
            }
        });
        return {
            isGroup: linkedArchives.length > 1,
            groupLength: linkedArchives.length,
            groupItems: linkedArchives,
            groupItemsIndexes: linkedArchivesIndexes
        }
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

    return (
        <span style={{display: "flex", alignItems: "center"}}>
            { versementActionAllowed ? (
            <Tooltip title= {<p style={{ fontSize: '1.4em' }}>Signaler pour <span style={{textDecoration: "underline"}}>versement</span> AD</p>}>
                <IconButton size={"small"} onClick={() => versementDestruction(4)}>
                    <BiArchiveOut color={"orange"} size={"1.4em"} />
                </IconButton>
            </Tooltip>
            ) : (
                <span></span>
            )}
            { destroyActionAllowed ? (
                <Tooltip title= {<p style={{ fontSize: '1.4em' }}>Signaler pour <span style={{textDecoration: "underline"}}>destruction</span> AD</p>}>
                    <IconButton size={"small"} onClick={() => versementDestruction(5)}>
                        <GoFlame color={"#CF352E"} size={"1.4em"} />
                    </IconButton>
                </Tooltip>
            ) : (
                <span></span>
            )}
        </span>
    );
};

export default actionsRendererDestroy;

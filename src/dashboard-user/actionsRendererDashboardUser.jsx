import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import {FcCancel, FiFileText} from "react-icons/all";
import {LocalOffer} from "@material-ui/icons";
import React from "react";

const actionsRendererDashboardUser =  (props) => {

    const callHandleOpen = (params, isPAL) => {
        props.context.handleOpen(params, isPAL);
    }

    const callHandleEtiquette = (params) => {
        props.context.handleEtiquette(params);
    }

    const callHandleBordereau = (params) => {
        props.context.handleBordereau(params);
    }

    const renderSwitch = () => {
        return (
            <span style={{display: "flex", alignItems: "center"}}>
                { props.data.statusCode === 2 &&
                <Tooltip title= {<p style={{ fontSize: '1.4em' }}>Annuler la demande</p>}>
                    <IconButton size={"small"} onClick={() => callHandleOpen(props, false)} >
                        <FcCancel size={"1.4em"} />
                    </IconButton>
                </Tooltip>
                }
                { props.data.statusCode === 22 &&
                <Tooltip title= {<p style={{ fontSize: '1.4em' }}>Demander le retour aux archives du PAL</p>}>
                    <IconButton size={"small"} onClick={() => callHandleOpen(props,true)} >
                        <FcCancel size={"1.4em"} />
                    </IconButton>
                </Tooltip>
                }
                { props.data.statusCode === 1 &&
                <Tooltip title={<p style={{fontSize: '1.4em'}}>Imprimer l'étiquette</p>}>
                    <IconButton size={"small"} onClick={() => callHandleEtiquette(props)}>
                        <LocalOffer size={"1.4em"}/>
                    </IconButton>
                </Tooltip>
                }
                { props.data.statusCode === 1 &&
                <Tooltip title={<p style={{fontSize: '1.4em'}}>Imprimer le bordereau</p>}>
                    <IconButton size={"small"} onClick={() => callHandleBordereau(props)}>
                        <FiFileText size={"1.4em"}/>
                    </IconButton>
                </Tooltip>
                }
            </span>
        )
    }

    return (
        <span style={{display: "flex", alignItems: "center"}}>
            {renderSwitch()}
        </span>
    );
};

export default actionsRendererDashboardUser;

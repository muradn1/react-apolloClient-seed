import React, { useState, useEffect } from 'react'
import { withRouter } from "react-router-dom";
import UserForm from '../user/UserForm';
import OtherForm from '../other/OtherForm';
import { openFormService, saveClickedService, deleteClickedService } from './formLoaderService';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import { RouterEnum } from '../../../enums/router-enum';
import IconButton from '@material-ui/core/IconButton';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import "./formLoader.scss"
import Draggable from 'react-draggable';
import PropTypes from 'prop-types';

FormLoader.propTypes = {
    history: PropTypes.shape({
        listen: PropTypes.func.isRequired
    }).isRequired
}

function FormLoader({ history }) {
    const UserFormToLoad = (id) => (<UserForm id={id} closeForm={closeForm} />);
    const OtherFormToLoad = (id) => (<OtherForm id={id} closeForm={closeForm} />);

    const [isOpen, setIsOpen] = useState(false);
    const [entityId, setEntityId] = useState(null);
    const [formToLoad, setFormToLoad] = useState(() => UserFormToLoad);
    const [anchorEl, setAnchorEl] = React.useState(null);


    useEffect(() => {
        let subscription = openFormService.openFormSub.subscribe(({ id }) => {
            setIsOpen(true);
            setEntityId(id);
        })
        return () => {
            subscription.unsubscribe();
        };
    }, [])

    const closeForm = () => {
        setAnchorEl(null);
        setIsOpen(false);
    }


    const onRouteChange = ({ pathname }) => {
        switch (pathname) {
            case RouterEnum.USERS: {
                setFormToLoad(() => UserFormToLoad);
                break;
            }
            case RouterEnum.OTHER: {
                setFormToLoad(() => OtherFormToLoad);
                break;
            }
            default:
                break;
        }
    }

    useEffect(() => {
        const unListen = history.listen(onRouteChange);
        return () => {
            unListen();
        };
    });

    if (!isOpen) {
        return null;
    }

    const moreClicked = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleMenuClose = () => {
        setAnchorEl(null);
    }

    const menuItemStyle = { width: "70px", direction: "rtl" };

    return (
        <Draggable handle="strong" >
            <div className="form-loader box no-cursor">

                <strong className="cursor">
                    <div className="header">
                        <div className="close-icon" onClick={closeForm}><img src="icons/clear_grey_27x27.png" alt="..." /></div>

                        <IconButton onClick={moreClicked} size="small" >
                            <MoreHorizIcon />
                        </IconButton>

                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                            <MenuItem style={menuItemStyle} onClick={() => deleteClickedService.deleteClicked()}>מחק</MenuItem>
                            <MenuItem style={menuItemStyle} onClick={closeForm}>סגור</MenuItem>
                        </Menu>
                    </div>
                </strong>

                <div className="my-form">
                    {formToLoad(entityId)}
                </div>

                <Button onClick={() => saveClickedService.saveClicked()} variant="contained" size="small" className="save-button">
                    <SaveIcon />
                    שמור
                </Button>
            </div>
        </Draggable>
    )
}

export default withRouter(FormLoader);

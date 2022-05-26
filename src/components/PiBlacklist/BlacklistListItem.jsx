import React, { useState, useEffect } from 'react';
import { checkInvalidChars, stripWhiteSpaces } from '../siteFilter';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

// import fontawesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faFloppyDisk, faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons';

function BlacklistListItem(props) {
    const {
        website,
        currBlacklist,
        setCurrBlacklist,
        setIsListModified
    } = props;

    const [isEdittingSite, setIsEdittingSite] = useState(false);
    const [tempWebsite, setTempWebsite] = useState('');
    const [isContainsInvalidChars, setIsContainsInvalidChars] = useState(false);
    const [isSiteDuplicate, setIsSiteDuplicate] = useState(false);
    const [isInvalidSite, setIsInvalidSite] = useState(false);

    useEffect(() => {
        if (currBlacklist.includes(tempWebsite) || tempWebsite.length === 0) {
            setIsSiteDuplicate(true);
            setIsInvalidSite(false);
        }
        else if (tempWebsite.indexOf(" ") >= 0) {
            setIsInvalidSite(true);
            setIsSiteDuplicate(false);
        }
        else {
            setIsInvalidSite(false);
            setIsSiteDuplicate(false);
        }

        // eslint-disable-next-line
    }, [tempWebsite]);

    const siteInputHandler = (e) => {
        if (checkInvalidChars(e.target.value)) {
            setIsContainsInvalidChars(true);
            return;
        }
        let tempSiteInput = stripWhiteSpaces(e.target.value);
        setIsContainsInvalidChars(false);
        setIsListModified(true);
        setTempWebsite(tempSiteInput);
    };

    const siteInputEnterKeyHandler = (e) => {
        if (e.key === 'Enter' || e.which === 13 || e.keyCode === 13) {
            setIsListModified(true);
            if (!isContainsInvalidChars && !isSiteDuplicate && !isInvalidSite){
                saveEditSite();
            }
        }
    };

    const editBlacklistItem = (e) => {
        e.preventDefault();
        setIsEdittingSite(true);
        setTempWebsite(website);
    };

    const saveEditSite = () => {
        setCurrBlacklist(
            currBlacklist.map(site => {
                if (site === website)
                    return tempWebsite;
                return site;
            }).sort()
        );
        setIsEdittingSite(false);
        setIsListModified(true);
    };

    const cancelEditSite = (e) => {
        e.preventDefault();
        setIsEdittingSite(false);
        setTempWebsite('');
    };

    const deleteBlacklistItem = (e) => {
        e.preventDefault();
        setCurrBlacklist(
            currBlacklist.filter((website) => {
                return website !== e.target.value;
            })
        );
        setTempWebsite('');
        setIsEdittingSite(false);
        setIsListModified(true);
    };

    return (
        <div
            className="websiteItem__container"
        >
            {isEdittingSite ?
                <div className="listItem__container">
                    <Form onSubmit={(e) => e.preventDefault()}>
                        <InputGroup>
                            <Form.Control
                                type="text"
                                placeholder="website"
                                className={`blacklist__input  ${isContainsInvalidChars || isSiteDuplicate || isInvalidSite ? 'invalid_input' : ""}`}
                                onChange={siteInputHandler}
                                value={tempWebsite}
                                onKeyDown={siteInputEnterKeyHandler}
                            />
                        </InputGroup>
                    </Form>
                    <Button
                        className="websiteItem__button websiteItem__button--delete"
                        onClick={saveEditSite}
                        variant="success"
                        value={website}
                        disabled={isSiteDuplicate || isInvalidSite}
                    >
                        <FontAwesomeIcon icon={faFloppyDisk} />
                    </Button>
                    <Button
                        className="websiteItem__button websiteItem__button--delete"
                        onClick={cancelEditSite}
                        variant="warning"
                        value={website}
                    >
                        <FontAwesomeIcon icon={faArrowRotateLeft} />
                    </Button>
                </div>
                :
                <div className="listItem__container">
                    <Button
                        className="websiteItem__button websiteItem__button--edit"
                        onClick={editBlacklistItem}
                    >
                        {website}
                    </Button>
                    <Button
                        className="websiteItem__button websiteItem__button--delete"
                        onClick={deleteBlacklistItem}
                        variant="danger"
                        value={website}
                    >
                        <FontAwesomeIcon icon={faX} />
                    </Button>
                </div>
            }
        </div>
    );
}

export default BlacklistListItem;
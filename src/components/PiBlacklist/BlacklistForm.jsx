import React, { useEffect, useState } from 'react';

import { checkInvalidChars, stripWhiteSpaces } from '../siteFilter';

import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

function BlacklistForm(props) {
    const {
        currBlacklist,
        setCurrBlacklist,
        isSiteDuplicate,
        setIsSiteDuplicate,
        isInvalidSite,
        setIsInvalidSite
    } = props;

    const [siteInput, setSiteInput] = useState('');
    const [isContainsInvalidChars, setIsContainsInvalidChars] = useState(false);

    useEffect(() => {
        if (siteInput.charAt(siteInput.length - 1) === ' ' || siteInput.charAt(siteInput.length - 1) === ',') {
            let tempSiteInput = stripWhiteSpaces(siteInput);
            if (tempSiteInput.length !== 0) {
                if (currBlacklist.includes(tempSiteInput)) {
                    setIsSiteDuplicate(true);
                    setIsInvalidSite(false);
                }
                else if (tempSiteInput.indexOf(" ") >= 0) {
                    setIsInvalidSite(true);
                    setIsSiteDuplicate(false);
                }
                else {
                    setCurrBlacklist([...currBlacklist, tempSiteInput].sort());
                    setSiteInput('');
                    setIsSiteDuplicate(false);
                    setIsInvalidSite(false);
                }
            }
        }
        // eslint-disable-next-line
    }, [siteInput]);

    const siteInputHandler = (e) => {
        if (checkInvalidChars(e.target.value)) {
            setIsContainsInvalidChars(true);
            return;
        }
        setIsContainsInvalidChars(false);
        setSiteInput(e.target.value);
    };

    const siteInputEnterKeyHandler = (e) => {
        if (e.key === 'Enter') {
            setSiteInput(e.target.value + " ");
        }
    };

    return (
        <Form onSubmit={(e) => e.preventDefault()}>
            <InputGroup>
                <InputGroup.Text id="inputGroupPrepend">https://</InputGroup.Text>
                <Form.Control
                    type="text"
                    placeholder="website"
                    className="blacklist__input"
                    onChange={siteInputHandler}
                    value={siteInput}
                    onKeyDown={siteInputEnterKeyHandler}
                />
            </InputGroup>
            {isSiteDuplicate &&
                <Form.Text className="form-text-muted">
                    Duplicate site entry
                </Form.Text>
            }
            {isInvalidSite &&
                <Form.Text className="form-text-muted">
                    invalid site
                </Form.Text>
            }
            {isContainsInvalidChars &&
                <Form.Text className="form-text-muted">
                    {` invalid character`}
                </Form.Text>
            }
        </Form>
    );
}

export default BlacklistForm;
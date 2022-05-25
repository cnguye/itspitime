import React, { useState } from 'react';
import BlacklistList from './BlacklistList';
import BlacklistForm from './BlacklistForm';


import Card from 'react-bootstrap/Card';

function PiBlacklist(props) {
    const {
        currBlacklist,
        setCurrBlacklist,
        setIsListModified
    } = props;
    const [isSiteDuplicate, setIsSiteDuplicate] = useState(false);
    const [isInvalidSite, setIsInvalidSite] = useState(false);

    return (
        <Card className="pi__section">
            <Card.Header className="pi__section--title">Blacklist</Card.Header>
            <Card.Body>
                <BlacklistList
                    currBlacklist={currBlacklist}
                    setCurrBlacklist={setCurrBlacklist}
                    setIsListModified={setIsListModified}
                />
                <BlacklistForm
                    currBlacklist={currBlacklist}
                    setCurrBlacklist={setCurrBlacklist}
                    isSiteDuplicate={isSiteDuplicate}
                    setIsSiteDuplicate={setIsSiteDuplicate}
                    isInvalidSite={isInvalidSite}
                    setIsInvalidSite={setIsInvalidSite}
                    setIsListModified={setIsListModified}
                />
            </Card.Body>
        </Card>
    );
}

export default PiBlacklist;
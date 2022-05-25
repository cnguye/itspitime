import React, { useState, useEffect} from 'react';
import BlacklistList from './BlacklistList';
import BlacklistForm from './BlacklistForm';


import Card from 'react-bootstrap/Card';

function PiBlacklist(props) {
    const {
        dbBlacklist,
        currBlacklist,
        setCurrBlacklist,
        setIsListModified
    } = props;
    const [isSiteDuplicate, setIsSiteDuplicate] = useState(false);
    const [isInvalidSite, setIsInvalidSite] = useState(false);

    useEffect( () => {
        setIsListModified(true);
        // eslint-disable-next-line
    }, [currBlacklist])

    return (
        <Card className="pi__section">
            <Card.Header className="pi__section--title">Blacklist</Card.Header>
            <Card.Body>
                <BlacklistList
                    currBlacklist={currBlacklist}
                    setCurrBlacklist={setCurrBlacklist}
                />
                <BlacklistForm
                    currBlacklist={currBlacklist}
                    setCurrBlacklist={setCurrBlacklist}
                    isSiteDuplicate={isSiteDuplicate}
                    setIsSiteDuplicate={setIsSiteDuplicate}
                    isInvalidSite={isInvalidSite}
                    setIsInvalidSite={setIsInvalidSite}
                />
            </Card.Body>
        </Card>
    );
}

export default PiBlacklist;
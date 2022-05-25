import React from 'react';
import BlacklistListItem from './BlacklistListItem';

function BlacklistList(props) {
    const {
        currBlacklist,
        setCurrBlacklist
    } = props;

    return (
        <div className="blacklist__list">
            {currBlacklist.map((website, index) => {
                return <BlacklistListItem
                    key={`${website}--${index}`}
                    website={website}
                    currBlacklist={currBlacklist}
                    setCurrBlacklist={setCurrBlacklist}
                />;
            })}
        </div>
    );
}

export default BlacklistList;
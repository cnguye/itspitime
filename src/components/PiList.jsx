import React, { useState } from 'react';
import ListItem from './ListItem';

import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';


function PiList(props) {
    const {
        currUserSettings,
        setCurrUserSettings,
        setIsListModified
    } = props;

    const [watchListRefreshTimeLeft, setWatchListRefreshTimeLeft] = useState(0);

    const rescrapeWatchList = (e) => {
        e.preventDefault();
        // can only refresh every 15 seconds
        let seconds = 15;
        setWatchListRefreshTimeLeft(seconds);
        let timer = setInterval(() => {
            seconds--;
            setWatchListRefreshTimeLeft(seconds);
            if (seconds === 0) {
                clearInterval(timer);
            }
        }, 1000);
    };

    return (
        <div className="piList__body">
            <div className="piList__header">
                <div className="piList__header--title">
                    Watch list
                </div>
                <Button onClick={rescrapeWatchList}
                    className="piList__header--refresh__btn"
                    variant="warning"
                    disabled={watchListRefreshTimeLeft !== 0}
                >
                    Re-Scrape {watchListRefreshTimeLeft !== 0 ? `(${watchListRefreshTimeLeft}s)` : ''}
                </Button>
            </div>
            <Table className="piList__table" striped bordered hover>
                <thead className="pi__table--head">
                    <tr>
                        <th>Sku</th>
                        <th>Model</th>
                        <th>Currency</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currUserSettings.map(piRow => {
                        return (
                            <ListItem
                                key={`${piRow.sku}-${piRow.currencies}`}
                                sku={piRow.sku}
                                model={piRow.model}
                                currencies={piRow.currencies}
                                setCurrUserSettings={setCurrUserSettings}
                                currUserSettings={currUserSettings}
                                setIsListModified={setIsListModified}
                            />
                        );
                    })}
                </tbody>
            </Table>
        </div>
    );
}

export default PiList;
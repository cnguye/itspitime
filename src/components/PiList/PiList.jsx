import React, { useState } from 'react';
import ListItem from './ListItem';

import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

// font awesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotate } from '@fortawesome/free-solid-svg-icons';


function PiList(props) {
    const {
        currUserSettings,
        setCurrUserSettings,
        currenciesList,
        setIsListModified,
        formModelSelectedHandler,
        formCurrencySelectedHandler,
        userWatchlist,
        setUserWatchList
    } = props;
    const [watchListRefreshTimeLeft, setWatchListRefreshTimeLeft] = useState(0);
    const [edittingRowIndex, setEdittingRowIndex] = useState();

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
        <div className="pi__section pi__section--card piList__body">
            <div className="piList__header">
                <div className="piList__header--title">
                    Watch list
                </div>
                <Button onClick={rescrapeWatchList}
                    className="piList__header--refresh__btn"
                    variant="warning"
                    disabled={watchListRefreshTimeLeft !== 0}
                >
                    <span className="re-scrape__icon">
                        <FontAwesomeIcon icon={faRotate}></FontAwesomeIcon>
                        <span className="re-scrape__icon--text">{watchListRefreshTimeLeft !== 0 ? ` (${watchListRefreshTimeLeft}s)` : ''}</span>
                    </span>
                    <span className="re-scrape__text">
                        Re-Scrape {watchListRefreshTimeLeft !== 0 ? `(${watchListRefreshTimeLeft}s)` : ''}
                    </span>
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
                    {currUserSettings.watchlist.map( (piRow, piRowKey) => {
                        return (
                            <ListItem
                                key={`${piRow.sku}-${piRow.currencies}`}
                                piRowKey={piRowKey}
                                sku={piRow.sku}
                                model={piRow.model}
                                currencies={piRow.currencies}
                                edittingRowIndex={edittingRowIndex}
                                setEdittingRowIndex={setEdittingRowIndex}

                                currUserSettings={currUserSettings}
                                setCurrUserSettings={setCurrUserSettings}
                                currenciesList={currenciesList}
                                setIsListModified={setIsListModified}
                                formModelSelectedHandler={formModelSelectedHandler}
                                formCurrencySelectedHandler={formCurrencySelectedHandler}
                                userWatchlist={userWatchlist}
                                setUserWatchList={setUserWatchList}
                            />
                        );
                    })}
                </tbody>
            </Table>
        </div>
    );
}

export default PiList;
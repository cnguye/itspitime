import React from 'react'
import ListItem from './ListItem'

import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'


function PiList(props) {
    const {
        currUserSettings,
        setCurrUserSettings,
        watchListRefreshTimeLeft,
        refreshWatchList,
        setIsListModified
    } = props;


    return (
        <div className="piList__body">
            <div className="piList__header">
                <div className="piList__header--title">
                    Watch list
                </div>
                <Button onClick={refreshWatchList}
                    className="piList__header--refresh__btn"
                    variant="warning"
                    disabled={watchListRefreshTimeLeft !== 0}
                >
                    Re-Scrape {watchListRefreshTimeLeft !== 0 ? `(${watchListRefreshTimeLeft}s)` : ''}
                </Button>
            </div>
            <Table className="piList__table" striped bordered hover>
                <thead>
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
                                key={`${piRow.sku}-${piRow.currency}`}
                                sku={piRow.sku}
                                model={piRow.model}
                                currency={piRow.currency}
                                setCurrUserSettings={setCurrUserSettings}
                                currUserSettings={currUserSettings}
                                setIsListModified={setIsListModified}
                            />
                        )
                    })}
                </tbody>
            </Table>
        </div>
    )
}

export default PiList
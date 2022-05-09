import React from 'react'

import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faX } from '@fortawesome/free-solid-svg-icons';

function PiList(props) {
    const {
        currUserSettings,
        watchListRefreshTimeLeft,
        refreshWatchList
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
                            <tr className="piRow" key={`${piRow.sku}-${piRow.currency}`}>
                                <td className="table-data">{piRow.sku}</td>
                                <td className="table-data">{piRow.model}</td>
                                <td className="table-data">{piRow.currency}</td>
                                <td className="table-data table-data--actions">
                                    <ButtonGroup className="table-data__button-group">
                                        <Button className="table-data__button"><FontAwesomeIcon icon={faPenToSquare} /></Button>
                                        <Button className="table-data__button"><FontAwesomeIcon icon={faX} /></Button>
                                    </ButtonGroup>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </div>
    )
}

export default PiList
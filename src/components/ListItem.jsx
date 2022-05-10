import React from 'react'

import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faX } from '@fortawesome/free-solid-svg-icons';

function ListItem(props) {
    const {
        sku,
        model,
        currency,
        setCurrUserSettings,
        currUserSettings,
        setIsListModified
    } = props;

    const removePiHandler = () => {
        setCurrUserSettings(
            currUserSettings.filter((row) => {
                return !(row.sku === sku && row.currency === currency)
            })
        );
        setIsListModified(true);
    }

    return (
        <tr className="piRow" >
            <td className="table-data">{sku}</td>
            <td className="table-data">{model}</td>
            <td className="table-data">{currency}</td>
            <td className="table-data table-data--actions">
                <ButtonGroup className="table-data__button-group">
                    <Button className="table-data__button" variant="primary"><FontAwesomeIcon icon={faPenToSquare} /></Button>
                    <Button onClick={removePiHandler} className="table-data__button" variant="danger"><FontAwesomeIcon icon={faX} /></Button>
                </ButtonGroup>
            </td>
        </tr>
    )
}

export default ListItem
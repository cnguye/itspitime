import React from 'react';

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function WatchListRowButtonGroup(props) {
    const {
        btnVariantOne,
        btnVariantTwo,
        btnOnClickOne,
        btnOnClickTwo,
        btnIconOne,
        btnIconTwo,
    } = props;
    return (
        <ButtonGroup className="table-data__button-group">
            <Button onClick={() => btnOnClickOne()} className="table-data__button" variant={btnVariantOne}>
                <FontAwesomeIcon className="fontAwesomeIcon" icon={btnIconOne} />
            </Button>
            <Button onClick={() => btnOnClickTwo()} className="table-data__button" variant={btnVariantTwo}>
                <FontAwesomeIcon className="fontAwesomeIcon" icon={btnIconTwo} />
            </Button>
        </ButtonGroup>
    );
}

export default WatchListRowButtonGroup;
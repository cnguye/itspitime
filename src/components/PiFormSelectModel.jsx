import React from 'react';

// Bootstrap components
import Form from 'react-bootstrap/Form';

function PiFormSelectModel(props) {
    const { 
        formModelSelected,
        formModelSelectedHandler,
        userWatchList
    } = props;

    return (
        <Form.Select onChange={formModelSelectedHandler} value={formModelSelected} className="form__select" aria-label="pi model list">
            {userWatchList.map(model => {
                return (<option key={`${model.id}-${model.sku}`} id={`form__option--${model.sku}`} disabled={model.disabled}>{model.model}</option>);
            })}
        </Form.Select>
    );
}

export default PiFormSelectModel;
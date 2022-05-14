import React from 'react';

// Bootstrap components
import Form from 'react-bootstrap/Form';

function PiFormSelectModel(props) {
    const { 
        formModelSelectedHandler,
        userWatchList
    } = props;
    return (
        <Form.Select onChange={formModelSelectedHandler} className="form__select" aria-label="pi model list">
            {userWatchList.map(model => {
                return (<option key={model.id} id={`form__option--${model.sku}`} disabled={model.disabled}>{model.model}</option>);
            })}
        </Form.Select>
    );
}

export default PiFormSelectModel;
import React from 'react';

// Bootstrap components
import Form from 'react-bootstrap/Form';

function PiFormEditModel(props) {
    const {
        userWatchList,
        editModelSelected,
        setEditModelSelected
    } = props;
    return (
        <Form.Select onChange={(e) => setEditModelSelected(e.target.value)} value={editModelSelected} className="form__select" aria-label="pi model list">
            {userWatchList.map(model => {
                return (<option key={model.id} disabled={model.disabled}>{model.model}</option>);
            })}
        </Form.Select>
    );
}

export default PiFormEditModel;
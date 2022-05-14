import React from 'react';

// Bootstrap components
import Form from 'react-bootstrap/Form';

function PiFormEditModel(props) {
    const {
        userWatchList,
        editModelSelected,
        setEdiSkuSelected,
        setEditModelSelected
    } = props;

    const skuAndModelHandler = (e) => {
        const index = e.target.selectedIndex;
        const el = e.target.childNodes[index]
        const option =  el.getAttribute('id').split('edit-form__option--')[1]; 
        setEditModelSelected(e.target.value);
        setEdiSkuSelected(option);
    }

    return (
        <Form.Select onChange={skuAndModelHandler} value={editModelSelected} className="form__select" aria-label="pi model list">
            {userWatchList.map(model => {
                return (
                    <option
                        key={model.id}
                        id={`edit-form__option--${model.sku}`}
                        disabled={model.disabled}
                    >
                        {model.model}
                    </option>);
            })}
        </Form.Select>
    );
}

export default PiFormEditModel;
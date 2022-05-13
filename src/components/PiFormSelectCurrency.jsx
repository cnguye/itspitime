import React from 'react';

// Bootstrap components
import Form from 'react-bootstrap/Form';

function PiFormSelectCurrency(props) {
    const {
        formCurrencySelectedHandler,
        currenciesList
    } = props;
    return (
        <Form.Select onChange={formCurrencySelectedHandler} className="form__select" aria-label="Default select example">
            {currenciesList.map(currency => {
                return (<option key={`currency_${currency.id}`} disabled={currency.disabled}>{currency.currency}</option>);
            })}
        </Form.Select>
    );
}

export default PiFormSelectCurrency;
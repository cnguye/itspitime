import React from 'react';

// Bootstrap components
import Form from 'react-bootstrap/Form';

function PiFormEditCurrency(props) {
    const {
        currencies,
        currenciesList,
        editCurrenciesSelected,
        setEditCurrenciesSelected
    } = props;

    const editAddSelectedCurrency = (e, currencyKey) => {
        if (!editCurrenciesSelected.includes(e.target.value) || e.target.value === 'none') {
            setEditCurrenciesSelected(
                editCurrenciesSelected.map((editCurrency, editCurrencyKey) => {
                    if (editCurrencyKey === currencyKey)
                        return e.target.value;
                    return editCurrency;
                })
            );
        }
    };

    return (
        <span>
            {
                currencies.map((userCurrency, currencyKey) => {
                    return (
                        <Form.Select
                            key={`userCurrency_${userCurrency}`}
                            onChange={(e) => editAddSelectedCurrency(e, currencyKey)}
                            value={editCurrenciesSelected[currencyKey]}
                            className="form__select"
                            aria-label="Default select example">
                            {
                                currenciesList.map(currency => {
                                    return (
                                        <option
                                            className="form__option"
                                            key={`currency_${currency.id}`}
                                            disabled={editCurrenciesSelected.includes(currency.currency)}
                                        >
                                            {currency.currency}
                                        </option>
                                    );
                                })
                            }
                            <option
                                className="form__option"
                                key={`currency_none`}
                            >
                                none
                            </option>
                        </Form.Select>
                    );
                })
            }
        </span>
    );
}

export default PiFormEditCurrency;
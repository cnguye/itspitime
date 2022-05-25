import React from 'react';

// form components
import PiFormSelectModel from './PiFormSelectModel';
import PiFormSelectCurrency from './PiFormSelectCurrency';

// Bootstrap components
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function PiForm(props) {

    const {
        addPiToWatchlist,
        userWatchlist,
        currenciesList,
        formModelSelected,
        formModelSelectedHandler,
        formCurrencySelected,
        formCurrencySelectedHandler
    } = props;

    return (
        <Card className="pi__section form__body">
            <Card.Header className="pi__section--title form__title">Add a pi!</Card.Header>
            <Card.Body>
                <Form className="pi__form">
                    <Form.Group className="form__group" controlId="formAddPi">
                        <div className="form__section form__section--model">
                            <Form.Label className="form__label">Model</Form.Label>
                            <PiFormSelectModel
                                formModelSelected={formModelSelected}
                                formModelSelectedHandler={formModelSelectedHandler}
                                userWatchlist={userWatchlist}>
                            </PiFormSelectModel>
                        </div>
                        <div className="form__section form__section--currency">
                            <Form.Label className="form__label">Currency</Form.Label>
                            <PiFormSelectCurrency
                                formCurrencySelectedHandler={formCurrencySelectedHandler}
                                currenciesList={currenciesList}
                                formCurrencySelected={formCurrencySelected}
                            >
                            </PiFormSelectCurrency>
                        </div>
                    </Form.Group>
                    <Button
                        onClick={addPiToWatchlist}
                        className="pi__form--button"
                        variant="primary"
                        type="submit"
                        disabled={!(userWatchlist.filter(model => {
                            return model.disabled !== true;
                        }).length > 0)}
                    >
                        Add
                    </Button>
                </Form>
            </Card.Body>
        </Card>

    );
}

export default PiForm;
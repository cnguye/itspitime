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
        addPiToWatchList,
        userWatchList,
        currenciesList,
        formModelSelected,
        formModelSelectedHandler,
        formCurrencySelectedHandler
    } = props;


    return (
        <Card className="form__body">
            <Card.Header className="form__title">Add a pi!</Card.Header>
            <Card.Body>
                <Form className="pi__form">
                    <Form.Group className="form__group" controlId="formAddPi">
                        <div className="form__section form__section--model">
                            <Form.Label className="form__label">Model</Form.Label>
                            <PiFormSelectModel
                                formModelSelected={formModelSelected}
                                formModelSelectedHandler={formModelSelectedHandler}
                                userWatchList={userWatchList}>
                            </PiFormSelectModel>
                        </div>
                        <div className="form__section form__section--currency">
                            <Form.Label className="form__label">Currency</Form.Label>
                            <PiFormSelectCurrency
                                formCurrencySelectedHandler={formCurrencySelectedHandler}
                                currenciesList={currenciesList}>
                            </PiFormSelectCurrency>
                        </div>
                    </Form.Group>
                    <Button onClick={addPiToWatchList} className="pi__form--button" variant="primary" type="submit">
                        Add
                    </Button>
                </Form>
            </Card.Body>
        </Card>

    );
}

export default PiForm;
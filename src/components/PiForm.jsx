import React from 'react'

// Bootstrap components
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

function PiForm(props) {

    const {setFormCurrencySelected} = props;

    const addPiToWatchList = (e) => {
        e.preventDefault();
    }

    return (
        <div className="form__body">
            <div className="form__title">Add a pi!</div>
            <Form className="pi__form">
                <Form.Group className="form__group" controlId="formBasicEmail">
                    <div className="form__section form__section--model">
                        <Form.Label className="form__label">Model</Form.Label>
                        <Form.Select className="form__select" aria-label="Default select example">
                            <option>Open this select menu</option>
                            <option value="1">One</option>
                            <option value="2">Two</option>
                            <option value="3">Three</option>
                        </Form.Select>
                    </div>
                    <div className="form__section form__section--currency">
                        <Form.Label className="form__label">Currency</Form.Label>
                        <Form.Select onChange={(e) => setFormCurrencySelected(e.target.value)} className="form__select" aria-label="Default select example">
                            <option>All</option>
                            <option value="1">One</option>
                            <option value="2">Two</option>
                            <option value="3">Three</option>
                        </Form.Select>
                    </div>
                </Form.Group>
                <Button onClick={addPiToWatchList}className="pi__form--button" variant="success" type="submit">
                    Add
                </Button>
            </Form>
        </div>

    )
}

export default PiForm
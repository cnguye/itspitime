import React from 'react'

// Bootstrap components
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'

function PiForm(props) {

    const {
        setFormSkuSelected,
        setFormModelSelected,
        setFormCurrencySelected,
        addPiToWatchList,
        modelsList,
        currenciesList,
        formSkuSelected
    } = props;

    const formModelSelectedHandler = (e) => {
        setFormSkuSelected(e.target.value);
        setFormModelSelected(e.target.selectedOptions[0].text)
    }

    return (
        <Card className="form__body">
            <Card.Header className="form__title">Add a pi!</Card.Header>
            <Card.Body>
                <Form className="pi__form">
                    <Form.Group className="form__group" controlId="formBasicEmail">
                        <div className="form__section form__section--model">
                            <Form.Label className="form__label">Model</Form.Label>
                            <Form.Select onChange={formModelSelectedHandler} value={formSkuSelected} className="form__select" aria-label="pi model list">
                                {modelsList.map(model => {
                                    return (<option value={model.sku} key={model.id} disabled={model.disabled}>{model.model}</option>)
                                })}
                            </Form.Select>
                        </div>
                        <div className="form__section form__section--currency">
                            <Form.Label className="form__label">Currency</Form.Label>
                            <Form.Select onChange={(e) => setFormCurrencySelected(e.target.selectedOptions[0].text)} className="form__select" aria-label="Default select example">
                                <option value="currency_ALL" key="currency_ALL">ALL</option>
                                {currenciesList.map(currency => {
                                    return (<option value={`currency_${currency.currency}`} key={`currency_${currency.id}`}>{currency.currency}</option>)
                                })}
                            </Form.Select>
                        </div>
                    </Form.Group>
                    <Button onClick={addPiToWatchList} className="pi__form--button" variant="primary" type="submit">
                        Add
                    </Button>
                </Form>
            </Card.Body>
        </Card>

    )
}

export default PiForm
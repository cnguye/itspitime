import React, { useState } from 'react';

// import components
import WatchListRowButtonGroup from './WatchListRowButtonGroup';
import PiFormEditModel from './PiFormEditModel';
import PiFormEditCurrency from './PiFormEditCurrency';

// import fontawesome icons
import { faPenToSquare, faX, faFloppyDisk, faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons';

function ListItem(props) {
    const {
        piRowKey,
        sku,
        model,
        currencies,
        setCurrUserSettings,
        currUserSettings,
        setIsListModified,
        userWatchList,
        currenciesList,
        edittingRowIndex,
        setEdittingRowIndex,
    } = props;

    const [isEditting, setIsEditting] = useState(false);
    const [editModelSelected, setEditModelSelected] = useState("");
    const [editCurrenciesSelected, setEditCurrenciesSelected] = useState([]);

    const removePiHandler = () => {
        setCurrUserSettings(
            currUserSettings.filter((row) => {
                return !(row.sku === sku && row.currencies === currencies);
            })
        );
        setIsListModified(true);
    };

    const editRowHandler = () => {
        setIsEditting(true);
        setEdittingRowIndex(piRowKey);
        setEditModelSelected(currUserSettings[piRowKey].model);
        setEditCurrenciesSelected(currUserSettings[piRowKey].currencies);
    };

    const saveEditRowHandler = (e) => {
        setIsEditting(false);
        setCurrUserSettings(currUserSettings.map((piRowSetting, piRowSettingKey) => {
            if (piRowSettingKey === piRowKey) {
                if(piRowSetting.model !== editModelSelected || piRowSetting.currencies !== editCurrenciesSelected){
                    setIsListModified(true);
                    return { ...piRowSetting, model: editModelSelected, currencies: editCurrenciesSelected };
                }
            }
            return piRowSetting;
        }));
    };

    const cancelEditRowHandler = (e) => {
        setIsEditting(false);
    };

    return (
        <tr className="pi__table--row" >
            <td className="table-data">{sku}</td>
            <td className="table-data">
                {
                    isEditting && edittingRowIndex === piRowKey ?
                        <PiFormEditModel
                            userWatchList={userWatchList}
                            editModelSelected={editModelSelected}
                            setEditModelSelected={setEditModelSelected}
                        />
                        : model
                }
            </td>
            <td className="table-data table-data--currencies">
                {
                    isEditting && edittingRowIndex === piRowKey ?
                        <PiFormEditCurrency
                            currencies={currencies}
                            currenciesList={currenciesList}
                            editCurrenciesSelected={editCurrenciesSelected}
                            setEditCurrenciesSelected={setEditCurrenciesSelected}
                        />
                        : currencies.join(", ")
                }
            </td>
            <td className="table-data table-data--actions">
                {isEditting && edittingRowIndex === piRowKey ?
                    <WatchListRowButtonGroup
                        btnVariantOne="success"
                        btnVariantTwo="warning"
                        btnOnClickOne={saveEditRowHandler}
                        btnOnClickTwo={cancelEditRowHandler}
                        btnIconOne={faFloppyDisk}
                        btnIconTwo={faArrowRotateLeft}
                    ></WatchListRowButtonGroup>
                    :
                    <WatchListRowButtonGroup
                        btnVariantOne="primary"
                        btnVariantTwo="danger"
                        btnOnClickOne={editRowHandler}
                        btnOnClickTwo={removePiHandler}
                        btnIconOne={faPenToSquare}
                        btnIconTwo={faX}
                    ></WatchListRowButtonGroup>
                }
            </td>
        </tr>
    );
}

export default ListItem;
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
        userWatchlist,
        currenciesList,
        edittingRowIndex,
        setEdittingRowIndex,
    } = props;

    const [isEditting, setIsEditting] = useState(false);
    const [editSkuSelected, setEdiSkuSelected] = useState("");
    const [editModelSelected, setEditModelSelected] = useState("");
    const [editCurrenciesSelected, setEditCurrenciesSelected] = useState([]);

    const removePiHandler = () => {
        setCurrUserSettings(
            {
                blacklist: currUserSettings.blacklist,
                watchlist: currUserSettings.watchlist.filter((row) => {
                    return !(row.sku === sku && row.currencies === currencies);
                })
            }
        );
        setIsListModified(true);
    };

    const editRowHandler = () => {
        setIsEditting(true);
        setEdittingRowIndex(piRowKey);
        setEdiSkuSelected(sku);
        setEditModelSelected(currUserSettings.watchlist[piRowKey].model);
        setEditCurrenciesSelected(currUserSettings.watchlist[piRowKey].currencies);
    };

    const saveEditRowHandler = (e) => {
        setIsEditting(false);
        let filteredEditCurrenciesSelected = editCurrenciesSelected.filter(currency => {
            return currency !== 'REMOVE';
        });
        // check if empty (delete the model from watch list if empty)
        if(filteredEditCurrenciesSelected.length === 0){
            setCurrUserSettings(
                {
                    blacklist: currUserSettings.blacklist,
                    watchlist: currUserSettings.watchlist.filter((piRowSetting, piRowSettingKey) => {
                        setIsListModified(true);
                        return piRowSettingKey !== piRowKey;
                    })
                }
            );
        }
        else {
            setCurrUserSettings(
                {
                    blacklist: currUserSettings.blacklist,
                    watchlist: currUserSettings.watchlist.map((piRowSetting, piRowSettingKey) => {
                        if (piRowSettingKey === piRowKey) {
                            // check if row has been edited.  Save if true
                            if (piRowSetting.model !== editModelSelected || piRowSetting.currencies !== editCurrenciesSelected) {
                                setIsListModified(true);
                                if (editCurrenciesSelected.includes("ALL"))
                                    return { ...piRowSetting, sku: editSkuSelected, model: editModelSelected, currencies: ["ALL"] };
                                else
                                    return { ...piRowSetting, sku: editSkuSelected, model: editModelSelected, currencies: filteredEditCurrenciesSelected };
                            }
                        }
                        return piRowSetting;
                    })
                }
            );
        }
    };

    const cancelEditRowHandler = (e) => {
        setIsEditting(false);
        setEdiSkuSelected("");
    };

    return (
        <tr className="pi__table--row" >
            <td className="table-data">{editSkuSelected === "" ? sku : editSkuSelected}</td>
            <td className="table-data">
                {
                    isEditting && edittingRowIndex === piRowKey ?
                        <PiFormEditModel
                            userWatchlist={userWatchlist}
                            editModelSelected={editModelSelected}
                            setEdiSkuSelected={setEdiSkuSelected}
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
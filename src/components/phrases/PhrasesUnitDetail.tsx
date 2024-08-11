import * as React from 'react';
import { PhrasesUnitService } from '../../view-models/wpp/phrases-unit.service';
import { Button } from 'primereact/button';
import '../misc/Common.css'
import { InputText } from 'primereact/inputtext';
import 'reflect-metadata';
import { container } from "tsyringe";
import { SettingsService } from '../../view-models/misc/settings.service';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from "primereact/dialog";
import { useReducer } from "react";
import { MUnitPhrase } from "../../models/wpp/unit-phrase";

export default function PhrasesUnitDetail(
  {id, isDialogOpened, handleCloseDialog}: {id: number, isDialogOpened: boolean, handleCloseDialog: () => void}
) {
  const phrasesUnitService = container.resolve(PhrasesUnitService);
  const settingsService = container.resolve(SettingsService);
  const itemOld = phrasesUnitService.unitPhrases.find(value => value.ID === id);
  const item = itemOld ? Object.create(itemOld) as MUnitPhrase : phrasesUnitService.newUnitPhrase();
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const onChangeInput = (e: any) => {
    const elem = e.nativeEvent.target as HTMLInputElement;
    item[elem.id] = elem.value;
    forceUpdate();
  };

  const onChangeDropDown = (e: any) => {
    item[e.target.id] = e.value;
    forceUpdate();
  };

  const save = async () => {
    item.PHRASE = settingsService.autoCorrectInput(item.PHRASE);
    await (item.ID ? phrasesUnitService.update(item) : phrasesUnitService.create(item));
    handleCloseDialog();
  };

  return !item ? <div/> : (
    <Dialog visible={isDialogOpened} style={{width: '750px'}} onHide={handleCloseDialog}>
      <div className="p-grid mt-2 mb-2">
        <label className="col-4" htmlFor="ID">ID:</label>
        <InputText className="col-8" id="ID" value={item.ID.toString()} disabled />
      </div>
      <div className="p-grid mb-2">
        <label className="col-4" htmlFor="UNIT">UNIT:</label>
        <Dropdown className="col-8" id="UNIT" options={settingsService.units} value={item.UNIT} onChange={onChangeDropDown} />
      </div>
      <div className="p-grid mb-2">
        <label className="col-4" htmlFor="PART">PART:</label>
        <Dropdown className="col-8" id="PART" options={settingsService.parts} value={item.PART} onChange={onChangeDropDown} />
      </div>
      <div className="p-grid mb-2">
        <label className="col-4" htmlFor="SEQNUM">SEQNUM:</label>
        <InputText className="col-8" id="SEQNUM" value={item.SEQNUM.toString()} onChange={onChangeInput} />
      </div>
      <div className="p-grid mb-2">
        <label className="col-4" htmlFor="PHRASEID">PHRASEID:</label>
        <InputText className="col-8" id="PHRASEID" value={item.PHRASEID.toString()} disabled />
      </div>
      <div className="p-grid mb-2">
        <label className="col-4" htmlFor="PHRASE">PHRASE:</label>
        <InputText className="col-8" id="PHRASE" value={item.PHRASE} onChange={onChangeInput} />
      </div>
      <div className="p-grid mb-2">
        <label className="col-4" htmlFor="TRANSLATION">TRANSLATION:</label>
        <InputText className="col-8" id="TRANSLATION" value={item.TRANSLATION} onChange={onChangeInput} />
      </div>
      <div className="mt-4 flex justify-content-around flex-wrap">
        <Button className="border-round" label="Cancel" onClick={handleCloseDialog} />
        <Button className="border-round" label="Save" onClick={save} />
      </div>
    </Dialog>
  );
}

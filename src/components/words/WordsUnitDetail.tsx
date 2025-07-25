import * as React from 'react';
import { WordsUnitService } from '../../shared/view-models/wpp/words-unit.service';
import { Button } from 'primereact/button';
import '../misc/Common.css'
import { InputText } from 'primereact/inputtext';
import { container } from "tsyringe";
import { SettingsService } from '../../shared/view-models/misc/settings.service';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { ChangeEvent, useReducer, useState } from "react";
import { Dialog } from "primereact/dialog";
import { MUnitWord } from "../../shared/models/wpp/unit-word";

export default function WordsUnitDetail(
  {id, isDialogOpened, handleCloseDialog}: {id: number, isDialogOpened: boolean, handleCloseDialog: () => void}
) {
  const wordsUnitService = container.resolve(WordsUnitService);
  const settingsService = container.resolve(SettingsService);
  const itemOld = wordsUnitService.unitWords.find(value => value.ID === id);
  const [item] = useState(itemOld ? Object.create(itemOld) as MUnitWord : wordsUnitService.newUnitWord());
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    (item as any)[e.target.id] = e.target.value;
    forceUpdate();
  };

  const onChangeDropDown = (e: DropdownChangeEvent) => {
    (item as any)[e.target.id] = e.target.value;
    forceUpdate();
  };

  const save = async () => {
    item.WORD = settingsService.autoCorrectInput(item.WORD);
    await (item.ID ? wordsUnitService.update(item) : wordsUnitService.create(item));
    handleCloseDialog();
  };

  return !item ? <div/> : (
    <Dialog visible={isDialogOpened} style={{width: '750px'}} onHide={handleCloseDialog}>
      <div className="grid mt-2 align-items-center">
        <label className="col-4" htmlFor="ID">ID:</label>
        <InputText className="col-8" id="ID" value={item.ID.toString()} disabled />
      </div>
      <div className="grid mt-2 align-items-center">
        <label className="col-4" htmlFor="UNIT">UNIT:</label>
        <Dropdown className="col-8" id="UNIT" options={settingsService.units} value={item.UNIT} onChange={onChangeDropDown} />
      </div>
      <div className="grid mt-2 align-items-center">
        <label className="col-4" htmlFor="PART">PART:</label>
        <Dropdown className="col-8" id="PART" options={settingsService.parts} value={item.PART} onChange={onChangeDropDown} />
      </div>
      <div className="grid mt-2 align-items-center">
        <label className="col-4" htmlFor="SEQNUM">SEQNUM:</label>
        <InputText className="col-8" keyfilter="int" id="SEQNUM" value={item.SEQNUM.toString()} onChange={onChangeInput} />
      </div>
      <div className="grid mt-2 align-items-center">
        <label className="col-4" htmlFor="WORDID">WORDID:</label>
        <InputText className="col-8" id="WORDID" value={item.WORDID.toString()} disabled />
      </div>
      <div className="grid mt-2 align-items-center">
        <label className="col-4" htmlFor="WORD">WORD:</label>
        <InputText className="col-8" id="WORD" value={item.WORD} onChange={onChangeInput} />
      </div>
      <div className="grid mt-2 align-items-center">
        <label className="col-4" htmlFor="NOTE">NOTE:</label>
        <InputText className="col-8" id="NOTE" value={item.NOTE} onChange={onChangeInput} />
      </div>
      <div className="grid mt-2 align-items-center">
        <label className="col-4" htmlFor="FAMIID">FAMIID:</label>
        <InputText className="col-8" id="FAMIID" value={item.FAMIID.toString()} disabled />
      </div>
      <div className="grid mt-2 align-items-center">
        <label className="col-4" htmlFor="ACCURACY">ACCURACY:</label>
        <InputText className="col-8" id="ACCURACY" value={item.ACCURACY} disabled />
      </div>
      <div className="mt-4 flex justify-content-around flex-wrap">
        <Button className="border-round" label="Cancel" onClick={handleCloseDialog} />
        <Button className="border-round" label="Save" onClick={save} />
      </div>
    </Dialog>
  );
}

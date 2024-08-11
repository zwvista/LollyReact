import * as React from 'react';
import '../misc/Common.css'
import 'reflect-metadata';
import { container } from "tsyringe";
import { SettingsService } from '../../view-models/misc/settings.service';
import { Dropdown } from 'primereact/dropdown';
import { PhrasesUnitService } from '../../view-models/wpp/phrases-unit.service';
import { useReducer } from "react";
import { MUnitPhrase } from "../../models/wpp/unit-phrase";
import { Button, Dialog, DialogContent, MenuItem, Select, TextField } from "@mui/material";

export default function PhrasesTextbookDetail2(
  {id, isDialogOpened, handleCloseDialog}: {id: number, isDialogOpened: boolean, handleCloseDialog: () => void}
) {
  const phrasesUnitService = container.resolve(PhrasesUnitService);
  const settingsService = container.resolve(SettingsService);
  const item = Object.create(phrasesUnitService.textbookPhrases.find(value => value.ID === id)!) as MUnitPhrase;
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
    await phrasesUnitService.update(item);
    handleCloseDialog();
  };

  return !item ? <div/> : (
    <Dialog open={isDialogOpened} onClose={handleCloseDialog}>
      <DialogContent>
        <div className="p-grid mt-2 mb-2">
          <label className="col-4" htmlFor="ID">ID:</label>
          <TextField className="col-8" id="ID" value={item.ID.toString()} disabled/>
        </div>
        <div className="p-grid mb-2">
          <label className="col-4" htmlFor="TEXTBOOK">TEXTBOOK:</label>
          <TextField className="col-8" id="TEXTBOOK" value={item.TEXTBOOKNAME} disabled/>
        </div>
        <div className="p-grid mb-2">
          <label className="col-4" htmlFor="UNIT">UNIT:</label>
          <Select className="col-8" id="UNIT" value={item.UNIT} onChange={onChangeDropDown}>
            {settingsService.units.map(row =>
              <MenuItem value={row.value} key={row.value}>{row.label}</MenuItem>
            )}
          </Select>
        </div>
        <div className="p-grid mb-2">
          <label className="col-4" htmlFor="PART">PART:</label>
          <Select className="col-8" id="PART" value={item.PART} onChange={onChangeDropDown}>
            {settingsService.parts.map(row =>
              <MenuItem value={row.value} key={row.value}>{row.label}</MenuItem>
            )}
          </Select>
        </div>
        <div className="p-grid mb-2">
          <label className="col-4" htmlFor="SEQNUM">SEQNUM:</label>
          <TextField className="col-8" id="SEQNUM" value={item.SEQNUM.toString()} onChange={onChangeInput}/>
        </div>
        <div className="p-grid mb-2">
          <label className="col-4" htmlFor="PHRASEID">PHRASEID:</label>
          <TextField className="col-8" id="PHRASEID" value={item.PHRASEID.toString()} disabled/>
        </div>
        <div className="p-grid mb-2">
          <label className="col-4" htmlFor="PHRASE">PHRASE:</label>
          <TextField className="col-8" id="PHRASE" value={item.PHRASE} onChange={onChangeInput}/>
        </div>
        <div className="p-grid mb-2">
          <label className="col-4" htmlFor="TRANSLATION">TRANSLATION:</label>
          <TextField className="col-8" id="TRANSLATION" value={item.TRANSLATION} onChange={onChangeInput}/>
        </div>
        <div className="mt-4 flex justify-content-around flex-wrap">
          <Button className="border-round" onClick={handleCloseDialog}>Cancel</Button>
          <Button className="border-round" onClick={save}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

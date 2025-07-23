import * as React from 'react';
import { PhrasesUnitService } from '../../shared/view-models/wpp/phrases-unit.service';
import '../misc/Common.css'
import { container } from "tsyringe";
import { SettingsService } from '../../shared/view-models/misc/settings.service';
import { ChangeEvent, useReducer, useState } from "react";
import { MUnitPhrase } from "../../shared/models/wpp/unit-phrase";
import { Button, Dialog, DialogContent, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';

export default function PhrasesUnitDetail2(
  {id, isDialogOpened, handleCloseDialog}: {id: number, isDialogOpened: boolean, handleCloseDialog: () => void}
) {
  const phrasesUnitService = container.resolve(PhrasesUnitService);
  const settingsService = container.resolve(SettingsService);
  const itemOld = phrasesUnitService.unitPhrases.find(value => value.ID === id);
  const [item] = useState(itemOld ? Object.create(itemOld) as MUnitPhrase : phrasesUnitService.newUnitPhrase());
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    (item as any)[e.target.id] = e.target.value;
    forceUpdate();
  };

  const onChangeSelect = (e: SelectChangeEvent) => {
    (item as any)[e.target.name] = e.target.value;
    forceUpdate();
  };

  const save = async () => {
    item.PHRASE = settingsService.autoCorrectInput(item.PHRASE);
    await (item.ID ? phrasesUnitService.update(item) : phrasesUnitService.create(item));
    handleCloseDialog();
  };

  return !item ? <div/> : (
    <Dialog open={isDialogOpened} onClose={handleCloseDialog} fullWidth classes={{ paperFullWidth: 'width:750px' }}>
      <DialogContent>
        <div className="grid mt-2 mb-2">
          <label className="col-4" htmlFor="ID">ID:</label>
          <TextField className="col-8" id="ID" value={item.ID.toString()} disabled />
        </div>
        <div className="grid mb-2">
          <label className="col-4" htmlFor="UNIT">UNIT:</label>
          <Select className="col-8" id="UNIT" name="UNIT" value={item.UNIT.toString()} onChange={onChangeSelect}>
            {settingsService.units.map(row =>
              <MenuItem value={row.value} key={row.value}>{row.label}</MenuItem>
            )}
          </Select>
        </div>
        <div className="grid mb-2">
          <label className="col-4" htmlFor="PART">PART:</label>
          <Select className="col-8" id="PART" name="PART" value={item.PART.toString()} onChange={onChangeSelect}>
            {settingsService.parts.map(row =>
              <MenuItem value={row.value} key={row.value}>{row.label}</MenuItem>
            )}
          </Select>
        </div>
        <div className="grid mb-2">
          <label className="col-4" htmlFor="SEQNUM">SEQNUM:</label>
          <TextField className="col-8" id="SEQNUM" value={item.SEQNUM.toString()} onChange={onChangeInput} />
        </div>
        <div className="grid mb-2">
          <label className="col-4" htmlFor="PHRASEID">PHRASEID:</label>
          <TextField className="col-8" id="PHRASEID" value={item.PHRASEID.toString()} disabled />
        </div>
        <div className="grid mb-2">
          <label className="col-4" htmlFor="PHRASE">PHRASE:</label>
          <TextField className="col-8" id="PHRASE" value={item.PHRASE} onChange={onChangeInput} />
        </div>
        <div className="grid mb-2">
          <label className="col-4" htmlFor="TRANSLATION">TRANSLATION:</label>
          <TextField className="col-8" id="TRANSLATION" value={item.TRANSLATION} onChange={onChangeInput} />
        </div>
        <div className="mt-4 flex justify-content-around flex-wrap">
          <Button variant="contained" className="border-round" onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" className="border-round" onClick={save}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import * as React from 'react';
import '../misc/Common.css'
import 'reflect-metadata';
import { container } from "tsyringe";
import { SettingsService } from '../../view-models/misc/settings.service';
import { PatternsService } from '../../view-models/wpp/patterns.service';
import { useReducer } from "react";
import { MPattern } from "../../models/wpp/pattern";
import { Button, Dialog, TextField } from "@mui/material";

export default function PatternsDetail2(
  {id, isDialogOpened, handleCloseDialog}: {id: number, isDialogOpened: boolean, handleCloseDialog: () => void}
) {
  const patternsService = container.resolve(PatternsService);
  const settingsService = container.resolve(SettingsService);
  const itemOld = patternsService.patterns.find(value => value.ID === id);
  const item = itemOld ? Object.create(itemOld) as MPattern : patternsService.newPattern();
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const onChangeInput = (e: any) => {
    const elem = e.nativeEvent.target as HTMLInputElement;
    item[elem.id] = elem.value;
    forceUpdate();
  };

  const save = async () => {
    item.PATTERN = settingsService.autoCorrectInput(item.PATTERN);
    await (item.ID ? patternsService.update(item) : patternsService.create(item));
    handleCloseDialog();
  };

  return !item ? <div/> : (
    <Dialog open={isDialogOpened} style={{width: '750px'}} onClose={handleCloseDialog}>
      <div className="p-grid mt-2 mb-2">
        <label className="col-4" htmlFor="ID">ID:</label>
        <TextField className="col-8" id="ID" value={item.ID.toString()} disabled />
      </div>
      <div className="p-grid mb-2">
        <label className="col-4" htmlFor="PATTERN">PATTERN:</label>
        <TextField className="col-8" id="PATTERN" value={item.PATTERN} onChange={onChangeInput} />
      </div>
      <div className="p-grid mb-2">
        <label className="col-4" htmlFor="NOTE">NOTE:</label>
        <TextField className="col-8" id="NOTE" value={item.NOTE} onChange={onChangeInput} />
      </div>
      <div className="p-grid mb-2">
        <label className="col-4" htmlFor="TAGS">TAGS:</label>
        <TextField className="col-8" id="TAGS" value={item.TAGS} onChange={onChangeInput} />
      </div>
      <div className="mt-4 flex justify-content-around flex-wrap">
        <Button className="border-round" onClick={handleCloseDialog}>Cancel</Button>
        <Button className="border-round" onClick={save}>Save</Button>
      </div>
    </Dialog>
  );
}

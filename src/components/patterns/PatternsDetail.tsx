import * as React from 'react';
import { Button } from 'primereact/button';
import '../misc/Common.css'
import { InputText } from 'primereact/inputtext';
import { container } from "tsyringe";
import { SettingsService } from '../../view-models/misc/settings.service';
import { PatternsService } from '../../view-models/wpp/patterns.service';
import { Dialog } from 'primereact/dialog';
import { ChangeEvent, useReducer, useState } from "react";
import { MPattern } from "../../models/wpp/pattern";

export default function PatternsDetail(
  {id, isDialogOpened, handleCloseDialog}: {id: number, isDialogOpened: boolean, handleCloseDialog: () => void}
) {
  const patternsService = container.resolve(PatternsService);
  const settingsService = container.resolve(SettingsService);
  const itemOld = patternsService.patterns.find(value => value.ID === id);
  const [item] = useState(itemOld ? Object.create(itemOld) as MPattern : patternsService.newPattern());
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    item[e.target.id] = e.target.value;
    forceUpdate();
  };

  const save = async () => {
    item.PATTERN = settingsService.autoCorrectInput(item.PATTERN);
    await (item.ID ? patternsService.update(item) : patternsService.create(item));
    handleCloseDialog();
  };

  return !item ? <div/> : (
    <Dialog visible={isDialogOpened} style={{width: '750px'}} onHide={handleCloseDialog}>
      <div className="grid mt-2 mb-2">
        <label className="col-4" htmlFor="ID">ID:</label>
        <InputText className="col-8" id="ID" value={item.ID.toString()} disabled/>
      </div>
      <div className="grid mb-2">
        <label className="col-4" htmlFor="PATTERN">PATTERN:</label>
        <InputText className="col-8" id="PATTERN" value={item.PATTERN} onChange={onChangeInput}/>
      </div>
      <div className="grid mb-2">
        <label className="col-4" htmlFor="TAGS">TAGS:</label>
        <InputText className="col-8" id="TAGS" value={item.TAGS} onChange={onChangeInput}/>
      </div>
      <div className="grid mb-2">
        <label className="col-4" htmlFor="TITLE">TITLE:</label>
        <InputText className="col-8" id="TITLE" value={item.TITLE} onChange={onChangeInput}/>
      </div>
      <div className="grid mb-2">
        <label className="col-4" htmlFor="URL">URL:</label>
        <InputText className="col-8" id="URL" value={item.URL} onChange={onChangeInput}/>
      </div>
      <div className="mt-4 flex justify-content-around flex-wrap">
        <Button className="border-round" label="Cancel" onClick={handleCloseDialog}/>
        <Button className="border-round" label="Save" onClick={save}/>
      </div>
    </Dialog>
  );
}

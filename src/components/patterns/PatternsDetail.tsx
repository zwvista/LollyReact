import * as React from 'react';
import { Button } from 'primereact/button';
import '../misc/Common.css'
import { InputText } from 'primereact/inputtext';
import 'reflect-metadata';
import { container } from "tsyringe";
import { SettingsService } from '../../view-models/misc/settings.service';
import { PatternsService } from '../../view-models/wpp/patterns.service';
import { Dialog } from 'primereact/dialog';
import { useReducer } from "react";
import { MPattern } from "../../models/wpp/pattern";

export default function PatternsDetail(
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
    <Dialog visible={isDialogOpened} style={{width: '750px'}} onHide={handleCloseDialog}>
      <div className="p-grid mt-2 mb-2">
        <label className="col-4" htmlFor="ID">ID:</label>
        <InputText className="col-8" id="ID" value={item.ID.toString()} disabled />
      </div>
      <div className="p-grid mb-2">
        <label className="col-4" htmlFor="PATTERN">PATTERN:</label>
        <InputText className="col-8" id="PATTERN" value={item.PATTERN} onChange={onChangeInput} />
      </div>
      <div className="p-grid mb-2">
        <label className="col-4" htmlFor="NOTE">NOTE:</label>
        <InputText className="col-8" id="NOTE" value={item.NOTE} onChange={onChangeInput} />
      </div>
      <div className="p-grid mb-2">
        <label className="col-4" htmlFor="TAGS">TAGS:</label>
        <InputText className="col-8" id="TAGS" value={item.TAGS} onChange={onChangeInput} />
      </div>
      <div className="mt-4 flex justify-content-around flex-wrap">
        <Button className="border-round" label="Cancel" onClick={handleCloseDialog} />
        <Button className="border-round" label="Save" onClick={save} />
      </div>
    </Dialog>
  );
}

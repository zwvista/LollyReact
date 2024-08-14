import * as React from 'react';
import { WordsLangService } from '../../view-models/wpp/words-lang.service';
import { Button } from 'primereact/button';
import '../misc/Common.css'
import { InputText } from 'primereact/inputtext';
import { container } from "tsyringe";
import { SettingsService } from '../../view-models/misc/settings.service';
import { Dialog } from "primereact/dialog";
import { ChangeEvent, useReducer, useState } from "react";
import { MLangWord } from "../../models/wpp/lang-word";

export default function WordsLangDetail(
  {id, isDialogOpened, handleCloseDialog}: {id: number, isDialogOpened: boolean, handleCloseDialog: () => void}
) {
  const wordsLangService = container.resolve(WordsLangService);
  const settingsService = container.resolve(SettingsService);
  const itemOld = wordsLangService.langWords.find(value => value.ID === id);
  const [item] = useState(itemOld ? Object.create(itemOld) as MLangWord : wordsLangService.newLangWord());
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    item[e.target.id] = e.target.value;
    forceUpdate();
  };

  const save = async () => {
    item.WORD = settingsService.autoCorrectInput(item.WORD);
    await (item.ID ? wordsLangService.update(item) : wordsLangService.create(item));
    handleCloseDialog();
  };

  return !item ? <div/> : (
    <Dialog visible={isDialogOpened} style={{width: '750px'}} onHide={handleCloseDialog}>
      <div className="grid mt-2 mb-2">
        <label className="col-4" htmlFor="ID">ID:</label>
        <InputText className="col-8" id="ID" value={item.ID.toString()} disabled />
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

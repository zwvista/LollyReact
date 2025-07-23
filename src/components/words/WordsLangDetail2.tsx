import * as React from 'react';
import { WordsLangService } from '../../shared/view-models/wpp/words-lang.service';
import '../misc/Common.css'
import { container } from "tsyringe";
import { SettingsService } from '../../shared/view-models/misc/settings.service';
import { ChangeEvent, useReducer, useState } from "react";
import { MLangWord } from "../../shared/models/wpp/lang-word";
import { Button, Dialog, DialogContent, TextField } from "@mui/material";

export default function WordsLangDetail2(
  {id, isDialogOpened, handleCloseDialog}: {id: number, isDialogOpened: boolean, handleCloseDialog: () => void}
) {
  const wordsLangService = container.resolve(WordsLangService);
  const settingsService = container.resolve(SettingsService);
  const itemOld = wordsLangService.langWords.find(value => value.ID === id);
  const [item] = useState(itemOld ? Object.create(itemOld) as MLangWord : wordsLangService.newLangWord());
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    (item as any)[e.target.id] = e.target.value;
    forceUpdate();
  };

  const save = async () => {
    item.WORD = settingsService.autoCorrectInput(item.WORD);
    await (item.ID ? wordsLangService.update(item) : wordsLangService.create(item));
    handleCloseDialog();
  };

  return !item ? <div/> : (
    <Dialog open={isDialogOpened} onClose={handleCloseDialog} fullWidth classes={{ paperFullWidth: 'width:750px' }}>
      <DialogContent>
        <div className="grid mt-2 mb-2">
          <label className="col-4" htmlFor="ID">ID:</label>
          <TextField className="col-8" id="ID" value={item.ID.toString()} disabled />
        </div>
        <div className="grid mt-2 align-items-center">
          <label className="col-4" htmlFor="WORD">WORD:</label>
          <TextField className="col-8" id="WORD" value={item.WORD} onChange={onChangeInput} />
        </div>
        <div className="grid mt-2 align-items-center">
          <label className="col-4" htmlFor="NOTE">NOTE:</label>
          <TextField className="col-8" id="NOTE" value={item.NOTE} onChange={onChangeInput} />
        </div>
        <div className="grid mt-2 align-items-center">
          <label className="col-4" htmlFor="FAMIID">FAMIID:</label>
          <TextField className="col-8" id="FAMIID" value={item.FAMIID.toString()} disabled />
        </div>
        <div className="grid mt-2 align-items-center">
          <label className="col-4" htmlFor="ACCURACY">ACCURACY:</label>
          <TextField className="col-8" id="ACCURACY" value={item.ACCURACY} disabled />
        </div>
        <div className="mt-4 flex justify-content-around flex-wrap">
          <Button variant="contained" className="border-round" onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" className="border-round" onClick={save}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

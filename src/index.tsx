import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import WordsUnit from "./components/words/WordsUnit";
import WordsUnit2 from "./components/words/WordsUnit2";
import WordsUnitDetail from "./components/words/WordsUnitDetail";
import PhrasesUnit from "./components/phrases/PhrasesUnit";
import PhrasesUnit2 from "./components/phrases/PhrasesUnit2";
import PhrasesUnitDetail from "./components/phrases/PhrasesUnitDetail";
import WordsLang from "./components/words/WordsLang";
import WordsLang2 from "./components/words/WordsLang2";
import WordsLangDetail from "./components/words/WordsLangDetail";
import PhrasesLang from "./components/phrases/PhrasesLang";
import PhrasesLang2 from "./components/phrases/PhrasesLang2";
import PhrasesLangDetail from "./components/phrases/PhrasesLangDetail";
import WordsTextbook from "./components/words/WordsTextbook";
import WordsTextbook2 from "./components/words/WordsTextbook2";
import WordsTextbookDetail from "./components/words/WordsTextbookDetail";
import PhrasesTextbook from "./components/phrases/PhrasesTextbook";
import PhrasesTextbook2 from "./components/phrases/PhrasesTextbook2";
import PhrasesTextbookDetail from "./components/phrases/PhrasesTextbookDetail";
import Patterns from "./components/patterns/Patterns";
import Patterns2 from "./components/patterns/Patterns2";
import PatternsDetail from "./components/patterns/PatternsLang";
import WordsDict from "./components/misc/WordsDict";
import Settings from "./components/misc/Settings";
import 'reflect-metadata'

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App/>} >
        <Route index element={<WordsUnit/>} />
        <Route path="words-unit" element={<WordsUnit/>} />
        <Route path="words-unit2" element={<WordsUnit2/>} />
        <Route path="words-unit-detail/:id" element={<WordsUnitDetail/>} />
        <Route path="phrases-unit" element={<PhrasesUnit/>} />
        <Route path="phrases-unit2" element={<PhrasesUnit2/>} />
        <Route path="phrases-unit-detail/:id" element={<PhrasesUnitDetail/>} />
        <Route path="words-lang" element={<WordsLang/>} />
        <Route path="words-lang2" element={<WordsLang2/>} />
        <Route path="words-lang-detail/:id" element={<WordsLangDetail/>} />
        <Route path="phrases-lang" element={<PhrasesLang/>} />
        <Route path="phrases-lang2" element={<PhrasesLang2/>} />
        <Route path="phrases-lang-detail/:id" element={<PhrasesLangDetail/>} />
        <Route path="words-textbook" element={<WordsTextbook/>} />
        <Route path="words-textbook2" element={<WordsTextbook2/>} />
        <Route path="words-textbook-detail/:id" element={<WordsTextbookDetail/>} />
        <Route path="phrases-textbook" element={<PhrasesTextbook/>} />
        <Route path="phrases-textbook2" element={<PhrasesTextbook2/>} />
        <Route path="phrases-textbook-detail/:id" element={<PhrasesTextbookDetail/>} />
        <Route path="patterns" element={<Patterns/>} />
        <Route path="patterns2" element={<Patterns2/>} />
        <Route path="patterns-detail/:id" element={<PatternsDetail/>} />
        <Route path="words-dict/:type/:index" element={<WordsDict/>} />
        <Route path="settings" element={<Settings/>} />
      </Route>
    </Routes>
  </BrowserRouter>,
  document.getElementById('root') as HTMLElement
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


// создать keyboard
let keyboard = createElem('div', 'keyboard');
document.body.appendChild(keyboard);

// создать доп.текст
let pLang = createElem('p', 'lang');
pLang.textContent = 'Alt+Shift - переключить раскладку';
document.body.appendChild(pLang);

// установить букву на клавише (div элементе) с учетом режима mode (0 - англ, 1 - рус)
const setLang = (div, key) => div.textContent = (key.values.length > 1) ? key.values[mode] : key.values[0];

// вставить символ c в textarea
const keyInsert = (c) => { 
  let s = ta.selectionStart; // позиция курсора
  // досимвольная часть строки + символ + послесимвольная часть
  ta.value = ta.value.substring(0, s) + c + ta.value.substring(s, ta.value.length); 
  ta.focus(); // фокус на textarea
  ta.setSelectionRange(s + 1, s + 1); // курсор на новое место
}

// удалить символ из textarea
const keyDel = (a, b) => { 
  // a - сколько отступить перед символом
  // b - сколько отступить после
  let s = ta.selectionStart; 
  ta.value = ta.value.substring(0, s + a) + ta.value.substring(s + b, ta.value.length); 
  ta.focus(); 
  ta.setSelectionRange(s + a, s + a); // курсор на новое место
}

// обработка вариантов поля code объекта k
const processSpecial = (k) => { 
  if (k.code === 'Space') keyInsert(' '); 
  if (k.code === 'Tab') keyInsert('\t'); 
  if (k.code === 'Enter') keyInsert('\n'); 
  if (k.code === 'Backspace') keyDel(-1, 0); // удалить символ до курсора
  if (k.code === 'Delete') keyDel(0, 1); // удалить символ после курсора
}

function init() {
  // получить данные из json
  fetch(jsonUrl)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    for (let row of data) {
      // row - объект строки (ряда) клавиш
      let rowDiv = createElem('div', 'row'); // создать div строки
      for (let key of row) {
        // key - объект клавиши
        let keyDiv = createElem('div', 'key'); // создать div клавиши
        setLang(keyDiv, key); 
        keyDiv.style.width = ((key.size) ? key.size * keyWidth : keyWidth) + 'px';
        rowDiv.appendChild(keyDiv);
        // клик по клавише вставляет в textarea символ этой клавиши (если это не спецклавиша)
        // спецклавиши обрабатываются функцией processSpecial
        keyDiv.addEventListener('click', () => { if (!key.special) keyInsert(keyDiv.textContent[0].toLowerCase()); processSpecial(key); });
        key['div'] = keyDiv; // запомнить div клавиши в новом поле div
        keys.push(key); // занести все объекты клавиш в массив keys
      }
      keyboard.appendChild(rowDiv);
    }
  
    // обработка начала нажатия клавиш
    ta.addEventListener('keydown', (e) => { 
      // поискать, есть ли нажатая клавиша в начальных данных
      let key = keys.find((k) => k.code === e.code); 
      if (!key) return;
      // подсветить клавишу
      key.div.classList.add('pressed');
      processSpecial(e); 
      if (key.special) e.preventDefault();
    });
  
    // обработка отпускания клавиш
    ta.addEventListener('keyup', (e) => { 
      // поискать, есть ли нажатая клавиша в начальных данных
      let key = keys.find((k) => k.code === e.code); 
      if (!key) return; 
      // убрать подсветку
      setTimeout(() => key.div.classList.remove('pressed'), 500);
      // обработка Shift + Alt
      if (e.code === 'ShiftLeft' && e.altKey || e.code === 'AltLeft' && e.shiftKey) { 
        mode = 1 - mode; // сменить бит режима
        keys.forEach(k => setLang(k.div, k)); // у всех клавиш сменить букву
      }
    })
  });
}

init();

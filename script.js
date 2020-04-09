let mode = 0, keyWidth = 40, keys = [];
let keyboard = document.getElementById('keyboard');
let ta = document.getElementById('textarea');
// далее создаю элемент типа el с классом cl
const createElem = (el, cl) => { 
  let elem = document.createElement(el);
   elem.classList.add(cl); 
   return elem; }
// сменяю букву на клавише (div элементе), буква меняется по режиму mode ()
const setLang = (div, key) => div.textContent = (key.values.length > 1) ? key.values[mode] : key.values[0];
// вставить символ в textarea
const keyInsert = (c) => { let s = ta.selectionStart; // позиция курсора
  // досимвольная часть строки+ символ+послесимвольная часть
   ta.value = ta.value.substring(0, s) + c + ta.value.substring(s, ta.value.length); 
   ta.focus(); ta.setSelectionRange(s + 1, s + 1); //курсор на новое место
  }
  // удалить символ из textarea
const keyDel = (a, b) => { 
  // а-сколько отступить перед символом
  // b-сколько отступить после
  let s = ta.selectionStart;
   ta.value = ta.value.substring(0, s + a) + ta.value.substring(s + b, ta.value.length);
    ta.focus(); ta.setSelectionRange(s + a, s + a); //курсор на новое место
   }
  //  обработка вариантов поля code объекта k
const processSpecial = (k) => { if (k.code === 'Space') keyInsert(' '); 
      if (k.code === 'Tab') keyInsert('\t');
      if (k.code === 'Enter') keyInsert('\n'); 
      if (k.code === 'Backspace') keyDel(-1, 0); //удалить символ до курсора
      if (k.code === 'Delete') keyDel(0, 1); // удалить символ после курсора
    }
    function init() {
      for (let row of data) {
        let rowDiv = createElem('div', 'row');
        for (let key of row) {
          let keyDiv = createElem('div', 'key'); setLang(keyDiv, key);
          keyDiv.style.width = ((key.size) ? key.size * keyWidth : keyWidth) + 'px';
          rowDiv.appendChild(keyDiv);
          keyDiv.addEventListener('click', () => { if (!key.special) keyInsert(keyDiv.textContent[0].toLowerCase()); processSpecial(key); });
          key['div'] = keyDiv;
          keys.push(key);
        }
        keyboard.appendChild(rowDiv);
      }
      ta.addEventListener('keydown', (e) => { let key = keys.find((k) => k.code === e.code); if (!key) return; key.div.classList.add('pressed');
        processSpecial(e); if (key.special) e.preventDefault();
      });
      ta.addEventListener('keyup', (e) => { let key = keys.find((k) => k.code === e.code); if (!key) return; key.div.classList.remove('pressed');
        if (e.code === 'ShiftLeft' && e.altKey || e.code === 'AltLeft' && e.shiftKey) { mode = 1 - mode; keys.forEach(k => setLang(k.div, k)); }
      });
    }
init();

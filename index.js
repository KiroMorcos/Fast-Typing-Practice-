(() => {
  // config 
  const WORDS =
    `ability able aboard about above absence absolute abstract academy accent accept access accident account accuracy accurate achieve acid across action active actor actress actual adapt add addition address adjust admit adult advance advantage adventure advertise advice aerobic affair affect afford agency agenda agent aggressive agony agree ahead aid aim air alarm album alert alien alike alive alley allow ally almost alone alpha alter always amaze amber ambition amount analyst anchor ancient angle animal ankle annual answer antenna antique anxiety apart apology appeal appear apple appoint approve april arch area arena argue arm aroma arrange arrest arrive arrow art article artist ash aside aspect aspire assault asset assist assume athlete atom attack attain attempt attend attention attitude attorney attract auction audit august aunt author auto autumn average avoid award aware away awkward axis baby bachelor back badge bag bail bait bake balance ball ban banana band bang bank banner bar barely bargain barrel base basic basis basket bath battle beach beam bean bear beat beauty because become beef before begin behave behind being belief believe bell below belt bench benefit berry beside best betray better between beyond bias bible bicycle bid bike bill bind biology bird birth biscuit bishop bite bitter black blade blame blank blanket blast blaze blend bless blind block blood bloom blow blue board boast boat body boil bold bolt bomb bonus book boost border bore borrow boss both bother bottle bottom boundary bowl box boy brain branch brand brave bread breeze brick bride bridge brief bright brilliant bring brisk broad broken broker bronze brook brother brown brush bubble buddy budget buffalo build bulb bulk bullet bundle burden bureau burger burst bus business busy butter buyer cabin cable cactus cage cake calculate calendar call calm camera camp campus can cancel cancer candidate candle candy canvas canyon capable capacity capital captain car carbon cargo carpet carry cart carve case cash casino castle casual cat catalog catch category cattle cause cave ceiling celebrate cell cement census century cereal certain chair chalk champion change chaos chapter charge charity charm chart chase cheap cheat check cheek cheese chef cherry chest chicken chief child chimney choice choose chorus cinema circle citizen city civil claim clamp clarify clash class classic claw clay clean clear clerk clever click client cliff climb clinic clip clock close cloth cloud clown club clue cluster coach coal coast coat cobra code coffee coil coin collect color column combat combine come comfort comic command comment common company compare compass compel compete complex compose concept concern concert conclude concrete conduct confirm conflict connect consent consider consist console constant contact contain content contest context control convert convince cook cool copper copy coral core corn corner correct cost cotton couch council counsel count country county couple courage course court cousin cover cow craft crash crawl crazy cream credit creek crew crime crisp critic crop cross crowd crown crucial cruel cruise crush crystal cube culture cup cure curious current curtain curve cushion custom cute cycle dad dairy damage dance danger dare dark darling data date dawn day deal dealer dear debate debt decade decide decision deck declare decline decorate decrease deer defeat defend define degree delay deliver demand democracy demon deny depend depict deploy deposit depth deputy derive describe desert design desire desk destroy detail detect develop device devote diagram dial diamond diary dice diet differ digital dignity dilemma dinner direct dirt dirty disability disaster discipline disclose discount discover discuss disease dish dismiss display distance distinct district diverse divide divine doctor document dodge dog doll domain donate donkey door dose double dove draft dragon drama drastic draw dream dress drift drill drink drip driver drop drought drum dry dual duck duel dull dumb dump dune during dust duty dwarf dynamic eager eagle early earn earth ease east easy echo eclipse ecology edge edit educate effect effort egg eight either elbow elder elect element elephant elevator elite else embark embrace emerge emotion employ empower empty enable enact end endorse enemy energy engage engine enhance enjoy enlist enough enrich enroll ensure enter entire entry envelop episode equal equip era erase error escape essay essence estate eternal ethics ethnic evaluate even evening event ever every evidence evil evoke evolve exact exam example exceed excel except exchange excite exclude excuse execute exercise exhaust exhibit exile exist exit exotic expand expect expense expert explain explode explore export expose express extend extra eye fabric face facility fact factor fade fail fair faith fall false fame family famous fan fancy fantasy farm fashion fat fatal father fault favor feast feature federal fee feed feel female fence festival fetch fever few fiber fiction field fierce fight figure file film filter final finance find fine finger finish fire firm first fiscal fish fitness fix flag flame flash flat flavor fleet flesh flight flip float flock flood floor flour flow flower fluid flush fly focus fold follow food foot force forest forever forget form formal format fortune forum forward fossil foster found fox fragile frame free freedom freeze freight fresh friend fringe frog front frost fruit fuel fulfill fun function fund funeral funny fur fury future gain galaxy gallery game gap garage garden garlic gas gate gather gauge gaze gear gender gene general genius genre gentle genuine gesture ghost giant gift giggle ginger girl give glance glare glass glide glimpse globe gloom glory glove glow glue goal goat goddess gold golf good gospel gossip govern gown grab grace grade grain grand grant grape grasp grass gravity gray great green grid grief grill grip grocery ground group grow growth guarantee guard guess guest guide guilt guitar guy habit hair half hall hammer hand handle hang happen happy harbor hard harvest hat hate haunt have hawk hazard head health heart heat heaven heavy hedge height heir helmet help heritage hero hidden high highlight hill hire history hobby hold hole holiday holy home honest honey honor hood`
    .split(/\s+/);
  const NUM_WORDS = 40;
  const container = document.getElementById("wordsContainer");
  const wpmEl = document.getElementById("wpm");
  const accEl = document.getElementById("accuracy");
  const restartBtn = document.getElementById("restart");
  const typingArea = document.getElementById("typingArea");
  const keyboardRoot = document.getElementById("keyboard");
  const themeToggle = document.getElementById("themeToggle");

  // Toggle theme
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    themeToggle.textContent = document.body.classList.contains("dark")
      ? "Light"
      : "Dark";
  });

  // state 
  let sequence = [];
  let currentIndex = 0;
  let typedBuffer = "";
  let startedAt = null;
  let timer = null;
  let correctChars = 0;
  let totalKeystrokes = 0; 
  let mistakes = 0;
  let keyMap = {}; 

  // utilities 
  function randWord() {
    return WORDS[Math.floor(Math.random() * WORDS.length)];
  }

  function generateSequence(n) {
    const out = [];
    for (let i = 0; i < n; i++) out.push(randWord());
    return out;
  }

  function resetState() {
    sequence = generateSequence(NUM_WORDS);
    currentIndex = 0;
    typedBuffer = "";
    startedAt = null;
    correctChars = 0;
    totalKeystrokes = 0;
    mistakes = 0;
    clearInterval(timer);
    timer = null;
    renderWords();
    updateMetrics(true);
    focusArea();
  }

  // rendering 
  function renderWords() {
    container.innerHTML = "";

    sequence.forEach((w, i) => {
      const span = document.createElement("span");
      span.textContent = w;
      span.className =
        "word" +
        (i < currentIndex ? " past" : i === currentIndex ? " current" : "");

        if (i === currentIndex) {
        span.innerHTML = renderCurrentWordHTML(w, typedBuffer);
      }
      container.appendChild(span);
    });

    const caret = document.createElement("span");
    caret.className = "caret";

    const currentEl = container.querySelector(".word.current");

    if (currentEl) {
      currentEl.parentNode.insertBefore(caret, currentEl);
    }
  }

  function renderCurrentWordHTML(word, buffer) {
    let html = "";
    const caretPos = buffer.length;

    for (let i = 0; i < word.length; i++) {
      let ch = word[i];

      if (i === caretPos) {
        html += `<span class="caret inline-caret"></span>`;
      }

      if (buffer[i] === ch) {
        html += `<span style="color:var(--accent-strong)">${ch}</span>`;
      } else if (buffer[i] != null) {
        html += `<span style="text-decoration:underline;color:#d04444">${ch}</span>`;
      } else {
        html += ch;
      }
    }

    if (caretPos === word.length) {
      html += `<span class="caret inline-caret"></span>`;
    }

    return html;
  }

  function updateMetrics(force) {
    let wpm = 0;
    if (startedAt) {
      const secs = (Date.now() - startedAt) / 1000;
      const minutes = Math.max(secs / 60, 1 / 60); 
      wpm = Math.round(correctChars / 5 / minutes);
    } else {
      wpm = 0;
    }
    
    const acc =
      totalKeystrokes === 0
        ? 100
        : Math.round(((totalKeystrokes - mistakes) / totalKeystrokes) * 100);
    wpmEl.textContent = wpm;
    accEl.textContent = acc + "%";
  }

  // typing logic 
  function handlePhysicalKey(e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const key = e.key;

    // record start time on first real key
    if (!startedAt && key.length === 1) {
      startedAt = Date.now();
      timer = setInterval(() => updateMetrics(), 900);
    }

    // highlight virtual key
    highlightKey(key);

    // handle backspace
    if (key === "Backspace") {
      if (typedBuffer.length > 0) {
        typedBuffer = typedBuffer.slice(0, -1);
      }

      renderWords();
      return;
    }

    if (key === " ") {
      e.preventDefault();

      if (typedBuffer.length < sequence[currentIndex].length) {
        mistakes++;
        totalKeystrokes++;
        typedBuffer += "_";
        renderWords();
        return;
      }

      submitWord();
      return;
    }

    if (key === "Enter") {
      submitWord();
      e.preventDefault();
      return;
    }

    if (key.length === 1) {
      totalKeystrokes++;
      const expected = sequence[currentIndex][typedBuffer.length] || "";
      
      if (key === expected) {
        correctChars++;
      } else {
        mistakes++;
      }

      typedBuffer += key;
      renderWords();
    }
  }

  function submitWord() {
    const expected = sequence[currentIndex];
  
    currentIndex++;
    typedBuffer = "";

    if (currentIndex >= sequence.length) {
      sequence = generateSequence(NUM_WORDS);
      currentIndex = 0;
      typedBuffer = "";
    }
   
    renderWords();
  }

  // virtual keyboard rendering & mapping
  const QWERTY = [
    [
      "`",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "0",
      "-",
      "=",
      "Backspace",
    ],
    ["Tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"],
    ["Caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "Enter"],
    ["Shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "Shift"],
    ["Space"],
  ];

  function buildKeyboard() {
    keyboardRoot.innerHTML = "";
   
    QWERTY.forEach((rowKeys) => {
      const r = document.createElement("div");
      r.className = "row";
      rowKeys.forEach((k) => {
        const keyEl = document.createElement("div");
        
        keyEl.className = "key";
        keyEl.textContent = k.length > 1 ? k : k;
        
        if (k === "Backspace" || k === "Enter" || k === "Shift" || k === "Caps")
          keyEl.classList.add("wide");
        
        if (k === "Space") {
          keyEl.classList.add("extra-wide");
          keyEl.style.minWidth = "420px";
        }

        keyEl.dataset.key = mapKeyName(k);
        r.appendChild(keyEl);
        keyMap[keyEl.dataset.key] = keyEl;

        keyEl.addEventListener("mousedown", (ev) => {
          ev.preventDefault();
          simulateKeyPress(keyEl.dataset.key);
        });
      });
      keyboardRoot.appendChild(r);
    });
  }

  function mapKeyName(display) {
    const d = display;

    if (d === "Backspace") return "Backspace";
    if (d === "Tab") return "Tab";
    if (d === "Enter") return "Enter";
    if (d === "Caps") return "CapsLock";
    if (d === "Shift") return "Shift";
    if (d === "Space") return " ";

    return d.toLowerCase();
  }

  function highlightKey(key) {
    const norm = key.length === 1 ? key.toLowerCase() : key === " " ? " " : key;
    const el = keyMap[norm];

    if (el) {
      el.classList.add("active");
      setTimeout(() => el.classList.remove("active"), 120);
    }
  }

  function simulateKeyPress(normKey) {
    if (normKey === "Backspace") {
      if (typedBuffer.length > 0) 
        typedBuffer = typedBuffer.slice(0, -1);
      
      totalKeystrokes++;
      mistakes++;

      renderWords();
      return;
    }

    if (normKey === " ") {
      totalKeystrokes++;
      submitWord();
      return;
    }

    if (normKey === "Enter") {
      totalKeystrokes++;
      submitWord();
      return;
    }

    totalKeystrokes++;
    const expected = sequence[currentIndex][typedBuffer.length] || "";

    if (normKey === expected) {
      correctChars++;
    } else {
      mistakes++;
    }

    typedBuffer += normKey;
    renderWords();
  }

  // events 
  window.addEventListener("keydown", (e) => {
    handlePhysicalKey(e);
  });

  typingArea.addEventListener("click", () => focusArea());
  function focusArea() {
    typingArea.focus();
  }

  window.addEventListener("keyup", (e) => {
    const k =
      e.key.length === 1 ? e.key.toLowerCase() : e.key === " " ? " " : e.key;
    const el = keyMap[k];
    if (el) el.classList.remove("active");
  });

  restartBtn.addEventListener("click", () => {
    resetState();
  });

  // update metrics frequently (every 1s) while running
  setInterval(() => updateMetrics(), 1000);
 
  buildKeyboard();
  resetState();

  typingArea.setAttribute("tabindex", "0");

  setTimeout(() => {
    typingArea.setAttribute(
      "aria-label",
      "Type the words shown. Press space to submit words, backspace to correct."
    );
  }, 500);
})();

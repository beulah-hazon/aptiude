// test-script.js
// Handles test flow, timer, anti-cheat, scoring, storing result for result.html

(function(){
  // Config from questions.js
  const TOTAL = Math.min(TEST_LENGTH, QUESTIONS.length);
  const TIME_SEC = TEST_TIME_MIN * 60;

  // load student info
  const studentName = localStorage.getItem('studentName');
  const studentReg  = localStorage.getItem('studentReg');
  if(!studentName || !localStorage.getItem('attemptStarted')) {
    alert('Please start from Home (fill details).');
    window.location.href = 'index.html';
    return;
  }

  // UI refs
  const studentInfoEl = document.getElementById('studentInfo');
  const timerEl = document.getElementById('timer');
  const qNavEl = document.getElementById('qNav');
  const qTitleEl = document.getElementById('qTitle');
  const qTextEl = document.getElementById('qText');
  const qOptionsEl = document.getElementById('qOptions');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const submitBtn = document.getElementById('submitBtn');

  studentInfoEl.innerText = studentName + ' • ' + studentReg;

  // pick and shuffle questions
  const shuffled = shuffleArray(QUESTIONS.slice());
  const selectedQs = shuffled.slice(0, TOTAL);
  // map to keep original answers/explain kept in objects

  // state
  let current = 0;
  let userAnswers = new Array(selectedQs.length).fill(null);
  let timeLeft = TIME_SEC;
  let timerId = null;
  let submitsBlocked = false;
  let tabSwitchCount = 0;

  // build qnav
  function buildNav(){
    qNavEl.innerHTML = '';
    for(let i=0;i<selectedQs.length;i++){
      const d = document.createElement('div');
      d.className = 'qnum' + (i===0? ' active' : '');
      d.innerText = i+1;
      d.onclick = ()=> { renderQuestion(i); };
      qNavEl.appendChild(d);
    }
  }

  function renderQuestion(index){
    current = index;
    // nav highlight
    Array.from(qNavEl.children).forEach((el, idx)=> el.classList.toggle('active', idx===index));
    const q = selectedQs[index];
    qTitleEl.textContent = `Question ${index+1} of ${selectedQs.length}`;
    qTextEl.textContent = q.q;
    qOptionsEl.innerHTML = '';
    q.options.forEach((opt,i)=>{
      const div = document.createElement('div');
      div.className = 'option' + (userAnswers[index] === i ? ' selected' : '');
      div.innerHTML = `<div style="font-weight:700">${String.fromCharCode(65+i)}</div><div style="flex:1">${opt}</div>`;
      div.onclick = ()=>{
        userAnswers[index] = i;
        // visual
        Array.from(qOptionsEl.children).forEach(ch=> ch.classList.remove('selected'));
        div.classList.add('selected');
        // mark nav
        qNavEl.children[index].classList.add('answered');
        saveProgress();
      };
      qOptionsEl.appendChild(div);
    });
    // add fade animation
    qTextEl.classList.remove('fade-question'); void qTextEl.offsetWidth; qTextEl.classList.add('fade-question');
  }

  prevBtn.addEventListener('click', ()=> { if(current>0) renderQuestion(current-1); });
  nextBtn.addEventListener('click', ()=> { if(current < selectedQs.length-1) renderQuestion(current+1); });

  // timer
  function startTimer(){
    timerEl.textContent = formatTime(timeLeft);
    timerId = setInterval(()=>{
      timeLeft--;
      timerEl.textContent = formatTime(timeLeft);
      // color changes
      if(timeLeft <= 10) timerEl.style.color = '#ef4444';
      else if(timeLeft <= 60) timerEl.style.color = '#f59e0b';
      if(timeLeft <= 0){
        clearInterval(timerId);
        autoSubmit('Time up');
      }
      if(timeLeft % 5 === 0) saveProgress();
    },1000);
  }

  function formatTime(s){
    const m = Math.floor(s/60); const sec = s % 60;
    return String(m).padStart(2,'0') + ':' + String(sec).padStart(2,'0');
  }

  // anti-cheat: disable copy/paste/contextmenu/hotkeys
  document.addEventListener('copy', e=> e.preventDefault());
  document.addEventListener('cut', e=> e.preventDefault());
  document.addEventListener('paste', e=> e.preventDefault());
  document.addEventListener('contextmenu', e=> e.preventDefault());
  document.addEventListener('keydown', e=>{
    if(e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 'u')) e.preventDefault();
    if(e.key === 'F12') e.preventDefault();
  });

  // tab visibility
  document.addEventListener('visibilitychange', ()=>{
    if(document.hidden){
      tabSwitchCount++;
      if(tabSwitchCount === 1) alert('Warning: Do not switch tabs during test.');
      if(tabSwitchCount >= 3) autoSubmit('Switched tabs multiple times');
      saveProgress();
    }
  });

  // save/restore progress (simple)
  function saveProgress(){
    const pack = {
      selectedQsIds: selectedQs.map(q=> q.q), // small idless check
      userAnswers, current, timeLeft
    };
    localStorage.setItem('apt_backup', JSON.stringify(pack));
  }
  function restoreProgress(){
    try {
      const st = JSON.parse(localStorage.getItem('apt_backup') || 'null');
      if(!st) return;
      // quick check length
      if(st.selectedQsIds && st.selectedQsIds.length === selectedQs.length){
        userAnswers = st.userAnswers || userAnswers;
        current = st.current || 0;
        timeLeft = st.timeLeft || timeLeft;
      }
    }catch(e){ console.warn(e); }
  }

  // submit flow
  submitBtn.addEventListener('click', ()=> {
    document.getElementById('confirmModal').style.display = 'flex';
  });
  document.getElementById('cancelSubmit').addEventListener('click', ()=> {
    document.getElementById('confirmModal').style.display = 'none';
  });
  document.getElementById('confirmSubmit').addEventListener('click', ()=> {
    document.getElementById('confirmModal').style.display = 'none';
    doSubmit('Manual submit');
  });

  // auto submit helper
  function autoSubmit(reason){
    if(confirm(`Auto-submit triggered: ${reason}. Submit now?`)) doSubmit(reason); else {
      // if user cancels auto submit (on accidental), still continue; but if time is up we submit
      if(reason === 'Time up') doSubmit(reason);
    }
  }

  function doSubmit(reason){
    if(submitsBlocked) return;
    submitsBlocked = true;
    clearInterval(timerId);
    // calculate score
    let score = 0;
    for(let i=0;i<selectedQs.length;i++){
      if(userAnswers[i] !== null && userAnswers[i] === selectedQs[i].answer) score += MARKS_PER_Q;
    }
    const payload = {
      studentName, studentReg,
      total: selectedQs.length,
      score,
      pct: Math.round((score/selectedQs.length)*100),
      qs: selectedQs,
      userAnswers,
      timeTaken: TIME_SEC - timeLeft,
      reason
    };
    // save for result page
    localStorage.setItem('lastResult', JSON.stringify(payload));
    // clear attempt flag
    localStorage.removeItem('attemptStarted');
    // optionally save to apt_results (local leaderboard)
    const arr = JSON.parse(localStorage.getItem('apt_results') || '[]');
    arr.push({ name: studentName, reg: studentReg, score: score, total: selectedQs.length, ts: Date.now() });
    localStorage.setItem('apt_results', JSON.stringify(arr));
    // redirect to result page
    window.location.href = 'result.html';
  }

  // helpers
  function shuffleArray(a){
    for(let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // restore if exists
  restoreProgress();
  buildNav();
  renderQuestion(0);
  startTimer();

  // save progress on unload
  window.addEventListener('beforeunload', function(e){
    if(!submitsBlocked){
      saveProgress();
      // show confirmation (some browsers ignore custom message)
      e.returnValue = "Leaving will save progress and may submit your test.";
    }
  });
})();

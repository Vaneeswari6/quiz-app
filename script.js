/* Pretty Quiz SPA - BUBBLES version without bg music */
(() => {
  /* ====== CONFIG ====== */
  const Q_PER_PLAY = 10;
  const QUESTION_TIME = 15; // seconds
  const BASE_POINTS = 5;
  const STREAK_BONUS = 2; // per extra consecutive correct
  const SOUND_PATH = 'sounds/'; // folder

  /* ====== DOM ====== */
  const welcome = document.getElementById('welcome');
  const quiz = document.getElementById('quiz');
  const result = document.getElementById('result');
  const leaderboard = document.getElementById('leaderboard');

  const playerNameInput = document.getElementById('playerName');
  const topicBtns = document.querySelectorAll('.topic');
  const startBtn = document.getElementById('startBtn');
  const darkSwitch = document.getElementById('darkSwitch');

  const greeting = document.getElementById('greeting');
  const qCounter = document.getElementById('qCounter');
  const scoreLabel = document.getElementById('scoreLabel');
  const questionText = document.getElementById('questionText');
  const answerFeedback = document.getElementById('answerFeedback');
  const optionsGrid = document.getElementById('optionsGrid');
  const nextBtn = document.getElementById('nextBtn');
  const quitBtn = document.getElementById('quitBtn');
  const timerEl = document.getElementById('timer');
  const progressFill = document.getElementById('progressFill');

  const playAgainBtn = document.getElementById('playAgainBtn');
  const viewBoardBtn = document.getElementById('viewBoardBtn');
  const finalMsg = document.getElementById('finalMsg');
  const finalScore = document.getElementById('finalScore');

  const leaderList = document.getElementById('leaderList');
  const clearBoard = document.getElementById('clearBoard');
  const closeBoard = document.getElementById('closeBoard');

  /* ====== AUDIO ====== */
  const correctSnd = document.getElementById('correctSound');
  const wrongSnd = document.getElementById('wrongSound');
  const celebrateSnd = document.getElementById('celebrateSound');

  correctSnd.src = SOUND_PATH + 'correct.mp3';
  wrongSnd.src = SOUND_PATH + 'wrong.mp3';
  celebrateSnd.src = SOUND_PATH + 'celebrate.mp3';

  function safePlay(a) { try{ a.currentTime = 0; const p = a.play(); if(p && p.catch) p.catch(()=>{}); } catch(e){} }

  /* ====== QUESTIONS BANK ====== */
  const BANK = {
    "Java": [ /* 20 java qns */ 
      {q:"Which keyword is used to inherit a class?", o:["this","super","extends","implements"], a:"extends"},
      {q:"Java is ____", o:["Compiled","Interpreted","Both","None"], a:"Both"},
      {q:"OOP stands for?", o:["Object Oriented Programming","Open Object Program","Only One Program","None"], a:"Object Oriented Programming"},
      {q:"JVM stands for?", o:["Java Virtual Machine","Java Variable Memory","Joint Virtual Model","None"], a:"Java Virtual Machine"},
      {q:"Which is not OOP?", o:["Inheritance","Polymorphism","Encapsulation","Compilation"], a:"Compilation"},
      {q:"Which method is main?", o:["main()","Start()","Run()","init()"], a:"main()"},
      {q:"Which is wrapper class?", o:["int","float","Integer","None"], a:"Integer"},
      {q:"Which is not keyword?", o:["class","public","static","String"], a:"String"},
      {q:"Access modifier?", o:["final","private","switch","break"], a:"private"},
      {q:"To create object:", o:["new","class","void","super"], a:"new"},
      {q:"Default value of int?", o:["0","1","null","undefined"], a:"0"},
      {q:"Which is interface?", o:["Set","List","Runnable","ArrayList"], a:"Runnable"},
      {q:"Java files end with?", o:[".java",".js",".class",".jar"], a:".java"},
      {q:"Which handles exceptions?", o:["try-catch","for","if","switch"], a:"try-catch"},
      {q:"String is?", o:["mutable","immutable","both","none"], a:"immutable"},
      {q:"Constructor name?", o:["Same as class","Any name","Start with _","None"], a:"Same as class"},
      {q:"JRE full form?", o:["Java Runtime Environment","Java Regular Engine","Java Raw Execution","None"], a:"Java Runtime Environment"},
      {q:"Method overriding in?", o:["Same class","Subclass","Interfaces only","None"], a:"Subclass"},
      {q:"Break stops?", o:["Loop","Class","Object","Package"], a:"Loop"},
      {q:"Which is collection?", o:["ArrayList","Thread","Runnable","None"], a:"ArrayList"}
    ],
    "Python": [
      {q:"Python is ____ language?", o:["Compiled","Interpreted","Markup","None"], a:"Interpreted"},
      {q:"Creator of Python?", o:["James Gosling","Guido van Rossum","Dennis Ritchie","Mark"], a:"Guido van Rossum"},
      {q:"List is written using?", o:["()","{}","[]","<>"], a:"[]"},
      {q:"Tuple is?", o:["Mutable","Immutable","Dynamic","None"], a:"Immutable"},
      {q:"Which loop?", o:["repeat","for","each","loop"], a:"for"},
      {q:"Keyword?", o:["print","if","loop","repeat"], a:"if"},
      {q:"To read input?", o:["take()","scan()","input()","read()"], a:"input()"},
      {q:"To print?", o:["out()","console()","print()","say()"], a:"print()"},
      {q:"Dict uses?", o:["key:value","index","pair","none"], a:"key:value"},
      {q:"Python file extension?", o:[".py",".py3",".pt",".p"], a:".py"},
      {q:"To find length?", o:["size()","len()","length()","count()"], a:"len()"},
      {q:"Range starts at?", o:["0","1","-1","None"], a:"0"},
      {q:"Float is?", o:["Integer","Decimal","Character","None"], a:"Decimal"},
      {q:"Type of True?", o:["int","bool","string","float"], a:"bool"},
      {q:"Which creates function?", o:["fun","define","def","function"], a:"def"},
      {q:"Operator for power?", o:["^","**","~","@@"], a:"**"},
      {q:"Loop exit?", o:["stop","break","quit","halt"], a:"break"},
      {q:"Comment?", o:["//","#","/* */",";"], a:"#"},
      {q:"To install packages?", o:["pip","get","pkg","install"], a:"pip"},
      {q:"Modulus?", o:["/","%","*","//"], a:"%"}
    ],
    "HTML/CSS": [
      {q:"HTML stands for?", o:["Hyper Text Makeup Language","Hyper Text Markup Language","Home Text Markup Level","None"], a:"Hyper Text Markup Language"},
      {q:"CSS used for?", o:["Structure","Style","Logic","Database"], a:"Style"},
      {q:"To insert image?", o:["<pic>","<img>","<img src>","<image>"], a:"<img>"},
      {q:"Heading tag?", o:["<h>","<head>","<h1>","<heading>"], a:"<h1>"},
      {q:"CSS file extension?", o:[".cs",".css",".style",".html"], a:".css"},
      {q:"To make bold?", o:["<b>","<strong>","Both","None"], a:"Both"},
      {q:"Link tag?", o:["<a>","<link>","<href>","<ref>"], a:"<a>"},
      {q:"Center text?", o:["text-align","align","center","text-center"], a:"text-align"},
      {q:"Div is?", o:["Block","Inline","Table","None"], a:"Block"},
      {q:"To add CSS?", o:["style","class","css","inline"], a:"style"},
      {q:"Background color?", o:["bg","background","background-color","bgcolor"], a:"background-color"},
      {q:"Border is?", o:["line","box","border","rule"], a:"border"},
      {q:"Spacing inside box?", o:["padding","margin","gap","space"], a:"padding"},
      {q:"Spacing outside box?", o:["padding","margin","gap","outer"], a:"margin"},
      {q:"Display flex?", o:["flex","row","inline","box"], a:"flex"},
      {q:"Form tag?", o:["<forms>","<form>","<f>","None"], a:"<form>"},
      {q:"Break line?", o:["<br>","<break>","<line>","<brk>"], a:"<br>"},
      {q:"List type?", o:["ul","ol","None","All"], a:"All"},
      {q:"Table row?", o:["<tr>","<td>","<th>","<table>"], a:"<tr>"},
      {q:"CSS stands for?", o:["Cascading Style Sheets","Creative Style Set","Color Style Sheet","None"], a:"Cascading Style Sheets"}
    ]
  };

  /* ====== STATE ====== */
  let selectedTopic = 'Java';
  let bank = [];
  let batchStart = 0;
  let usedBatches = 0;
  let curQuestions = [];
  let curIndex = 0;
  let score = 0;
  let streak = 0;
  let timer = QUESTION_TIME;
  let timerId = null;
  let playerName = '';

  /* ====== UTIL ====== */
  function shuffle(arr){ for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; } }

  /* ====== UI SETUP ====== */
  topicBtns.forEach(btn=>{
    btn.addEventListener('click', ()=> {
      topicBtns.forEach(b=>b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedTopic = btn.dataset.topic;
    });
  });

  darkSwitch.addEventListener('change', ()=> document.body.classList.toggle('dark', darkSwitch.checked) );

  /* ====== BUBBLES BACKGROUND ====== */
  (function bubblesInit(){
    const canvas = document.getElementById('bubblesCanvas');
    const ctx = canvas.getContext && canvas.getContext('2d');
    if(!ctx) return;
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    const bubbles = [];
    const N = Math.floor(W/60) + 12;
    for(let i=0;i<N;i++){
      bubbles.push({
        x: Math.random()*W,
        y: Math.random()*H,
        r: 8 + Math.random()*36,
        speed: 0.2 + Math.random()*0.9,
        alpha: 0.15 + Math.random()*0.25,
        hue: 260 + Math.random()*60
      });
    }
    function draw(){
      ctx.clearRect(0,0,W,H);
      for(const b of bubbles){
        ctx.beginPath();
        ctx.fillStyle = `hsla(${b.hue},80%,80%,${b.alpha})`;
        ctx.shadowBlur = 20;
        ctx.shadowColor = `hsla(${b.hue},80%,80%,0.6)`;
        ctx.arc(b.x,b.y,b.r,0,Math.PI*2);
        ctx.fill();
        b.y -= b.speed;
        if(b.y < -50){ b.y = H + 60; b.x = Math.random()*W; }
      }
      requestAnimationFrame(draw);
    }
    draw();
    window.addEventListener('resize', ()=> { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; });
  })();

  /* ====== CONFETTI ====== */
  const confCanvas = document.getElementById('confettiCanvas');
  const cctx = confCanvas.getContext && confCanvas.getContext('2d');
  let confPieces = [], confAnim = null;
  function startConfetti(){
    if(!cctx) return;
    confCanvas.width = window.innerWidth; confCanvas.height = window.innerHeight;
    confPieces = [];
    const N = 160;
    for(let i=0;i<N;i++){
      confPieces.push({
        x: Math.random()*confCanvas.width,
        y: -Math.random()*confCanvas.height,
        w: 6 + Math.random()*16,
        h: 6 + Math.random()*12,
        speed: 2 + Math.random()*4,
        rot: Math.random()*360,
        spin: (Math.random()-0.5)*0.2,
        color: `hsl(${Math.random()*360},90%,60%)`,
        shape: Math.random()>.4? 'rect' : 'circle'
      });
    }
    (function render(){
      cctx.clearRect(0,0,confCanvas.width, confCanvas.height);
      confPieces.forEach(p=>{
        cctx.save(); cctx.translate(p.x,p.y); cctx.rotate(p.rot);
        cctx.fillStyle = p.color;
        if(p.shape==='rect') cctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);
        else { cctx.beginPath(); cctx.arc(0,0,p.w/2,0,Math.PI*2); cctx.fill(); }
        cctx.restore();
        p.y += p.speed;
        p.rot += p.spin;
        if(p.y > confCanvas.height + 20){ p.y = -40; p.x = Math.random()*confCanvas.width; }
      });
      confAnim = requestAnimationFrame(render);
    })();
    setTimeout(()=> stopConfetti(), 8000);
  }
  function stopConfetti(){ if(confAnim) cancelAnimationFrame(confAnim); if(cctx) cctx.clearRect(0,0,confCanvas.width, confCanvas.height); confPieces=[]; confAnim=null; }

  /* ====== GAME FLOW ====== */
  startBtn.addEventListener('click', ()=> {
    const name = (playerNameInput.value || '').trim();
    if(!name) { alert('Please enter your name'); return; }
    playerName = name;
    greeting.textContent = `Hi ${playerName} 👋`;
    bank = JSON.parse(JSON.stringify(BANK[selectedTopic] || BANK['Java']));
    shuffle(bank);
    batchStart = 0; usedBatches = 0;
    welcome.classList.remove('active'); quiz.classList.add('active');
    prepareBatchAndStart();
  });

  function prepareBatchAndStart(){
    if(bank.length < 20){
      while(bank.length < 20) bank = bank.concat(JSON.parse(JSON.stringify(bank)));
      bank = bank.slice(0,20);
    }
    curQuestions = bank.slice(batchStart, batchStart + Q_PER_PLAY);
    curIndex = 0; score = 0; streak = 0;
    timer = QUESTION_TIME; updateScore(); loadCurrent();
  }

  function loadCurrent(){
    answerFeedback.textContent = '';
    nextBtn.style.display = 'none'; nextBtn.setAttribute('aria-hidden','true');
    timer = QUESTION_TIME; timerEl.textContent = timer;
    const q = curQuestions[curIndex];
    questionText.style.opacity = 0; questionText.style.transform = 'translateY(8px)';
    setTimeout(()=>{
      questionText.textContent = q.q;
      questionText.style.opacity = 1; questionText.style.transform = 'translateY(0)';
      renderOptions(q);
      qCounter.textContent = `${curIndex+1}/${Q_PER_PLAY}`;
      progressFill.style.width = `${((curIndex)/Q_PER_PLAY)*100}%`;
      startTimer();
    },160);
  }

  function renderOptions(q){
    optionsGrid.innerHTML = '';
    const opts = [...q.o]; shuffle(opts);
    opts.forEach(opt=>{
      const b = document.createElement('div');
      b.className = 'optionBtn';
      b.textContent = opt;
      b.onclick = ()=> selectOption(b, q.a);
      optionsGrid.appendChild(b);
    });
  }

  function selectOption(btn, correct){
    Array.from(optionsGrid.children).forEach(x=> x.style.pointerEvents = 'none');
    clearInterval(timerId);
    const chosen = btn.textContent;
    if(chosen === correct){
      btn.classList.add('correct');
      answerFeedback.textContent = '😍 Correct! +5';
      safePlay(correctSnd);
      score += BASE_POINTS; streak += 1;
      if(streak > 1){ score += STREAK_BONUS; }
    } else {
      btn.classList.add('wrong');
      answerFeedback.textContent = '😕 Wrong!';
      safePlay(wrongSnd);
      streak = 0;
      Array.from(optionsGrid.children).forEach(x=> { if(x.textContent === correct) x.classList.add('correct'); });
    }
    updateScore();
    nextBtn.style.display = 'inline-block'; nextBtn.setAttribute('aria-hidden','false');
  }

  function updateScore(){ scoreLabel.textContent = `Score: ${score}`; }

  nextBtn.addEventListener('click', ()=> {
    curIndex++;
    if(curIndex >= Q_PER_PLAY){ endBatch(); }
    else { loadCurrent(); }
  });

  function startTimer(){
    clearInterval(timerId);
    timerId = setInterval(()=>{
      timer--;
      timerEl.textContent = timer;
      if(timer <= 0){ clearInterval(timerId); timeUp(); }
    },1000);
  }

  function timeUp(){
    Array.from(optionsGrid.children).forEach(x=> x.style.pointerEvents = 'none');
    answerFeedback.textContent = '⌛ Time up!';
    safePlay(wrongSnd);
    streak = 0;
    const correct = curQuestions[curIndex].a;
    Array.from(optionsGrid.children).forEach(x=>{ if(x.textContent === correct) x.classList.add('correct'); });
    nextBtn.style.display = 'inline-block'; nextBtn.setAttribute('aria-hidden','false');
  }

  function endBatch(){
    quiz.classList.remove('active');
    result.classList.add('active');
    finalScore.textContent = `Score: ${score}`;
    finalMsg.textContent = score>=Q_PER_PLAY*BASE_POINTS*0.7? "Awesome! 🎉":"Good Try! 😅";
    safePlay(celebrateSnd);
    startConfetti();
  }

  playAgainBtn.addEventListener('click', ()=> {
    result.classList.remove('active'); welcome.classList.add('active');
    playerNameInput.value = ''; topicBtns.forEach(b=> b.classList.remove('selected'));
    document.querySelector('.topic.selected').classList.add('selected');
  });

  viewBoardBtn.addEventListener('click', ()=> { leaderboard.classList.add('show'); renderLeaderboard(); });
  closeBoard.addEventListener('click', ()=> leaderboard.classList.remove('show'));
  clearBoard.addEventListener('click', ()=> { localStorage.removeItem('leaders'); renderLeaderboard(); });

  function renderLeaderboard(){
    leaderList.innerHTML = '';
    let leaders = JSON.parse(localStorage.getItem('leaders')||'[]');
    leaders.sort((a,b)=>b.score-a.score);
    leaders.forEach(p=>{
      const li = document.createElement('li');
      li.textContent = `${p.name} — ${p.score}`;
      leaderList.appendChild(li);
    });
  }
})();

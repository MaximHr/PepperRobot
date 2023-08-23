var session = new QiSession();
// function preloadImage(url)
// {
//     var img=new Image();
//     img.src=url;
// }

var whichLevel = 0;
const levels = [
  {
    name: 'Лейка', 
    // пейка и дърво
    mainImage: './images/leika-min.jpg',
    audio: './audio/12_waterincan.wav',
    answers: [
      {url: "./images/peika-min.jpg", correct:true, audio:'./audio/12_bench.wav'}, 
      {url: "./images/tree-min.png", correct:false, audio:'./audio/12_tree.wav'},
    ]
  }, {
    name: 'Зар', 
    // фар и книга
    mainImage: './images/dice-min.png',
    audio: './audio/28_dice.wav',
    answers: [
      {url: "./images/lighthouse-min.png", correct:true, audio:'./audio/28_lighthouse.wav'},
      {url: "./images/book-min.png", correct:false, audio:'./audio/28_book.wav'},
    ]
  }, {
    name: 'Птица', 
    // пица и сламка
    mainImage: './images/bird-min.png',
    audio: './audio/13_bird.wav',
    answers: [
      {url: "./images/pizza-min.png", correct:true, audio:'./audio/13_pizza.wav'}, 
      {url: "./images/straw-min.png", correct:false, audio:'./audio/13_straw.wav'},
    ]
  }, {
    name: 'Книга', 
    // верига и цвете
    mainImage: './images/book-min.png',
    audio: './audio/18_book.wav',
    answers: [
      {url: "./images/chain-min.png", correct:true, audio:'./audio/18_chain.wav'}, 
      {url: "./images/flower-min.png", correct:false, audio:'./audio/18_flower.wav'},
    ]
  }, {
    name: 'Самолет', 
    // билет и чанта
    mainImage: './images/plane-min.png',
    audio: './audio/19_plane.wav',
    answers: [
      {url: "./images/ticket-min.png", correct:true, audio:'./audio/19_ticket.wav'}, 
      {url: "./images/bag-min.png", correct:false, audio:'./audio/19_bag.wav'},
    ]
  },
];


  // for(var i = 0; i < levels.length;i++) {
  //   createButton(levels[i], i);
  //   // preloadImage(levels[i].mainImage);
  //   // for(var j = 0; j < levels[i].answers.length; j++){
  //   //     preloadImage(levels[i].answers[j]);
  //   // }
  // 

function shuffleArray(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}
function removePopup() {
  setTimeout(function() {
    document.body.removeChild(document.querySelector('.background'));
    document.body.removeChild(document.querySelector('.popup'));
    for(var i = 0;i < document.querySelectorAll('.option').length;i++) {
      document.querySelectorAll(`.option`)[i].style.border = '6px solid #ccc';
      document.querySelectorAll(`.option img`)[i].setAttribute('clicked', false);
    }
  });
};

function createPopup(innerHTML) {
  const background = document.createElement('div');
  background.setAttribute('class', 'background');
  const popup = document.createElement('div');
  popup.setAttribute('class', 'popup')
  popup.innerHTML = innerHTML;
  document.body.appendChild(background);
  document.body.appendChild(popup);
}

function goBack() {
  document.body.removeChild(document.querySelector('.container'));
  document.body.removeChild(document.querySelector('#backButton'));
  var btnContainer = document.createElement('div');
  btnContainer.className = 'button-container';
  btnContainer.id = 'buttonContainer';
  document.body.appendChild(btnContainer);
    for(var i = 0; i < levels.length;i++) {
      createButton(levels[i], i);
    }
}

function nextLevel() {
  removePopup();
  document.body.removeChild(document.querySelector('.container'))
  if(whichLevel == levels.length - 1) {
    clickHandler(levels[0])
  } else {
    clickHandler(levels[whichLevel + 1]);
  }
};

function answerHandler(i) {
  document.querySelector(`#img${i}`).setAttribute('clicked', true);
  var audio = new Audio(document.querySelector(`#img${i}`).getAttribute('audioFile'));
  audio.play();
  
  if(JSON.parse(document.querySelector(`#img${i}`).getAttribute('correct'))) {
    //correct answer 
    session.service("ALMemory").then(function (memory) {
      memory.raiseEvent("success","param1");
    });
    document.querySelectorAll('.option')[i].style.border = '6px solid rgb(88, 204, 2)';

    //check if all correct answers are clicked
    var correctandclicked = 0, correct = 0;
    for(var i = 0;i < document.querySelectorAll('.option').length;i++) {
      if(document.querySelectorAll('.option img')[i].getAttribute('correct') == 'true') {
        correct++;
      }
      if(document.querySelectorAll('.option img')[i].getAttribute('correct') == 'true' && document.querySelectorAll('.option img')[i].getAttribute('clicked') == 'true') {
        correctandclicked++;
      }
    }
    if(correct === correctandclicked) {
      createPopup(`
        <h1>Браво!</h1>
        <div class='popup-btns'>
          <button style='margin-right: 20px' id='try-again' onclick='removePopup(); goBack()'>Към меню</button>
          <button onClick='nextLevel()' style='margin-left: 20px'>Напред</button>
        </div>`);
    }
  } else {
    //wrong answer
    createPopup(`<h1>Грешен отговор</h1><button id='try-again' onclick='removePopup();'>Опитай пак</button>`);

    session.service("ALMemory").then(function (memory) {
      memory.raiseEvent("failure","param2");
    });
    document.querySelectorAll('.option')[i].style.border = '6px solid red';
  }
}
function clickHandler(level) {
  for(var i = 0;i < levels.length;i++) {
    if(levels[i].name == level.name) {
      whichLevel = i;
    }
  }
  var audio = new Audio(level.audio);
  audio.play();
  setTimeout(function() {
    var imagesHtml = '';
    shuffleArray(level.answers)
    for(var i = 0;i < level.answers.length;i++) {
      imagesHtml += ` <div class="option" onclick={answerHandler(${i})} >
      <img loading='eager' src=${level.answers[i].url} correct='${level.answers[i].correct}' audioFile='${level.answers[i].audio}' id='img${i}' alt="option ${i + 1}">
    </div>`
    }
    if(document.querySelector('.button-container') != null) {
      document.body.removeChild(document.querySelector('.button-container'));
    }
    const container = document.createElement('div');
    container.className = 'container';
    container.innerHTML = 
  `
    <h1 class='name'>${level.name}</h1>
    <div class='img-main'>
      <img  loading='eager' src=${level.mainImage} alt=${level.name}/>
    </div>
    <div style='display:flex;'>
    ${imagesHtml}
    </div>
  ` 
    if(document.querySelector('.back-button') == null) {
      const el = document.createElement('button');
      el.innerHTML = 'Назад';
      el.setAttribute('class', 'back-button');
      el.setAttribute('id', 'backButton');
      el.setAttribute('onclick', 'goBack()');
      document.body.appendChild(el);
    } 
    
    document.querySelector('.back-button').style.display = 'flex';
    document.body.appendChild(container);
  }, 250);
};

function createButton(level, i) {
  const el = document.createElement('button');
  el.setAttribute('class', 'button');
  el.innerHTML = level.name;
  el.style.animationDelay = i * 0.2 + 's';
  el.setAttribute('onclick', `clickHandler(${JSON.stringify(level)})`);
  document.querySelector('.button-container').appendChild(el);
}

session.socket().on('connect', function () {
  for(var i = 0; i < levels.length;i++) {
    createButton(levels[i], i);
  }
  session.service("ALMemory").then(function (memory) {
    memory.raiseEvent("menu","menu1");
  });
}).on('disconnect', function () {
  console.log('QiSession disconnected!');
});

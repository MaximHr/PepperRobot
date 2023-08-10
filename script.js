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
    images: [
      {url: "./images/peika-min.jpg", correct:true}, 
      {url: "./images/tree-min.png", correct:false},
    ]
  }, {
    name: 'Зар', 
    // фар и книга
    mainImage: './images/dice-min.png',
    images: [
      {url: "./images/lighthouse-min.png", correct:true},
      {url: "./images/book-min.png", correct:false},
    ]
  }, {
    name: 'Птица', 
    // пица и сламка
    mainImage: './images/bird-min.png',
    images: [
      {url: "./images/pizza-min.png", correct:true}, 
      {url: "./images/straw-min.png", correct:false},
    ]
  }, {
    name: 'Книга', 
    // верига и цвете
    mainImage: './images/book-min.png',
    images: [
      {url: "./images/chain-min.png", correct:true}, 
      {url: "./images/flower-min.png", correct:false},
    ]
  }, {
    name: 'Самолет', 
    // билет и чанта
    mainImage: './images/plane-min.png',
    images: [
      {url: "./images/ticket-min.png", correct:true}, 
      {url: "./images/bag-min.png", correct:false},
    ]
  },
];


  // for(var i = 0; i < levels.length;i++) {
    // createButton(levels[i], i);
    // preloadImage(levels[i].mainImage);
    // for(var j = 0; j < levels[i].images.length; j++){
    //     preloadImage(levels[i].images[j]);
    // }
  // }

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
          <button style='margin-right: 20px' id='try-again' onclick='removePopup(); location.reload()'>Към меню</button>
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
  setTimeout(function() {
    var imagesHtml = '';
    for(var i = 0;i < level.images.length;i++) {
      imagesHtml += ` <div class="option" onclick={answerHandler(${i})} >
      <img loading='eager' src=${level.images[i].url} correct='${level.images[i].correct}' id='img${i}' alt="option ${i + 1}">
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
}).on('disconnect', function () {
  console.log('QiSession disconnected!');
});

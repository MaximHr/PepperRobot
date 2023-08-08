// var host = '192.168.0.103';
// var session = new QiSession();


// function disconnected() {
//   console.log('disconnected');
// }
// QiSession(function(session) {
//   for(var i = 0; i < levels.length;i++) {
//     createButton(levels[i]);
//   }
// }, disconnected, host);

const levels = [
  {
    name: 'Лейка', 
    mainImage: 'https://roto.bg/wp-content/uploads/2021/08/%D0%9B%D0%B5%D0%B9%D0%BA%D0%B0-12-%D0%BB%D0%B8%D1%82%D1%80%D0%B0-%D0%B7%D0%B0-%D0%BF%D0%BE%D0%BB%D0%B8%D0%B2%D0%B0%D0%BD%D0%B5-%D0%BD%D0%B0-%D1%86%D0%B2%D0%B5%D1%82%D1%8F-%D1%80%D0%B0%D1%81%D1%82%D0%B5%D0%BD%D0%B8%D1%8F-%D0%B8-%D0%B3%D1%80%D0%B0%D0%B4%D0%B8%D0%BD%D0%B0%D1%82%D0%B0.jpg',
    images: [
      {url: "https://www.artpark.bg/images/stories/virtuemart/product/peika-ot-darvo-i-chugun6.jpg", correct:true}, 
      {url: "https://freepngimg.com/thumb/tree/5-2-tree-free-download-png.png", correct:false},
    ]
  },
  {name: 'Stepan', images: [{url: "https://www.varriosport.bg/media/6/32521.jpg", correct:true}, 
  {url: "https://www.varriosport.bg/media/6/32521.jpg", correct:false}]}
];

for(var i = 0; i < levels.length;i++) {
   createButton(levels[i]);
}

function removePopup() {
  setTimeout(function() {
    document.body.removeChild(document.querySelector('.background'));
    document.body.removeChild(document.querySelector('.popup'));
    for(var i = 0;i < document.querySelectorAll('.option').length;i++) {
      document.querySelectorAll(`.option`)[i].style.border = '6px solid #ccc';
      document.querySelectorAll(`.option img`)[i].setAttribute('clicked', false);
    }
  }, 250);
};
function goBack() {
  document.body.removeChild(document.querySelector('.container'));
  document.body.appendChild(document.querySelector('.button-container'));
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


function answerHandler(i) {
  document.querySelector(`#img${i}`).setAttribute('clicked', true);
  if(JSON.parse(document.querySelector(`#img${i}`).getAttribute('correct'))) {
    //correct answer 
    // session.service("ALMemory").then(function (memory) {
    //   memory.raiseEvent("success","param1");
    // });
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
      createPopup(`<h1>Браво!</h1><button id='try-again' onclick='removePopup();goBack();'>Играй отново</button>`);
    }
  } else {
    //wrong answer
    createPopup(`<h1>Грешен отговор</h1><button id='try-again' onclick='removePopup();'>Опитай пак</button>`);

    // session.service("ALMemory").then(function (memory) {
    //   memory.raiseEvent("failure","param2");
    // });
    document.querySelectorAll('.option')[i].style.border = '6px solid red';
  }
}
function clickHandler(level) {
  setTimeout(function() {
    var imagesHtml = '';
    for(var i = 0;i < level.images.length;i++) {
      imagesHtml += ` <div class="option" onclick={answerHandler(${i})} >
      <img src=${level.images[i].url} correct='${level.images[i].correct}' id='img${i}' alt="option ${i + 1}">
    </div>`
    }
    document.body.removeChild(document.querySelector('.button-container'));
    const container = document.createElement('div');
    container.className = 'container';
    container.innerHTML = 
  `
    <h1 class='name'>${level.name}</h1>
    <div class='img-main'>
      <img src=${level.mainImage} alt=${level.name}/>
    </div>
    <div style='display:flex;'>
    ${imagesHtml}
    </div>
  ` 
  
    document.body.appendChild(container);
  }, 250);
};

function createButton(level) {
  
  const el = document.createElement('button');
  el.setAttribute('class', 'button');
  el.innerHTML = level.name;
  el.setAttribute('onclick', `clickHandler(${JSON.stringify(level)})`);
  document.querySelector('.button-container').appendChild(el);
}



// session.socket().on('connect', function () {

//   for(var i = 0; i < levels.length;i++) {
//     document.querySelector('#textField').style.display = 'block';
//     createButton(levels[i]);
//   }

//   // session.service("ALTextToSpeech").then(function (tts) {
    
//   //   tts.say('Hello! Choose a word.');
//   // }, function (error) {
//   //   console.log("An error occurred:", error);
//   // });
//   // var animation_player_service = session.service("ALRobotPosture")
//   // animation_player_service.goToPosture("Crouch", 1.0);
  

  
// }).on('disconnect', function () {
//   console.log('QiSession disconnected!');
// });

// function launchEvent(){
//   session.service("ALMemory").then(function (memory) {
//     memory.raiseEvent("event1","param1");
//   });
// }

// function btn1Handler() {
//   // session.service("ALTextToSpeech").then(function (tts) {
//   //   // tts is a proxy to the ALTextToSpeech service
//   //   tts.say('one');
//   // }, function (error) {
//   //   console.log("An error occurred:", error);
//   // });
//   // launchEvent();

  
//   session.service("ALMemory").then(function (memory) {
//     memory.raiseEvent("event1","param1");
//   });
// }

// function btn2Handler() {
//   session.service("ALTextToSpeech").then(function (tts) {
//     // tts is a proxy to the ALTextToSpeech service
//     tts.say('two');
//   }, function (error) {
//     console.log("An error occurred:", error);
//   });
// }

// function btn3Handler() {
//   session.service("ALTextToSpeech").then(function (tts) {
//     // tts is a proxy to the ALTextToSpeech service
//     tts.say('three');
//   }, function (error) {
//     console.log("An error occurred:", error);
//   });

// }

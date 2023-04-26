let game_area = $(".game");

var time = 0;

const gameboard = document.getElementById("gameboard");

let score = 0;
var blockColors = ["red", "green", "blue", "yellow", "purple"];
var blocks = new Map();
let currentBlock = null;
let currentX = 0;
let currentY = 0;
let interval = null;

$(document).ready(function () {
  $("#start_game_btn").click(function () {
    $(".main_container").fadeOut(700);
    $(".game").fadeIn(700);
  });

  // Játék inicializálása

  game_area.hide();

  mapFeltolt();
  spawnCharacter();
  drawBoard();
  timer();

  console.log(blocks);

  document.addEventListener("keydown", moveBox);

  /* blocks.forEach(function(element){
    console.log(element, element.style.top);
  });*/

  function spawnCharacter() {
    let character = document.createElement("img");
    character.src = "male/Walk (5).png";
    character.style.position = "absolute";
    character.style.left = "0";
    character.style.bottom = "0";
    character.style.width = "130px";
    character.style.height = "130px";
    character.setAttribute("id", "character");
    gameboard.appendChild(character);
  }

  function timer() {
    let progress = 0;
    const progressBar = document.querySelector(".progress-bar");
    setInterval(function () {
      progress++;
      if (progress > 10) {
        progress = 0;
      }
      time += 1;
      progressBar.style.width = progress * 10 + "%";
    }, 1000);
  }

  function mapFeltolt() {
    for (var i = 0; i < 13; i++) {
      var key = i;
      var value = [];
      for (var j = 0; j < 5; j++) {
        const block = document.createElement("div");
        block.classList.add("block");
        randomColor =
          blockColors[Math.floor(Math.random() * blockColors.length)];
        block.style.backgroundColor = randomColor;
        value.push(block);
      }
      blocks.set(key, value);
    }
  }

  function moveBox(event) {
    var box = document.getElementById("character");
    var boxWidth = box.offsetWidth;
    // var boxHeight = box.offsetHeight;
    var boxLeft = parseInt(box.style.left);
    switch (event.key) {
      case "ArrowUp":
        // box.style.top = Math.max(boxTop - boxHeight, 0) + "px";
        break;
      case "ArrowLeft":
        box.style.left = Math.max(boxLeft - boxWidth, 0) + "px";
        break;
      case "ArrowRight":
        box.style.left =
          Math.min(boxLeft + boxWidth, window.innerWidth - boxWidth) + "px";
        break;
    }
  }

  function drawBoard() {
    const table = document.createElement('table');
    for (let i = 0; i < 5; i++) {
      const tr = document.createElement('tr');
      for (let j = 0; j < 13; j++) {
        const td = document.createElement('td');
        const block = blocks.get(j)[i]; // megkapjuk a blokkot a Map-ből
        td.append(block);
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }
    
    // hozzáadjuk a táblázatot a DOM-hoz
    gameboard.appendChild(table);
  }
});

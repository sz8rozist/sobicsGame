let game_area = $(".game");

var time = 0;

const gameboard = document.getElementById("gameboard");
const character_container = document.getElementById("character_container");

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

  console.log(blocks);

  //document.addEventListener("keydown", moveBox);

  /* blocks.forEach(function(element){
    console.log(element, element.style.top);
  });*/

  /* Amikor az egér mozog, a kódban számítódik a deltaX értéke, amely meghatározza a child elem mozgatásának mértékét a balra és jobbra mozgatás során. Ezután kiszámítjuk a child elem új pozícióját a parent elemen belül, figyelembe véve, hogy ne lépje túl a parent elem határait */
  $("#game_container").on("mousemove", function (event) {
    var deltaX = event.pageX - currentX;
    var newPosition = $("#character_container").position().left + deltaX;

    if (newPosition < 0) {
      newPosition = 0;
    } else if (
      newPosition >
      $(this).width() - $("#character_container").width()
    ) {
      newPosition = $(this).width() - $("#character_container").width();
    }

    $("#character_container").css("left", newPosition);
    currentX = event.pageX;
  });

  $("#game_container").click(function (event) {
    var parentPosition = $(this).position().left; // Parent div pozíciója az oldal bal szélétől
    var clickPosition = event.pageX - parentPosition; // A kattintás pozíciója az X tengelyen a parent div-en belül

    var columnNumber = Math.floor(clickPosition / 209.3); // Az oszlop számának meghatározása a kattintás pozíciója alapján

    removeBlock(columnNumber);
    console.log("Column number: " + columnNumber);
  });

  function removeBlock(columnNumber) {
    var kezben_levo_blokk = $("#kezben_levo_blokk");
    var column = blocks.get(columnNumber);
    console.log(column);
    if (kezben_levo_blokk.hasClass("hide")) {
      var popped = column.pop();
      //console.log(popped.style.backgroundColor);
      //console.log(blocks);

      $("#kezben_levo_blokk").removeClass("hide");
      $("#kezben_levo_blokk").css(
        "background-color",
        popped.style.backgroundColor
      );
      drawBoard();
      return;
    }
    console.log("Van kézben");
    var new_block = document.createElement("div");
    new_block.classList.add("block");
    new_block.style.backgroundColor = kezben_levo_blokk.css("background-color");
    var pushed = column.push(new_block);
    kezben_levo_blokk.addClass("hide");
    kezben_levo_blokk.css("background-color", "");
    // console.log(column);
    //  console.log(blocks);
    drawBoard();
  }

  function spawnCharacter() {
    let character = document.createElement("img");
    character.src = "male/Walk (5).png";
    character.style.width = "160px";
    character.style.height = "160px";
    character.setAttribute("id", "character");
    character_container.appendChild(character);
  }

  /*function timer() {
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
  }*/

  function mapFeltolt() {
    for (var i = 0; i < 9; i++) {
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

  function drawBoard() {
    if (gameboard.hasChildNodes()) {
      gameboard.textContent = "";
    }
    let blockCount = 0;
    blocks.forEach((column) => (blockCount += column.length));
    for (let i = 0; i < 16; i++) {
      for (let j = 0; j < 9; j++) {
        const block = blocks.get(j)[i]; // megkapjuk a blokkot a Map-ből
        //console.log(block);
        if (block == undefined) {
          const removed = document.createElement("div");
          //var text = document.createTextNode("");
          removed.classList.add("block");
          // removed.appendChild(text);
          gameboard.appendChild(removed);
        } else {
          gameboard.appendChild(block);
        }
      }
    }
  }
});

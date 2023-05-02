var currentX = 0;
const gameboard = document.getElementById("gameboard");
const character_container = document.getElementById("character_container");
const scoreEl = document.querySelector("#score");
var playerName = "";
var audio = new Audio("bubble.mp3");
/* RED, GREEN, BLUE, YELLOW, PURPLE */
var blockColors = [
  "rgb(255, 0, 0)",
  "rgb(0, 128, 0)",
  "rgb(0, 0, 255)",
  "rgb(255, 255, 0)",
  "rgb(128, 0, 128)",
];
var blocks = new Map();
var topList = [];
var myAudio = document.getElementById("myAudio");
myAudio.volume = 0.2;
var isPlaying = false;
var level = 1;
var progressRange = 20;
var pontszam = [8000, 16000, 20000];

function togglePlay() {
  isPlaying ? myAudio.pause() : myAudio.play();
}

myAudio.onplaying = function () {
  isPlaying = true;
};
myAudio.onpause = function () {
  isPlaying = false;
};
$(document).ready(function () {
  $("#dialog").dialog({
    autoOpen: true,
    show: {
      effect: "blind",
      duration: 1000,
    },
    hide: {
      effect: "explode",
      duration: 1000,
    },
    resizable: false,
    buttons: {
      "Játék kezdése": function () {
        startGame();
        myAudio.play();
        $(this).dialog("close");
      },
      Mégse: function () {
        $(this).dialog("close");
      },
    },
  });
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
    var columnNumber = Math.floor(clickPosition / 96); // Az oszlop számának meghatározása a kattintás pozíciója alapján
    removeBlock(columnNumber);
  });

  function removeBlock(columnNumber) {
    var kezben_levo_blokk = $("#kezben_levo_blokk");
    var column = blocks.get(columnNumber);
    if (kezben_levo_blokk.hasClass("hide")) {
      var popped = column.pop();
      audio.play();
      //console.log(popped.style.backgroundColor);
      //console.log(blocks);
      kezben_levo_blokk.removeClass("hide");
      kezben_levo_blokk.css("background-color", popped.style.backgroundColor);
      setTimeout(() => kezben_levo_blokk.addClass("show"), 5000);
      drawBoard();
      return;
    }
    var new_block = document.createElement("div");
    new_block.classList.add("block");
    new_block.style.backgroundColor = kezben_levo_blokk.css("background-color");
    column.push(new_block);
    kezben_levo_blokk.addClass("hide");
    kezben_levo_blokk.css("background-color", "");
    audio.play();
    //var neighbour = checkNeightbourColumn(columnNumber, new_block.style.backgroundColor);
    //removeBlockFromMap(neighbour, columnNumber);
    let legutoljaraBeszurtIndex = blocks.get(columnNumber).length - 1;
    let legutoljaraBeszurt = blocks
      .get(columnNumber)
      .at(legutoljaraBeszurtIndex);
    // console.log(legutoljaraBeszurt);
    //console.log(columnNumber, legutoljaraBeszurtIndex);
    let removeBlocks = new Map();
    var count = 0;
    for (const [key, value] of blocks.entries()) {
      if (key == columnNumber) {
        for (let i = value.length - 1; i >= 0; i--) {
          if (
            value[i].style.backgroundColor !=
            value[legutoljaraBeszurtIndex].style.backgroundColor
          ) {
            break;
          }
          count++;
          removeBlocks.set(key, []);
          //Azt a blokkot amit fellövünk ne számolja bele.
          if (value[i] != value[legutoljaraBeszurtIndex]) {
            removeBlocks.get(key).push(value[i]);
          }
        }
      }
      if (key == columnNumber - 1) {
        for (let i = value.length - 1; i >= 0; i--) {
          if (
            value[i].style.backgroundColor !=
            legutoljaraBeszurt.style.backgroundColor
          ) {
            break;
          }
          count++;
          if (removeBlocks.has(key)) {
            removeBlocks.get(key).push(value[i]);
          } else {
            removeBlocks.set(key, [value[i]]);
          }
        }
      }
      if (key == columnNumber + 1) {
        for (let i = value.length - 1; i >= 0; i--) {
          if (
            value[i].style.backgroundColor !=
            legutoljaraBeszurt.style.backgroundColor
          ) {
            break;
          }
          count++;
          if (removeBlocks.has(key)) {
            removeBlocks.get(key).push(value[i]);
          } else {
            removeBlocks.set(key, [value[i]]);
          }
        }
      }
    }
    if (count >= 4) {
      showScore(count * 1000);
      for (const [key, value] of removeBlocks.entries()) {
        //console.log(key, value);
        for (let i = 0; i < value.length; i++) {
          console.log(value[i]);
          let blocksArray = blocks.get(key);
          blocksArray = blocksArray.filter(
            (elem) =>
              elem.style.backgroundColor != value[i].style.backgroundColor
          );
          blocks.set(key, blocksArray);
        }
      }
    }
    drawBoard();
  }

  function timer() {
    var progressLabel = $(".progress-label"),
      progressbar = $("#progressbar");
    let progress = 0;
    setInterval(function () {
      progress++;
      if (parseInt(scoreEl.innerHTML) == pontszam[level - 1]) {
        level++;
        progressRange -= 5;
      }
      console.log(parseInt(scoreEl.innerHTML));
      if (progress > progressRange) {
        progress = 0;
        //randomBlock();
        drawBoard();
      }
      progressbar.progressbar({
        value: progress,
        max: progressRange,
        change: function () {
          progressLabel.text(progress);
        },
      });
      if (gameOver()) {
        $("#game_over_dialog").dialog({
          autoOpen: true,
          show: {
            effect: "blind",
            duration: 1000,
          },
          hide: {
            effect: "explode",
            duration: 1000,
          },
          resizable: false,
          buttons: {
            "Top lista": function () {
              $("#game_over_content").html(
                "A játék véget ért kedves " +
                  playerName +
                  ", összesen " +
                  score +
                  " pontot gyűjtöttél"
              );
              topList.push({ name: playerName, score: score });
              console.log(topList);
              localStorage.setItem("toplist", JSON.stringify(topList));
              $(this).dialog("close");
            },
            "Játék újrakezdése": function () {
              location.reload();
            },
          },
        });
        return;
      }
    }, 1000);
  }

  function mapFeltolt() {
    for (var i = 0; i < 10; i++) {
      var value = [];
      for (var j = 0; j < 5; j++) {
        const block = document.createElement("div");
        block.classList.add("block");
        randomColor =
          blockColors[Math.floor(Math.random() * blockColors.length)];
        block.style.backgroundColor = randomColor;
        value.push(block);
      }
      blocks.set(i, value);
    }

    let character = document.createElement("img");
    character.src = "male/Walk (5).png";
    character.style.width = "100px";
    character.style.height = "100px";
    character.setAttribute("id", "character");
    character_container.appendChild(character);

    setTimeout(() => {
      character_container.style.opacity = 1;
    }, 1000);
  }

  function drawBoard() {
    if (gameboard.hasChildNodes()) {
      gameboard.textContent = "";
    }
    for (let i = 0; i < 16; i++) {
      for (let j = 0; j < 10; j++) {
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
          setTimeout(() => block.classList.add("animate"), 150);
        }
      }
    }
  }

  function randomBlock() {
    for (let i = 0; i < 16; i++) {
      for (let j = 0; j < 10; j++) {
        const block = document.createElement("div");
        block.classList.add("block");
        randomColor =
          blockColors[Math.floor(Math.random() * blockColors.length)];
        block.style.backgroundColor = randomColor;
        blocks.get(j).unshift(block);
        setTimeout(() => block.classList.add("animate"), 150);
        if (j == 9) return;
      }
    }
  }

  function gameOver() {
    for (let i = 0; i < 16; i++) {
      for (let j = 0; j < 10; j++) {
        if (blocks.get(j).length == 16) {
          return true;
        }
      }
    }
    return false;
  }

  function startGame() {
    if ($("#name").val() == "") {
      return;
    }
    playerName = $("#name").val();
    mapFeltolt();
    drawBoard();
    $("#progressbar").addClass("animate");
    timer();
  }

  function showScore(score) {
    scoreEl.textContent = score;
    let sc = parseInt($(".score").html());
    sc += score;
    $(".score").html(sc);
    scoreEl.classList.add("show");
    scoreEl.classList.remove("hide");
    setTimeout(hideScore, 1000);
  }

  function hideScore() {
    scoreEl.classList.add("hide");
    scoreEl.classList.remove("show");
  }
});

/*
 * Created on Fri Jun 03 2022 09:29:34
 *
 * Copyright (c) 2022 Simon Vander Linden
 */

const btnEl = document.getElementById("startButton");
const btnPlayEl = document.getElementById("play");
const btnResetEl = document.getElementById("reset");
const btnStopEl = document.getElementById("stop");
const btnAddUserEl = document.getElementById("addUser");
const starterContainerEl = document.getElementById("starterContainer");
const containerUserEl = document.getElementById("containerUser");
const listUserEl = document.getElementById("listUser");
const WinMessageEl = document.getElementById("WinMessage");

const btnElectionEl = document.getElementById("election");
const btnClassementEl = document.getElementById("classement");
const messageUserEl = document.getElementById("messageWarning");

let users = [];
let usersTemp = [];
let usersLength = [];
let gameSelect = 0;
let classementIndex = 0;
let minUser = 2;
let time = 2;
let limitTime = 350;
let counterLoopAnimation = 0;
let catchUser = "catchUser";
let userChoosed = null;
let intervalChoosed;

listUserEl.style.display = "none";
listUserEl.style.opacity = 0;

btnDisabled();
checker(false);

document.addEventListener("DOMContentLoaded", function () {
  btnEl.addEventListener("click", function () {
    loadGame();
  });

  btnElectionEl.addEventListener("click", function () {
    selectGame(1);
  });

  btnClassementEl.addEventListener("click", function () {
    selectGame(2);
  });

  btnAddUserEl.addEventListener("click", function () {
    addUser();
  });

  btnPlayEl.addEventListener("click", function () {
    //check des btn
    checker();
  });

  btnResetEl.addEventListener("click", function () {
    reset();
  });

  btnStopEl.addEventListener("click", function () {
    stopGame();
  });
});

function selectGame(game) {
  const h1MessageEl = document.createElement("h1");
  switch (game) {
    case 1:
      gameSelect = 1;
      minUser = 2;
      btnAddUserEl.disabled = false;
      btnAddUserEl.classList.add("btn", "btn-green");
      h1MessageEl.textContent = "Insérez au moins deux joueurs pour débuter";
      messageUserEl.textContent = "";
      messageUserEl.appendChild(h1MessageEl);
      break;

    case 2:
      gameSelect = 2;
      minUser = 3;
      btnAddUserEl.disabled = false;
      btnAddUserEl.classList.add("btn", "btn-green");
      h1MessageEl.textContent = "Insérez au moins trois joueurs pour débuter";
      messageUserEl.textContent = "";
      messageUserEl.appendChild(h1MessageEl);
      break;
  }
}

// Add User
function addUser() {
  let name = userName();

  if (name != null) {
    users.push({ name: name });
    usersTemp.push({ name: name });
    usersLength = users.length;

    const articleEl = document.createElement("article");
    articleEl.classList.add("card");
    articleEl.id = name;

    const divEl = document.createElement("div");
    divEl.classList.add("content");

    const titleEl = document.createElement("h4");
    const nameEl = document.createTextNode(name);

    const btnRemoveEl = document.createElement("button");
    const btnRemoveValue = document.createTextNode("-");
    btnRemoveEl.classList.add("btn", "btn-red");

    // btnRemoveEl.addEventListener("click", removeUser(name));
    btnRemoveEl.onclick = () => {
      removeUser(name);
    };

    containerUserEl.appendChild(articleEl);
    articleEl.appendChild(divEl);
    btnRemoveEl.appendChild(btnRemoveValue);
    divEl.appendChild(titleEl);
    divEl.appendChild(btnRemoveEl);
    titleEl.appendChild(nameEl);
  }
  checker(false);
}

// Prompt + regex Name + nb
function userName() {
  let regex =
    /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/;
  let name;

  do {
    name = prompt(
      `Nom du nouveau joueur.\nLes caractères spéciaux ne sont pas admis`
    );

    name = name.trim();

    // multi user
    if (name.match(regex)) {
      let nbUser = 1;
      let str = 2;

      users.forEach((e) => {
        switch (nbUser) {
          case 10:
            str = 3;
            break;
          case 100:
            str = 4;
            break;
          case 1000:
            str = 5;
            break;
        }
        if (name.toLowerCase() == e.name.substring(str).toLowerCase()) {
          nbUser++;
        }
      });
      name = nbUser + " " + name;
      break;
    }
  } while (!name.match(regex));

  return name;
}

function loadGame() {
  starterContainerEl.style.opacity = 0;
  starterContainerEl.style.display = "none";

  listUserEl.style.display = null;
  listUserEl.style.opacity = null;
}

// check btn for begin game
function checker(wantToPlay = true) {
  if (users.length >= minUser) {
    btnPlayEl.disabled = false;
    btnPlayEl.classList.add("btn", "btn-red");
  } else {
    btnPlayEl.removeAttribute("class");
    btnPlayEl.disabled = true;

    if (gameSelect == 0) {
      btnAddUserEl.disabled = true;
      btnAddUserEl.removeAttribute("class");
    }
  }

  if (wantToPlay && !btnPlayEl.disabled) {
    beginTheGame();
  }
}

// begin game --> disabled all btn
function beginTheGame() {
  const allBtn = document.querySelectorAll("button");
  btnAddUserEl.style.display = "none";
  btnAddUserEl.disabled = true;

  btnResetEl.style.display = null;
  btnStopEl.style.display = null;

  for (let i = 0; i < allBtn.length; i++) {
    allBtn[i].classList.remove("btn", "btn-red", "btn-green");
    allBtn[i].disabled = true;
  }
  if (gameSelect === 1) {
    choosingUser();
  } else if (gameSelect === 2) {
    choosingMultiUser();
  }
}

// time addition
function addTime() {
  return (time = time * 1.1);
}

function choosingMultiUser() {
  const userAlreadySelected = document.getElementsByClassName(catchUser);

  if (userAlreadySelected[0] != undefined) {
    userAlreadySelected[0].classList.remove(catchUser);
  }

  let nbIndex = Math.floor(Math.random() * usersTemp.length);
  const userSelected = usersTemp[nbIndex].name;
  const articleSelected = document.getElementById(userSelected);
  articleSelected.classList.add(catchUser);

  console.log(usersTemp.length);
  if (usersTemp.length != 1) {
    if (time > limitTime) {
      userChoosed = userSelected;
      intervalChoosed = setInterval(animateUser, 500);
    } else {
      setTimeout(choosingMultiUser, addTime());
    }
  } else {
    const trophyEl = new Image(60, 80);
    trophyEl.src = "../img/Trophy_gold.png";
    articleSelected.children[0].appendChild(trophyEl);

    btnElectionEl.removeAttribute("disabled");

    btnClassementEl.removeAttribute("disabled");

    btnResetEl.removeAttribute("disabled");
    btnResetEl.classList.add("btn", "btn-green");

    btnStopEl.removeAttribute("disabled");
    btnStopEl.classList.add("btn", "btn-red");
  }
}

//random User
function choosingUser() {
  const userAlreadySelected = document.getElementsByClassName(catchUser);

  if (userAlreadySelected[0] != undefined) {
    userAlreadySelected[0].classList.remove(catchUser);
  }

  let nbIndex = Math.floor(Math.random() * users.length);
  const userSelected = users[nbIndex].name;
  const articleSelected = document.getElementById(userSelected);
  articleSelected.classList.add(catchUser);

  if (time > limitTime) {
    userChoosed = userSelected;
    intervalChoosed = setInterval(animateUser, 500);
  } else {
    setTimeout(choosingUser, addTime());
  }
}

//animation carrousel
function animateUser() {
  const userSelected = document.getElementById(userChoosed);
  let classOfUser;
  switch (gameSelect) {
    case 1:
      classOfUser = document.getElementsByClassName(catchUser);
      if (counterLoopAnimation < 6) {
        if (classOfUser[0] != undefined) {
          userSelected.classList.remove(catchUser);
        } else {
          userSelected.classList.add(catchUser);
        }

        counterLoopAnimation++;
      } else {
        clearInterval(intervalChoosed);
        btnElectionEl.removeAttribute("disabled");
        btnClassementEl.removeAttribute("disabled");

        btnResetEl.removeAttribute("disabled");
        btnResetEl.classList.add("btn", "btn-green");

        btnStopEl.removeAttribute("disabled");
        btnStopEl.classList.add("btn", "btn-red");

        const titleWinnerEl = document.createElement("h3");
        titleWinnerEl.classList.add("RightToLeft");
        titleWinnerEl.textContent = `Félicitation ${userChoosed}, tu es l'élu!!`;
        WinMessageEl.append(titleWinnerEl);
      }
      break;
    case 2:
      classOfUser = document.getElementsByClassName(catchUser);
      if (counterLoopAnimation < 4) {
        if (classOfUser[0] != undefined) {
          userSelected.classList.remove(catchUser);
        } else {
          userSelected.classList.add(catchUser);
        }

        counterLoopAnimation++;
      } else {
        clearInterval(intervalChoosed);

        userSelected.classList.add("catchUserMulti");

        indexUser = usersTemp
          .map(function (e) {
            return e.name;
          })
          .indexOf(userChoosed);

        usersTemp.splice(indexUser, 1);

        let nbClassement = usersLength - classementIndex;
        let trophyEl;

        switch (nbClassement) {
          case 2:
            trophyEl = new Image(60, 80);
            trophyEl.src = "../img/Trophy_silver.png";
            userSelected.children[0].appendChild(trophyEl);
            break;
          case 3:
            trophyEl = new Image(60, 80);
            trophyEl.src = "../img/Trophy_bronze.png";
            userSelected.children[0].appendChild(trophyEl);
            break;
          default:
            nbEl = document.createElement("span");
            nbEl.textContent = "numéro :" + nbClassement;
            userSelected.children[0].appendChild(nbEl);
            break;
        }
        classementIndex++;

        counterLoopAnimation = 0;
        time = 2;

        choosingMultiUser();
      }
      break;
  }
}

//remove User
function removeUser(userName) {
  const articleEl = document.getElementById(userName);
  articleEl.remove();
  for (let i = 0; i < users.length; i++) {
    if (users[i].name == userName) {
      users.splice(i, 1);
      break;
    }
    checker(false);
  }
}

//disabled btn Reset and Stop

function btnDisabled() {
  btnResetEl.classList.remove("btn", "btn-red");
  btnResetEl.style.disabled = true;
  btnResetEl.style.display = "none";

  btnStopEl.classList.remove("btn", "btn-red");
  btnStopEl.style.disabled = true;
  btnStopEl.style.display = "none";
}

function reset() {
  resetGame();
  checker();
}

function resetGame() {
  const userAlreadySelected = document.getElementsByClassName(catchUser);
  const messageAnimated = document.getElementsByClassName("RightToLeft");

  if (userAlreadySelected[0] != undefined) {
    userAlreadySelected[0].classList.remove(catchUser);
  }

  if (messageAnimated[0] != undefined) {
    messageAnimated[0].remove();
  }

  if (gameSelect === 2) {
    usersTemp = [];
    for (let i = 0; i < users.length; i++) {
      usersTemp.push({ name: users[i].name });
    }
    classementIndex = 0;
    const catchUserMultiRemover = document.querySelectorAll(".card");
    const removeReward = document.getElementsByClassName("content");

    catchUserMultiRemover.forEach((el) =>
      el.classList.remove("catchUserMulti")
    );

    for (let i = 0; i < removeReward.length; i++) {
      console.log(removeReward[i].lastChild);
      removeReward[i].lastChild.remove();
    }
  }
  counterLoopAnimation = 0;
  time = 2;
  userChoosed = null;
}

function stopGame() {
  resetGame();
  btnAddUserEl.style.display = null;
  btnAddUserEl.classList.add("btn", "btn-green");
  btnAddUserEl.removeAttribute("disabled");
  btnPlayEl.classList.add("btn", "btn-red");
  btnPlayEl.removeAttribute("disabled");

  disableRetryAndStop();

  const allBtn = document.querySelectorAll("article button");
  for (let i = 0; i < allBtn.length; i++) {
    allBtn[i].classList.add("btn", "btn-red");
    allBtn[i].removeAttribute("disabled");
  }
}

function disableRetryAndStop() {
  btnResetEl.classList.remove("btn", "btn-red");
  btnResetEl.style.disabled = true;
  btnResetEl.style.display = "none";

  btnStopEl.classList.remove("btn", "btn-red");
  btnStopEl.style.disabled = true;
  btnStopEl.style.display = "none";
}

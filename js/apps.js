/*
 * Created on Fri Jun 03 2022 09:29:34
 *
 * Copyright (c) 2022 Simon Vander Linden
 */
// const elecEl = document.getElementById("election");
// const box = document.getElementById("box");
// const btn = document.getElementById("start");

// function start() {
//   box.parentNode.removeChild(box);
//   buttonAdd();
// }

// box.addEventListener("click", start);

// function buttonAdd() {
//   const btnAdd = document.createElement("button");
//   const btnContent = document.createTextNode("+");
//   btnAdd.classList.add("btn", "btn-primary", "btn-green");
//   btnAdd.setAttribute("id", "btnAdd");
//   btnAdd.appendChild(btnContent);
//   elecEl.appendChild(btnAdd);
// }

// function addUser() {
//     console.log('rr');
//   prompt("Ajouter un joueur");
// }

// // const btnAdd = document.getElementById("btnAdd");
// // do {

// // } while (!btnAdd);
// // btnAdd.addEventListener("click", addUser);

const boxEl = document.getElementById("box");
const btnEl = document.getElementById("start");

function remove() {
  // remove element
  boxEl.textContent = "";

  //btn add
  let btnAddEl = document.createElement("button");
  const iEl = document.createElement("i");

  btnAddEl.classList.add("btn", "btn-primary");
  btnAddEl.setAttribute("id", "btnAdd");

  iEl.classList.add("fa-duotone", "fa-plus");

  btnAddEl.appendChild(iEl);
  boxEl.appendChild(btnAddEl);
  boxEl.removeEventListener("click", remove);

  // add listen for addUser
  btnAddEl = document.getElementById("btnAdd");
  btnAddEl.addEventListener("click", addUser);

  //
}

boxEl.addEventListener("click", remove);

// add User

const users = [];

function addUser() {
  const user = prompt("Add User");
//   let nb = 0;

//   for (let i = 0; i < users.length; i++) {
//     if (users.find(element => element == user)) {
//       nb++;
//       console.log(nb);
//     }
//   }

//   if (users.find(element => element == user)) {
      
//     user += nb;
//     console.log(user);
//   }

  const userID = user + Date.now();
  users.push(userID);

  const divUserEl = document.createElement("div");

  const divUserContent = document.createTextNode(user);

  divUserEl.appendChild(divUserContent);
  divUserEl.appendChild(ajoute_btn_minus(userID));
  divUserEl.setAttribute("id", userID);
  boxEl.appendChild(divUserEl);
}

const ajoute_btn_minus = function (userID) {
  let temp = document.createElement("button");

  temp.className = "minus_btn";

  let tempIcon = document.createElement("i");

  tempIcon.textContent = "-";

  temp.appendChild(tempIcon);

  temp.onclick = () => {
    removeUser(userID);
  };

  return temp;
};

function removeUser(userID) {
  users.splice(users.indexOf(userID), 1);
  const divUserEl = document.getElementById(userID);
  divUserEl.remove();
}

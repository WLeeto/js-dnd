import crossImg from '../img/cross.png'

const lists = document.querySelectorAll(".list");

const btn = document.querySelector(".add__btn");
const addBtn = document.querySelector(".add__item-btn");
const cancelBtn = document.querySelector(".cancel__item-btn");
const textarea = document.querySelector(".textarea");
const form = document.querySelector(".form");
const addBoardBtn = document.querySelector(".button");

let value;

function clearTextArea() {
  textarea.value = "";
  value = "";
  form.style.display = "none";
  btn.style.display = "block";
}

function addTask() {
  btn.addEventListener("click", () => {
    form.style.display = "block";
    btn.style.display = "none";
    addBtn.style.display = "none";

    textarea.addEventListener("input", (e) => {
      value = e.target.value;
      if (value) {
        addBtn.style.display = "block";
      } else {
        addBtn.style.display = "none";
      }
    });
  });

  cancelBtn.addEventListener("click", () => {
    clearTextArea();
  });

  addBtn.addEventListener("click", () => {
    const newItem = document.createElement("div");
    const newCross = document.createElement("img")
    newCross.src = crossImg
    newCross.classList.add("cross-btn")
    newItem.classList.add("list__item");
    
    newItem.draggable = true;
    newItem.textContent = value;
    lists[0].append(newItem);
    newItem.appendChild(newCross)

    textarea.value = "";
    value = "";
    form.style.display = "none";
    btn.style.display = "block";

    dragNdrop();
  });
}

addTask();

function addBoard() {
  const boards = document.querySelector(".boards");
  const board = document.createElement("div");
  board.classList.add("boards__item");
  board.innerHTML = `
      <span contenteditable="true" class="title">Введите название</span>
      <div class="list"></div>
  `;
  boards.append(board);
  changeTitle();
  dragNdrop();
}

addBoardBtn.addEventListener("click", addBoard);

function changeTitle() {
  const titles = document.querySelectorAll(".title");
  titles.forEach((title) => {
    title.addEventListener("click", (e) => (e.target.textContent = ""));
  });
}
changeTitle();

let draggetItem = null;


function getElementAfterCursor(x, y, list) {
  for(let el of list.children) {
    if(el.offsetTop / 2 > y) {
        return el;
    } 
  }
  return null;
}


function createPlaceholder() {

  const placeholder = document.createElement('div');  

  placeholder.style.height = '40px';
  placeholder.style.border = '1px dashed grey';

  return placeholder;
}

let placeholder = null
placeholder = createPlaceholder();

function dragNdrop() {
const listItems = document.querySelectorAll(".list__item");
const lists = document.querySelectorAll(".list");

  for (let i = 0; i < listItems.length; i++) {
    const item = listItems[i];

    item.addEventListener('mouseover', function() {
      const cross = item.querySelector('img')
      cross.style.display = 'block'
      cross.addEventListener('click', () => {
        item.remove()
      })
    })

    item.addEventListener('mouseout', function() {
      const cross = item.querySelector('img')
      cross.style.display = 'none'
      cross.removeEventListener('click', () => {
      })
    })

    item.addEventListener("dragstart", () => {
      draggetItem = item;
      setTimeout(() => {
        item.style.display = "none";
      }, 0);
    });

    item.addEventListener("dragend", () => {
      setTimeout(() => {
        item.style.display = "flex";
      }, 0);
      draggetItem = null;
    });

    item.addEventListener("dblclick", () => {
      item.remove();
    });

    for (let j = 0; j < lists.length; j++) {
      const list = lists[j];

      list.addEventListener("dragover", (e) => {
        e.preventDefault()

        const x = e.clientX - list.getBoundingClientRect().left;
        const y = e.clientY - list.getBoundingClientRect().top;
        
        const afterEl = getElementAfterCursor(x, y, list)

        if(afterEl) {
          if(!placeholder) {
             list.insertBefore(placeholder, afterEl);
          } else {
             list.insertBefore(placeholder, afterEl);
          }
       } else {
          list.append(placeholder);
       }

      });

      list.addEventListener("dragenter", function (e) {
        e.preventDefault();
        this.style.backgroundColor = "rgba(0,0,0,.3)";
      });

      list.addEventListener("dragleave", function (e) {
        e.preventDefault();
        this.style.backgroundColor = "rgba(0,0,0,0)";
        // if (placeholder) {
        //   placeholder.remove()
        // }
      });

      list.addEventListener("drop", function (e) {
        e.preventDefault();
        this.style.backgroundColor = "rgba(0,0,0,0)";

        const x = e.clientX - list.getBoundingClientRect().left;
        const y = e.clientY - list.getBoundingClientRect().top;
        
        const afterEl = getElementAfterCursor(x, y, list)
        if(afterEl) {
          if(!placeholder) {
             list.insertBefore(draggetItem, afterEl);
          } else {
             list.insertBefore(draggetItem, afterEl);
          }
       } else {
          list.append(draggetItem);
       }

        // this.append(draggetItem);
        if (placeholder) {
          placeholder.remove()
        }
      });

      const mainContainer = document.querySelector('.boards')
      mainContainer.addEventListener('drop', function(e) {
        if (placeholder) {
          placeholder.remove()
        }
      })
    }
  }
}




dragNdrop();

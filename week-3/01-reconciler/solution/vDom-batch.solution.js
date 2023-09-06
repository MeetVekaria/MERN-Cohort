let vDom = [];

function createDomElements(existingDom, currentDOM) {
  var parentElement = document.getElementById("mainArea");

  let added = 0,
    updated = 0,
    deleted = 0;

  console.log(existingDom);
  console.log(currentDOM);

  currentDOM.forEach(function (item) {
    let existingItem = existingDom.find((oldItem) => {
      return item.id === oldItem.id;
    });

    if (existingItem) {
      updated++;

      let existingChild = document.querySelector(`[data-id='${item.id}']`);
      existingChild.children[0].title = item.title;
      existingChild.children[1].description = item.description;
    } else {
      added++;

      var childElement = document.createElement("div");
      childElement.dataset.id = item.id;

      var grandChildElement1 = document.createElement("span");
      grandChildElement1.innerHTML = item.title;

      var grandChildElement2 = document.createElement("span");
      grandChildElement2.innerHTML = item.description;

      var grandChildElement3 = document.createElement("button");
      grandChildElement3.innerHTML = "Delete";
      grandChildElement3.setAttribute("onclick", "deleteTodo(" + item.id + ")");

      childElement.appendChild(grandChildElement1);
      childElement.appendChild(grandChildElement2);
      childElement.appendChild(grandChildElement3);

      parentElement.appendChild(childElement);
    }
  });

  // Any item left in the existingDOM array no longer exist in the data, so remove them
  existingDom.forEach((oldItem) => {
    if (!currentDOM.some((item) => item.id === oldItem.id)) {
      deleted++;
      let childToRemove = document.querySelector(`[data-id='${oldItem.id}']`);
      parentElement.removeChild(childToRemove);
    }
  });

  console.log(added);
  console.log(updated);
  console.log(deleted);
}

function updateDomElements(data) {
  let existingDom = [...vDom]; // Save the existing state of vDOM

  vDom = data.map((item) => {
    return {
      id: item.id,
      title: item.title,
      description: item.description,
    };
  });

  createDomElements(existingDom, vDom);
}

window.setInterval(() => {
  let todos = [];
  for (let i = 0; i < Math.floor(Math.random() * 100); i++) {
    todos.push({
      title: "Go to gym",
      description: "Go to gym form 5",
      id: i + 1,
    });
  }

  updateDomElements(todos);
}, 2000);

// let todos = [];
// for (let i = 0; i < Math.floor(Math.random() * 100); i++) {
//   todos.push({
//     title: "Go to gym",
//     description: "Go to gym form 5",
//     id: i + 1,
//   });
// }

// createDomElements(todos);

window.setInterval(() => {
  createDomElements(vDom, todos);
}, 5000);

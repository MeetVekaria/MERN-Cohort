function createDomElements(data) {
  var parentElement = document.getElementById("mainArea");

  let currentChildren = Array.from(parentElement.children);

  console.log(currentChildren);

  let added = 0,
    updated = 0,
    deleted = 0;

  data.forEach(function (item) {
    let existingChild = currentChildren.find((child) => {
      return child.dataset.id === String(item.id);
      //   return parseInt(child.dataset.id) === item.id;
    });

    if (existingChild) {
      updated++;

      existingChild.children[0].title = item.title;
      existingChild.children[1].description = item.description;

      // Remove it from the currentChildren array
      //   currentChildren = currentChildren.filter(
      //     (child) => child !== existingChild
      //   );
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

  // Any children left in the currentChildren array no longer exist in the data, so remove them
  currentChildren.forEach((child) => {
    let stillPresent = currentChildren.find((item) => {
      return child.dataset.id === String(item.id);
    });

    if (!stillPresent) {
      deleted++;
      parentElement.removeChild(child);
    }
  });

  console.log(added);
  console.log(updated);
  console.log(deleted);
}

// window.setInterval(() => {
//   let todos = [];
//   for (let i = 0; i < Math.floor(Math.random() * 100); i++) {
//     todos.push({
//       title: "Go to gym",
//       description: "Go to gym form 5",
//       id: i + 1,
//     });
//   }

//   createDomElements(todos);
// }, 2000);

let todos = [];
for (let i = 0; i < Math.floor(Math.random() * 100); i++) {
  todos.push({
    title: "Go to gym",
    description: "Go to gym form 5",
    id: i + 1,
  });
}

createDomElements(todos);

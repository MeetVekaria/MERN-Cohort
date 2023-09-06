/*
  Implement a function `calculateTotalSpentByCategory` which takes a list of transactions as parameter
  and return a list of objects where each object is unique category-wise and has total price spent as its value.
  Transaction - an object like { itemName, category, price, timestamp }.
  Output - [{ category1 - total_amount_spent_on_category1 }, { category2 - total_amount_spent_on_category2 }]

  Once you've implemented the logic, test your code by running
  - `npm run test-expenditure-analysis`
*/

function calculateTotalSpentByCategory(transactions) {
  let estimation = {
  };

  for (const element of transactions) {
    let t = element;
    if(estimation[t.category]) {
      estimation[t.category] = estimation[t.category] + t.price;
    } else {
      estimation[t.category] = t.price;
    }
  }

  var keys = Object.keys(estimation);

  let result = [];
  for(var i = 0; i < keys.length; i++) {
    var category = keys[i];
    var obj = {
      category: category,
      amountSpend: estimation[category]
    }
    result.push(obj);
  }
}

var transactions = [
  {
    itemName: "Pepsi",
    category: "Drink",
    price: 20,
    timestamp: "11-june-2023"
  },
  {
    itemName: "Fanta",
    category: "Drink",
    price: 25,
    timestamp: "12-june-2023"
  },
  {
    itemName: "Kachori",
    category: "Snack",
    price: 10,
    timestamp: "12-june-2023"
  }
]

module.exports = calculateTotalSpentByCategory;

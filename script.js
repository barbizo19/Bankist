'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = ''; //innerHTML can be used for setting and getting

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">3 days ago</div>
    <div class="movements__value">${mov}€</div>
  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const createUsernames = function (accs) {
  accs.forEach(acc => {
    //use forEach to produce side effects
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
}; //we're not returning anything here, we're producing side effects
createUsernames(accounts);

const updateUI = acc => {
  //display movements
  displayMovements(acc.movements);
  //display balance
  calcDisplayBalance(acc);
  //display summary
  calcDisplaySummary(acc);
};

const calcDisplayBalance = acc => {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€ EUR`;
};

const calcDisplaySummary = acc => {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      //console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

//login event handler
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); //the default behavior of a button in a form element is to reload the page, so we need to prevent it here
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  ); //finds the account object that logged in

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //nice use of optional chaining here
    //display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    //clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    updateUI(currentAccount);
  }
});

//transfer event handler
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();

  if (
    amount > 0 &&
    receiverAccount &&
    amount <= currentAccount.balance &&
    currentAccount.username !== receiverAccount?.username
  ) {
    //do the transfer
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);
    updateUI(currentAccount);
  }
});

//loan event handler
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

//close account event handler
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername?.value === currentAccount.username &&
    Number(inputClosePin?.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    //delete account
    accounts.splice(index, 1);

    //hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
//sort movements event handler
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
const eurToUsd = 1.1;
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];

// //programmatically create arrays
// //Array.from
// const y = Array.from({ length: 7 }, () => 1); //fills array with 1s
// console.log(y);

// const z = Array.from({ length: 7 }, (_, i) => i + 1); //fills array with numbers 1 to 7. whatever is in the callback function will get palced in the value
// console.log(z);

// //mini challenge: create an array with 100 random dice rolls
// const diceRollArr = Array.from(
//   { length: 100 },
//   () => Math.floor(Math.random() * 6) + 1
// );
// console.log(diceRollArr);

// //selecting DOM elements with Array.from. let's say we don't have an array of the movement but they exist on the DOM

// labelBalance.addEventListener('click', function () {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value'), //querySelectorAll returns a nodeList. Array.from converts that into an array
//     el => Number(el.textContent.replace('€', '')) //we use the map function to turn the elements into the array we want
//   );
//   console.log(movementsUI);
// });

// //fill method
// const x = new Array(7); //creates an array with 7 empty elements
// console.log(x);
// x.fill(1, 3, -1); //mutates the original array
// console.log(x);

//sort method
//mutates the array. be careful
//strings
// console.log(owners.sort());
// console.log(owners);

//numbers
//console.log(movements.sort()); //this won't work becuase it converts everything to strings first

// //ascending order sort
//return > 0, B, A (switch order)
//return < 0, A, B (keep order)
// console.log(
//   movements.sort((a, b) => {
//     if (a > b) return 1;
//     if (a < b) return -1;
//   })
// );

// //simplify the code
// console.log(movements.sort((a, b) => a - b));

// //descending order sort
// console.log(
//   movements.sort((a, b) => {
//     if (a > b) return -1; //switch
//     if (a < b) return 1; //keep
//   })
// );

// //simplify the code
// console.log(movements.sort((a, b) => b - a));

// //flat method
// //removes nested arrays and returns a flat array
// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat());

// //flatten a deeper array
// const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
// console.log(arrDeep.flat(2));

// const overallBalance = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance);

// //flatMap method
// //uses the map method then flattens the result right away. only goes one level deep however.
// const overallBalance2 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance2);
// //separating callback functions from array methods
// const deposit = mov => mov > 0;
// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));

// //every method
// //returns true if every element in the array passes the condition
// console.log(movements.every(mov => mov > 0)); //prints false
// console.log(account4.movements.every(mov => mov > 0)); //prints true

// //some method
// //similar to the includes method, but we can check a condition, not just an equality

// //determines if there are any deposits on the account. similar to the includes method, but we can check a condition, not just an equality
// const anyDeposits = movements.some(mov => mov > 1500);
// console.log(anyDeposits);
// //find method
// //returns the first element in an array that meets the condition. else it returns undefined
// const firstWithdrawal = movements.find(mov => mov < 0);
// console.log(firstWithdrawal);

// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

// let accountForOf; //has to be let because if we use const we couldnt reassign it
// for (const acc of accounts) {
//   if (acc.owner === 'Jessica Davis') {
//     accountForOf = acc;
//   }
// }
// console.log(accountForOf);
// //chaining
// //don't overuse chaining. don't chain with splice or reverse methods. avoid mutating arrays
// const totalDepositsUSD = movements
//   .filter(mov => mov > 0)
//   .map((mov, i, arr) => {
//     //console.log(arr); //if we want to inspect the array anywhere in the pipeline, we can print it on the next method
//     return mov * eurToUsd;
//   })
//   // .map(mov => mov * eurToUsd)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(totalDepositsUSD);

// //challenge for myself to only use the reduce method here
// const totalDepositsUSDReduce = movements.reduce((total, cur) => {
//   cur > 0 ? (total += cur * eurToUsd) : cur;
//   return Math.floor(total);
// }, 0);
// console.log(`Total deposits USD: ${totalDepositsUSDReduce}`);
// //map, filter and reduce are more functional than for of loops
// //reduce method. accumulator is like a snowball
// const balance = movements.reduce((acc, curr) => acc + curr, 0);
// console.log(balance);

// const max = movements.reduce((acc, mov) => {
//   console.log(`Accumulator: ${acc}, movement: ${mov}`);
//   return acc > mov ? acc : mov;
// }, movements[0]);
// console.log(max);
// //filter method
// const deposits = movements.filter(mov => mov > 0);
// console.log(deposits);

// const withdrawals = movements.filter(mov => mov < 0);
// console.log(withdrawals);

// //map method. returns a new array
// const movementsUsd = movements.map(mov => mov * eurToUsd); //looks really nice with arrow function

// console.log(movements);
// console.log(movementsUsd); //prints [220.00000000000003, 495.00000000000006, -440.00000000000006, 3300.0000000000005, -715.0000000000001, -143, 77, 1430.0000000000002]

// const movementsDescriptions = movements.map(
//   (mov, i) =>
//     `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
//       mov
//     )}`
// );
// console.log(movementsDescriptions); //these iterations got added to a new array, so there are no side effects

// //forEach method Set
// const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
// console.log(currenciesUnique);
// currenciesUnique.forEach(function (value, _, map) {
//   console.log(`${value}: ${value}`);
// });
// //since sets don't have keys, the value and key arguments point to the same thing. we can use an underscore to denote an unecessary variable.

// //forEach method Map
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });

// //forEach method Array

// for (const [i, movement] of movements.entries()) {
//   movement > 0
//     ? console.log(`Movement ${i + 1}: You deposited ${movement}`)
//     : console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
// }
// console.log('------------forEach------------');

// movements.forEach(function (mov, i, arr) {
//   mov > 0
//     ? console.log(`Movement ${i + 1}: You deposited ${mov}`)
//     : console.log(`Movement ${i + 1}: You withdrew ${Math.abs(mov)}`);
// });
// //we can't break out of a forEach loop
// //each action is visible, one by one, in the console. these are called side effects
/////////////////////////////////////////////////

// //at method
// const arr = [23, 11, 64];
// console.log(arr[0]);
// console.log(arr.at(0)); //same thing as using indexes

// //getting last array element
// console.log(arr[arr.length - 1]);
// console.log(arr.slice(-1)[0]);
// console.log(arr.at(-1)); //easiest way to get last index. also easier use for chaining

// console.log('ben'.at(0));
// console.log('ben'.at(-1));

//let arr = ['a', 'b', 'c', 'd', 'e'];
// //slice. doesn't mutate the original array
// console.log(arr.slice(2)); //prints c,d,e
// console.log(arr.slice(2, 4)); //prints c,d
// console.log(arr.slice(-2)); //prints d,e
// console.log(arr.slice(-1)); //prints e
// console.log(arr.slice(1, -2)); //prints b, c
// console.log(arr.slice()); //creates a shallow copy
// console.log([...arr]); //creates a shallow copy. use any method

// //splice. mutates the original array
// // console.log(arr.splice(2)); //prints c,d,e but also takes them out of the original array
// // arr.splice(-1);
// // console.log(arr);
// // arr.splice(1, 2);
// // console.log(arr);

// //reverse. mutates the original array
// const arr2 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr2.reverse());

// //concat. doesn't mutate the original array
// const letters = arr.concat(arr2);
// console.log(letters);
// console.log([...arr, ...arr2]); //use any method

// //join. doesn't mutate the original array
// console.log(letters.join(' - '));
// console.log(letters);

/////////////////////////////////////////////////////////////
//coding challenge 1
// const juliaData1 = [3, 5, 2, 12, 7];
// const juliaData2 = [9, 16, 6, 8, 3];
// const kateData1 = [4, 1, 15, 8, 3];
// const kateData2 = [10, 5, 6, 1, 4];

// const checkDogs = function (dogsJulia, dogsKate) {
//   const jNoCat = dogsJulia.slice(1, -2);
//   //jonas used this: dogsJuliaCorrected = dogsJulia.slice();
//   //                  dogsJuliaCorrected.splice(0, 1);
//   //                  dogsJuliaCorrected.splice(-2);
//   const allData = [...jNoCat, ...dogsKate];
//   //jonas used this: const dogs = dogsJuliaCorrected.concat(dogsKate);
//   console.log(allData);
//   allData.forEach(function (age, i) {
//     age >= 3
//       ? console.log(`Dog number ${i + 1} is an adult, and is ${age} years old`)
//       : console.log(`Dog number ${i + 1} is still a puppy 🐶`);
//   });
// };

// checkDogs(juliaData1, kateData1);
// checkDogs(juliaData2, kateData2);

// //coding challenge 2
// const calcAverageHumanAge = ages => {
//   const humanAges = ages.map(dogAge =>
//     dogAge <= 2 ? dogAge * 2 : 16 + dogAge * 4
//   );
//   const humanAgesOver18 = humanAges.filter(age => age >= 18);

//   // const avgOver18 =
//   //   humanAgesOver18.reduce((acc, age) => acc + age, 0) / humanAgesOver18.length;
//   // console.log(avgOver18);

//   //alternate way of averaging. uses the arr argument which could be useful when chaining methods
//   const altAvg = humanAgesOver18.reduce(
//     (acc, age, i, arr) => acc + age / arr.length,
//     0
//   );
//   console.log(altAvg);
// };

// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

// //coding challenege 3
// const calcAverageHumanAge = ages => {
//   const humanAgesAvg = ages
//     .map(dogAge => (dogAge <= 2 ? dogAge * 2 : 16 + dogAge * 4))
//     .filter(age => age >= 18)
//     .reduce((acc, age, i, arr) => acc + age / arr.length, 0); //have to use this way of calculating the average because we don't know the length after the filter

//   console.log(humanAgesAvg);
// };

// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

//array methods practice
// //1. how much has been deposited into the bank in total?
// const bankDepositSum = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov > 0)
//   .reduce((sum, cur) => sum + cur, 0);
// console.log(bankDepositSum);

// //2. how many deposits in the bank had at least $1000
// //easy way
// // const numDeposits1000 = accounts
// //   .flatMap(acc => acc.movements)
// //   .filter(mov => mov >= 1000).length;

// // console.log(numDeposits1000);

// //better way. this is how to use a counter with the reduce method.
// const numDeposits1000 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0); //we can't use count++ here because ++ returns the previous value even after incrementing. to fix this, we use ++count (prefix) this way it returns the incremented variable

// console.log(numDeposits1000);

// //3. use the reduce value to produce an object. let's create an object which contains the sum of all the deposits and the withdrawals
// const { deposits, withdrawals } = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sums, cur) => {
//       // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur); not as clean
//       sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur; //cleaner way using bracket notation
//       return sums;
//     },
//     { deposits: 0, withdrawals: 0 }
//   );

// console.log(deposits, withdrawals);

//4. convert any string into a title case (articles aren't capitalized)
const convertTitleCase = function (title) {
  const capitalize = str => str[0].toUpperCase() + str.slice(1);

  const exceptions = ['a', 'an', 'the', 'but', 'or', 'on', 'and', 'in', 'with'];

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => (exceptions.includes(word) ? word : capitalize(word)))
    .join(' ');
  return capitalize(titleCase);
};
console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG title but not too long'));
console.log(convertTitleCase('and here is another title with an EXAMPLE'));

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

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov}€</div>
        </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const Out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, i) => acc + i, 0);
  labelSumOut.textContent = `${Math.abs(Out)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100) //  console.log(interest);
    .filter(int => int > 1) //  int is check > 1 add aryy
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${Math.abs(interest)}€`;
};

const createUsernames = accs => {
  //  console.log(accs);
  accs.forEach(function (acc) {
    //  console.log(acc);
    acc.username = acc.owner
      .toLocaleLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsernames(accounts);

const deposits = movements.filter(function (mov) {
  return mov > 0;
});

const withdrwawals = movements.filter(function (mov) {
  return mov < 0;
});

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);

  // Display balance
  calDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};
// Event handler
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc?.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    containerApp.style.opacity = 100;

    // Clear fields
    inputLoginUsername.value = '';
    inputLoginPin.value = '';

    // Remove the fouces
    inputLoginUsername.blur();
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  console.log(amount, receiverAcc);

  inputTransferAmount.value = '';
  inputTransferTo.value = '';
  // Remove the fouces
  inputTransferAmount.blur();
  inputTransferTo.blur();

  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount?.username &&
    receiverAcc
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const UserName = inputCloseUsername.value;
  const Pin = Number(inputClosePin.value);

  if (currentAccount.username === UserName && currentAccount.pin === Pin) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    accounts.splice(index, 1);
    console.log(accounts);
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = '';
  inputClosePin.value = '';
  inputCloseUsername.blur();
  inputClosePin.blur();
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

// 0  1  2  3  4
// const DATA = [1, 2, 3, 4, 5]; // splice(start, deleteCount)

// console.log(DATA);

// console.log(DATA.splice(0, 1));

// console.log(DATA);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

/////////////////////////////////////////////////
/*
let arr = ['1', '2', '3', '4', '5'];

// SLICE // it not Nuting irnal array
// console.log(arr.slice(2)); // (3) ['3', '4', '5']
// console.log(arr.slice(2, 4)); // (2) ['3', '4']
// console.log(arr.slice(-2)); // (2)[('4', '5')];
// console.log(arr.slice(-1)); // ['5']
// console.log(arr.slice(1, -2)); // (2) ['2', '3']
// console.log(arr.slice()); // (5) ['1', '2', '3', '4', '5']
// console.log([...arr]); // (5) ['1', '2', '3', '4', '5']

// SPLICE // isreplace Nuting irnal array
// console.log(arr.splice(2));

// arr.splice(-1);
// console.log(arr);
// arr.splice(1, 1);
// console.log(arr);


// REVERSE // isreplace Nuting irnal array

const arr2 = ['a', 'b', 'c', 'd', 'g'];
console.log(arr2.reverse());

// CONCAT // it is not replace Nuting irnal array
const latter = arr.concat(arr2);
console.log(latter); // (10) ['1', '2', '3', '4', '5', 'g', 'd', 'c', 'b', 'a']
console.log([...arr, ...arr2]); // (10) ['1', '2', '3', '4', '5', 'g', 'd', 'c', 'b', 'a']

// JOIN
console.log(latter.join(' - '));


const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const movement of movements) {
for (const [i, movement] of movements.entries()) {
    console.log(i + 1);
    console.log(movement);
  if (movement > 0) {
    console.log(`Movement ${i + 1}: You deposited ${movement}`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
  }
}

console.log('--------------- FOREACH ---------------');
movements.forEach(function (movement, index, array) {
  // movement = Current lement , index = Current Index , array = Enter All Array data and nameing you can any not matter
  console.log(index + 1);
  console.log(array);
  if (movement > 0) {
    console.log(`Movement ${index + 1}: You deposited ${movement}`);
  } else {
    console.log(`Movement ${index + 1}: You withdrew ${Math.abs(movement)}`);
  }
});

// 0: function(200)
// 1: function(450)
// 2: function(-400)
// ...

//  Map
// currencies.forEach(function (value, key, map) {
//   console.log(value);
//   console.log(key);
//   console.log(map);
//   console.log(`${key}: ${value}`);
// });

// set
const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
console.log(currenciesUnique);
currenciesUnique.forEach(function (value, _, map) {
  console.log(map);
  console.log(_);
  console.log(`${value}: ${value}`);
});





const Julia = [1, 2, 3, 4, 5];
const kate = [4, 1, 15, 8, 3];

const JuliaOne = [9, 16, 6, 8, 3];
const kateOne = [10, 5, 6, 1, 4];

const checkDogs = function (dogsJulia, dogsKate) {
  const dogsJuliaCorrecated = dogsJulia.slice();
  dogsJuliaCorrecated.splice(0, 1); // splice(start, deleteCount)
  dogsJuliaCorrecated.splice(-2);


  const dogs = dogsJuliaCorrecated.concat(dogsKate);
  console.log(dogs);

  dogs.forEach(function (dog, i) {
    if (dog >= 3) {
      console.log(`Dog number ${i+1} is an adult, and is ${dog} old`);
    } else {
        console.log(`Dog number ${i + 1} is still a puppy, and is ${dog} old`);
    }
  })
  
};

checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);


const eurToUsd = 1.1;

// Functionly Programm
// const movementsUSD = movements.map(function (mov) {
//   console.log(mov);
//   return eurToUsd * mov;
// });

// console.log(movements);
// console.log(movementsUSD);

// const newArr = []
// for (const mov of movements) {
//   console.log(mov);
//   const data = eurToUsd * mov;
//   newArr.push(data);
// }
// console.log(newArr);

const movementsUSD = movements.map(mov => mov * eurToUsd);
console.log(movementsUSD);

const movementsDescriptions = movements.map(
  (mov, i) =>
    `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
      mov
    )}`
);

console.log(movementsDescriptions);

console.log(movements);
console.log(deposits);


// const depositsFor = [];
// for (const mov of movements) {
//   if (mov > 0) depositsFor.push(mov);
// }
// console.log(depositsFor);

console.log(withdrwawals);

// accumulator => SNOWBALL
// const balance = movements.reduce(function (acc, cur, i, arr) {
//   console.log(`Interation ${i}: ${acc}`);
//   return acc + cur;
// }, 0); // 0 is defult we can add any number also
// console.log(balance);

// let sum = 0;
// for (const Add of movements) {
//   sum += Add;
// }

// console.log(sum);

const balance = movements.reduce((acc, cur) => acc + cur, 0); // 0 is defult we can add any number also
console.log(balance);

// Maximum value
const max = movements.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else return mov;
}, movements[0]);

console.log(max);


const Data1 = [5, 2, 4, 1, 15, 8, 3];
const Data2 = [16, 6, 10, 5, 6, 1, 4];

const calcAverageHumanAge = function (ages) {
  const humanAges = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
  const adults = humanAges.filter(age => age >= 18);

  // const dadadadada = humanAges.filter(function (age) {
  //  return age >= 18;
  // });
  // console.log(dadadadada);


  console.log(adults);
  console.log(humanAges);


  // const Add = adults.reduce((acc, cur, arr) => acc + cur, 0) / adults.length;
  const Add = adults.reduce((acc, cur, i , arr) => acc + cur / arr.length, 0);
  return Add;

};

calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);

console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));

const eruToUsd = 1.1;

// POPELINE
const totalDepositsUSD = movements
  .filter(mov => mov > 0)
  .map(mov => mov * eruToUsd)
  .reduce((acc, mov) => acc + mov, 0);
console.log(totalDepositsUSD);

const DATA1 = [5, 2, 4, 1, 15, 8, 3];

const calcAverageHumanAge = ages =>
  ages
    .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter(age => age >= 18)
    .reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
console.log(calcAverageHumanAge(DATA1));



console.log(DATA1);  


// const firstWithdrawal = movements.find(mov => mov < 0);
// console.log(movements);
// console.log(firstWithdrawal);

// console.log(accounts);

// const account = accounts.find(function (acc) {
//   return acc.owner === 'Jessica Davis'
// });

// console.log(account);

const NewACC = [];
for (const data of accounts) {
  if (data.owner === 'Jessica Davis') {
    console.log(data);
  }
}


console.log(movements);

// EQUALITY
console.log(movements.includes(5000));

// SOME = CONDITION
const anyDeposits = movements.some(mov => mov > 50);
console.log(anyDeposits);



// EVERY
console.log(movements.every(mov => mov > 0));
console.log(account4.movements.every(mov => mov > 0));

// Separate callback
const deposits1 = mov => mov > 0;

console.log(movements.some(deposits1));
console.log(movements.every(deposits1));
console.log(movements.filter(deposits1));


// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];

// console.log(arr.flat());

// const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
// console.log(arrDeep.flat(2));

// const accountMovements = accounts.map(acc => acc.movements);
// console.log(accountMovements);

// const allMovements = accountMovements.flat();
// console.log(allMovements);

// const overalBalane = allMovements.reduce((acc, mov) => acc + mov, 0);
// console.log(overalBalane);


// flat
// const overalBalane = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overalBalane);


// // flatmap
// const overalBalane2 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overalBalane2);

// // String 
// const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
// console.log(owners);
// console.log(owners.sort());

// Number
console.log(movements);
// console.log(movements.sort()); // [-130, -400, -650, 1300, 200, 3000, 450, 70]

// return < 0 , A , B (Keep order)
// return > 0 , B , A (switch order)


// Assending
// console.log(movements.sort((a, b) => {
//   console.log(a, b);
//   if (a > b) return 1;
//   if (a < b) return -1;
// }));
movements.sort((a, b) => a - b);
 console.log(movements);



// Descending 
// console.log(
//   movements.sort((a, b) => {
//     console.log(a, b);
//     if (a < b) return 1;
//     if (a > b) return -1;
//   })
// );
movements.sort((a, b) => b - a);
console.log(movements);


const DATA = [1, 2, 3, 4, 5, 6, 7, 8];
console.log(DATA);

console.log(new Array(1, 2, 3));

// Empty arrays + fill method
const x = new Array(7);
console.log(x);
// console.log(x.map(() => 5));
// x.fill(1);

// x.fill(1, 3); // work like slice
x.fill(1, 3, 5); // work like slice

console.log(x);

DATA.fill(23, 4, 6);
console.log(DATA);

// Array.from
const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);

const RNumber = Math.floor(Math.random() * 100 + 1);

const R = Array.from({ length: 100 }, () => Math.floor(Math.random() * 6 + 1));
console.log(R);


labelBalance.addEventListener('click', function () {
  const movementUI = Array.from(document.querySelectorAll('.movements__value'), el => Number(el.textContent.replace('€', ''))).reduce( (acc , i) => acc + i , 0); // .movementUI.map(el => el.textContent.replace('€' , ''))  not work chin here
  console.log(movementUI);

 // console.log(movementUI.map(el => Number(el.textContent.replace('€', ''))).reduce( (acc , i) => acc + i , 0));
  console.log(movementUI);
})


// const bankDespositSum = accounts
//   .flatMap(acc => acc.movements)
//   .filter(acc => acc > 0)
//   .reduce ((acc , i) => acc + i , 0);

// console.log(bankDespositSum);

// //2
// const numDeposits1000 = accounts
//   .flatMap(acc => acc.movements)
//   .filter(acc => acc >= 1000)  /// .length or
//   .reduce((count, cur, i, b) => i + 1 , 0); // or ( cur >= 1000 ? count + 1 : count) // count++

// console.log(numDeposits1000);

3;
const sums = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur) => {
      //  cur > 0 ? (sums.deposits += cur) : (sums.withdrwawals += cur); // OR
      sums[cur > 0 ? 'deposits' : 'withdrwawals'] += cur;
      return sums;
    },
    { deposits: 0, withdrwawals: 0 }
  );

console.log(sums);

// OR

// const { deposit, withdrls } = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sums, cur) => {
//       cur > 0 ? (sums.deposit += cur) : (sums.withdrls += cur);
//       return sums;
//     },
//     { deposit: 0, withdrls: 0 }
//   );

// console.log(deposit, withdrls);

const convertTitleCase = function (title) {
  const capitzalize = str => str[0].toUpperCase() + str.slice(1);

  const exceptions = ['a', 'an', 'the', 'but', 'and', 'or', 'on', 'in', 'with'];

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => (exceptions.includes(word) ? word : capitzalize(word))).join(' ');

  return capitzalize(titleCase);
};

console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG title but not too long'));
console.log(convertTitleCase('and here is another title with an EXAMPLE'));

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// !.
dogs.forEach(dog => {
  dogs.forEach(dog => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28)));
});
console.log(dogs);

// 2.
const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(dogSarah);
console.log(
  `Sarah's dog is eating too ${
    dogSarah.curFood > dogSarah.recFood ? 'much' : 'little'
  } `
);

// 3.
const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recFood)
  .flatMap(dog => dog.owners);
// .flat();
console.log(ownersEatTooMuch);

const ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooLittle);

// 4.
// "Matilda and Alice and Bob's dogs eat too much!"
//  "Sarah and John and Michael's dogs eat too little!"
console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);
console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little!`);

// 5.
console.log(dogs.some(dog => dog.curFood === dog.recFood));

// 6.
// current > (recommended * 0.90) && current < (recommended * 1.10)
const checkEatingOkay = dog =>
  dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1;

console.log(dogs.some(checkEatingOkay));

// 7.
console.log(dogs.filter(checkEatingOkay));

// 8.
// sort it by recommended food portion in an ascending order [1,2,3]
const dogsSorted = dogs.slice().sort((a, b) => a.recFood - b.recFood);
console.log(dogsSorted);



*/


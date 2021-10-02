const readline = require("readline");
const rl = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
  });
}

start();

// start function for menu & routing to appropriate game
async function start() {
  // start menu graphic
  console.log(
    "\n....T.......................\n" +
      ".... H....G.................\n" +
      "....  E... U................\n" +
      "..........  E....G..........\n" +
      "..........   S... A.........\n" +
      "..........    S..  M........\n" +
      "..........     I.   E.......\n" +
      "..........      N...........\n" +
      "..........       G..........\n"
  );

  //  let the user choose which version of the game to play, make sure they make a valid selection.
  let gameChoice = await ask(
    "Welcome to the guessing game! Please select from the following options: \n(1) Choose a number for me to guess \n(2) Try to guess a number I choose \nEnter 1 or 2... "
  );
  while (gameChoice !== "1" && gameChoice !== "2") {
    gameChoice = await ask("Invalid entry. Please enter 1 or 2... ");
  }

  // route user to appropriate game and call that function
  if (gameChoice === "1") {
    gameOne();
  } else if (gameChoice === "2") {
    gameTwo();
  }
}

// function definition for GAME ONE
async function gameOne() {
  // define initial range; ask user for max, set min to 0
  let min = 0;

  // ask for a max value
  max = Number(
    await ask("Please enter a maximum value (must be greater than 1)... ")
  );

  // check for invalid input
  while (isNaN(max) || max <= 1) {
    max = Number(
      await ask("Invalid entry. Enter an integer greater than 1... ")
    );
  }

  // take secret number from user and display it
  let secretNumber = Number(
    await ask(
      `What is your secret number in the range 1 to ${max}? \nI won't peek, I promise...\n`
    )
  );
  console.log("You entered: " + secretNumber);

  while (isNaN(secretNumber) || secretNumber <= 0 || secretNumber > max) {
    secretNumber = Number(
      await ask(
        `Invalid entry. \nPlease enter an integer greater than 0 and less than ${max + 1}... `
      )
    );
  }

  // define a variable for whether a guess was correct and set it to no
  let status = "n";

  // define a variable to count guesses
  let numGuesses = 0;

  let guess;

  while (true) {
    // calculate guess, store last guess for comparison
    let lastGuess = guess;
    guess = Math.round((max - min) / 2 + min);

    // debugging
    // console.log("guess: " + guess)

    // first check for cheating
    if (lastGuess == guess) {
      console.log("That's impossible. Goodbye");
      process.exit();
    }

    // ask if the guess is correct, store in the variable status
    status = await ask(`is your number ${guess}? Please enter y/n... `);

    // make sure entry was valid
    while (status !== "y" && status !== "n") {
      status = await ask(`Invalid entry. Please enter "y" or "n"... `);
    }
    // debugging
    // console.log("max: " + max)
    // console.log("min: " + min)

    // second check for cheating
    if (max - min <= 1 && status == "n") {
      console.log("That's impossible. Goodbye");
      process.exit();
    } 

    // increment number of guesses
    numGuesses++;

    // if the guess was right, end the program
    if (status === "y") {
      console.log(`Hooray! I win! it took me ${numGuesses} guess(es). \n\n`);

      // find out if user wants to play again, store in variable again
      let again = await ask("do you want to play again? enter y/n... ");
      while (again !== "y" && again !== "n") {
        again = await ask('Invalid entry. Please enter "y" or "n"... ');
      }

      // if playing again, call start() again. otherwise end program
      if (again === "y") {
        start();
      } else {
        console.log("ok. goodbye!");
        process.exit();
      }
    }

    // ask which direction to adjust max/min
    let direction = await ask(
      `is your number higher or lower than ${guess}? Please enter h/l... `
    );
    while (direction !== "h" && direction !== "l") {
      direction = await ask('Invalid entry. Please enter "h" or "l"... ');
    }

    // set max or min equal to variable guess based on user input
    if (direction === "l") {
      max = guess;
    } else if (direction === "h") {
      min = guess;
    }
  }
}

// function definition for GAME TWO
async function gameTwo() {
  // think of a number between 1 and 100 for the user to guess
  let answer = Math.floor(Math.random() * 100) + 1;

  // define a variable to count guesses
  let numGuesses = 0;

  // loop indefinitely
  while (true) {
    // prompt the user for a guess, make sure it's within range and is an integer

    let guess = Number(await ask("Guess a number between 1 and 100... "));
    while (guess < 1 || guess > 100 || isNaN(guess)) {
      guess = Number(
        await ask("Invalid entry. Enter a number between 1 and 100... ")
      );
    }

    // increment number of guesses
    numGuesses++;

    // check whether the guess is correct. if so, end the program.
    // I used == because it allows strings (guess variable) to be equal to numbers (answer variable)
    if (guess == answer) {
      console.log(`You win! it took you ${numGuesses} guess(es). \n`);

      // find out if user wants to play again, store in variable 'again'

      let again = await ask("do you want to play again? enter y/n... \n");
      while (again !== "y" && again !== "n") {
        again = await ask('Invalid entry. Enter "y" or "n"... ');
      }

      // if playing again, call start() again. otherwise end program
      if (again === "y") {
        start();
      } else {
        console.log("ok. goodbye!");
        process.exit();
      }
    }
    // tell the user if their guess is too low or too high
    else if (guess < answer) {
      console.log("nope. your guess is too low.");
    } else if (guess > answer) {
      console.log("nope. your guess is too high.");
    }
  }
}

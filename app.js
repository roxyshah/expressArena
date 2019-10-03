const express = require('express');
const morgan = require('morgan');

const app = express();
// This is middleware that requests pass through
// on their way to the final handler
app.use(morgan('dev'));


//This is the final request handler
app.get('/', (req, res) => {
    res.send('Hello Express!');
});


app.get('/echo', (req, res) => {
    const responseText = 'Here are some details of your request:'
    + ' \nBase URL: ' + req.baseURL
    + ' \nHost: ' + req.hostname 
    + ' \nPath: ' + req.path; 
    res.send(responseText);
});


app.get('/queryViewer', (req, res) => {
    console.log(req.query);
    res.end();//do not send any data back to the client
});


//let's say we are interested in the name and race of fantasy characters
app.get('/greetings', (req, res) => {
    //1. get values from the request
    const name = req.query.name;
    const race = req.query.race;

    //2. validate the values
    if (!name) {
        //3. race was not provided
        return res.status(400).send('Please provide a race');        
    }

    //4. and 5. both name and race are valid so do the processing
    const greeting = 'Greetings ' + name + 'the ' + race + ', welcome to our kingdom.';

    //6. send the response
    res.send(greeting);
});

app.listen(8000, () => {
    console.log("Express server is listening on port 8000");
});



//Drill 1
app.get('/sum', (req, res) => {
    const a = req.query['a'];
    const b = req.query['b'];

    //validation - a and b are required and should be numbers
    if(!a) {
        return res
                .status(400)
                .send('a is required');
    }

    if(!b) {
        return res
                .status(400)
                .send('b is required');
    }

    const numA = parseFloat(a);
    const numB = parseFloat(b);

    if(Number.isNaN(numA)) {
        return res
                .status(400)
                .send('a must be a number');
    }

    if(Number.isNaN(numB)) {
        return res
                .status(400)
                .send('b must be a number');
    }

    //validation passed so perform the task

    const sum = numA + numB;

    res.send("The sum of " + numA + " and " + numB + " is " + sum);
});



//Drill 2
app.get('/cipher', (req, res) => {
    const text = req.query['text'];
    const shift = req.query['shift'];

    //validation: both values are required, shift must be a number
    if(!text) {
        return res
                .status(400)
                .send('text is reqired');
    }

    if(!shift) {
        return res
                .status(400)
                .send('shift is reqired');
    }

    const numShift = parseFloat(shift);

    if(Number.isNaN(numShift)) {
        return res
                .status(400)
                .send('shift must be a number');
    }

    //all valid, perform the task
    //make the text uppercase for convenience
    //the question did not say what to do with punctuation marks
    //and numbers so we will ignore them and only convert letters. 
    //Also, just the 26 letters of the alphabet in typical use in the US
    //and UK today. To support an international audience we will have to
    //do more
    //Create a loop over the characters for each letter, convert
    //using the shift

    //get char code
    const base = 'A'.charCodeAt(0);
    
    const cipher = text
        .toUppercase()
        .split('') //create an array of characters
        .map(char => { //map each original char to a converted char
            const code = char.charCodeAt(0); //get the char code

            //if it is not one of the 26 letters ignore it
            if(code < base || code > (base + 26)) {
                return char;
            }

            //otherwise convert it
            //get the distance from A
            let diff = code - base;
            diff = diff + numShift;

            //if case shift takes the value past Z, cycle back to the beginning
            diff = diff % 26;

            //convert back to a character
            const shiftedChar = String.fromCharCode(base + diff);
            return shiftedChar;
        })
        .join(''); //construct a String from the array

        //return the response
        res
            .status(200)
            .send(cipher);
});


// Drill 3
app.get('/lotto', (req, res) => {
    const { numbers } = req.query; 
  
    // validation: 
    // 1. the numbers array must exist
    // 2. must be an array
    // 3. must be 6 numbers
    // 4. numbers must be between 1 and 20
  
    if(!numbers) {
      return res
        .status(200)
        .send("numbers is required");
    }
  
    if(!Array.isArray(numbers)) {
      return res
        .status(200)
        .send("numbers must be an array");
    }
  
    const guesses = numbers
          .map(n => parseInt(n))
          .filter(n => !Number.isNaN(n) && (n >= 1 && n <= 20));
    
    if(guesses.length != 6) {
      return res
        .status(400)
        .send("numbers must contain 6 integers between 1 and 20");
    }      
  
    // fully validated numbers
  
    // here are the 20 numbers to choose from
    const stockNumbers = Array(20).fill(1).map((_, i) => i + 1);
  
    //randomly choose 6
    const winningNumbers = [];
    for(let i = 0; i < 6; i++) {
      const ran = Math.floor(Math.random() * stockNumbers.length);
      winningNumbers.push(stockNumbers[ran]);
      stockNumbers.splice(ran, 1);
    }
  
    //compare the guesses to the winning number
    let diff = winningNumbers.filter(n => !guesses.includes(n));
  
    // construct a response
    let responseText;
  
    switch(diff.length){
      case 0: 
        responseText = 'Wow! Unbelievable! You could have won the mega millions!';
        break;
      case 1:   
        responseText = 'Congratulations! You win $100!';
        break;
      case 2:
        responseText = 'Congratulations, you win a free ticket!';
        break;
      default:
        responseText = 'Sorry, you lose';  
    }
  
  
    // uncomment below to see how the results ran
  
    // res.json({
    //   guesses,
    //   winningNumbers,
    //   diff,
    //   responseText
    // });
  
    res.send(responseText);
  });
  
  app.listen(8000, () => {
    console.log('Server started on PORT 8000');
  });

let no1 = document.getElementById('no1')
no1.innerHTML = Math.floor(Math.random() * 101); 

let no2 = document.getElementById('no2');
no2.innerHTML = Math.floor(Math.random() * 101);

let result = document.getElementById('result');

function checkNumber(value){
    let numericVal = Number(value);

    // if the given string does not represent a number
    if ( 
            value.length === 0 || 
            value.indexOf(' ') > -1 ||
            String(numericVal) === 'NaN'
        ){
        return false;
    }

    // if the given string represents a number
    return true;
}

function check() {
    let userInput = document.querySelector('#user-input');
    let isNumber = checkNumber(userInput.value);
    if(isNumber === false){
        alert('You did not enter a number!');
        return;
    }

    userInput = Number(userInput.value);

    if (userInput == Number(no1.innerHTML) + Number(no2.innerHTML) ) {
        result.innerHTML = 'You are right! Congratulations';
        return;
    } else {
        result.innerHTML = 'Incorrect answer! Try one more time!';
        return;
    }
    
}

function reset() {
    no1.innerHTML = Math.floor(Math.random() * 101); 
    no2.innerHTML = Math.floor(Math.random() * 101);
    document.querySelector('#user-input').value = '';
}


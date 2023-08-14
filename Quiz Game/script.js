
const apiUsers = 'http://localhost:3000/users';
const apiQuestionsEN = 'http://localhost:3000/questionsEN';
const apiQuestionsRO = 'http://localhost:3000/questionsRO';

function hideElem(toHide) {
    toHide.classList.add("no-display");
    return;
};

function displayElem(toDisplay) {
    toDisplay.classList.remove("no-display");
    return;
}

function redirectTo(filename) {
    location.href = filename + ".html";
    return;
}

// APPLY USER'S PREFERENCES WHEN REFRESHING THE PAGE

document.addEventListener('DOMContentLoaded', () => {

    const storedTheme = localStorage.getItem("theme-preference");

    if (storedTheme) {
        setTheme(storedTheme);
        changeThemeText();
    };

    const storedLanguage = localStorage.getItem("language");

    if (storedLanguage) {
        changeLanguage(storedLanguage);
    };

});

// doesn't work; will use Local Storage for now

// function setCookie(cname, cvalue, exdays) {
//     const d = new Date();
//     d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
//     let expires = "expires=" + d.toUTCString();
//     document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
// }

// function getCookie(name) {
//     const cookieName = `${name}=`;
//     const cookieArray = document.cookie.split(';');
//     for (let i = 0; i < cookieArray.length; i++) {
//         let cookie = cookieArray[i];
//         while (cookie.charAt(0) === ' ') {
//             cookie = cookie.substring(1);
//         }
//         if (cookie.indexOf(cookieName) === 0) {
//             return decodeURIComponent(cookie.substring(cookieName.length, cookie.length));
//         }
//     }
//     return null;
// }

// LOGIN PAGE

// FUTURE IMPROVEMENT: MAKE THE PROPERTIES PRIVATE

class User {
    username;
    password;
    email;

    constructor(username, password, email) {
        this.username = username;
        this.password = password;
        this.email = email;
    }

    register() {
        fetch(`${apiUsers}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                alert("Account created successfully!");
                localStorage.setItem("username", this.username);
                localStorage.setItem("password", this.password);
                redirectTo("dashboard");
            }
            )
            .catch(error => console.log('Error: ' + error))
    }

    authenticateUser(serverData) {
        if (serverData[0].username === this.username && serverData[0].password === this.password) {
            alert("Login successfully!")
            localStorage.setItem("username", this.username);
            localStorage.setItem("password", this.password);
            redirectTo("dashboard");
        } else {
            alert("Username or password is not correct. Please try again.");
        }

    }

    login() {
        fetch(`${apiUsers}?username=${this.username}`)
            .then(response => { return response.json() })
            .then(data => { this.authenticateUser(data) })
            .catch(error => console.log('Error: ' + error))
    }

}

class LoggedUser extends User {

    constructor(username, password, email) {
        super(username, password, email);
    }

    welcomeUser() {
        // display username on dashboard pageg to welcome user
        const displayUsername = document.getElementById("displayUsername");
        displayUsername.textContent = this.username + "!";
    }

    changeUsername() {

    }

    changePassword() {

    }


    deleteAccount() {

        // doesn't work; the URL works for GET request but not for a DELETE request, the error 404 not found is fired
        // same behaviour in Postman

        fetch(`${apiUsers}?username=${this.username}`, {
            method: "DELETE"
        })
            .then(response => {
                if (response.ok) {
                    alert("Your account has been deleted. You will be redirect to the login page");
                    redirectTo("home");
                } else {
                    alert("An error occured and we couldn't delete your account. Please try again later.");
                }
            })
            .catch(error => console.log('Error: ' + error))
    }

    // getEmail() {
    //     return this.#email;
    // }

    // getUsername() {
    //     return this.#username;
    // }

    // getPassword() {
    //     return this.#password;
    // }

    // setEmail(email) {
    //     return this.#email;
    // }

    // setUsername(username) {
    //     return this.#username;
    // }

    // setPassword(password) {
    //     return this.#password;
    // }

    // }
}


const loginBtn = document.getElementById("loginBtn");
const loginForm = document.getElementById("loginFormContainer");

// LOGIN TO ACCOUNT

let currentUser;

if (loginBtn) {
    loginBtn.addEventListener("click", () => {

        const usernameFromUser = document.getElementById("form2Example11").value;
        const passwordFromUser = document.getElementById("form2Example22").value;

        currentUser = new User(usernameFromUser, passwordFromUser);

        currentUser.login();

    })
};

// REGISTER ACCOUNT

const createAccountBtn = document.getElementsByClassName("btn btn-outline-danger")[0];

if (createAccountBtn) {
    createAccountBtn.addEventListener("click", () => {
        hideElem(loginForm);
        displayElem(registerForm);

    })
};


const registerForm = document.getElementById("registerContainer");
const registerBtn = document.getElementById("registerBtn");
const termsOfServiceBtn = document.getElementById("form2Example3cg");

let newUser;
let newUsername;
let newEmail;
let newPassword;
let repeatedPassword;
let isValid;

if (registerBtn) {
    registerBtn.addEventListener("click", () => {

        // validate data

        newUsername = document.getElementById("form3Example1cg").value;
        newEmail = document.getElementById("form3Example3cg").value;
        newPassword = document.getElementById("form3Example4cg").value;
        repeatedPassword = document.getElementById("form3Example4cdg").value;

        isValid = true;

        validateData(newUsername, newEmail, newPassword, repeatedPassword);

        // create new account if data is valid

        if (isValid) {
            newUser = new User(newUsername, newPassword, newEmail);
            newUser.register();
        }

    }

    )
}

function validateData(username, email, password, repeatedPassword) {

    if (username.length == 0 || email.length == 0 || password.length == 0 ||
        repeatedPassword.length == 0) {
        alert("Please fill in all the fields!");
        isValid = false;
    }

    if (!email.includes("@", ".")) {
        alert("Please enter a valid e-mail address!");
        isValid = false;
    }

    if (password !== repeatedPassword) {
        alert("Inserted passwords do not match!");
        isValid = false;
    }

    if (!termsOfServiceBtn.checked) {
        alert("To create an account, you must agree to the Terms of Service.");
        isValid = false;
    }

}

// future improvements: verify that username and email are not taken


// BACK TO LOGIN PAGE

const loginHereBtn = document.getElementById("loginHereBtn");

if (loginHereBtn) {
    loginHereBtn.addEventListener("click", () => {
        hideElem(registerForm);
        displayElem(loginForm);
    }
    )
};

// DASHBOARD PAGE

// AFTER THE LOGIN

// look for changes of the 'username' property found in Local Storage in order to accurately welcome the user

if (localStorage.username.length) {
    currentUser = new LoggedUser(localStorage.getItem("username"), localStorage.getItem("password"));
    console.log(currentUser);
    currentUser.welcomeUser();
}

// DISPLAY HEADER NAV DROPDOWN WHEN HOVERING OVER 
let dropdownContainer;

function displayDropdownMenu(dropdownNo) {
    dropdownContainer = document.getElementsByClassName("dropdown-container")[dropdownNo];
    selectedButton = document.getElementsByClassName("dropdown-btn")[dropdownNo];

    displayElem(dropdownContainer);

}

// HIDE HEADER NAV DROPDOWN WHEN MOVING MOUSE OUT

function hideDropdownMenu(dropdownNo) {
    dropdownContainer = document.getElementsByClassName("dropdown-container")[dropdownNo];

    hideElem(dropdownContainer);

}


// CHANGE THEME

function setTheme(themeName) {

    document.documentElement.className = themeName;
    localStorage.setItem("theme-preference", themeName);
}

function toggleTheme() {

    if (localStorage.getItem("theme-preference") === "theme-dark") {
        setTheme("theme-light");
        changeThemeText();
    } else {
        setTheme("theme-dark");
        changeThemeText();
    }

};

function changeThemeText() {

    const themeText = document.getElementById("themeText");

    if (localStorage.getItem("language") === "ro") {

        if (localStorage.getItem("theme-preference") === "theme-light") {
            themeText.textContent = "Tema închisă";
        } else {
            themeText.textContent = "Tema deschisă";
        }
    }

    if (localStorage.getItem("language") === "en" || !localStorage.getItem("language")) {

        if (localStorage.getItem("theme-preference") === "theme-dark") {
            themeText.textContent = "Light theme";
        } else {
            themeText.textContent = "Dark theme";
        }

    }

}


// CHANGE LANGUAGE 

const languageText = document.getElementById("languageText");
const changeLangBtn = document.getElementById("changeLangBtn");

if (changeLangBtn) {

    changeLangBtn.addEventListener("click", () => {

        if (localStorage.getItem("language") === "ro") {
            changeLanguage("en");
            setLanguage("en");

        } else {
            changeLanguage("ro");
            setLanguage("ro");
        }
    })

}

// set language selection in local storage

function setLanguage(lang) {
    localStorage.setItem("language", lang);

    if (localStorage.getItem("language") === "ro") {
        languageText.textContent = "EN";
    } else {
        languageText.textContent = "RO";
    }

    // update the language in the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("lang", lang);
    window.history.replaceState({}, '', `${window.location.pathname}?${urlParams.toString()}`);
}

const showUserScore = document.getElementById("showUserScore");

function changeLanguage(lang) {

    const textTranslations = {
        ro: {
            siteName: "Quizul Superlativelor",
            themeText: localStorage.getItem("theme-preference") === "theme-dark" ? "Tema deschisă" : "Tema închisă",
            feedbackText: "Trimite feedback",
            userGreet: "Bine ai venit, " + "",
            headerNavBtn1: "Quizurile mele",
            previousQuizzesBtn: "Quizuri anterioare",
            favCategBtn: "Categorii preferate",
            headerNavBtn2: "Contul meu",
            changeUsernameBtn: "Schimbă numele de utilizator",
            changePasswordBtn: "Schimbă parola",
            deleteAccountBtn: "Ștergere cont",
            logOutBtn: "Deconectare",
            playBtn: "Vreau să joc!",
            difficultyLevel: "Alege nivelul de dificultate:",
            optionEasy: "Ușor",
            optionMedium: "Mediu",
            optionHard: "Greu",
            gameCategory: "Alege categoria:",
            categoryHumanities: "Științe Umaniste",
            categorySocialSciences: "Științe Sociale",
            categoryNaturalSciences: "Științe Naturale",
            startQuizBtn: "Începe jocul!",
            findResultBtn: "Rezultatul meu",
            timeText: "Timp: ",
            resultText: "Felicitări! Scorul tău este: ",
            // scoreText: " din 15.",
            feedbackFormTitle: "Contactează-ne",
            feedbackFormText: "Ai întrebări? Ne-am bucura să le auzim. Trimite-ne un mesaj și vom răspunde cât de repede putem.",
            feedbackFormName: "Nume",
            feedbackFormEmail: "Adresă de e-mail",
            feedbackMsg: "Mesaj",
            submitFeedbackBtn: "Trimite mesaj",
            aboutUsBtn: "Despre Noi",
            termsBtn: "Termeni și Condiții",
            privacyBtn: "Politica de Confidențialitate",
            copyrightText: "Quizul Superlativelor | © 2023 Toate drepturile rezervate."
        },
        en: {
            siteName: "Superlatives Quiz",
            themeText: localStorage.getItem("theme-preference") === "theme-dark" ? "Light theme" : "Dark theme",
            feedbackText: "Send feedback",
            userGreet: "Welcome, " + "",
            headerNavBtn1: "My Quizzes",
            previousQuizzesBtn: "Previous quizzes",
            favCategBtn: "My favourite categories",
            headerNavBtn2: "My Account",
            changeUsernameBtn: "Change username",
            changePasswordBtn: "Change password",
            deleteAccountBtn: "Delete account",
            logOutBtn: "Logout",
            playBtn: "I want to play!",
            difficultyLevel: "Choose your difficulty level:",
            optionEasy: "Easy",
            optionMedium: "Medium",
            optionHard: "Hard",
            gameCategory: "Choose your category:",
            categoryHumanities: "Humanities",
            categorySocialSciences: "Social Sciences",
            categoryNaturalSciences: "Natural Sciences",
            startQuizBtn: "Start the game!",
            findResultBtn: "My results",
            timeText: "Time: ",
            resultText: "Congratulations on finishing the quiz! Your score is: ",
            // scoreText: " out of 15.",
            feedbackFormTitle: "Contact us",
            feedbackFormText: "Got a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
            feedbackFormName: "Name",
            feedbackFormEmail: "E-mail address",
            feedbackMsg: "Message",
            submitFeedbackBtn: "Send message",
            aboutUsBtn: "About Us",
            termsBtn: "Terms and Conditions",
            privacyBtn: "Privacy Policy",
            copyrightText: "Copyright © 2023 Superlatives Quiz All rights reserved."
        }

    }

    for (const elementID in textTranslations[lang]) {

        const element = document.getElementById(elementID);
        const translation = textTranslations[lang][elementID];

        if (element && !element.children) {
            element.textContent = translation;

        } else {

            const elementChildren = Array.from(element.children);

            if (elementID === "scoreText") {

                elementChildren.forEach((child) => {
                    element.removeChild(child);
                });

                element.textContent = translation;

                elementChildren.forEach((child) => {
                    element.insertAdjacentElement("beforebegin", showUserScore);
                });

            }

            elementChildren.forEach((child) => {
                element.removeChild(child);
            });

            element.textContent = translation;

            elementChildren.forEach((child) => {
                element.appendChild(child);
            });

        }

    }

    // reallign the name of the site based on language; doesn't work when refreshing the page/first entering the website

    if (localStorage.getItem("language") === "ro") {
        siteName.style.margin = "2px 0 0 -127px"
    } else {
        siteName.style.margin = "2px 0 0 -140px";
    }

};

// FEEDBACK FORM

const feedbackForm = document.getElementById("feedbackFormContainer");
const websiteButtons = document.querySelectorAll("button:not(#submitFeedbackBtn, #closePopupBtn)");

function showPopup() {
    feedbackForm.style.display = "block";
    // Disable buttons on the website except the ones in the popup
    for (let i = 0; i < websiteButtons.length; i++) {
        websiteButtons[i].disabled = true;
    }
}

// Function to hide the popup
function hidePopup() {
    feedbackForm.style.display = "none";
    // Enable all buttons on the website
    for (let i = 0; i < websiteButtons.length; i++) {
        websiteButtons[i].disabled = false;
    }
}

// display a thank you message to the user who sent feedback

submitFeedbackBtn = document.getElementById("submitFeedbackBtn");

if (submitFeedbackBtn) {

    submitFeedbackBtn.addEventListener("click", () => {
        hidePopup();
        alert("Thank you for taking the time to share your feedback with us!");
    }
    )
}

// DELETE ACCOUNT

const deleteAccountBtn = document.getElementById('deleteAccBtn');

if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener("click", () => {

        if (confirm("Are you sure you want to delete your account?") == true) {
            currentUser.deleteAccount();
        } else {
            alert("Your account won't be deleted.")
        }

    }
    )
};

// LOGOUT

const logOutBtn = document.getElementById('logOutBtn');

if (logOutBtn) {
    logOutBtn.addEventListener("click", () =>
        redirectTo("home")
    )
};


// I WANT TO PLAY

const startQuizBtnContainer = document.getElementById("startQuizBtnContainer");
const playBtnContainer = document.getElementById("playBtnContainer");
const playBtn = document.getElementById("playBtn");
const userChoicesContainer = document.getElementById("userChoicesContainer");
const findResultBtnContainer = document.getElementById("findResultBtnContainer");

if (playBtn) {
    playBtn.addEventListener("click", () => {

        displayElem(userChoicesContainer);
        displayElem(startQuizBtnContainer);
        hideElem(playBtnContainer);

    })
};

// START QUIZ

let countdown;

const questionWrapper = document.getElementById("questionWrapper");

function startCountdown(seconds) {
    let countdownValue = seconds + 1;
    // display the seconds available to answer the question
    document.getElementById("countdownDuration").textContent = seconds + "/";

    countdown = setInterval(() => {
        countdownValue--;

        // Update the no. of seconds as they pass 
        document.getElementById("countdown").innerHTML = "" + countdownValue;

        if (countdownValue === 1) {
            countdownValue = seconds + 1;
        }
    }, 1000);

}


let responsesFromUser = [];

// THIS PART NEEDS TO BE BETTER ORGANIZED IN THE FUTURE; HARD TO READ CODE; TO MOVE SEVERAL FUNCTIONALITIES FROM 
// displayQuestion FUNCTION TO OTHER FUNCTIONS WHICH WILL BE CALLED INSIDE displayQuestion function TO MAKE
// THE CODE EASIER TO FOLLOW & READ

function displayQuestion(data, currentIndex = 0) {

    // timeOutDuration will be used to change the duration of the timeout dynamically
    //  based on the category selected by the user
    let timeOutDuration;

    if (difficultyFromUser === "Easy") {
        startCountdown(13);
        timeOutDuration = 13000;
    }

    if (difficultyFromUser === "Medium") {
        startCountdown(10);
        timeOutDuration = 10000;
    }

    if (difficultyFromUser === "Hard") {
        startCountdown(8);
        timeOutDuration = 8000;
    }

    if (currentIndex < data.length - 1) {

        const currentQuestion = data[currentIndex];

        // flag to keep track of whether user selected a radio button or not
        let userSelected = false;

        // flag to keep track of whether time is over or not
        let TimeOver = false;

        // Create question paragraph and add to the questions container
        const questionsParagraph = document.createElement("p");
        const shownQuestions = document.createTextNode(currentQuestion.question);
        questionsParagraph.append(shownQuestions);
        questionsParagraph.setAttribute("id", "quizQuestion");

        questionWrapper.appendChild(questionsParagraph);

        // Create responses paragraph and add to the questions container
        const responsesParagraph = document.createElement("p");

        let shownResponses = [];
        let radioButtons = [];

        // Add response options to the responses paragraph
        for (let i = 0; i < currentQuestion.responses.length; i++) {
            shownResponses = document.createTextNode(currentQuestion.responses[i].response);
            radioButtons[i] = document.createElement("input")
            radioButtons[i].setAttribute("type", "radio");
            radioButtons[i].setAttribute("name", "options");
            radioButtons[i].setAttribute("value", currentQuestion.responses[i].response);
            //   event listener to each radio button to modify the flag when the user clicks on a radio button. 
            radioButtons[i].addEventListener("change", () => {
                userSelected = true; // set the flag to true when user selects a radio button
            });
            responsesParagraph.append(shownResponses, radioButtons[i]);
        }
        document.getElementById("quizContainer").appendChild(responsesParagraph);

        // Set a timeout to display the next question after 8 seconds

        const nextQuestion = setTimeout(() => {

            if (userSelected) {
                // If the user has a radio button selected when the time to answer the question passed,
                // search for that selected radio button and push its value to the responsesFromUser array
                const selectedButton = radioButtons.find((button) => button.checked);
                responsesFromUser.push(selectedButton.value);
                console.log(responsesFromUser);
            }


            // Remove the current question and responses from the questions container
            document.getElementById("questionWrapper").removeChild(questionsParagraph);
            document.getElementById("quizContainer").removeChild(responsesParagraph);

            // Display the next question and if all questions have been displayed, show button to find result

            if (currentIndex < data.length - 1) {
                displayQuestion(data, currentIndex + 1);

            }

        }, timeOutDuration);
    }

    if (currentIndex >= data.length - 1) {
        clearInterval(countdown);
        hideElem(quizContainer);
        displayElem(findResultBtnContainer);
    }


};

const findResultBtn = document.getElementById("findResultBtn");

if (findResultBtn) {
    findResultBtn.addEventListener("click", () => {

        // TO BE USED IN THE FUTURE TO IMPLEMENT THE FUNCTIONALITY TO VIEW PREVIOUS
        // QUIZZES 
        const dateOfQuiz = new Date();
        let timeOfQuiz = dateOfQuiz.getTime();
        console.log(dateOfQuiz, timeOfQuiz);

        // FIND USER'S SCORE

        const userScoreContainer = document.getElementById("userScoreContainer");

        //filters only the string responses which have the isCorrect property set to
        // true and therefore are the correct answers to the questions

        const correctResponses = quizFromDatabase.map(obj => obj.responses.find(resp => resp.isCorrect).response);

        const userCorrectAnswers = responsesFromUser.filter(ans => correctResponses.includes(ans));

        const userScore = userCorrectAnswers.length + 1;

        displayElem(userScoreContainer);
        showUserScore.innerText = "" + userScore + " / ";
        hideElem(findResultBtnContainer);

        // NOT WORKING; TO DO

        playBtn.textContent = "Start new game";

    })
};

let categoryFromUser = document.getElementById('categoryFromUser')
let difficultyFromUser = document.getElementById('difficultyFromUser');
const quizFromDatabase = [];

const startQuizBtn = document.getElementById("startQuizBtn");
const quizContainer = document.getElementById('quizContainer');

const apiEndpoint = localStorage.getItem("language") === "ro" ? apiQuestionsRO : apiQuestionsEN;


if (startQuizBtn) {
    startQuizBtn.addEventListener("click", () => {

        hideElem(userChoicesContainer);
        hideElem(startQuizBtn);
        displayElem(quizContainer);

        categoryFromUser = categoryFromUser.value;
        difficultyFromUser = difficultyFromUser.value;

        fetch(`${apiEndpoint}?difficulty=${difficultyFromUser}&category=${categoryFromUser}`)
            .then(response => response.json())
            .then(json => {
                quizFromDatabase.push(...json);
                displayQuestion(json);

            });

    })
};


/* Wes Bos JS30 - Countdown Clock */

let countdown;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
// Now let's work with the user input for the time
const buttons = document.querySelectorAll('[data-time]');


function timer(seconds) {
    /* A simple way below - The problem is that sometimes the setInterval may not work, maybe because we change tabs or something. Also on iOS when you are scrolling, the function also stops, probably for a better performance. So we will do it another way. */
    // setInterval(function () {
    //     seconds--;
    // }, 1000);

    // First, lets clear any existing timers!
    clearInterval(countdown);

    // The better way
    // const now = (new Date()).getTime(); - This is an old way of doing get time.
    const now = Date.now(); // miliseconds
    const then = now + seconds * 1000; // * 1000 to make it turn into seconds.
    // Since setInterval will run after one second, we lose the first second, so we will use the function below imediatelly to avoid that.
    displayTimeLeft(seconds);
    displayEndTime(then);

    console.log({now, then});

    // We need to display the ammount of time left. Now setInterval will do fine because we are not really worried if it will work every single second if something happends.
    // If it skips some time, like 2 seconds, it will update 2 seconds later, so it's ok.
    countdown = setInterval(() => {
        const secondsLeft = Math.round((then - Date.now()) / 1000); // We use Date.now again to get the time again and not what got previously.
        // Check if we should stop it:
        if (secondsLeft < 0) {
            /* Just using a return here would not work because it would not display the time.
            That's why we need the countdown variable */
            clearInterval(countdown);
            return;
        }

        // Display it
        displayTimeLeft(secondsLeft);
    }, 1000);
}

function displayTimeLeft(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;
    // We will get a problem, if the seconds are less than 10, we will not get the 0 before the seconds left, so we will use the math inside ${minutes and seconds}.
    const display = `${minutes < 10 ? '0' : ''}${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
    // console.log({minutes, remainderSeconds});
    // We can also display the timer on our browser tab with the code on the next line.
    document.title = display;
    timerDisplay.textContent = display;
};

function displayEndTime(timestamp) {
    const end = new Date(timestamp);
    /* Time will get us a big number, that's because it will display the time of seconds elapsed now, since January 1, 1970 - When God created earth LOL
    Try it on the browser:
    Date.now();
    then do: let time = new Date(the number you got);
    Log the time variable to check.
    You can also use time.getDate(), time.getDay(), time.getMonth(), etc... */
    const hours = end.getHours();
    // Code below to convert the UTC (to not display something like 14:25 European time)
    const adjustedHour = hours > 12 ? hours - 12 : hours;
    const minutes = end.getMinutes();
    endTime.textContent = `Be back at ${adjustedHour}:${minutes < 10 ? '0' : ''}${minutes}`;
};
function startTimer() {
    // This will get the [data-time] from the buttons when the users presses it.
    const seconds = parseInt(this.dataset.time);
    // console.log(seconds);
    timer(seconds);
}

buttons.forEach(button => button.addEventListener('click', startTimer));
// We will select the customForm using the selection by name.
document.customForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const mins = this.minutes.value;
    timer(mins * 60);
    this.reset();
})
export const timer = () => {
  const elem = document.querySelector('.wait__players');
  let timeleft = 20;

  const countdown = () => {
    if (timeleft < 0) {
      clearTimeout(timerId);
      doSomething();
    } else {
      elem.textContent = timeleft;
      timeleft--;
    }
  };
  let timerId = setInterval(countdown, 1000);
};

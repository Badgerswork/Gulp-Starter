import { formatTime } from './modules/clock.js';

const status = document.querySelector('.card__status');

function tick() {
    status.textContent = `Build is live — ${formatTime()}`;
}

tick();
setInterval(tick, 1000);

// === ERROR HANDLING
// ============================================================================

import beep from 'beepbeep';
import notify from 'gulp-notify';
import c from 'ansi-colors';

export function handleError(err) {
    console.log(
        c.bold.bgMagenta(`
        ERROR : ${err.plugin} ::: ${err.message}
`)
    );
    notify.onError(beep([1000, 1000, 2000]));
    this.emit('end');
}

export default { handleError };

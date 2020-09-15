module.exports = function (file) {
    let component = null;
    try {
        component = require('@/views/' + file + '.vue').default;
    } catch (e) {
        console.error(e.message)
    }
    return component;
};

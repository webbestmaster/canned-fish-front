const viewConst = require('./const.json');

export function onResizeScreen() {
    const {documentElement} = document;

    return {
        type: viewConst.type.resize,
        payload: {
            width: documentElement.clientWidth,
            height: documentElement.clientHeight
        }
    };
}

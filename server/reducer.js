import {processMessageChanges} from './message.js';
import {processImageChanges} from './image.js';
import {Map,List} from 'Immutable';

var initStore = function() {
    console.log("Initializing store.");
    var s = Map({
        "Messages":List(),
        "Images":List()
    });
    return s;
}

export default function reducer(state, action) {
    
    switch(action.type) {
        case 'INIT':
            return initStore();
        case 'MESSAGE_CHANGES':
            return processMessageChanges(state, action.changes);
        case 'IMAGE_CHANGES':
            return processImageChanges(state, action.changes);
    }
    return state;
}
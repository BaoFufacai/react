//store核心模块

import {createStore,applyMiddleware} from 'redux'
import reducer from './reducer'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'


//暴露出去
export default createStore(reducer,composeWithDevTools(applyMiddleware(thunk)))


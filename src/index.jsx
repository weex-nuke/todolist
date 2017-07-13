'use strict';
import {createElement, Component,render} from 'rax';
import {View, Text, Modal} from 'nuke';
import { Provider } from 'rax-redux';
import reducers from './redux/reducers/index';
import createStore from './redux/store/index'
import Todo from './container/todo';
const store = createStore(reducers);

class ReduxPage extends Component {
    render() {
        return (
            <Provider store={store}>
                <Todo></Todo>
            </Provider>
        );
    }
}
render(<ReduxPage/>);

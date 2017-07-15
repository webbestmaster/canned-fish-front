import React, {Component} from 'react';
import {connect} from 'react-redux';
import {onResizeScreen} from './action';
import user from './../module/user';

class App extends Component {
    componentDidMount() {
        window.addEventListener('resize', this.props.onResizeScreen, false);
        console.log(user);
    }

    render() {
        const {props} = this;
        const {width, height} = props.screen;

        return <div className="wrapper" style={{width: width + 'px', height: height + 'px'}}>
            <h1>Hi!</h1>
            {props.children}
        </div>;
    }
}

export default connect(
    state => ({
        screen: state.app.screen
    }),
    {
        onResizeScreen
    }
)(App);

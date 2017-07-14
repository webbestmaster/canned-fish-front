import React, {Component} from 'react';
import {Router, Route, IndexRoute} from 'react-router';

import App from './../app';

const routerConst = require('./const.json');

export default class AppRouter extends Component {
    render() {
        return <Router history={this.props.history}>
            <Route path={routerConst.link.root} component={App}/>
        </Router>;
    }
}

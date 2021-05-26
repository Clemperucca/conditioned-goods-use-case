import React from "react";
import {BrowserRouter, Route, Switch, Redirect} from "react-router-dom";

// layouts
import Admin from "layouts/Admin.js";
import Auth from "layouts/Auth.js";

export default function Main() {
    return (
        <BrowserRouter>
            <Switch>
            {/* add routes with layouts */}
            <Route path="/admin" component={Admin} />
            <Route path="/auth" component={Auth} />
            {/* add redirect for first page */}
            <Redirect from="*" to="/admin/" />
            </Switch>
        </BrowserRouter>
    );
}
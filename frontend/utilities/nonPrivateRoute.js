import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from "react-router-dom";

export default function privateRoutes({ component: Component, isAuthenticated: isAuthenticated , ...rest }) {
  
  return (
    
    <Route
      {...rest}
      render={props =>
        !isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/profile",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
} 
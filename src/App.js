import React from 'react';
import './App.css';

//router
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

//spliter for sidebare
import SplitPane from 'react-split-pane';

//comps
import Sidebar from './components/sidebar/Sidebar';
import Header from './components/header/Header';
import Users from './components/routes/users/Users';
import Other from './components/routes/other/Other';

//apollo client
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import { InMemoryCache } from 'apollo-cache-inmemory';
import FormLoader from './components/forms/form_loader/FormLoader';
import { RouterEnum } from './enums/router-enum';



const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache()
});

const resizerStyles = {
  background: '#000',
  width: '2px',
  cursor: 'col-resize',
  margin: '0 5px',
  height: '100%',
};

const sidebarStyles = {
  background: 'rgb(187, 182, 175)'
}

const splitPaneStyle = {
  direction: 'rtl',
  height: "100%"
}


function App() {
  return (
    <ApolloProvider client={client}>
      <div className="app">
        <Router>
          <Header />
          <SplitPane
            split="vertical"
            minSize={100}
            maxSize={200}
            defaultSize={150}
            style={splitPaneStyle}
            pane1Style={sidebarStyles}
            resizerStyle={resizerStyles}
            allowResize={false}
          >
            <Sidebar />
            <div className="routes">
              <Route path={RouterEnum.USERS} component={Users} />
              <Route path={RouterEnum.OTHER} component={Other} />
              <Redirect exact from="/" to={RouterEnum.OTHER} />
            </div>
          </SplitPane>
          <FormLoader />
        </Router>
      </div>
    </ApolloProvider>
  );
}

export default App;

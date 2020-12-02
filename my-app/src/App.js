import React from "react";
import { Route, Switch } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import { NavBar, Footer, Loading } from "./components";
import { Home, Profile, ExternalApi } from "./views";
import "./styles.css";

const App = () => {
    const { isLoading } = useAuth0();
  
    if (isLoading) {
      return <Loading />;
    }
  
    return (
        <div id="app" className="d-flex flex-column h-100">
          <NavBar />
          <div className="container flex-grow-1">
            <Switch>
              <Route path="/" exact component={Home} />
              <ProtectedRoute path="/profile" component={Profile} />
              <ProtectedRoute path="/external-api" component={ExternalApi} />
            </Switch>
          </div>
          <Footer />
        </div>
      );
    };
  export default App;
/*
export default function App() {
  return(
        <div id='body'>
            <Header/>
            <Card 
                className='section'
                img='./Capture1.PNG'
                title='Overview of the Weekly Schedule' 
                description='Here is a weekly schedule for the ME Machines, please login to make a reservation.'
            />
            <LoginContainer/>
        </div>
    );
}

const Header = () =>{
    return(
        <div className='header'>
            <span className='header-title'>
                University of Idaho
            </span>
            <br/>
            <span className="header-text">
                Department of Engineering
            </span>
        </div>
    );
}

const Card = (props) =>{
    return(
        <div className={props.className} >
            <div className="small-div">
                <i className={props.className}></i>
                <img src={props.img} alt=''/>
            </div>

            <div className="big-div">
                <span className='div-title'>
                    {props.title}
                </span>
                <br/>
                <span>
                    {props.description}
                </span>
            </div>
        </div>
    )
}

const LoginContainer = () => {
    return(
        <div className='login-container bg-grey'>
            <span className="div-title">Login</span>
            <div className='login-form'>
                <div id='sect1'>
                     <span>
                        Create an Account
                    </span>
                    <span>
                        Email Address: must be @vandals.uidaho.edu or @uidaho.edu
                    </span>
                    <span>
                    <input type="text" placeholder="email address" className="input-field"/>
                    </span>
                    <span>
                        Email Address: must be @vandals.uidaho.edu or @uidaho.edu
                    </span>
                    <span>
                        <input type="text" placeholder="password" className="input-field"/>
                         <button className="contact-btn">CreateAccount</button>
                    </span>
                    
                </div>
                    
                <div id='sect2'>
                    <span>
                        Login
                    </span>

                    <input type="text" placeholder="email address" className="input-field"/>
                    <input type="text" placeholder="password" className="input-field"/>
                    <button className="contact-btn">Login</button>
                </div>
            </div>
        </div>
    );

}

*/

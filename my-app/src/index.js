import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const Body= ()=>{
  return(
    <div id="body">
      <Header/>
      <Card/>
      <ContactContainer/>
    </div>
  )
}

const Header = () =>{
  return(
    <div className='header'>
      <span className='header-title'>
        University of Idaho
      </span>
      <br/>
      <span className="header-text">
        Machine Scheduling Software for the Department of Engineering
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

// HERE IS WHERE THE PREVIEW OF THE SCHEDULING CALANDER GOES
const Body = () => {
  return(
    <div id='body'>
      <Header/>
      <Card 
          className='section'
          title='Schedule Overview'
          description='Weekly Schedule of Machine Software. Please login to create a reservation.'
      />
    </div>
  )
}

ReactDOM.render(<Body/>, document.getElementById('root'));

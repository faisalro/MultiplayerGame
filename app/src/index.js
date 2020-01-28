import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import GameView from './components/game.js';
import * as serviceWorker from './serviceWorker';

const game = <GameView/>;

export function changeState(registered, loggedin){
	
	if((registered == false) && (loggedin == false)){
		ReactDOM.render(<App registered={registered} loggedin={loggedin} game={<GameView/>}/>, document.getElementById('root'));
	}else{
		ReactDOM.render(<App registered={registered} loggedin={loggedin} game={game}/>, document.getElementById('root'));

	}
}

ReactDOM.render(<App registered={false} loggedin={false} game={game}/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

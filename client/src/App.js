import React, { Component } from "react";
import { useState, useEffect, createContext, useContext } from "react";
import ERC20BasicContract from "./contracts/ERC20Basic.json";
import OddEvenGameP1Contract from "./contracts/OddEvenGameP1.json";
import getWeb3 from "./getWeb3";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowCircleDown } from '@fortawesome/free-solid-svg-icons'

import { Button, Container, Row, Col, Accordion, Card, InputGroup, FormControl, Form, Spinner, Modal, DropdownButton, Dropdown} from 'react-bootstrap';
import styles from "./App.module.css";

const UserContext = createContext();

function MydModalWithGrid(props) {
	const iconStyle: React.CSSProperties = { padding: "10", fontSize: "50", color : "#195e6e" };
	const modalFlexStyle: React.CSSProperties = { display: "flex", flexDirection: "column", alignItems: "center" };
	const footerStle: React.CSSProperties = { justifyContent: "center" };
	const swapButtonStyle: React.CSSProperties = {"width":"295px","backgroundColor":"#1a5e6e","border":"none","borderRadius":"10px","height":"40px"};

	const [swapInfo, setSwapInfo] = useState({token1 : "ETH", amountToken1 : 0.00, token2: "BTLX", amountToken2 : 0.00});
	const [loading, setLoading] = useState({"btn-swap": false});

	const state = useContext(UserContext);

	// Token1 select change
	const token1SelectHandler = (event) => {
		event.preventDefault();

		// Update game info state
		var newSwapInfo = {...swapInfo};
		newSwapInfo.token1 = event.target.value;
		setSwapInfo(newSwapInfo);
	}

	// Token 2 select change
	const token2SelectHandler = (event) => {
		event.preventDefault();

		// Update game info state
		var newSwapInfo = {...swapInfo};
		newSwapInfo.token2 = event.target.value;
		setSwapInfo(newSwapInfo);
	}

	// Token 1 amount input change
	const amountToken1SelectHandler = (event) => {
		event.preventDefault();

		// Update game info state
		var newSwapInfo = {...swapInfo};
		newSwapInfo.amountToken1 = event.target.value;
		setSwapInfo(newSwapInfo);
	}

	// Token 2 amount input change
	const amountToken2SelectHandler = (event) => {
		event.preventDefault();

		// Update game info state
		var newSwapInfo = {...swapInfo};
		newSwapInfo.amountToken2 = event.target.value;
		setSwapInfo(newSwapInfo);
	}

	// Token 2 amount input change
	const amountToken1Blur = (event) => {
		// Update game info state
		var newSwapInfo = {...swapInfo};
		newSwapInfo.amountToken2 = 10000 * newSwapInfo.amountToken1;
		setSwapInfo(newSwapInfo);
	}

	const loadingHandler = (type, isLoading) => {
		// Update loading info
		var newLoadingState = {...loading};
		newLoadingState[type] = isLoading;
		setLoading(newLoadingState);
	}

	const waitForReceipt = (hash, cb) => {
		state.web3.eth.getTransactionReceipt(hash, function (err, receipt) {
		  if (err) {
			alert("err")
		  }
	  
		  if (receipt !== null) {
			// Transaction went through
			if (cb) {
			  cb(receipt);
			}
		  } else {
			// Try again in 1 second
			window.setTimeout(function () {
			  waitForReceipt(hash, cb);
			}, 1000);
		  }
		});
	}

	// Swap token 
	const swapToken = (event) => {
		// Display waiting
		// props.onHide
		loadingHandler(event.target.id, true);
		let txhash;
		state.tokenContract.methods.swap().send({ from: state.accounts[0], value : swapInfo.amountToken1 * 10 ** 18 }).then(function(result) {
			txhash = result.transactionHash;

			// Wait for transaction confirm
			waitForReceipt(txhash, function () {
				// Hide waiting and load token
				loadingHandler(event.target.id, false);
				props.onHide();
			});
		}).catch(function(err) {
			console.log(err.message);
		});
	}

	return (
	  <Modal {...props} aria-labelledby="contained-modal-title-vcenter">
		<Modal.Header closeButton>
		  <Modal.Title id="contained-modal-title-vcenter">
			Choose token to swap
		  </Modal.Title>
		</Modal.Header>
		<Modal.Body className="show-grid">
		  <Container style={modalFlexStyle}>
			<Row>
			  <Col xs={12} md={12}>
				<InputGroup className="mb-1">
					<Form.Select value={swapInfo.token1} onChange={token1SelectHandler}>
						<option>ETH</option>
						<option>BTLX</option>
					</Form.Select>
					<FormControl aria-label="Text input with dropdown button" value={swapInfo.amountToken1} onChange={amountToken1SelectHandler} onBlur={amountToken1Blur}/>
				</InputGroup>
			  </Col>
			</Row>
  
			<Row>
			  <Col xs={12} md={12}>
			  	<FontAwesomeIcon style={iconStyle} icon={faArrowCircleDown} />
			  </Col>
			</Row>
			<Row>
			  <Col xs={12} md={12}>
			  <InputGroup className="mb-1">
					<Form.Select value={swapInfo.token2} onChange={token2SelectHandler}>
						<option>BTLX</option>
						<option>ETH</option>
					</Form.Select>
					<FormControl aria-label="Text input with dropdown button" value={swapInfo.amountToken2} onChange={amountToken2SelectHandler}/>
				</InputGroup>
			  </Col>
			</Row>
		  </Container>
		</Modal.Body>
		<Modal.Footer style={footerStle}>
		{ 	loading["btn-swap"] ? 
		  	<Spinner style={{"marginLeft":"10px"}} animation="border" variant="info" /> :
			<Button id="btn-swap" onClick={swapToken} style={swapButtonStyle}>Swap</Button>
		}
		</Modal.Footer>
	  </Modal>
	);
}

function App() {
	const [modalShow, setModalShow] = useState(false);
	const [count, setCount] = useState(0);
	const [state, setState] = useState({ storageValue: 0, web3: null, accounts: null, tokenContract: null, gameContract: null, firstAccountToken: 0 });
	const [currentAccountInfo, setCurrentAccountInfo] = useState("");
	const [loading, setLoading] = useState({"btn-mint": false, "btn-newgame": false});
	const [gameInfo, setGameInfo] = useState({hostInput: 0, tokenPerPlayer: 5, endBidTime: 90, numPlayers: 1})
	const [gameListCreated, setGameListCreated] = useState([{gameID: "0x00", nonce: 0}]);

	var initGameState = {gameID: "0x00", hostAddress: "0x00", endBidTime: "2000/01/01", endGameTime : "2000/01/01", numPlayers: 1, curState: "2", hostReview : "", playerBid : ""};
	const [gameListOpening, setGameListOpening] = useState([initGameState]);
	const GAMESTATE = {"0" : "WAIT BIDDING", "1" : "WAIT REVIEW", "2" : "ENDED", "3" : "NONE PLAYERS", "4" : "HOST NOT REVIEW"}


	useEffect(() => {
		// Runs only on the first render
		// Init web3 info
		async function initWeb3() {
			try {
				// Get network provider and web3 instance.
				const web3 = await getWeb3();

				// Use web3 to get the user's accounts.
				const accounts = await web3.eth.getAccounts();

				// Get the contract instance.
				const networkId = await web3.eth.net.getId();

				// Token contract
				const deployedTokenNetwork = ERC20BasicContract.networks[networkId];
				const instanceToken = new web3.eth.Contract(
					ERC20BasicContract.abi,
					deployedTokenNetwork && deployedTokenNetwork.address,
				);

				// Game contract
				const deployedGameNetwork = OddEvenGameP1Contract.networks[networkId];
				const instanceGame = new web3.eth.Contract(
					OddEvenGameP1Contract.abi,
					deployedGameNetwork && deployedGameNetwork.address,
				);

				// Set web3, accounts, and contract to the state, and then proceed with an
				// example of interacting with the contract's methods.
				var newState = {...state};
				newState.web3 = web3;
				newState.accounts = accounts;
				newState.tokenContract = instanceToken;
				newState.gameContract = instanceGame;
				setState(newState);

				// Set current account information
				setCurrentAccountInfo(accounts[0]);

				// Call function storageValue
				//runExample(newState);

			} catch (error) {
				// Catch any errors for any of the above operations.
				alert(
				`Failed to load web3, accounts, or contract. Check console for details.`,
				);
				console.error(error);
			}
		}

		initWeb3();
		// runExample();
	}, []);
	
	useEffect(() => {
		// Runs only on the first render
		// Init web3 info
		async function refreshWhenChangeAccount() {
			try {
				if (state.accounts == null) {
					return;
				}

				loadTokenBalance();
				loadGameList();

			} catch (error) {
				// Catch any errors for any of the above operations.
				alert(
				`Failed to load token balance.`,
				);
				console.error(error);
			}
		}

		refreshWhenChangeAccount();
	}, [currentAccountInfo, gameListCreated.length]);

	const waitForReceipt = (hash, cb) => {
		state.web3.eth.getTransactionReceipt(hash, function (err, receipt) {
		  if (err) {
			alert("err")
		  }
	  
		  if (receipt !== null) {
			// Transaction went through
			if (cb) {
			  cb(receipt);
			}
		  } else {
			// Try again in 1 second
			window.setTimeout(function () {
			  waitForReceipt(hash, cb);
			}, 1000);
		  }
		});
	}

	// Metamask change account
	window.ethereum.on('accountsChanged', function (accountInfo) {
		var newState = {...state};
		newState.accounts = accountInfo;
		setState(newState);

		// Set current account information
		// if web3 loaded
		if (newState.web3) {
			setCurrentAccountInfo(accountInfo[0]);
		}
	});

	// -----------------
	// ELEMENT EVENT AREA
	// -----------------
	// Mint token 
	const mintToken = (event) => {
		// Display waiting
		loadingHandler(event.target.id, true);
		let txhash;
		state.tokenContract.methods.mint(state.accounts[0], 10, state.gameContract._address).send({ from: state.accounts[0] }).then(function(result) {
			txhash = result.transactionHash;

			// Wait for transaction confirm
			waitForReceipt(txhash, function () {
				// Hide waiting and load token
				loadingHandler(event.target.id, false);
				loadTokenBalance();
			});
		}).catch(function(err) {
			console.log(err.message);
		});
	}

	// Host creat new game
	const startNewGameHandler = (event) => {
		event.preventDefault();
		loadingHandler(event.target.id, true);

		// Update game info state
		var newGameListCreated = [...gameListCreated];
		var newGameItem = {gameID : "0x00", nonce : getNonce()};

		// Solidity hash host selection
		let txhash;
		let hashHostSelection = state.web3.utils.soliditySha3(gameInfo.hostInput, newGameItem.nonce);

		// Send transaction
		state.tokenContract.methods.approve(
			state.gameContract._address,
			gameInfo.tokenPerPlayer,
		).send({ from : state.accounts[0] })
		.then(function(result) {
			// Send transaction
			state.gameContract.methods.newGame(
				hashHostSelection,
				gameInfo.endBidTime,
				gameInfo.tokenPerPlayer,
				gameInfo.numPlayers
			).send({ from : state.accounts[0] })
			.then(function(result) {
				txhash = result.transactionHash;
				newGameItem.gameID = result.events.StartGame.returnValues._gameID;
				newGameListCreated.push(newGameItem);
				setGameListCreated(newGameListCreated);
				
				// Save nonce to local storage
				localStorage.setItem(newGameItem.gameID, newGameItem.nonce);

				// Wait for transaction confirm
				waitForReceipt(txhash, function () {
					// Hide waiting and load token
					loadingHandler(event.target.id, false);
					loadTokenBalance();
				});

			}).catch(function(err) {
				console.log(err.message);
			});

		}).catch(function(err) {
			console.log(err.message);
		});
	}

	// Random number
	const ranDom = (event) => {
		event.preventDefault();
		var randomValue = Math.floor(Math.random() * 2 ** 32);
		var isOdd = randomValue & 1;

		// Update game info state
		var newGameInfo = {...gameInfo};

		// Odd btn click
		if (event.currentTarget.id == "btn-random-odd") {
			if (isOdd) newGameInfo.hostInput = randomValue;
			else newGameInfo.hostInput = randomValue - 1;
		
		// Even btn click
		} else {
			if (isOdd) newGameInfo.hostInput = randomValue - 1;
			else newGameInfo.hostInput = randomValue;
		}

		setGameInfo(newGameInfo);
	}

	// Get account token balance
	const loadTokenBalance = async () => {
		const response = await state.tokenContract.methods.balanceOf(state.accounts[0]).call();

		// Set token balance to state
		var newState = {...state};
		newState.firstAccountToken = response;
		setState(newState);
	}

	// Load list game opening
	const loadGameList = async () => {
		const response = await state.gameContract.methods.getListGameInfo().call();

		// Set to state
		let gameIDList = response[0];
		let endBidTimeList = response[1];
		let hostAddressList =  response[2];
		let gameStateList = response[3];
		let totalPlayerList  = response[4];
		let endGameTimeList  = response[5];

		var newGameListOpening = [initGameState];

		for(var i = 0; i < gameIDList.length; i++) {
			// Game already ended
			if (gameStateList[i] == "2") {
				continue;
			}

			// Openning
			newGameListOpening.push({
				gameID : gameIDList[i],
				hostAddress : hostAddressList[i],
				endBidTime : endBidTimeList[i],
				endGameTime : endGameTimeList[i],
				numPlayers : totalPlayerList[i],
				curState : gameStateList[i],
				hostReview : "",
				playerBid : ""
			})
		}
		
		// Update state
		setGameListOpening(newGameListOpening);
	}

	// Host review button click
	const sendHostReview = async (event, props, index) => {
		let txhash;
		let nonceInfo = localStorage.getItem(props.gameID);

		// Send transaction
		state.gameContract.methods.hostAnswerAndEndgame(
			props.gameID, props.hostReview,  nonceInfo
		).send({ from : state.accounts[0] })
		.then(function(result) {
			txhash = result.transactionHash;

			// Wait for transaction confirm
			waitForReceipt(txhash, function () {
				// Hide waiting and load token
				loadTokenBalance();
				loadGameList();

				// Remove from local storage
				localStorage.removeItem(props.gameID);

			});
		}).catch(function(err) {
			console.log(err.message);
		});
	}

	// None player, host close game
	const sendHostCloseGame = async (event, props, index) => {
		event.preventDefault();
		let txhash;
	
		// Send transaction
		state.gameContract.methods.hostAnswerAndEndgame(
			props.gameID, 1,  0
		).send({ from : state.accounts[0] })
		.then(function(result) {
			txhash = result.transactionHash;

			// Wait for transaction confirm
			waitForReceipt(txhash, function () {
				// Hide waiting and load token
				loadTokenBalance();
				loadGameList();

				// Remove from local storage
				localStorage.removeItem(props.gameID);

			});
		}).catch(function(err) {
			console.log(err.message);
		});
	}

	// Player bid button click
	const sendBidPlayer = async (event, props, index) => {
		let txhash;

		state.tokenContract.methods.approve(
			state.gameContract._address,
			gameInfo.tokenPerPlayer,
		).send({ from : state.accounts[0] })
		.then(function(result) {
			// Send transaction
			state.gameContract.methods.bid(
				props.gameID, props.playerBid
			).send({ from : state.accounts[0] })
			.then(function(result) {
				txhash = result.transactionHash;

				// Wait for transaction confirm
				waitForReceipt(txhash, function () {
					// Hide waiting and load token
					loadTokenBalance();
					loadGameList();
				});
			}).catch(function(err) {
				console.log(err.message);
			});

		}).catch(function(err) {
			console.log(err.message);
		});
	}

	// Host dint click review, so player close game
	const sendPlayerCloseGame = async (event, props, index) => {
		let txhash;

		// Send transaction
		state.gameContract.methods.endGameForPlayer(
			props.gameID
		).send({ from : state.accounts[0] })
		.then(function(result) {
			txhash = result.transactionHash;

			// Wait for transaction confirm
			waitForReceipt(txhash, function () {
				// Hide waiting and load token
				loadTokenBalance();
				loadGameList();
			});
		}).catch(function(err) {
			console.log(err.message);
		});
	}

	// -----------------
	// STATE HANDLER
	// -----------------
	const loadingHandler = (type, isLoading) => {
		// Update loading info
		var newLoadingState = {...loading};
		newLoadingState[type] = isLoading;
		setLoading(newLoadingState);
	}

	// Host input number handler
	const hostInputHandler = (event) => {
		event.preventDefault();

		// Update game info state
		var newGameInfo = {...gameInfo};
		newGameInfo.hostInput = event.target.value;
		setGameInfo(newGameInfo);
	}

	// Host input number handler
	const tokenPerPlayerHandler = (event) => {
		event.preventDefault();

		// Update game info state
		var newGameInfo = {...gameInfo};
		newGameInfo.tokenPerPlayer = event.target.value;
		setGameInfo(newGameInfo);
	}

	// End bid time handler
	const endBidTimeHandler = (event) => {
		event.preventDefault();

		// Update game info state
		var newGameInfo = {...gameInfo};
		newGameInfo.endBidTime = event.target.value;
		setGameInfo(newGameInfo);
	}
	
	// End bid time handler
	const numberOfPlayerHandler = (event) => {
		event.preventDefault();

		// Update game info state
		var newGameInfo = {...gameInfo};
		newGameInfo.numPlayers = event.target.value;
		setGameInfo(newGameInfo);
	}

	// Host review handler
	const hostReviewHandler = (event, props, index) => {
		event.preventDefault();

		// Update game info state
		var newGameListOpening = [...gameListOpening];
		newGameListOpening[index].hostReview = event.target.value;
		setGameListOpening(newGameListOpening);
	}

	// Player bid input handler
	const playerBidHandler = (event, props, index) => {
		event.preventDefault();

		// Update game info state
		var newGameListOpening = [...gameListOpening];
		newGameListOpening[index].playerBid = event.target.value;
		setGameListOpening(newGameListOpening);
	}

	//  32 bit random function
	const getNonce = () => {
		return Math.floor(Math.random() * 2 ** 32);
	}

	const toTimeFormat = (epocVal) => {
		let dCal = new Date(epocVal * 1000);
		return dCal.getFullYear() + '/' + parseInt(dCal.getUTCMonth() + 1) + '/' + dCal.getDate() + ' ' + dCal.toTimeString().split(' ')[0];
	}

	// Current game state
	const calculateState = (state, endbid, endgame) => {
		let curDate = new Date();
		let dateEndBid = new Date(endbid * 1000);
		let dateEndGame = new Date(endgame * 1000)
		if (curDate > dateEndBid && state == "0") {
			// None players
			return GAMESTATE["3"];
		} else if (curDate > dateEndGame && state == "1") {
			// Host didnt review
			return GAMESTATE["4"];
		} else {
			return GAMESTATE[state];
		}
	}

	// -----------------
	// COMPONENT AREA
	// -----------------
	// New game component
	function NewGame() {
		return (
			<Accordion defaultActiveKey="1">
				<Accordion.Item eventKey="1">
					<Accordion.Header>Click me ! to start new game.</Accordion.Header>
					<Accordion.Body>
						<Container style={{"padding": "0px"}}>
							<Row>
								<Col>
									<Form>
										<Row className="mb-3">
											<Form.Group as={Col} controlId="input-host">
											<Form.Label>Host Selection</Form.Label>
											<Form.Control placeholder="Input or random your number" value={gameInfo.hostInput} onChange={hostInputHandler} />
											</Form.Group>

											<Form.Group as={Col} controlId="randomNumer" style={{"paddingTop": "32px"}}>
											<Button as={Col} variant="outline-secondary" onClick={ranDom} id="btn-random-odd" >Odd</Button>
											<Button as={Col} variant="outline-secondary" onClick={ranDom} id="btn-random-even" style={{"marginLeft": "10px"}}>Even</Button>
											</Form.Group>
										</Row>

										<Row className="mb-3">
											<Form.Group as={Col} controlId="formPerPlayer">
											<Form.Label>Token per player</Form.Label>
											<Form.Control value={gameInfo.tokenPerPlayer} onChange={(event) => tokenPerPlayerHandler(event)}/>
											</Form.Group>

											<Form.Group as={Col} controlId="formTimeEndBid">
											<Form.Label>End bid time (second)</Form.Label>
											<Form.Select value={gameInfo.endBidTime} onChange={(event) => endBidTimeHandler(event)}>
												<option>60</option>
												<option>90</option>
												<option>120</option>
											</Form.Select>
											</Form.Group>

											<Form.Group as={Col} controlId="formNumberOfPlayer">
											<Form.Label>Players</Form.Label>
											<Form.Control value={gameInfo.numPlayers} onChange={(event) => numberOfPlayerHandler(event)}/>
											</Form.Group>
										</Row>



										{ loading["btn-newgame"] ? 
										<Spinner style={{"marginLeft":"10px"}} animation="border" variant="info" /> :
										<Button id="btn-newgame" variant="danger" type="submit" onClick={startNewGameHandler}>
											Start Game
										</Button>										}
									</Form>
								</Col>
							</Row>
						</Container>
					</Accordion.Body>
				</Accordion.Item>
			</Accordion>
		);
	}

	// Game info component
	//var initGameState = {gameID: "0x00", hostAddress: "0x00", endBidTime: "2000/01/01", numPlayers: 1, curState: "2", hostReview : "", playerBid : ""};
	function GameInfo(gameItemProps) {
		if (gameItemProps.props.curState == "2") {
			return "";
		} else {
			// If host : hide bid input and button, if bid endtime before : hide host review and input1
			// If player : hide review input and button

			return (
				<Card>
					<Card.Header>ID : {gameItemProps.props.gameID}</Card.Header>
					<Card.Body>
						<Card.Title>Game information</Card.Title>
						<Card.Text>
						Host : { gameItemProps.props.hostAddress }
						</Card.Text>
						<Card.Text>
						End bid time : { toTimeFormat(gameItemProps.props.endBidTime) }
						</Card.Text>
						<Card.Text>
						Players : { gameItemProps.props.numPlayers }
						</Card.Text>
						<Card.Text>
						Status : { calculateState(gameItemProps.props.curState, gameItemProps.props.endBidTime, gameItemProps.props.endGameTime) }
						</Card.Text>
						<div className={styles.hostplayeraws}>
							{/* Is Host and Biding Game */}
							{(state.accounts[0]).toLowerCase() == (gameItemProps.props.hostAddress).toLowerCase() && calculateState(gameItemProps.props.curState, gameItemProps.props.endBidTime, gameItemProps.props.endGameTime) ==  GAMESTATE["1"] &&
							<InputGroup className="mb-3">
								<FormControl
								placeholder="Host review number"
								aria-describedby="basic-addon2"
								value={gameItemProps.props.hostReview}
								onChange={(event) => hostReviewHandler(event, gameItemProps.props, gameItemProps.idx)}
								/>
								<Button variant="outline-danger" id="btn-hostreview" onClick={(event) => sendHostReview(event, gameItemProps.props, gameItemProps.idx)}>
								Review now
								</Button>
							</InputGroup>
							}
							{/* Is Host and None Player */}
							{(state.accounts[0]).toLowerCase() == (gameItemProps.props.hostAddress).toLowerCase() && calculateState(gameItemProps.props.curState, gameItemProps.props.endBidTime, gameItemProps.props.endGameTime) ==  GAMESTATE["3"] &&
							<InputGroup className="mb-3">
								<Button variant="outline-danger" id="btn-hostclosegame" onClick={(event) => sendHostCloseGame(event, gameItemProps.props, gameItemProps.idx)}>
								Oops ! Close now
								</Button>
							</InputGroup>
							}							
							{/* Is Player and New Game */}
							{(state.accounts[0]).toLowerCase() != (gameItemProps.props.hostAddress).toLowerCase() && calculateState(gameItemProps.props.curState, gameItemProps.props.endBidTime, gameItemProps.props.endGameTime) ==  GAMESTATE["0"]  &&
							<InputGroup className="mb-3">
								<FormControl
								placeholder="Player bid number"
								aria-describedby="basic-addon2"
								value={gameItemProps.props.playerBid}
								onChange={(event) => playerBidHandler(event, gameItemProps.props, gameItemProps.idx)}
								/>
								<Button variant="outline-warning" id="btn-bid" onClick={(event) => sendBidPlayer(event, gameItemProps.props, gameItemProps.idx)}>
								Bid now
								</Button>
							</InputGroup>
							}
							{/* Is Player and Host didnt close game */}
							{(state.accounts[0]).toLowerCase() != (gameItemProps.props.hostAddress).toLowerCase() && calculateState(gameItemProps.props.curState, gameItemProps.props.endBidTime, gameItemProps.props.endGameTime) ==  GAMESTATE["4"]  &&
							<InputGroup className="mb-3">
								<Button variant="outline-warning" id="btn-playerclosegame" onClick={(event) => sendPlayerCloseGame(event, gameItemProps.props, gameItemProps.idx)}>
								Close to win !
								</Button>
							</InputGroup>
							}
						</div>
					</Card.Body>
				</Card>
			);
		}
	}

	// Footer component
	function Footer() {
		return (
			<div>
			  <div className={styles.phantomStyle} />
			  <div id="myaccount" className={styles.footerStyle}>Your address : {state.accounts != null ? state.accounts[0] : "No Info"}</div>
			</div>
		);
	}

	const afterSwap = () => {
		setModalShow(false);
		loadTokenBalance();
	}

	return (
		<>
			<Container style={{"paddingTop" : "10px"}}>
				<Row style={{"alignItems": "center"}}>
					<Col sm={6}>
						<h1>Odd Even Game</h1>
					</Col>
					<Col sm={6} className={styles.tokendisplay}>
						<span style={{"fontSize":"18px"}}>{state.firstAccountToken}&nbsp;BTLX</span>
						{ loading["btn-mint"] ? 
						<Spinner style={{"marginLeft":"10px"}} animation="border" variant="info" /> :
						<Button style={{"width":"120px","marginLeft":"10px"}} variant="outline-info" id="btn-mint" onClick={() => setModalShow(true)}>Swap</Button>
						}
						<UserContext.Provider value={state}>
							<MydModalWithGrid show={modalShow} onHide={() => afterSwap()} />
						</UserContext.Provider>
					</Col>
				</Row>
				<Row>
					<Col sm={12}>
						<hr/>
						<br/>
					</Col>
				</Row>
				<Row id="newGame">
					<Col sm={12}>
						<NewGame />
					</Col>
				</Row>
					<br />
				<Row>
					<Container id="petsRow" className={styles.rowgameinfo}>
						{gameListOpening.map((gameItemProps, index) => <GameInfo key={index} props={gameItemProps} idx={index} />)}
					</Container>
				</Row>
			</Container>
			<Footer />
		</>
	);
}

export default App;

import React, { useState } from 'react';
import './styles/App.css';
import ReactCardFlip from 'react-card-flip';
import FrontComponent from './components/FrontComponent';
import BackComponent from './components/BackComponent';
import Game from './firebase/games';
import Cookies from 'universal-cookie';
import Modal from 'react-awesome-modal';
import Loading from './components/Loading';
import LoadingSquare from './components/LoadingSquare';


const cookies = new Cookies();


/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
const shuffle = ( a ) => {
  for( let i = a.length - 1; i > 0; i-- ) {
    const j = Math.floor( Math.random() * (i + 1) );
    [ a[ i ], a[ j ] ] = [ a[ j ], a[ i ] ];
  }
  return a;
};

const App = () => {

  const cardDeckTemplate = [
    {
      'text': '5 Abdominales',
      'isFlipped': true
    },
    {
      'text': '15 Portales',
      'isFlipped': true,
    },
    {
      'text': '15 Abdominales',
      'isFlipped': true,
    },
    {
      'text': '5 Portales',
      'isFlipped': true,
    },
    {
      'text': '20 Sapitos',
      'isFlipped': true
    },
    {
      'isFlipped': true,
      'text': '5 Abdominales'
    },
    {
      'isFlipped': true,
      'text': '15 Abdominales'
    },
    {
      'text': '10 Flexiones',
      'isFlipped': true
    },
    {
      'text': '25 Abdominales',
      'isFlipped': true,
    },
    {
      'text': '20 Sapitos',
      'isFlipped': true
    },
    {
      'text': '5 Portales',
      'isFlipped': true,
    },
    {
      'text': '10 Flexiones',
      'isFlipped': true,
    },
    {
      'text': '15 Portales',
      'isFlipped': true,
    },
    {
      'text': '25 Abdominales',
      'isFlipped': true,
    },
  ];

  const [ gameId, setGameId ] = useState( null );
  const [ cardDeck, setCardDeck ] = useState( [] );
  const [ flipped1, setFlipped1 ] = useState( null );
  const [ flippedCounter, setFlippedCounter ] = useState( 0 );
  const [ currentPlayer, setCurrentPlayer ] = useState( 0 );
  const [ thisPlayer, setThisPlayer ] = useState( {} );
  const [ players, setPlayers ] = useState( [] );
  const [ currentColor, setCurrentColor ] = useState( 'transparent' );
  const [ showInstructions, setShowInstructions ] = useState( true );
  const [ showSelectPlayerColor, setShowSelectPlayerColor ] = useState( false );
  const [ gettingGame, setGettingGame ] = useState( false );
  let playerUID = cookies.get( 'playerUID' ); // if the user has already an UID
  const [ loading, setLoading ] = useState( false );

  React.useEffect( () => {
    if( !playerUID ) {
      playerUID = Game.generatePlayerId();
    }
    // console.log( 'playerUID', playerUID );
    const initGame = async() => {
      if( gameId ) {
        setShowInstructions( false );

        setGettingGame( true );
        const gameSnap = await Game.get( gameId );
        setGettingGame( false );
        // TODO unsubscribe
        gameSnap.onSnapshot( ( game ) => {
          // console.log( 'game.exists', game.exists );
          if( !game.exists ) {
            setShowInstructions( true );
            return;
          }
          // console.log( 'game', JSON.stringify( game.data(), null, 2 ) );
          setCardDeck( game.data().cardDeck );
          setCurrentPlayer( game.data().currentPlayer );
          setPlayers( game.data().players );
          if( game.data().players.length > 0 ) {
            setCurrentColor( game.data().players[ game.data().currentPlayer ].color );
          }
        } );
      }
    };
    initGame();
  }, [ gameId ] );

  const startNewGame = async() => {
    setLoading( true );
    const docRef = await Game.add( shuffle( cardDeckTemplate ) );
    // console.log( 'docRef.id', docRef.id );
    setGameId( docRef.id );
    setLoading( false );
  };

  // const onChangeGameID = ( e ) => {
  //   if( e.target.value !== '' ) {
  //     setGameId( e.target.value );
  //   }
  // };

  const joinGame = async() => {
    if( document.querySelector( '#game-id' ).value ) {
      setGameId( document.querySelector( '#game-id' ).value );
      // const gameSnap = await Game.get( document.querySelector( '#game-id' ).value  );
      // setGettingGame( false );
      // // TODO unsubscribe
      // gameSnap.onSnapshot( ( game ) => {
      //   console.log( 'game.exists', game.exists );
      //   if( !game.exists ) {
      //     return;
      //   }
      //   console.log( 'game', JSON.stringify( game.data(), null, 2 ) );
      //   setCardDeck( game.data().cardDeck );
      //   setCurrentPlayer( game.data().currentPlayer );
      //   setPlayers( game.data().players );
      //   if( game.data().players.length > 0 ) {
      //     setCurrentColor( game.data().players[ game.data().currentPlayer ].color );
      //   }
      // } );

      // Generate a unique ID for this device/user
      // if( !playerUID ) {
      //   playerUID = Game.generatePlayerId();
      // }
      // console.log( 'playerUID', playerUID );

      setShowInstructions( false );
    }
  };

  // Check if player has joined
  React.useEffect( () => {
    if( gameId ) {
      // console.log( 'players Effect', players );
      const alreadyJoined = players.some( ( player ) => {
        return player.uid === playerUID;
      } );

      // console.log( 'alreadyJoined', alreadyJoined );

      if( !alreadyJoined ) {
        // Select color
        setShowSelectPlayerColor( true );
      }
    }
  }, [ players ] );

  const setPlayer = async( playerData ) => {
    // console.log( 'players', players );
    const color1Players = players.filter( ( player ) => {
      return player.color === '#ffc300';
    } );

    const color2Players = players.filter( ( player ) => {
      return player.color === '#ff4e15';
    } );

    // console.log( 'playerData', playerData );
    const newPlayer = {
      uid: playerUID,
      color: playerData.color,
      name: playerData.name
    };

    // console.log( 'newPlayer', newPlayer );


    setThisPlayer( newPlayer );

    if( players[ 0 ] ) {
      if( playerData.color === '#ffc300' ) {
        color1Players.push( newPlayer );
      } else {
        color2Players.push( newPlayer );
      }

      // console.log( 'color1Players', color1Players );
      // console.log( 'color2Players', color2Players );

      let playersUpdated = [];
      if( players[ 0 ].color === '#ffc300' ) {
        playersUpdated = color1Players.map( ( v, i ) => {
          if( color2Players[ i ] ) {
            return [ v, color2Players[ i ] ];
          } else {
            return [ v ];
          }
        } )
          .reduce( ( a, b ) => a.concat( b ) );
      } else {
        playersUpdated = color2Players.map( ( v, i ) => {
          if( color1Players[ i ] ) {
            return [ v, color1Players[ i ] ];
          } else {
            return [ v ];
          }
        } )
          .reduce( ( a, b ) => a.concat( b ), [] );
      }
      // console.log( 'playersUpdated', playersUpdated );
      await Game.updatePlayers( gameId, playersUpdated );
    } else {
      await Game.updatePlayers( gameId, [ newPlayer ] );
    }
    setShowSelectPlayerColor( false );
  };

  const getNextPlayer = () => {
    let nextPlayer = 0;

    if( currentPlayer < players.length - 1 ) {
      nextPlayer = currentPlayer + 1;
    }

    // console.log( 'nextPlayer', nextPlayer );
    return nextPlayer;
  };

  const flipCard = async( index ) => {

    if( players[ currentPlayer ].uid === playerUID ) {
      if( cardDeck[ index ].isFlipped && flippedCounter < 2 ) {
        setLoading( true );
        let flippedCard = {
          ...cardDeck[ index ],
          index
        };

        let nextPlayer = currentPlayer;

        cardDeck[ index ].isFlipped = !flippedCard.isFlipped;
        setFlippedCounter( flippedCounter + 1 );
        console.log( 'flippedCounter', flippedCounter );

        await Game.updateStatus( gameId, cardDeck, nextPlayer );
        if( flipped1 === null ) {
          console.log( 'Flipped 1' );
          setFlipped1( flippedCard );
          setLoading( false );
        } else {

          if( flipped1.text === flippedCard.text ) {
            console.log( 'Correcto' );
            setFlipped1( null );
            cardDeck[ flipped1.index ].color = players[ currentPlayer ].color;
            cardDeck[ flippedCard.index ].color = players[ currentPlayer ].color;
            await Game.updateStatus( gameId, cardDeck, nextPlayer );
            setFlippedCounter( 0 );
            setLoading( false );

          } else {
            console.log( 'NO' );
            setLoading( false );
            setTimeout( async() => {
              cardDeck[ flipped1.index ].isFlipped = true;
              cardDeck[ flippedCard.index ].isFlipped = true;
              setFlipped1( null );
              setFlippedCounter( 0 );
              nextPlayer = getNextPlayer();
              setLoading( true );
              await Game.updateStatus( gameId, cardDeck, nextPlayer );
              setLoading( false );
            }, 1000 );
          }
        }

      }
    }

  };

  return (
    <>
      { loading && <LoadingSquare /> }
      { gameId && players.length > 0 &&
      <div className='container'>
        <div className='greeting'>
          <h1>Hola { thisPlayer.name }</h1>
        </div>
        <div className='invite-text'>
          Invita a tus amigos a que se unan con este ID:
        </div>

        <div className='game-id'>
          { gameId }
        </div>
        <div className='title'>
          <span>Turno de </span>
          <div style={ {
            width: 'auto',
            backgroundColor: currentColor,
            marginLeft: '10px',
            height: '100%',
            padding: '0 10px',
            textAlign: 'center',
            alignItems: 'center',
            display: 'flex'
          } }>
            { players[ currentPlayer ].name }
          </div>
        </div>

        <div>
          <button onClick={ () => setShowInstructions( true ) }>Ver instrucciones</button>
        </div>

        <div className='App'>
          {
            cardDeck.map( ( card, index ) =>
              <ReactCardFlip key={ index } isFlipped={ card.isFlipped } flipDirection='horizontal'>
                {
                  !card.isFlipped && <FrontComponent handleClick={ () => flipCard( index ) }
                                                     value={ card.text }
                                                     playerColor={ card.color } />
                }
                <BackComponent handleClick={ () => flipCard( index ) } number={ index + 1 } />
              </ReactCardFlip>
            )
          }
        </div>
      </div>
      }


      <Modal
        visible={ showInstructions }
        width='400'
        // height='300'
        effect='fadeInUp'
        // onClickAway={ () => setShowInstructions( false ) }
      >
        <div className='instructions-wrapper modal-content'>
          <h1>Pares Fit</h1>
          <ul>
            <li>Deben jugar mínimo dos jugadores o equipos.</li>
            <li>Selecciona una carta y encuentra el par.</li>
            <li>Si aciertas puedes continuar con tu turno. Si fallas es el turno del otro equipo.</li>
            <li>Al final, el equipo contrario tendrá que realizar los ejercicios mostrados en las cartas que tú
              acertaste.
            </li>
          </ul>

          <div className='section-new-game'>
            <button onClick={ startNewGame }>Empezar un nuevo juego</button>
          </div>

          <div className='section-join-game'>
            <h2>Tengo el ID de un juego</h2>
            <input type='text' id='game-id' placeholder='Ingresa el ID del juego que te compartió tu amigo' />
            {
              !gettingGame
                ? <button onClick={ joinGame }>Unirme a un juego</button>
                : 'Obteniendo partida...'
            }
          </div>


          { gameId &&
          <div className='close-modal'>
            <button onClick={ () => setShowInstructions( false ) }>Cerrar</button>
          </div>
          }
        </div>
      </Modal>

      <Modal
        visible={ showSelectPlayerColor }
        width='400'
        // height='300'
        effect='fadeInUp'
        // onClickAway={ () => setShowInstructions( false ) }
      >
        <div className='select-color-wrapper modal-content'>
          <h1>Ingresa tu nombre</h1>
          <input type='text' id='playerName' />
          <h1>Selecciona un color</h1>
          {
            gettingGame
              ? 'Obteniendo Partida...'
              : <div>
                <ul className='color-list'>
                  <li style={ { backgroundColor: '#ff4e15' } }>
                    <input type='radio' value='#ff4e15' name='playerColor' />
                  </li>
                  <li style={ { backgroundColor: '#ffc300' } }>
                    <input type='radio' value='#ffc300' name='playerColor' />
                  </li>
                </ul>
              </div>
          }

          <button onClick={ async() => {
            const name = document.querySelector( '#playerName' ).value;
            const colorElement = document.querySelector( 'input[name="playerColor"]:checked' );
            const color = colorElement && colorElement.value;
            if( name && color ) {
              await setPlayer( {
                name,
                color
              } );
            }
          }
          }>
            Unirme
          </button>
        </div>
      </Modal>
    </>
  );
};

export default App;

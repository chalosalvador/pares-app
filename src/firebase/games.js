/**
 * Created by chalosalvador on 2020-07-17
 */

import { db } from './index';
import Cookies from 'universal-cookie';
import app, { firestore } from 'firebase/app';


const cookies = new Cookies();

const collection = db.collection( 'games' );

const add = ( cardDeck ) => collection.add( {
  currentPlayer: 0,
  players: [],
  cardDeck: cardDeck,
  createdAt: firestore.FieldValue.serverTimestamp()
} );
const get = id => collection.doc( id );
const getGames = ( orderBy = 'createdAt' ) => collection.orderBy( orderBy, 'desc' );
const updateCardDeck = ( id, cardDeck ) => collection.doc( id ).set( { cardDeck } );
const updateStatus = ( id, cardDeck, currentPlayer ) => collection.doc( id )
  .update( {
    cardDeck,
    currentPlayer
  } );

const generatePlayerId = () => {
  const playerUID = collection.doc().id;
  cookies.set( 'playerUID', playerUID, { expires: new Date( 2025, 12, 31 ) } );
  return playerUID;

};

const updatePlayers = ( gameId, players ) => collection.doc( gameId ).update( { players } );

const Game = {
  add,
  get,
  updateStatus,
  generatePlayerId,
  updatePlayers
};

export default Game;

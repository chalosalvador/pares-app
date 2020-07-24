/**
 * Created by chalosalvador on 7/12/20
 */
import React from 'react';

const FrontComponent = ( props ) => (
  <div className='card' onClick={ props.handleClick } style={ { backgroundColor: props.playerColor || 'rgb(208, 207, 207)' } }>
    <span>{ props.value }</span>
  </div>
);

export default FrontComponent;

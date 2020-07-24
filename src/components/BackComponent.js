/**
 * Created by chalosalvador on 7/12/20
 */
import React from 'react';

const BackComponent = ( props ) => (
  <div className='card' onClick={ props.handleClick }>
    <span>{ props.number }</span>
    {/*<span>This is the back of the card.</span>*/}
  </div>
);

export default BackComponent;

/**
 * Created by chalosalvador on 7/24/20
 */
import React from 'react';
import '../styles/loading.css';

const Loading = ( props ) => {
  return <div className='loading'>
    <div className='block orange' />
    <div className='block blue' />
  </div>;
};

export default Loading;

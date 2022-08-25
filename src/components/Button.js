import { useEffect, useState } from 'react';
import './Button.scss';

function Button({ children, style, onClick }) {
    return (
        <div className='button' style={style} onClick={onClick}>
            <div className='border'></div>
            <div className='inner'>{children}</div>

        </div>
    );
}

export default Button;

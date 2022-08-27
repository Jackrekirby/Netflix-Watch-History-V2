import './Select.scss';
import { useState } from 'react';

function Select({ selected, setter, options }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={['select' + (isOpen ? ' open' : '')]}>
            <div className='current'
                onClick={() => setIsOpen(!isOpen)}>{selected ? options[selected] : 'Sort By'}</div>
            <div className='others'>
                {
                    Object.entries(options).map((entry, i) => {
                        const [key, value] = entry;
                        const classes = ['other'];
                        if (key === selected) {
                            classes.push('selected');
                        }
                        return <div key={i} className={classes.join(' ')} onClick={(e) => {
                            setter(key);
                            setIsOpen(false);
                        }}>
                            {value}
                        </div>
                    })
                }
            </div>
        </div>
    );
}

export default Select;

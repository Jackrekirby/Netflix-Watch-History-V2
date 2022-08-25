import './Select.scss';

function Select({ selected, setter, options }) {
    return (
        <div className="select">
            <div className='current'>{selected ? options[selected] : 'Sort By'}</div>
            <div className='others'>
                {
                    Object.entries(options).map((entry, i) => {
                        const [key, value] = entry;
                        const classes = ['other'];
                        if (key === selected) {
                            classes.push('selected');
                        }
                        return <div key={i} className={classes.join(' ')} onClick={(e) => { setter(key); }}>
                            {value}
                        </div>
                    })
                }
            </div>
        </div>
    );
}

export default Select;

import { useEffect, useState } from 'react';
import './Transition.scss';

function Transition({ isOpen, children, backgroundColor }) {

    const [opacity, setOpacity] = useState(0);
    const [height, setHeight] = useState(0);
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        if (isOpen) {
            setDisplay('inherit');
            const timer = setTimeout(() => {
                setOpacity(1);
                setHeight('100%');
            }, 100);
            return () => clearTimeout(timer);
        } else {
            setOpacity(0);
            setHeight('0%');

            const timer = setTimeout(() => setDisplay('none'), 1000);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    return (
        <div className='transition' style={{ height, display, backgroundColor }}>
            <div className='foreground' style={{ opacity: 1 - opacity }}></div>
            <div className='inner'>{children}</div>
        </div>
    );
}

export default Transition;

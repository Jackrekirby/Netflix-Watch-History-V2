import './AnimDiv.scss';
import { useEffect, useState } from 'react';

function AnimDiv({ className, states, state, child }) {
    const [style, setStyle] = useState(states[state]);
    const [lastState, setLastState] = useState(state);
    const [mounted, setMounted] = useState(states[state].mounted);

    useEffect(() => {
        if (states[state].mounted !== states[lastState].mounted) {
            if (states[state].mounted) {
                setMounted(true);
                const timeout = setTimeout(() => {
                    setStyle(states[state]);
                    setLastState(state);
                }, 100);
                return () => {
                    clearTimeout(timeout);
                };
            } else {
                setStyle(states[state]);

                const timeout = setTimeout(() => {
                    setMounted(false);
                    setLastState(state);
                }, 1000);

                return () => {
                    clearTimeout(timeout);
                }
            }
        } else {
            setStyle(states[state]);
            setLastState(state);
        }
    }, [state, lastState, states]);

    if (className === undefined) {
        className = { parent: undefined, child: undefined };
    }

    return (
        mounted && <div className={"anim-div" + (className.parent ? ' ' + className.parent : '')}
            style={{ ...style.parent }}>
            <div className={"foreground" + (className.child ? ' ' + className.child : '')} style={{ ...style.child }}>{child}</div>
        </div>
    )
};

export default AnimDiv;
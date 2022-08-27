import { useEffect, useState, useMemo } from 'react';

function StateManager() {
    const [logoOpen, setLogoOpen] = useState(false);

    const initState = useMemo(() => ({
        netflix: 'noOpacity',
        tmdb: 'shrunkWidth',
        whe: 'unmounted',
        bottom: 'mounted',
        summary: 'unmounted',
        credits: 'unmounted',
        steps: 'unmounted',
        uploading: 'unmounted',
        programs: 'unmounted',
    }), []);

    const [state, setState] = useState(initState);

    const [stateNum, setStateNum] = useState(0);

    const loadDelay = 1000;
    const delay = 1000;

    useEffect(() => {
        switch (stateNum) {
            case -1:
                setState(initState);
                setStateNum(0);
                break;
            case 0:
                setTimeout(() => {
                    setStateNum(1);
                    setState({ ...state, netflix: 'mounted' });
                }, loadDelay);
                break;
            case 1:
                setTimeout(() => {
                    setStateNum(2);
                    setState({ ...state, tmdb: 'expanded' });
                }, loadDelay);
                break;
            case 2:
                setTimeout(() => {
                    setStateNum(3);
                    setState({ ...state, whe: 'mounted' });
                }, loadDelay);
                break;
            case 3:
                setTimeout(() => {
                    setStateNum(4);
                    setLogoOpen(true);
                }, loadDelay);
                break;
            case 4:
                setTimeout(() => {
                    setStateNum(5);
                    setState({ ...state, summary: 'mounted' });
                }, loadDelay);
                break;
            case 5:
                setTimeout(() => {
                    setStateNum(undefined);
                    setState({ ...state, credits: 'mounted' });
                }, loadDelay);
                break;
            case 6:
                setState({ ...state, summary: 'unmounted', credits: 'unmounted', bottom: 'unmounted', tmdb: 'noOpacity', netflix: 'noOpacity' });
                setStateNum(7);
                break;
            case 7:
                setTimeout(() => {
                    setStateNum(undefined);
                    setState({ ...state, steps: 'mounted' });
                }, delay);
                break;
            case 8:
                setState({ ...state, steps: 'unmounted', uploading: 'noOpacity' });
                setStateNum(9);
                break;
            case 9:
                setTimeout(() => {
                    setState({ ...state, steps: 'unmounted', uploading: 'mounted' });
                    setStateNum(undefined);
                }, delay);
                break;
            case 10:
                setState({ ...state, uploading: 'unmounted', programs: 'mounted' });
                setStateNum(undefined);
                break;
            default:
                break;
        }
    }, [stateNum, state, initState]);

    const states = {
        tmdb: {
            expanded: {
                mounted: true,
                parent: { width: '100%', height: '100%' },
                child: { opacity: 1 }
            },
            noOpacity: {
                mounted: false,
                parent: { width: '100%', height: '100%' },
                child: { opacity: 0 }
            },
            shrunkWidth: {
                mounted: false,
                parent: { width: '0%', height: '100%' },
                child: { opacity: 0 }
            }
        },
        netflix: {
            noOpacity: {
                mounted: true,
                parent: { width: '100%', height: '100%' },
                child: { opacity: 0 }
            },
            mounted: {
                mounted: true,
                parent: { width: '100%', height: '100%' },
                child: { opacity: 1 }
            },
            unmounted: {
                mounted: false,
                parent: { width: '100%', height: '100%' },
                child: { opacity: 0 }
            },
        },
        whe: {
            mounted: {
                mounted: true,
                parent: { width: '100%', height: '100%' },
                child: { opacity: 1 }
            },
            unmounted: {
                mounted: false,
                parent: { width: '100%', height: '0%' },
                child: { opacity: 0 }
            },
        },
        bottom: {
            mounted: {
                mounted: true,
                parent: { width: '100%', height: '100%' },
                child: { opacity: 1 }
            },
            unmounted: {
                mounted: false,
                parent: { width: '100%', height: '0%' },
                child: { opacity: 1 }
            },
        },
        summary: {
            mounted: {
                mounted: true,
                parent: {},
                child: { opacity: 1 }
            },
            unmounted: {
                mounted: false,
                parent: {},
                child: { opacity: 0 }
            },
        },
        credits: {
            mounted: {
                mounted: true,
                parent: {},
                child: { opacity: 1 }
            },
            unmounted: {
                mounted: false,
                parent: {},
                child: { opacity: 0 }
            },
        },
        steps: {
            mounted: {
                mounted: true,
                parent: { height: '13.125rem' },
                child: { opacity: 1 }
            },
            noOpacity: {
                mounted: true,
                parent: { height: '13.125rem' },
                child: { opacity: 0 }
            },
            unmounted: {
                mounted: false,
                parent: { height: '0rem' },
                child: { opacity: 0 }
            },
        },
        uploading: {
            mounted: {
                mounted: true,
                parent: { height: '4.3125rem' },
                child: { opacity: 1 }
            },
            noOpacity: {
                mounted: true,
                parent: { height: '4.3125rem' },
                child: { opacity: 0 }
            },
            unmounted: {
                mounted: false,
                parent: { height: '0rem' },
                child: { opacity: 0 }
            },
        },
        programs: {
            mounted: {
                mounted: true,
                parent: { height: '100%' },
                child: { opacity: 1 }
            },
            unmounted: {
                mounted: false,
                parent: { height: '0rem' },
                child: { opacity: 0 }
            },
        },
    }

    // function convertRemToPixels(rem) {
    //     return rem / parseFloat(getComputedStyle(document.documentElement).fontSize);
    // }

    // console.log(convertRemToPixels(210));

    return [logoOpen, states, state, setStateNum];
}

export default StateManager;
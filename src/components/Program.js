import { useEffect, useState } from 'react';
import * as PropFormat from '../functions/PropFormat';
import './Program.scss';

// function debounce(fn, ms) {
//     let timer
//     return _ => {
//         clearTimeout(timer)
//         timer = setTimeout(_ => {
//             timer = null
//             fn.apply(this, arguments)
//         }, ms)
//     };
// }

function convertRemToPixels(rem) {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

// const poster_base_url = 'https://image.tmdb.org/t/p/w500/';
const backdrop_base_url = 'https://image.tmdb.org/t/p/w1280/';

function Statistic({ name, value }) {
    return (
        <div className='statistic'>
            <div className='name'>{name}</div>
            <div className='value'>{value}</div>
        </div>
    )
}

const options = {
    tv: {
        popularity: 'Popularity', vote_average: 'Rating', first_air_date: 'First Aired', last_air_date: 'Last Aired',
        number_of_seasons: 'Seasons', number_of_episodes: 'Episodes', episode_run_time: 'Episode Length', status: 'Status',
        lastWatched: 'Last Watched', firstWatched: 'Started Watching', episodesWatched: 'Episodes Watched', percentComplete: 'Complete',
    },
    film: {
        popularity: 'Popularity', vote_average: 'Rating', release_date: 'Release Date', runtime: 'Run Time', date_watched: 'Date Watched', revenue: 'Revenue', budget: 'Budget', budget_revenue_ratio: 'Revenue / Budget'
    }
};


function Program({ program, displayProgram, setDisplayProgram, programType }) {
    const fmtWidth = windowWidth => {
        const x = convertRemToPixels(16);
        const w = Math.floor(windowWidth / x) * x - convertRemToPixels(1);
        return w;
    }

    const [width, setWidth] = useState(fmtWidth(window.innerWidth));

    useEffect(() => {
        const handleResize = () => {
            const newWidth = fmtWidth(window.innerWidth);
            if (newWidth !== width) setWidth(newWidth);
        };

        window.addEventListener('resize', handleResize)

        return _ => {
            window.removeEventListener('resize', handleResize);
        }
    })

    if (!displayProgram) {
        return <></>
    }
    // console.log('displayProgram', displayProgram);
    return (
        <div className="program-wrapper" style={{ display: displayProgram ? 'flex' : 'none' }} onClick={(e) => { setDisplayProgram(false); }}>
            <div style={{ width: '100%', position: 'relative', height: '100%' }}>
                <div className="program" onClick={e => e.stopPropagation()}>
                    <img className='backdrop' src={`${backdrop_base_url}${program.backdrop_path}`} alt={program.name}></img>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', zIndex: 1 }}>
                        {/* <img className='poster' src={`${poster_base_url}${program.poster_path}`} alt={program.name}></img> */}
                        <div style={{ margin: '0.0rem 0rem' }}>
                            <h1 className='title'>{program.name}</h1>
                            <p>{program.overview}</p>
                            <div className='statistics'>
                                {
                                    Object.entries(options[programType]).map((entry, i) => {
                                        const [key, value] = entry;

                                        // console.log(key, value);
                                        const fmtValue = PropFormat.display[key](program[key], program);

                                        return <Statistic key={i} name={value} value={fmtValue} ></Statistic>
                                    })
                                }
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Program;

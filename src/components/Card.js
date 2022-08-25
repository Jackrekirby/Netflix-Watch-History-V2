import './Card.scss';
import * as PropFormat from '../functions/PropFormat';

function Card({ program, programType, statProperty, setProgramId, setDisplayProgram }) {
    const poster_base_url = 'https://image.tmdb.org/t/p/w500/';

    const rawStat = program[statProperty];
    const stat = PropFormat.display[statProperty](rawStat, program);
    const order = PropFormat.order[statProperty](rawStat, program);

    const name = programType == 'tv' ? program.name : program.title;
    return (
        <div className="card" style={{ order: order }}
            onClick={() => { setProgramId(program.id); setDisplayProgram(true); }}>
            {
                program.poster_path !== null && <img src={`${poster_base_url}${program.poster_path}`} alt={name}></img>
            }
            {
                program.poster_path == null && <div className='img'> <p>{(name + ' ').repeat(1000)}</p></div>
            }
            <div className="title">{name}</div>
            {stat && <div className="stat">{stat}</div>}
            <div className="id">{program.id}</div>
            {/* <div className="info">
                <h1>{program.name}</h1>
                <p>{program.overview}</p>
            </div> */}
        </div>
    );
}

export default Card;

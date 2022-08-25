import './ProgressBar.scss';

function ProgressBar({ name, progress, onChange }) {
    return (
        <>
            <div className="progress-bar">
                <div className='bar' style={{ width: `${100 * progress}%` }}></div>
                <p className='below'>{name}</p>
                <p className='above'>{name}</p>
            </div>
        </>
    );
}

export default ProgressBar;

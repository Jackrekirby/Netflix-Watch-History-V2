import './Button.scss';

function Button({ child, className, onClick }) {
    const animationDuration = `${5 + Math.random() * 3}s`;
    const animationDelay = `${1 + 3 * Math.random()}s`;

    return (
        <div className={"button" + (className ? ' ' + className : '')} onClick={onClick}>
            <div className='border' style={{ animationDuration, animationDelay }}></div>
            <div className='inner'>{child}</div>
        </div>
    );
}

export default Button;

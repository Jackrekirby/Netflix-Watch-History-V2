import './WheLogo.scss';

function WheLogo({ open }) {
    return (
        <div className={['whe-logo', open ? 'open' : ''].join(' ')}>
            <h1>W</h1>
            <p>atch</p>
            <h1>H</h1>
            <p>istory</p>
            <h1>E</h1>
            <p>xplorer</p>
        </div>
    );
}

export default WheLogo;
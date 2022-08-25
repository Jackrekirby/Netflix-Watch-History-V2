import { useEffect, useState } from 'react';
import './App.scss';
import Button from './components/Button';
import ProgramApp from './components/ProgramApp';
import ProgressBar from './components/ProgressBar';
import Transition from './components/Transition';

import * as WatchHistory from './functions/WatchHistory';
const API_KEY = '217696a2035b05a4f4f63471fb9c7c41';

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

function Summary({ style, setScreenMode }) {
  return (
    <div className='summary' style={style} onClick={() => setScreenMode("main")}>
      <p>begin exploring all that you have watched on Netflix</p>
      <div className='rect'></div>
    </div>
  );
}

function Step({ number, description }) {
  return (
    <div className='step'>
      <p className='number'>{number}</p>
      <p className='description'>{description}</p>
    </div>
  );
}

function App() {

  const [screenMode, setScreenMode] = useState("start");

  const [logoOpen, setLogoOpen] = useState(false);

  const [netflixPrograms, setNetflixPrograms] = useState(undefined);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [onLoadStyles, setOnLoadStyles] = useState({
    tmdb: { width: 0, opacity: 0 },
    whe: { height: 0, opacity: 0 },
    whe_summary: { opacity: 0 },
    whe_credits: { opacity: 0 },
    bottom_vert: { height: 100, opacity: 1 },
    main_screen: { opacity: 0, height: 0 },
  });



  useEffect(() => {
    if (screenMode == 'uploading') {
      console.log('netflixPrograms', netflixPrograms);
      setScreenMode('programs');
    }
  }, [netflixPrograms])

  useEffect(
    () => {
      if (screenMode == "start") {
        setTimeout(() => setOnLoadStyles({
          tmdb: { width: 100, opacity: 1 },
          whe: { height: 0, opacity: 0 },
          whe_summary: { opacity: 0 },
          whe_credits: { opacity: 0 },
          bottom_vert: { height: 100, opacity: 1 },
          main_screen: { opacity: 0, height: 0 },
        }), 1500);

        setTimeout(() => {
          setOnLoadStyles({
            tmdb: { width: 100, opacity: 1 },
            whe: { height: 100, opacity: 1 },
            whe_summary: { opacity: 0 },
            whe_credits: { opacity: 0 },
            bottom_vert: { height: 100, opacity: 1 },
            main_screen: { opacity: 0, height: 0 },
          });
        }, 2500);

        setTimeout(() => {
          setLogoOpen(true);
        }, 3500);

        setTimeout(() => {
          setOnLoadStyles({
            tmdb: { width: 100, opacity: 1 },
            whe: { height: 100, opacity: 1 },
            whe_summary: { opacity: 1 },
            whe_credits: { opacity: 0 },
            bottom_vert: { height: 100, opacity: 1 },
            main_screen: { opacity: 0, height: 0 },
          });
        }, 4500);

        setTimeout(() => setOnLoadStyles({
          tmdb: { width: 100, opacity: 1 },
          whe: { height: 100, opacity: 1 },
          whe_summary: { opacity: 1 },
          whe_credits: { opacity: 1 },
          bottom_vert: { height: 100, opacity: 1 },
          main_screen: { opacity: 0, height: 0 },
        }), 5500);
      }
    }, []
  );

  useEffect(() => {
    switch (screenMode) {
      case 'main':
        setOnLoadStyles({
          tmdb: { width: 100, opacity: 1 },
          whe: { height: 100, opacity: 1 },
          whe_summary: { opacity: 0 },
          whe_credits: { opacity: 0 },
          bottom_vert: { height: 100, opacity: 1 },
          main_screen: { opacity: 0, height: 0 },
        });

        setTimeout(() => {
          setOnLoadStyles({
            tmdb: { width: 100, opacity: 1 },
            whe: { height: 100, opacity: 1 },
            whe_summary: { opacity: 0 },
            whe_credits: { opacity: 0 },
            bottom_vert: { height: 0, opacity: 0 },
            main_screen: { opacity: 0, height: 0 },
          });
        }, 1000);

        setTimeout(() => {
          setOnLoadStyles({
            tmdb: { width: 100, opacity: 1 },
            whe: { height: 100, opacity: 1 },
            whe_summary: { opacity: 0 },
            whe_credits: { opacity: 0 },
            bottom_vert: { height: 0, opacity: 0 },
            main_screen: { opacity: 1, height: '25%' },
          });
        }, 2000);
        break;
      case 'start':
        break;
      case 'uploading':
        setOnLoadStyles({
          tmdb: { width: 100, opacity: 1 },
          whe: { height: 100, opacity: 1 },
          whe_summary: { opacity: 0 },
          whe_credits: { opacity: 0 },
          bottom_vert: { height: 0, opacity: 0 },
          main_screen: { opacity: 0, height: '0%' },
        });
        break;
      default:
        break;
    }

  }, [screenMode]);



  return (
    // <div>Hello World</div>
    <div className="app">
      <div className='horizontal-panels'>
        <div className='vertical-panels' style={{
          height: `${onLoadStyles.whe.height}%`
        }}>
          <div className='panel whe'>
            <div className='cover' style={{
              opacity: 1 - onLoadStyles.whe.opacity
            }}></div>
            <WheLogo open={logoOpen}></WheLogo>

            {/* <Transition isOpen={logoOpen}></Transition> */}

            {/* <button onClick={() => setLogoOpen(!logoOpen)}>CLICK</button> */}

            <Summary setScreenMode={setScreenMode} style={{ opacity: onLoadStyles.whe_summary.opacity }}></Summary>
            <p className='credits' style={{
              opacity: onLoadStyles.whe_credits.opacity
            }}>with thanks to TMDB</p>

            {
              <div className={['steps', 'show'].join(' ')} style={{ opacity: onLoadStyles.main_screen.opacity, height: onLoadStyles.main_screen.height }}>
                <Button children={<Step number={1} description={
                  <a href="https://help.netflix.com/en/node/101917" target="_blank">Login to Netflix to download your watch history file.</a>}></Step>}></Button>
                <Button children={<Step number={2} description={
                  <>
                    <label className="file-selecter" htmlFor={"file-upload"}>Upload the file here.</label>
                    <input type="file" id={"file-upload"} accept={".csv"} style={{ display: "none" }} onChange={(e) => {
                      setScreenMode("uploading");
                      console.log('HERE');
                      WatchHistory.OnFileInputChange(API_KEY, setNetflixPrograms, setUploadProgress)(e);
                    }} />
                  </>
                }></Step>}></Button>
                <Button children={<Step number={'?'} description="Want to see a demo? View the most trending series and movies."></Step>}></Button>
              </div>
            }



            {screenMode == 'uploading' && <>
              <ProgressBar name="Loading" progress={uploadProgress}></ProgressBar>
            </>}

            {screenMode == 'programs' && <>
              <ProgramApp netflixPrograms={netflixPrograms}></ProgramApp>
            </>}
          </div>
        </div>

        <Transition isOpen={onLoadStyles.bottom_vert.opacity == 1} children={
          <div className='vertical-panels'>
            <div className='panel netflix'>
              <img className='inner' src='images/Netflix_Logo_RGB.png' alt='Netlix Logo'></img>
            </div>

            <div className='panel tmdb' style={{
              width: `${onLoadStyles.tmdb.width}%`, opacity: onLoadStyles.tmdb.opacity
            }}>
              <img src='images/tmdb_logo.svg' alt='Netlix Logo'></img>
            </div>
          </div>
        }></Transition>

      </div>

    </div >
  );
}

export default App;

// https://about.netflix.com/en/company-assets
// https://www.themoviedb.org/about/logos-attribution?language=en-GB
// https://assets.ctfassets.net/4cd45et68cgf/viVq3fhHa1cmQTo3g3p6i/e649362c86a78c3744beebc641e6ec19/2020_Netflix_Symbol_Logo_Guidance.pdf
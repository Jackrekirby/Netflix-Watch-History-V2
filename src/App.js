import './App.scss';
import { useEffect, useState } from 'react';
import WheLogo from './components/WheLogo'
import AnimDiv from './components/AnimDiv';
import StateManager from './functions/StateManager'
import Button from './components/Button';
import ProgressBar from './components/ProgressBar';
import ProgramApp from './components/ProgramApp';
import * as WatchHistory from './functions/WatchHistory';

const API_KEY = '217696a2035b05a4f4f63471fb9c7c41';

function Step({ number, description }) {
  return (
    <div className='step'>
      <p className='number'>{number}</p>
      <p className='description'>{description}</p>
    </div>
  );
}

function App() {
  const [logoOpen, states, state, setStateNum] = StateManager();
  const [netflixPrograms, setNetflixPrograms] = useState(undefined);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (netflixPrograms !== undefined) {
      console.log('netflixPrograms', netflixPrograms);
      setStateNum(10);
    }
  }, [netflixPrograms, setStateNum])

  // function convertRemToPixels(rem) {
  //   console.log(rem / parseFloat(getComputedStyle(document.documentElement).fontSize));
  // }
  // convertRemToPixels(69);

  return (
    <div className="app">
      <div className='flex-col'>
        <AnimDiv className={{ parent: 'whe-panel' }} states={states.whe} state={state.whe} child={
          <>
            <WheLogo open={logoOpen}></WheLogo>

            <AnimDiv className={{ parent: 'summary' }} states={states.summary} state={state.summary} child={
              <Button onClick={() => { setStateNum(6); }} child={<p>explore all that you have watched on Netflix</p>}></Button>
            }></AnimDiv>


            <AnimDiv className={{ parent: 'credits' }} states={states.credits} state={state.credits} child={
              <p>with thanks to TMDB</p>
            }></AnimDiv>

            <AnimDiv className={{ parent: 'steps' }} states={states.steps} state={state.steps} child={
              < >
                <Button child={<Step number={1} description={
                  <a href="https://help.netflix.com/en/node/101917" target="_blank" rel="noreferrer">Login to Netflix to download your watch history file.</a>}></Step>}></Button>
                <Button child={<Step number={2} description={
                  <>
                    <label className="file-selecter" htmlFor={"file-upload"}>Upload the file here.</label>
                    <input type="file" id={"file-upload"} accept={".csv"} style={{ display: "none" }} onChange={(e) => {
                      setStateNum(8);
                      setTimeout(() => { WatchHistory.OnFileInputChange(API_KEY, setNetflixPrograms, setUploadProgress)(e) }, 1000);
                    }} />
                  </>
                }></Step>}></Button>
                <Button child={<Step number={'?'} description="Want to see a demo? View the most trending series and movies."></Step>}></Button>
              </>
            }></AnimDiv>

            <AnimDiv states={states.uploading} state={state.uploading} child={<ProgressBar name="Loading" progress={uploadProgress}></ProgressBar>}></AnimDiv>

            <AnimDiv className={{ parent: 'program-anim' }} states={states.programs} state={state.programs} child={<ProgramApp netflixPrograms={netflixPrograms}></ProgramApp>}></AnimDiv>
          </>
        } />
        < AnimDiv states={states.bottom} state={state.bottom} className={{ child: 'expand' }} child={
          < div className='flex-row' >
            <AnimDiv className={{ parent: 'netflix-panel', child: 'flex-col' }} states={states.netflix} state={state.netflix} child={
              <img className='logo50' src='images/netflix_logo.png' alt='Netlix'></img>
            } />
            <AnimDiv className={{ parent: 'tmdb-panel', child: 'flex-col' }} states={states.tmdb} state={state.tmdb} child={
              <img className='logo50' src='images/tmdb_logo.svg' alt='TMDB'></img>
            } />
          </div >
        } />
      </div >
    </div >
  );
}

export default App;

import './ProgramApp.scss';
import Card from './Card';
import SortBy from './SortBy';
import Program from './Program';
import Select from './Select';

import * as WatchHistory from '../functions/WatchHistory';

import { useState, useEffect } from 'react';
// import FileSelecter from './FileSelecter';

const API_KEY = '217696a2035b05a4f4f63471fb9c7c41';

const pagesLoaded = [];
async function getTrending(pageNumber, programs, setPrograms) {
  const newPrograms = {};
  if (!pagesLoaded.includes(pageNumber)) {
    pagesLoaded.push(pageNumber);

    const resp = await fetch(`https://api.themoviedb.org/3/trending/tv/week?api_key=${API_KEY}&page=${pageNumber}`);
    const json = await resp.json();
    console.log('getTrending', json);

    for (const item of json.results) {
      const resp2 = await fetch(`https://api.themoviedb.org/3/tv/${item.id}?api_key=${API_KEY}`);
      const json2 = await resp2.json();
      newPrograms[item.id] = json2;
    }
    console.log('programs', newPrograms);
    setPrograms({ ...programs, ...newPrograms });
    // setProgramId(Object.keys(programs)[0]);
  }
}

async function getTvPrograms(tvIds, setTvPrograms) {
  const programs = {};
  let i = 0;
  const total = Object.keys(tvIds).length;
  for (const id of Object.keys(tvIds)) {
    (async () => {
      const resp = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}`);
      const json = await resp.json();
      programs[id] = { ...json, ...tvIds[id] };
      i++;
    })();
  }

  function checkFlag() {
    if (i < total) {
      window.setTimeout(checkFlag, 100);
    } else {
      console.log('tv programs', { programs });
      setTvPrograms(programs);
      // setProgramId(Object.keys(programs)[0]);
    }
  }

  checkFlag();
}

async function getFilmPrograms(filmIds, setFilmPrograms) {
  const programs = {};
  let i = 0;
  const total = Object.keys(filmIds).length;
  for (const id of Object.keys(filmIds)) {
    (async () => {
      const resp = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`);
      const json = await resp.json();
      programs[id] = { ...json, date_watched: filmIds[id] };
      i++;
    })();
  }

  function checkFlag() {
    if (i < total) {
      window.setTimeout(checkFlag, 100);
    } else {
      console.log('film programs', { programs });
      setFilmPrograms(programs);
      // setProgramId(Object.keys(programs)[0]);
    }
  }

  checkFlag();
}

function ProgramApp({ netflixPrograms }) {
  const [programs, setPrograms] = useState(undefined);

  const [filmPrograms, setFilmPrograms] = useState(undefined);
  const [tvPrograms, setTvPrograms] = useState(undefined);

  const [programId, setProgramId] = useState(undefined);
  const [statProperty, setStatProperty] = useState(undefined);

  const [programType, setProgramType] = useState('tv');

  // const [netflixPrograms, setNetflixPrograms] = useState(undefined);
  // const [uploadProgress, setUploadProgress] = useState(0);


  const [displayProgram, setDisplayProgram] = useState(false);

  // useEffect(() => {
  //   getTrending(1, setPrograms, setProgramId);
  // }, []);

  useEffect(() => {
    setDisplayProgram(false);
    if (programType == 'tv') {
      setStatProperty('lastWatched');
    } else {
      setStatProperty('release_date');
    }

  }, [programType]);

  useEffect(() => {
    if (netflixPrograms != undefined) {
      console.log('NETFLIX', netflixPrograms);
      getTvPrograms(netflixPrograms.tv, setTvPrograms);
      getFilmPrograms(netflixPrograms.movie, setFilmPrograms);
    }
  }, [netflixPrograms]);

  useEffect(() => {
    if (programType == 'tv') {
      setPrograms(tvPrograms);
    } else {
      setPrograms(filmPrograms);
    }
  }, [programType, tvPrograms, filmPrograms]);

  // console.log(programId);

  return (
    <div className="program-app">

      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
        {/* <FileSelecter id='file_selector' name="Upload" accept=".csv" onChange={WatchHistory.OnFileInputChange(API_KEY, setNetflixPrograms, setUploadProgress)} progress={uploadProgress}></FileSelecter> */}
        {/* <p id="progress"></p> */}
        <Select selected={programType} setter={setProgramType} options={{ tv: 'Series', film: 'Movie' }}></Select>

        {/* <input type="file" id="file_selector" accept=".csv" onChange={WatchHistory.OnFileInputChange(API_KEY, setNetflixPrograms)} /> */}
        <SortBy statProperty={statProperty} setStatProperty={setStatProperty} programType={programType}></SortBy>
      </div>

      {programId && <Program program={programs[programId]} displayProgram={displayProgram} setDisplayProgram={setDisplayProgram} programType={programType}></Program>}

      {programs && <div className="cards">
        {
          Object.values(programs).map((program, i) => {
            const stat = program[statProperty];
            return <Card key={program.id} programType={programType} program={program} statProperty={statProperty} setProgramId={setProgramId} setDisplayProgram={setDisplayProgram}></Card>
          })
        }
      </div>}

      {/* <div className='load-more' onClick={(e) => {
        getTrending(pagesLoaded.length + 1, setPrograms, setProgramId);
      }}>Load More</div> */}
    </div>
  );
}

export default ProgramApp;

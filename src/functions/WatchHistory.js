
// watch history import steps
// 1. read file and collect lines
// 2. split title into parts, and insert each part into a raw program tree, 
//  with dates as end nodes
// 3. seperate programs into tv shows and films
//  1. categorise programs with no child branches as films
//  2. categorise programs which contain 'tv terms' as tv programs
//  3. categorise programs whose branches do not fork as a film
//  4. for remaining uncategories programs assign them as a film if
//    they have less than N children, otherwise assume a tv program
// 4. create seperate branches per subbranch for films (concat title parts)
// 6. search TMDB for the films and tv programs
//  1. generate alternative names to search for a program by (incase netflix and tmdb names dont match)
//    1. add truncated alternatives. E.g. 'One: Two: Three' -> ['One: Two', 'One']
//    2. add brackless alternative. E.g. 'One (two)' -> 'One'
//    3. add brackless truncated alternatives
//  2. fetch results for each alternative name. 
//   For each result check if its TMDB name matches with the search name.
//   Check both original and current name. Remove special characters, lower case letters ...
//   If a name does no match repeat for other media type.
//   If a name matches at any point return it along with its media type and id.
//  3. If no result name matches select the result with the most matching words 
//   with the original search term. If no results at all return undefined.


// const API_KEY = '217696a2035b05a4f4f63471fb9c7c41';
// initFileSelector('file_selector');

function OnFileInputChange(API_KEY, setPrograms, setProgress) {
    return (async (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.addEventListener('load', async (event) => {
            const lines = event.target.result.split('\n');
            lines.shift(); // remove header ['Title','Date']
            importWatchHistory(lines, API_KEY, setPrograms, setProgress);
        });

        reader.readAsText(file);
    });
}

async function importWatchHistory(lines, API_KEY, setPrograms, setProgress) {
    console.groupCollapsed('watch history');
    console.log({ lines });
    const rawPrograms = {};

    function insertProgram(subprogram, titleParts, date) {
        // if first part of title does not exist in tree add it to the tree
        if (!(titleParts[0] in subprogram)) {
            subprogram[titleParts[0]] = {};
        }

        if (titleParts.length > 1) {
            // add remaining parts of title to subbranch
            insertProgram(subprogram[titleParts[0]], titleParts.slice(1), date);
        } else {
            // if title only has one element it is an end node, assign date to it
            subprogram[titleParts[0]]._DATE = date;
        }
    }

    lines.forEach(
        line => {
            // ignore entry if line blank 
            if (line === '') { return; }

            const [title, dateStr] = line.slice(1, -1).split('","');
            const titleParts = title.split(": ");
            // ignore entry if title only whitespace
            if (title.replaceAll(' ', '') === '') { return; }

            const datePartsStr = dateStr.split('/');
            const datePartsNum = datePartsStr.map(part => parseInt(part));
            const date = new Date(...datePartsNum.reverse()).getTime();

            // insert entry into rawPrograms branch
            insertProgram(rawPrograms, titleParts, date);
        }
    );

    console.log(rawPrograms);

    let filteredPrograms = { film: {}, tv: {} };

    function isObject(obj) {
        // console.log(obj);
        return !(Object.keys(obj).length === 1 && Object.keys(obj)[0] === '_DATE');
        // if date not stored under _DATE
        // return (typeof obj === 'object');
        // if date saved as object instead of number then use statement below
        // return (typeof obj === 'object' && !(obj instanceof Date));
    }

    function categorisePrograms(rawPrograms) {
        // as raw programs are categorised they are deleted and
        // inserted into filtered programs

        //  1. categorise programs with no child branches (non-objects) as films
        Object.entries(rawPrograms).forEach(entry => {
            const [key, value] = entry;
            if (!isObject(value)) {
                delete rawPrograms[key];
                filteredPrograms.film[key] = value;
            }
        });

        // 2. categorise programs which contain 'tv terms' as tv programs
        // const tvTerms = ['Season', 'Series'];

        function findSeasonKey(subprograms, keys) {
            const tvTerms = ['Season', 'Series'];
            for (const [key, value] of Object.entries(subprograms)) {
                if (tvTerms.some(tv_term => key.includes(tv_term))) {
                    //console.log(keys, value);
                    delete subprograms[key];
                    const nkey = keys.join(": ");
                    if (!(nkey in filteredPrograms.tv)) {
                        filteredPrograms.tv[nkey] = {};
                    }
                    filteredPrograms.tv[nkey][key] = value;
                } else if (isObject(value)) {
                    findSeasonKey(value, [...keys, key]);
                }
            }
        }

        // for each program find branches which contains 'tv terms' 
        Object.entries(rawPrograms).forEach(entry => {
            const [key, value] = entry;
            findSeasonKey(value, [key]);
        });

        // clean up branches which no longer have any children
        Object.entries(rawPrograms).forEach(entry => {
            const [key, value] = entry;
            if (isObject(value) && Object.keys(value).length === 0) {
                delete rawPrograms[key];
            }
        });

        // 3. categorise programs whose branches do not fork as a film
        // assume program is a film with colons in name, rather than a series 
        // with only a single episode of a single season watched as tv terms 
        // already checked.

        // recursively iterate through all child branches to check for multiple branches
        // can return true at first branch found
        // CHECK WHY?: return (subprogram == undefined);
        function hasBranches(subprogram) {
            // console.log(subprogram);
            if (Object.values(subprogram).length === 0) {
                // subprogram was already removed
                return false;
            } else if (isObject(subprogram)) {
                if (Object.keys(subprogram).length > 1) {
                    return true;
                } else {
                    return hasBranches(Object.values(subprogram)[0]);
                }
            } else {
                // date found at end of branch
                return false;
            }
        }

        Object.entries(rawPrograms).forEach(entry => {
            const [key, value] = entry;
            if (!hasBranches(value)) {
                delete rawPrograms[key];
                filteredPrograms.film[key] = value;
            }
        });

        // 4. for remaining uncategories programs assign them as a film if
        // they have less than N children, otherwise assume a tv program

        // recusively count number of branches from current level
        function countChildren(subprograms) {
            let total = 0;
            for (const value of Object.values(subprograms)) {
                if (isObject(value)) {
                    total += countChildren(value);
                } else {
                    total += 1;
                }
            }
            return total;
        }

        Object.entries(rawPrograms).forEach(entry => {
            const [key, value] = entry;
            if (countChildren(value) < 8) {
                filteredPrograms.film[key] = value;
            } else {
                if (key in filteredPrograms.tv) {
                    filteredPrograms.tv[key] = { ...value, ...filteredPrograms.tv[key] };
                } else {
                    filteredPrograms.tv[key] = value;
                }
            }
            delete rawPrograms[key];
        });
    }

    categorisePrograms(rawPrograms);

    const concatFilms = {};
    function concatFilmTitleParts(subprograms, titleParts) {
        for (const [titlePart, value] of Object.entries(subprograms)) {
            const newTitleParts = [...titleParts, titlePart];
            if (isObject(value)) {
                concatFilmTitleParts(value, newTitleParts);
            } else {
                const concatTitle = newTitleParts.join(': ');
                concatFilms[concatTitle] = value;
            }
        }
    }

    concatFilmTitleParts(filteredPrograms.film, []);
    filteredPrograms.film = concatFilms;

    console.log(filteredPrograms);

    function getDates(subprograms) {
        if (isObject(subprograms)) {
            const dates = [];
            for (const item of Object.values(subprograms)) {
                if (isObject(item)) {
                    dates.push(...getDates(item));
                } else {
                    dates.push(item._DATE);
                }
            }
            return dates;
        } else {
            return [subprograms._DATE];
        }
    }

    const programDates = { film: {}, tv: {} };
    const numTvEpisodes = {};

    for (const [name, data] of Object.entries(filteredPrograms.film)) {
        const dates = getDates(data);
        programDates.film[name] = Math.max(...dates);
    }

    for (const [name, data] of Object.entries(filteredPrograms.tv)) {
        const dates = getDates(data);
        programDates.tv[name] = { firstWatched: Math.min(...dates), lastWatched: Math.max(...dates) }
        numTvEpisodes[name] = dates.length;
    }

    console.log('programDates', programDates);
    console.log('numTvEpisodes', numTvEpisodes);

    function genAlternativeNames(title) {
        const alternateTitles = new Set();

        alternateTitles.add(title);

        function addTruncatedAlternatives(title) {
            const titleParts = title.split(': ');
            if (titleParts.length > 1) {
                for (let i = 1; i < titleParts.length; i++) {
                    const alternateTitle = titleParts.slice(0, -i).join(': ');
                    alternateTitles.add(alternateTitle);
                }
            }
        }

        // 1. add truncated alternatives. E.g. 'One: Two: Three' -> ['One: Two', 'One']
        addTruncatedAlternatives(title);

        // 2. add brackless alternative. E.g. 'One (two)' -> 'One'
        const removeBrackets = (n) => n.replace(/ *\([^)]*\) */g, "");
        const bracketlessTitle = removeBrackets(title);
        alternateTitles.add(bracketlessTitle);

        // 3. add brackless truncated alternatives
        addTruncatedAlternatives(bracketlessTitle);

        // if (alternateTitles.size > 3) console.log(alternateTitles);
        return alternateTitles;
    }

    async function searchDatabase(programName, predictedMediaType) {
        const trace = { altNames: [], queries: [], tmdbItems: [], urls: [] };

        const alternativeNames = genAlternativeNames(programName);

        trace.altNames = alternativeNames;

        // lower case and replace special characters including (removing) spaces
        const lcrscis = (n) => n.toLowerCase().replace(/[^0-9a-zA-Z]/g, "");
        // lower case and replace special characters excluding (removing) spaces
        const lcrsces = (n) => n.toLowerCase().replace(/[^0-9a-zA-Z ]/g, "");

        let foundMatch = false;
        let foundProgram = undefined;

        const mediaTypeOrder = predictedMediaType === 'tv' ? ['tv', 'movie'] : ['movie', 'tv'];

        mainLoop:
        for (const mediaType of mediaTypeOrder) {
            for (const name of alternativeNames) {
                const query = name.replaceAll(/[^0-9a-zA-Z. ]+/g, "").replaceAll(/[. ]+/g, "+");
                trace.queries.push(query);
                const url = `https://api.themoviedb.org/3/search/${mediaType}?api_key=${API_KEY}&query=${query}`;
                trace.urls.push(url);
                const response = await fetch(url);
                const json = await response.json();

                if (json.results) {
                    const rawName = lcrscis(name);
                    for (const result of json.results) {
                        const nameTerm = mediaType === 'tv' ? 'name' : 'title';

                        trace.tmdbItems.push(
                            { id: result.id, mediaType: mediaType, name: result[nameTerm] },
                            { id: result.id, mediaType: mediaType, name: result[`original_${nameTerm}`] }
                        );

                        if (lcrscis(result[nameTerm]) === rawName || lcrscis(result[`original_${nameTerm}`]) === rawName) {
                            foundProgram = { id: result.id, mediaType: mediaType };
                            foundMatch = true;
                            break mainLoop;
                        }
                    }
                }
            }
        }

        if (foundMatch) {
            // console.log(programName);
        } else {
            const splitName = lcrsces(programName).split(' ');
            // console.log('splitName', splitName);
            const numMatchingWords = Array(trace.tmdbItems.length).fill(0);
            let i = 0;
            for (const tmdbItem of trace.tmdbItems) {
                // console.log('AA', i, tmdbName, lcrsces(tmdbName));
                const splitTmdbName = lcrsces(tmdbItem.name).split(' ');
                // console.log('splitTmdbName', splitTmdbName);
                for (const word of splitName) {
                    if (splitTmdbName.includes(word)) {
                        numMatchingWords[i]++;
                    }
                }
                i++;
            }

            const findMaxIndex = (array) => {
                let i = 0;
                let max = 0;
                let maxIndex = 0;
                for (const item of array) {
                    if (item > max) {
                        max = item;
                        maxIndex = i;
                    }
                    i++;
                }
                return maxIndex;
            }

            if (trace.tmdbItems.length === 0) {
                console.error(`${programName} -`, trace);
            } else {
                const i = findMaxIndex(numMatchingWords);
                const predictedItem = Object.values(trace.tmdbItems)[i];
                console.warn(`${programName} [${predictedItem.name}]{${predictedItem.mediaType}} -`, trace);

                foundProgram = { id: predictedItem.id, mediaType: predictedItem.mediaType };
            }
        }

        return foundProgram;
    }

    const tmdbIds = { tv: {}, movie: {} };
    // const progressDom = document.getElementById('progress');
    const totalPrograms = Object.keys(filteredPrograms.film).length + Object.keys(filteredPrograms.tv).length;
    let searchedPrograms = 0;

    const addTmdbObj = (name, program, predictedMediaType) => {
        const fmtTvWatchDate = (name, mediaType) => {
            const x = programDates[mediaType][name];
            if (mediaType === 'tv') {
                return { ...x, episodesWatched: numTvEpisodes[name] };
            } else {
                return { firstWatched: x, lastWatched: x, episodesWatched: 1 };
            }
        }

        const fmtFilmWatchDate = (name, mediaType) => {
            const x = programDates[mediaType][name];
            if (mediaType === 'tv') {
                return x.lastWatched;
            } else {
                return x;
            }
        }

        if (program) {
            if (program.mediaType === 'tv') {
                if (program.id in tmdbIds[program.mediaType]) {
                    const stats = fmtTvWatchDate(name, predictedMediaType);
                    const firstWatched = Math.min(stats.firstWatched, tmdbIds.tv[program.id].firstWatched);
                    const lastWatched = Math.min(stats.lastWatched, tmdbIds.tv[program.id].lastWatched);
                    const episodesWatched = stats.episodesWatched + tmdbIds.tv[program.id].episodesWatched;

                    tmdbIds.tv[program.id] = { firstWatched, lastWatched, episodesWatched };

                } else {
                    tmdbIds.tv[program.id] = fmtTvWatchDate(name, predictedMediaType);
                }
            } else {
                if (program.id in tmdbIds[program.mediaType]) {
                    const watched = Math.max(fmtFilmWatchDate(name, predictedMediaType), tmdbIds.movie[program.id]);
                    tmdbIds.movie[program.id] = watched;
                } else {
                    tmdbIds.movie[program.id] = fmtFilmWatchDate(name, predictedMediaType);
                }
            }
        }

        searchedPrograms++;
        // console.log(searchedPrograms, totalPrograms);
        setProgress(searchedPrograms / totalPrograms);
        // progressDom.innerText = `${searchedPrograms} / ${totalPrograms} : [${((searchedPrograms / totalPrograms) * 100).toFixed(2)} %]`;
    }

    for (const name of Object.keys(filteredPrograms.film)) {
        (async () => {
            const program = await searchDatabase(name, 'movie');
            addTmdbObj(name, program, 'film');
        })();
    }

    for (const name of Object.keys(filteredPrograms.tv)) {
        (async () => {
            const program = await searchDatabase(name, 'tv');
            addTmdbObj(name, program, 'tv');
        })();
    }

    function checkFlag() {
        if (searchedPrograms < totalPrograms) {
            window.setTimeout(checkFlag, 100);
        } else {
            // console.log(tmdbIds);
            setPrograms(tmdbIds);
        }
    }

    console.groupEnd();
    checkFlag();
}

export { OnFileInputChange }
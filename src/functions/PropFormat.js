const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const tvStatusOrder = { 'Returning Series': 0, 'Planned': 1, 'In Production': 2, 'Ended': 3, 'Canceled': 4, 'Pilot': 5 };
const tvStatus = { 'Returning Series': 'Returning', 'Planned': 'Planned', 'In Production': 'In Production', 'Ended': 'Ended', 'Canceled': 'Canceled', 'Pilot': 'Pilot' };

const order = {
    undefined: (x, data) => 0,
    popularity: (x, data) => -Number(Math.floor(x * 1000)),
    vote_average: (x, data) => -Number(Math.floor(x * 1000)),
    first_air_date: (x, data) => orderDate(x),
    release_date: (x, data) => orderDate(x),
    last_air_date: (x, data) => {
        if (x == null) {
            x = data['first_air_date'];
        }
        return orderDate(x);
    },
    number_of_seasons: (x, data) => -Number(x),
    number_of_episodes: (x, data) => -Number(x),
    runtime: (x, data) => -Number(x),
    episode_run_time: (x, data) => {
        if (x.length === 0) {
            return -2147483647;
        } else {
            return -Number(x[0]);
        }
    },
    status: (x, data) => tvStatusOrder[x],
    firstWatched: (x, data) => -Math.floor(x / 1e5),
    lastWatched: (x, data) => -Math.floor(x / 1e5),
    date_watched: (x, data) => -Math.floor(x / 1e5),
    episodesWatched: (x, data) => -x,
    percentComplete: (_, data) => {
        if (data['episodesWatched'] == 0 || data['number_of_episodes'] == 0) {
            return 0;
        } else {
            return -Math.floor((data['episodesWatched'] / data['number_of_episodes']) * 10000);
        }
    },
    budget: (x, data) => x ? -x : 0,
    revenue: (x, data) => x ? -x : 0,
    budget_revenue_ratio: (_, data) => {
        if (data['revenue'] && data['budget']) {
            return -Math.floor(data['revenue'] / data['budget'] * 1000);
        } else {
            return 0;
        }
    },
};

const orderDate = (date) => {
    if (date.length == 10) {
        return -(new Date(date).getTime() / 1e5);
    } else {
        return 2147483647;
    }
}

const fmtDate = (date) => {
    if (date.length == 10) {
        return `${months[Number(date.slice(5, 7)) - 1]} ${date.slice(0, 4)}`;
    } else {
        return 'Unknown';
    }
}

const display = {
    undefined: (x, data) => undefined,
    popularity: (x, data) => Math.round(x),
    vote_average: (x, data) => Number(x).toFixed(2),
    first_air_date: (x, data) => fmtDate(x),
    release_date: (x, data) => fmtDate(x),
    last_air_date: (x, data) => {
        if (x === null) {
            x = data['first_air_date'];
        }
        return fmtDate(x);
    },
    number_of_seasons: (x, data) => Number(x),
    number_of_episodes: (x, data) => Number(x),
    runtime: (x, data) => Number(x),
    episode_run_time: (x, data) => {
        if (x.length === 0) {
            return 'Unknown';
        } else {
            return Number(x[0]);
        }
    },
    status: (x, _data) => tvStatus[x],
    firstWatched: (x, data) => {
        const date = new Date(x);
        return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    },
    lastWatched: (x, data) => {
        const date = new Date(x);
        return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    },
    date_watched: (x, data) => {
        const date = new Date(x);
        return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    },
    episodesWatched: (x, data) => x,
    percentComplete: (_, data) => {
        if (data['episodesWatched'] == 0 || data['number_of_episodes'] == 0) {
            return `0 %`;
        } else {
            return `${Math.min(Math.floor(data['episodesWatched'] / data['number_of_episodes'] * 100), 100)} %`;
        }
    },
    budget: (x, data) => x ? `$${sigfig(x, 3)}M` : 'Unknown',
    revenue: (x, data) => x ? `$${sigfig(x, 3)}M` : 'Unknown',
    budget_revenue_ratio: (_, data) => {
        if (data['revenue'] && data['budget']) {
            return (data['revenue'] / data['budget']).toFixed(2);
        } else {
            return 'Unknown';
        }
    },
};

function sigfig(x, sf) {
    const s = `${Math.floor(x)}`;
    const digits = s.slice(0, Math.min(s.length, sf)) +
        `${Array(s.length - sf).fill(0).join('')}`;

    return Number(digits) / 1e6;
}

export { order, display };
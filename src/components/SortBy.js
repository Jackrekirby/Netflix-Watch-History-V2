import Select from "./Select";

const options = {
    tv: {
        popularity: 'Popularity', vote_average: 'Rating', first_air_date: 'Date First Aired', last_air_date: 'Date Last Aired',
        number_of_seasons: 'No. Seasons', number_of_episodes: 'No. Episodes', episode_run_time: 'Episode Length', status: 'Status',
        lastWatched: 'Date Last Watched', firstWatched: 'Date Started Watching', episodesWatched: 'No. Episodes Watched', percentComplete: 'Percent Complete',
    },
    film: {
        popularity: 'Popularity', vote_average: 'Rating', release_date: 'Release Date', runtime: 'Run Time', date_watched: 'Date Watched', revenue: 'Revenue', budget: 'Budget', budget_revenue_ratio: 'Revenue / Budget'
    }
};



function SortBy({ statProperty, setStatProperty, programType }) {
    return (
        <Select selected={statProperty} setter={setStatProperty} options={options[programType]}></Select>
    );
}

export default SortBy;

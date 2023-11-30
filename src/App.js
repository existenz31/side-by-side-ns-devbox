
import './App.css';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Index, Hits, useHits, useConfigure } from 'react-instantsearch';


import {
	APP_ID, API_KEY,
	INDICES, INDICES_COLUMN_NAMES, INDICES_ALPHA,
	HIT_URL_REF, HIT_PER_PAGE, TYPO_TOLERANCE
} from "./config.js";

const searchClient = algoliasearch(APP_ID, API_KEY);

function Hit({ hit }) {
	return (
		<div>
			<span class="badge text-bg-primary">Primary</span>
			<h4>{hit.productDisplayName}</h4>
			<div className="article-container">
				<div>
					<p>{hit.categories[0].displayName}</p>
				</div>
				<img src={`${HIT_URL_REF}${hit.frontView}`} class="hit-image" alt="" />
			</div>
		</div>
	);
}

const transformItems = (items, { results }) => {
	return items.map((item, index) => ({
		...item,
		position: { index, page: results.page },
	}));
};

function CustomHits(props) {
	const { hits } = useHits(props);
	const header = props.header;

	return (
		<div className="variant">
			<div className="variant-header">{header}</div>
			<div className="ais-Hits-list">
				{hits.map((hit, index) => (
					<div className="ais-Hits-item">
						<Hit hit={hit} />
						<div className="hit-index">
							{index + 1} - {hit.objectID}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}


function CustomHit({ hit }) {
	console.log(hit)
	return (
		<div className="ais-Hits-item">
			<Hit hit={hit} />
			<div className="hit-index">
				{hit.position.index + 1} - {hit.objectID}
			</div>
		</div>
	);
}

function CustomConfigure(props) {
	const { refine } = useConfigure(props);
	return null;
}

function App() {

	return (
		<div class="container text-center">
			<InstantSearch searchClient={searchClient}>
				<div class="searchbox">
					<SearchBox />
					<CustomConfigure
						getRankingInfo={true}
						hitsPerPage={HIT_PER_PAGE}
						analytics={false}
						clickAnalytics={false}
						enableABTest={false}
						typoTolerance={TYPO_TOLERANCE}
					// restrictSearchableAttributes={[
					// ]}
					/>
				</div>
				<div class="row align-items-start">
					<div class="col">
						<h3>{INDICES_COLUMN_NAMES[0]}</h3>
						<Index indexName={INDICES[0]}>
							<CustomConfigure removeWordsIfNoResults={"allOptional"} />
							<Hits hitComponent={CustomHit}
								transformItems={transformItems} />
						</Index>
					</div>
					<div class="col">
						<h3>{INDICES_COLUMN_NAMES[1]}</h3>
						<Index indexName={INDICES[1]}>
							<CustomConfigure
								removeWordsIfNoResults={"none"}
								devFeatureFlags={{ neuralSearchAlpha: INDICES_ALPHA[1] }}
							/>
							<Hits hitComponent={CustomHit}
								transformItems={transformItems} />						</Index>
					</div>
					<div class="col">
						<h3>{INDICES_COLUMN_NAMES[2]}</h3>
						<Index indexName={INDICES[2]}>
							<CustomConfigure
								removeWordsIfNoResults={"none"}
								devFeatureFlags={{ neuralSearchAlpha: INDICES_ALPHA[2] }}
							/>
							<Hits hitComponent={CustomHit}
								transformItems={transformItems} />						</Index>
					</div>
				</div>
			</InstantSearch>
		</div>
	);
}

export default App;


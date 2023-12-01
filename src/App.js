import "./App.css";
import React from 'react';

import algoliasearch from "algoliasearch/lite";
import {
  InstantSearch,
  SearchBox,
  Index, Hits,
  useConfigure, useHits
} from "react-instantsearch";

import {
  APP_ID,
  API_KEY,
  INDICES, INDICES_COLUMN_NAMES, INDICES_ALPHA,
  HIT_URL_REF, HIT_PER_PAGE, TYPO_TOLERANCE
} from "./config.js";

const searchClient = algoliasearch(APP_ID, API_KEY);

function Hit({ hit }) {
  return (
    <div>
      <span className="badge text-bg-primary">Primary</span>
      <h4>{hit.productDisplayName}</h4>
      <div className="article-container">
        <div>
          <p>{hit.categories[0].displayName}</p>
        </div>
        <img src={`${HIT_URL_REF}${hit.frontView}`} className="hit-image" alt="" />
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

// eslint-disable-next-line no-unused-vars
function CustomHits(props) {
  const { hits } = useHits(props);
  const header = props.header;
  return (
    <div className="variant">
      <div className="variant-header">{header}</div>
      <div className="ais-Hits-list">
        {hits.map((hit, index) => (
          <div className="ais-Hits-item" key={index}>
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
    // <div className="ais-Hits-item">
    //   <Hit hit={hit} />
    //   <div className="hit-index">
    //     {hit.position.index + 1} - {hit.objectID}
    //   </div>
    // </div>
    <div className="card" style="width: 18rem;">
      <img src="..." className="card-img-top" alt="..." />
      <div className="card-body">
        <h5 className="card-title">Card title</h5>
        <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card content.</p>
        <a href="#" className="btn btn-primary">Go somewhere</a>
      </div>
    </div>
  );
}

function CustomConfigure(props) {
  // eslint-disable-next-line no-unused-vars
  const { refine } = useConfigure(props);
  return null;
}

function App() {

  return (
    <div className="container text-center">
      <span>Hello World 2!</span>
      <InstantSearch searchClient={searchClient}>
        <div className="searchbox">
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
        <div className="row align-items-start">
          <div className="col">
            <h3>{INDICES_COLUMN_NAMES[0]}</h3>
            <Index indexName={INDICES[0]}>
              <CustomConfigure removeWordsIfNoResults={"allOptional"} />
              <Hits hitComponent={CustomHit}
                transformItems={transformItems} />
            </Index>
          </div>
          <div className="col">
            <h3>{INDICES_COLUMN_NAMES[1]}</h3>
            <Index indexName={INDICES[1]}>
              <CustomConfigure
                removeWordsIfNoResults={"none"}
                devFeatureFlags={{ neuralSearchAlpha: INDICES_ALPHA[1] }}
              />
              <Hits hitComponent={CustomHit}
                transformItems={transformItems} />

            </Index>
          </div>
          <div className="col">
            <h3>{INDICES_COLUMN_NAMES[2]}</h3>
            <Index indexName={INDICES[2]}>
              <CustomConfigure
                removeWordsIfNoResults={"none"}
                devFeatureFlags={{ neuralSearchAlpha: INDICES_ALPHA[2] }}
              />
              <Hits hitComponent={CustomHit}
                transformItems={transformItems} />
            </Index>
          </div>
        </div>
      </InstantSearch>
    </div>
  );

}

export default App;


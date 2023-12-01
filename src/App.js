import "./App.css";
import React from 'react';
import algoliasearch from "algoliasearch/lite";
import {
  InstantSearch,
  SearchBox,
  Index, Hits,
  useConfigure
} from "react-instantsearch";

import {
  APP_ID,
  API_KEY,
  INDICES, INDICES_COLUMN_NAMES, INDICES_ALPHA,
  HIT_URL_REF, HIT_PER_PAGE, TYPO_TOLERANCE
} from "./config.js";

import { Popover, OverlayTrigger, Button, Badge } from 'react-bootstrap';


const searchClient = algoliasearch(APP_ID, API_KEY);


function Hit({ hit }) {
  const popover = (
    <Popover>
      <Popover.Header as="h3">Popover right</Popover.Header>
      <Popover.Body>
        And here s some <strong>amazing</strong> content.
        right?
      </Popover.Body>
    </Popover>
  );

  return (
    <div className="card"  >
      {/* <span className="badge text-bg-primary">Primary</span> */}
      <h5 className="card-header text-truncate">{hit.productDisplayName}</h5>
      <div className="card-body">
        <p className="card-text text-truncate">{hit.categories[0].displayName}</p>
        <img src={`${HIT_URL_REF}${hit.frontView}`} className="hit-image" alt="" />
      </div>
      <div className="card-footer text-body-secondary">
        <div >
          <span>{hit.position.index + 1} - {hit.objectID}</span>
          <OverlayTrigger trigger="hover" placement="bottom" overlay={popover}>
            <Badge className="bg-secondary float-end">Info</Badge>
          </OverlayTrigger>

        </div>
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

function CustomConfigure(props) {
  // eslint-disable-next-line no-unused-vars
  const { refine } = useConfigure(props);
  return null;
}


function App() {
  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">Popover right</Popover.Header>
      <Popover.Body>
        And here s some <strong>amazing</strong> content.
        right?
      </Popover.Body>
    </Popover>
  );

  return (
    <div className="container text-center">
      <h1>Side by Side App by Algolia</h1>
      <OverlayTrigger trigger="click" placement="right" overlay={popover}>
        <Button variant="success">Click me to see</Button>
      </OverlayTrigger>
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
          <div className="col-4">
            <h3>{INDICES_COLUMN_NAMES[0]}</h3>
            <Index indexName={INDICES[0]}>
              <CustomConfigure removeWordsIfNoResults={"allOptional"} />
              <Hits hitComponent={Hit}
                transformItems={transformItems} />
            </Index>
          </div>
          <div className="col-4">
            <h3>{INDICES_COLUMN_NAMES[1]}</h3>
            <Index indexName={INDICES[1]}>
              <CustomConfigure
                removeWordsIfNoResults={"none"}
                devFeatureFlags={{ neuralSearchAlpha: INDICES_ALPHA[1] }}
              />
              <Hits hitComponent={Hit}
                transformItems={transformItems} />

            </Index>
          </div>
          <div className="col-4">
            <h3>{INDICES_COLUMN_NAMES[2]}</h3>
            <Index indexName={INDICES[2]}>
              <CustomConfigure
                removeWordsIfNoResults={"none"}
                devFeatureFlags={{ neuralSearchAlpha: INDICES_ALPHA[2] }}
              />
              <Hits hitComponent={Hit}
                transformItems={transformItems} />
            </Index>
          </div>
        </div>
      </InstantSearch>
    </div>
  );

}


export default App;


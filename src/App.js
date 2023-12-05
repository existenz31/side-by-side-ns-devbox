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
  INDICES,
  HIT_URL_REF, HIT_PER_PAGE, TYPO_TOLERANCE
} from "./conf/config.js";

import { Popover, OverlayTrigger, Badge, Card } from 'react-bootstrap';


const searchClient = algoliasearch(APP_ID, API_KEY);

// {/* <Popover.Header as="h3">Popover right</Popover.Header> */}

function RankingInfo({ ri }) {
  // keywordScore
  // neuralScore
  // semanticScore
  // userScore
  // mergeInfo: {keyword, semantic}
  return (
    <div>
      <React.Fragment>
        <span>userScore &emsp;<Badge className="float-end bg-secondary">{ri.userScore}</Badge></span><br />
      </React.Fragment>

      {ri.keywordScore !== undefined && (
        <React.Fragment>
          <span>keywordScore &emsp;<Badge className="float-end bg-danger">{Number(ri.keywordScore).toFixed(2)}</Badge></span><br />
        </React.Fragment>
      )}
      {ri.semanticScore !== undefined && (
        <React.Fragment>
          <span>semanticScore &emsp;<Badge className="float-end bg-primary">{Number(ri.semanticScore).toFixed(2)}</Badge></span><br />
        </React.Fragment>
      )}
      {ri.neuralScore !== undefined && (
        <React.Fragment>
          <span>neuralScore &emsp;<Badge className="float-end bg-primary">{Number(ri.neuralScore).toFixed(2)}</Badge></span><br />
        </React.Fragment>
      )}
      {/* {ri.mergeInfo !== undefined && (
        <React.Fragment>
          <span>mergeInfo: {JSON.stringify(ri.mergeInfo)}</span><br />
        </React.Fragment>
      )} */}
    </div>
  )
}
// <span>{ri.semanticScore !== undefined ? 'semanticScore: ' + Number(ri.semanticScore).toFixed(2) : null}</span><br />
// <span>{ri.neuralScore !== undefined ? 'neuralScore: ' + Number(ri.neuralScore).toFixed(2) : null}</span><br />
// <span>{ri.mergeInfo !== undefined ? 'mergeInfo: ' + JSON.stringify(ri.mergeInfo) : null}</span>



function Hit({ hit }) {
  const ri = hit._rankingInfo;
  const popover = (
    <Popover>
      <Popover.Body>
        <RankingInfo ri={ri} />
      </Popover.Body>
    </Popover>
  );

  let badgeBg = "";
  let badgeLabel = "";
  if (ri['keywordScore'] !== undefined) {
    badgeBg = "danger";
    badgeLabel = "Keyword";
  }
  if (ri['semanticScore'] !== undefined) {
    badgeBg = "primary"
    badgeLabel = "Vector";
  }
  if (ri['keywordScore'] !== undefined && ri['semanticScore'] !== undefined) {
    badgeBg = "warning";
    badgeLabel = "Key+Vect";
  }

  return (

    <Card  >
      <Card.Header className="text-truncate">
        <h5 className="text-truncate">{hit.productDisplayName}</h5>
        <Badge className="badge-header" bg={badgeBg}>{badgeLabel}</Badge>
      </Card.Header>
      <Card.Body>
        <p className="card-text text-truncate">{hit.categories[0].displayName}</p>
        <img src={`${HIT_URL_REF}${hit.frontView}`} className="hit-image" alt="" />
      </Card.Body>
      <Card.Footer className="text-body-secondary">
        <span>{hit.position.index + 1} - {hit.objectID}</span>
        <OverlayTrigger trigger="hover" placement="bottom" overlay={popover}>
          <Badge className="bg-secondary badge-footer">Info</Badge>
        </OverlayTrigger>
        {hit._rankingInfo && hit._rankingInfo.promoted && (
          <Badge className="float-start bg-danger">Promo</Badge>
        )}
      </Card.Footer>

    </Card>
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

  return (
    <div className="container text-center">
      <h1>Side by Side App by Algolia</h1>
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
            <h3>{INDICES[0].label}</h3>
            <Index indexName={INDICES[0].name}>
              <CustomConfigure removeWordsIfNoResults={"allOptional"} />
              <Hits hitComponent={Hit}
                transformItems={transformItems} />
            </Index>
          </div>
          <div className="col-4">
            <h3>{INDICES[1].label}</h3>
            <Index indexName={INDICES[1].name}>
              <CustomConfigure
                removeWordsIfNoResults={"none"}
                devFeatureFlags={{ neuralSearchAlpha: INDICES[1].alpha }}
              />
              <Hits hitComponent={Hit}
                transformItems={transformItems} />

            </Index>
          </div>
          <div className="col-4">
            <h3>{INDICES[2].label}</h3>
            <Index indexName={INDICES[2].name}>
              <CustomConfigure
                removeWordsIfNoResults={"none"}
                devFeatureFlags={{ neuralSearchAlpha: INDICES[2].alpha }}
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


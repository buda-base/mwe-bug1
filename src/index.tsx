import React, { FC } from "react"
import * as rdf from "rdflib"
import ReactDOM from 'react-dom/client';

const debug = require("debug")("rde:entity:container:demo")

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const SimpleContainer: FC<{  }> = ({
}) => {
  return (
    <React.Fragment>
      <div>
        <>{rdf.sym("http://example.com/ex").toString()}</>
      </div>
    </React.Fragment>
  )
}

root.render(
  <>
    <SimpleContainer/>
  </>
)

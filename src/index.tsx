import React, { FC } from "react"
import * as rdf from "rdflib"
import { createRoot } from 'react-dom/client';
import { RecoilRoot } from "recoil"
import { BrowserRouter, Route, Routes, useLocation, useParams } from "react-router-dom"

const debug = require("debug")("rde:entity:container:demo")

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

function App() {
  return (
    <BrowserRouter>
      <RecoilRoot>
        <Routes>
          <Route path="/" element={<SimpleContainer />} />
        </Routes>
      </RecoilRoot>
    </BrowserRouter>
  )
}

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<App />);

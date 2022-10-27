import React, { FC } from "react"
import * as rdf from "rdflib"
import { createRoot } from 'react-dom/client';
import { RecoilRoot } from "recoil"
import { BrowserRouter, Route, Routes, useLocation, useParams } from "react-router-dom"
import { demoConfig } from "./demo_rde_config"
import {
  EntityEditContainer,
  EntityEditContainerMayUpdate,
  NewEntityContainer,
  EntityCreationContainer,
  EntityCreationContainerRoute,
  EntityShapeChooserContainer,
  IdTypeParams,
} from "rdf-document-editor"

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
          <Route path="/new" element={<NewEntityContainer config={demoConfig} />} />
        </Routes>
      </RecoilRoot>
    </BrowserRouter>
  )
}

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<App />);

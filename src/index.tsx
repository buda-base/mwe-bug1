import React, { FC } from "react"
import * as rdf from "rdflib"
import { createRoot } from 'react-dom/client';
import { RecoilRoot } from "recoil"
import { BrowserRouter, Route, Routes, useLocation, useParams, Link } from "react-router-dom"
import { demoConfig } from "./demo_rde_config"
import {
  EntityEditContainer,
  EntityEditContainerMayUpdate,
  NewEntityContainer,
  EntityCreationContainer,
  EntityCreationContainerRoute,
  EntityShapeChooserContainer,
  IdTypeParams,
  EntitySelectorContainer,
  BottomBarContainer,
} from "rdf-document-editor"

import "rdf-document-editor/dist/index.css"

const HomeContainer: FC<{  }> = ({
}) => {
  return (
    <React.Fragment>
      <Link to="/new/bds:PersonShape">
        New entity    
      </Link>
      <Link to="/edit/bdr:P1583/bds:PersonShape">
        Load demo record    
      </Link>
    </React.Fragment>
  )
}

function App() {
  return (
    <BrowserRouter>
      <RecoilRoot>
        <EntitySelectorContainer config={demoConfig} />
        <Routes>
              <Route path="/" element={<HomeContainer />} />
              <Route path="/new/:shapeQname" element={<EntityCreationContainer config={demoConfig} />} />
              <Route // we need that route to link back value to property where entity was created
                path="/new/:shapeQname/:subjectQname/:propertyQname/:index"
                element={<EntityCreationContainerRoute config={demoConfig} />}
              />
              <Route // this one as well
                path="/new/:shapeQname/:subjectQname/:propertyQname/:index/:subnodeQname"
                element={<EntityCreationContainerRoute config={demoConfig} />}
              />
              <Route // same with entityQname
                path="/new/:shapeQname/:subjectQname/:propertyQname/:index/named/:entityQname"
                element={<EntityCreationContainerRoute config={demoConfig} />}
              />
              <Route // same with entityQname
                path="/new/:shapeQname/:subjectQname/:propertyQname/:index/:subnodeQname/named/:entityQname"
                element={<EntityCreationContainerRoute config={demoConfig} />}
              />
              <Route
                path="/edit/:entityQname/:shapeQname/:subjectQname/:propertyQname/:index"
                element={<EntityEditContainerMayUpdate config={demoConfig} />}
              />
              <Route
                path="/edit/:entityQname/:shapeQname/:subjectQname/:propertyQname/:index/:subnodeQname"
                element={<EntityEditContainerMayUpdate config={demoConfig} />}
              />
              <Route path="/edit/:entityQname/:shapeQname" element={<EntityEditContainer config={demoConfig} />} />
              <Route path="/edit/:entityQname" element={<EntityShapeChooserContainer config={demoConfig} />} />
        </Routes>
        <BottomBarContainer config={demoConfig}/>
      </RecoilRoot>
    </BrowserRouter>
  )
}

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<App />);

import React, { FC, useEffect } from "react"
import { createRoot } from 'react-dom/client'
import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import { RecoilRoot, useRecoilState } from "recoil"
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
  enTranslations,
  rdf,
  history,
  atoms,
  getHistoryStatus,
  HistoryStatus,
  undoRef, 
  redoRef
} from "rdf-document-editor"
//} from "../index" 

import "rdf-document-editor/dist/index.css"

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: enTranslations,
      },
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
      format: function (value: string, format: string, lng: any) {
        if (format === "lowercase") return value.toLowerCase()
        else if (format === "uppercase") return value.toUpperCase()
        return value
      },
    },
  })

const HomeContainer: FC = () => {
  return (
    <div className="home">
      <div>
        <Link to="/new/bds:PersonShape">
          New entity    
        </Link>
        <br/>
        <br/>
        <Link to="/edit/bdr:P1583/bds:PersonShape">
          Load demo record    
        </Link>
      </div>
    </div>
  )
}

let undoTimer = 0

function AppComponent() {


  const [entities, setEntities] = useRecoilState(atoms.entitiesAtom)
  const [uiTab, setTab] = useRecoilState(atoms.uiTabState)
  const entity = entities.findIndex((e: any, i: any) => i === uiTab)
  const [undos, setUndos] = useRecoilState(atoms.uiUndosState)
  const entityUri = entities[entity]?.subject?.uri || "tmp:uri"
  const undo = undos[entityUri]
  const setUndo = (s: atoms.undoPN) => setUndos({ ...undos, [entityUri]: s })
  const [disabled, setDisabled] = useRecoilState(atoms.uiDisabledTabsState)

  // this is needed to initialize undo/redo without any button being clicked
  // (link between recoil/react states and data updates automatically stored in EntityGraphValues)
  useEffect(() => {
    //if (undoTimer === 0 || entityUri !== undoEntity) {
    //debug("clear:",entities[entity]?.subject,undoTimer, entity, entityUri,entities)
    clearInterval(undoTimer)
    const delay = 150
    undoTimer = window.setInterval(() => {
      //debug("timer", undoTimer, entity, entityUri, history[entityUri], history)
      if (!history[entityUri]) return
      const { top, first, current }:HistoryStatus = getHistoryStatus(entityUri)
      //debug("disable:",disabled,first)
      if (first === -1) return
      if (disabled) setDisabled(false)
      // check if flag is on top => nothing modified
      if (history[entityUri][history[entityUri].length - 1]["tmp:allValuesLoaded"]) {
        if (!atoms.sameUndo(undo, atoms.noUndoRedo)) { //
          //debug("no undo:",undo)
          setUndo(atoms.noUndoRedo)
        }
      } else {
        if (first !== -1) {
          if (current < 0 && first < top) {
            if (history[entityUri][top][entityUri]) {
              // we can undo a modification of simple property value
              const prop = Object.keys(history[entityUri][top][entityUri])
              if (prop && prop.length && entities[entity].subject !== null) {
                const newUndo = {
                  prev: { enabled: true, subjectUri: entityUri, propertyPath: prop[0], parentPath: [] },
                  next: atoms.noUndo,
                }
                if (!atoms.sameUndo(undo, newUndo)) {
                  //debug("has undo1:", undo, newUndo, first, top, history, current, entities[entity])
                  setUndo(newUndo)
                }
              }
            } else {
              // TODO: enable undo when change in subnode
              const parentPath = history[entityUri][top]["tmp:parentPath"]
              if (parentPath && parentPath[0] === entityUri) {
                const sub = Object.keys(history[entityUri][top]).filter(
                  (k) => !["tmp:parentPath", "tmp:undone"].includes(k)
                )
                if (sub && sub.length) {
                  // we can undo a modification of simple value of subproperty of a property
                  const prop = Object.keys(history[entityUri][top][sub[0]])
                  if (prop && prop.length && entities[entity].subject !== null) {
                    const newUndo = {
                      next: atoms.noUndo,
                      prev: { enabled: true, subjectUri: sub[0], propertyPath: prop[0], parentPath },
                    }
                    if (!atoms.sameUndo(undo, newUndo)) {
                      //debug("has undo2:", undo, newUndo, first, top, history, current, entities[entity])
                      setUndo(newUndo)
                    }
                  }
                }
              }
            }
          }
        }
      }
    }, delay)
    //}

    return () => {
      clearInterval(undoTimer)
    }
  }, [disabled, entities, undos, uiTab])
  
  return (
      <>
        <EntitySelectorContainer config={demoConfig} />
        <Routes>
              <Route path="/" element={<HomeContainer />} />
              <Route path="/new" element={<HomeContainer />} />
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
    </>
  )
}


let ctrlDown = false

document.onkeydown = (e: KeyboardEvent) => {
  ctrlDown = e.metaKey || e.ctrlKey
  const key = e.key.toLowerCase()
  //debug("kD", e)
  if (ctrlDown && (key === "z" || key === "y")) {
    //debug("UNDO/REDO", undoRef, redoRef)

    if (!e.shiftKey) {
      if (key === "z" && undoRef && undoRef.current) undoRef.current.click()
      else if (key === "y" && redoRef && redoRef.current) redoRef.current.click()
    } else if (key === "z" && redoRef && redoRef.current) redoRef.current.click()

    // DONE: fix conflict with chrome undo inside text input
    const elem = document.activeElement as HTMLElement
    if (elem) elem.blur()
    e.preventDefault()
    e.stopPropagation()
    return false
  }
}


function App() {
  return (
    <BrowserRouter>
      <RecoilRoot>
        <AppComponent />
      </RecoilRoot>
  </BrowserRouter>

  )
}

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<App />);

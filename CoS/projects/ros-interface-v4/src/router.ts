import { createBrowserRouter } from 'react-router-dom'
import { lazy } from 'react'

const App          = lazy(() => import('./App'))
const NowView      = lazy(() => import('./components/views/NowView'))
const MomentumView = lazy(() => import('./components/views/MomentumView'))
const WorkView     = lazy(() => import('./components/views/WorkView'))
const OpsView      = lazy(() => import('./components/views/OpsView'))
const OsView       = lazy(() => import('./components/views/OsView'))
const MapView      = lazy(() => import('./components/views/MapView'))
const BacklogView  = lazy(() => import('./components/views/BacklogView'))

export const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      { index: true,        Component: NowView },
      { path: 'momentum',   Component: MomentumView },
      { path: 'work',       Component: WorkView },
      { path: 'ops',        Component: OpsView },
      { path: 'os',         Component: OsView },
      { path: 'map',        Component: MapView },
      { path: 'backlog',    Component: BacklogView },
    ],
  },
])

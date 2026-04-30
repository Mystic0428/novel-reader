// src/app.jsx — top-level App with context + router
const AppContext = React.createContext(null);
window.AppContext = AppContext;

const initialState = {
  view: 'library',          // 'library' | 'reader' | 'manage'
  activeBookId: null,
  settings: null,           // loaded async
  books: [],                // loaded async
  roots: [],                // loaded async
  currentBook: null,        // hydrated when entering reader
  ready: false,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return {
        ...state,
        settings: action.payload.settings,
        roots: action.payload.roots,
        books: action.payload.books,
        ready: true,
      };
    case 'SET_VIEW':
      return { ...state, view: action.view, activeBookId: action.bookId ?? null };
    case 'SET_SETTINGS':
      return { ...state, settings: action.settings };
    case 'SET_BOOKS':
      return { ...state, books: action.books };
    case 'SET_ROOTS':
      return { ...state, roots: action.roots };
    case 'SET_CURRENT_BOOK':
      return { ...state, currentBook: action.book };
    default:
      return state;
  }
}

class AppErrorBoundary extends React.Component {
  constructor(p) { super(p); this.state = { err: null }; }
  static getDerivedStateFromError(err) { return { err }; }
  componentDidCatch(err, info) { console.error(err, info); }
  render() {
    if (this.state.err) {
      return (
        <div className="nr-root" style={{
          width: '100%', height: '100vh', display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 14, background: '#F7F5F0', color: '#2B241B', padding: 20,
        }}>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 18 }}>出錯了</div>
          <pre style={{ fontSize: 11, maxWidth: 520, background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', padding: 14, overflow: 'auto', borderRadius: 6 }}>{String(this.state.err && (this.state.err.stack || this.state.err.message))}</pre>
          <button onClick={() => window.location.reload()} style={{ padding: '6px 14px', background: '#fff', border: '0.5px solid rgba(0,0,0,0.12)', borderRadius: 6, cursor: 'pointer' }}>重新整理</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [state, dispatch] = React.useReducer(appReducer, initialState);
  const chapterCacheRef = React.useRef(new Map());

  React.useEffect(() => {
    (async () => {
      try {
        await idb.openDB();
        const [settings, roots, books] = await Promise.all([
          settingsStore.load(),
          rootsStore.list(),
          booksStore.list(),
        ]);
        dispatch({ type: 'HYDRATE', payload: { settings, roots, books } });
      } catch (err) {
        console.error('Failed to hydrate app state:', err);
        dispatch({ type: 'HYDRATE', payload: { settings: {}, roots: [], books: [] } });
      }
    })();
  }, []);

  if (!state.ready) {
    return <div className="loading-screen">N O V E L &nbsp; R E A D E R</div>;
  }

  const ctx = { state, dispatch, chapterCacheRef };
  return (
    <AppContext.Provider value={ctx}>
      {state.view === 'reader' ? <Reader/>
        : state.view === 'manage' ? <ManageView/>
        : <Library/>}
    </AppContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <AppErrorBoundary><App/></AppErrorBoundary>
);

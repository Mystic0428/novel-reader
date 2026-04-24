// src/app.jsx — top-level App with context + router
const AppContext = React.createContext(null);
window.AppContext = AppContext;

const initialState = {
  view: 'library',          // 'library' | 'reader'
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
      return { ...state, ...action.payload, ready: true };
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

function App() {
  const [state, dispatch] = React.useReducer(appReducer, initialState);
  const chapterCacheRef = React.useRef(new Map());

  React.useEffect(() => {
    (async () => {
      await idb.openDB();
      const [settings, roots, books] = await Promise.all([
        settingsStore.load(),
        rootsStore.list(),
        booksStore.list(),
      ]);
      dispatch({ type: 'HYDRATE', payload: { settings, roots, books } });
    })();
  }, []);

  if (!state.ready) {
    return <div className="loading-screen">N O V E L &nbsp; R E A D E R</div>;
  }

  const ctx = { state, dispatch, chapterCacheRef };
  return (
    <AppContext.Provider value={ctx}>
      {state.view === 'library' ? <Library/> : <Reader/>}
    </AppContext.Provider>
  );
}

// Temporary stubs — will be replaced by real implementations in subsequent tasks
window.idb = window.idb || { openDB: async () => {} };
window.settingsStore = window.settingsStore || { load: async () => ({ activeTheme: 'v1' }) };
window.rootsStore = window.rootsStore || { list: async () => [] };
window.booksStore = window.booksStore || { list: async () => [] };
window.Library = window.Library || function Library() {
  return <div className="nr-root" style={{ padding: 40 }}>Library (stub)</div>;
};
window.Reader = window.Reader || function Reader() {
  return <div className="nr-root" style={{ padding: 40 }}>Reader (stub)</div>;
};

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);

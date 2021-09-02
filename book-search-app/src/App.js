import './App.css';
import { grey } from '@material-ui/core/colors';
import SearchPage from './pages/SearchPage';

function App() {
  return (
    /* 
      Single Screen Application
      Adding a default background color to the page 
    */
    <div className="App" style={{ backgroundColor: grey[300], height: '100vh' }}>
      <SearchPage/>
    </div>
  );
}

export default App;

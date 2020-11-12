import "./App.css";

// importing components
import Navigation from "./components/layouts/navbar";
import ProjectList from "./components/projects/project-list";

function App() {
  return (
    <div className="App">
      <Navigation />
      <ProjectList />
    </div>
  );
}

export default App;

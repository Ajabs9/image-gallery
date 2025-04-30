import { Route, Routes } from "react-router-dom";
import ImageGallery from "./pages/ImageGallery";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ImageGallery />} />
      <Route path="/favorites" element={<ImageGallery showFavorites />} />
    </Routes>
  );
}
export default App;
// This is the main entry point of the application. It imports the ImageGallery component and renders it within the App component. The App component is then exported as the default export of the module.
// The ImageGallery component is responsible for displaying a gallery of images, handling user interactions, and managing the state of the application. It includes features such as searching for images, favoriting images, and viewing image details in a modal.
// The App component serves as the root component of the application, and it is typically rendered in the index.js file or similar entry point of the React application.  
import React from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import "./styles.css"; // Import custom styles

const App: React.FC = () => {
  return (
    <div className="auth-page d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3 text-center">
            <h1 className="text-white mb-4">User Authentication</h1>
            <div className="bg-light p-4 rounded shadow">
              <Register />
              <hr />
              <Login />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

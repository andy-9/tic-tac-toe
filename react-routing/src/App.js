import React from "react";
import "./App.css";
import Nav from "./Nav";
import Home from "./Home";
import About from "./About";
import Shop from "./Shop";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function App() {
	return (
		<BrowserRouter>
			<div className="App">
				<Nav />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/about" element={<About />} />
					<Route path="/shop" element={<Shop />} />
				</Routes>
			</div>
		</BrowserRouter>
	);
}

export default App;

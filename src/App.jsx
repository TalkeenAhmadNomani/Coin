import {BrowserRouter as Router , Routes, Route} from "react-router-dom"
import Header from "./component/Header"
import Coins from "./component/Coins"
import Coindetail from "./component/Coindetail"
import Exchange from "./component/Exchange"
import Home from "./component/Home"
import "./index.css"



function App() {
 
  

  return (
    <Router  >
       <Header />
      <Routes>
       
        <Route path="/" element ={<Home/>}/>
        <Route path="/coins" element ={<Coins/>}/>
      
        <Route path="/exchanges" element ={<Exchange/>}/>
        <Route path="/coins/:id" element ={<Coindetail/>}/>
      </Routes>
      
    </Router>
  )
}

export default App

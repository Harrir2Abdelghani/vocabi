import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Navbar from './components/Navbar';
import Home from './Pages/Home';
import Days from './components/Days'
import OrderDays from './components/OrderDays'
import DaysWarmUp from './components/DaysWarmUp'
import Familly2 from './components/Familly2'
import Familly3 from './components/Familly3'
import FamillyWarmUp from './components/FamillyWarmUp'
import NumbersWarmUp from './components/NumbersWarmUp'
import Numbers2 from './components/Numbers2'
import Numbers3 from './components/Numbers3'
import JobsWarmUp from './components/JobsWarmUp'
import GameBoard from './components/GameBoard'
import Jobs3 from './components/Jobs3';
function App() {
  return (
    <div className="App">
      <Navbar />
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/days2' element={<Days />} />
        <Route path='/days3' element={<OrderDays />} />
        <Route path='/dayswarmup' element={<DaysWarmUp />} />
        <Route path='/familly2' element={<Familly2 />} />
        <Route path='/familly3' element={<Familly3 />} />
        <Route path='/famillywarmup' element={<FamillyWarmUp />} />
        <Route path='/numberswarmup' element={<NumbersWarmUp />} />
        <Route path='/numbers2' element={<Numbers2 />} />
        <Route path='/numbers3' element={<Numbers3 />} />
        <Route path='/jobswarmup' element={<JobsWarmUp />} />
        <Route path='/jobs2' element={<GameBoard />} />
        <Route path='/jobs3' element={<Jobs3 />} />
        
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProfileProvider, useUserProfile } from './components/UserProfileContext';
import AvatarSelectionModal from './components/AvatarSelectionModal';
import Navbar from './components/Navbar';
import Home from './Pages/Home';
import Days from './components/Days';
import OrderDays from './components/OrderDays';
import DaysWarmUp from './components/DaysWarmUp';
import Familly2 from './components/Familly2';
import Familly3 from './components/Familly3';
import FamillyWarmUp from './components/FamillyWarmUp';
import NumbersWarmUp from './components/NumbersWarmUp';
import Numbers2 from './components/Numbers2';
import Numbers3 from './components/Numbers3';
import JobsWarmUp from './components/JobsWarmUp';
import GameBoard from './components/GameBoard';
import Jobs3 from './components/Jobs3';
import DailyWarmUp from './components/DailyWarmUp';
import Daily2 from './components/Daily2';
import Daily3 from './components/Daily3';

const AppContent = () => {
  const { isProfileComplete, loading, updateProfile } = useUserProfile();
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  useEffect(() => {
    // Only show modal if loading is complete and profile is not complete
    if (!loading && !isProfileComplete) {
      setShowAvatarModal(true);
    }
  }, [isProfileComplete, loading]);

  const handleProfileComplete = (profile) => {
    updateProfile(profile);
    setShowAvatarModal(false);
  };

  // Show loading screen while checking profile
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🌟</div>
          <h2 className="text-2xl font-bold text-white">Loading VOCABI...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <AvatarSelectionModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        onComplete={handleProfileComplete}
      />
      
      <BrowserRouter>
        <Navbar />
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
          <Route path='/jobswarmup' element={<GameBoard />} />
          <Route path='/jobs2' element={<Jobs3 />} />
          <Route path='/jobs3' element={<JobsWarmUp />} />
          <Route path='/dailywarmup' element={<DailyWarmUp />} />
          <Route path='/daily2' element={<Daily2 />} />
          <Route path='/daily3' element={<Daily3 />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

function App() {
  return (
    <UserProfileProvider>
      <AppContent />
    </UserProfileProvider>
  );
}

export default App;
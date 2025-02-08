import React from 'react'
import Hero from '../components/Hero'
import DaysCards from '../components/DaysCards'
import RelaxationCorner from './../components/RelaxationCorner';
import FamillyCards from '../components/FamillyCards'
import NumbersCards from '../components/NumbersCards'
import JobsCard from '../components/JobsCard'
const Home = () => {
  return (
    <div>
        <Hero />
        <DaysCards />
        <FamillyCards />
        <NumbersCards />
        <JobsCard />
        <RelaxationCorner />
    </div>
  )
}

export default Home
import React, { useState } from 'react';
import { FaSnowflake, FaLeaf, FaSun, FaTree } from 'react-icons/fa';

const monthsData = [
    { name: 'January', icon: <FaSnowflake className="text-blue-400 text-3xl" />, activity: 'When do we celebrate New Year?' },
    { name: 'March', icon: <FaLeaf className="text-green-400 text-3xl" />, activity: 'When does spring arrive?' },
    { name: 'September', icon: <FaTree className="text-orange-500 text-3xl" />, activity: 'When do we go back to school?' },
    { name: 'June', icon: <FaSun className="text-yellow-400 text-3xl" />, activity: 'When does school end?' },
    { name: 'December', icon: <FaSnowflake className="text-blue-400 text-3xl" />, activity: 'When do we have holiday cheer?' },
];

const MagicalMonthsAdventure = () => {
    const [congratulationMessage, setCongratulationMessage] = useState('');
    const [correctMatches, setCorrectMatches] = useState([]);

    const handleDrop = (e, index) => {
        e.preventDefault();
        const activity = e.dataTransfer.getData("text/plain");

        if (monthsData[index].activity === activity) {
            setCorrectMatches((prev) => [...prev, index]);
            setCongratulationMessage(`Great job! You matched ${monthsData[index].name} correctly!`);

            setTimeout(() => {
                setCongratulationMessage('');
            }, 3000);
        } else {
            alert("Try again! That's not the right month.");
        }
    };

    const handleDragStart = (e, activity) => {
        e.dataTransfer.setData("text/plain", activity);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-6">
            <div className='flex item-center justify-center' >
            <h1 className="text-4xl font-bold text-purple-700 mb-6">Magical Months Adventure</h1>
            </div>
            
            <p className="text-2xl font-medium text-gray-700 mb-4">
                Drag the correct month to match the activity!
            </p>

            <div className="flex flex-col items-center">
                <div className="flex gap-2 p-6 bg-white shadow-lg rounded-lg">
                    {monthsData.map((month, index) => (
                        <div
                            key={month.name}
                            className="flex flex-col w-60 items-center text-center"
                            onDrop={(e) => handleDrop(e, index)}
                            onDragOver={(e) => e.preventDefault()}
                            style={{ border: '3px dashed purple', padding: '20px', borderRadius: '10px' }}
                        >
                            {correctMatches.includes(index) ? (
                                <>
                                    <div className="text-6xl mb-2">{month.icon}</div>
                                    <p className="text-xl font-bold text-purple-600">{month.name}</p>
                                </>
                            ) : (
                                <>
                                    <div className="text-6xl mb-2">{month.icon}</div>
                                    <p className="text-xl text-gray-500">{month.activity}</p>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-6">
                    {monthsData
                        .filter((_, index) => !correctMatches.includes(index))
                        .map((month) => (
                            <div
                                key={month.name}
                                draggable
                                onDragStart={(e) => handleDragStart(e, month.activity)}
                                className="flex flex-col w-32 h-24 items-center cursor-pointer bg-white p-4 shadow-md rounded-lg hover:bg-gray-100"
                            >
                                <div className="text-6xl">{month.icon}</div>
                                <p className="mt-2 text-lg font-bold text-gray-600">{month.name}</p>
                            </div>
                        ))}
                </div>
            </div>

            {congratulationMessage && (
                <div className="mt-4 p-4 bg-green-200 text-green-800 rounded shadow-md transition-all duration-1000">
                    {congratulationMessage}
                </div>
            )}
        </div>
    );
};

export default MagicalMonthsAdventure;

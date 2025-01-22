import React, { useEffect, useState } from "react";
import "./App.css";

const Modal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 text-white rounded-lg shadow-lg p-6 w-80 text-center">
        <h2 className="text-xl font-bold mb-4">Are you stupid or what?</h2>
        <p className="mb-6">{message}</p>
        <button
          onClick={onClose}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          OK
        </button>
      </div>
    </div>
  );
};

const App = () => {
  const [champions, setChampions] = useState([]);
  const [draft, setDraft] = useState({});
  const [isShuffling, setIsShuffling] = useState(false);
  const [shufflingRole, setShufflingRole] = useState(null);
  const [shufflingChampion, setShufflingChampion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const roles = ["Top", "Jungle", "Midlane", "Marksman", "Support"];
  const rolePositions = {
    Top: { left: "22%", top: "15%" },
    Jungle: { left: "30%", top: "35%" },
    Midlane: { left: "43%", top: "37%" },
    Marksman: { left: "70%", top: "65%" },
    Support: { left: "75%", top: "65%" },
  };

  const version = "14.24.1";

  useEffect(() => {
    const fetchChampions = async () => {
      try {
        const response = await fetch(
          `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`
        );
        const data = await response.json();
        const championsData = Object.values(data.data);
        setChampions(championsData);
      } catch (error) {
        console.error("Error fetching champion data:", error);
      }
    };

    fetchChampions();
  }, []);

  const randomizeSelection = () => {
    setIsShuffling(true);

    // Step 1: Shuffle roles
    let roleShuffleCount = 0;
    const roleInterval = setInterval(() => {
      setShufflingRole(roles[Math.floor(Math.random() * roles.length)]);
      roleShuffleCount++;
      if (roleShuffleCount > 10) {
        clearInterval(roleInterval);
        finalizeRole();
      }
    }, 100);

    const finalizeRole = () => {
      const availableRoles = roles.filter((role) => !draft[role]);
      if (availableRoles.length === 0) {
        setIsModalOpen(true); 
        setIsShuffling(false);
        return;
      }

      const selectedRole =
        availableRoles[Math.floor(Math.random() * availableRoles.length)];
      setShufflingRole(selectedRole);

      // Step 2: Shuffle champions
      let championShuffleCount = 0;
      const championInterval = setInterval(() => {
        setShufflingChampion(
          champions[Math.floor(Math.random() * champions.length)]
        );
        championShuffleCount++;
        if (championShuffleCount > 10) {
          clearInterval(championInterval);
          finalizeChampion(selectedRole);
        }
      }, 100);
    };

    const finalizeChampion = (selectedRole) => {
      const selectedChampion =
        champions[Math.floor(Math.random() * champions.length)];
      setShufflingChampion(selectedChampion);

      setDraft((prevDraft) => ({
        ...prevDraft,
        [selectedRole]: selectedChampion,
      }));
      setIsShuffling(false);
    };
  };

  const removeSelection = (role) => {
    setDraft((prevDraft) => {
      const updatedDraft = { ...prevDraft };
      delete updatedDraft[role];
      return updatedDraft;
    });
  };

  const resetAll = () => {
    setDraft({});
  };

  return (
    <div className="flex flex-col items-center bg-gray-900 text-white min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-4">League of Legends Random Draft</h1>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message="All roles are already filled!"
      />

      <div className="flex w-full">
        {/* Draft bar */}
        <div className="flex flex-col items-start w-1/5 p-2 bg-gray-800 rounded-lg">
          {Object.entries(draft).map(([role, champion], index) => (
            <div key={index} className="flex items-center mb-4">
              {/* Champion Icon */}
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champion.id}.png`}
                alt={champion.name}
                className="w-12 h-12 rounded-full border-2 border-blue-500 mr-4"
              />
              {/* Placeholder slots for items */}
              <div className="grid grid-cols-6 gap-1">
                {Array(6)
                  .fill(null)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 bg-gray-700 border-2 border-gray-500 rounded"
                    ></div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Static map */}
        <div className="relative w-4/5">
          <img
            src={require("./img/map.webp")}
            alt="Map"
            className="w-full rounded-lg shadow-lg"
          />
          {/* Place role/champion icons */}
          {Object.entries(draft).map(([role, champion]) => (
            <div
              key={role}
              className="absolute flex flex-col items-center"
              style={rolePositions[role]}
            >
              {/* Role Icon */}
              <img
                src={require(`./img/${role.toLowerCase()}.png`)}
                alt={role}
                className="w-12 h-12 mb-2"
              />
              {/* Champion Icon */}
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champion.id}.png`}
                alt={champion.name}
                className="w-16 h-16 rounded-full border-2 border-blue-500"
              />
              {/* Remove Button */}
              <button
                onClick={() => removeSelection(role)}
                className="text-sm bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 mt-2 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          {/* Display shuffling role/champion */}
          {isShuffling && (
            <div
              className="absolute flex flex-col items-center animate-bounce"
              style={
                shufflingRole
                  ? rolePositions[shufflingRole]
                  : { left: "50%", top: "50%" }
              }
            >
              {shufflingRole && (
                <img
                  src={require(`./img/${shufflingRole.toLowerCase()}.png`)}
                  alt={shufflingRole}
                  className="w-12 h-12 mb-2"
                />
              )}
              {shufflingChampion && (
                <img
                  src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${shufflingChampion.id}.png`}
                  alt={shufflingChampion.name}
                  className="w-16 h-16 rounded-full border-2 border-blue-500"
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-8 flex space-x-4">
        <button
          onClick={randomizeSelection}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg transform hover:scale-105 active:scale-95 transition-transform duration-200"
        >
          {isShuffling ? "Shuffling..." : "Randomize"}
        </button>
        <button
          onClick={resetAll}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg"
        >
          Reset All
        </button>
      </div>
    </div>
  );
};

export default App;

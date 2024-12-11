import React, { useEffect, useState } from "react";
import { Howl } from "howler";
import "./App.css";

const App = () => {
  const [champions, setChampions] = useState([]);
  const [draft, setDraft] = useState({});
  const [currentRole, setCurrentRole] = useState(null);
  const [currentChampion, setCurrentChampion] = useState(null);
  const [isShuffling, setIsShuffling] = useState(false);

  const roles = ["Top", "Jungle", "Midlane", "Marksman", "Support"];
  const rolePositions = {
    Top: { left: "20%", top: "8%" },
    Jungle: { left: "50%", top: "50%" },
    Midlane: { left: "40%", top: "26%" },
    Marksman: { left: "65%", top: "65%" },
    Support: { left: "75%", top: "65%" },
  };

  const version = "14.24.6";

  // Shuffle sound effect
  const shuffleSound = new Howl({
    src: ["/sounds/shuffle.mp3"],
    loop: false,
  });

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
    shuffleSound.play();

    // Step 1: Shuffle role icons
    let roleShuffleCount = 0;
    const roleInterval = setInterval(() => {
      setCurrentRole(roles[Math.floor(Math.random() * roles.length)]);
      roleShuffleCount++;
      if (roleShuffleCount > 10) {
        clearInterval(roleInterval);
        finalizeRole();
      }
    }, 100);

    // Step 2: Shuffle champion icons after role selection
    const finalizeRole = () => {
      const availableRoles = roles.filter((role) => !draft[role]);
      if (availableRoles.length === 0) {
        alert("All roles are already filled!");
        setIsShuffling(false);
        return;
      }

      const selectedRole =
        availableRoles[Math.floor(Math.random() * availableRoles.length)];
      setCurrentRole(selectedRole);

      let championShuffleCount = 0;
      const championInterval = setInterval(() => {
        setCurrentChampion(
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
      setCurrentChampion(selectedChampion);

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
      <h1 className="text-4xl font-bold mb-4">League of Legends Draft</h1>

      
      <div className="relative w-full max-w-3xl">
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
            className="absolute flex flex-col items-center"
            style={
              currentRole
                ? rolePositions[currentRole]
                : { left: "50%", top: "50%" }
            }
          >
            {currentRole && (
              <img
                src={require(`./img/${currentRole.toLowerCase()}.png`)}
                alt={currentRole}
                className="w-12 h-12 mb-2 animate-bounce"
              />
            )}
            {currentChampion && (
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${currentChampion.id}.png`}
                alt={currentChampion.name}
                className="w-16 h-16 rounded-full border-2 border-blue-500 animate-bounce"
              />
            )}
          </div>
        )}
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

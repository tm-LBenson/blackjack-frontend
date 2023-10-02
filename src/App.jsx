import { useEffect, useState } from 'react';
import {
  createRoom,
  checkUsername,
  refreshUser,
  usersOnline,
  usersOnlineListener,
  joinExistingRoom,
  listenForRoom,
} from './socket';
import axios from 'axios';
import InputName from './InputName';
import Header from './UI/Header';
import Footer from './UI/Footer';
import ButtonInterface from './ButtonInterface';
import Logout from './Logout';
import OnlineList from './OnlineList';
import GameList from './GameList';
import Table from './Table';
const BACKEND_URL = 'http://localhost:3000';
function App() {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [validUsername, setValidUsername] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentRoom, setCurrentRoom] = useState('');
  const [interval_id, setInterval_id] = useState(0);
  const [nameInfo, setNameInfo] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [listOfGames, setListOfGames] = useState({});

  const startNewGame = () => {
    if (!currentRoom && isLoggedIn) {
      try {
        const newRoomId = Object.keys(listOfGames).length + 1;
        console.log(newRoomId, 'NEW GAME');
        setRoomId(newRoomId);
        createRoom([newRoomId, username]);
        setCurrentRoom(newRoomId);

      } catch (error) {
        // Handle the error appropriately
        console.error('Error creating room:', error);
      }
    }
  };

  const joinGame = (roomId = roomId) => {
    setIsLoggedIn(true);
    joinExistingRoom(username, roomId);
    setRoomId(roomId);
    console.log(`Joining room: ${roomId}`);
  };

  useEffect(() => {
    usersOnline();
    listenForRoom((roomData) => {
      setListOfGames(roomData);
    });
    usersOnlineListener((list) => {
      setListOfGames(list[1] || {});
      setOnlineUsers(list[0] || []);
    });
  }, []);

  const claimName = async () => {
    if (validUsername) {
      await axios.post(BACKEND_URL + '/login', { username });

      usersOnline();
      setIsLoggedIn(true);
    } else {
      setNameInfo('Name taken');
    }
  };

  const playSolo = () => {
    // TODO: Start a solo game
    console.log('Starting a solo game...');
  };

  const logout = async () => {
    await axios.post(BACKEND_URL + '/logout', { username });
    setValidUsername(null);
    setUsername('');
    setIsLoggedIn(false);
    usersOnline();
    clearInterval(interval_id);
    setInterval_id(0);
  };

  useEffect(() => {
    console.log();
    if (username == '' || !username) {
    }
    if (username) {
      checkUsername(username, (results) => {
        setValidUsername(!results);
      });
    }
  }, [username]);

  useEffect(() => {
    if (isLoggedIn && !interval_id) {
      const id = setInterval(() => {
        refreshUser(username);
      }, 20000);
      setInterval_id(id);
    }
  }, [isLoggedIn]);

  return (
    <>
      <Header />
      <main>
        {!roomId ? (
          <>
            <div className="app">
              <h2>Blackjack Game</h2>
              <p>{nameInfo ? nameInfo : <br />}</p>
              <div className="form-wrapper">
                {!isLoggedIn ? (
                  <>
                    <InputName
                      username={username}
                      claimName={claimName}
                      setUsername={setUsername}
                      setNameInfo={setNameInfo}
                    />
                  </>
                ) : (
                  <Logout logout={logout} username={username} />
                )}

                {isLoggedIn && (
                  <ButtonInterface
                    startNewGame={startNewGame}
                    playSolo={playSolo}
                  />
                )}
              </div>
            </div>
          </>
        ) : (
          <Table username={username} roomId={roomId} />
        )}
        <GameList joinGame={joinGame} listOfGames={listOfGames} />
        <OnlineList listOfUsers={onlineUsers} />
      </main>
      <Footer />
    </>
  );
}

export default App;

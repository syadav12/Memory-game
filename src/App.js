import "./styles.css";
import { useEffect, useState } from "react";
import ShuffleCards from "./ShuffleCard";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
  Button
} from "@material-ui/core";
import SetAvatar from "./AllAvatar/SetAvatar";

export default function App() {
  const [data, setData] = useState([]);
  const [disable, setDisable] = useState(false);
  const [openCards, setOpenCards] = useState([]);
  const [clearCards, setClearCards] = useState([]);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [showModal, setShowModal] = useState(false);
  //Calling API to get All Cards Details
  useEffect(() => {
    var getCard = async () => {
      //
      let firstRes = await fetch(
        "https://api.github.com/repos/facebook/react/contributors"
      );
      let secRes = await firstRes.json();
      let res = secRes.slice(0, 6); //to pick element from array
      let finalRes = ShuffleCards(res.concat(res));
      setData(finalRes);
    };
    getCard();
  }, []);
  useEffect(() => {
    checkCompletion();
  }, [clearCards]);
  //called  when Cards flipped
  useEffect(() => {
    let timeout = null;
    if (openCards.length === 2) {
      timeout = setTimeout(evaluate, 1000);
    }
    return () => clearTimeout(timeout);
  }, [openCards]);
  //called  when time changes
  useEffect(() => {
    if (time !== 0) {
      if (time < 60) {
        setTimeout(() => {
          setTime((prev) => prev + 1);
        }, 1000);
      } else {
        setShowModal(true);
      }
    }
  }, [time]);
  //to evalute card flip in each time
  const evaluate = () => {
    const [first, second] = openCards;
    //to check both flipped cards are same or not
    if (data[first].login === data[second].login) {
      setOpenCards([]);
      setClearCards((prev) => [...prev, first, second]);
      setScore((prev) => prev + 100);
      return;
    } else {
      setOpenCards([]);
    }
  };
  //to check weather all cards are flipped
  const checkCompletion = () => {
    if (clearCards.length === 12) {
      setTime(0); //set time 0
      setShowModal(true);
    }
  };
  //to hanlde Restart button
  const handleRestart = () => {
    setData(ShuffleCards(data));
    setTime(0);
    setOpenCards([]);
    setClearCards([]);
    setShowModal(false);
    setScore(0);
  };
  //to Start the Timer
  const startTimer = (e) => {
    e.preventDefault();
    setTime(time + 1);
    setDisable(true);
  };
  return (
    <>
      <div className="main">
        <div className="parent">
          <div className="container">
            {data && (
              <SetAvatar
                data={data}
                setOpenCards={setOpenCards}
                clearCards={clearCards}
                openCards={openCards}
                disable={disable}
                time={time}
              />
            )}
          </div>
          <div className="outer">
            <div>
              <div>
                Total time<div className="score">60 sec</div>
              </div>
              <div>
                Time elapsed <div className="score">{time} sec</div>
              </div>
            </div>
            <div>
              Total score <div className="score">{score}</div>
            </div>
          </div>
        </div>
        <div className="start">
          <Button
            type="button"
            class="btn btn-primary"
            onClick={(e) => startTimer(e)}
          >
            Start
          </Button>
        </div>
      </div>
      {/* code for modal popup */}
      <Dialog open={showModal} className="dialog">
        {score > 0 ? (
          <DialogTitle>Hurray!!! You completed the challenge</DialogTitle>
        ) : (
          <DialogTitle>Time is over!!!</DialogTitle>
        )}
        <DialogContent>
          <DialogContentText>Your score is {score}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleRestart()}
            color="primary"
            variant="outlined"
          >
            Restart
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

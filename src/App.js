import React from "react";
import Dice from "./Dice";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

export default function App() {
  //creating new State for die element and initialising them
  //by allNewDice function because it will gen random array
  const [newDie, setNewDie] = React.useState(allNewDice);
  const [count, setCount] = React.useState(0);
  const [tenzies, setTenzies] = React.useState(false); //check whether the user won or not

  //keeping the states in sync with each other can be a good reason for using useEffect
  React.useEffect(() => {
    const allHeld = newDie.every((die) => die.isHeld);
    const firstValue = newDie[0].value;
    const allSameValues = newDie.every((die) => die.value === firstValue);

    if (allHeld && allSameValues) {
      setTenzies(true);
    }
  }, [newDie]);

  //generate new Die
  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  //generate an array of 10 random number between 1-6

  function allNewDice() {
    const randomArray = [];
    for (let i = 0; i < 10; i++) {
      randomArray.push(generateNewDie());
    }

    return randomArray;
  }

  //Function for holding a number
  function holdDice(id) {
    //using Map Function
    setNewDie((prevDie) =>
      prevDie.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }
  //using forloop put this inside the above curly brace
  // setNewDie(prevDie => {
  //   const modDie = []
  //   for(let i = 0; i < prevDie.length; i++) {
  //     const currentVal = prevDie[i]
  //     if(currentVal.id === id) {
  //       modDie.push({
  //         ...currentVal,
  //         isHeld : !currentVal.isHeld
  //       })
  //     }else {
  //       modDie.push(currentVal)
  //     }
  //   }
  //   return modDie
  // })

  const getDie = newDie.map((die) => {
    return (
      <Dice
        value={die.value}
        key={die.id}
        isHeld={die.isHeld}
        holdDice={() => {
          holdDice(die.id);
        }}
      />
    );
  });

  //function for handling roll button
  //using which every time it is clicked a new die
  //will appear

  function diceRoll() {
    //whereEver new die roll we have to check isHeld property of the die and stick that die and get
    //new value
    if (!tenzies) {
      setNewDie((prevDie) =>
        prevDie.map((die) => {
          return die.isHeld ? die : generateNewDie();
        })
      );

      setCount((prevCount) => prevCount + 1);
    } else {
      setTenzies(false);
      setNewDie(allNewDice());
      setCount(0);
    }
  }

  return (
    <div className="container">
      {tenzies && <Confetti />}
      <div className="card">
        <h1 className="title">Tenzies</h1>
        <p className="instructions">
          Roll until all dice are the same. Click each die to freeze it at its
          current value between rolls.
        </p>
        <div className="grid">{getDie}</div>

        <button onClick={diceRoll} className="roll-dice">
          {tenzies ? "Restart" : "Roll"}
        </button>
        <p>{tenzies && "Click above to start New Game"}</p>
        <p>User Rolled: {count}</p>
        <p>HighScore : {}</p>
      </div>
    </div>
  );
}

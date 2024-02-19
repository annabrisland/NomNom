import { useState } from "react";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { NavLink } from "react-router-dom";

function InputScreen() {
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedProtein, setSelectedProtein] = useState("");

  async function sendStats(user_id, date, cost, cuisine, protein, restaurant) {
    const accessKey = await import.meta.env.VITE_AWS_ACCESS_KEY_ID;
    const secretKey = await import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;
    const client = new DynamoDBClient({
      region: "us-east-1",
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      },
    });
    const docClient = DynamoDBDocumentClient.from(client);
    const input = {
      TableName: "NomNom_Entry",
      Item: {
        user_id: user_id,
        date: date,
        cost: cost,
        cuisine: cuisine,
        protein_consumed: new Set([protein]),
        restaurant_name: restaurant,  
      }
    }
    const command = new PutCommand(input);
    const data = await docClient.send(command);
    alert(`Experience submitted successfully! ${data.$metadata.httpStatusCode}`);
  }

  return (
    <div className="container">
      <header className="statHeader">
        <h1 className="headerSlot">NomNom</h1>
        <NavLink
          className="stats"
          to="/stats"
        >
          📊
        </NavLink>
      </header>
      <form>
        <div className="section">
          <label>Who are you?</label>
          <div className="user-container">
            <div
              className={`user ${
                selectedUser == "harin" ? "selected-user" : ""
              }`}
              onClick={() => setSelectedUser("harin")}
            >
              👦🏻 &nbsp;Harin
            </div>
            <div
              className={`user ${
                selectedUser == "anna" ? "selected-user" : ""
              }`}
              onClick={() => setSelectedUser("anna")}
            >
              👧🏻 &nbsp;Anna
            </div>
          </div>
        </div>
        <p className="section-label">Dish the details</p>
        <div className="input-wrapper">
          <div className="input">
            <input type="text" id="where" required placeholder=" "></input>
            <label>Where did you eat?</label>
          </div>
        </div>
        <div className="input-wrapper">
          <div className="input">
            <input type="number" id="cost" required placeholder=" "></input>
            <label>How much did you spend?</label>
          </div>
        </div>
        <div className="input-wrapper">
          <div className="input">
            <input type="text" id="cuisine" required placeholder=" "></input>
            <label>What cuisine did you eat?</label>
          </div>
        </div>
        <div className="section">
          <label>What protein did you eat?</label>
          <ul className="protein-list">
            <li
              className={`protein-list-item ${
                selectedProtein == "chicken" ? "protein-selected" : ""
              }`}
              onClick={() => setSelectedProtein("chicken")}
              id="chicken"
            >
              🐔 Chicken
            </li>
            <li
              className={`protein-list-item ${
                selectedProtein == "beef" ? "protein-selected" : ""
              }`}
              onClick={() => setSelectedProtein("beef")}
              id="beef"
            >
              🐮 Beef
            </li>
            <li
              className={`protein-list-item ${
                selectedProtein == "lamb" ? "protein-selected" : ""
              }`}
              onClick={() => setSelectedProtein("lamb")}
              id="lamb"
            >
              🐑 Lamb
            </li>
            <li
              className={`protein-list-item ${
                selectedProtein == "turkey" ? "protein-selected" : ""
              }`}
              onClick={() => setSelectedProtein("turkey")}
              id="turkey"
            >
              🦃 Turkey
            </li>
            <li
              className={`protein-list-item ${
                selectedProtein == "pork" ? "protein-selected" : ""
              }`}
              onClick={() => setSelectedProtein("pork")}
              id="pork"
            >
              🐷 Pork
            </li>
            <li
              className={`protein-list-item ${
                selectedProtein == "duck" ? "protein-selected" : ""
              }`}
              onClick={() => setSelectedProtein("duck")}
              id="duck"
            >
              🦆 Duck
            </li>
            <li
              className={`protein-list-item ${
                selectedProtein == "fish" ? "protein-selected" : ""
              }`}
              onClick={() => setSelectedProtein("fish")}
              id="fish"
            >
              🐟 Fish
            </li>
            <li
              className={`protein-list-item ${
                selectedProtein == "seafood" ? "protein-selected" : ""
              }`}
              onClick={() => setSelectedProtein("seafood")}
              id="seafood"
            >
              🍤 Seafood
            </li>
            <li
              className={`protein-list-item ${
                selectedProtein == "plantbased" ? "protein-selected" : ""
              }`}
              onClick={() => setSelectedProtein("plantbased")}
              id="plantbased"
            >
              🌱 Plant Based
            </li>
          </ul>
        </div>
        <button
          className="submit-btn"
          onClick={(e) => {
            e.preventDefault();
            const who = selectedUser;
            const where = document.getElementById("where").value;
            const cost = document.getElementById("cost").value;
            const cuisine = document.getElementById("cuisine").value;
            const protein = selectedProtein;
            const date = new Date()
            const timestamp = date.getTime();
            if (!who || !where || !cost || !cuisine || !protein) {
              alert("Please fill out all fields");
              return;
            }
            sendStats(who, timestamp, cost, cuisine, protein, where);
          }}
        >
          Submit Experience
        </button>
      </form>
    </div>
  );
}

export default InputScreen;

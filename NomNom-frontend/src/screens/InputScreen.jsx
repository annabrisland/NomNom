import "../App.css";

function InputScreen() {
  return (
    <div className="container">
      <header>
        <h1>NomNom</h1>
        Stats
      </header>
      <form>
        <div className="section">
        <label for="user">Who are you?</label>
        <div className="user-container">
            <div className="user">👦🏻 &nbsp;Harin</div>
            <div className="user">👧🏻 &nbsp;Anna</div>
        </div>
        </div>
        <div className="input-wrapper">
          <div className="input">
            <input type="text" id="where" required placeholder=" "></input>
            <label for="where">Where did you eat?</label>
          </div>
        </div>
        <div className="input-wrapper">
          <div className="input">
            <input type="number" id="cost" required placeholder=" "></input>
            <label for="cost">How much did you spend?</label>
          </div>
        </div>
        <div className="input-wrapper">
          <div className="input">
            <input type="text" id="cuisine" required placeholder=" "></input>
            <label for="cuisine">What cuisine did you eat?</label>
          </div>
        </div>
        <div className="section">
        <label for="protein-list">What protein did you eat?</label>
        <ul className="protein-list">
          <li className="protein-list-item" id="chicken">
            🐔 Chicken
          </li>
          <li className="protein-list-item" id="beef">
            🐮 Beef
          </li>
          <li className="protein-list-item" id="lamb">
            🐑 Lamb
          </li>
          <li className="protein-list-item" id="turkey">
            🦃 Turkey
          </li>
          <li className="protein-list-item" id="pork">
            🐷 Pork
          </li>
          <li className="protein-list-item" id="duck">
            🦆 Duck
          </li>
          <li className="protein-list-item" id="fish">
            🐟 Fish
          </li>
          <li className="protein-list-item" id="seafood">
            🍤 Seafood
          </li>
          <li className="protein-list-item" id="plantbased">
            🌱 Plant Based
          </li>
        </ul>
        </div>
        <button className="submit-btn">Submit Experience</button>
      </form>
    </div>
  );
}

export default InputScreen;

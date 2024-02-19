import "../App.css";
import { useEffect, useState } from "react";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import ReactApexChart from "react-apexcharts";
import ProteinMap from "../utils/ProteinMap.js";
import back from "../assets/backArrow.png"

function StatScreen() {
  const [selectedUser, setSelectedUser] = useState("harin");
  const [cuisineSeries, setCuisineSeries] = useState([]);
  const [cuisineList, setCuisineList] = useState([]);
  const [last3Eaten, setLast3Eaten] = useState([]);
  const [mostConsumedProtein, setMostConsumedProtein] = useState("");
  const [leastConsumedProtein, setLeastConsumedProtein] = useState("");
  const cuisineChartOptions = { 
    labels: cuisineList,
    legend: {
      show: true,
      position: "bottom",
    },
  };

  async function getStats(user_id) {
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
      KeyConditionExpression: "user_id = :id",
      ExpressionAttributeValues: {
        ":id": user_id,
      },
    };
    const command = new QueryCommand(input);
    const data = await docClient.send(command);

    const cuisineList = data.Items.map((item) => item.cuisine);
    const uniqueCuisines = [...new Set(cuisineList)];
    setCuisineList(uniqueCuisines);

    const cuisineCount = {};
    for (let i = 0; i < cuisineList.length; i++) {
      cuisineCount[cuisineList[i]] = (cuisineCount[cuisineList[i]] || 0) + 1;
    }
    const cuisineSeries = Object.values(cuisineCount);
    setCuisineSeries(cuisineSeries);

    const lastEatenMap = {};
    for (let i = 0; i < data.Items.length; i++) {
      const item = data.Items[i];
      if (lastEatenMap[item.cuisine]) {
        if (item.date < lastEatenMap[item.cuisine].date) {
          lastEatenMap[item.cuisine] = item;
        }
      } else {
        lastEatenMap[item.cuisine] = item;
      }
    }

    const last3Eaten = Object.entries(lastEatenMap)
      .sort((a, b) => {
        return new Date(b[1].date) - new Date(a[1].date);
      })
      .slice(0, 3);
    setLast3Eaten(last3Eaten);

    const proteinList = data.Items.map((item) => [...item.protein_consumed]);
    const proteinCount = {};
    for (let i = 0; i < proteinList.length; i++) {
      proteinCount[proteinList[i][0]] =
        (proteinCount[proteinList[i][0]] || 0) + 1;
    }
    const proteinCountArray = Object.entries(proteinCount);
    proteinCountArray.sort((a, b) => b[1] - a[1]);
    setMostConsumedProtein(proteinCountArray[0][0]);
    setLeastConsumedProtein(proteinCountArray[proteinCountArray.length - 1][0]);
  }

  useEffect(() => {
    getStats(selectedUser);
  }, [selectedUser]);

  return (
    <div className="container">
      {/* Header */}
      <div className="statHeader">
        <img className="arrow" src={back} onClick={() => {
          window.location.href = "/";
        }}></img>
        <h1  className="headerSlot">NomNom</h1>
      </div>
      {/* Who Dropdown */}
      <div className="user-container">
          <div className={`user ${selectedUser == "harin" ? "selected-user" : ""}`} onClick={() => setSelectedUser("harin")}>👦🏻 &nbsp;Harin</div>
          <div className={`user ${selectedUser == "anna" ? "selected-user" : ""}`} onClick={() => setSelectedUser("anna")}>👧🏻 &nbsp;Anna</div>
      </div>
      {/* Cuisine Pie Chart */}
      <p className="section-label">Your Cuisine Breakdown</p>
      <div className="pieChartArea">
        <ReactApexChart
          options={cuisineChartOptions}
          series={cuisineSeries}
          type="pie"
          width={400}
        />
      </div>
      {/* LRU Cuisine */}
      <div className="cuisineArea">
        <label className="section-label">Your Forgotten Cuisines</label>
        <div>
          {last3Eaten.map((item) => {
            return (
              <div key={item[1].date}>
                <div className="forgotten-item">
                <div className="cuisine-item">{item[1].cuisine}</div>
                from 
                <div className="restaurant-item">{item[1].restaurant_name}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Protein */}
      <div className="proteinArea">
        <label className="section-label">Your Favourite Protein</label>
        <div className="proteinCompare">
          <div className="bigProtein">{ProteinMap[mostConsumedProtein]}</div>
          <div className="compareSign">{">"}</div>
          <div className="smallProtein">{ProteinMap[leastConsumedProtein]}</div>
        </div>
      </div>
    </div>
  );
}

export default StatScreen;

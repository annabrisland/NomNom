import "../App.css";
import { useEffect, useState } from "react";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import ReactApexChart from "react-apexcharts";

function StatScreen() {
  const [selectedUser, setSelectedUser] = useState("harin");
  const [cuisineSeries, setCuisineSeries] = useState([]);
  const [cuisineList, setCuisineList] = useState([]);
  const [last3Eaten, setLast3Eaten] = useState([]);
  const [mostConsumedProtein, setMostConsumedProtein] = useState("");
  const [leastConsumedProtein, setLeastConsumedProtein] = useState("");

  const cuisineChartOptions = {
    chart: {
      width: 380,
      type: "pie",
    },
    labels: cuisineList,
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
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
    console.log(data.Items);

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
    <div>
      {/* Header */}
      <div className="statHeader">
        <div>Back</div>
        <div>BiteSnap</div>
        <div>Placeholder</div>
      </div>
      {/* Who Dropdown */}
      <div className="whoDropdown">
        <div
          onClick={() => {
            setSelectedUser("harin");
          }}
        >
          Harin
        </div>
        <div
          onClick={() => {
            setSelectedUser("anna");
          }}
        >
          Anna
        </div>
      </div>
      {/* Cuisine Pie Chart */}
      <div className="pieChartArea">
        {console.log(cuisineChartOptions)}
        <ReactApexChart
          options={cuisineChartOptions}
          series={cuisineSeries}
          type="pie"
          width={380}
        />
      </div>
      {/* LRU Cuisine */}
      <div className="whoDropdown">
        <div>You have not had these in a while!</div>
        <div>
          {last3Eaten.map((item) => {
            return (
              <div key={item[1].date}>
                {item[1].cuisine} - {item[1].restaurant_name}
              </div>
            );
          })}
        </div>
      </div>
      {/* Protein */}
      <div className="whoDropdown">
        <div>Most Consumed Protein vs Least Consumed Protein</div>
        <div>
          <div>{mostConsumedProtein}</div>
          <div>{leastConsumedProtein}</div>
        </div>
      </div>
    </div>
  );
}

export default StatScreen;

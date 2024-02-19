import "../App.css";
import { useEffect, useState } from "react";
import { DynamoDBClient, ListBackupsCommand } from "@aws-sdk/client-dynamodb";
import ApexCharts from "apexcharts";
import ReactApexChart from "react-apexcharts";

function StatScreen() {
  useEffect(() => {
    const client = new DynamoDBClient({ region: "us-east-1" });
    const command = new ListBackupsCommand({ TableName: "BiteSnap" });
    client.send(command).then(
      (data) => console.log(data.BackupSummaries),
      (error) => console.error(error)
    );
  }, []);

  const users = ["harin", "anna"];
  const [selectedUser, setSelectedUser] = useState("harin");
  const [costSeries, setCostSeries] = useState([]);
  const [cuisineSeries, setCuisineSeries] = useState([]);
  const costChartOptions = {
    chart: {
      height: 350,
      type: "line",
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
    },
    title: {
      text: "Product Trends by Month",
      align: "left",
    },
    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
        opacity: 0.5,
      },
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
      ],
    },
  };

  const cuisineChartOptions = {
    chart: {
      width: 380,
      type: "pie",
    },
    labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
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

  const dummyData = [
    {
      entry_id: 1,
      user_id: "harin",
      cost: 20.29,
      cuisine: "Chinese",
      protein_consumed: ["pork"],
      restaurant_name: "Happy Noodle House",
      date: "2021-10-01",
    },
    {
      entry_id: 2,
      user_id: "harin",
      cost: 15.29,
      cuisine: "Italian",
      protein_consumed: ["beef"],
      restaurant_name: "Pasta Palace",
      date: "2021-10-02",
    },
    {
      entry_id: 3,
      user_id: "harin",
      cost: 30.29,
      cuisine: "Mexican",
      protein_consumed: ["chicken"],
      restaurant_name: "Taco Time",
      date: "2021-10-03",
    },
    {
      entry_id: 4,
      user_id: "harin",
      cost: 25.29,
      cuisine: "Japanese",
      protein_consumed: ["fish"],
      restaurant_name: "Sushi Bar",
      date: "2021-10-04",
    },
  ];

  useEffect(() => {
    const costSeries = dummyData
      .filter((entry) => entry.user_id === selectedUser)
      .map((entry) => entry.cost);
    setCostSeries(costSeries);
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
      <div className="whoDropdown">Who Dropdown</div>
      {/* Cost Graph */}
      <div className="whoDropdown">
        <ReactApexChart
          options={costChartOptions}
          series={costSeries}
          type="line"
          height={350}
        />
      </div>
      {/* Cuisine Pie Chart */}
      <div className="whoDropdown">
        <ReactApexChart
          options={cuisineChartOptions}
          series={cuisineSeries}
          type="pie"
          width={380}
        />
      </div>
      {/* LRU Cuisine */}
      <div className="whoDropdown">You haven't had these in a while!</div>
      {/* Protein */}
      <div className="whoDropdown">
        Most Consumed Protein vs Least Consumed Protein
      </div>
    </div>
  );
}

export default StatScreen;

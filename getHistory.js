import { Client, logger } from "camunda-external-task-client-js";
import { Variables } from "camunda-external-task-client-js";

// configuration for the Client:
//  - 'baseUrl': url to the Process Engine
//  - 'logger': utility to automatically log important events
const config = { baseUrl: "http://localhost:8080/engine-rest", use: logger };

const processVariables = new Variables();

async function fetchData() {
    
    const restApiHistory = "http://localhost:8080/engine-rest/history/process-instance";

    console.log("fetch camunda history: " + restApiHistory);

    try {
      const response = await fetch(restApiHistory);  // Wait for the response from fetch
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json(); // Wait for the JSON data to be parsed
      processVariables.set("data", data);
      console.log(data);  // Handle the fetched data
    } catch (error) {
      console.error('Error with the fetch operation:', error);  // Handle errors
    }
  }

// create a Client instance with custom configuration
const client = new Client(config);

// susbscribe to the topic: 'creditScoreChecker'
client.subscribe("getHistory", async function({ task, taskService }) {
  // Put your business logic
  // complete the task

  console.log("start fetching camunda history");

  await fetchData();

  await taskService.complete(task,processVariables);
});
import { Client, logger } from "camunda-external-task-client-js";
import { Variables } from "camunda-external-task-client-js";

// configuration for the Client:
//  - 'baseUrl': url to the Process Engine
//  - 'logger': utility to automatically log important events
const config = { baseUrl: "http://localhost:8080/engine-rest", use: logger };

// create a Client instance with custom configuration
const client = new Client(config);

// susbscribe to the topic: 'creditScoreChecker'
client.subscribe("topicName", async function({ task, taskService }) {
  // Put your business logic
  // complete the task

  console.log("Start weather validation");

  const cityName = task.variables.get("cityName");

  // set a process variable 'winning'
  const processVariables = new Variables();
  console.log("City name: " + cityName.toLowerCase());

  if(cityName.toLowerCase() === "london"){
    console.log("weather is bad");
    processVariables.set("status", "bad weather");
  }else {
    console.log("weather is good");
    processVariables.set("status", "good weather");
  }

  await taskService.complete(task,processVariables);
});
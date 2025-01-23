import { Client, logger } from "camunda-external-task-client-js";
import { Variables } from "camunda-external-task-client-js";

// configuration for the Client:
//  - 'baseUrl': url to the Process Engine
//  - 'logger': utility to automatically log important events
const config = { baseUrl: "http://localhost:8080/engine-rest", use: logger };

// create a Client instance with custom configuration
const client = new Client(config);

const processVariables = new Variables();

async function fetchData(cityName, task, taskService) {

    var restApiHistory = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=80c19f3f2d663232fee34ec3f0283dc4";

    console.log("fetch weather for city: " + cityName);
    console.log("fetch weather at: " + restApiHistory);


    try {
      const response = await fetch(restApiHistory);  // Wait for the response from fetch
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json(); // Wait for the JSON data to be parsed
      processVariables.set("weatherTyp", data.weather[0].main);
      processVariables.set("windSpeed", data.wind.speed);
      console.log(data.weather[0].main);  // Handle the fetched data
      console.log(data.wind.speed);
    } catch (error) {
      await taskService.handleBpmnError(task, "errorCityNotFound", "errorCityNotFound");
      console.error('Error with the fetch operation:', error);  // Handle errors
    }
  }



client.subscribe("getWeather", async function({ task, taskService }) {
  // Put your business logic
  // complete the task
  
  console.log("start weather worker");

  var cityName = task.variables.get("cityName");

  await fetchData(cityName, task, taskService);

  await taskService.complete(task,processVariables);
});
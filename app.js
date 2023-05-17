const express = require("express");
const axios = require("axios");
const app = express();
const port = process.env.PORT || 3001;

app.get("/", (req, res) => res.type('html').send("Welcome to the JIRA proxy server!"));

app.get("/jira/:filterId", async (req, res) => {
  const filterId = req.params.filterId;
  const jiraApiUrl = `https://jira.tools.tax.service.gov.uk/rest/api/2/filter/${filterId}`;

  try {
    const response = await axios.get(jiraApiUrl, {
      headers: {
        // Add any required headers here, such as an API key or authentication
        'Authorization': req.headers.authorization,
      },
    });

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

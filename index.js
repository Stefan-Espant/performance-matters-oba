// Importeert basis modules uit npm
import express from "express";
import dotenv from "dotenv";

dotenv.config();

// Maakt een nieuwe express app
const server = express();

// Stelt de public map in
server.use(express.static('public'))

// Stelt het poortnummer in waar express op gaat luisteren
server.set("port", process.env.PORT || 8000);

// Activeert het .env bestand
dotenv.config();

// Stel in hoe express gebruikt kan worden
server.set("view engine", "ejs");
server.set("views", "./views");

// Start express op, haal het ingestelde poortnummer op
server.listen(server.get("port"), function () {
	// Toon een bericht in de console en geef het poortnummer door
	console.log(
		`Application started on http://localhost:${server.get(
			"port"
		)}`
	);
});

// Extenties voor de URL
const space = "%20";
const bookItems = "boeken";

// Endpoints voor de URL
const urlSearch = "search/";

// Opbouw URL van de API
const urlBase = "https://zoeken.oba.nl/api/v1/";
const urlQuery = "?q=";
const urlDefault = "special:all";
const urlKey = `${process.env.KEY}`;
const urlOutput = "&refine=true&output=json";

const defaultUrl =
	urlBase + urlSearch + urlQuery + urlDefault + space + bookItems + urlKey + urlOutput;



// Maakt een route voor de index
server.get("/", (request, response) => {
	fetchJson(defaultUrl).then((data) => {
		response.render("index", data);
	});
});

// Maakt een route voor de detailpagina
server.get("/item", async (request, response) => {

	let uniqueQuery = "?id=";
	let urlId = request.query.id || "|oba-catalogus|279240";

	const itemUrl = 
	urlBase + urlSearch + uniqueQuery + urlId + urlKey + urlOutput;

	const data = await fetch(itemUrl)
		.then((response) => response.json())
		.catch((err) => err);
	response.render("item", data);
});

// Maakt een route voor de reguliere reserveringspagina

server.get("/reserveren", (request, response) => {
	response.render("reserveren");
});

// Maakt een route voor de studieplek reserveringspagina
server.get("/reserveer-een-studieplek", (request, response) => {
		response.render("reserveer-een-studieplek");
});

/**
 * fetchJson() is a wrapper for the experimental node fetch api. It fetches the url
 * passed as a parameter and returns the response body parsed through json.
 * @param {*} url the api endpoint to address
 * @returns the json response from the api endpoint
 */
 export async function fetchJson(url, payload = {}) {
	return await fetch(url, payload)
		.then((response) => response.json())
		.catch((error) => error);
}

export async function postJson(url, body) {
	return await fetch(url, {
		method: "post",
		body: JSON.stringify(body),
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((response) => response.json())
		.catch((error) => error);
}


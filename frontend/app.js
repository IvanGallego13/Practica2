const output = document.getElementById("output");

// Base URLs para las APIs disponibles
const baseURLs = {
  hello: "http://127.0.0.1:8001/api/hello",
  json: "http://127.0.0.1:8001/api/json",
  csv: "http://127.0.0.1:8001/api/csv",
};

let selectedEndpoint = "hello"; // Endpoint seleccionado por defecto

// Cambiar entre Hello, JSON y CSV
document.getElementById("hello-btn").addEventListener("click", () => {
  selectedEndpoint = "hello";
  updateActiveButton("hello-btn");
  output.value = "Selected: Class Hello";
});

document.getElementById("json-btn").addEventListener("click", () => {
  selectedEndpoint = "json";
  updateActiveButton("json-btn");
  output.value = "Selected: JSON";
});

document.getElementById("csv-btn").addEventListener("click", () => {
  selectedEndpoint = "csv";
  updateActiveButton("csv-btn");
  output.value = "Selected: CSV";
});

// Actualiza el botón activo
function updateActiveButton(activeButtonId) {
  document.getElementById("hello-btn").classList.remove("active");
  document.getElementById("json-btn").classList.remove("active");
  document.getElementById("csv-btn").classList.remove("active");
  document.getElementById(activeButtonId).classList.add("active");
}

// Función para realizar solicitudes HTTP
const fetchData = async (method, endpoint = "", body = null) => {
  try {
    const url = `${baseURLs[selectedEndpoint]}${endpoint}`;
    const options = {
      method,
      headers: { "Content-Type": "application/json" },
    };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.mensaje || `Error ${response.status}`);
    }

    output.value = JSON.stringify(data, null, 2);
  } catch (error) {
    output.value = `Error: ${error.message}`;
  }
};

// Operaciones CRUD
document.getElementById("get-files").addEventListener("click", () => {
  fetchData("GET");
});

document.getElementById("store").addEventListener("click", () => {
  const filename = prompt(
    `Enter filename (e.g., file.${selectedEndpoint === "csv" ? "csv" : "txt"}):`
  );
  const content =
    selectedEndpoint === "csv"
      ? prompt(
          "Enter file content in CSV format (e.g., header1,header2\\nvalue1,value2):"
        )
      : prompt("Enter file content:");

  if (filename && content) {
    const requestBody = { filename, content };
    fetchData("POST", "", requestBody);
  }
});

document.getElementById("show").addEventListener("click", () => {
  const filename = prompt("Enter filename to show:");
  if (filename) {
    fetchData("GET", `/${filename}`);
  }
});

document.getElementById("update").addEventListener("click", () => {
  const filename = prompt("Enter filename to update:");
  const content = prompt("Enter new content:");
  if (filename && content) {
    const requestBody = { content };
    fetchData("PUT", `/${filename}`, requestBody);
  }
});

document.getElementById("delete").addEventListener("click", () => {
  const filename = prompt("Enter filename to delete:");
  if (filename) {
    fetchData("DELETE", `/${filename}`);
  }
});

// @deno-types="deno.ns"
// launcher.ts
// This script starts the backend and frontend, then opens the browser to localhost:3000

export { }

// Load config from config.json
let config = {
  provider: "ollama",
  ollama: {
    apiBaseUrl: "http://localhost:11434",
    model: "llama3.2"
  },
  nvidia: {
    apiBaseUrl: "https://integrate.api.nvidia.com/v1",
    model: "meta/llama-3.1-70b-instruct",
    apiKey: ""
  }
};

try {
  const configFile = await Deno.readTextFile("./config.json");
  config = JSON.parse(configFile);
} catch (e) {
  console.log("[launcher] Using default config (config.json not found or invalid)");
}

function streamOutput(process: any, name: string) {
  const decoder = new TextDecoder();
  (async () => {
    for await (const chunk of process.stdout) {
      if (chunk) {
        console.log(`[${name}]`, decoder.decode(chunk));
      }
    }
  })();
  (async () => {
    for await (const chunk of process.stderr) {
      if (chunk) {
        console.error(`[${name} ERROR]`, decoder.decode(chunk));
      }
    }
  })();
}

const backendCommand = new Deno.Command("deno", {
  args: ["run", "--allow-env", "--allow-net", "--allow-read", "src/deno_entry.ts"],
  cwd: "./worker",
  env: {
    "LLM_PROVIDER": config.provider || "ollama",
    "OLLAMA_API_BASE_URL": config.ollama?.apiBaseUrl || "http://localhost:11434",
    "OLLAMA_MODEL": config.ollama?.model || "llama3.2",
    "NVIDIA_API_BASE_URL": config.nvidia?.apiBaseUrl || "https://integrate.api.nvidia.com/v1",
    "NVIDIA_MODEL": config.nvidia?.model || "meta/llama-3.1-70b-instruct",
    "NVIDIA_API_KEY": config.nvidia?.apiKey || ""
  },
  stdout: "piped",
  stderr: "piped",
});
const backendProcess = backendCommand.spawn();
streamOutput(backendProcess, "backend");

const frontendCommand = new Deno.Command("npm", {
  args: ["run", "dev"],
  cwd: "./frontend",
  env: { "BROWSER": "none" },
  stdout: "piped",
  stderr: "piped",
});
const frontendProcess = frontendCommand.spawn();
streamOutput(frontendProcess, "frontend");

// Wait a few seconds for servers to start
await new Promise((resolve) => setTimeout(resolve, 5000));

// Open the browser to localhost:3000
const openCmd = Deno.build.os === "windows"
  ? ["cmd", "/c", "start", "http://localhost:3000"]
  : ["xdg-open", "http://localhost:3000"];
const openCommand = new Deno.Command(openCmd[0], {
  args: openCmd.slice(1),
});
openCommand.spawn();

console.log("Webapp should be available at http://localhost:3000");

// Wait for both processes to exit (optional, or handle signals for cleanup)
await backendProcess.status;
await frontendProcess.status;

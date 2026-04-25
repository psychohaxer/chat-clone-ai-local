# 🗣️ AI Person Mimicry Chat 🧠

Welcome to the AI Person Mimicry Chat project! This application allows you to utilize your WhatsApp chat history to create an AI persona that mimics a specific participant from your conversations. Powered by local Large Language Models (LLMs) via Ollama, all your data stays on your machine, ensuring privacy.

## ✨ Features

* **🕵️ Persona Mimicry:** Select your WhatsApp chat history file and select a participant for the AI to mimic.
* **🔒 Local Processing:** All chat parsing happens locally on your machine and AI interactions using Ollama on your machine itself. BitWattr does not guarantee privacy as it depends on your machine and Ollama.
* **🚀 Easy Setup:** Get started quickly with a pre-built executable or by running the Deno source code directly.
* **⚙️ Customizable LLM Settings:** Adjust your Ollama host and LLM model directly from the application's settings page or by modifying `config.json` in downloaded releases.
* **🌐 Web-Based Interface:** Access the application easily through your web browser.

## 🚀 Getting Started

To use this application, you'll need to have [Ollama](https://ollama.com/download) installed and at least one LLM model downloaded (e.g., `llama3.2`).

### 1. Install Ollama & Download an LLM

1.  **Download Ollama:** Visit <https://ollama.com/download> and download the appropriate version for your operating system (Windows, macOS, Linux).
2.  **Install Ollama:** Follow the installation instructions for your system.
3.  **Download an LLM Model:** Open your terminal or command prompt and download a model. For example:

    ```bash
    ollama run llama3.2
    ```

    This command will download the model if you don't have it already. Ensure Ollama is running in the background when you use the application.

### 2. Local Setup Options

You can run the application locally in two ways:

#### Running from Downloaded Release 📦 (Windows Only)

1.  **Download Release:** Download the latest `.zip` file from the [releases page](https://github.com/BitWattr/chat-clone-ai-local/releases).
2.  **Extract:** Extract the contents of the zip file to your desired location.
3.  **Run:** Execute `launcher.exe` from the extracted folder.
4.  Your default web browser should automatically open to `http://localhost:3000`. If not, paste the link into a browser.
5.  **Configure (Optional):** You can change the Ollama API URL and model by editing the `config.json` file in the extracted folder.

#### Running from Source 💻 (Windows, macOS, Linux)

1.  **Install Deno:** If you don't have Deno installed, follow the instructions at <https://deno.land/#installation>.
2.  **Clone the Repository:**

    ```bash
    git clone https://github.com/BitWattr/chat-clone-ai-local
    cd chat-clone-ai-local
    ```

3.  **Install Dependencies:**

    ```bash
    # Install root npm dependencies
    npm install

    # Install frontend dependencies
    cd frontend && npm install && cd ..

    # Install worker dependencies
    cd worker && npm install && deno install && cd ..
    ```

4.  **Configure Settings (Optional):**

    Create a `config.json` file in the root directory to customize Ollama settings:

    ```json
    {
      "ollama": {
        "apiBaseUrl": "http://localhost:11434",
        "model": "llama3.2"
      }
    }
    ```

5.  **Run the Application:**

    ```bash
    deno run --allow-run --allow-env --allow-net --allow-read launcher.ts
    ```

6.  Your default web browser should automatically open to `http://localhost:3000`. If not, paste the link into a browser.

## 🔧 Troubleshooting

### Common Issues

**"react-scripts: not found" or "uuid package not found"**
- Make sure you've run all the dependency installation commands:
  ```bash
  npm install
  cd frontend && npm install && cd ..
  cd worker && npm install && deno install && cd ..
  ```

**"Could not resolve 'uuid'" or other dependency errors**
- Run `deno install` in the worker directory to install Deno dependencies
- Run `npm install` in both root and worker directories for Node.js packages

**"frontendProcess is not defined" or launcher errors**
- Make sure the `launcher.ts` file is properly formatted (check for syntax errors)

**Ollama connection issues**
- Ensure Ollama is running: `ollama serve`
- Check that your model is downloaded: `ollama list`
- Verify the API URL in `config.json` matches your Ollama setup

**Application won't start**
- Check that ports 3000 (frontend) and 8000 (backend) are available
- Try running the backend and frontend separately for debugging:
  ```bash
  # Backend only
  cd worker && deno run --allow-env --allow-net --allow-read src/deno_entry.ts

  # Frontend only
  cd frontend && npm start
  ```

You can change the Ollama API URL and model by editing the `config.json` file in the root folder.

**Example config.json:**
```json
{
  "ollama": {
    "apiBaseUrl": "http://localhost:11434",
    "model": "llama3.2"
  }
}
```

* **apiBaseUrl:** The address where your Ollama server is running (default is `http://localhost:11434`).
* **model:** The name of the Large Language Model you want to use (default is `llama3.2`). This model must be downloaded in Ollama.

**To change the model:**
1. Edit `config.json` and update the `model` field
2. Make sure the model is downloaded: `ollama run <model_name>`
3. Restart the application

**Important:** Ensure Ollama is running and the specified LLM model is downloaded before attempting to use the chat functionality.

## 🤝 How It Works (The Magic Behind the Mimicry)

This AI-powered person mimicry application, developed by the **BitWattr** organization, functions locally on your machine with a strong emphasis on privacy.

Here's a breakdown of the process:

1.  **📤 Upload Chat History:**
    * You begin by uploading your WhatsApp chat history as a `.txt` file. A detailed tutorial on how to export this file from WhatsApp is available on the upload page.
    * Your locally running backend service receives this file.
2.  **📝 Parse Chat Data:**
    * The uploaded chat content is immediately parsed *in-memory* using a custom Deno parser.
    * This process extracts individual messages, their timestamps, and identifies all unique participants in the conversation.
3.  **⏳ Session Management:**
    * A unique, temporary session ID is generated for your parsed chat data.
    * This session and its associated data are held in *volatile memory only*. They are **never permanently stored or written to your disk**.
    * Your session automatically expires and all associated data is **permanently deleted from memory after 30 minutes of inactivity**.
4.  **👤 Persona Selection:**
    * Once your chat is processed, the application lists identified participants.
    * You then select one of these participants to be the "persona" that the AI will mimic. The other participant in the chat will be considered "You" for the AI's responses.
5.  **💬 AI Interaction:**
    * When you send a message in the chat interface, it's added to the live, in-memory chat history.
    * This updated history, along with a carefully crafted system prompt instructing the AI to act as your chosen persona, is sent to the Large Language Model (LLM) powered by Ollama, running directly on your local machine.
6.  **✨ Generating Responses:**
    * The local LLM analyzes the entire conversation history and generates a response that is natural, coherent, and crucially, in the distinct style and character of the selected persona.
    * This AI-generated response is then displayed back in your chat interface.

**In essence, this project leverages your private chat history to create a dynamic AI twin of a specific person, allowing it to generate responses that closely resemble how that person would communicate – all within the secure confines of your local environment.**

## 🛡️ Privacy

* **No Data Storage:** We do not store any of your chat data or personal information on any external servers. All processing happens *locally* and *in-memory* on your machine.
* **Temporary Sessions:** Chat data is held temporarily in your computer's RAM for the duration of your active session and is automatically deleted after 30 minutes of inactivity.
* **Open Source:** The entire codebase is open-source and available on our GitHub repository, allowing for full transparency and inspection of how your data is handled.

For more details, please refer to the "Data Privacy Policy for Local Use" section on the application's upload page.

## 🙏 Support the Project

If you find this project useful, consider supporting us! [Donate](https://bitwattr.pages.dev/donate). Your contributions help us continue developing and improving privacy-focused AI tools.

## 📞 Contact

For questions, issues, or contributions, please visit our [GitHub repository](https://github.com/BitWattr/chat-clone-ai-local) and open an issue or pull request.

## 🔗 Hosted Service

This service is also hosted at: <https://chat-clone-ai.pages.dev/>

---
Developed with ❤️ by **BitWattr Organization**
## Phanes

Personalized, seamless web journey

### Getting Started

### API Keys Configuration

To integrate various AI services, you'll need to set up API keys. Insert your API keys in the appropriate environment variables.

1. **Google Generative AI API Keys**:
    - Obtain your API keys from [Google AI Studio](https://aistudio.google.com/app/apikey)
    - Set the keys in your environment:
      ```bash
      GOOGLE_GENERATIVE_AI_API_KEYS=[<insert_key>, <insert_key>, <insert_key>, <insert_key>, ...]
      ```

2. **Groq API Key**:
    - Obtain your API key from [Groq Console](https://console.groq.com/keys)
    - Set the key in your environment:
      ```bash
      GROQ_API_KEY=<insert_key>
      ```

3. **OpenAI API Key**:
    - Obtain your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
    - Set the key in your environment:
      ```bash
      OPENAI_API_KEY=<insert_key>
      ```

#### Frontend Setup

1. Navigate to the frontend directory:
    ```bash
    cd frontend/
    ```

2. Install the necessary dependencies using one of the following package managers:
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```

3. Run the development server:
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    # or
    bun run dev
    ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

#### Backend Setup

1. Navigate to the backend directory:
    ```bash
    cd backend/
    ```

2. Create and activate a virtual environment:

    On macOS/Linux:
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

    On Windows:
    ```bash
    python -m venv venv
    .\venv\Scripts\activate
    ```

3. Install the required packages:
    ```bash
    pip install -r requirements.txt
    ```

4. Start the backend server:
    ```bash
    uvicorn main:app --reload
    ```

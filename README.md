## Phanes

Personalized, seamless web journey

### Getting Started

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
    bun dev
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
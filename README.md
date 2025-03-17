# Pensieve - Academic Assignment Grading System

Pensieve is a dual-portal system for academic assignment grading, featuring separate interfaces for students and teachers to view graded assignments.

## How to Run the Program

### Prerequisites
- Node.js (v14 or higher)
- Python 3.9+ with pip
- OpenAI API key

### Backend Setup (API)

1. Navigate to the API directory:
   ```
   cd api
   ```

2. Create a virtual environment and activate it:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the api directory with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

5. Start the backend server:
   ```
   python -m uvicorn app:app --host 0.0.0.0 --port 5002
   ```
   The API will be available at http://localhost:5002

### Teacher Portal Setup (Pensieve App)

1. Navigate to the pensieve-app directory:
   ```
   cd pensieve-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```
   The teacher portal will be available at http://localhost:5173

### Student Portal Setup

1. Navigate to the student-portal directory:
   ```
   cd student-portal
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```
   The student portal will be available at http://localhost:3001

## Approach and Challenges

### Approach
- Developed a FastAPI backend that uses GPT-4o to analyze and grade PDF assignments
- Created separate React frontends for teachers and students
- Implemented PDF processing with PyMuPDF for text extraction and image conversion
- Used GPT-4o Vision capabilities to analyze handwritten content in assignments

### Challenges
- Handling handwritten content recognition required image preprocessing and enhancement
- Ensuring consistent JSON responses from the GPT-4o API
- Managing PDF file processing and base64 encoding/decoding
- Creating an intuitive UI for both teacher and student portals

## Design Decisions

- **Dual Portal Architecture**: Separate interfaces for teachers and students to provide tailored experiences
- **FastAPI Backend**: Chosen for its performance, async capabilities, and easy integration with Python libraries
- **GPT-4o with Vision**: Used to analyze both typed and handwritten content in assignments
- **Image Enhancement**: Applied contrast and sharpness adjustments to improve handwriting recognition
- **JSON Response Format**: Structured API responses to ensure consistent data handling across the application

## Assumptions

- Users have access to an OpenAI API key with GPT-4o Vision capabilities
- PDF assignments are properly formatted and contain either typed or handwritten content
- The system is intended for educational use with a reasonable number of concurrent users
- Users have modern web browsers that support the latest JavaScript features
- Network connectivity is stable for API communication

## Sources

- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [PyMuPDF Documentation](https://pymupdf.readthedocs.io/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Vite Documentation](https://vitejs.dev/guide/)

## Demo Video

A 3-minute demonstration of the application features and how AI tools were used in development:

[Watch the Loom Video](https://www.loom.com/share/d2e7ac694a3c43d9b433aa9eb107997d?sid=7ec7ccf1-6213-4302-baa3-8011fb54ceea)

## Implementation Time

Total time spent on implementation: **10 hours** (excluding documentation and video creation)

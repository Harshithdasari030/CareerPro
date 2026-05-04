# CareerPro - ATS Resume Analyzer

A modern, AI-powered ATS (Applicant Tracking System) resume analyzer that helps job seekers optimize their resumes for better ATS compatibility and job matching.

##  Features

- **AI-Powered Analysis**: Uses Google's Generative AI to extract keywords from job descriptions
- **ATS Score Calculation**: Provides a percentage score based on keyword matching
- **Resume Optimization**: Highlights missing keywords in your resume
- **Real-time Feedback**: Instant analysis with visual progress indicators
- **Modern UI**: Sleek, professional interface with smooth animations
- **Responsive Design**: Works seamlessly across devices

##  Tech Stack

### Frontend
- **React** - UI framework
- **CSS3** - Styling with animations
- **JavaScript** - Client-side logic

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Google Generative AI** - AI-powered keyword extraction
- **CORS** - Cross-origin resource sharing

##  Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Gemini API key

##  Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Furquan0827/CareerPro-1.git
   cd CareerPro-1
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables:**
   Create a `.env` file in the `backend` directory:
   ```
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```

##  Running the Application

### Start the Backend Server

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Start the server:
   ```bash
   node index.js
   ```

   The backend will run on `http://localhost:5000`

### Start the Frontend Application

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Start the development server:
   ```bash
   npm start
   ```

   The frontend will run on `http://localhost:3000`

##  Usage

1. **Input Your Resume**: Paste your resume text in the "Resume Input" section
2. **Enter Job Description**: Paste the job description in the "Job Description" section
3. **Analyze**: Click the "Analyze JD" button
4. **Review Results**:
   - **Keywords**: Extracted keywords from the job description
   - **Missing Keywords**: Keywords not found in your resume (highlighted in red)
   - **ATS Score**: Overall compatibility score with animated progress ring
   - **Resume Preview**: Your resume with missing keywords highlighted

##  API Endpoints

### POST /analyze-jd
Analyzes a job description and resume for ATS compatibility.

**Request Body:**
```json
{
  "jd": "Job description text...",
  "resume": "Resume text..."
}
```

**Response:**
```json
{
  "keywords": ["keyword1", "keyword2", ...],
  "matched": ["matched1", "matched2", ...],
  "missing": ["missing1", "missing2", ...],
  "score": 75
}
```

### GET /
Health check endpoint.

##  UI Features

- **Glassmorphism Design**: Modern card-based layout with backdrop blur
- **Smooth Animations**: Fade-in effects, hover animations, and progress visualizations
- **Dark Theme**: Professional dark blue and purple color scheme
- **Interactive Elements**: Animated buttons, glowing textareas, and progress rings
- **Responsive Layout**: Two-column design that adapts to different screen sizes

##  Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

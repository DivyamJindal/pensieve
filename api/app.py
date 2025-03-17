from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
import os
import json
import re
from datetime import datetime
import base64
from typing import List, Optional
from dotenv import load_dotenv
from PIL import Image
import fitz  # PyMuPDF

# Load environment variables
load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Configure OpenAI
openai.api_key = os.getenv('OPENAI_API_KEY')

class Question(BaseModel):
    score: int
    maxScore: int
    explanation: str
    confidence: float
    suggestions: str

class GradeResponse(BaseModel):
    questions: List[Question]
    timestamp: str

class GradeRequest(BaseModel):
    pdfContent: str

@app.post("/api/grade", response_model=GradeResponse)
async def grade_assignment(request: GradeRequest):
    try:
        # Decode base64 PDF content
        try:
            import io
            if not request.pdfContent:
                raise ValueError("PDF content is empty")
            try:
                print('Received base64 content length:', len(request.pdfContent))
                pdf_bytes = base64.b64decode(request.pdfContent)
                print('Decoded PDF size:', len(pdf_bytes), 'bytes')
            except Exception as e:
                raise ValueError(f"Invalid base64 encoding: {str(e)}")
            try:
                # Open PDF with PyMuPDF
                pdf_document = fitz.open(stream=pdf_bytes, filetype="pdf")
                if pdf_document.page_count == 0:
                    raise ValueError("PDF file has no pages")
                
                # Process each page
                all_page_contents = []
                for page_num in range(pdf_document.page_count):
                    page = pdf_document[page_num]
                    
                    # Extract text
                    text = page.get_text()
                    
                    # Convert page to image with higher resolution for better handwriting recognition
                    pix = page.get_pixmap(matrix=fitz.Matrix(4, 4))  # 4x zoom for better resolution
                    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                    
                    # Enhance image contrast to improve text visibility
                    from PIL import ImageEnhance
                    enhancer = ImageEnhance.Contrast(img)
                    img = enhancer.enhance(1.5)  # Increase contrast by 50%
                    enhancer = ImageEnhance.Sharpness(img)
                    img = enhancer.enhance(1.5)  # Increase sharpness by 50%
                    
                    # Convert image to base64
                    img_byte_arr = io.BytesIO()
                    img.save(img_byte_arr, format='PNG')
                    img_byte_arr = img_byte_arr.getvalue()
                    img_base64 = base64.b64encode(img_byte_arr).decode('utf-8')
                    
                    all_page_contents.append({
                        "text": text,
                        "image": img_base64
                    })
                
                pdf_document.close()
            except Exception as e:
                raise ValueError(f"Failed to process PDF file: {str(e)}")
        except ValueError as e:
            print(f"PDF processing error: {str(e)}")
            raise HTTPException(status_code=400, detail=str(e))
        
        # Process each page with GPT-4-vision
        all_responses = []
        for page_content in all_page_contents:
            # GPT prompt for grading
            prompt = f"""You are an expert grader specializing in evaluating both handwritten and typed academic assignments. Your task is to analyze the provided assignment and grade each question.

IMPORTANT INSTRUCTIONS FOR HANDWRITTEN CONTENT:
- Look carefully at the handwritten content in the image
- Try to decipher even partially legible handwriting
- Focus on the mathematical steps and final answers
- Consider partial credit for correct approaches even if the final answer is wrong
- If you can see any work or answers, try to evaluate them rather than returning the default response

CRITICAL: You MUST respond with ONLY a valid JSON object. Any text outside the JSON object will cause a system error.

JSON Format Requirements:
1. Start with {{ and end with }}
2. Use double quotes (") for ALL strings - no single quotes
3. Escape quotes in text with \"
4. Use numbers without quotes for scores
5. No trailing commas
6. No comments or explanatory text
7. No line breaks or extra spaces
8. No markdown formatting

Required JSON Structure:
{{
    "questions": [
        {{
            "score": 8,
            "maxScore": 10,
            "explanation": "Clear explanation with \"quoted\" terms if needed",
            "confidence": 90,
            "suggestions": "Specific suggestions for improvement"
        }}
    ]
}}

Only if you absolutely cannot see or interpret ANY content in the image, return this exact JSON:
{{
    "questions": [
        {{
            "score": 0,
            "maxScore": 10,
            "explanation": "Unable to grade due to insufficient or unclear content",
            "confidence": 0,
            "suggestions": "Please provide clear, readable content for grading"
        }}
    ]
}}

PDF Content to grade:
{page_content['text']}

Respond with ONLY the JSON object. Any other text will cause errors."""
            messages = [
                {
                    "role": "system",
                    "content": "You are an expert grader specializing in evaluating both handwritten and typed academic assignments. You MUST ONLY output valid JSON objects. You must NEVER include any text, markdown, or explanations outside the JSON structure. Pay special attention to handwritten content - try to decipher even partially legible handwriting and evaluate mathematical steps and answers. Only return the default 'unable to grade' response if you absolutely cannot see or interpret ANY content in the image."
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": prompt
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/png;base64,{page_content['image']}"
                            }
                        }
                    ]
                }
            ]
            
            response = openai.ChatCompletion.create(
                model="gpt-4o",
                temperature=0.3,
                max_tokens=4096,
                messages=messages
            )
            all_responses.append(response)
        
        # Combine responses from all pages
        combined_questions = []
        for response in all_responses:
            content = response.choices[0].message.content
            print(f"Raw GPT response: {content}")
            
            # Clean the content by removing markdown code block indicators
            cleaned_content = content
            # Remove markdown code block indicators (```json and ```) if present
            cleaned_content = re.sub(r'^```json\s*', '', cleaned_content)
            cleaned_content = re.sub(r'\s*```$', '', cleaned_content)
            # Remove any other non-JSON content that might be present
            cleaned_content = cleaned_content.strip()
            
            try:
                gpt_response = json.loads(cleaned_content)
                
                if isinstance(gpt_response, dict) and 'questions' in gpt_response:
                    combined_questions.extend(gpt_response['questions'])
            except json.JSONDecodeError as e:
                print(f"Failed to parse cleaned content: {e}")
                print(f"Cleaned content was: {cleaned_content}")
                # Continue to next response instead of failing completely
                continue
        
        if not combined_questions:
            raise ValueError("No valid questions found in GPT responses")

        # Use the combined questions from all pages
        if not combined_questions:
            raise ValueError("No valid questions found in GPT responses")
            
        # Format the final response
        response_data = {
            "questions": combined_questions,
            "timestamp": datetime.now().isoformat()
        }
        
        return response_data
            
        for i, q in enumerate(questions):
            if not all(key in q for key in ['score', 'maxScore', 'explanation', 'confidence', 'suggestions']):
                raise ValueError(f"Question {i + 1} is missing required fields")
            q['criterion'] = f'Question {i + 1}'

        return GradeResponse(
            questions=questions,
            timestamp=datetime.now().isoformat()
        )

    except json.JSONDecodeError as e:
        print(f"JSON decode error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to parse GPT response: {str(e)}")
    except Exception as e:
        if 'openai' in str(type(e)).lower():
            print(f"OpenAI API error: {str(e)}")
            raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")
        raise
    except ValueError as e:
        print(f"Validation error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        print(f"Unexpected error: {type(e).__name__}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5002)
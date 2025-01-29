import pandas as pd
import numpy as np
from tensorflow.keras.models import load_model
from sklearn.preprocessing import StandardScaler

# Load saved model
model = load_model('career_prediction_model.h5')

# Career mapping (copy from previous script)
career_mapping = {
    'Accountant': 0,
    'Administrative Officer': 1,
    'Advertising Executive': 2,
    'Aerospace Engineer': 3,
    'Air Traffic Controller': 4,
    'Airline Pilot': 5,
    'Architect': 6,
    'Artist': 7,
    'Astronomer': 8,
    'Aviation Safety Inspector': 9,
    'Behaviour Therapist': 10,
    'Biologist': 11,
    'Biomedical Engineer': 12,
    'Biomedical Researcher': 13,
    'Biotechnologist': 14,
    'Chef': 15,
    'Chiropractor': 16,
    'Civil Engineer': 17,
    'Clinical Research Coordinator': 18,
    'Conservation Therapist': 19,
    'Construction Engineer': 20,
    'Corporate Communications Manager': 21,
    'Counsellor': 22,
    'Customs and Border Protection Officer': 23,
    'Data Analyst': 24,
    'Data Scientist': 25,
    'Database Administrator': 26,
    'Database Analyst': 27,
    'Dental Assistant': 28,
    'Dental Hygienist': 29,
    'Diplomat': 30,
    'Ecologist': 31,
    'Electrical Engineer': 32,
    'Electronics Design Engineer': 33,
    'Elementary School Teacher': 34,
    'Environmental Engineer': 35,
    'Environmental Scientist': 36,
    'Event Photographer': 37,
    'Event Planner': 38,
    'Family Therapist': 39,
    'Fashion Designer': 40,
    'Fashion Stylist': 41,
    'Film Director': 42,
    'Financial Advisor': 43,
    'Financial Analyst': 44,
    'Financial Auditor': 45,
    'Financial Planner': 46,
    'Flight Inspector': 47,
    'Foreign Service Officer': 48,
    'Forensic Psychologist': 49,
    'Forensic Scientist': 50,
    'Forestry Technician': 51,
    'Furniture Designer': 52,
    'Game Designer': 53,
    'Game Developer': 54,
    'Game Tester': 55,
    'Genetic Counselor': 56,
    'Geologist': 57,
    'Graphic Designer': 58,
    'HR Recruiter': 59,
    'Human Resources Manager': 60,
    'Human Rights Lawyer': 61,
    'Hydrologist': 62,
    'Industrial Designer': 63,
    'Industrial Engineer': 64,
    'Insurance Underwriter': 65,
    'Interior Designer': 66,
    'Investment Banker': 67,
    'IT Project Manager': 68,
    'IT Support Specialist': 69,
    'Journalist': 70,
    'Lawyer': 71,
    'Marine Biologist': 72,
    'Market Research Analyst': 73,
    'Market Researcher': 74,
    'Marketing Analyst': 75,
    'Marketing Coordinator': 76,
    'Marketing Copywriter': 77,
    'Marketing Manager': 78,
    'Marketing Researcher': 79,
    'Marriage Counselor': 80,
    'Mechanical Designer': 81,
    'Mechanical Engineer': 82,
    'Musician': 83,
    'Nurse': 84,
    'Occupational Therapist': 85,
    'Park Ranger': 86,
    'Pediatric Doctor': 87,
    'Pediatric Nurse': 88,
    'Pediatrician': 89,
    'Pharmacist': 90,
    'Physical Therapist': 91,
    'Physician': 92,
    'Police Detective': 93,
    'Police Officer': 94,
    'Product Manager': 95,
    'Psychologist': 96,
    'Public Health Analyst': 97,
    'Public Relations Manager': 98,
    'Public Relations Specialist': 99,
    'Quality Control Inspector': 100,
    'Radiologic Technologist': 101,
    'Real Estate Agent': 102,
    'Rehabilitation Counselor': 103,
    'Research Scientist': 104,
    'Robotics Engineer': 105,
    'Salesperson': 106,
    'Social Media Manager': 107,
    'Social Worker': 108,
    'Software Developer': 109,
    'Software Quality Assurance Tester': 110,
    'Special Needs Education Teacher': 111,
    'Speech Pathologist': 112,
    'Speech Therapist': 113,
    'Sports Coach': 114,
    'Sustainability Consultant': 115,
    'Tax Accountant': 116,
    'Tax Collector': 117,
    'Teacher': 118,
    'Technical Project Manager': 119,
    'Technical Writer': 120,
    'Transportation Planner': 121,
    'UI/UX Designer': 122,
    'Urban Planner': 123,
    'Video Game Tester': 124,
    'Web Developer': 125,
    'Wildlife Biologist': 126,
    'Wildlife Conservationist': 127,
    'Zoologist': 128
}

# Function to predict career
def predict_career(input_data):
    # Columns to scale (must match training data)
    columns_to_scale = [
        'O_score', 'C_score', 'E_score', 'A_score', 'N_score', 
        'Numerical_Aptitude', 'Spatial_Aptitude', 'Perceptual_Aptitude', 
        'Abstract_Reasoning', 'Verbal_Reasoning'
    ]
    
    # Load pre-fitted scaler
    scaler = StandardScaler()
    
    # Prepare input data
    input_df = pd.DataFrame([input_data])
    # print(input_df)
    input_df[columns_to_scale] = scaler.fit_transform(input_df[columns_to_scale])
    input_df[['O_score','C_score','E_score','A_score','N_score','Numerical_Aptitude', 'Spatial_Aptitude', 'Perceptual_Aptitude','Abstract_Reasoning','Verbal_Reasoning']] = scaler.fit_transform(input_df[['O_score','C_score','E_score','A_score','N_score','Numerical_Aptitude', 'Spatial_Aptitude', 'Perceptual_Aptitude','Abstract_Reasoning','Verbal_Reasoning']])
    # Make prediction
    prediction = model.predict(input_df)
    predicted_career_index = np.argmax(prediction)
    
    # Map index back to career name
    reverse_mapping = {v: k for k, v in career_mapping.items()}
    return reverse_mapping[predicted_career_index]

# Example usage
def main():
    # Sample input data
    sample_input = {
    'O_score': 7.45,
    'C_score': 8.67,
    'E_score': 9.45,
    'A_score': 6.34,
    'N_score': 4.89,
    'Numerical_Aptitude': 5.5, 
    'Spatial_Aptitude': 6.0, 
    'Perceptual_Aptitude': 8.5,
    'Abstract_Reasoning': 7.5,
    'Verbal_Reasoning': 9.3
    }
    
    career = predict_career(sample_input)
    print(f"Predicted Career: {career}")

if __name__ == "__main__":
    main()
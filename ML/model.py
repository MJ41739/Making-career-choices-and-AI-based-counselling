import pandas as pd
import numpy as np
import seaborn as sns
from sklearn.metrics import confusion_matrix, classification_report
from sklearn.preprocessing import StandardScaler
from sklearn.preprocessing import OneHotEncoder
from sklearn.model_selection import train_test_split
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from tensorflow.keras.models import load_model
import matplotlib.pyplot as plt



# Load the dataset from CSV
df = pd.read_csv("Data_final.csv")

# View the first few rows of the dataset
print(df.head())
# Check for missing values
print(df.isnull().sum())


# Drop rows with missing values (optional)
df = df.dropna()

# Initialize scaler
scaler = StandardScaler()

columns_to_scale = ['O_score','C_score','E_score','A_score','N_score','Numerical_Aptitude', 'Spatial_Aptitude', 'Perceptual_Aptitude',
                    'Abstract_Reasoning', 'Verbal_Reasoning']

# Apply the scaler only on the existing columns
df[columns_to_scale] = scaler.fit_transform(df[columns_to_scale])

# Normalize score columns
df[['O_score','C_score','E_score','A_score','N_score','Numerical_Aptitude', 'Spatial_Aptitude', 'Perceptual_Aptitude','Abstract_Reasoning','Verbal_Reasoning']] = scaler.fit_transform(df[['O_score','C_score','E_score','A_score','N_score','Numerical_Aptitude', 'Spatial_Aptitude', 'Perceptual_Aptitude','Abstract_Reasoning','Verbal_Reasoning']])

print(df)
df[['O_score','C_score','E_score','A_score','N_score','Numerical_Aptitude', 'Spatial_Aptitude', 'Perceptual_Aptitude','Abstract_Reasoning','Verbal_Reasoning']] = scaler.fit_transform(df[['O_score','C_score','E_score','A_score','N_score','Numerical_Aptitude', 'Spatial_Aptitude', 'Perceptual_Aptitude','Abstract_Reasoning','Verbal_Reasoning']])

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
df['Career'] = df['Career'].map(career_mapping)

df['Career'], career_labels = pd.factorize(df['Career'])

# Check for any NaN values after factorization
if df['Career'].isna().sum() > 0:
    print("NaN values remain in 'Career'. Investigate source data for inconsistencies.")
else:
    print("No NaN values found in 'Career' after factorization.")

# Ensure 'Career' is integer type for one-hot encoding
df['Career'] = df['Career'].astype(int)

# Attempt one-hot encoding
try:
    # Use to_categorical if possible
    y = to_categorical(df['Career'])
except IndexError as e:
    print("Error using to_categorical:", e)
    print("Switching to pd.get_dummies for one-hot encoding.")
    # Alternative: Use pd.get_dummies as fallback
    y = pd.get_dummies(df['Career']).values

# Display the first few rows of the encoded output
print("One-hot encoded output (first 5 rows):\n", y[:5])
print("Career Labels:", career_labels)


# Define features (X) and labels (y)
X = df.drop('Career', axis=1)
y = to_categorical(df['Career'])  # Convert labels to one-hot encoded vectors

# Split into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Print data splitting information
print(f"Total number of samples: {len(X)}")
print(f"Training samples: {len(X_train)} ({len(X_train)/len(X)*100:.2f}%)")
print(f"Testing samples: {len(X_test)} ({len(X_test)/len(X)*100:.2f}%)")

# Build the neural network model
model = Sequential([
    Dense(128, input_shape=(X_train.shape[1],), activation='relu'),
    Dense(64, activation='relu'),
    Dense(32, activation='relu'),
    Dense(16, activation='relu'),
    Dense(y_train.shape[1], activation='softmax')  # Output layer with softmax for multi-class classification
])

# Compile the model
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# Train the model
history = model.fit(X_train, y_train, epochs=50, batch_size=32, validation_split=0.01)

test_loss, test_accuracy = model.evaluate(X_test, y_test)
print(f"Test accuracy: {test_accuracy:.2f}")

# Plot validation accuracy
plt.figure(figsize=(10,5))
plt.plot(history.history['accuracy'], label='Training Accuracy')
plt.plot(history.history['val_accuracy'], label='Validation Accuracy')
plt.title('Model Accuracy')
plt.xlabel('Epoch')
plt.ylabel('Accuracy')
plt.legend()
plt.show()

# Predict and generate confusion matrix
y_pred = model.predict(X_test)
y_pred_classes = np.argmax(y_pred, axis=1)
y_true_classes = np.argmax(y_test, axis=1)

# Generate confusion matrix
cm = confusion_matrix(y_true_classes, y_pred_classes)

# Plot confusion matrix
plt.figure(figsize=(10,15))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
plt.title('Confusion Matrix')
plt.xlabel('Predicted Label')
plt.ylabel('True Label')
plt.show()

# Replace the classification report line with:
# Get unique classes that actually appear in predictions
# Before printing classification report, ensure career_labels is a list of strings
try:
    unique_classes = np.unique(np.concatenate([y_true_classes, y_pred_classes]))
    
    # Convert career_labels to list of strings if it's not already
    if not isinstance(career_labels, list):
        career_labels = career_labels.tolist()
    
    # Ensure target_names are strings and match the number of unique classes
    unique_target_names = [str(career_labels[cls]) for cls in unique_classes]
    
    print("\nClassification Report:")
    print(classification_report(
        y_true_classes, 
        y_pred_classes, 
        labels=unique_classes,
        target_names=unique_target_names
    ))
except Exception as e:
    print(f"Error generating classification report: {e}")
    # Fallback: print basic accuracy if classification report fails
    print(f"Prediction Accuracy: {test_accuracy:.2f}")

# Save the model
model.save('career_prediction_model.h5')
print("Model saved as career_prediction_model.h5")

# # Example of loading and using the saved model
# loaded_model = load_model('career_prediction_model.h5')

# # Example of new data prediction (using previous new_data preparation)
# prediction = loaded_model.predict(new_data)
# predicted_career = list(career_mapping.keys())[np.argmax(prediction)]
# print(f"Predicted Career Path: {predicted_career}")

# # Example of new data input
# new_data = pd.DataFrame({
#     'O_score': [7.45],
#     'C_score': [8.67],
#     'E_score': [9.45],
#     'A_score': [6.34],
#     'N_score': [4.89],
#     'Numerical_Aptitude': [5.5], 
#     'Spatial_Aptitude': [6.0], 
#     'Perceptual_Aptitude': [8.5],
#     'Abstract_Reasoning': [7.5],
#     'Verbal_Reasoning': [9.3]
    
# })


# one_hot_encoder = OneHotEncoder()

# # Convert encoded data to DataFrame and merge into new_data
# expected_columns = ['O_score','C_score','E_score','A_score','N_score','Numerical_Aptitude', 'Spatial_Aptitude', 'Perceptual_Aptitude', 
#                     'Abstract_Reasoning', 'Verbal_Reasoning'] 
# missing_columns = set(expected_columns) - set(new_data.columns)
# if missing_columns:
#     print(f"Missing columns in new_data: {missing_columns}")
# else:
#     print("All expected columns are present in new_data.")

# # Scale the numerical columns in new_data
# new_data[expected_columns] = scaler.transform(new_data[expected_columns])
# # Confirm `new_data` has the expected columns
# print("Columns in new_data after one-hot encoding:\n", new_data.columns)

# # Scale the numerical features
# columns_to_scale = ['O_score','C_score','E_score','A_score','N_score','Numerical_Aptitude', 'Spatial_Aptitude', 'Perceptual_Aptitude', 
#                     'Abstract_Reasoning', 'Verbal_Reasoning'] 
# new_data[columns_to_scale] = scaler.transform(new_data[columns_to_scale])

# # Predict career path
# print(new_data)
# prediction = model.predict(new_data)
# predicted_career = list(career_mapping.keys())[np.argmax(prediction)]
# print(f"Predicted Career Path: {predicted_career}")

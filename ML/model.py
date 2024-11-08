import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from tensorflow.keras.utils import to_categorical

# Step 1: Synthetic Dataset
# Let's assume each row represents a student with scores in Math, Science, English, and a Qualification
data = {
    'math_score': np.random.randint(50, 100, 1000),
    'science_score': np.random.randint(50, 100, 1000),
    'english_score': np.random.randint(50, 100, 1000),
    'qualification': np.random.choice(['SSC', 'HSC', 'Graduate'], 1000),
    'career_path': np.random.choice(['Engineer', 'Doctor', 'Artist', 'Scientist'], 1000)
}

df = pd.DataFrame(data)

# Step 2: Feature Engineering
# 2.1 Normalize Scores (Math, Science, English)
scaler = StandardScaler()
df[['math_score', 'science_score', 'english_score']] = scaler.fit_transform(df[['math_score', 'science_score', 'english_score']])

# 2.2 One-Hot Encode Qualifications
qualification_encoder = OneHotEncoder(sparse_output=False)
qualifications_encoded = qualification_encoder.fit_transform(df[['qualification']])
qualifications_df = pd.DataFrame(qualifications_encoded, columns=qualification_encoder.get_feature_names_out(['qualification']))

# 2.3 Merge the processed features back
df = pd.concat([df, qualifications_df], axis=1)
df.drop('qualification', axis=1, inplace=True)

# Step 3: Map career_path to numeric labels
career_mapping = {'Engineer': 0, 'Doctor': 1, 'Artist': 2, 'Scientist': 3}
df['career_path'] = df['career_path'].map(career_mapping)

# Step 4: Split dataset into features (X) and labels (y)
X = df.drop('career_path', axis=1)
y = to_categorical(df['career_path'])  # Convert labels to one-hot encoded vectors

# Split into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Step 5: Build the Neural Network Model
model = Sequential([
    Dense(64, input_shape=(X_train.shape[1],), activation='relu'),
    Dense(32, activation='relu'),
    Dense(16, activation='relu'),
    Dense(y_train.shape[1], activation='softmax')  # Output layer with softmax for multi-class classification
])

# Step 6: Compile the Model
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# Step 7: Train the Model
model.fit(X_train, y_train, epochs=50, batch_size=16, validation_split=0.2)

# Step 8: Evaluate the Model
test_loss, test_accuracy = model.evaluate(X_test, y_test)
print(f"Test accuracy: {test_accuracy:.2f}")

# Step 9: Predict Career Path for New Data
new_data = np.array([[85, 90, 75, 0, 1, 0]])  # Example new data with normalized scores and encoded qualification (HSC)
prediction = model.predict(new_data)
predicted_career = list(career_mapping.keys())[np.argmax(prediction)]
print(f"Predicted Career Path: {predicted_career}")

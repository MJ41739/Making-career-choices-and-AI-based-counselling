import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.preprocessing import OneHotEncoder
from sklearn.model_selection import train_test_split
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense


# Load the dataset from CSV
df = pd.read_csv("Data_final.csv")

# print(df['Career'].apply(lambda x: type(x)).value_counts())
# View the first few rows of the dataset
print(df.head())
# Check for missing values
print(df.isnull().sum())


# Drop rows with missing values (optional)
df = df.dropna()

# Drop any unnecessary columns if they exist
# df = df.drop(['O_score','C_score','E_score','A_score','N_score'], axis=1)

data = {
    'qualification': np.random.choice(['SSC', 'HSC', 'Graduate'], 1000),
    # 'career_path': np.random.choice(['Engineer', 'Doctor', 'Artist', 'Scientist'], 1000)
}
df1 = pd.DataFrame(data)
# Example: Create the 'qualification' column by combining others
# df1['qualification'] = df1['qualification_Graduate'] + ' ' + df1['qualification_HSC'] + ' ' + df1['qualification_SSC']
# Concatenate encoded qualifications back to the DataFrame
qualification_encoder = OneHotEncoder(sparse_output=False)
qualifications_encoded = qualification_encoder.fit_transform(df1[['qualification']])
qualifications_df = pd.DataFrame(qualifications_encoded, columns=qualification_encoder.get_feature_names_out(['qualification']))



df = pd.concat([df, qualifications_df], axis=1)
# Initialize scaler
scaler = StandardScaler()

columns_to_scale = ['Numerical_Aptitude', 'Spatial_Aptitude', 'Perceptual_Aptitude',
                    'Abstract_Reasoning', 'Verbal_Reasoning',
                    'qualification_Graduate', 'qualification_HSC', 'qualification_SSC']

# Apply the scaler only on the existing columns
df[columns_to_scale] = scaler.fit_transform(df[columns_to_scale])

# Normalize score columns
df[['Numerical_Aptitude', 'Spatial_Aptitude', 'Perceptual_Aptitude','Abstract_Reasoning','Verbal_Reasoning']] = scaler.fit_transform(df[['Numerical_Aptitude', 'Spatial_Aptitude', 'Perceptual_Aptitude','Abstract_Reasoning','Verbal_Reasoning']])

# # One-hot encode the 'qualification' column
# qualification_encoder = OneHotEncoder(sparse_output=False)
# qualifications_encoded = qualification_encoder.fit_transform(df1[['qualification']])
# qualifications_df = pd.DataFrame(qualifications_encoded, columns=qualification_encoder.get_feature_names_out(['qualification']))


# df.drop('qualification', axis=1, inplace=True)
print(df)
df[['Numerical_Aptitude', 'Spatial_Aptitude', 'Perceptual_Aptitude','Abstract_Reasoning','Verbal_Reasoning','qualification_Graduate', 'qualification_HSC', 'qualification_SSC']] = scaler.fit_transform(df[['Numerical_Aptitude', 'Spatial_Aptitude', 'Perceptual_Aptitude','Abstract_Reasoning','Verbal_Reasoning','qualification_Graduate', 'qualification_HSC', 'qualification_SSC']])

career_mapping = {'Engineer': 0, 'Doctor': 1, 'Artist': 2, 'Scientist': 3}
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
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)


# Build the neural network model
model = Sequential([
    Dense(64, input_shape=(X_train.shape[1],), activation='relu'),
    Dense(32, activation='relu'),
    Dense(16, activation='relu'),
    Dense(y_train.shape[1], activation='softmax')  # Output layer with softmax for multi-class classification
])

# Compile the model
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# Train the model
model.fit(X_train, y_train, epochs=50, batch_size=16, validation_split=0.2)

test_loss, test_accuracy = model.evaluate(X_test, y_test)
print(f"Test accuracy: {test_accuracy:.2f}")

# Example of new data input
new_data = pd.DataFrame({
    # 'math_score': [85],
    # 'science_score': [90],
    # 'english_score': [75],
    'qualification_SSC': [0],
    'qualification_HSC': [1],
    'qualification_Graduate': [0],
    'Numerical_Aptitude': [85], 
    'Spatial_Aptitude': [90], 
    'Perceptual_Aptitude': [75],
    'Abstract_Reasoning': [65],
    'Verbal_Reasoning': [73],
    # 'qualification': ['Graduate']
})

# print(new_data.columns)

# Normalize new data using the same scaler
# new_data[['Numerical_Aptitude', 'Spatial_Aptitude', 'Perceptual_Aptitude','Abstract_Reasoning','Verbal_Reasoning','qualification_Graduate', 'qualification_HSC', 'qualification_SSC']] = scaler.transform(new_data[['Numerical_Aptitude', 'Spatial_Aptitude', 'Perceptual_Aptitude','Abstract_Reasoning','Verbal_Reasoning','qualification']])
# new_data[columns_to_scale] = scaler.transform(new_data[columns_to_scale])
one_hot_encoder = OneHotEncoder()
one_hot_encoder.fit(df1[['qualification_SSC', 'qualification_HSC', 'qualification_Graduate']])
new_qualification_encoded = one_hot_encoder.transform(new_data[['qualification_SSC', 'qualification_HSC', 'qualification_Graduate']])
qualification_columns = one_hot_encoder.get_feature_names_out(['qualification'])

# Convert encoded data to DataFrame and merge into `new_data`
new_qualification_df = pd.DataFrame(new_qualification_encoded.toarray(), columns=qualification_columns, index=new_data.index)
new_data = pd.concat([new_data.drop(columns=['qualification']), new_qualification_df], axis=1)
expected_columns = ['Numerical_Aptitude', 'Spatial_Aptitude', 'Perceptual_Aptitude', 
                    'Abstract_Reasoning', 'Verbal_Reasoning'] + list(qualification_columns)
missing_columns = set(expected_columns) - set(new_data.columns)
if missing_columns:
    print(f"Missing columns in new_data: {missing_columns}")
else:
    print("All expected columns are present in new_data.")

# Step 4: Scale the numerical columns in new_data
new_data[expected_columns] = scaler.transform(new_data[expected_columns])
# Confirm `new_data` has the expected columns
print("Columns in new_data after one-hot encoding:\n", new_data.columns)

# Scale the numerical features
columns_to_scale = ['Numerical_Aptitude', 'Spatial_Aptitude', 'Perceptual_Aptitude', 
                    'Abstract_Reasoning', 'Verbal_Reasoning'] + list(qualification_columns)
new_data[columns_to_scale] = scaler.transform(new_data[columns_to_scale])

# Predict career path
prediction = model.predict(new_data)
predicted_career = list(career_mapping.keys())[np.argmax(prediction)]
print(f"Predicted Career Path: {predicted_career}")

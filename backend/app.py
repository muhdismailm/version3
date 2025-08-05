from flask import Flask, request, jsonify
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

app = Flask(__name__)  # ✅ corrected

# Initialize NLP tools
lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))

@app.route('/process', methods=['POST'])
 
def home():
    return "Flask API is running!"

def process_text():
    data = request.get_json()
    input_text = data.get("text", "")

    # 1. Lowercase the text
    input_text = input_text.lower()

    # 2. Tokenize
    tokens = word_tokenize(input_text)

    # 3. Remove stopwords
    filtered_tokens = [word for word in tokens if word.isalpha() and word not in stop_words]

    # 4. Lemmatize
    lemmatized_tokens = [lemmatizer.lemmatize(word) for word in filtered_tokens]

    return jsonify({
        "lemmatized_tokens": lemmatized_tokens
    })

if __name__ == '__main__':  # ✅ corrected
    app.run(debug=True)

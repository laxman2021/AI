from google import genai
API_KEY = "";
client = genai.Client(api_key=API_KEY)

while True:
    user = input("You: ")
    if user.lower() == "exit":
        break

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=user
    )

    print("Bot:", response.text)